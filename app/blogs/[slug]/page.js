import Layout from '@/components/layout/Layout'
import BlogDetailsPage from '@/components/template/BlogDetailsPage';
import { fetchBlogBySlug, fetchBlogs } from '@/services/fetchData';
import React from 'react'

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
    try {
        const blogs = await fetchBlogs();
        if (!Array.isArray(blogs)) {
            throw new Error("Invalid response from fetchBlogs()")
        }

        return blogs.map((blog) => ({
            slug: blog.slug,
        }))
    } catch (error) {
        console.error("Error fetching tours:", error);
        return [];
    }
}

export async function generateMetadata({ params }) {
    const { slug } = params;
    const blog = await fetchBlogBySlug(slug);

    if (!blog) {
        return {
            title: "Blog not found",
        };
    }

    return {
        title: blog.title
    };
}

async function BlogDetails({ params }) {
    const { slug } = params;
    const blog = await fetchBlogBySlug(slug);
    const blogs = await fetchBlogs();
    return (
        <Layout>
            <BlogDetailsPage blog={blog} blogs={blogs} />
        </Layout>
    )
}

export default BlogDetails