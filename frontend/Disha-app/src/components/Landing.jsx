import React from 'react'
import Navbar from './Navbar/Navbar';
import Hero from './Hero/Hero';
import About from './About/About'
import Purpose from './Purpose/Purpose'
import Footer from './Footer/Footer';

const Landing = () => {
  return (
    <div>
        <Navbar />
        <Hero />
        <About />
        <Purpose />
        <Footer />
    </div>
  )
}

export default Landing
