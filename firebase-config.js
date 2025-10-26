// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBqGCDxC8REcforP1x3KLONDKKhnDJOpms",
    authDomain: "frm-cheroor-result-store.firebaseapp.com",
    projectId: "frm-cheroor-result-store",
    storageBucket: "frm-cheroor-result-store.firebasestorage.app",
    messagingSenderId: "1026537917503",
    appId: "1:1026537917503:web:e73a44ebd08ac596523c8a",
    measurementId: "G-H7TLZ9RPCW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Export for use in other files
export { app, analytics, db };
