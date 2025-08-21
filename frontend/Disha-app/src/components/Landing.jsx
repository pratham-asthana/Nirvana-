import React from 'react'
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Purpose from "./components/Purpose/Purpose";

const Landing = () => {
  return (
    <div>
        <Navbar />
        <About />
        <Hero />
        <Purpose />
    </div>
  )
}

export default Landing
