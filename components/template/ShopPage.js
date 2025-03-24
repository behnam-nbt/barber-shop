import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function ShopPage({ products }) {
  return (
    <div>
      <h1 className='text-4xl text-center my-20'>فروشگاه</h1>
      <div className='container mx-auto p-10'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10'>
          {products.map((product) => {
            return (
              <Link href="#">
                <div key={product._id} className='text-center transform transition-transform duration-300 hover:scale-105'>
                  <div className='border-b-2 mb-4'>
                    <Image src={product.image} width={1900} height={1200} alt={product.title} className='h-auto' />
                  </div>
                  <div>
                    <h1 className='text-xl'>{product.title}</h1>
                    <p>{`${new Intl.NumberFormat('fa-IR').format(product.price)} تومان`}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ShopPage