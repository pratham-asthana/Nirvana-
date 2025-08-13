import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import SignIn from "./login/SignIn";
import SignUp from "./login/SignUp";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signIn" element={<SignIn />}></Route>
        <Route path="/signUp" element={<SignUp />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
