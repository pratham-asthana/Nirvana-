import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import "./Instructions.css";
import { LuLaptop } from "react-icons/lu";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineVerifiedUser } from "react-icons/md";
import { FaRegCommentAlt } from "react-icons/fa";
import { HiOutlinePaperAirplane } from "react-icons/hi";
import { MdOutlineDangerous } from "react-icons/md";
import { db } from "../config/firebase-config";
import { collection, getDocs } from "firebase/firestore";
import PopUp from "../popUp/PopUp";

const iconMap = {
  LuLaptop: LuLaptop,
  IoLocationOutline: IoLocationOutline,
  MdOutlineVerifiedUser: MdOutlineVerifiedUser,
  FaRegCommentAlt: FaRegCommentAlt,
  HiOutlinePaperAirplane: HiOutlinePaperAirplane,
};

const Instructions = ({ domainId }) => {
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();
  const [instructions, setInstructions] = useState([]);

  useEffect(() => {
    const fetchInstructions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "instruct"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInstructions(data);
      } catch (error) {
        console.error("Error fetching instructions:", error);
      }
    };
    fetchInstructions();
  }, []);

  const handleStart = () => {
    if (checked) {
      navigate(`/interview/${domainId}`);
    }
  };

  const noteRef = useRef(null);
  const noteInView = useInView(noteRef, { once: true, margin: "-100px" });

  return (
    <>
      <div className="instructions-header">
        <h1>Interview Instructions</h1>
        <h5>Please read carefully before starting your interview</h5>
      </div>

      <div className="instructions-main-div">
        {instructions.map((item, index) => {
          const IconComponent = iconMap[item.icon];
          return (
            <motion.div
              key={item.id}
              className="instruction-1"
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 20,
                delay: 0.15 + index * 0.13,
              }}
            >
              <div className="serial-no-div-div">
                <div className="serial-no-div">{item.serialNo}</div>
              </div>
              <div className="instruction-text-main-div">
                <div className="instruction-text-header-div">
                  {IconComponent && (
                    <IconComponent color="blue" size={"18px"} />
                  )}
                  <h5>{item.title}</h5>
                </div>
                <div className="instruction-text-div">
                  {Array.isArray(item.points) ? (
                    <ul>
                      {item.points.map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{item.points}</p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        ref={noteRef}
        className="important-note-main-div"
        initial={{ opacity: 0, y: 20 }}
        animate={noteInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 20,
          duration: 0.8,
          delay: 0.15 + instructions.length * 0.13 + 0.2,
        }}
      >
        <div className="important-note-icon-outer-div">
          <div className="important-note-icon-div">
            <MdOutlineDangerous size={"28px"} color="white" />
          </div>
        </div>
        <div>
          <h3>Important Note</h3>
          <li>Keep your device charged or connected to power.</li>
          <li>Once started, the interview cannot be paused.</li>
          <li>Make sure you are alone and undisturbed.</li>
        </div>
      </motion.div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "16px",
          gap: "0",
        }}
      >
        <PopUp />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "12px",
            width: "70%",
            padding: "16px",
          }}
        >
          <input
            type="checkbox"
            id="read-instructions"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            style={{
              width: "14px",
              height: "14px",
              marginRight: "12px",
              borderRadius: "10%",
              border: "1px solid blue",
            }}
          />
          <label
            htmlFor="read-instructions"
            style={{
              fontSize: "15px",
              cursor: "pointer",
              paddingBottom: "10px",
            }}
          >
            I have read the instructions carefully.
          </label>
        </div>
        <button
          onClick={handleStart}
          disabled={!checked}
          style={{
            background: checked ? "green" : "#e0e0e0",
            color: checked ? "#fff" : "#bdbdbd",
            border: "none",
            borderRadius: "8px",
            padding: "16px 48px",
            fontSize: "20px",
            fontWeight: "500",
            cursor: checked ? "pointer" : "not-allowed",
            boxShadow: checked ? "0 2px 8px rgba(127,214,167,0.15)" : "none",
            transition: "background 0.2s, color 0.2s",
          }}
        >
          Start Interview
        </button>
      </div>
    </>
  );
};

export default Instructions;
