import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.1/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDM8WtiKL5hSSoDH4BoacMUIQ3QVSpjxJI",
    authDomain: "arthaflow-4d670.firebaseapp.com",
    projectId: "arthaflow-4d670",
    storageBucket: "arthaflow-4d670.firebasestorage.app",
    messagingSenderId: "417281404304",
    appId: "1:417281404304:web:a0b9fa5a787ad0426d5715",
    measurementId: "G-785TXW9WTL"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };
