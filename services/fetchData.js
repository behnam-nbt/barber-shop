import Blog from "@/models/Blogs";
import connectDB from "@/utils/connectDB"

export const fetchBlogs = async () => {
    await connectDB();
    try {
        const blogs = await Blog.find();
        return JSON.parse(JSON.stringify(blogs));
    } catch (error) {
        throw new Error(error.message || "خطای در دریافت بلاگ!");
    }
}