import React from 'react'
import Carousel from './Carousel'
import Link from 'next/link'

function Mission() {
  return (
    <div className='py-10 min-h-96' style={{ backgroundColor: "var(--background-color)" }}>
      <div className='mt-10 grid grid-cols-1 lg:grid-cols-2 gap-20 w-[70%] mx-auto text-center'>
        <div>
          <p className='text-orange-500 text-xl'>ماموریت ما</p>
          <h1 className='font-extrabold text-4xl mt-4' style={{ color: "var(--text-color)" }}>همیشه برطرف کردن نیازهای شما</h1>
          <h2 className='text-2xl leading-10 mt-5 lg:w-96 lg:mx-auto mb-12' style={{ color: "var(--text-color)" }}>ماموریت ما نوآوری و انگیزه برای دستیابی به برتری و پذیرش چالش های تغییر در صنعت مو است. تا آرایشگران ما بتوانند به صنعت مو به نفع مشتریان کمک کنند.</h2>
          <Link className="text-2xl bg-orange-400 text-white px-10 py-2 rounded-md" href="#">بیشتر بدانید</Link>
        </div>
        <Carousel />
      </div>
    </div>
  )
}

export default Mission