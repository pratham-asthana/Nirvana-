import React, { useEffect, useRef, useState } from "react";
import aryan from '../../assets/aryan.jpg'
import akshat from '../../assets/akshat.jpg'
import disha from '../../assets/disha.jpg'
import pratham from '../../assets/pratham.jpg'
import "./Creators.css";
const creators = [
  {
    name: "Aryan Verma",
    github: "https://github.com/Aryanv-0908",
    img: aryan,
  },
  {
    name: "Pratham Asthana",
    github: "",
    img: pratham,
  },
  {
    name: "Disha Gupta",
    github: "",
    img: disha,
  },
  {
    name: "Akshat",
    github: "https://github.com/akshatlamba1",
    img: akshat,
  },
];

const Creators = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  return (
    <section
      id="creators"
      className={`creators-section ${visible ? "visible" : ""}`}
      ref={sectionRef}
    >
      <h2 className="creators-title">Meet Our Team</h2>
      <div className="creators-container">
        {creators.map(({ name, github, img }, index) => (
          <div key={index} className="creator-card" style={{ animationDelay: `${index * 0.2}s` }}>
            <img src={img} alt={`${name}`} className="creator-image" />
            <a href={github} target="_blank" rel="noopener noreferrer" className="creator-name">
              {name}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Creators;
