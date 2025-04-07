import Layout from '@/components/layout/Layout'
import BlogPage from '@/components/template/BlogPage';
import { fetchBlogs } from '@/services/fetchData'
import React from 'react'

export const revalidate = 3600;

async function Blogs() {
    const blogs = await fetchBlogs();
    return (
        <Layout>
            <BlogPage blogs={blogs} />
        </Layout>
    )
}

export default Blogs