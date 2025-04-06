'use client'
import useCart from '@/hooks/useCart'
import { digitsEnToFa } from '@persian-tools/persian-tools'
import Image from 'next/image'
import React, { useState } from 'react'

import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ProductCard from '../module/ProductCard'

function ProductDetailsPage({ product, products, setCartCount }) {
  const { addToCart } = useCart(setCartCount);
  const [activeTab, setActiveTab] = useState("description");

  const cleanContent = (content) => {
    // Remove empty <p> tags from content
    return content.replace(/<p>\s*<\/p>/g, '');
  };

  return (
    <div>
      <h1 className='text-center text-3xl mt-20'>فروشگاه</h1>
      <div className='container mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-2 mt-20'>
          <div>
            <Image src={product.image} width={1920} height={1080} alt={product.title} className='w-[500px] h-auto' />
          </div>
          <div className='max-md:text-center'>
            <h1 className='text-3xl font-semibold mb-6'>{product.title}</h1>
            <span className='text-xl'>{digitsEnToFa(product.price)} تومان</span>
            <div className='my-6'>
              <button
                className='bg-orange-500 px-6 py-2 rounded-md'
                onClick={addToCart}>افزودن به سبد خرید</button>
            </div>
            <span className='font-semibold text-lg pl-1'>موجودی:</span>
            <span className='text-md'>موجود در انبار</span>
            <div className='mt-6'>
              <span className='font-semibold text-lg pl-1'>برچسب ها:</span>
              <span>{product.tags}</span>
            </div>
          </div>
        </div>
        <div className='mt-12'>
          <div className='flex border-b mb-4'>
            <button
              className={`px-4 py-2 text-lg ${activeTab === 'description' ? 'border-b-2 border-orange-500 font-semibold' : 'text-gray-500'}`}
              onClick={() => setActiveTab('description')}
            >
              توضیحات
            </button>
            <button
              className={`px-4 py-2 text-lg ${activeTab === 'reviews' ? 'border-b-2 border-orange-500 font-semibold' : 'text-gray-500'}`}
              onClick={() => setActiveTab('reviews')}
            >
              نظرات (0)
            </button>
          </div>

          <div className='p-4 shadow-sm'>
            {activeTab === 'description' && (
              <div className='text-justify leading-8' dangerouslySetInnerHTML={{
                __html: cleanContent(product.description),
              }}></div>
            )}
            {activeTab === 'reviews' && (
              <div>
                <p>هیچ نظری برای این محصول ثبت نشده است.</p>
              </div>
            )}
          </div>
        </div>
        {/* Related Products */}
        <div className='mt-20 p-4 lg:p-0'>
          <h2 className='text-3xl font-semibold mb-4'>محصولات مرتبط</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-20'>
            {products
              .filter(p =>
                p._id !== product._id &&
                product.tags
                  .flatMap(tagString => tagString.split('،').map(t => t.trim()))
                  .some(tag => p.title.includes(tag))
              )
              .map(p => (
                <ProductCard product={p} key={p._id} />
              ))}
          </div>
        </div>

      </div>
      <ToastContainer position='bottom-right' />
    </div>
  )
}

export default ProductDetailsPage