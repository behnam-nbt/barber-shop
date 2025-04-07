import { digitsEnToFa } from '@persian-tools/persian-tools';
import Image from 'next/image'
import Link from 'next/link';
import React from 'react'

function Card({ blog }) {
    const month = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];

    const convertPersianToEnglish = (str) => {
        const persianNumbers = "۰۱۲۳۴۵۶۷۸۹";
        return str.replace(/[۰-۹]/g, (digit) => persianNumbers.indexOf(digit));
    };

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
        <div className='max-sm:pt-10'>
            <div className='max-md:mb-10 px-2'>
                <Link href={`/blogs/${blog.slug}`}>
                    <Image src={blog.image} width={1900} height={1200} alt={blog.title} className='w-[100%] lg:w-[400px] h-[500px] object-cover' />
                    <h1 className='mt-2 lg:mt-10 text-2xl'>{blog.title}</h1>
                    <p>نوشته شده توسط {blog.author} | {digitsEnToFa(day)} {persianMonth} {digitsEnToFa(year)}</p>
                </Link>
            </div>
        </div>
    );
}

export default Card;
