import Layout from '@/components/layout/Layout'
import Link from 'next/link'
import React from 'react'

function NotFound() {
    return (
        <Layout>
            <div className='fixed top-0 left-0 w-full h-[100vh] -z-10'
                style={{
                    background: "url('/images/404.png')",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}>
            </div>
            <div className="w-full h-[100vh] bg-black bg-opacity-70 text-center z-50">
                <h1 className='text-9xl pt-20'>404</h1>
                <p className='text-4xl md:text-7xl mb-10'>صفحه مورد نظر یافت نشد</p>
                <Link className='px-20 py-3 bg-zinc-400 text-zinc-900 rounded-md' href="/">بازگشت به صفحه اصلی</Link>
            </div>
        </Layout>
    )
}

export default NotFound