import React from "react";
import "./Login.css";
import { auth, googleProvider } from "../config/firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

const Login = () => {
  return (
    <div>
      <h1>Login Page</h1>
    </div>
  );
};

export default Login;
