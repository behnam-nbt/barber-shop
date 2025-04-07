'use client'
import React, { useEffect, useState } from 'react'
import { useUser } from '@/context/AuthContext';
import { ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import useCart from '@/hooks/useCart';
import ProductCard from '../module/ProductCard';

function ShopPage({ products, setCartCount }) {
  const { user, loading } = useUser();
  const [cart, setCart] = useState([]);
  const { addToCart } = useCart(setCartCount);

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


  // const addToCart = async (product) => {
  //   if (user) {
  //     try {
  //       // Add item to the cart in the database for logged-in users
  //       const res = await fetch('/api/cart', {
  //         method: "POST",
  //         body: JSON.stringify({ userId: user.id, productId: product._id, quantity: 1 }),
  //         headers: { "Content-type": "application/json" },
  //       });
  //       if (!res.ok) throw new Error("خطا در اضافه کردن محصول به سبد خرید");

  //       toast.success("محصول با موفقیت به سبد خرید شما اضافه شد");

  //       // Immediately fetch the updated cart from the database to refresh the cart count
  //       fetchCart(); // This will update the `cartCount` from the server

  //     } catch (error) {
  //       toast.error(error.message);
  //     }
  //   } else {
  //     // Guest cart (localStorage)
  //     let localCart = JSON.parse(localStorage.getItem("cart")) || [];
  //     const existingItem = localCart.find(item => item.productId === product._id);

  //     if (existingItem) {
  //       existingItem.quantity += 1;
  //     } else {
  //       localCart.push({ productId: product._id, title: product.title, price: product.price, image: product.image, quantity: 1 });
  //     }

  //     // Save to localStorage and update state
  //     localStorage.setItem("cart", JSON.stringify(localCart));
  //     setCart(localCart);
  //     setCartCount(localCart.reduce((acc, item) => acc + item.quantity, 0));

  //     toast.success("محصول با موفقیت به سبد خرید شما اضافه شد");
  //   }
  // };


  return (
    <div>
      <h1 className='text-4xl text-center my-20'>فروشگاه</h1>
      <div className='container mx-auto p-10'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10'>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} addToCart={addToCart} />
          ))}
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default ShopPage;
