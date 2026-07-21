// ===============================
// ArthaFlow V1.0
// Main Script
// ===============================

// ---------- Local Storage ----------
let totalIncome = Number(localStorage.getItem("totalIncome")) || 0;
let totalExpense = Number(localStorage.getItem("totalExpense")) || 0;

let incomeHistory =
JSON.parse(localStorage.getItem("incomeHistory")) || [];

let expenseHistory =
JSON.parse(localStorage.getItem("expenseHistory")) || [];

// ---------- Dashboard ----------
window.onload = function(){

let incomeBox=document.getElementById("totalIncome");
if(incomeBox){
incomeBox.innerText="₹"+totalIncome;
}

let expenseBox=document.getElementById("totalExpense");
if(expenseBox){
expenseBox.innerText="₹"+totalExpense;
}

let dashboardIncome=document.getElementById("dashboardIncome");
if(dashboardIncome){
dashboardIncome.innerText="₹"+totalIncome;
}

let dashboardExpense=document.getElementById("dashboardExpense");
if(dashboardExpense){
dashboardExpense.innerText="₹"+totalExpense;
}

let dashboardBalance=document.getElementById("dashboardBalance");
if(dashboardBalance){
dashboardBalance.innerText="₹"+(totalIncome-totalExpense);
}

let dashboardSavings=document.getElementById("dashboardSavings");
if(dashboardSavings){
dashboardSavings.innerText="₹"+(totalIncome-totalExpense);
}

let totalEntries=document.getElementById("totalEntries");
if(totalEntries){
totalEntries.innerText=
incomeHistory.length+expenseHistory.length;
}

    // ---------- Monthly Summary ----------
let monthIncome = document.getElementById("monthIncome");
if(monthIncome){
    monthIncome.innerText = "₹" + totalIncome;
}

let monthExpense = document.getElementById("monthExpense");
if(monthExpense){
    monthExpense.innerText = "₹" + totalExpense;
}

let monthBalance = document.getElementById("monthBalance");
if(monthBalance){
    monthBalance.innerText = "₹" + (totalIncome - totalExpense);
}

// ---------- Dark Mode ----------
if(localStorage.getItem("theme")=="dark"){
    document.body.classList.add("dark-mode");

    let btn=document.getElementById("themeBtn");
    if(btn){
        btn.innerHTML="☀️ Light Mode";
    }
}

// ---------- Income List ----------
let incomeList=document.getElementById("incomeList");

if(incomeList){

    incomeList.innerHTML="";

    incomeHistory.forEach(function(item,index){

        let li=document.createElement("li");

        li.innerHTML=
        item.category+
        " - ₹"+item.amount+
        " | 📅 "+item.date+
        " | 📝 "+item.note+
        ' <button onclick="editIncome('+index+')">✏️</button> '+
        ' <button onclick="deleteIncome('+index+')">🗑️</button>';

        incomeList.appendChild(li);

    });

}

// ---------- Expense List ----------
let expenseList=document.getElementById("expenseList");

if(expenseList){

    expenseList.innerHTML="";

    expenseHistory.forEach(function(item,index){

        let li=document.createElement("li");

        li.innerHTML=
        item.category+
        " - ₹"+item.amount+
        " | 📅 "+item.date+
        " | 📝 "+item.note+
        ' <button onclick="editExpense('+index+')">✏️</button> '

// ===============================
// Save Income
// ===============================

function saveIncome(){

    let category =
    document.getElementById("category").value.trim();

    let amount =
    Number(document.getElementById("amount").value);

    let date =
    document.getElementById("incomeDate").value;

    let note =
    document.getElementById("incomeNote").value;

    if(category==""){
        alert("Please enter category");
        return;
    }

    if(amount<=0 || isNaN(amount)){
        alert("Please enter valid amount");
        return;
    }

    incomeHistory.push({
        category:category,
        amount:amount,
        date:date,
        note:note
    });

    totalIncome += amount;

    localStorage.setItem(
        "incomeHistory",
        JSON.stringify(incomeHistory)
    );

    localStorage.setItem(
        "totalIncome",
        totalIncome
    );

    alert("✅ Income Saved Successfully");

    location.reload();

}

// ===============================
// Delete Income
// ===============================

function deleteIncome(index){

    if(!confirm("Delete this income?")){
        return;
    }

    totalIncome -= incomeHistory[index].amount;

    incomeHistory.splice(index,1);

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

// ===============================
// Edit Income
// ===============================

function editIncome(index){

    let newAmount = prompt(
        "Enter New Amount",
        incomeHistory[index].amount
    );

    if(newAmount == null){
        return;
    }

    newAmount = Number(newAmount);

    if(newAmount <= 0 || isNaN(newAmount)){
        alert("Invalid Amount");
        return;
    }

    totalIncome =
    totalIncome -
    incomeHistory[index].amount +
    newAmount;

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

// ===============================
// Search Income
// ===============================

function searchIncome(){

    let input =
    document.getElementById("searchIncome").value.toLowerCase();

    let list =
    document.getElementById("incomeList");

    if(!list) return;

    let items =
    list.getElementsByTagName("li");

    for(let i=0;i<items.length;i++){

        let text =
        items[i].innerText.toLowerCase();

        if(text.indexOf(input)>-1){
            items[i].style.display="";
        }else{
            items[i].style.display="none";
        }

    }

}

// ===============================
// Save Expense
// ===============================

function saveExpense(){

    let category =
    document.getElementById("expenseCategory").value.trim();

    let amount =
    Number(document.getElementById("expenseAmount").value);

    let date =
    document.getElementById("expenseDate").value;

    let note =
    document.getElementById("expenseNote").value;

    if(category==""){
        alert("Enter Category");
        return;

 // ===============================
// Delete Expense
// ===============================

function deleteExpense(index){

    if(!confirm("Delete this expense?")){
        return;
    }

    totalExpense -= expenseHistory[index].amount;

    expenseHistory.splice(index,1);

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
// Edit Expense
// ===============================

function editExpense(index){

    let newAmount = prompt(
        "Enter New Amount",
        expenseHistory[index].amount
    );

    if(newAmount==null) return;

    newAmount = Number(newAmount);

    if(newAmount<=0 || isNaN(newAmount)){
        alert("Invalid Amount");
        return;
    }

    totalExpense =
    totalExpense -
    expenseHistory[index].amount +
    newAmount;

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

let reportIncome=document.getElementById("reportIncome");
if(reportIncome) reportIncome.innerText="₹"+totalIncome;

let reportExpense=document.getElementById("reportExpense");
if(reportExpense) reportExpense.innerText="₹"+totalExpense;

let reportBalance=document.getElementById("reportBalance");
if(reportBalance)
reportBalance.innerText="₹"+(totalIncome-totalExpense);

let reportSavings=document.getElementById("reportSavings");
if(reportSavings)
reportSavings.innerText="₹"+(totalIncome-totalExpense);

let reportTransactions=document.getElementById("reportTransactions");
if(reportTransactions)
reportTransactions.innerText=
incomeHistory.length+expenseHistory.length;

// ===============================
// Reset Data
// ===============================

function resetData(){

    if(confirm("Are you sure?\nAll data will be deleted.")){

        localStorage.clear();

        alert("Data Deleted Successfully");

        location.href="index.html";
    }

}

// ===============================
// Finance Chart
// ===============================

let financeChart=document.getElementById("financeChart");

if(financeChart){

new Chart(financeChart,{

type:"pie",

data:{
labels:["Income","Expense","Balance"],

datasets:[{

data:[
totalIncome,
totalExpense,
Math.max(totalIncome-totalExpense,0)
],

backgroundColor:[
"#4CAF50",
"#F44336",
"#2196F3"
]

}]
},

options:{
responsive:true,
plugins:{
legend:{
position
