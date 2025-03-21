// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {initializeAuth, getReactNativePersistence} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALg_ev--stXiysSh1oLGBLPzID_kcSdlA",
  authDomain: "budgetbuddy-1d6a7.firebaseapp.com",
  projectId: "budgetbuddy-1d6a7",
  storageBucket: "budgetbuddy-1d6a7.firebasestorage.app",
  messagingSenderId: "135001859282",
  appId: "1:135001859282:web:6dba32b363e29ff2cc790b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//auth
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
})

//db
export const firestore = getFirestore(app)