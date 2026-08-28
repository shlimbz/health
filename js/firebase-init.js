// Firebase 초기화
// 아래 firebaseConfig 값은 Firebase 콘솔 > 프로젝트 설정 > 일반 > 내 앱(웹 앱)에서 발급받은 값으로 교체하세요.
// https://console.firebase.google.com/

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyB0MHCg7d99btFqP50JoaMZMsIgmGDuLww",
    authDomain: "health-9e732.firebaseapp.com",
    projectId: "health-9e732",
    storageBucket: "health-9e732.firebasestorage.app",
    messagingSenderId: "783206050264",
    appId: "1:783206050264:web:669a200066274763b4eaad"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  fbSignOut,
  onAuthStateChanged,
  updateProfile,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
};
