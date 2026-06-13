import React from 'react'
import Search from './Search'
import FeatureHotels from './FeatureHotels'
import Destinations from './Destinations'
import WhyAlarion from './WhyAlarion'
import Reviews from './Reviews'
import MemberOffer from './MemberOffer'
import Experience from './Experience'
import Help from './Help'
import AlarionFilm from './AlarionFilm'
import Faqs from './Faqs'
import Hero from './Hero'
import Navbar from '../layout/Navbar'
import Footer from '../layout/Footer'

export default function Main() {
  return (
    <>
    <Navbar/>
    <Hero/>
    <FeatureHotels/>
    <Destinations/>
    <Experience/>
    <WhyAlarion/>
    <Reviews/>
    <MemberOffer/>
    <AlarionFilm/>
    <Help/>
    <Footer/>
    </>
  )
}
