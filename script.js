// ===============================
// ArthaFlow V1.0
// Step 9
// ===============================

// Total Income
let totalIncome = 0;

// Save Income
function saveIncome() {

    let category = document.getElementById("category").value;
    let amount = Number(document.getElementById("amount").value);

    if (category === "") {
        alert("Please enter category");
        return;
    }

    if (amount <= 0) {
        alert("Please enter valid amount");
        return;
    }

    totalIncome = totalIncome + amount;

    alert("Income Saved Successfully");

    document.getElementById("category").value = "";
    document.getElementById("amount").value = "";

}
