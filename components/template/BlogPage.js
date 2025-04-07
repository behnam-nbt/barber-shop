import React from 'react'
import Card from '../module/Card'

function BlogPage({ blogs }) {
    console.log(blogs)
  return (
    <div>
        <h1 className='text-3xl font-semibold text-center my-20'>بلاگ</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {blogs.map((blog) => (
                <Card key={blog._id} blog={blog} />
            ))}
        </div>
    </div>
  )
}

export default BlogPage