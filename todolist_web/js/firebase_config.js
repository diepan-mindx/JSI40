// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlU-OSNz1t4oV98OzZEOPKoDtSKsTzeDs",
  authDomain: "jsi40-19cf0.firebaseapp.com",
  projectId: "jsi40-19cf0",
  storageBucket: "jsi40-19cf0.firebasestorage.app",
  messagingSenderId: "340832558663",
  appId: "1:340832558663:web:efb3ebff120725c166db62",
  measurementId: "G-C0ZJG8CJ89",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);

