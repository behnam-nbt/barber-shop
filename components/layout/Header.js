"use client"
import { useUser } from '@/context/AuthContext';
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import ThemeToggle from '../module/ThemeToggle';

function Header() {
    const { user, loading, logout } = useUser();
    return (
        <div className='grid grid-cols-[1fr_3fr_1fr] lg:px-4 py-2 shadow-md' 
             style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}>
            <div>
                <Image src="/images/logo.png" width={1200} height={900} alt='logo' className='w-44 h-auto' />
            </div>
            <div className='flex items-center'>
                <ul className='flex items-center justify-center w-full'>
                    <li className='pr-10 text-xl'><Link href="/">خانه</Link></li>
                    <li className='pr-10 text-xl'><Link href="#">رزرو</Link></li>
                    <li className='pr-10 text-xl'><Link href="#">پورتفولیو</Link></li>
                    {loading ? (
                        <li className='pr-10 text-xl'><Link href="#">در حال بارگذاری...</Link></li>
                    ) : user ? (
                        <li className='pr-10 text-xl'><Link href="#">{user.phoneNumber}</Link></li>
                    ) : (
                        <li className='pr-32 text-xl'><Link href="/auth/login">ورود/ثبت نام</Link></li>
                    )}
                </ul>
            </div>
            <div className='flex items-center'>
                <Link href="#" className='text-xl border ml-10 border-black px-8 py-1 rounded hover:bg-zinc-700 hover:text-white'>همین الان رزرو کن</Link>
                <ThemeToggle />
            </div>
        </div>
    )
}

export default Header;
