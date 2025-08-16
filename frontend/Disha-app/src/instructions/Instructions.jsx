import React, { useState, useEffect } from "react";
import "./Instructions.css";
import { LuLaptop } from "react-icons/lu";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineVerifiedUser } from "react-icons/md";
import { FaRegCommentAlt } from "react-icons/fa";
import { HiOutlinePaperAirplane } from "react-icons/hi";
import { db } from "../config/firebase-config";
import { collection, getDocs } from "firebase/firestore";

const iconMap = {
  LuLaptop: LuLaptop,
  IoLocationOutline: IoLocationOutline,
  MdOutlineVerifiedUser: MdOutlineVerifiedUser,
  FaRegCommentAlt: FaRegCommentAlt,
  HiOutlinePaperAirplane: HiOutlinePaperAirplane,
};

const Instructions = () => {
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
            <div className="instruction-1" key={item.id}>
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
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Instructions;
