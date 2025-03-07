'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

function HappyClients() {
    const reviews = [
        { id: 1, text: "خدمات فوق‌العاده بود! من کاملاً راضی هستم و حتماً دوباره مراجعه خواهم کرد.", name: "محمد رضایی" },
        { id: 2, text: "برخورد کارکنان بسیار حرفه‌ای بود و نتیجه نهایی خیلی عالی شد!", name: "زهرا کریمی" },
        { id: 3, text: "محیط آرایشگاه بسیار تمیز و دلپذیر بود، خیلی تجربه‌ی خوبی داشتم.", name: "علی نیکزاد" },
    ];

    return (
        <div className='max-sm:pt-10'>
            <h1 className="text-bold text-4xl text-center">نظرات مشتریان ما</h1>
            <div className={`mx-auto mt-10`}>
                <Swiper
                    spaceBetween={1}
                    slidesPerView={1}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    navigation={{ prevEl: '.swiper-button-prev', nextEl: '.swiper-button-next' }}
                    pagination={{ clickable: true }}
                    modules={[Navigation, Autoplay, Pagination]}
                >
                    {reviews.map((review) => (
                        <SwiperSlide key={review.id} className='w-[700px]'>
                            <div className="flex flex-col items-center justify-center p-6 text-center w-[80%] mx-auto min-h-40">
                                <p className="text-3xl w-full italic">"{review.text}"</p>
                                <h3 className="text-xl font-semibold mt-4 mb-8">{review.name}</h3>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}

export default HappyClients;
