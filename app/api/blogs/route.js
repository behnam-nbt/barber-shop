import connectDB from "@/utils/connectDB";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Blog from "@/models/Blogs";

export async function POST(req) {
    await connectDB();
    try {
        const data = await req.formData();
        const title = data.get("title");
        const slug = data.get("slug");
        const author = data.get("author");
        const time = data.get("time");
        const description = data.get("description");
        const tags = data.get("tags");
        const image = data.get("image");

        // Check if all required fields are provided
        if (!title || !description || !image) {
            return NextResponse.json(
                { error: "تمام فیلد ها را پر کنید" },
                { status: 400 }
            );
        }

        const tagsArray = tags ? tags.split(",").map(tag => tag.trim()) : [];

        // Ensure the image is a file
        if (image && image.size > 0) {
            // Generate a unique filename to avoid conflicts
            const imageName = `${image.name}`;
            const imagePath = path.join(process.cwd(), 'public', 'images', imageName);

            // Write the file to the public/images/ directory
            const buffer = await image.arrayBuffer();
            const bufferData = Buffer.from(buffer);
            fs.writeFileSync(imagePath, bufferData);

            // Save the relative path to MongoDB (e.g., /images/imageName)
            const blog = new Blog({
                title,
                slug,
                author,
                time,
                description,
                tags: tagsArray,
                image: `/images/${imageName}` // Save the relative path
            });

            await blog.save();

            return NextResponse.json(
                { message: "بلاگ با موفقیت اضافه شد:", blog },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { error: "فایل تصویر معتبر نیست." },
                { status: 400 }
            );
        }

    } catch (error) {
        console.error("خطا در ایجاد بلاگ:", error.message);
        return NextResponse.json(
            { error: "خطای سرور" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await connectDB();
        const blogs = await Blog.find();
        return NextResponse.json(blogs, { status: 200 });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}