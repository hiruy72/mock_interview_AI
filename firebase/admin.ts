import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const app = getApps();

const initFirebaseAdmin = () => {
  if (!app.length) {
    if (!process.env.FIREBASE_PROJECT_ID) throw new Error('FIREBASE_PROJECT_ID is not defined');
    if (!process.env.FIREBASE_CLIENT_EMAIL) throw new Error('FIREBASE_CLIENT_EMAIL is not defined');
    if (!process.env.FIREBASE_PRIVATE_KEY) throw new Error('FIREBASE_PRIVATE_KEY is not defined');

    initializeApp({
      credential: cert({
        project_id: process.env.FIREBASE_PROJECT_ID,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
  } else {
    getApp();
  }
};

initFirebaseAdmin();

export const auth = getAuth(getApp());
export const db = getFirestore(getApp());
