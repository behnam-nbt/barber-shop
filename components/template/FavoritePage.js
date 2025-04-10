'use client';

import { useEffect, useState } from "react";
import { useUser } from "@/context/AuthContext";
import Image from "next/image";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { PiTrashSimpleLight } from "react-icons/pi";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function FavoritePage({ likes, products, setFavoriteCount }) {
    const { user, loading } = useUser();
    const [localLike, setLocalLike] = useState([]);
    const [userFavorite, setUserFavorite] = useState(null);

    // Load like from localStorage for guest users
    useEffect(() => {
        if (!user) {
            const storedLike = localStorage.getItem("like");
            if (storedLike) {
                const parsedLike = JSON.parse(storedLike);
                setLocalLike(parsedLike);
                console.log("Parsed localStorage like:", parsedLike); // Log parsed like
            }
        }
    }, [user]); // Depend on user to ensure it runs when user changes


    // Load user's like when logged in
    useEffect(() => {
        if (user && likes.length > 0) {
            const foundLike = likes.find(like => like.userId === user.id);
            setUserFavorite(foundLike || { items: [] });
        }
    }, [user, likes]);


    // if (!user || localLike.length === 0) return <p>در حال بارگذاری علاقه مندی ها...</p>;

    if (loading) return <p className="text-center py-4">در حال بارگذاری...</p>;

    const handleDelete = async (itemId, isGuest = false) => {
        if (user && !isGuest) {
            try {
                const res = await fetch(`/api/like/delete/${itemId}`, { method: "DELETE" });

                if (!res.ok) {
                    const errorData = await res.json();
                    console.error("Error from server:", errorData.message);
                    throw new Error("Failed to delete item");
                }

                toast.success("محصول با موفقیت حذف شد!");

                // Update state for real-time UI update
                const updatedUserFavorite = userFavorite.items.filter(item => item._id !== itemId);
                setUserFavorite({ ...userFavorite, items: updatedUserFavorite });

                // Update like count dynamically
                setFavoriteCount(updatedUserFavorite.reduce((acc, item) => acc + item.quantity, 0));

            } catch (error) {
                toast.error("خطا در حذف محصول!", error.message);
            }
        } else {
            // Remove from local like
            const updatedFavorite = localLike.filter(item => String(item.productId) !== String(itemId));
            setLocalLike([...updatedFavorite]);
            localStorage.setItem("like", JSON.stringify(updatedFavorite));

            toast.success("محصول از لیست علاقه مندی ها حذف شد!");

            // Update like count for guest users
            setFavoriteCount(updatedFavorite.reduce((acc, item) => acc + item.quantity, 0));
        }
    };


    // Choose the correct like to display: userFavorite for logged-in users, locallike for guests
    const displayLike = user ? userFavorite?.items || [] : localLike;
    console.log("displayLike:", displayLike);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-semibold my-20 text-center">لیست علاقه مندی های شما</h2>
            <div>
                {displayLike.length > 0 ? (
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
                                {displayLike.map((item) => {
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
                    <p className="text-center py-4">لیست علاقه مندی های شما خالی است.</p>
                )}
            </div>
            <ToastContainer position="bottom-right" />
        </div>
    );
}

export default FavoritePage;
