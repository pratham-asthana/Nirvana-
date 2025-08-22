import React from 'react'
import Navbar from './Navbar/Navbar';
import Hero from './Hero/Hero';
import About from './About/About';
import Purpose from './Purpose/Purpose';
import Creators from './Creators/Creators';
import Footer from './Footer/Footer';


const Landing = () => {
  return (
    <div>
        <Navbar />
        <Hero />
        <About />
        <Purpose />
        <Creators />
        <Footer />
    </div>
  )
}

export default Landing
