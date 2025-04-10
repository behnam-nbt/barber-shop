import { useUser } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const useLike = (setFavoriteCount = () => { }) => {
    const { user } = useUser();
    const [like, setLike] = useState([]);

    useEffect(() => {
        if (user) {
            fetchLike();
        } else {
            const localLike = JSON.parse(localStorage.getItem("like")) || [];
            setLike(localLike);
            setFavoriteCount(localLike.reduce((acc, item) => acc + item.quantity, 0));
        }
    }, [user]);

    const fetchLike = async () => {
        try {
            const res = await fetch(`/api/like?userId=${user.id}`);
            if (!res.ok) throw new Error("Failed to fetch favorites");
            const data = await res.json();
            setLike(data.items || []);
            setFavoriteCount(data.items.reduce((acc, item) => acc + item.quantity, 0));
        } catch (error) {
            console.error("Error fetching favorites:", error);
        }
    };

    const addToLike = async (product) => {
        if (user) {
            try {
                const res = await fetch('/api/like', {
                    method: "POST",
                    body: JSON.stringify({
                        userId: user.id,
                        productId: product._id,
                        quantity: 1
                    }),
                    headers: { "Content-type": "application/json" },
                });
                if (!res.ok) throw new Error("خطا در اضافه کردن به علاقه‌مندی‌ها");

                toast.success("محصول به لیست علاقه‌مندی‌ها اضافه شد");
                fetchLike();

            } catch (error) {
                toast.error(error.message);
            }
        } else {
            let localLike = JSON.parse(localStorage.getItem("like")) || [];
            const existingItem = localLike.find(item => item.productId === product._id);

            if (existingItem) {
                toast.warning("این محصول قبلاً در علاقه‌مندی‌ها ثبت شده");
            } else {
                localLike.push({
                    productId: product._id,
                    title: product.title,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });

                toast.success("محصول به لیست علاقه‌مندی‌ها اضافه شد");
            }

            localStorage.setItem("like", JSON.stringify(localLike));
            setLike(localLike);
            setFavoriteCount(localLike.reduce((acc, item) => acc + item.quantity, 0));
        }
    };

    return {
        like,
        addToLike,
    };
};

export default useLike;