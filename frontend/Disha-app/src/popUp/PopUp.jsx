import React, { useState } from "react";
import "./PopUp.css";
import { db } from "../config/firebase-config";
import { doc, getDoc } from "firebase/firestore";

const domainMap = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  E: 5,
  F: 6,
};

const PopUp = () => {
  const [showPopUp, setShowPopUp] = useState(false);
  const [domainCode, setDomainCode] = useState("");

  const handleConfirm = async () => {
    const code = domainCode.trim().toUpperCase();
    const domainId = domainMap[code];

    if (!domainId) {
      alert("Invalid code ! Please enter a letter between A - F");
      return;
    }

    try {
      const docRef = doc(db, "domain", domainId.toString());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setShowPopUp(false);
        console.log("Selected domain :", docSnap.id);
      } else {
        alert("No domain found for this code !");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={() => setShowPopUp(true)}>Confirm Your Domain</button>

      {showPopUp && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Enter Domain Code</h3>
            <p>
              A-Web Dev | B-Data Science | C-Android Dev | D-UI/UX Design |
              E-DevOps Engineer | F-Product Management
            </p>
            <input
              type="text"
              maxLength={1}
              value={domainCode}
              onChange={(e) => setDomainCode(e.target.value)}
              placeholder="Enter code A-F"
            ></input>
          </div>
          <div className="modal-actions">
            <button onClick={handleConfirm} className="confirm-button">
              Confirm
            </button>
            <button
              onClick={() => setShowPopUp(false)}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopUp;
