import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <header>
      <nav className="navbar">
        <div className="logo">AI Interviewer</div>

        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#purpose">Purpose</a>
          </li>
          <li>
            <a href="#creators">Creators</a>
          </li>
        </ul>
        <div className="nav-buttons">
          <Link to="/login/signUp" className="btn btn-outline">
            Sign Up
          </Link>
          <Link to="/login/signIn" className="btn btn-primary">
            Sign In
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
