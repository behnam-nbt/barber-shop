import Product from "@/models/Product";
import connectDB from "@/utils/connectDB";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function PUT(req, { params }) {
    await connectDB();

    try {
        const { productId } = params;
        const data = await req.formData();
        const title = data.get("title");
        const slug = data.get("slug");
        const price = data.get("price");
        const quantity = data.get("quantity");
        const description = data.get("description");
        const tags = data.get("tags");
        const image = data.get("image");

        if (!productId) {
            return NextResponse.json(
                { error: "آیدی محصول الزامی است." },
                { status: 400 }
            );
        }

        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            return NextResponse.json(
                { error: "محصول با این آیدی پیدا نشد." },
                { status: 404 }
            );
        }

        // Process new image if provided
        let imagePath = existingProduct.image;
        if (image && image.size > 0) {
            const imageName = `${Date.now()}-${image.name}`;
            const newImagePath = path.join(process.cwd(), "public", "images", imageName);

            const buffer = await image.arrayBuffer();
            const bufferData = Buffer.from(buffer);
            fs.writeFileSync(newImagePath, bufferData);

            // Delete old image (optional)
            if (existingProduct.image && existingProduct.image.startsWith("/images/")) {
                const oldImagePath = path.join(process.cwd(), "public", existingProduct.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            imagePath = `/images/${imageName}`;
        }

        // Parse tags
        const parsedTags = tags ? tags.split(",").map(tag => tag.trim()) : existingProduct.tags;

        // Update product
        existingProduct.title = title || existingProduct.title;
        existingProduct.slug = slug || existingProduct.slug;
        existingProduct.price = price || existingProduct.price;
        existingProduct.quantity = quantity || existingProduct.quantity;
        existingProduct.description = description || existingProduct.description;
        existingProduct.tags = parsedTags;
        existingProduct.image = imagePath;

        await existingProduct.save();

        return NextResponse.json(
            { message: "محصول با موفقیت بروزرسانی شد", product: existingProduct },
            { status: 200 }
        );
    } catch (error) {
        console.error("خطا در بروزرسانی محصول:", error.message);
        return NextResponse.json(
            { error: "خطای سرور" },
            { status: 500 }
        );
    }
}
