import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import SignIn from "./login/SignIn";
import SignUp from "./login/SignUp";
import Instructions from "./instructions/Instructions";
import Interview from "./components/Interview";
import Landing from "./components/Landing";
import Domain from "./domain/Domain";
import JobDesc from "./jobDesc/JobDesc";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Landing />}></Route>
          <Route path="/domain" element={<Domain />}></Route>
          <Route path="/interview" element={<Interview />}></Route>
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/job/:id" element={<JobDesc />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
