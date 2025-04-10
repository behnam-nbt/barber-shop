'use client'
import React, { useEffect, useState } from 'react'
import { useUser } from '@/context/AuthContext';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import useCart from '@/hooks/useCart';
import ProductCard from '../module/ProductCard';
import useLike from '@/hooks/useLike';

function ShopPage({ products, setCartCount, setFavoriteCount }) {
  const { user, loading } = useUser();
  const [cart, setCart] = useState([]);
  const { addToCart } = useCart(setCartCount);
  const { addToLike } = useLike(setFavoriteCount);

  useEffect(() => {
    if (user) {
      fetchCart();
      fetchFavorites(); // Fetch favorites if the user is logged in
    } else {
      const localCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(localCart);
      setCartCount(localCart.reduce((acc, item) => acc + item.quantity, 0));

      const localLike = JSON.parse(localStorage.getItem("like")) || [];
      setFavoriteCount(localLike.reduce((acc, item) => acc + item.quantity, 0));
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

  const fetchFavorites = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/like?userId=${user.id}`);
      if (!res.ok) throw new Error("Failed to fetch favorites");
      const data = await res.json();

      // Assuming you want to update favorite count here
      setFavoriteCount(data.items.reduce((acc, item) => acc + item.quantity, 0));
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };


  return (
    <div>
      <h1 className='text-4xl text-center my-20'>فروشگاه</h1>
      <div className='container mx-auto p-10'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10'>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} addToCart={addToCart} addToLike={addToLike} />
          ))}
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default ShopPage;
