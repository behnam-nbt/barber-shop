import Blog from "@/models/Blogs";
import connectDB from "@/utils/connectDB";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
    await connectDB();

    try {
        const { blogId } = await params;
        const data = await req.formData();
        const id = blogId;
        const title = data.get("title");
        const slug = data.get("slug");
        const author = data.get("author");
        const time = data.get("time");
        const description = data.get("description");
        const tags = data.get("tags");
        const image = data.get("image");

        if (!id) {
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

        // Process the image only if a new one is provided
        let imagePath = existingBlog.image;
        if (image && image.size > 0) {
            const imageName = `${image.name}`;
            const buffer = await image.arrayBuffer();
            const bufferData = Buffer.from(buffer);

            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: imageName,
                Body: bufferData,
            };

            await s3.upload(params).promise();

            imagePath = `https://${process.env.BUCKET_ENDPOINT}/${process.env.BUCKET_NAME}/${imageName}`;
        }

        let parsedTags = existingBlog.tags || []; // Default to existing tags
        if (tags) {
            parsedTags = tags.split(",").map(tag => tag.trim()); // Assuming tags are comma-separated
        }

        // Update blog fields
        existingBlog.title = title || existingBlog.title;
        existingBlog.slug = slug || existingBlog.slug;
        existingBlog.author = author || existingBlog.author;
        existingBlog.time = time || existingBlog.time;
        existingBlog.description = description || existingBlog.description;
        existingBlog.tags = parsedTags;
        existingBlog.image = imagePath;

        // Save the updated blog
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
