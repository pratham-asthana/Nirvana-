import React, { useEffect, useRef, useState } from "react";
import "./Footer.css";

const Footer = () => {
  const footerRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = footerRef.current;
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
    <footer
      ref={footerRef}
      className={`footer ${visible ? "visible" : ""}`}
    >
      <div className="footer-container">
        <div className="footer-brand">
          <h2 className="footer-logo">AI Interviewer</h2>
          <p className="footer-tagline">
            Empowering your future with AI-powered mock interviews.
          </p>
        </div>
        <ul className="footer-links">
          <li><a href="/">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#purpose">Purpose</a></li>
        </ul>
        <div className="footer-socials">
          <a
            href="https://github.com/pratham-asthana/Nirvana-"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
            className="social-circle"
          >
            GH
          </a>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} AI Interviewer. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

