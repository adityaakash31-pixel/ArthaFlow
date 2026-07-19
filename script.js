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

    incomeHistory.forEach(function(item, index){

        let li = document.createElement("li");

        li.innerHTML =
item.category + " - ₹" + item.amount +
' <button onclick="editIncome(' + index + ')">✏️</button> ' +
' <button onclick="deleteIncome(' + index + ')">🗑</button>';

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
function deleteIncome(index){

    if(!confirm("Delete this income?")){
        return;
    }

    totalIncome =
    totalIncome - incomeHistory[index].amount;

    localStorage.setItem(
        "totalIncome",
        totalIncome
    );

    incomeHistory.splice(index,1);

    localStorage.setItem(
        "incomeHistory",
        JSON.stringify(incomeHistory)
    );

    location.reload();

}
function editIncome(index){

    let newAmount = prompt(
        "Enter New Amount",
        incomeHistory[index].amount
    );

    if(newAmount == null){
        return;
    }

    newAmount = Number(newAmount);

    if(newAmount <= 0){
        alert("Invalid Amount");
        return;
    }

    totalIncome =
        totalIncome
        - incomeHistory[index].amount
        + newAmount;

    incomeHistory[index].amount = newAmount;

    localStorage.setItem(
        "incomeHistory",
        JSON.stringify(incomeHistory)
    );

    localStorage.setItem(
        "totalIncome",
        totalIncome
    );

    location.reload();

}
