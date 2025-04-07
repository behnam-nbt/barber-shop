import Blog from "@/models/Blogs";
import connectDB from "@/utils/connectDB";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    await connectDB();

    try {
        const { slug } = params;

        if (!slug) {
            return NextResponse.json(
                { error: "Product ID is required" },
                { status: 400 }
            );
        }

        // Fetch category by decoded slug
        const blog = await Blog.findOne({ slug });

        if (!blog) {
            return NextResponse.json(
                { error: "blog not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(blog, { status: 200 });
    } catch (error) {
        console.error("Error fetching blog:", error);
        return NextResponse.json(
            { error: "Failed to fetch blog" },
            { status: 500 }
        );
    }
}