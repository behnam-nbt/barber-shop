import connectDB from "@/utils/connectDB";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Product from "@/models/Product";

export async function POST(req) {
    await connectDB();
    try {
        const data = await req.formData();
        const title = data.get("title");
        const slug = data.get("slug");
        const price = data.get("price");
        const quantity = data.get("quantity");
        const description = data.get("description");
        const tags = data.get("tags");
        const image = data.get("image");

        // Check if all required fields are provided
        if (!title || !description || !image || !price || !quantity || !description || !tags) {
            return NextResponse.json(
                { error: "تمام فیلد ها را پر کنید" },
                { status: 400 }
            );
        }

        const tagsArray = tags ? tags.split(",").map(tag => tag.trim()) : [];

        if (image && image.size > 0) {
            // Generate a unique filename to avoid conflicts
            const imageName = `${image.name}`;
            const imagePath = path.join(process.cwd(), 'public', 'images', imageName);

            // Write the file to the public/images/ directory
            const buffer = await image.arrayBuffer();
            const bufferData = Buffer.from(buffer);
            fs.writeFileSync(imagePath, bufferData);

            // Save the relative path to MongoDB (e.g., /images/imageName)
            const product = new Product({
                title,
                slug,
                price,
                quantity,
                description,
                tags: tagsArray,
                image: `/images/${imageName}` // Save the relative path
            });

            await product.save();
            console.log("Saved Product:", product);

            return NextResponse.json(
                { message: "محصول با موفقیت اضافه شد:", product },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { error: "فایل تصویر معتبر نیست." },
                { status: 400 }
            );
        }

    } catch (error) {
        console.error("خطا در ایجاد محصول:", error.message);
        return NextResponse.json(
            { error: "خطای سرور" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await connectDB();
        const products = await Product.find();
        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}