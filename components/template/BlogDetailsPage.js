import Image from 'next/image'
import Link from 'next/link';
import React from 'react'
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";

function BlogDetailsPage({ blog, blogs }) {
    const cleanContent = (content) => {
        // Remove empty <p> tags from content
        return content.replace(/<p>\s*<\/p>/g, '');
    };

    const currentSlug = blog.slug;
    const currentIndex = blogs.findIndex(post => post.slug === currentSlug);

    const prevPost = currentIndex > 0 ? blogs[currentIndex - 1] : null;
    const nextPost = currentIndex < blogs.length - 1 ? blogs[currentIndex + 1] : null;

    return (
        <div className='container mx-auto p-2 max-sm:text-justify'>
            <h1 className='text-3xl text-center font-semibold mt-20'>{blog.title}</h1>
            <div className='text-center mt-8'>
                <span className='text-xl'>نوشته شده توسط <strong>{blog.author}</strong></span>
                &nbsp;|&nbsp;
                <span className='text-xl'>{new Date(blog.createdAt).toLocaleDateString("fa-IR")}</span>
            </div>
            <Image src={blog.image} width={1920} height={1080} alt={blog.title} className='w-full h-auto mx-auto mt-14 rounded-sm' />
            <div className='leading-10 mt-12 mb-20 text-lg' dangerouslySetInnerHTML={{
                __html: cleanContent(blog.description),
            }}></div>
            <span className='text-xl text-zinc-600'>نوشته شده توسط <strong>{blog.author}</strong> در تاریخ {new Date(blog.createdAt).toLocaleDateString("fa-IR")}</span>
            <div className='flex md:justify-between items-center mt-10 relative max-sm:flex-col'>
                <div className='md:w-1/2'>
                    {prevPost && (
                        <Link href={prevPost.slug}>
                            <div className='flex justify-start items-center'>
                                <FaArrowRightLong className='hidden md:block text-xl' />
                                <div className='md:mr-6'>
                                    <div className='text-zinc-500 text-lg max-sm:text-center'>پست قبلی</div>
                                    <h1>{prevPost.title}</h1>
                                </div>
                            </div>
                        </Link>
                    )}
                </div>
                <div className='md:w-1/2 flex justify-end'>
                    {nextPost && (
                        <Link href={nextPost.slug}>
                            <div className='flex justify-end items-center'>
                                <div className='md:ml-6 text-right'>
                                    <div className='text-zinc-500 text-lg max-sm:text-center'>پست بعدی</div>
                                    <h1>{nextPost.title}</h1>
                                </div>
                                <FaArrowLeftLong className='hidden md:block text-xl' />
                            </div>
                        </Link>
                    )}
                </div>
            </div>


        </div>
    )
}

export default BlogDetailsPage