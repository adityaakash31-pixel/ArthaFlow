// ===============================
// ArthaFlow V1.0
// Step 9
// ===============================

// Total Income
let totalIncome =
Number(localStorage.getItem("totalIncome")) || 0;

// Total Expense
let totalExpense =
Number(localStorage.getItem("totalExpense")) || 0;

// Expense History
let expenseHistory =
JSON.parse(localStorage.getItem("expenseHistory")) || [];

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

    list.innerHTML = "";

    incomeHistory.forEach(function(item, index){

        let li = document.createElement("li");

        li.innerHTML =
item.category +
" - ₹" + item.amount +
" | 📅 " + item.date +
" | 📝 " + item.note +
' <button onclick="editIncome(' + index + ')">✏️</button> ' +
' <button onclick="deleteIncome(' + index + ')">🗑️</button>';

        list.appendChild(li);

    });

}

let dashboardIncome =
document.getElementById("dashboardIncome");

if(dashboardIncome){
    dashboardIncome.innerText = "₹" + totalIncome;
}

let totalEntries =
document.getElementById("totalEntries");

if(totalEntries){
    totalEntries.innerText = incomeHistory.length;
}

// Expense Total
let expenseBox =
document.getElementById("totalExpense");

if(expenseBox){
    expenseBox.innerText = "₹" + totalExpense;
}

// Expense History
let expenseList =
document.getElementById("expenseList");

if(expenseList){

    expenseList.innerHTML = "";

    expenseHistory.forEach(function(item,index){

        let li = document.createElement("li");

        li.innerHTML =
        item.category +
        " - ₹" + item.amount +
        ' <button onclick="editExpense('+index+')">✏️</button> ' +
        ' <button onclick="deleteExpense('+index+')">🗑️</button>';

        expenseList.appendChild(li);

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

    let date = document.getElementById("incomeDate").value;
let note = document.getElementById("incomeNote").value;

    totalIncome = totalIncome + amount;
    localStorage.setItem(
    "totalIncome",
    totalIncome
);

    incomeHistory.push({
    category: category,
    amount: amount,
    date: date,
    note: note
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
function searchIncome(){

    let input =
    document.getElementById("searchIncome").value.toLowerCase();

    let list =
    document.getElementById("incomeList");

    let items =
    list.getElementsByTagName("li");

    for(let i = 0; i < items.length; i++){

        let text =
        items[i].innerText.toLowerCase();

        if(text.indexOf(input) > -1){
            items[i].style.display = "";
        }else{
            items[i].style.display = "none";
        }

    }

}
function saveExpense(){

    let category =
    document.getElementById("expenseCategory").value;

    let amount =
    Number(document.getElementById("expenseAmount").value);

    if(category==""){
        alert("Enter Category");
        return;
    }

    if(amount<=0){
        alert("Enter Amount");
        return;
    }

    expenseHistory.push({
        category:category,
        amount:amount
    });

    localStorage.setItem(
        "expenseHistory",
        JSON.stringify(expenseHistory)
    );

    totalExpense += amount;

    localStorage.setItem(
        "totalExpense",
        totalExpense
    );

    location.reload();

}
