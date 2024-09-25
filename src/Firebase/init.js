// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGun-QNLS9zNxqBFg7GZu4T79ZA88KSSw",
  authDomain: "yugong-liu-assignment-project.firebaseapp.com",
  projectId: "yugong-liu-assignment-project",
  storageBucket: "yugong-liu-assignment-project.appspot.com",
  messagingSenderId: "292686952758",
  appId: "1:292686952758:web:28a9a22068fd3efb2a5b97"
};

// Initialize Firebase
initializeApp(firebaseConfig);

const db = getFirestore();
export default db;
