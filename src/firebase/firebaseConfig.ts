// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-pDooBQEsALlOULNtAGe02gd24XLm9dw",
  authDomain: "moovy-80f67.firebaseapp.com",
  projectId: "moovy-80f67",
  storageBucket: "moovy-80f67.firebasestorage.app",
  messagingSenderId: "45928745603",
  appId: "1:45928745603:web:f4abf94d9ac30aea5ee9b6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // user data
export const db = getFirestore(app); // database
