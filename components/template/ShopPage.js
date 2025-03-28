'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from "framer-motion";

import { IoCartOutline } from "react-icons/io5";
import { BiFullscreen } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa6";
import { useUser } from '@/context/AuthContext';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function ShopPage({ products, setCartCount }) {
  const [isHovered, setIsHovered] = useState(null);
  const { user, loading } = useUser();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      const localCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(localCart);
      setCartCount(localCart.reduce((acc, item) => acc + item.quantity, 0));
    }
  }, [user]);

  // Fetch cart from backend
  const fetchCart = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/cart?userId=${user.id}`);
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();
  
      // Set cart and cartCount from the response
      setCart(data.items || []);
      setCartCount(data.items.reduce((acc, item) => acc + item.quantity, 0));
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };
  

  const addToCart = async (product) => {
    if (user) {
      try {
        // Add item to the cart in the database for logged-in users
        const res = await fetch('/api/cart', {
          method: "POST",
          body: JSON.stringify({ userId: user.id, productId: product._id, quantity: 1 }),
          headers: { "Content-type": "application/json" },
        });
        if (!res.ok) throw new Error("خطا در اضافه کردن محصول به سبد خرید");
  
        toast.success("محصول با موفقیت به سبد خرید شما اضافه شد");
        
        // Immediately fetch the updated cart from the database to refresh the cart count
        fetchCart(); // This will update the `cartCount` from the server
  
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      // Guest cart (localStorage)
      let localCart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingItem = localCart.find(item => item.productId === product._id);
  
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        localCart.push({ productId: product._id, title: product.title, price: product.price, image: product.image, quantity: 1 });
      }
  
      // Save to localStorage and update state
      localStorage.setItem("cart", JSON.stringify(localCart));
      setCart(localCart);
      setCartCount(localCart.reduce((acc, item) => acc + item.quantity, 0));
  
      toast.success("Product added to cart.");
    }
  };
  

  return (
    <div>
      <h1 className='text-4xl text-center my-20'>فروشگاه</h1>
      <div className='container mx-auto p-10'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10'>
          {products.map((product) => (
            <div key={product._id}>
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

                <div className="absolute top-0 left-1 transform -translate-x-1/2 flex flex-col gap-2">
                  {[
                    { id: "cart", icon: <IoCartOutline />, action: () => addToCart(product), delay: 0.1 },
                    { id: "more", icon: <BiFullscreen />, action: () => console.log("Show product details"), delay: 0.2 },
                    { id: "like", icon: <FaRegHeart />, action: () => console.log("Add to favorites"), delay: 0.3 },
                  ].map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: isHovered === product._id ? 1 : 0, y: isHovered === product._id ? 0 : 10 }}
                      transition={{ delay: isHovered === product._id ? item.delay : 0, duration: 0.3 }}
                      className="w-10 h-10 flex justify-center items-center bg-black text-white rounded-full"
                    >
                      <button onClick={item.action} aria-label={item.id}>
                        {item.icon}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default ShopPage;
