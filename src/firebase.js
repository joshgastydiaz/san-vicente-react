import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAGSd8D9oTxCvHfWM8rnvoCgvdzfaPa0DE",
  authDomain: "barangay-san-vicente-website.firebaseapp.com",
  projectId: "barangay-san-vicente-website",
  storageBucket: "barangay-san-vicente-website.appspot.com", // Corrected this line
  messagingSenderId: "210018030912",
  appId: "1:210018030912:web:0d2ce7da61220f381a96a5",
  measurementId: "G-ECM6ZTJ7DC"
};

const app = initializeApp(firebaseConfig);


const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
