import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAYdrnPOgZ0uRgo73fb5yTw2cQAXa42x4k",
  authDomain: "dongsim-vip.firebaseapp.com",
  projectId: "dongsim-vip",
  storageBucket: "dongsim-vip.firebasestorage.app",
  messagingSenderId: "1012739066414",
  appId: "1:1012739066414:web:9338b647499d51b845adbf",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);