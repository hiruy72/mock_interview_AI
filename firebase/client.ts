// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDsdXLIJB73uGIu41Noxd13odkL4MIIwm0",
  authDomain: "prepwise-1dea4.firebaseapp.com",
  projectId: "prepwise-1dea4",
  storageBucket: "prepwise-1dea4.firebasestorage.app",
  messagingSenderId: "288243411733",
  appId: "1:288243411733:web:c9aeff04c7cc2bcbfc571c",
  measurementId: "G-GGZ3WCZDTH"
};

// Initialize Firebase
const app = !getApps() ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
const db = getFirestore(app);