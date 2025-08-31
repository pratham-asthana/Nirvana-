import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import "./JobDesc.css";
import { db } from "../config/firebase-config";
import { doc, getDoc } from "firebase/firestore";
import AOS from "aos";
import "aos/dist/aos.css";

const JobDesc = () => {
  const { domainId } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  // const { id } = useParams();
  const [job, setJob] = useState(null);

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!resume) {
      alert("Please select a resume to upload!");
      return;
    }
    navigate(`/instructions/${domainId}`);
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const docRef = doc(db, "domain", domainId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setJob(docSnap.data());
        } else {
          console.log("No such job found!");
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchJob();
    AOS.init({ duration: 1500 });
  }, [domainId]);

  if (!job) return <p>Loading .......</p>;

  return (
    <div>
      <h1 className="job-desc-heading" data-aos="zoom-in-up">
        Job Description
      </h1>
      <h2 className="responsibilities-heading" data-aos="flip-right">
        Responsibilities
      </h2>
      <ul style={{ marginBottom: "40px" }}>
        {job.responsibilities?.map((res, i) => (
          <li className="res-list-items" key={i}>
            {res}
          </li>
        ))}
      </ul>
      <h2 className="req-heading" data-aos="flip-left">
        Required Skills & Qualifications
      </h2>
      <ul style={{ marginBottom: "40px" }}>
        {job.skills?.map((skill, i) => (
          <li className="req-list-items" key={i}>
            {skill}
          </li>
        ))}
      </ul>
      <h2 className="what-heading" data-aos="flip-right">
        What we offer
      </h2>
      <ul>
        {job.offer?.map((off, i) => (
          <li className="what-list-items" key={i}>
            {off}
          </li>
        ))}
      </ul>

      <div className="resume-main-div">
        <h3 style={{ fontSize: "20px" }}>Upload Your Resume</h3>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="input-container"
        />
        <button onClick={handleUpload} className="upload-resume-button">
          Upload Resume
        </button>
      </div>
    </div>
  );
};

export default JobDesc;
