import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./JobDesc.css";
import { db } from "../config/firebase-config";
import { doc, getDoc } from "firebase/firestore";

const JobDesc = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const docRef = doc(db, "domain", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setJob(docSnap.data());
        } else {
          console.log("No such job");
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchJob();
  }, [id]);

  if (!job) return <p>Loading .......</p>;

  return (
    <div>
      <h1 className="job-desc-heading">Job Description</h1>
      <h2 className="responsibilities-heading">Responsibilities</h2>
      <ul style={{ marginBottom: "40px" }}>
        {job.responsibilities?.map((res, i) => (
          <li className="res-list-items" key={i}>
            {res}
          </li>
        ))}
      </ul>
      <h2 className="req-heading">Required Skills & Qualifications</h2>
      <ul style={{ marginBottom: "40px" }}>
        {job.skills.map((skill, i) => (
          <li className="req-list-items" key={i}>
            {skill}
          </li>
        ))}
      </ul>
      <h2 className="what-heading">What we offer</h2>
      <ul>
        {job.offer.map((off, i) => (
          <li className="what-list-items" key={i}>
            {off}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobDesc;
