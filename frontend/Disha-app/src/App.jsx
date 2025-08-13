import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import SignIn from "./login/SignIn";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signIn" element={<SignIn />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
