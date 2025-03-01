import React from 'react'
import Banner from '../module/Banner'
import SecondSection from '../module/SecondSection'
import Mission from '../module/Mission'
import Offers from '../module/Offers'
import Barbers from '../module/Barbers'
import HappyClients from '../module/HappyClients'

function HomePage() {
  return (
    <div>
      <Banner />
      <div className="relative z-10 mt-[30vh]">
        <SecondSection />
      </div>
      <div className="h-[100vh]" style={{ backgroundColor: "var(--background-color)" }}><Mission /></div>
      <div className="h-[100vh]" style={{ backgroundColor: "var(--background-color)" }}><Offers /></div>
      <div className="h-[100vh]" style={{ backgroundColor: "var(--background-color)" }}><Barbers /></div>
      <div className="h-[100vh]" style={{ backgroundColor: "var(--background-color)" }}><HappyClients /></div>
    </div>
  )
}

export default HomePage