// ==========================================
// ArthaFlow Cloud Sync
// Phase 11A - Firestore Cloud Sync
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
    getApp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";


// ==========================================
// Firebase App
// ==========================================

const app = getApp();

const auth = getAuth(app);

const db = getFirestore(app);

console.log("✅ ArthaFlow Firestore Ready");


// ==========================================
// Auth State
// ==========================================

let currentUser = null;

let authReadyResolve;

const authReady = new Promise(function(resolve){

    authReadyResolve = resolve;

});


onAuthStateChanged(auth, function(user){

    currentUser = user;

    if(user){

        console.log(
            "☁️ Cloud User:",
            user.email
        );

        window.dispatchEvent(
            new CustomEvent(
                "arthaFlowAuthReady",
                {
                    detail: {
                        email: user.email || ""
                    }
                }
            )
        );

    }else{

        console.log(
            "☁️ No Firebase user logged in"
        );

    }

    authReadyResolve(user);

});


// ==========================================
// Collect ArthaFlow Data
// ==========================================

function getArthaFlowData(){

    return {

        totalIncome:
            Number(
                localStorage.getItem("totalIncome")
            ) || 0,

        totalExpense:
            Number(
                localStorage.getItem("totalExpense")
            ) || 0,

        incomeHistory:
            JSON.parse(
                localStorage.getItem("incomeHistory")
            ) || [],

        expenseHistory:
            JSON.parse(
                localStorage.getItem("expenseHistory")
            ) || [],

        userName:
            localStorage.getItem("userName") || "",

        monthlyBudget:
            Number(
                localStorage.getItem("monthlyBudget")
            ) || 0,

        theme:
            localStorage.getItem("theme") || "light",

        userEmail:
            localStorage.getItem("userEmail") || "",

        updatedAt:
            new Date().toISOString()

    };

}


// ==========================================
// SAVE DATA TO FIRESTORE
// ==========================================

async function saveArthaFlowToCloud(){

    try{

        const user = await authReady;

        if(!user){

            console.log(
                "☁️ Cloud Save skipped: User not logged in"
            );

            return false;

        }


        const data =
            getArthaFlowData();


        const userRef =
            doc(
                db,
                "users",
                user.uid
            );


        await setDoc(
            userRef,
            data,
            {
                merge:true
            }
        );


        console.log(
            "☁️ ArthaFlow data saved to Firestore"
        );

        return true;


    }catch(error){

        console.error(
            "❌ Cloud Save Error:",
            error
        );

        return false;

    }

}


// ==========================================
// LOAD DATA FROM FIRESTORE
// ==========================================

async function loadArthaFlowFromCloud(){

    try{

        const user = await authReady;

        if(!user){

            console.log(
                "☁️ Cloud Load skipped: User not logged in"
            );

            return false;

        }


        const userRef =
            doc(
                db,
                "users",
                user.uid
            );


        const snapshot =
            await getDoc(userRef);


        if(!snapshot.exists()){

            console.log(
                "☁️ No cloud data found"
            );

            return false;

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


        if(data.userEmail !== undefined){

            localStorage.setItem(
                "userEmail",
                data.userEmail
            );

        }


        console.log(
            "☁️ ArthaFlow cloud data loaded"
        );

        return true;


    }catch(error){

        console.error(
            "❌ Cloud Load Error:",
            error
        );

        return false;

    }

}


// ==========================================
// Make Functions Available
// ==========================================

window.saveArthaFlowToCloud =
    saveArthaFlowToCloud;

window.loadArthaFlowFromCloud =
    loadArthaFlowFromCloud;

// ==========================================
// Profile Email Access
// ==========================================

window.getArthaFlowUserEmail = function(){

    if(currentUser){

        return currentUser.email || "";

    }

    return "";

};
