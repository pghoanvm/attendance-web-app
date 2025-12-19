import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCpY1-Vv8v4pax7pUjuxUXka4230B2hzeA",
  authDomain: "vmschool-19pt.firebaseapp.com",
  projectId: "vmschool-19pt",
  storageBucket: "vmschool-19pt.firebasestorage.app",
  messagingSenderId: "494235854654",
  appId: "1:494235854654:web:20835b3848e6fae6d66e6f",
  measurementId: "G-K0NQC1JGSS"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;