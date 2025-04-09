'use client'

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod'
import { useUser } from "@/context/AuthContext"
import api from "@/api/api";
import Image from "next/image";
import { digitsEnToFa } from "@persian-tools/persian-tools";

const formSchema = z.object({
    name: z.string().min(2, "نام حداقل باید دو حرف داشته باشد."),
    lastName: z.string().min(2, "نام خانوادگی حداقل باید دو حرف داشته باشد."),
    phoneNumber: z.string().min(11, "شماره تلفن نامعتبر است"),
    address: z.string().min(10, "آدرس باید حداقل 10 کاراکتر باشد."),
    postalCode: z.string().length(10, "کد پستی باید 10 رقم باشد"),
    email: z.string().email('ایمیل نامعتبر است').optional().or(z.literal('')),
})

function CheckoutPage() {
    const { user, loading } = useUser();
    const [carts, setCarts] = useState([]);
    const [localCart, setLocalCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [users, setUsers] = useState();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(formSchema),
    })

    useEffect(() => {
        if (users) {
            setValue("name", users.name || "")
            setValue("lastName", users.lastName || "")
            setValue("phoneNumber", user?.phoneNumber || "")
            setValue("address", users.address || "")
            setValue("postalCode", users.postalCode || "")
            setValue("email", users.email || "")
        }
    }, [users, user, setValue])


    useEffect(() => {
        if (!user) {
            const data = localStorage.getItem("cart");
            setLocalCart(data ? JSON.parse(data) : []);
        } else {
            (async () => {
                const dataFromDb = await fetchCartFromDatabase();
                setCarts(Array.isArray(dataFromDb?.items) ? dataFromDb.items : []); // Ensure it's an array
            })();
        }
    }, [user]);

    const fetchCartFromDatabase = async () => {
        try {
            const res = await fetch(`/api/cart?userId=${user.id}`);
            if (!res.ok) throw new Error('Failed to fetch cart');

            const data = await res.json();
            console.log("Cart Data:", data); // Debugging
            return data; // ✅ Return data correctly
        } catch (error) {
            console.error('Error fetching cart:', error);
            return { items: [] }; // Ensure it returns an object with items array
        }
    };



    useEffect(() => {
        const updatedCart = user ? [...carts] : [...localCart];
        const total = updatedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotalPrice(total);
    }, [localCart, carts]);

    const fetchProfile = async () => {
        if (user) {
            try {
                const res = await api.get(`/api/profile/user?userId=${user.id}`);
                if (res.status === 200 && res.data.userId === user.id) {
                    setUsers(res.data);;
                    console.log(res.data);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [user]);

    const displayCart = user ? carts?.items || [] : localCart;

    const submitHandler = (data) => {
        console.log("form submitted!", data);
    }


    return (
        <form onSubmit={handleSubmit(submitHandler)}>
            <div className='container mx-auto grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-14 p-3 lg:p-0 mt-10'>
                <div>
                    <h1 className='font-bold text-2xl text-center mb-12'>سفارش های شما</h1>
                    <div className='border border-zinc-400 rounded-xl p-4'>
                        {displayCart?.map((cart, index) => (
                            <div key={index} className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <Image src={user ? cart.productId.image : cart.image} width={1920} height={1080} alt={cart.productId.title} className="w-20 h-auto" />
                                    {user ? <p>{cart.productId.title}</p> : <p>{cart.title}</p>}
                                </div>
                                {user ? <p>{digitsEnToFa(cart.productId.price)}</p> : <p>{digitsEnToFa(cart.price)}</p>}
                            </div>
                        ))}
                        <div className="flex justify-between mt-4">
                            <span className="pr-4">مبلغ کل:</span>
                            <p>{digitsEnToFa(totalPrice)} تومان</p>
                        </div>
                        <div className="flex justify-between mt-4">
                            <span>هزینه ارسال</span>
                            <span>رایگان</span>
                        </div>
                        <div className="w-full text-center mt-8">
                            <button type="submit" className="w-full bg-orange-500 p-2 rounded-md text-white">
                                تایید و پرداخت
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <h1 className='font-bold text-2xl'>مشخصات پستی</h1>
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 my-4'>
                        <div>
                            <label className='block' htmlFor='name'>نام *</label>
                            <input
                                style={{ backgroundColor: "var(--background-color)" }}
                                className='w-full rounded-md outline-none border-zinc-500 mt-3'
                                id='name'
                                type='text'
                                {...register("name")}
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>
                        <div>
                            <label className='block' htmlFor='lastName'>نام خانوادگی *</label>
                            <input
                                style={{ backgroundColor: "var(--background-color)" }}
                                className='w-full rounded-md outline-none border-zinc-500 mt-3'
                                id='lastName'
                                type='text'
                                {...register("lastName")}
                            />
                        </div>
                        <div>
                            <label className='block' htmlFor='phoneNumber'>شماره همراه *</label>
                            <input
                                style={{ backgroundColor: "var(--background-color)" }}
                                className='w-full rounded-md outline-none border-zinc-500 mt-3'
                                id='phoneNumber'
                                type='text'
                                {...register("phoneNumber")}
                            />
                        </div>
                    </div>
                    <div className='mb-8'>
                        <label className='block' htmlFor='address'>آدرس *</label>
                        <input
                            style={{ backgroundColor: "var(--background-color)" }}
                            className='w-full rounded-md outline-none border-zinc-500 mt-3'
                            id='address'
                            type='text'
                            {...register("address")}
                        />
                    </div>
                    <div className='grid grid-cols-2 gap-8'>
                        <div>
                            <label className='block' htmlFor='postalCode'>کد پستی *</label>
                            <input
                                style={{ backgroundColor: "var(--background-color)" }}
                                className='w-full rounded-md outline-none border-zinc-500 mt-3'
                                id='postalCode'
                                type='text'
                                {...register("postalCode")}
                            />
                        </div>
                        <div>
                            <label className='block' htmlFor='email'>ایمیل(اختیاری)</label>
                            <input
                                style={{ backgroundColor: "var(--background-color)" }}
                                className='w-full rounded-md outline-none border-zinc-500 mt-3'
                                id='email'
                                type='text'
                                {...register("email")}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default CheckoutPage