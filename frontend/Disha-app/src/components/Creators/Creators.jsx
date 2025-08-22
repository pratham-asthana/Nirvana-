import React, { useEffect, useRef, useState } from "react";
import "./Creators.css";
const creators = [
  {
    name: "Creator One",
    github: "",
    img: "/assets/creator1.jpg",
  },
  {
    name: "Creator Two",
    github: "",
    img: "/assets/creator2.jpg",
  },
  {
    name: "Creator Three",
    github: "",
    img: "/assets/creator3.jpg",
  },
  {
    name: "Creator Four",
    github: "",
    img: "/assets/creator4.jpg",
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
