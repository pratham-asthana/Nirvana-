import React, { useState } from "react";
import "./SignIn.css";
import { auth } from "../config/firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/instruction");
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-logo">
          <h2>InterviewPro</h2>
          <p>Advanced interview analytics platform</p>
        </div>

        <h3>Welcome back</h3>
        <p className="subtitle">Sign in to your account to continue</p>

        <form onSubmit={handleSignIn}>
          <label>Email address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="forgot">
            <a href="#">Forgot password?</a>
          </div>

          <button type="submit" className="primary-btn">
            Sign in
          </button>
        </form>

        <p className="switch-text">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
