import Barber from "@/models/Barbers";
import Blog from "@/models/Blogs";
import Cart from "@/models/Cart";
import Category from "@/models/Category";
import Product from "@/models/Product";
import connectDB from "@/utils/connectDB"
import { BASE_URL } from "@/utils/constants";

export const fetchBlogs = async () => {
    await connectDB();
    const blogs = await Blog.find();
    return JSON.parse(JSON.stringify(blogs));
};

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

export const fetchCart = async () => {
    await connectDB();

    try {
        const cart = await Cart.find();
        return JSON.parse(JSON.stringify(cart))
    } catch (error) {
        throw new Error(error.message || "خطای در دریافت لیست سبد خرید!");
    }
}

export const fetchProductBySlug = async (slug) => {
    try {
        const response = await fetch(`${BASE_URL}/api/products/${slug}`);
        if (!response.ok) {
            const errorDetails = await response.text();
            throw new Error(`Failed to fetch product. Status: ${response.status}, Details: ${errorDetails}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching product by slug:", error);
        return null;
    }
};

export const fetchBlogBySlug = async (slug) => {
    try {
        const response = await fetch(`${BASE_URL}/api/blogs/${slug}`);
        if (!response.ok) {
            const errorDetails = await response.text();
            throw new Error(`Failed to fetch Blog. Status: ${response.status}, Details: ${errorDetails}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching Blog by slug:", error);
        return null;
    }
};