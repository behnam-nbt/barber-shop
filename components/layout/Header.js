"use client"
import { useUser } from '@/context/AuthContext';
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import ThemeToggle from '../module/ThemeToggle';
import { digitsEnToFa } from '@persian-tools/persian-tools';
import Hamburger from '../module/Hamburger';

import { IoIosArrowDown } from "react-icons/io";
import { RiAccountCircleLine } from "react-icons/ri";
import { IoExitOutline } from "react-icons/io5";

function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const { user, loading, logout } = useUser();

    const menuHandler = () => {
        setIsOpen(true);
        document.body.classList.add("overflow-hidden");
    }

    const closeMenu = () => {
        setIsOpen(false);
        document.body.classList.remove("overflow-hidden"); // Allow scrolling when menu is closed
    };

    useEffect(() => {
        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, []);

    return (
        <>
            <div className='hidden lg:grid grid-cols-[1fr_3fr_1fr] lg:px-4 py-2 shadow-md'
                style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}>
                <div>
                    <Image src="/images/logo.png" width={1200} height={900} alt='logo' className='w-44 h-auto' />
                </div>
                <div className='flex items-center'>
                    <ul className='flex items-center justify-center w-full'>
                        <li className='pr-10 text-xl'><Link href="/">خانه</Link></li>
                        <li className='pr-10 text-xl'><Link href="#">رزرو</Link></li>
                        <li className='pr-10 text-xl'><Link href="#">پورتفولیو</Link></li>
                        {user?.role === "admin" ? <li className='pr-10 text-xl'><Link href="/nxt-admin">داشبورد</Link></li> : null}
                        {loading ? (
                            <li className='pr-10 text-xl'><Link href="#">در حال بارگذاری...</Link></li>
                        ) : user ? (
                            <>
                                <li className='pr-10 text-xl relative'><span>{digitsEnToFa(user.phoneNumber)}</span><IoIosArrowDown onClick={() => setMenuIsOpen(!menuIsOpen)} className='inline-block cursor-pointer' />
                                    {menuIsOpen && (
                                        <div
                                            className="absolute top-[69px] w-44 text-lg z-10 before:content-[''] before:absolute before:top-[-34px] before:right-0 before:w-full before:h-8"
                                            style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}>
                                            <ul className='p-2'>
                                                <li><Link href="/profile"><RiAccountCircleLine className='inline-block' /> حساب کاربری</Link></li>
                                                <li><button className='flex items-center mt-4' type='button' onClick={logout}><IoExitOutline className='ml-1' /> خروج از حساب کاربری</button></li>
                                            </ul>
                                        </div>
                                    )}
                                </li>
                            </>
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

            {/* Mobile Menu */}
            <div className='lg:hidden grid grid-cols-[1fr_1fr_1fr] px-4 py-2 shadow-md'
                style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}>
                <div className='flex items-center'>
                    <Hamburger menuHandler={menuHandler} />
                </div>
                <div>
                    <Image src="/images/logo.png" width={1200} height={900} alt='logo' className='w-44 h-auto' />
                </div>
                <div className='flex items-center justify-end'>
                    <ThemeToggle />
                </div>
            </div>
            {isOpen && (
                <div className="lg:hidden fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 cursor-[url('/images/cross.png'),crosshair]" onClick={closeMenu}>
                    <div className='flex items-center z-50 cursor-default' onClick={(e) => e.stopPropagation()}>
                        <ul className='absolute top-0 right-0 w-60 h-full p-8' style={{ backgroundColor: "var(--background-color)" }}>
                            <li className='text-xl mb-1'><Link href="/">خانه</Link></li>
                            <li className='text-xl mb-1'><Link href="#">رزرو</Link></li>
                            <li className='text-xl mb-1'><Link href="#">پورتفولیو</Link></li>
                            {user?.role === "admin" ? <li className='text-xl'><Link href="/nxt-admin">داشبورد</Link><IoIosArrowDown /></li> : null}
                            {loading ? (
                                <li className='text-xl mb-1'><Link href="#">در حال بارگذاری...</Link></li>
                            ) : user ? (
                                <li className='text-xl mb-1'>{digitsEnToFa(user.phoneNumber)}<IoIosArrowDown /></li>
                            ) : (
                                <li className='text-xl mb-1'><Link href="/auth/login">ورود/ثبت نام</Link></li>
                            )}
                        </ul>
                    </div>
                </div >
            )}
        </>
    )
}

export default Header;
