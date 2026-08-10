// ==========================================
// ArthaFlow Authentication Guard
// STEP 5
// ==========================================

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
    getApp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";


// ==========================================
// Firebase
// ==========================================

const app = getApp();

const auth = getAuth(app);


// ==========================================
// Authentication Protection
// ==========================================

onAuthStateChanged(auth, function(user){

    if(user){

        console.log(
            "🔐 Auth Guard: User Logged In"
        );

        console.log(
            "👤 User:",
            user.email || ""
        );

        return;

    }


    // ======================================
    // User Not Logged In
    // ======================================

    console.log(
        "🔒 Auth Guard: No User Logged In"
    );


    // Remove login session

    sessionStorage.removeItem(
        "loggedIn"
    );

    sessionStorage.removeItem(
        "pinVerified"
    );


    // Go to Login

    window.location.replace(
        "login.html"
    );

});
