import React from "react";
import "./Instructions.css";
import { LuLaptop } from "react-icons/lu";

const Instructions = () => {
  return (
    <>
      <div className="instructions-header">
        <h1>Interview Instructions</h1>
        <h5>Please read carefully before starting your interview</h5>
      </div>
      <div className="instructions-main-div">
        <div className="instruction-1">
          <div className="serial-no-div-div">
            <div className="serial-no-div">1</div>
          </div>
          <div className="instruction-text-main-div">
            <div className="instruction-text-header-div">
              <LuLaptop color="blue" size={"18px"} />
              <h5>Setup</h5>
            </div>
            <div className="instruction-text-div">
              <li>Ensure you have a stable internet connection.</li>
              <li>
                Use a laptop/desktop with a working webcam and microphone.
              </li>
              <li>
                Close all unnecessary tabs or applications to avoid
                distractions.
              </li>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Instructions;
