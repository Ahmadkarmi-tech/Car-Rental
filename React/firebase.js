import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDlUA7wPWF7zG1wxd9eHVfIf5jLVQoJHrU",
  authDomain: "car-rental-project-b9b70.firebaseapp.com",
  projectId: "car-rental-project-b9b70",
  storageBucket: "car-rental-project-b9b70.firebasestorage.app",
  messagingSenderId: "120942101285",
  appId: "1:120942101285:web:e932dd5d17c1e806aed0cc",
  measurementId: "G-8JGS0BPJKQ"
};

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
