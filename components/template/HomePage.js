import React from 'react'
import Banner from '../module/Banner'
import SecondSection from '../module/SecondSection'
import Mission from '../module/Mission'

function HomePage() {
  return (
    <div>
      <Banner />
      <div className="relative z-10 mt-[30vh]">
        <SecondSection />
      </div>
      <div className="h-[100vh] bg-gray-300"><Mission /></div>
      <div className="h-[100vh] bg-gray-500"></div>
    </div>
  )
}

export default HomePage