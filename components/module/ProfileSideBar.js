'use client'
import Link from 'next/link'
import { RiAccountCircle2Line } from "react-icons/ri";
import { CiTimer } from "react-icons/ci";
import { IoMdReorder, IoIosLogOut } from "react-icons/io";
import { useUser } from '@/context/AuthContext';

function ProfileSideBar() {
    const { logout } = useUser();
    return (
        <div className='p-2'>
            <div className='border border-zinc-500 py-2 rounded-md'>
                <ul className=''>
                    <Link href="/profile"><li className='border-b border-zinc-500 p-1 flex items-center'><RiAccountCircle2Line className='text-xl' /><span className='pr-3 text-lg'>اطلاعات کاربری</span></li></Link>
                    <Link href="/profile/reserved-times"><li className='border-b border-zinc-500 p-1 flex items-center'><CiTimer className='text-xl' /><span className='pr-3 text-lg'>وقت های رزرو شده</span></li></Link>
                    <Link href="#"><li className='border-b border-zinc-500 p-1 flex items-center'><IoMdReorder className='text-xl' /><span className='pr-3 text-lg'>سفارش ها</span></li></Link>
                    <button onClick={() => logout()}><li className='p-1 flex items-center'><IoIosLogOut className='text-xl' /><span className='pr-3 text-lg'>خروج از حساب کاربری</span></li></button>
                </ul>
            </div>
        </div>
    )
}

export default ProfileSideBar