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

window.onload = function () {

    let incomeBox = document.getElementById("totalIncome");
    if (incomeBox) {
        incomeBox.innerText = "₹" + totalIncome;
    }

    let expenseBox = document.getElementById("totalExpense");
    if (expenseBox) {
        expenseBox.innerText = "₹" + totalExpense;
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
" | 📅 " + item.date +
" | 📝 " + item.note +
' <button onclick="editExpense(' + index + ')">✏️</button> ' +
' <button onclick="deleteExpense(' + index + ')">🗑️</button>';
        
        expenseList.appendChild(li);

    });

}

// Dashboard Expense
let dashboardExpense =
document.getElementById("dashboardExpense");

if(dashboardExpense){
    dashboardExpense.innerText = "₹" + totalExpense;
}

// Dashboard Balance
let dashboardBalance =
document.getElementById("dashboardBalance");

if(dashboardBalance){
    dashboardBalance.innerText =
    "₹" + (totalIncome - totalExpense);
}

let dashboardSavings =
document.getElementById("dashboardSavings");

if(dashboardSavings){
    dashboardSavings.innerText =
    "₹" + (totalIncome - totalExpense);
}

let monthIncome =
document.getElementById("monthIncome");

let monthExpense =
document.getElementById("monthExpense");

let monthBalance =
document.getElementById("monthBalance");

if(monthIncome){
    monthIncome.innerText = "₹" + totalIncome;
}

if(monthExpense){
    monthExpense.innerText = "₹" + totalExpense;
}

if(monthBalance){
    monthBalance.innerText =
    "₹" + (totalIncome - totalExpense);
}

if(localStorage.getItem("theme")=="dark"){
    document.body.classList.add("dark-mode");
    let btn=document.getElementById("themeBtn");
    if(btn){
        btn.innerHTML="☀️ Light Mode";
    }
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
document.getElementById("incomeDate").value = "";
document.getElementById("incomeNote").value = "";

location.reload();

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

    let date =
document.getElementById("expenseDate").value;

let note =
document.getElementById("expenseNote").value;

    if(category==""){
        alert("Enter Category");
        return;
    }

    if(amount<=0){
        alert("Enter Amount");
        return;
    }

    expenseHistory.push({
    category: category,
    amount: amount,
    date: date,
    note: note
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

        document.getElementById("expenseDate").value = "";
document.getElementById("expenseNote").value = "";

    location.reload();

}
function deleteExpense(index){

    if(!confirm("Delete this expense?")){
        return;
    }

    totalExpense -= expenseHistory[index].amount;

    localStorage.setItem(
        "totalExpense",
        totalExpense
    );

    expenseHistory.splice(index,1);

    localStorage.setItem(
        "expenseHistory",
        JSON.stringify(expenseHistory)
    );

    location.reload();

}
function editExpense(index){

    let newAmount = prompt(
        "Enter New Amount",
        expenseHistory[index].amount
    );

    if(newAmount==null){
        return;
    }

    newAmount = Number(newAmount);

    if(newAmount<=0){
        return;
    }

    totalExpense =
    totalExpense
    - expenseHistory[index].amount
    + newAmount;

    expenseHistory[index].amount = newAmount;

    localStorage.setItem(
        "expenseHistory",
        JSON.stringify(expenseHistory)
    );

    localStorage.setItem(
        "totalExpense",
        totalExpense
    );

    location.reload();

       }
// ===============================
// Reports
// ===============================

let reportIncome =
document.getElementById("reportIncome");

if(reportIncome){
    reportIncome.innerText = "₹" + totalIncome;
}

let reportExpense =
document.getElementById("reportExpense");

if(reportExpense){
    reportExpense.innerText = "₹" + totalExpense;
}

let reportBalance =
document.getElementById("reportBalance");

if(reportBalance){
    reportBalance.innerText =
    "₹" + (totalIncome - totalExpense);
}

let reportTransactions =
document.getElementById("reportTransactions");

if(reportTransactions){
    reportTransactions.innerText =
    incomeHistory.length + expenseHistory.length;
}

let reportSavings =
document.getElementById("reportSavings");

if(reportSavings){
    reportSavings.innerText =
    "₹" + (totalIncome - totalExpense);
}
// Monthly Summary


function resetData(){

if(confirm("Are you sure?\nAll Data will be deleted.")){

localStorage.clear();

alert("All Data Deleted Successfully");

location.href="index.html";

}

let financeChart =
document.getElementById("financeChart");

if(financeChart){

new Chart(financeChart,{

type:"pie",

data:{

labels:[
"Income",
"Expense",
"Balance"
],

datasets:[{

data:[
totalIncome,
totalExpense,
totalIncome-totalExpense
],

backgroundColor:[
"#4CAF50",
"#F44336",
"#2196F3"
],

borderColor:"#ffffff",

borderWidth:2

}]

},

options:{

responsive:true,

plugins:{

legend:{

position:"bottom"

},

title:{

display:true,

text:"ArthaFlow Finance Overview"

}

}

}

});

    }

function toggleTheme(){

    document.body.classList.toggle("dark-mode");

    if(document.body.classList.contains("dark-mode")){
        localStorage.setItem("theme","dark");
        document.getElementById("themeBtn").innerHTML="☀️ Light Mode";
    }else{
        localStorage.setItem("theme","light");
        document.getElementById("themeBtn").innerHTML="🌙 Dark Mode";
    }

}
}
