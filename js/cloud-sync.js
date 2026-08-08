// ==========================================
// ArthaFlow Cloud Sync
// Phase 11A - Step 4.3A
// ==========================================

import {
    getFirestore,
    doc,
    setDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";


// ==========================================
// Firebase Configuration
// ==========================================

const firebaseConfig = {

    apiKey:
    "AIzaSyDM8WtiKL5hSSoDH4BoacMUIQ3QVSpjxJI",

    authDomain:
    "arthaflow-4d670.firebaseapp.com",

    projectId:
    "arthaflow-4d670",

    storageBucket:
    "arthaflow-4d670.firebasestorage.app",

    messagingSenderId:
    "417281404304",

    appId:
    "1:417281404304:web:a0b9fa5a787ad0426d5715",

    measurementId:
    "G-785TXW9WTL"
};


// ==========================================
// Firebase Initialize
// ==========================================

const app =
    initializeApp(firebaseConfig);

const auth =
    getAuth(app);

const db =
    getFirestore(app);


console.log(
    "✅ ArthaFlow Firestore Ready"
);


// ==========================================
// Current User
// ==========================================

let currentUser = null;


onAuthStateChanged(
    auth,
    function(user){

        if(user){

            currentUser = user;

            console.log(
                "☁️ Cloud User:",
                user.email
            );

        }else{

            currentUser = null;

            console.log(
                "No Firebase user logged in"
            );

        }

    }
);


// ==========================================
// Collect ArthaFlow Data
// ==========================================

function getArthaFlowData(){

    return {

        totalIncome:
            Number(
                localStorage.getItem(
                    "totalIncome"
                )
            ) || 0,

        totalExpense:
            Number(
                localStorage.getItem(
                    "totalExpense"
                )
            ) || 0,

        incomeHistory:
            JSON.parse(
                localStorage.getItem(
                    "incomeHistory"
                )
            ) || [],

        expenseHistory:
            JSON.parse(
                localStorage.getItem(
                    "expenseHistory"
                )
            ) || [],

        userName:
            localStorage.getItem(
                "userName"
            ) || "",

        monthlyBudget:
            Number(
                localStorage.getItem(
                    "monthlyBudget"
                )
            ) || 0,

        theme:
            localStorage.getItem(
                "theme"
            ) || "light",

        userEmail:
            localStorage.getItem(
                "userEmail"
            ) || "",

        updatedAt:
            new Date().toISOString()

    };

}


// ==========================================
// Save Data To Firestore
// ==========================================

async function saveArthaFlowToCloud(){

    if(!currentUser){

        console.log(
            "Cloud Save skipped: User not logged in"
        );

        return;

    }


    try{

        const data =
            getArthaFlowData();


        const userRef =
            doc(
                db,
                "users",
                currentUser.uid
            );


        await setDoc(
            userRef,
            data,
            {
                merge: true
            }
        );


        console.log(
            "☁️ ArthaFlow data saved to Firestore"
        );


    }catch(error){

        console.error(
            "❌ Cloud Save Error:",
            error
        );

    }

}


// ==========================================
// Load Data From Firestore
// ==========================================

async function loadArthaFlowFromCloud(){

    if(!currentUser){

        return;

    }


    try{

        const userRef =
            doc(
                db,
                "users",
                currentUser.uid
            );


        const snapshot =
            await getDoc(userRef);


        if(!snapshot.exists()){

            console.log(
                "No cloud data found"
            );

            return;

        }


        const data =
            snapshot.data();


        if(data.totalIncome !== undefined){

            localStorage.setItem(
                "totalIncome",
                data.totalIncome
            );

        }


        if(data.totalExpense !== undefined){

            localStorage.setItem(
                "totalExpense",
                data.totalExpense
            );

        }


        if(data.incomeHistory !== undefined){

            localStorage.setItem(
                "incomeHistory",
                JSON.stringify(
                    data.incomeHistory
                )
            );

        }


        if(data.expenseHistory !== undefined){

            localStorage.setItem(
                "expenseHistory",
                JSON.stringify(
                    data.expenseHistory
                )
            );

        }


        if(data.userName !== undefined){

            localStorage.setItem(
                "userName",
                data.userName
            );

        }


        if(data.monthlyBudget !== undefined){

            localStorage.setItem(
                "monthlyBudget",
                data.monthlyBudget
            );

        }


        if(data.theme !== undefined){

            localStorage.setItem(
                "theme",
                data.theme
            );

        }


        console.log(
            "☁️ ArthaFlow cloud data loaded"
        );


    }catch(error){

        console.error(
            "❌ Cloud Load Error:",
            error
        );

    }

}


// ==========================================
// Make Functions Available
// ==========================================

window.saveArthaFlowToCloud =
    saveArthaFlowToCloud;

window.loadArthaFlowFromCloud =
    loadArthaFlowFromCloud;
