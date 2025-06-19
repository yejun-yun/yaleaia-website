import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD6xfVC3RDOgfWmr2FPayAUztjBdfCVuRo",
  authDomain: "llm-website-8ab05.firebaseapp.com",
  projectId: "llm-website-8ab05",
  storageBucket: "llm-website-8ab05.firebasestorage.app",
  messagingSenderId: "895514977954",
  appId: "1:895514977954:web:8565131ab129e71b9119fb",
  measurementId: "G-XX7P0J3E8J"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();

export { auth, googleAuthProvider }; 