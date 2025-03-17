import Link from 'next/link'
import React from 'react'

function ProfileSideBar() {
    return (
        <div className='p-2'>
            <div className='border border-zinc-500 py-2 rounded-md'>
                <ul className=''>
                    <Link href="/profile"><li className='border-b border-zinc-500 p-1'>اطلاعات کاربری</li></Link>
                    <Link href="/profile/#"><li className='p-1'>وقت های رزرو شده</li></Link>
                </ul>
            </div>
        </div>
    )
}

export default ProfileSideBar