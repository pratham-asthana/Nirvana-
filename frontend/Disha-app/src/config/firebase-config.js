import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC3WvhFUohpAg6g5bHfQo5h7Iw93AXkUuE",
  authDomain: "hackathon-81f0a.firebaseapp.com",
  projectId: "hackathon-81f0a",
  storageBucket: "hackathon-81f0a.firebasestorage.app",
  messagingSenderId: "952301780954",
  appId: "1:952301780954:web:152fa735335c5f1ed68ae3",
  measurementId: "G-WPQ4X6H3VB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
