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
      <h1>Job Description</h1>
      <h2>Responsibilities</h2>
      <ul>
        {job.responsibilities?.map((res, i) => (
          <li key={i}>{res}</li>
        ))}
      </ul>
      <h2>Required Skills & Qualifications</h2>
      <ul>
        {job.skills.map((skill, i) => (
          <li key={i}>{skill}</li>
        ))}
      </ul>
      <h2>What we offer</h2>
      <ul>
        {job.offer.map((off, i) => (
          <li key={i}>{off}</li>
        ))}
      </ul>
    </div>
  );
};

export default JobDesc;
