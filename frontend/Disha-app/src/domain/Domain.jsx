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
      <div className="domain-card-div">
        <div className="domain-card-icon">
          <IoCode size={"20px"} color="white" />
        </div>
        <h3 className="domain-name">Web Development</h3>
        <p className="domain-description">
          Build modern, responsive web applications using cutting-edge
          technologies and frameworks.
        </p>
        <div className="domain-card-details">
          <p className="domain-card-details-1">2-5 years</p>
          <p className="domain-card-details-2">$700 - $120,000</p>
        </div>
        <div className="domain-card-button-arrow">
          <button className="view-jd-button">View Job Description</button>
          <FaArrowRightLong className="arrow-icon" />
        </div>
      </div>
    </div>
  );
};

export default Domain;
