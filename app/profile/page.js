'use client'

import React, { useEffect, useState } from 'react'
import { useUser } from '@/context/AuthContext'
import Link from 'next/link';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import api from '@/api/api';
import { useSendProfile } from '@/utils/auth';


function Profile() {
    const { user, loading } = useUser();
    const phoneNumber = user ? user.phoneNumber : ""
    const userId = user ? user.id : ""
    const [profile, setProfile] = useState({
        name: "",
        lastName: "",
        email: "",
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
                setProfile({
                    name: res.data.name || "",
                    lastName: res.data.lastName || "",
                    email: res.data.email || "",
                });
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevData) => ({ ...prevData, [name]: value }))
    }

    const mutation = useSendProfile();

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("name", profile.name);
        formData.append("lastName", profile.lastName);
        formData.append("email", profile.email);
        formData.append("userId", user.id);

        // const res = await fetch("/api/user/profile", {
        //     method: "POST",
        //     body: formData
        // })

        // const data = await res.json();
        // if (data.status === "Failed") toast.error(data.message);
        // if (data.status === "Success") {
        //     toast.success("اطلاعات با موفقیت دخیره شد!");
        //     fetchProfile();
        // }

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
            <div className='w-full lg:w-1/2'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-20 mb-4 md:mb-5'>
                    <input
                        style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                        className="px-4 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        type='text' name='name' placeholder='نام' value={profile.name} onChange={handleChange}
                    />
                    <input
                        style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                        className="px-4 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        type='text' name='lastName' placeholder='نام خانوادگی' value={profile.lastName} onChange={handleChange}
                    />
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-20'>
                    <input
                        style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                        className="px-4 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        type='text' name='email' placeholder='ایمیل' value={profile.email} onChange={handleChange}
                    />
                    <input
                        style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                        className="px-4 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        type='text' name='phone' value={phoneNumber} disabled
                    />
                </div>
                <div className='text-center mt-10 grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-20'>
                    <button
                        disabled={mutation.isLoading}
                        onClick={handleSubmit}
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
            </div>
            <ToastContainer position="bottom-right" />
        </div>
    )
}

export default Profile