// ======================================
// ArthaFlow - Firebase Configuration
// ======================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "APKI_FIREBASE_API_KEY",
    authDomain: "arthaflow-4d670.firebaseapp.com",
    projectId: "arthaflow-4d670",
    storageBucket: "arthaflow-4d670.firebasestorage.app",
    messagingSenderId: "APKA_SENDER_ID",
    appId: "APKA_APP_ID"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
