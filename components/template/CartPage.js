'use client';

import { useEffect, useState } from "react";
import { useUser } from "@/context/AuthContext";
import Image from "next/image";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { PiTrashSimpleLight } from "react-icons/pi";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { CiDeliveryTruck } from "react-icons/ci";
import { PiCubeLight } from "react-icons/pi";
import Link from "next/link";

function CartPage({ carts, products, setCartCount }) {
    const { user, loading } = useUser();
    const [localCart, setLocalCart] = useState([]);
    const [userCart, setUserCart] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        console.log("User:", user);
        console.log("Carts:", carts);
        console.log("User Cart:", userCart);
    }, [user, carts, userCart]);

    // Load cart from localStorage for guest users
    useEffect(() => {
        if (!user) {
            const storedCart = localStorage.getItem("cart");
            if (storedCart) {
                setLocalCart(JSON.parse(storedCart));
            }
        }
    }, [user]);

    // Load user's cart when logged in
    useEffect(() => {
        if (user && carts.length > 0) {
            const foundCart = carts.find(cart => cart.userId === user.id);
            setUserCart(foundCart || { items: [] });
        }
    }, [user, carts]);

    // Update the total price whenever the cart changes
    useEffect(() => {
        let updatedCart = [];

        if (user) {
            if (!userCart) return; 
            updatedCart = [...userCart.items];
        } else {
            updatedCart = [...localCart];
        }

        const total = updatedCart.reduce((acc, item) => {
            const product = products.find(p => p._id === item.productId);
            return acc + (product ? product.price * item.quantity : 0);
        }, 0);

        setTotalPrice(total);
    }, [userCart, localCart, products, user]);


    if (!carts || carts.length === 0) return <p>در حال بارگذاری سبد خرید...</p>;

    if (loading) return <p className="text-center py-4">در حال بارگذاری...</p>;

    const handleDelete = async (itemId, isGuest = false) => {
        if (user && !isGuest) {
            try {
                const res = await fetch(`/api/cart/delete/${itemId}`, { method: "DELETE" });

                if (!res.ok) {
                    const errorData = await res.json();
                    console.error("Error from server:", errorData.message);
                    throw new Error("Failed to delete item");
                }

                toast.success("محصول با موفقیت حذف شد!");

                // Update state for real-time UI update
                const updatedUserCart = userCart.items.filter(item => item._id !== itemId);
                setUserCart({ ...userCart, items: updatedUserCart });

                // Update cart count dynamically
                setCartCount(updatedUserCart.reduce((acc, item) => acc + item.quantity, 0));

            } catch (error) {
                toast.error("خطا در حذف محصول!", error.message);
            }
        } else {
            // Remove from local cart
            const updatedCart = localCart.filter(item => String(item.productId) !== String(itemId));
            setLocalCart([...updatedCart]);
            localStorage.setItem("cart", JSON.stringify(updatedCart));

            toast.success("محصول از سبد خرید حذف شد!");

            // Update cart count for guest users
            setCartCount(updatedCart.reduce((acc, item) => acc + item.quantity, 0));
        }
    };

    // Handle increase and decrease of item quantity
    const handleQuantityChange = async (itemId, action, isGuest = false) => {
        const updatedCart = user ? [...userCart.items] : [...localCart];
        const itemIndex = updatedCart.findIndex(item => String(item.productId) === String(itemId));

        if (itemIndex !== -1) {
            // Adjust the quantity
            const item = updatedCart[itemIndex];
            if (action === "increase") {
                item.quantity += 1;
            } else if (action === "decrease" && item.quantity > 1) {
                item.quantity -= 1;
            }

            // If user is logged in, update the cart in the database
            if (user && !isGuest) {
                try {
                    const res = await fetch(`/api/cart/update/${item._id}`, {
                        method: "PATCH",
                        body: JSON.stringify({ itemId: item._id, quantity: item.quantity }),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    if (!res.ok) {
                        const errorData = await res.json();
                        console.error("Error from server:", errorData.message);
                        throw new Error("Failed to update quantity");
                    }

                    // toast.success("محصول با موفقیت بروزرسانی شد!");

                    // Update the cart in state and localStorage
                    setUserCart({ ...userCart, items: updatedCart });
                    setCartCount(updatedCart.reduce((acc, item) => acc + item.quantity, 0));


                } catch (error) {
                    toast.error("خطا در بروزرسانی محصول!", error.message);
                }
            } else {
                // Update cart in localStorage for guest user
                if (!user) {
                    localStorage.setItem("cart", JSON.stringify(updatedCart));
                    setLocalCart(updatedCart);
                    setCartCount(updatedCart.reduce((acc, item) => acc + item.quantity, 0));
                }
            }
        }
    };

    // Choose the correct cart to display: userCart for logged-in users, localCart for guests
    const displayCart = user ? userCart?.items || [] : localCart;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-semibold my-20 text-center">سبد خرید شما</h2>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr]">
                <div>
                    <div className="border border-zinc-500 rounded-lg p-3">
                        <div className="border border-zinc-500 rounded-lg p-3">
                            <p>{digitsEnToFa(5)} امتیاز باشگاه مشتریان به ازای هر محصول</p>
                        </div>
                        <div>
                            <div className="flex justify-evenly items-center border border-zinc-500 rounded-lg p-3 mt-2">
                                <div>
                                    <p>ارسال رایگان</p>
                                    <p>از محصول خود لذت ببرید</p>
                                </div>
                                <div className="text-4xl">
                                    <CiDeliveryTruck />
                                </div>
                            </div>
                            <div className="flex justify-evenly items-center border border-zinc-500 rounded-lg p-3 mt-2">
                                <div>
                                    <p className="text-lg font-semibold">از محصول خود لذت ببرید</p>
                                    <p className="w-40 text-justify text-zinc-500">لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.</p>
                                </div>
                                <div className="text-4xl text-zinc-400"><PiCubeLight /></div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-6">
                            <span>مبلغ کل</span>
                            <p>{digitsEnToFa(totalPrice)} تومان</p>
                        </div>
                        <div className="w-full text-center mt-10">
                            <Link href="/checkout" className="bg-orange-500 px-20 py-2 rounded-md text-white">ادامه خرید</Link>
                        </div>
                    </div>
                </div>
                {displayCart.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-right">
                            <thead>
                                <tr>
                                    <th className="px-20 py-3 text-xl">تصویر</th>
                                    <th className="px-4 py-3 text-xl">نام محصول</th>
                                    <th className="px-4 py-3 text-xl">قیمت</th>
                                    <th className="px-4 py-3 text-xl">تعداد</th>
                                    <th className="px-4 py-3 text-xl"></th>
                                    <th className="px-4 py-3 text-xl">حذف</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayCart.map((item) => {
                                    const product = products.find(p => p._id === item.productId);
                                    return product ? (
                                        <tr key={item.productId}>
                                            <td className="px-4 py-3">
                                                <Image
                                                    src={product.image}
                                                    width={1900}
                                                    height={1200}
                                                    alt={product.title}
                                                    className="w-[200px] h-auto object-cover"
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-xl">{product.title}</td>
                                            <td className="px-4 py-3 text-xl">{digitsEnToFa(product.price.toLocaleString())} تومان</td>
                                            <td className="px-4 py-3 text-xl">{digitsEnToFa(item.quantity)}</td>
                                            <td>
                                                <button
                                                    onClick={() => handleQuantityChange(item.productId, "decrease", !user)}
                                                    className="px-3 py-1 text-xl rounded-full"
                                                >
                                                    -
                                                </button>
                                                <button
                                                    onClick={() => handleQuantityChange(item.productId, "increase", !user)}
                                                    className="px-3 py-1 text-xl rounded-full"
                                                >
                                                    +
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => handleDelete(user ? item._id : item.productId, !user)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <PiTrashSimpleLight size={24} />
                                                </button>
                                            </td>
                                        </tr>
                                    ) : null;
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center py-4">سبد خرید شما خالی است.</p>
                )}
            </div>
            <ToastContainer position="bottom-right" />
        </div>
    );
}

export default CartPage;
