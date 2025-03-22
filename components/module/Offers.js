import { digitsEnToFa } from '@persian-tools/persian-tools'
import Link from 'next/link'
import React from 'react'

function Offers() {
    return (
        <div className='w-[100%] px-2 lg:px-20 3xl:px-40'>
            <h1 className='text-2xl text-center text-orange-500'>برخی از خدمات ما</h1>
            <h2 className='text-4xl text-center mt-2'>خدمات آرایشگاه کاخ اصلاح</h2>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-20 mt-14'>
                <div>
                    <div className='mb-8'>
                        <div className='flex justify-between items-center'>
                            <h4 className='text-2xl font-bold'>کوتاهی مو</h4>
                            <p className='text-xl'>{digitsEnToFa(300)} ت</p>
                        </div>
                        <div>
                            <p className='text-zinc-500'>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.</p>
                        </div>
                    </div>
                    <div className='mb-8'>
                        <div className='flex justify-between items-center'>
                            <h4 className='text-2xl font-bold'>فید پوست</h4>
                            <p className='text-xl'>{digitsEnToFa(400)} ت</p>
                        </div>
                        <div>
                            <p className='text-zinc-500'>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.</p>
                        </div>
                    </div>
                    <div className='mb-8'>
                        <div className='flex justify-between items-center'>
                            <h4 className='text-2xl font-bold'>شیو صورت</h4>
                            <p className='text-xl'>{digitsEnToFa(100)} ت</p>
                        </div>
                        <div>
                            <p className='text-zinc-500'>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.</p>
                        </div>
                    </div>
                    <div className='mb-8'>
                        <div className='flex justify-between items-center'>
                            <h4 className='text-2xl font-bold'>اصلاح ریش</h4>
                            <p className='text-xl'>{digitsEnToFa(50)} ت</p>
                        </div>
                        <div>
                            <p className='text-zinc-500'>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.</p>
                        </div>
                    </div>
                    <div className='mb-8'>
                        <div className='flex justify-between items-center'>
                            <h4 className='text-2xl font-bold'>ماساژ سر</h4>
                            <p className='text-xl'>{digitsEnToFa(200)} ت</p>
                        </div>
                        <div>
                            <p className='text-zinc-500'>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.</p>
                        </div>
                    </div>
                </div>
                <div>
                    <div className='mb-8'>
                        <div className='flex justify-between items-center'>
                            <h4 className='text-2xl font-bold'>استایل مو</h4>
                            <p className='text-xl'>{digitsEnToFa(50)} ت</p>
                        </div>
                        <div>
                            <p className='text-zinc-500'>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.</p>
                        </div>
                    </div>
                    <div className='mb-8'>
                        <div className='flex justify-between items-center'>
                            <h4 className='text-2xl font-bold'>فید پوست</h4>
                            <p className='text-xl'>{digitsEnToFa(400)} ت</p>
                        </div>
                        <div>
                            <p className='text-zinc-500'>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.</p>
                        </div>
                    </div>
                    <div className='mb-8'>
                        <div className='flex justify-between items-center'>
                            <h4 className='text-2xl font-bold'>شیو سبیل</h4>
                            <p className='text-xl'>{digitsEnToFa(50)} ت</p>
                        </div>
                        <div>
                            <p className='text-zinc-500'>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.</p>
                        </div>
                    </div>
                    <div className='mb-8'>
                        <div className='flex justify-between items-center'>
                            <h4 className='text-2xl font-bold'>اصلاح ریش</h4>
                            <p className='text-xl'>{digitsEnToFa(50)} ت</p>
                        </div>
                        <div>
                            <p className='text-zinc-500'>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.</p>
                        </div>
                    </div>
                    <div className='mb-8'>
                        <div className='flex justify-between items-center'>
                            <h4 className='text-2xl font-bold'>رنگ مو</h4>
                            <p className='text-xl'>{digitsEnToFa(700)} ت</p>    
                        </div>
                        <div>
                            <p className='text-zinc-500'>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='text-center mt-10'>
                <Link className="text-2xl bg-orange-400 text-white px-10 py-2 rounded-md hover:bg-orange-700" href="/reserve">رزرو صندلی</Link>
            </div>
        </div>
    )
}

export default Offers