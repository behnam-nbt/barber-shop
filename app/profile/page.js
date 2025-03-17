'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/AuthContext'
import { digitsEnToFa } from '@persian-tools/persian-tools';
import Link from 'next/link';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


function Profile() {
    const { user, loading } = useUser();
    const router = useRouter();
    const id = user ? user.id : "";
    const phoneNumber = user ? user.phoneNumber : "";
    const [profile, setProfile] = useState({
        name: "",
        lastName: "",
        email: "",
        userId: id,
        phone: phoneNumber,
    })

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api/user/profile";
            const res = await fetch(`${apiUrl}/${user.phoneNumber}`);
            console.log("Request URL:", `${apiUrl}/${user.phoneNumber}`);
            console.log("API Response:", res);
            const data = await res.json();

            if (res.ok && data.phoneNumber === user.phoneNumber) {
                setProfile({
                    name: data.name || "",
                    lastName: data.lastName || "",
                    email: data.email || "",
                    userId: user.id,
                    phone: data.phoneNumber,
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

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("name", profile.name);
        formData.append("lastName", profile.lastName);
        formData.append("email", profile.email);
        formData.append("phoneNumber", user.phoneNumber);

        const res = await fetch("/api/user/profile", {
            method: "POST",
            body: formData
        })

        const data = await res.json();
        if (data.status === "Failed") toast.error(data.message);
        if (data.status === "Success") {
            toast.success("اطلاعات با موفقیت دخیره شد!");
            fetchProfile();
        }

    }

    return (
        <div className='min-h-screen'>
            <h2 className='text-4xl mb-10'>حساب کاربری</h2>
            <div className='w-1/2'>
                <div className='grid grid-cols-2 gap-20 mb-5'>
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
                <div className='grid grid-cols-2 gap-20'>
                    <input
                        style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                        className="px-4 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        type='text' name='email' placeholder='ایمیل' value={profile.email} onChange={handleChange}
                    />
                    <input
                        style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                        className="px-4 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        type='text' name='phoneNumber' value={digitsEnToFa(profile.phone)} disabled
                    />
                </div>
                <div className='text-center mt-10 grid grid-cols-2 gap-20'>
                    <button
                        onClick={handleSubmit}
                        className="bg-orange-500 text-white py-2 px-4 rounded-lg font-bold hover:bg-orange-600 transition"
                    >
                        ذخیره
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