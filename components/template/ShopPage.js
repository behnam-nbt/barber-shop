'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from "framer-motion";

import { IoCartOutline } from "react-icons/io5";
import { BiFullscreen } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa6";

function ShopPage({ products }) {
  const [isHovered, setIsHovered] = useState(null);

  const webIcons = [
    { id: "cart", icon: <IoCartOutline />, delay: 0.1 },
    { id: "more", icon: <BiFullscreen />, delay: 0.2 },
    { id: "like", icon: <FaRegHeart />, delay: 0.3 },
  ];

  return (
    <div>
      <h1 className='text-4xl text-center my-20'>فروشگاه</h1>
      <div className='container mx-auto p-10'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10'>
          {products.map((product) => (
            <Link key={product._id} href="#">
              <div 
                className='text-center transform transition-transform duration-300 hover:scale-105 relative'
                onMouseEnter={() => setIsHovered(product._id)}
                onMouseLeave={() => setIsHovered(null)}
              >
                <div className='border-b-2 mb-4'>
                  <Image 
                    src={product.image} 
                    width={1900} 
                    height={1200} 
                    alt={product.title} 
                    className='h-auto' 
                  />
                </div>
                <div>
                  <h1 className='text-2xl'>{product.title}</h1>
                  <p className='text-xl'>{`${new Intl.NumberFormat('fa-IR').format(product.price)} تومان`}</p>
                </div>
                
                {/* Floating Icons */}
                <div className="absolute top-0 left-1 transform -translate-x-1/2 flex flex-col gap-2">
                  {webIcons.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: isHovered === product._id ? 1 : 0, y: isHovered === product._id ? 0 : 10 }}
                      transition={{ delay: isHovered === product._id ? item.delay : 0, duration: 0.3 }}
                      className="w-10 h-10 flex justify-center items-center bg-black text-white rounded-full"
                    >
                      <button aria-label={item.id}>
                        {item.icon}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ShopPage;
