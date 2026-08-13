// ==========================================
// ArthaFlow Cloud Sync
// MULTI-USER FIRESTORE VERSION
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
// FIREBASE
// ==========================================

const app = getApp();
const auth = getAuth(app);
const db = getFirestore(app);

console.log("✅ ArthaFlow Firestore Ready");


// ==========================================
// CURRENT USER
// ==========================================

let currentUser = null;
let authReadyResolve;

const authReady = new Promise(function(resolve) {
    authReadyResolve = resolve;
});


// ==========================================
// AUTH STATE
// ==========================================

onAuthStateChanged(auth, function(user) {

    currentUser = user;

    if (user) {

        console.log(
            "☁️ Cloud User:",
            user.email
        );

        // Save UID for other ArthaFlow scripts
        localStorage.setItem(
            "firebaseUID",
            user.uid
        );

        // Save email
        localStorage.setItem(
            "userEmail",
            user.email || ""
        );

        window.dispatchEvent(
            new CustomEvent(
                "arthaFlowAuthReady",
                {
                    detail: {
                        uid: user.uid,
                        email: user.email || ""
                    }
                }
            )
        );

    } else {

        console.log(
            "☁️ No Firebase user logged in"
        );

    }

    authReadyResolve(user);

});


// ==========================================
// GET USER STORAGE KEY
// ==========================================

function getUserKey(uid) {

    return uid || "guest";

}


// ==========================================
// COLLECT USER-SPECIFIC DATA
// ==========================================

function getArthaFlowData(uid) {

    const userKey =
        getUserKey(uid);


    const incomeKey =
        "totalIncome_" + userKey;

    const expenseKey =
        "totalExpense_" + userKey;

    const incomeHistoryKey =
        "incomeHistory_" + userKey;

    const expenseHistoryKey =
        "expenseHistory_" + userKey;


    return {

        totalIncome:
            Number(
                localStorage.getItem(
                    incomeKey
                )
            ) || 0,


        totalExpense:
            Number(
                localStorage.getItem(
                    expenseKey
                )
            ) || 0,


        incomeHistory:
            JSON.parse(
                localStorage.getItem(
                    incomeHistoryKey
                )
            ) || [],


        expenseHistory:
            JSON.parse(
                localStorage.getItem(
                    expenseHistoryKey
                )
            ) || [],


        userName:
            localStorage.getItem(
                "userName"
            ) || "",


        monthlyBudget:
            Number(
                localStorage.getItem(
                    "monthlyBudget_" + userKey
                )
            ) || 0,


        theme:
            localStorage.getItem(
                "theme_" + userKey
            ) || "light",


        userEmail:
            currentUser
                ? currentUser.email || ""
                : "",


        uid:
            uid,


        updatedAt:
            new Date().toISOString()

    };

}


// ==========================================
// SAVE TO FIRESTORE
// ==========================================

async function saveArthaFlowToCloud() {

    try {

        const user =
            await authReady;


        if (!user) {

            console.log(
                "☁️ Cloud Save skipped: User not logged in"
            );

            return false;

        }


        const data =
            getArthaFlowData(
                user.uid
            );


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
                merge: true
            }
        );


        console.log(
            "☁️ ArthaFlow data saved to Firestore"
        );

        return true;


    } catch (error) {

        console.error(
            "❌ Cloud Save Error:",
            error
        );

        return false;

    }

}


// ==========================================
// LOAD FROM FIRESTORE
// ==========================================

async function loadArthaFlowFromCloud() {

    try {

        const user =
            await authReady;


        if (!user) {

            console.log(
                "☁️ Cloud Load skipped: User not logged in"
            );

            return false;

        }


        const userKey =
            user.uid;


        const userRef =
            doc(
                db,
                "users",
                user.uid
            );


        const snapshot =
            await getDoc(
                userRef
            );


        if (!snapshot.exists()) {

            console.log(
                "☁️ No cloud data found for this user"
            );

            return false;

        }


        const data =
            snapshot.data();


        // ======================================
        // USER-SPECIFIC KEYS
        // ======================================

        const incomeKey =
            "totalIncome_" + userKey;

        const expenseKey =
            "totalExpense_" + userKey;

        const incomeHistoryKey =
            "incomeHistory_" + userKey;

        const expenseHistoryKey =
            "expenseHistory_" + userKey;

        const budgetKey =
            "monthlyBudget_" + userKey;

        const themeKey =
            "theme_" + userKey;


        // ======================================
        // INCOME
        // ======================================

        if (
            data.totalIncome !== undefined
        ) {

            localStorage.setItem(
                incomeKey,
                data.totalIncome
            );

        }


        // ======================================
        // EXPENSE
        // ======================================

        if (
            data.totalExpense !== undefined
        ) {

            localStorage.setItem(
                expenseKey,
                data.totalExpense
            );

        }


        // ======================================
        // INCOME HISTORY
        // ======================================

        if (
            data.incomeHistory !== undefined
        ) {

            localStorage.setItem(
                incomeHistoryKey,
                JSON.stringify(
                    data.incomeHistory
                )
            );

        }


        // ======================================
        // EXPENSE HISTORY
        // ======================================

        if (
            data.expenseHistory !== undefined
        ) {

            localStorage.setItem(
                expenseHistoryKey,
                JSON.stringify(
                    data.expenseHistory
                )
            );

        }


        // ======================================
        // USER NAME
        // ======================================

        if (
            data.userName !== undefined
        ) {

            localStorage.setItem(
                "userName",
                data.userName
            );

        }


        // ======================================
        // MONTHLY BUDGET
        // ======================================

        if (
            data.monthlyBudget !== undefined
        ) {

            localStorage.setItem(
                budgetKey,
                data.monthlyBudget
            );

        }


        // ======================================
        // THEME
        // ======================================

        if (
            data.theme !== undefined
        ) {

            localStorage.setItem(
                themeKey,
                data.theme
            );

        }


        // ======================================
        // EMAIL
        // ======================================

        if (
            data.userEmail !== undefined
        ) {

            localStorage.setItem(
                "userEmail",
                data.userEmail
            );

        }


        console.log(
            "☁️ ArthaFlow cloud data loaded"
        );

        return true;


    } catch (error) {

        console.error(
            "❌ Cloud Load Error:",
            error
        );

        return false;

    }

}


// ==========================================
// GLOBAL FUNCTIONS
// ==========================================

window.saveArthaFlowToCloud =
    saveArthaFlowToCloud;


window.loadArthaFlowFromCloud =
    loadArthaFlowFromCloud;


// ==========================================
// GET USER EMAIL
// ==========================================

window.getArthaFlowUserEmail =
    function() {

        if (currentUser) {

            return (
                currentUser.email || ""
            );

        }

        return "";

    };


// ==========================================
// GET USER UID
// ==========================================

window.getArthaFlowUserUID =
    function() {

        if (currentUser) {

            return (
                currentUser.uid || ""
            );

        }

        return "";

    };
