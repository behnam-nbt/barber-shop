import Barber from "@/models/Barbers";
import Blog from "@/models/Blogs";
import Category from "@/models/Category";
import Product from "@/models/Product";
import Service from "@/models/Service";
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

export const fetchBarbers = async () => {
    await connectDB();

    try {
        const barbers = await Barber.find();
        return JSON.parse(JSON.stringify(barbers))
    } catch (error) {
        throw new Error(error.message || "خطای در دریافت لیست آرایشگرها!");
    }
}

export const fetchProducts = async () => {
    await connectDB();

    try {
        const product = await Product.find();
        return JSON.parse(JSON.stringify(product))
    } catch (error) {
        throw new Error(error.message || "خطای در دریافت لیست محصولات!");
    }
}

export const fetchCategories = async () => {
    await connectDB();

    try {
        const category = await Category.find();
        return JSON.parse(JSON.stringify(category))
    } catch (error) {
        throw new Error(error.message || "خطای در دریافت لیست دسته بندی ها!");
    }
}