import Layout from '@/components/layout/Layout'
import BlogDetailsPage from '@/components/template/BlogDetailsPage';
import { fetchBlogBySlug, fetchBlogs } from '@/services/fetchData';
import React from 'react'

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
    try {
        const blogs = await fetchBlogs();
        if (!Array.isArray(blogs)) {
            throw new Error("خطا در دریافت بلاگ!");
        }
        return blogs.map((blog) => ({
            slug: blog.slug
        }))
    } catch (error) {
        console.error("خطا در دریافت بلاگ!", error);
    }
}

async function BlogDetails({ params }) {
    const { slug } = await params;
    const blog = await fetchBlogBySlug(slug);
    const blogs = await fetchBlogs();
    return (
        <Layout>
            <BlogDetailsPage blog={blog} blogs={blogs} />
        </Layout>
    )
}

export default BlogDetails