import Blog from "@/models/Blogs";
import connectDB from "@/utils/connectDB";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function PUT(req, { params }) {
    await connectDB();

    try {
        const { blogId } = params;
        const data = await req.formData();
        const title = data.get("title");
        const slug = data.get("slug");
        const author = data.get("author");
        const time = data.get("time");
        const description = data.get("description");
        const tags = data.get("tags");
        const image = data.get("image");

        if (!blogId) {
            return NextResponse.json(
                { error: "آیدی پست الزامی است." },
                { status: 400 }
            );
        }

        const existingBlog = await Blog.findById(blogId);
        if (!existingBlog) {
            return NextResponse.json(
                { error: "پست با این آیدی پیدا نشد." },
                { status: 404 }
            );
        }

        // Process new image if provided
        let imagePath = existingBlog.image;
        if (image && image.size > 0) {
            const imageName = `${Date.now()}-${image.name}`;
            const newImagePath = path.join(process.cwd(), "public", "images", imageName);

            const buffer = await image.arrayBuffer();
            const bufferData = Buffer.from(buffer);
            fs.writeFileSync(newImagePath, bufferData);

            // Delete old image (optional)
            if (existingBlog.image && existingBlog.image.startsWith("/images/")) {
                const oldImagePath = path.join(process.cwd(), "public", existingBlog.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            imagePath = `/images/${imageName}`;
        }

        // Parse tags
        const parsedTags = tags ? tags.split(",").map(tag => tag.trim()) : existingBlog.tags;

        // Update blog post
        existingBlog.title = title || existingBlog.title;
        existingBlog.slug = slug || existingBlog.slug;
        existingBlog.author = author || existingBlog.author;
        existingBlog.time = time || existingBlog.time;
        existingBlog.description = description || existingBlog.description;
        existingBlog.tags = parsedTags;
        existingBlog.image = imagePath;

        await existingBlog.save();

        return NextResponse.json(
            { message: "پست با موفقیت بروزرسانی شد", blog: existingBlog },
            { status: 200 }
        );
    } catch (error) {
        console.error("خطا در بروزرسانی پست:", error.message);
        return NextResponse.json(
            { error: "خطای سرور" },
            { status: 500 }
        );
    }
}
