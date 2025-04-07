import React from 'react';
import Banner from '../module/Banner';
import SecondSection from '../module/SecondSection';
import Mission from '../module/Mission';
import Offers from '../module/Offers';
import Barbers from '../module/Barbers';
import HappyClients from '../module/HappyClients';
import Card from '../module/Card';

function HomePage({ blogs, barbers }) {
  return (
    <div>
      <Banner />
      <div className="relative z-10 mt-0 lg:mt-[30vh]">
        <SecondSection />
      </div>
      <div className="min-h-screen" style={{ backgroundColor: "var(--background-color)" }}>
        <Mission />
      </div>
      <div className="min-h-screen" style={{ backgroundColor: "var(--background-color)" }}>
        <Offers />
      </div>
      <div className="min-h-screen" style={{ backgroundColor: "var(--background-color)" }}>
        <Barbers barbers={barbers} />
      </div>
      <div className="min-h-[50vh]" style={{ backgroundColor: "var(--background-color)" }}>
        <HappyClients />
      </div>
      <div className="min-h-screen" style={{ backgroundColor: "var(--background-color)" }}>
        <div className='text-center'>
          <h1 className='text-4xl font-semibold mb-4'>بلاگ ما</h1>
          <p className='text-xl md:w-[500px] mx-auto mb-20'>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.</p>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-3 w-[100%] md:w-[65%] h-auto mx-auto'>
          {blogs.map((blog) => (
            <Card blog={blog} key={blog._id} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
