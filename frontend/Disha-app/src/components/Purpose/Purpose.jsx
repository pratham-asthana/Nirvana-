import React, { useEffect, useRef, useState } from "react";
import "./Purpose.css";

const Purpose = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  return (
    <section
      id="purpose"
      className={`purpose-section ${visible ? "visible" : ""}`}
      ref={sectionRef}
    >
      <div className="purpose-container">
        <div className="purpose-box">
          <h3 className="purpose-title">Our Mission</h3>
          <p className="purpose-text">
            Democratize interview preparation through AI by empowering every
            candidate with personalized, bias‑free, and accessible mock interviews
            that build real confidence and measurable skills.
          </p>
        </div>
        <div className="purpose-box">
          <h3 className="purpose-title">Our Vision</h3>
          <p className="purpose-text">
            To transform talent acquisition worldwide by bridging the gap between
            skill and opportunity, making interviews smart, fair, and effective
            for everyone across the globe.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Purpose;
