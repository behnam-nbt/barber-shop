"use client"
import { useUser } from '@/context/AuthContext';
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import ThemeToggle from '../module/ThemeToggle';
import { digitsEnToFa } from '@persian-tools/persian-tools';
import Hamburger from '../module/Hamburger';

import { IoIosArrowDown, IoIosSearch } from "react-icons/io";
import { RiAccountCircleLine } from "react-icons/ri";
import { IoCloseOutline, IoCartOutline, IoExitOutline } from "react-icons/io5";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";

import { motion, AnimatePresence } from "framer-motion";
import Search from '../module/Search';

function Header({ cartCount, setCartCount, favoriteCount, setFavoriteCount }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [showBottomNav, setShowBottomNav] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [infoMenuIsOpen, setInfoMenuIsOpen] = useState(false);
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const { user, loading, logout } = useUser();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight;

            if (currentScrollY === 0) {
                setShowBottomNav(false);
            } else if (isAtBottom) {
                setShowBottomNav(false);
            } else if (currentScrollY > lastScrollY) {
                setShowBottomNav(true);
            } else {
                setShowBottomNav(false);
            }

            setLastScrollY(currentScrollY);
        }
        window.addEventListener("scroll", handleScroll); // Attach event listener when component mounts
        return () => window.removeEventListener("scroll", handleScroll); // Cleanup: Remove event listener when component unmounts
    }, [lastScrollY]);

    useEffect(() => {
        fetchProducts();
    }, [])

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            if (!res.ok) throw new Error("خطا در دریافت لیست محصولات");
            const data = await res.json();
            console.log(data);
            setProducts(data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    }

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartCount(cart.reduce((acc, item) => acc + item.quantity, 0));
        if (user) {
            syncCartToDatabase(cart);
            fetchCartFromDatabase(); // Update cart count from DB
        }
    }, [user]); // This will run every time the user logs in or out

    useEffect(() => {
        const like = JSON.parse(localStorage.getItem('like')) || [];
        setFavoriteCount(like.reduce((acc, item) => acc + item.quantity, 0));
        if (user) {
            syncLikeToDatabase(like);
            fetchLikeFromDatabase(); // Update like count from DB
        }
    }, [user]);


    const fetchCartFromDatabase = async () => {
        try {
            const res = await fetch(`/api/cart?userId=${user.id}`);
            if (!res.ok) throw new Error('Failed to fetch cart');

            const data = await res.json();
            setCartCount(data.items.reduce((acc, item) => acc + item.quantity, 0)); // Set cart count from DB
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    const fetchLikeFromDatabase = async () => {
        try {
            const res = await fetch(`/api/like?userId=${user.id}`);
            if (!res.ok) throw new Error('Failed to fetch favorites');

            const data = await res.json();
            setFavoriteCount(data.items.reduce((acc, item) => acc + item.quantity, 0)); // Set like count from DB
        } catch (error) {
            console.error('Error fetching like:', error);
        }
    };

    const syncCartToDatabase = async (cartItems) => {
        try {
            // For each item in local storage, send it to the server
            for (const item of cartItems) {
                const res = await fetch('/api/cart', {
                    method: 'POST',
                    body: JSON.stringify({
                        userId: user.id, // User ID from context
                        productId: item.productId,
                        quantity: item.quantity,
                    }),
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!res.ok) {
                    throw new Error('Failed to sync cart item');
                }
            }

            // After successfully syncing, clear localStorage
            localStorage.removeItem('cart');
            fetchCartFromDatabase(); // Sync cart count from DB after sync
        } catch (error) {
            console.error('Error syncing cart to database:', error);
        }
    };

    const syncLikeToDatabase = async (likeItems) => {
        try {
            // For each item in local storage, send it to the server
            for (const item of likeItems) {
                const res = await fetch('/api/like', {
                    method: 'POST',
                    body: JSON.stringify({
                        userId: user.id, // User ID from context
                        productId: item.productId,
                        quantity: item.quantity,
                    }),
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!res.ok) {
                    throw new Error('Failed to sync like item');
                }
            }

            // After successfully syncing, clear localStorage
            localStorage.removeItem('like');
            fetchLikeFromDatabase(); // Sync likes count from DB after sync
        } catch (error) {
            console.error('Error syncing like to database:', error);
        }
    };

    const menuHandler = () => {
        setIsOpen(true);
        document.body.classList.add("overflow-hidden");
    }

    const infoMenuHandler = () => {
        setInfoMenuIsOpen(!infoMenuIsOpen);
    }

    const closeMenu = () => {
        setIsOpen(false);
        document.body.classList.remove("overflow-hidden");
    };

    useEffect(() => {
        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, []);

    const searchHandler = () => {
        setIsSearchOpen(!isSearchOpen);
    }

    return (
        <>
            <div className='hidden lg:grid grid-cols-[1fr_3fr_1fr] lg:px-4 py-2 shadow-md'
                style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}>
                <div className='flex justify-between items-center'>
                    <Image src="/images/logo.png" width={1200} height={900} alt='logo' className='w-28 h-auto' />
                    <div className='flex items-center'>
                        <button onClick={searchHandler} type='button' className='cursor-pointer'><IoIosSearch className="text-2xl ml-4" /></button>
                        <Link href="/cart" className='relative'>
                            <IoCartOutline className="text-2xl ml-4" />
                            {cartCount > 0 && (
                                <span className="absolute top-[-10px] right-[-10px] bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <Link href="/favorites" className='relative'>
                            <div>
                                <FaRegHeart className="text-2xl" />
                                {favoriteCount > 0 && (
                                    <span className="absolute top-[-10px] left-[15px] bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {favoriteCount}
                                    </span>
                                )}
                            </div>
                        </Link>
                    </div>
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
                        <li className='pr-10 text-xl'><Link href="/blogs">بلاگ</Link></li>
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
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: "0%" }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        className="fixed top-0 right-0 w-96 h-full z-50 shadow-lg"
                        style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                    >
                        <div className='flex items-start z-50 cursor-default' onClick={(e) => e.stopPropagation()}>
                            <ul className='w-60 h-full p-8' style={{ backgroundColor: "var(--background-color)" }}>
                                <li className='text-xl mb-1'><Link href="/">خانه</Link></li>
                                <li className='text-xl mb-1'><Link href="/shop">فروشگاه</Link></li>
                                <li className='text-xl mb-1'><Link href="#">رزرو</Link></li>
                                <li className='text-xl mb-1'><Link href="/blogs">بلاگ</Link></li>
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
                            <Image src="/images/logo.png" width={1200} height={900} alt='logo' className='w-28 h-auto' />
                            <IoCloseOutline className='absolute bottom-20 right-1/2 text-5xl' onClick={closeMenu} />
                        </div>
                    </motion.div >
                )
                }
            </AnimatePresence>

            {/* Mobile Navigation */}
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: showBottomNav ? 0 : 100 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="lg:hidden fixed bottom-0 right-0 p-4 shadow-md bg-zinc-300 w-full z-50"
            >
                <div className='flex justify-between items-center'>
                    <Link className='ml-10 text-lg text-black' href="/auth">ثبت نام / ورود</Link>
                    <ul className='flex justify-center items-center ml-8'>
                        <li className='text-xl ml-2 cursor-pointer text-black' onClick={searchHandler}><IoIosSearch /></li>
                        <li className='text-xl ml-2 text-black'><FaRegHeart /></li>
                        <li className='text-xl ml-8 text-black'><IoCartOutline /></li>
                        <li>
                            <div className="cursor-pointer group" onClick={menuHandler}>
                                <span className="h-[2px] w-[30px] block transition-all duration-300 bg-black"></span>
                                <span className="h-[2px] w-[15px] block mt-2 transition-all duration-300 bg-black group-hover:w-[30px]"></span>
                            </div>
                        </li>
                    </ul>
                </div>
            </motion.div>

            {/* Search Section */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ y: -600 }} // Start above the screen
                        animate={{ y: 0 }}    // Animate to its position
                        exit={{ y: -600 }}    // Exit back above the screen when closed
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        className="fixed top-0 right-0 w-full bg-white z-50 max-sm:h-screen max-sm:overflow-y-auto"
                    >
                        <Search setIsSearchOpen={setIsSearchOpen} search={search} setSearch={setSearch} products={products} />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default Header;
