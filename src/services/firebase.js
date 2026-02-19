import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    where,
    serverTimestamp,
    deleteDoc,
    doc
} from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDyXWT6A28Qdsnzk6YeXL2K0PeOJCBnwG0",
    authDomain: "formulario-metanoiia-2026.firebaseapp.com",
    projectId: "formulario-metanoiia-2026",
    storageBucket: "formulario-metanoiia-2026.firebasestorage.app",
    messagingSenderId: "791973258238",
    appId: "1:791973258238:web:6ec60e9ead16af0e5616af",
    measurementId: "G-CPYXEZE0J1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// const analytics = getAnalytics(app); 

export { db, collection, addDoc, getDocs, query, orderBy, where, serverTimestamp, deleteDoc, doc };
