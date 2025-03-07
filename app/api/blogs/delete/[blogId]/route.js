import Blog from "@/models/Blogs";
import connectDB from "@/utils/connectDB";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
    await connectDB();

    try {
        const { blogId } = await params;

        if (!blogId) {
            return NextResponse.json(
                { status: "failed", message: "Blog ID is required!" },
                { status: 400 }
            );
        }

        const deletedBlog = await Blog.findByIdAndDelete(blogId);

        if (!deletedBlog) {
            return NextResponse.json(
                { status: "failed", message: "Blog not found!" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { status: "success", message: "Blog deleted successfully!" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in delete process:", error);
        return NextResponse.json(
            { status: "failed", message: "Error in deleting Blog!" },
            { status: 500 }
        );
    }
}
