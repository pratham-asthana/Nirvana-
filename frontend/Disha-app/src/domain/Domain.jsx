import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Domain.css";
import { FaArrowRightLong } from "react-icons/fa6";
import { IoCode } from "react-icons/io5";
import { GoDatabase } from "react-icons/go";
import { FaMobileAlt } from "react-icons/fa";
import { IoColorPaletteOutline } from "react-icons/io5";
import { CiSettings } from "react-icons/ci";
import { FiTarget } from "react-icons/fi";
import { PiCopyright } from "react-icons/pi";
import { db } from "../config/firebase-config";
import { collection, getDocs } from "firebase/firestore";
import AOS from "aos";
import "aos/dist/aos.css";

const iconMap = {
  IoCode: IoCode,
  GoDatabase: GoDatabase,
  FaMobileAlt: FaMobileAlt,
  IoColorPaletteOutline: IoColorPaletteOutline,
  CiSettings: CiSettings,
  FiTarget: FiTarget,
};

const Domain = () => {
  const navigate = useNavigate();
  const [domains, setDomains] = useState([]);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "domain"));
        const domainList = [];
        querySnapshot.forEach((doc) => {
          domainList.push({ id: doc.id, ...doc.data() });
        });
        setDomains(domainList);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDomains();
    AOS.init({ duration: 1500 });
  }, []);

  const handleViewJD = (domainId) => {
    navigate(`/jd/${domainId}`);
  };

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
      <div className="domain-cards-container-main-div" data-aos="zoom-in">
        {domains.map((item) => {
          const IconComponent = iconMap[item.icon];
          return (
            <div className="domain-card-div" key={item.id}>
              <div className="domain-card-icon">
                {IconComponent && <IconComponent size={"20px"} color="white" />}
              </div>
              <h3 className="domain-name">{item.name}</h3>
              <p className="domain-description">{item.desc}</p>
              <div className="domain-card-details">
                <p className="domain-card-details-1">{item.experience} years</p>
                <p className="domain-card-details-2">
                  ${item.payLower} - ${item.payUpper}
                </p>
              </div>
              <div
                className="domain-card-button-arrow"
                onClick={() => handleViewJD(item.id)}
              >
                <button className="view-jd-button">View Job Description</button>
                <FaArrowRightLong />
              </div>
            </div>
          );
        })}
      </div>
      <div className="footer-main-div">
        <PiCopyright className="copyright-icon" />
        <p>2024 Career Portal. Find your dream job in technology.</p>
      </div>
    </div>
  );
};

export default Domain;
