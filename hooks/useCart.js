import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useUser } from "@/context/AuthContext";

const useCart = (setCartCount) => {
  const { user } = useUser();
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

  const fetchCart = async () => {
    try {
      const res = await fetch(`/api/cart?userId=${user.id}`);
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();
      setCart(data.items || []);
      setCartCount(data.items.reduce((acc, item) => acc + item.quantity, 0));
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const addToCart = async (product) => {
    if (user) {
      try {
        const res = await fetch('/api/cart', {
          method: "POST",
          body: JSON.stringify({
            userId: user.id,
            productId: product._id,
            quantity: 1
          }),
          headers: { "Content-type": "application/json" },
        });
        if (!res.ok) throw new Error("خطا در اضافه کردن محصول به سبد خرید");

        toast.success("محصول با موفقیت به سبد خرید شما اضافه شد");
        fetchCart();

      } catch (error) {
        toast.error(error.message);
      }
    } else {
      let localCart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingItem = localCart.find(item => item.productId === product._id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        localCart.push({
          productId: product._id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: 1
        });
      }

      localStorage.setItem("cart", JSON.stringify(localCart));
      setCart(localCart);
      setCartCount(localCart.reduce((acc, item) => acc + item.quantity, 0));

      toast.success("محصول با موفقیت به سبد خرید شما اضافه شد");
    }
  };

  return {
    cart,
    addToCart,
  };
};

export default useCart;
