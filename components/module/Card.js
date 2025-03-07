import { digitsEnToFa } from '@persian-tools/persian-tools';
import Image from 'next/image'
import React from 'react'

function Card({ blogs }) {
    const month = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];

    const convertPersianToEnglish = (str) => {
        const persianNumbers = "۰۱۲۳۴۵۶۷۸۹";
        return str.replace(/[۰-۹]/g, (digit) => persianNumbers.indexOf(digit));
    };

    return (
        <div className='max-sm:pt-10'>
            <div className='text-center'>
                <h1 className='text-4xl font-semibold mb-4'>بلاگ ما</h1>
                <p className='text-xl md:w-[500px] mx-auto mb-20'>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.</p>
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-3 w-[100%] lg:w-[65%] h-auto mx-auto'>
                {blogs.map((blog, index) => {
                    const date = new Date(blog.createdAt);

                    // Convert to Persian date using "fa-IR" locale
                    const persianDateStr = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric"
                    }).format(date);

                    // Convert Persian numerals to English
                    const englishDateStr = convertPersianToEnglish(persianDateStr);

                    // Extract Persian date parts
                    const [year, monthNumber, day] = englishDateStr.split("/").map(Number);

                    // Convert month number (1-12) to Persian month name
                    const persianMonth = month[monthNumber - 1];

                    return (
                        <div key={index} className='max-md:mb-10 px-2'>
                            <Image src={blog.image} width={1900} height={1200} alt={blog.title} className='w-[100%] lg:w-[400px] h-[500px]' />
                            <h1 className='mt-2 lg:mt-10 text-2xl'>{blog.title}</h1>
                            <p>نوشته شده توسط {blog.author} | {digitsEnToFa(day)} {persianMonth} {digitsEnToFa(year)}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Card;
