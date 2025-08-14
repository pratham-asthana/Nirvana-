import React, { useEffect, useRef, useState } from "react";
import "./About.css";
import aboutImg from "../../assets/about.jpg";

const About = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentElement = sectionRef.current;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (currentElement) observer.observe(currentElement);
    return () => {
      if (currentElement) observer.unobserve(currentElement);
    };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`about-section ${isVisible ? "visible" : ""}`}
    >
      <div className="about-layout">
        <div className="about-image-card">
          <img
            src={aboutImg}
            alt="AI Interview Interviewer Illustration"
            className="about-img"
          />
        </div>
        <div className="about-text-card">
          <h2 className="about-title">About</h2>
          <p className="about-text">
            AI Interviewer is an innovative platform that leverages the power of artificial intelligence to create realistic and adaptive interview simulations. Whether you are a student stepping into the job market, a professional preparing for your next career move, or someone looking to refine communication skills, our system delivers tailored questions, real-time performance feedback, and actionable insights. Built with accessibility in mind, it ensures high‑quality interview preparation for anyone, anywhere — helping you develop the confidence and clarity needed to excel in any interview scenario.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
