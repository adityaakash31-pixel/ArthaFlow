// ===============================
// ArthaFlow Firebase Connection
// Phase 11A - Step 4.2
// ===============================

const firebaseConfig = {
    apiKey: "AIzaSyDM8WtiKL5hSSoDH4BoacMUIQ3QVSpjxJI",
    authDomain: "arthaflow-4d670.firebaseapp.com",
    projectId: "arthaflow-4d670",
    storageBucket: "arthaflow-4d670.firebasestorage.app",
    messagingSenderId: "417281404304",
    appId: "1:417281404304:web:a0b9fa5a787ad0426d5715",
    measurementId: "G-785TXW9WTL"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

console.log("✅ Firebase Connected");
