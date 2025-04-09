'use client'

import React, { useEffect, useState } from 'react'
import { useUser } from '@/context/AuthContext'
import Link from 'next/link';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import api from '@/api/api';
import { useSendProfile } from '@/utils/auth';
import { digitsEnToFa } from '@persian-tools/persian-tools';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { z } from 'zod';

const profileSchema = z.object({
    name: z.string().min(2, "نام حداقل باید دو حرف داشته باشد."),
    lastName: z.string().min(2, "نام خانوادگی حداقل باید دو حرف داشته باشد."),
    address: z.string().min(10, "آدرس باید حداقل 10 کاراکتر باشد."),
    postalCode: z.string().length(10, "کد پستی باید 10 رقم باشد"),
    email: z.string().email('ایمیل نامعتبر است').optional().or(z.literal('')),
})

function Profile() {
    const { user, loading } = useUser();
    const phoneNumber = user ? user.phoneNumber : ""
    const userId = user ? user.id : ""
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: "",
            lastName: "",
            email: "",
            address: "",
            postalCode: "",
        }
    })

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            const res = await api.get(`/api/profile/user?userId=${userId}`);
            console.log("API Response:", res);

            if (res.status === 200 && res.data.userId === user.id) {
                setValue("name", res.data.name || "");
                setValue("lastName", res.data.lastName || "");
                setValue("email", res.data.email || "");
                setValue("address", res.data.address || "");
                setValue("postalCode", res.data.postalCode || "");
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    const mutation = useSendProfile();

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("lastName", data.lastName);
        formData.append("email", data.email);
        formData.append("address", data.address);
        formData.append("postalCode", data.postalCode);
        formData.append("userId", user.id);

        mutation.mutate(formData, {
            onSuccess: (response) => {
                if (response?.data?.status === "Success") {
                    toast.success("اطلاعات با موفقیت ذخیره شد!");
                    fetchProfile();
                } else {
                    toast.error(response?.data?.message || "خطا در ذخیره اطلاعات");
                }
            },
            onError: (error) => {
                toast.error("Submission error:", error);

                if (error.response) {
                    toast.error(error.response.data.message || "خطا در ارسال اطلاعات!");
                } else {
                    toast.error("خطا در ارسال اطلاعات! لطفا دوباره تلاش کنید.");
                }
            },
        });
    }

    return (
        <div className='min-h-screen px-2 md-px-0'>
            <h2 className='text-4xl mb-10'>حساب کاربری</h2>
            <div className='w-full lg:w-[70%]'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-20 mb-4 md:mb-5'>
                        <input
                            {...register("name")}
                            style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                            className="placeholder-zinc-500 px-4 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            type='text'
                            name='name'
                            placeholder='نام'
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        <input
                            {...register("lastName")}
                            style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                            className="placeholder-zinc-500 px-4 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            type='text'
                            name='lastName'
                            placeholder='نام خانوادگی'
                        />
                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-20'>
                        <input
                            {...register("email")}
                            style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                            className="placeholder-zinc-500 px-4 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            type='text'
                            name='email'
                            placeholder='ایمیل'
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                        <input
                            style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                            className="placeholder-zinc-500 px-4 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            type='text' name='phone' value={digitsEnToFa(phoneNumber)} disabled
                        />
                        <input
                            {...register("postalCode")}
                            style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                            className="placeholder-zinc-500 px-4 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            type='text'
                            placeholder='کد پستی'
                            name='postalCode'

                        />
                        {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>}
                    </div>
                    <div className='grid grid-cols-1 mt-5'>
                        <input
                            {...register("address")}
                            style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                            className="placeholder-zinc-500 px-4 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            type='text'
                            name='address'
                            placeholder='آدرس پستی'
                        />
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                    </div>
                    <div className='text-center mt-10 grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-20'>
                        <button
                            type='submit'
                            disabled={mutation.isLoading}
                            className={`bg-orange-500 text-white py-2 px-4 rounded-lg font-bold hover:bg-orange-600 transition ${mutation.isLoading ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                        >
                            {mutation.isLoading ? "در حال ذخیره..." : "ذخیره"}
                        </button>

                        <Link href="/"
                            style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                            className="py-2 px-4 border border-orange-500 rounded-lg font-semibold"
                        >
                            بازگشت به صفحه اصلی
                        </Link>
                    </div>
                </form>
            </div>
            <ToastContainer position="bottom-right" />
        </div>
    )
}

export default Profile