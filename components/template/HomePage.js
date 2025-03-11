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
        <Card blogs={blogs} />
      </div>
    </div>
  );
}

export default HomePage;
