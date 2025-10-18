import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const app = getApps();

const intiFirebaseAdmin = () => {
  if (!app.length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  } else {
    getApp();
  }
};

intiFirebaseAdmin();

export const auth = getAuth(getApp());
export const db = getFirestore(getApp());
