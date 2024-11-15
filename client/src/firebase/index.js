// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCI6P4PC9wHsupA2YV3sYneotBToahN5hA",
  authDomain: "m26-upload.firebaseapp.com",
  projectId: "m26-upload",
  storageBucket: "m26-upload.appspot.com",
  messagingSenderId: "1070758593409",
  appId: "1:1070758593409:web:3878758a8148d55ecb5e80"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage(app)

export {storage}