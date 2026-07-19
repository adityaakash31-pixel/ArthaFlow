// ===============================
// ArthaFlow V1.0
// Step 9
// ===============================

// Total Income
let totalIncome =
Number(localStorage.getItem("totalIncome")) || 0;

// Income History
let incomeHistory =
JSON.parse(localStorage.getItem("incomeHistory")) || [];

window.onload = function(){

    let incomeBox =
    document.getElementById("totalIncome");

    if(incomeBox){
        incomeBox.innerText = "₹" + totalIncome;
    }

};

let list = document.getElementById("incomeList");

if(list){

    incomeHistory.forEach(function(item){

        let li = document.createElement("li");

        li.innerText =
        item.category + " - ₹" + item.amount;

        list.appendChild(li);

    });

}

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
    localStorage.setItem(
    "totalIncome",
    totalIncome
);

    incomeHistory.push({
    category: category,
    amount: amount
});

localStorage.setItem(
    "incomeHistory",
    JSON.stringify(incomeHistory)
);

    alert("Income Saved Successfully");

    document.getElementById("category").value = "";
    document.getElementById("amount").value = "";

}
