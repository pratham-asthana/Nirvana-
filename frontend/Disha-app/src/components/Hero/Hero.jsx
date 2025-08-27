import React from "react";
import "./Hero.css";
import heroBg from "../../assets/hero-bg.jpg";

const Hero = () => (
  <section
    className="hero"
    style={{
      backgroundImage: `linear-gradient(rgba(30,30,47,0.8), rgba(30,30,47,0.8)), url(${heroBg})`,
    }}
  >
    <div className="hero-content">
      <h1 className="hero-title">The Future of Hiring is Here</h1>
      <p className="hero-text">
        Transform your recruitment process with AI-powered interviews that
        provide deeper insights, reduce bias, and help you find the perfect
        candidates faster than ever.
      </p>
      <a href="/signUp" className="hero-btn">
        Schedule Your Interview
      </a>
      <button className="hero-btn-alt">Learn More</button>
    </div>
  </section>
);

export default Hero;
