// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  /*  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID, */

  apiKey: "AIzaSyC7GFDNqELDE1o2VDykhufd3fSJgdTBOXc",
  authDomain: "tiendareact2025-a600c.firebaseapp.com",
  projectId: "tiendareact2025-a600c",
  storageBucket: "tiendareact2025-a600c.firebasestorage.app",
  messagingSenderId: "1032849296159",
  appId: "1:1032849296159:web:17f5b3dc9e38b942a63e2a",
  measurementId: "G-1ZXRQJ81XZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
