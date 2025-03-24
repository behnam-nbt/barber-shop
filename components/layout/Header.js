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
import { IoCloseOutline } from "react-icons/io5";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

import { motion } from "framer-motion";

function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [infoMenuIsOpen, setInfoMenuIsOpen] = useState(false);
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const { user, loading, logout } = useUser();

    const menuHandler = () => {
        setIsOpen(true);
        document.body.classList.add("overflow-hidden");
    }

    const infoMenuHandler = () => {
        setInfoMenuIsOpen(!infoMenuIsOpen);
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
                    <Image src="/images/logo.png" width={1200} height={900} alt='logo' className='w-28 h-auto' />
                </div>
                <div className='flex items-center'>
                    <ul className='flex items-center justify-center w-full'>
                        <li>
                            <div className="cursor-pointer group" onClick={infoMenuHandler}>
                                <span className="h-[2px] w-[30px] block transition-all duration-300 bg-[var(--text-color)]"></span>
                                <span className="h-[2px] w-[15px] block mt-2 transition-all duration-300 bg-[var(--text-color)] group-hover:w-[30px]"></span>
                            </div>
                        </li>
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: infoMenuIsOpen ? "0%" : "100%" }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            className="fixed top-0 right-0 w-96 h-full z-50 shadow-lg"
                            style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                        >
                            <IoCloseOutline
                                className="absolute top-4 left-4 text-4xl cursor-pointer"
                                onClick={() => setInfoMenuIsOpen(false)}
                            />
                            <div className="mt-40 p-8">
                                <Image src="/images/logo.png" width={1200} height={900} alt='logo' className='w-44 h-auto' />
                                <ul>
                                    <li className="text-lg mb-4 text-zinc-500">کرج {digitsEnToFa("98765432(026)")}</li>
                                    <li className="text-lg mb-4 text-zinc-500">contact.babershop@gmail.com</li>
                                    <li className="text-lg text-zinc-500">مهرویلا خیابان رودکی</li>
                                </ul>
                                <h1 className="mt-10 font-semibold text-3xl">ما را دنبال کنید:</h1>
                                <ul className="flex justify-evenly items-center mt-10">
                                    <li><Link href="#"><FaFacebook className="text-3xl hover:text-orange-400" /></Link></li>
                                    <li><Link href="#"><FaInstagram className="text-3xl hover:text-orange-400" /></Link></li>
                                    <li><Link href="#"><FaTwitter className="text-3xl hover:text-orange-400" /></Link></li>
                                    <li><Link href="#"><FaYoutube className="text-3xl hover:text-orange-400" /></Link></li>
                                </ul>
                            </div>
                        </motion.div>
                        <li className='pr-10 text-xl'><Link href="/">خانه</Link></li>
                        <li className='pr-10 text-xl'><Link href="/shop">فروشگاه</Link></li>
                        <li className='pr-10 text-xl'><Link href="/reserve">رزرو</Link></li>
                        <li className='pr-10 text-xl'><Link href="/portfolio">پورتفولیو</Link></li>
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
                    <Link href="/reserve" className='text-xl border ml-10 border-black px-8 py-1 rounded hover:bg-zinc-700 hover:text-white'>همین الان رزرو کن</Link>
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
                            <li className='text-xl mb-1'><Link href="/shop">فروشگاه</Link></li>
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
