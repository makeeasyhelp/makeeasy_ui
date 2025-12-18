// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0xMmQ4PdPhC2pc53cMMq-Une0QQpmYtg",
  authDomain: "makeeasy-9e80c.firebaseapp.com",
  projectId: "makeeasy-9e80c",
  storageBucket: "makeeasy-9e80c.appspot.com",
  messagingSenderId: "824330259956",
  appId: "1:824330259956:web:2a4ea4f056341f250f7da1",
  measurementId: "G-ZHNRFNSJJP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export it
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

export default app;
