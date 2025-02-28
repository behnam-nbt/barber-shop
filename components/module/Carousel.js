'use client';
import styles from './Carousel.module.css'; // Updated styles for the carousel
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import Image from 'next/image';

function Carousel() {
  return (
    <div className={styles.carouselContainer}>
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        navigation={{ prevEl: '.swiper-button-prev', nextEl: '.swiper-button-next' }}
        pagination={{ clickable: true }}
        modules={[Navigation,Autoplay]}
      >
        <SwiperSlide>
          <Image src="/images/main-image2.png" width={1500} height={1200} alt="slide1" quality={100} />
        </SwiperSlide>
        <SwiperSlide>
          <Image src="/images/main-image.png" width={1500} height={1200} alt="slide2" quality={100} />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

export default Carousel;
