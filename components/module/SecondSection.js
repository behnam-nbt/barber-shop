import Image from 'next/image'
import React from 'react'

function SecondSection() {
    return (
        <div className='text-center py-10 min-h-96 relative bg-stone-800'>
            <div className='mt-10'>
                <h1 className='text-3xl text-zinc-200'>"ما در اینجا هستیم تا ظاهر شما را زیبا کنیم</h1>
                <h1 className='text-3xl mt-2 text-zinc-200'>تا خودمان هم زیبا به نظر برسیم"</h1>
            </div>
            <div>
                <ul className='flex justify-center mt-10'>
                    <li className='pr-10'><Image className='w-[80px]' src="/images/razor.png" width={1900} height={1200} alt='razor' /></li>
                    <li className='pr-10'><Image className='w-[80px]' src="/images/haircut.png" width={1900} height={1200} alt='razor' /></li>
                    <li className='pr-10'><Image className='w-[80px]' src="/images/comb.png" width={1900} height={1200} alt='razor' /></li>
                </ul>
            </div>
            <Image className='hidden lg:block w-[200px] absolute top-28 right-[-140px]' src="/images/shaving.png" width={1900} height={1200} alt='razor' />
        </div>
    )
}

export default SecondSection