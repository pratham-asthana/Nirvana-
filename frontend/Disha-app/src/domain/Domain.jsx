import React from "react";
import "./Domain.css";
import { FaArrowRightLong } from "react-icons/fa6";
import { IoCode } from "react-icons/io5";

const Domain = () => {
  return (
    <div className="domain-page-main-div">
      <div className="header-domain-div">
        <h1>Find Your Perfect Career Domain</h1>
        <p>
          Explore exciting career opportunities across different technology
          domains. Discover roles that match your skills and passion for
          innovation.
        </p>
      </div>
      <div>
        <div>
          <IoCode />
        </div>
        <h3>Web Development</h3>
        <p>
          Build modern, responsive web applications using cutting-edge
          technologies and frameworks.
        </p>
        <div>
          <p>2-5 years</p>
          <p>$700 - $120,000</p>
        </div>
        <div>
          <button>View Job Description</button>
          <FaArrowRightLong />
        </div>
      </div>
    </div>
  );
};

export default Domain;
