// Login Check
if (
    !window.location.pathname.includes("login.html") &&
    !window.location.pathname.includes("splash.html")
) {
    if (sessionStorage.getItem("loggedIn") !== "true") {
    window.location.href = "login.html";
    }
}

// ===============================
// Phase 93A.1
// ===============================

const BRAND = {

    APP_NAME: "ArthaFlow",

    VERSION: "1.0 Premium",

    DEVELOPER: "Aditya Aakash",

    TAGLINE: "Smart Finance Manager"

};

// ===============================
// Phase 93A.2
// ===============================

function loadBrandLogo(){

    let logos = document.querySelectorAll(".brandLogo");

    logos.forEach(function(item){

        item.innerHTML = `
<a href="index.html" class="brandLink">

<div class="brandTitle">💎 ${BRAND.APP_NAME}</div>

<div class="brandTagline">${BRAND.TAGLINE}</div>

<div class="brandVersion">v${BRAND.VERSION}</div>

</a>
`;

    });

}

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

document.addEventListener("DOMContentLoaded", function () {

    loadBrandLogo();

    totalIncome = Number(localStorage.getItem("totalIncome")) || 0;
    totalExpense = Number(localStorage.getItem("totalExpense")) || 0;

    const incomeBox = document.getElementById("totalIncome");
    if (incomeBox) {
        incomeBox.innerText = "₹" + totalIncome;
    }

    const expenseBox = document.getElementById("totalExpense");
    if (expenseBox) {
        expenseBox.innerText = "₹" + totalExpense;
    }

});

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

let incomeEntries =
document.getElementById("incomeEntries");

if(incomeEntries){
    incomeEntries.innerText =
    incomeHistory.length;
}

let expenseEntries =
document.getElementById("expenseEntries");

if(expenseEntries){
    expenseEntries.innerText =
    expenseHistory.length;
}

let avgIncome =
document.getElementById("avgIncome");

if(avgIncome){

    let average =
    incomeHistory.length == 0
    ? 0
    : totalIncome / incomeHistory.length;

    avgIncome.innerText =
    "₹" + average.toFixed(2);

}

let avgExpense =
document.getElementById("avgExpense");

if(avgExpense){

    let average =
    expenseHistory.length == 0
    ? 0
    : totalExpense / expenseHistory.length;

    avgExpense.innerText =
    "₹" + average.toFixed(2);

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

// ==========================================
// Phase 11A - Step 4.3C
// Automatic Cloud Sync Helper
// ==========================================

async function syncToCloud(){

    if(typeof window.saveArthaFlowToCloud === "function"){

        await window.saveArthaFlowToCloud();

        console.log("☁️ Cloud Sync Completed");

    }else{

        console.log("☁️ Cloud Sync Not Ready");

    }

}

// Save Income
async function saveIncome() {

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

    await syncToCloud();

    alert("Income Saved Successfully");

    showNotification("✅ Income Saved Successfully");

document.getElementById("category").value = "";
document.getElementById("amount").value = "";
document.getElementById("incomeDate").value = "";
document.getElementById("incomeNote").value = "";

location.reload();

}

async function deleteIncome(index){

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

    await syncToCloud();

    location.reload();

}

async function editIncome(index){

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

await syncToCloud();

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
async function saveExpense(){

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

totalExpense += amount;

localStorage.setItem(
    "expenseHistory",
    JSON.stringify(expenseHistory)
);

localStorage.setItem(
    "totalExpense",
    totalExpense
);

await syncToCloud();

        document.getElementById("expenseDate").value = "";
document.getElementById("expenseNote").value = "";

    showNotification("💸 Expense Saved Successfully");

    location.reload();

}
async function deleteExpense(index){

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

    await syncToCloud();

    location.reload();

}

async function editExpense(index){

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

await syncToCloud();

location.reload();
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

let trendChart =
document.getElementById("trendChart");

if(trendChart){

new Chart(trendChart,{

type:"line",

data:{

labels:["Income","Expense"],

datasets:[{

label:"Finance Trend",

data:[
totalIncome,
totalExpense
],

borderColor:"#2196F3",

backgroundColor:"rgba(33,150,243,0.2)",

fill:true,

tension:0.4

}]

},

options:{
responsive:true
}

});

}

let barChart =
document.getElementById("barChart");

if(barChart){

new Chart(barChart,{

type:"bar",

data:{

labels:["Income","Expense"],

datasets:[{

label:"Amount",

data:[
totalIncome,
totalExpense
]

}]

},

options:{

responsive:true,

plugins:{

legend:{
display:false
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

function searchExpense(){

    let input =
    document.getElementById("searchExpense").value.toLowerCase();

    let list =
    document.getElementById("expenseList");

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

function exportCSV() {

    let csv = "Type,Category,Amount,Date,Note\n";

    incomeHistory.forEach(function(item){
        csv += "Income," +
        item.category + "," +
        item.amount + "," +
        item.date + "," +
        item.note + "\n";
    });

    expenseHistory.forEach(function(item){
        csv += "Expense," +
        item.category + "," +
        item.amount + "," +
        item.date + "," +
        item.note + "\n";
    });

    let blob = new Blob([csv], {type:"text/csv"});

    let link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "ArthaFlow_Report.csv";

    link.click();
}

function backupData(){

    let data = {

        totalIncome: totalIncome,

        totalExpense: totalExpense,

        incomeHistory: incomeHistory,

        expenseHistory: expenseHistory

    };

    let blob = new Blob(
        [JSON.stringify(data,null,2)],
        {type:"application/json"}
    );

    let link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "ArthaFlow_Backup.json";

    link.click();

}

function restoreData(event){

    let file = event.target.files[0];

    if(!file){
        return;
    }

    let reader = new FileReader();

    reader.onload = function(e){

        let data = JSON.parse(e.target.result);

        localStorage.setItem(
            "totalIncome",
            data.totalIncome || 0
        );

        localStorage.setItem(
            "totalExpense",
            data.totalExpense || 0
        );

        localStorage.setItem(
            "incomeHistory",
            JSON.stringify(data.incomeHistory || [])
        );

        localStorage.setItem(
            "expenseHistory",
            JSON.stringify(data.expenseHistory || [])
        );

        alert("✅ Backup Restored Successfully");

        location.reload();

    };

    reader.readAsText(file);

}

function filterIncome(){

    let filter =
    document.getElementById("incomeFilter").value;

    let items =
    document.getElementById("incomeList")
    .getElementsByTagName("li");

    for(let i=0;i<items.length;i++){

        let text =
        items[i].innerText;

        if(filter=="all" || text.includes(filter)){
            items[i].style.display="";
        }else{
            items[i].style.display="none";
        }

    }

}

function filterExpense(){

    let filter =
    document.getElementById("expenseFilter").value;

    let items =
    document.getElementById("expenseList")
    .getElementsByTagName("li");

    for(let i=0;i<items.length;i++){

        let text =
        items[i].innerText;

        if(filter=="all" || text.includes(filter)){
            items[i].style.display="";
        }else{
            items[i].style.display="none";
        }

    }

}

let recentList =
document.getElementById("recentTransactions");

if(recentList){

    recentList.innerHTML = "";

    let allTransactions = [];

    incomeHistory.forEach(function(item){
        allTransactions.push("💰 " + item.category + " - ₹" + item.amount);
    });

    expenseHistory.forEach(function(item){
        allTransactions.push("💸 " + item.category + " - ₹" + item.amount);
    });

    allTransactions.reverse();

    allTransactions.slice(0,5).forEach(function(item){

        let li = document.createElement("li");

        li.innerText = item;

        recentList.appendChild(li);

    });

}

function saveProfile(){

    let name =
    document.getElementById("userName").value;

    if(name==""){
        alert("Enter Your Name");
        return;
    }

    localStorage.setItem("userName",name);

    alert("✅ Profile Saved");

}

let welcome =
document.getElementById("welcomeUser");

if(welcome){

    let name =
    localStorage.getItem("userName");

    if(name){
        welcome.innerHTML =
        "👋 Welcome, " + name;
    }

}

function saveBudget(){

    let budget =
    Number(document.getElementById("monthlyBudget").value);

    if(budget<=0){
        alert("Enter Valid Budget");
        return;
    }

    localStorage.setItem(
        "monthlyBudget",
        budget
    );

    alert("✅ Budget Saved");

    location.reload();

}

let budget =
Number(localStorage.getItem("monthlyBudget")) || 0;

let budgetAmount =
document.getElementById("budgetAmount");

let remainingBudget =
document.getElementById("remainingBudget");

if(budgetAmount){
    budgetAmount.innerText = "₹" + budget;
}

if(remainingBudget){
    remainingBudget.innerText =
    "₹" + (budget - totalExpense);
        }

function filterExpense(){

    let filter =
    document.getElementById("expenseFilter").value;

    let today =
    new Date().toISOString().split("T")[0];

    let currentMonth =
    today.substring(0,7);

    let items =
    expenseHistory;

    let expenseList =
    document.getElementById("expenseList");

    if(!expenseList){
        return;
    }

    expenseList.innerHTML = "";

    items.forEach(function(item,index){

        let show = false;

        if(filter == "all"){
            show = true;
        }

        if(filter == "today" &&
           item.date == today){
            show = true;
        }

        if(filter == "month" &&
           item.date.startsWith(currentMonth)){
            show = true;
        }

        if(show){

            let li =
            document.createElement("li");

            li.innerHTML =
            item.category +
            " - ₹" + item.amount +
            " | 📅 " + item.date +
            " | 📝 " + item.note +
            ' <button onclick="editExpense(' + index + ')">✏️</button>' +
            ' <button onclick="deleteExpense(' + index + ')">🗑️</button>';

            expenseList.appendChild(li);
        }

    });

}

function filterIncome(){

let value =
document.getElementById("incomeFilter").value;

let items =
document.getElementById("incomeList").getElementsByTagName("li");

for(let i=0;i<items.length;i++){

    if(value=="all"){
        items[i].style.display="";
    }
    else if(items[i].innerText.indexOf(value)>-1){
        items[i].style.display="";
    }
    else{
        items[i].style.display="none";
    }

}

}

function filterByDate(){

let from =
document.getElementById("fromDate").value;

let to =
document.getElementById("toDate").value;

if(from=="" || to==""){
alert("Select both dates");
return;
}

let incomeTotal = 0;
let expenseTotal = 0;

incomeHistory.forEach(function(item){

if(item.date>=from && item.date<=to){
incomeTotal += item.amount;
}

});

expenseHistory.forEach(function(item){

if(item.date>=from && item.date<=to){
expenseTotal += item.amount;
}

});

document.getElementById("filterIncome").innerText =
"₹"+incomeTotal;

document.getElementById("filterExpense").innerText =
"₹"+expenseTotal;

document.getElementById("filterBalance").innerText =
"₹"+(incomeTotal-expenseTotal);

}

function searchExpense(){

    let input =
    document.getElementById("searchExpense").value.toLowerCase();

    let list =
    document.getElementById("expenseList");

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

function globalSearch(){

let input =
document.getElementById("globalSearch");

let result =
document.getElementById("searchResult");

if(!input || !result){
return;
}

let keyword =
input.value.toLowerCase();

result.innerHTML="";

if(keyword==""){
return;
}

let allData=[];

incomeHistory.forEach(function(item){

allData.push({
type:"💰 Income",
category:item.category,
amount:item.amount
});

});

expenseHistory.forEach(function(item){

allData.push({
type:"💸 Expense",
category:item.category,
amount:item.amount
});

});

allData.forEach(function(item){

let text=
(item.category+" "+item.amount).toLowerCase();

if(text.includes(keyword)){

let li=document.createElement("li");

li.innerHTML=
item.type+
" - "+
item.category+
" - ₹"+
item.amount;

result.appendChild(li);

}

});

}

function saveUser() {

    let name = document.getElementById("userName").value.trim();

    if (name === "") {
        alert("Please enter your name");
        return;
    }

    localStorage.setItem("userName", name);

    window.location.href = "index.html";
}

function showNotification(message){

let box =
document.getElementById("notification");

if(!box){
return;
}

box.innerHTML = message;

box.style.display = "block";

setTimeout(function(){

box.style.display = "none";

},2000);

}

let quotes = [

"💰 Save Money, Build Future.",

"📈 Small Savings Create Big Wealth.",

"🚀 Every Rupee Matters.",

"🎯 Track Every Expense.",

"🏦 Financial Freedom Starts Today.",

"💎 Invest In Your Future."

];

let quoteBox = document.getElementById("dailyQuote");

if(quoteBox){

let random =
Math.floor(Math.random()*quotes.length);

quoteBox.innerHTML = quotes[random];

}

function saveGoal(){

let goal =
Number(document.getElementById("goalAmount").value);

if(goal<=0){

alert("Enter Valid Goal");

return;

}

localStorage.setItem("savingGoal",goal);

location.reload();

}

let savingGoal =
Number(localStorage.getItem("savingGoal")) || 0;

let goalDisplay =
document.getElementById("goalDisplay");

let goalProgress =
document.getElementById("goalProgress");

if(goalDisplay){

goalDisplay.innerText="₹"+savingGoal;

}

if(goalProgress){

let balance =
totalIncome-totalExpense;

let percent = 0;

if(savingGoal>0){

percent=(balance/savingGoal)*100;

if(percent>100){
percent=100;
}

}

goalProgress.innerText=
percent.toFixed(1)+"%";

    let goalBar =
document.getElementById("goalBar");

if(goalBar){

goalBar.style.width =
percent + "%";

goalBar.innerText =
percent.toFixed(1) + "%";

}

}

// ===============================
// Income vs Expense Analytics
// ===============================

// Biggest Income
let biggestIncome = document.getElementById("biggestIncome");

if (biggestIncome) {

    let maxIncome = 0;

    incomeHistory.forEach(function(item) {
        if (item.amount > maxIncome) {
            maxIncome = item.amount;
        }
    });

    biggestIncome.innerText = "₹" + maxIncome;
}

// Biggest Expense
let biggestExpense = document.getElementById("biggestExpense");

if (biggestExpense) {

    let maxExpense = 0;

    expenseHistory.forEach(function(item) {
        if (item.amount > maxExpense) {
            maxExpense = item.amount;
        }
    });

    biggestExpense.innerText = "₹" + maxExpense;
}

// Saving Rate
let savingRate = document.getElementById("savingRate");
let savingRateBar = document.getElementById("savingRateBar");
let financialHealth = document.getElementById("financialHealth");

let rate = 0;

if (totalIncome > 0) {
    rate = ((totalIncome - totalExpense) / totalIncome) * 100;
}

if (savingRate) {
    savingRate.innerText = rate.toFixed(1) + "%";
}

if (financialHealth) {

    if (rate >= 50) {
        financialHealth.innerText = "🟢 Excellent";
    } else if (rate >= 25) {
        financialHealth.innerText = "🟡 Good";
    } else {
        financialHealth.innerText = "🔴 Needs Improvement";
    }

}

if (savingRateBar) {
    savingRateBar.style.width = rate + "%";
    savingRateBar.innerText = rate.toFixed(1) + "%";
}

// Monthly History
let monthlyHistory = document.getElementById("monthlyHistory");

if (monthlyHistory) {

    monthlyHistory.innerHTML = "";

    let data = JSON.parse(localStorage.getItem("monthlyData")) || {};

    const monthNames = [
        "January","February","March","April",
        "May","June","July","August",
        "September","October","November","December"
    ];

    for (let month in data) {

        let parts = month.split("-");

        let year = parts[0];

        let monthIndex = parseInt(parts[1], 10) - 1;

        let displayMonth = monthNames[monthIndex] + " " + year;

        monthlyHistory.innerHTML +=
            "<tr>" +
            "<td>" + displayMonth + "</td>" +
            "<td>₹" + data[month].income + "</td>" +
            "<td>₹" + data[month].expense + "</td>" +
            "<td>₹" + data[month].balance + "</td>" +
            "</tr>";

    }

}

// ===============================
// Monthly Record Save
// ===============================

let currentMonth =
new Date().getFullYear() + "-" +
(new Date().getMonth()+1);

let monthlyData =
JSON.parse(localStorage.getItem("monthlyData")) || {};

monthlyData[currentMonth] = {
    income: totalIncome,
    expense: totalExpense,
    balance: totalIncome - totalExpense
};

localStorage.setItem(
    "monthlyData",
    JSON.stringify(monthlyData)
);


// =========================
// Recurring Transactions
// =========================

let recurring =
JSON.parse(localStorage.getItem("recurring")) || [];

function saveRecurring(){

let category =
document.getElementById("recurringCategory").value;

let amount =
Number(document.getElementById("recurringAmount").value);

let type =
document.getElementById("recurringType").value;

let frequency =
document.getElementById("recurringFrequency").value;

if(category=="" || amount<=0){
alert("Enter Valid Details");
return;
}

recurring.push({
category,
amount,
type,
frequency
});

localStorage.setItem(
"recurring",
JSON.stringify(recurring)
);

alert("Recurring Transaction Saved");

location.reload();

}

let recurringList =
document.getElementById("recurringList");

if(recurringList){

recurringList.innerHTML="";

recurring.forEach(function(item){

let li=document.createElement("li");

li.innerHTML=
item.type+
" | "+
item.category+
" | ₹"+
item.amount+
" | "+
item.frequency;

recurringList.appendChild(li);

});

}

// ===============================
// Bill Reminder
// ===============================

let reminderHistory =
JSON.parse(localStorage.getItem("reminderHistory")) || [];

function saveReminder(){

let billName =
document.getElementById("billName").value;

let billAmount =
Number(document.getElementById("billAmount").value);

let billDate =
document.getElementById("billDate").value;

if(billName=="" || billAmount<=0 || billDate==""){
alert("Please Fill All Details");
return;
}

reminderHistory.push({
billName,
billAmount,
billDate
});

localStorage.setItem(
"reminderHistory",
JSON.stringify(reminderHistory)
);

alert("✅ Reminder Saved");

location.reload();

}

let billList =
document.getElementById("billList");

if(billList){

billList.innerHTML="";

reminderHistory.forEach(function(item,index){

let li=document.createElement("li");

li.innerHTML=
"📌 "+item.billName+
" | ₹"+item.billAmount+
" | 📅 "+item.billDate;

billList.appendChild(li);

});

}

// ===============================
// Dashboard Upcoming Bills
// ===============================

let dashboardBills =
document.getElementById("dashboardBills");

if(dashboardBills){

dashboardBills.innerHTML="";

if(reminderHistory.length==0){

dashboardBills.innerHTML="<li>No Upcoming Bills</li>";

}else{

reminderHistory.forEach(function(item){

let li=document.createElement("li");

li.innerHTML=
"📌 "+item.billName+
" - ₹"+item.billAmount+
" (📅 "+item.billDate+")";

dashboardBills.appendChild(li);

});

}

}

// ===============================
// Smart Notification System
// ===============================

let notificationBox =
document.getElementById("notificationBox");

if(notificationBox){

let today =
new Date().toISOString().split("T")[0];

let message =
"✅ No Pending Bills";

reminderHistory.forEach(function(item){

if(item.billDate==today){

message =
"🔴 Today : "+item.billName+
" ₹"+item.billAmount;

}

});

notificationBox.innerHTML=message;

}

// ===============================
// Monthly Financial Insights
// ===============================

let saving =
totalIncome - totalExpense;

let savingInsight =
document.getElementById("savingInsight");

if(savingInsight){
savingInsight.innerText="₹"+saving;
}

let expenseRatio =
document.getElementById("expenseRatio");

let ratio=0;

if(totalIncome>0){
ratio=((totalExpense/totalIncome)*100).toFixed(1);
}

if(expenseRatio){
expenseRatio.innerText=ratio+"%";
}

let financialStatus =
document.getElementById("financialStatus");

let financeTip =
document.getElementById("financeTip");

if(financialStatus && financeTip){

if(ratio<=50){

financialStatus.innerText="Excellent ✅";
financeTip.innerText="Your savings are very good.";

}else if(ratio<=80){

financialStatus.innerText="Good 👍";
financeTip.innerText="Try to reduce unnecessary expenses.";

}else{

financialStatus.innerText="Warning ⚠️";
financeTip.innerText="Your expenses are very high.";

}

}

// ===============================
// Calendar View
// ===============================

function showTransactionsByDate(){

let date =
document.getElementById("calendarDate").value;

let list =
document.getElementById("calendarTransactions");

if(!list){
return;
}

list.innerHTML="";

let found=false;

incomeHistory.forEach(function(item){

if(item.date==date){

let li=document.createElement("li");

li.innerHTML=
"💰 Income : "+
item.category+
" - ₹"+
item.amount;

list.appendChild(li);

found=true;

}

});

expenseHistory.forEach(function(item){

if(item.date==date){

let li=document.createElement("li");

li.innerHTML=
"💸 Expense : "+
item.category+
" - ₹"+
item.amount;

list.appendChild(li);

found=true;

}

});

if(!found){

list.innerHTML="<li>No Transactions Found</li>";

}

}

// ===============================
// Category Analytics
// ===============================

let categoryChart =
document.getElementById("categoryChart");

let categorySummary =
document.getElementById("categorySummary");

if(categoryChart){

let categoryData={};

expenseHistory.forEach(function(item){

if(categoryData[item.category]){
categoryData[item.category]+=item.amount;
}else{
categoryData[item.category]=item.amount;
}

});

let labels=Object.keys(categoryData);

let values=Object.values(categoryData);

new Chart(categoryChart,{

type:"pie",

data:{

labels:labels,

datasets:[{

data:values

}]

}

});

if(categorySummary){

categorySummary.innerHTML="";

labels.forEach(function(cat,index){

let li=document.createElement("li");

li.innerHTML=
cat+" : ₹"+values[index];

categorySummary.appendChild(li);

});

}

}

// ===============================
// Income Sorting
// ===============================

function sortIncome(){

let type =
document.getElementById("incomeSort").value;

if(type=="high"){
incomeHistory.sort((a,b)=>b.amount-a.amount);
}

else if(type=="low"){
incomeHistory.sort((a,b)=>a.amount-b.amount);
}

else if(type=="latest"){
incomeHistory.sort((a,b)=>b.date.localeCompare(a.date));
}

else if(type=="oldest"){
incomeHistory.sort((a,b)=>a.date.localeCompare(b.date));
}

localStorage.setItem(
"incomeHistory",
JSON.stringify(incomeHistory)
);

location.reload();

}

// ===============================
// Expense Sorting
// ===============================

function sortExpense(){

let type =
document.getElementById("expenseSort").value;

if(type=="high"){
expenseHistory.sort((a,b)=>b.amount-a.amount);
}

else if(type=="low"){
expenseHistory.sort((a,b)=>a.amount-b.amount);
}

else if(type=="latest"){
expenseHistory.sort((a,b)=>b.date.localeCompare(a.date));
}

else if(type=="oldest"){
expenseHistory.sort((a,b)=>a.date.localeCompare(b.date));
}

localStorage.setItem(
"expenseHistory",
JSON.stringify(expenseHistory)
);

location.reload();

}

// ===============================
// ArthaFlow PDF Theme
// ===============================

const pdfTheme = {

primary:[37,99,235],

success:[34,197,94],

danger:[239,68,68],

gray:[107,114,128]

};

// ===============================
// PDF Report
// ===============================

async function downloadPDF(){

const { jsPDF } = window.jspdf;

const pdf = new jsPDF();

// ===============================
// Add Logo
// ===============================

const logo = document.getElementById("pdfLogo");

if(logo){

try{

pdf.addImage(
logo,
"PNG",
160,
5,
35,
18
);

}catch(e){

console.log("Logo not loaded");

}

}

// Blue Header
pdf.setFillColor(...pdfTheme.primary);
pdf.rect(0,0,210,28,"F");

pdf.setTextColor(255,255,255);
pdf.setFontSize(22);
pdf.text("ArthaFlow Premium",20,18);

// Blue Header
pdf.setFillColor(...pdfTheme.primary);
pdf.rect(0,0,210,28,"F");

pdf.setTextColor(255,255,255);
pdf.setFontSize(22);
pdf.text("ArthaFlow Premium",20,18);

// Report Title
pdf.setTextColor(0,0,0);
pdf.setFontSize(16);
pdf.text("Financial Report",20,40);

// Report Details
pdf.setFontSize(12);

pdf.text("Total Income : ₹"+totalIncome,20,60);

pdf.text("Total Expense : ₹"+totalExpense,20,72);

pdf.text("Current Balance : ₹"+(totalIncome-totalExpense),20,84);

pdf.text("Total Transactions : "+(incomeHistory.length+expenseHistory.length),20,96);

pdf.setTextColor(...pdfTheme.gray);
pdf.text("Generated by ArthaFlow Premium",20,115);

    // ===============================
// Balance Highlight Box
// ===============================

pdf.setFillColor(...pdfTheme.success);

pdf.roundedRect(20,125,170,20,3,3,"F");

pdf.setTextColor(255,255,255);

pdf.setFontSize(15);

pdf.text(
"Available Balance : ₹"+(totalIncome-totalExpense),
25,
138
);

// ===============================
// Watermark
// ===============================

pdf.setTextColor(220);

pdf.setFontSize(40);

pdf.text(
"ArthaFlow",
55,
190,
{
angle:45
}
);

// ===============================
// Footer
// ===============================

pdf.setTextColor(...pdfTheme.gray);

pdf.setFontSize(10);

pdf.text(
"Generated on : " +
new Date().toLocaleString(),
20,
280
);

pdf.text(
"Developed with ❤️ by Aditya Aakash",
20,
287
);

pdf.save("ArthaFlow_Report.pdf");

}

// ===============================
// Logo
// ===============================

const logo = new Image();
logo.src = "logo.png";

logo.onload = function(){

pdf.addImage(logo,"PNG",15,10,25,25);

// ===============================
// Heading
// ===============================

pdf.setFontSize(20);
pdf.text("ArthaFlow Financial Report",50,20);

pdf.setFontSize(11);
pdf.text("Smart Finance Manager",50,28);

// ===============================
// Report
// ===============================

pdf.setFontSize(12);

pdf.text("Total Income : ₹"+totalIncome,20,50);

pdf.text("Total Expense : ₹"+totalExpense,20,60);

pdf.text("Current Balance : ₹"+(totalIncome-totalExpense),20,70);

pdf.text("Total Transactions : "+(incomeHistory.length+expenseHistory.length),20,80);

pdf.text("Generated by ArthaFlow",20,100);

pdf.save("ArthaFlow_Report.pdf");

};

// ===============================
// Premium Dashboard Animation
// ===============================

document.querySelectorAll(".card").forEach(function(card){

card.addEventListener("mouseover",function(){

card.style.transform="scale(1.02)";

});

card.addEventListener("mouseout",function(){

card.style.transform="scale(1)";

});

});

// ===============================
// App PIN Setup
// ===============================

function savePin(){

let pin = document.getElementById("newPin").value;

if(pin.length!=4 && pin.length!=6){
    alert("Please Enter 4 or 6 Digit PIN");
    return;
}

localStorage.setItem("appPin", pin);

alert("PIN Saved = " + localStorage.getItem("appPin"));

sessionStorage.setItem("pinVerified","true");

window.location.href="index.html";

}

// ===============================
// PIN Verification
// ===============================

function verifyPin(){

let pin = document.getElementById("enterPin").value;
let savedPin = localStorage.getItem("appPin");

if(pin === savedPin){

    sessionStorage.setItem("pinVerified","true");

    alert("Saved = " + sessionStorage.getItem("pinVerified"));

    location.replace("index.html");

}else{

    alert("Wrong PIN");

}

}

// ================================
// Step 73A - Auto Lock Timer
// ================================

let autoLockTime = 5 * 60 * 1000; // 5 Minutes
let autoLockTimer;

function resetAutoLock(){

    clearTimeout(autoLockTimer);

    autoLockTimer = setTimeout(function(){

        // Session खत्म
        sessionStorage.removeItem("pinVerified");

        // PIN Lock पर वापस भेजो
        window.location.href = "pin-lock.html";

    }, autoLockTime);

}

// User Activity पर Timer Reset
document.addEventListener("mousemove", resetAutoLock);
document.addEventListener("keydown", resetAutoLock);
document.addEventListener("click", resetAutoLock);
document.addEventListener("touchstart", resetAutoLock);

// Start Timer
resetAutoLock();

// ===============================
// Step 74B - Loan Manager
// ===============================

let loanHistory =
JSON.parse(localStorage.getItem("loanHistory")) || [];

function saveLoan(){

let person =
document.getElementById("loanPerson").value;

let amount =
document.getElementById("loanAmount").value;

let date =
document.getElementById("loanDate").value;

let type =
document.getElementById("loanType").value;

let note =
document.getElementById("loanNote").value;

let dueDate =
document.getElementById("loanDueDate").value;

if(person=="" || amount=="" || date==""){

alert("Please Fill All Required Fields");

return;

}

loanHistory.push({

person: person,
amount: Number(amount),
date: date,
type: type,
note: note,
dueDate: dueDate

});

localStorage.setItem(
"loanHistory",
JSON.stringify(loanHistory)
);

alert("✅ Loan Saved Successfully");

loadLoanHistory();

document.getElementById("loanPerson").value="";
document.getElementById("loanAmount").value="";
document.getElementById("loanDate").value="";
document.getElementById("loanNote").value="";
document.getElementById("loanDueDate").value="";
document.getElementById("loanType").selectedIndex=0;

}


// ===============================
// Delete Loan
// ===============================

function deleteLoan(index){

if(confirm("Delete this Loan?")){

loanHistory.splice(index,1);

localStorage.setItem(
"loanHistory",
JSON.stringify(loanHistory)
);

loadLoanHistory();

}

}

// ===============================
// Loan Paid
// ===============================

function markLoanPaid(index){

loanHistory[index].type = "Paid";

localStorage.setItem(
"loanHistory",
JSON.stringify(loanHistory)
);

loadLoanHistory();

}

// ===============================
// Load Loan History
// ===============================

function loadLoanHistory(){

loanHistory =
JSON.parse(localStorage.getItem("loanHistory")) || [];

console.log("Loan History:", loanHistory);

let list = document.getElementById("loanHistory");

if(!list) return;

list.innerHTML = "";

if(loanHistory.length == 0){

list.innerHTML = "<li>No Loan Records</li>";

updateLoanSummary();
updateLoanAnalytics();
drawLoanChart();

return;

}

loanHistory.forEach(function(item,index){

let status = "🟢 Pending";

if(item.type=="Paid"){
status = "✅ Paid";
}

if(item.dueDate){

let today = new Date();
let due = new Date(item.dueDate);

if(due < today && item.type!="Paid"){
status = "🔴 Overdue";
}

}

list.innerHTML += `

<li>

<b>${item.person}</b><br>

💰 ₹${item.amount}<br>

📌 ${item.type}<br>

📅 ${item.date}<br>

⏰ Due : ${item.dueDate || "-"}<br>

Status : ${status}<br>

📝 ${item.note || "-"}<br><br>

<button onclick="markLoanPaid(${index})">✅ Paid</button>

<button onclick="editLoan(${index})">✏ Edit</button>

<button onclick="deleteLoan(${index})">🗑 Delete</button>

</li>

<hr>

`;

});

updateLoanSummary();
updateLoanAnalytics();
drawLoanChart();
checkOverdueLoans();

}

// ===============================
// Edit Loan
// ===============================

function editLoan(index){

document.getElementById("loanPerson").value =
loanHistory[index].person;

document.getElementById("loanAmount").value =
loanHistory[index].amount;

document.getElementById("loanDate").value =
loanHistory[index].date;

document.getElementById("loanType").value =
loanHistory[index].type;

document.getElementById("loanNote").value =
loanHistory[index].note;

document.getElementById("loanDueDate").value =
loanHistory[index].dueDate;

// Old Loan Remove
loanHistory.splice(index,1);

localStorage.setItem(
"loanHistory",
JSON.stringify(loanHistory)
);

loadLoanHistory();

}

// ===============================
// Loan Summary
// ===============================

function updateLoanSummary(){

let borrowed = 0;
let lent = 0;
let paid = 0;
let active = 0;

loanHistory.forEach(function(item){

if(item.type=="Borrowed"){

borrowed += Number(item.amount);
active++;

}

else if(item.type=="Lent"){

lent += Number(item.amount);
active++;

}

else if(item.type=="Paid"){

paid += Number(item.amount);

}

});

if(document.getElementById("totalBorrowed"))
document.getElementById("totalBorrowed").innerHTML = "₹" + borrowed;

if(document.getElementById("totalLent"))
document.getElementById("totalLent").innerHTML = "₹" + lent;

if(document.getElementById("totalPaid"))
document.getElementById("totalPaid").innerHTML = "₹" + paid;

if(document.getElementById("activeLoans"))
document.getElementById("activeLoans").innerHTML = active;

}

// ===============================
// Search Loan
// ===============================

function searchLoan(){

let keyword =
document.getElementById("loanSearch").value.toLowerCase();

let list =
document.getElementById("loanHistory");

if(!list) return;

list.innerHTML="";

loanHistory.forEach(function(item,index){

if(item.person.toLowerCase().includes(keyword)){

let status = "🟢 Pending";

if(item.type=="Paid"){
status="✅ Paid";
}

if(item.dueDate){

let today = new Date();
let due = new Date(item.dueDate);

if(due < today && item.type!="Paid"){
status="🔴 Overdue";
}

}

list.innerHTML += `

<li>

<b>${item.person}</b><br>

💰 ₹${item.amount}<br>

📌 ${item.type}<br>

📅 ${item.date}<br>

⏰ Due : ${item.dueDate || "-"}<br>

Status : ${status}<br>

</li>

<hr>

`;

}

});

}

// ===============================
// Overdue Loan Checker
// ===============================

function checkOverdueLoans(){

let today = new Date();

loanHistory.forEach(function(item){

if(item.dueDate && item.type!="Paid"){

let due = new Date(item.dueDate);

if(due < today){

alert(
"⚠ Overdue Loan : " +
item.person +
" ₹" +
item.amount
);

}

}

});

}

// ===============================
// Loan Analytics
// ===============================

function updateLoanAnalytics(){

let total = 0;

loanHistory.forEach(function(item){

total += Number(item.amount);

});

let avg = 0;

if(loanHistory.length > 0){

avg = total / loanHistory.length;

}

if(document.getElementById("totalLoans"))
document.getElementById("totalLoans").innerHTML =
loanHistory.length;

if(document.getElementById("avgLoan"))
document.getElementById("avgLoan").innerHTML =
"₹" + avg.toFixed(2);

}

// ===============================
// Step 74G - Loan Pie Chart
// ===============================

function drawLoanChart(){

let borrowed = 0;
let lent = 0;

loanHistory.forEach(function(item){

if(item.type=="Borrowed"){

borrowed += Number(item.amount);

}

else if(item.type=="Lent"){

lent += Number(item.amount);

}

});

let chart = document.getElementById("loanChart");

if(!chart) return;

// Purana Chart Destroy
if(window.loanChartInstance){
window.loanChartInstance.destroy();
}

window.loanChartInstance = new Chart(chart,{

type:"pie",

data:{

labels:["Borrowed","Lent"],

datasets:[{

data:[borrowed,lent]

}]

}

});

}

// ===============================
// Export Loan
// ===============================

function exportLoan(){

let data = JSON.stringify(loanHistory,null,2);

let blob = new Blob([data],{
type:"application/json"
});

let link = document.createElement("a");

link.href = URL.createObjectURL(blob);

link.download = "LoanHistory.json";

link.click();

}

// ===============================
// Interest Calculator
// ===============================

function calculateInterest(){

let p = Number(document.getElementById("principal").value);

let r = Number(document.getElementById("rate").value);

let t = Number(document.getElementById("years").value);

let si = (p*r*t)/100;

document.getElementById("interestResult").innerHTML =
"Interest : ₹" + si;

}

// ===============================
// Page Load
// ===============================

window.onload = function(){

loadLoanHistory();

};

// ===============================
// Step 75 - EMI Tracker
// ===============================

let emiHistory =
JSON.parse(localStorage.getItem("emiHistory")) || [];

// ===============================
// Save EMI
// ===============================

function saveEMI(){

let bank =
document.getElementById("bankName").value;

let loan =
document.getElementById("loanAmount").value;

let emi =
document.getElementById("monthlyEMI").value;

let due =
document.getElementById("emiDueDate").value;

if(bank=="" || loan=="" || emi=="" || due==""){

alert("Please Fill All Fields");

return;

}

emiHistory.push({

bank: bank,

loan: Number(loan),

emi: Number(emi),

due: due,

paid: false

});

localStorage.setItem(
"emiHistory",
JSON.stringify(emiHistory)
);

loadEMI();

}

// ===============================
// Mark EMI Paid
// ===============================

function markEMIPaid(index){

emiHistory[index].paid = true;

localStorage.setItem(
"emiHistory",
JSON.stringify(emiHistory)
);

loadEMI();

}

// ===============================
// Load EMI
// ===============================

function loadEMI(){

emiHistory =
JSON.parse(localStorage.getItem("emiHistory")) || [];

let list =
document.getElementById("emiHistory");

if(!list) return;

list.innerHTML="";

if(emiHistory.length==0){

list.innerHTML="<li>No EMI Records</li>";

return;

}

emiHistory.forEach(function(item,index){

let status="🟢 Pending";

if(item.paid){
status="✅ Paid";
}

list.innerHTML += `

<li>

🏦 ${item.bank}<br>

💰 Loan : ₹${item.loan}<br>

💸 EMI : ₹${item.emi}<br>

📅 Due : ${item.due}<br>

Status : ${status}<br><br>

<button onclick="markEMIPaid(${index})">
✅ Paid
</button>

</li>

<hr>

`;

});
    
updateEMIProgress();
checkEMIReminder();
drawEMIChart();
loadBankSummary();
    
}

function updateEMIProgress(){

let total = 0;
let paid = 0;

emiHistory.forEach(function(item){

total += Number(item.emi);

if(item.paid){

paid += Number(item.emi);

}

});

let remaining = total - paid;

let percent = 0;

if(total > 0){

percent = (paid / total) * 100;

}

if(document.getElementById("totalEMI"))
document.getElementById("totalEMI").innerHTML =
"₹" + total;

if(document.getElementById("paidEMI"))
document.getElementById("paidEMI").innerHTML =
"₹" + paid;

if(document.getElementById("remainingEMI"))
document.getElementById("remainingEMI").innerHTML =
"₹" + remaining;

let bar =
document.getElementById("emiProgressBar");

if(bar){

bar.style.width = percent + "%";

bar.innerHTML = percent.toFixed(0) + "%";

}

}

// ===============================
// EMI Reminder
// ===============================

function checkEMIReminder(){

let today = new Date();

let next = "No EMI";
let alertMsg = "✅ No Pending EMI";

emiHistory.forEach(function(item){

if(!item.paid){

let due = new Date(item.due);

if(due < today){

alertMsg = "🔴 Overdue EMI";

}else{

next = item.bank + " - " + item.due;

}

}

});

if(document.getElementById("nextEMI"))
document.getElementById("nextEMI").innerHTML = next;

if(document.getElementById("emiAlert"))
document.getElementById("emiAlert").innerHTML = alertMsg;

}

// ===============================
// EMI Analytics Chart
// ===============================

function drawEMIChart(){

emiHistory =
JSON.parse(localStorage.getItem("emiHistory")) || [];

let paid = 0;
let pending = 0;

emiHistory.forEach(function(item){

if(item.paid){

paid += Number(item.emi);

}else{

pending += Number(item.emi);

}

});

let chart = document.getElementById("emiChart");

if(!chart) return;

// Remove old chart if exists
if(window.emiChartInstance){

window.emiChartInstance.destroy();

}

window.emiChartInstance = new Chart(chart,{

type:"pie",

data:{

labels:["Paid EMI","Pending EMI"],

datasets:[{

data:[paid,pending]

}]

}

});

}

// ===============================
// Bank Summary
// ===============================

function loadBankSummary(){

emiHistory =
JSON.parse(localStorage.getItem("emiHistory")) || [];

let list = document.getElementById("bankSummary");

if(!list) return;

list.innerHTML = "";

if(emiHistory.length==0){

list.innerHTML = "<li>No EMI Data</li>";

return;

}

emiHistory.forEach(function(item){

let status = item.paid ? "✅ Paid" : "🟢 Pending";

list.innerHTML += `

<li>

🏦 ${item.bank}<br>

💸 EMI : ₹${item.emi}<br>

📅 Due : ${item.due}<br>

Status : ${status}

</li>

<hr>

`;

});

}

// ===============================
// EMI Auto Load
// ===============================

window.addEventListener("load",function(){

if(document.getElementById("emiHistory")){

loadEMI();

}

});

// ===============================
// Step 76B - Investment Tracker
// ===============================

let investmentHistory =
JSON.parse(localStorage.getItem("investmentHistory")) || [];

function saveInvestment(){

let name =
document.getElementById("investmentName").value;

let type =
document.getElementById("investmentType").value;

let amount =
document.getElementById("investmentAmount").value;

let date =
document.getElementById("investmentDate").value;

if(name=="" || amount=="" || date==""){

alert("Please Fill All Fields");

return;

}

investmentHistory.push({

name:name,

type:type,

amount:Number(amount),

date:date

});

localStorage.setItem(
"investmentHistory",
JSON.stringify(investmentHistory)
);

loadInvestment();

document.getElementById("investmentName").value="";
document.getElementById("investmentAmount").value="";
document.getElementById("investmentDate").value="";

}

function loadInvestment(){

investmentHistory =
JSON.parse(localStorage.getItem("investmentHistory")) || [];

let list =
document.getElementById("investmentHistory");

if(!list) return;

list.innerHTML="";

let total = 0;

if(investmentHistory.length==0){

list.innerHTML="<li>No Investment</li>";

}

investmentHistory.forEach(function(item,index){

total += Number(item.amount);

list.innerHTML += `

<li>

💰 ${item.name}<br>

📂 ${item.type}<br>

💵 ₹${item.amount}<br>

📅 ${item.date}<br><br>

<button onclick="editInvestment(${index})">
✏ Edit
</button>

<button onclick="deleteInvestment(${index})">
🗑 Delete
</button>

</li>

<hr>

`;

});

if(document.getElementById("totalInvestment"))
document.getElementById("totalInvestment").innerHTML =
"₹" + total;

if(document.getElementById("totalInvestmentCount"))
document.getElementById("totalInvestmentCount").innerHTML =
investmentHistory.length;

    drawInvestmentChart();

}

function deleteInvestment(index){

if(confirm("Delete Investment?")){

investmentHistory.splice(index,1);

localStorage.setItem(
"investmentHistory",
JSON.stringify(investmentHistory)
);

loadInvestment();

}

}

function editInvestment(index){

document.getElementById("investmentName").value =
investmentHistory[index].name;

document.getElementById("investmentType").value =
investmentHistory[index].type;

document.getElementById("investmentAmount").value =
investmentHistory[index].amount;

document.getElementById("investmentDate").value =
investmentHistory[index].date;

investmentHistory.splice(index,1);

localStorage.setItem(
"investmentHistory",
JSON.stringify(investmentHistory)
);

loadInvestment();

}

// ===============================
// Investment Analytics
// ===============================

function drawInvestmentChart(){

let data = {};

investmentHistory.forEach(function(item){

if(data[item.type]){

data[item.type] += Number(item.amount);

}else{

data[item.type] = Number(item.amount);

}

});

let chart = document.getElementById("investmentChart");

if(!chart) return;

let labels = Object.keys(data);
let values = Object.values(data);

if(window.investmentChartInstance){

window.investmentChartInstance.destroy();

}

window.investmentChartInstance = new Chart(chart,{

type:"pie",

data:{

labels:labels,

datasets:[{

data:values

}]

}

});

}

// ===============================
// Auto Load Investment
// ===============================

window.addEventListener("load", function(){

if(document.getElementById("investmentHistory")){

loadInvestment();

}

});

// ===============================
// Step 76E - ROI Calculator
// ===============================

function calculateROI(){

let current =
Number(document.getElementById("currentValue").value);

let invested = 0;

investmentHistory.forEach(function(item){

invested += Number(item.amount);

});

if(invested <= 0){

alert("No Investment Found");

return;

}

let profit = current - invested;

let roi = (profit / invested) * 100;

document.getElementById("profitLoss").innerHTML =
"₹" + profit.toFixed(2);

document.getElementById("roiPercent").innerHTML =
roi.toFixed(2) + "%";

}

// ===============================
// Step 77A + 77B - SIP Calculator
// ===============================

let sipHistory =
JSON.parse(localStorage.getItem("sipHistory")) || [];

function calculateSIP(){

let monthly =
Number(document.getElementById("sipAmount").value);

let annualRate =
Number(document.getElementById("sipRate").value);

let years =
Number(document.getElementById("sipYears").value);

if(monthly<=0 || annualRate<=0 || years<=0){

alert("Please Fill All Fields");

return;

}

let invested = monthly * 12 * years;

let r = annualRate / 12 / 100;

let n = years * 12;

let maturity =
monthly * (((Math.pow(1+r,n)-1)/r)*(1+r));

let gain = maturity - invested;

document.getElementById("investedAmount").innerHTML =
"₹" + invested.toFixed(2);

document.getElementById("maturityAmount").innerHTML =
"₹" + maturity.toFixed(2);

document.getElementById("wealthGain").innerHTML =
"₹" + gain.toFixed(2);

// Save History

sipHistory.push({

sip: monthly,

rate: annualRate,

years: years,

invested: invested,

maturity: maturity,

gain: gain

});

localStorage.setItem(
"sipHistory",
JSON.stringify(sipHistory)
);

loadSIPHistory();

}

function loadSIPHistory(){

sipHistory =
JSON.parse(localStorage.getItem("sipHistory")) || [];

let list =
document.getElementById("sipHistory");

if(!list) return;

list.innerHTML="";

if(sipHistory.length==0){

list.innerHTML="<li>No SIP Records</li>";

return;

}

sipHistory.forEach(function(item,index){

list.innerHTML += `

<li>

💰 Monthly SIP : ₹${item.sip}<br>

📈 Return : ${item.rate}%<br>

📅 Years : ${item.years}<br>

💵 Invested : ₹${item.invested.toFixed(2)}<br>

🏆 Maturity : ₹${item.maturity.toFixed(2)}<br>

📊 Gain : ₹${item.gain.toFixed(2)}

</li>

<hr>

`;

});

updateSIPAnalytics();
drawSIPChart();

}

// ===============================
// Auto Load SIP History
// ===============================

window.addEventListener("load",function(){

if(document.getElementById("sipHistory")){

loadSIPHistory();

}

});

// ===============================
// Step 77C - SIP Analytics
// ===============================

function updateSIPAnalytics(){

let invested = 0;
let maturity = 0;
let gain = 0;

sipHistory.forEach(function(item){

invested += Number(item.invested);

maturity += Number(item.maturity);

gain += Number(item.gain);

});

if(document.getElementById("sipTotalInvested"))
document.getElementById("sipTotalInvested").innerHTML =
"₹" + invested.toFixed(2);

if(document.getElementById("sipTotalMaturity"))
document.getElementById("sipTotalMaturity").innerHTML =
"₹" + maturity.toFixed(2);

if(document.getElementById("sipTotalGain"))
document.getElementById("sipTotalGain").innerHTML =
"₹" + gain.toFixed(2);

}

function drawSIPChart(){

let invested = 0;
let gain = 0;

sipHistory.forEach(function(item){

invested += Number(item.invested);

gain += Number(item.gain);

});

let chart =
document.getElementById("sipChart");

if(!chart) return;

if(window.sipChartInstance){

window.sipChartInstance.destroy();

}

window.sipChartInstance = new Chart(chart,{

type:"pie",

data:{

labels:["Invested","Gain"],

datasets:[{

data:[invested,gain]

}]

}

});

}

let netWorthHistory =
JSON.parse(localStorage.getItem("netWorthHistory")) || [];

// ===============================
// Step 78A - Net Worth Dashboard
// ===============================

function calculateNetWorth(){

let assets =
Number(document.getElementById("totalAssets").value);

let liabilities =
Number(document.getElementById("totalLiabilities").value);

if(assets < 0 || liabilities < 0){

alert("Please Enter Valid Values");

return;

}

let netWorth = assets - liabilities;

document.getElementById("assetResult").innerHTML =
"₹" + assets.toFixed(2);

document.getElementById("liabilityResult").innerHTML =
"₹" + liabilities.toFixed(2);

document.getElementById("netWorthResult").innerHTML =
"₹" + netWorth.toFixed(2);

// Save Data
localStorage.setItem(
"netAssets",
assets
);

localStorage.setItem(
"netLiabilities",
liabilities
);

localStorage.setItem(
"netWorth",
netWorth
);


    netWorthHistory.push({

assets: assets,

liabilities: liabilities,

netWorth: netWorth

});

localStorage.setItem(

"netWorthHistory",

JSON.stringify(netWorthHistory)

);

loadNetWorthHistory();

}

function loadNetWorth(){

let assets =
Number(localStorage.getItem("netAssets")) || 0;

let liabilities =
Number(localStorage.getItem("netLiabilities")) || 0;

let netWorth =
Number(localStorage.getItem("netWorth")) || 0;

if(document.getElementById("assetResult")){

document.getElementById("assetResult").innerHTML =
"₹" + assets.toFixed(2);

}

if(document.getElementById("liabilityResult")){

document.getElementById("liabilityResult").innerHTML =
"₹" + liabilities.toFixed(2);

}

if(document.getElementById("netWorthResult")){

document.getElementById("netWorthResult").innerHTML =
"₹" + netWorth.toFixed(2);

}

}

function loadNetWorthHistory(){

netWorthHistory =
JSON.parse(localStorage.getItem("netWorthHistory")) || [];

let list =
document.getElementById("netWorthHistory");

if(!list) return;

list.innerHTML="";

if(netWorthHistory.length==0){

list.innerHTML="<li>No History</li>";

return;

}

netWorthHistory.forEach(function(item,index){

list.innerHTML += `

<li>

🏦 Assets : ₹${item.assets}<br>

💳 Liabilities : ₹${item.liabilities}<br>

💰 Net Worth : ₹${item.netWorth}<br><br>

<button onclick="editNetWorth(${index})">

✏ Edit

</button>

<button onclick="deleteNetWorth(${index})">

🗑 Delete

</button>

</li>

<hr>

`;

});

drawNetWorthChart();

}

// Auto Load Net Worth

window.addEventListener("load",function(){

if(document.getElementById("totalAssets")){

loadNetWorth();

loadNetWorthHistory();

}

});

function deleteNetWorth(index){

if(confirm("Delete Record?")){

netWorthHistory.splice(index,1);

localStorage.setItem(

"netWorthHistory",

JSON.stringify(netWorthHistory)

);

loadNetWorthHistory();

}

}

function editNetWorth(index){

document.getElementById("totalAssets").value =
netWorthHistory[index].assets;

document.getElementById("totalLiabilities").value =
netWorthHistory[index].liabilities;

netWorthHistory.splice(index,1);

localStorage.setItem(

"netWorthHistory",

JSON.stringify(netWorthHistory)

);

loadNetWorthHistory();

}

function drawNetWorthChart(){

let assets = 0;

let liabilities = 0;

netWorthHistory.forEach(function(item){

assets += Number(item.assets);

liabilities += Number(item.liabilities);

});

let chart =
document.getElementById("netWorthChart");

if(!chart) return;

if(window.netWorthChartInstance){

window.netWorthChartInstance.destroy();

}

window.netWorthChartInstance = new Chart(chart,{

type:"pie",

data:{

labels:["Assets","Liabilities"],

datasets:[{

data:[assets,liabilities]

}]

}

});

}

let cashFlowHistory =
JSON.parse(localStorage.getItem("cashFlowHistory")) || [];

// ===============================
// Step 79A - Cash Flow Analysis
// ===============================

function calculateCashFlow(){

let income =
Number(document.getElementById("cashIncome").value);

let expense =
Number(document.getElementById("cashExpense").value);

if(income<=0){

alert("Enter Valid Income");

return;

}

let saving = income - expense;

document.getElementById("cashIncomeResult").innerHTML =
"₹" + income.toFixed(2);

document.getElementById("cashExpenseResult").innerHTML =
"₹" + expense.toFixed(2);

document.getElementById("cashSavingResult").innerHTML =
"₹" + saving.toFixed(2);

document.getElementById("cashFlowResult").innerHTML =
saving>=0 ? "Positive ✅" : "Negative ❌";

// Save

localStorage.setItem("cashIncome",income);
localStorage.setItem("cashExpense",expense);
localStorage.setItem("cashSaving",saving);

    cashFlowHistory.push({

income: income,

expense: expense,

saving: saving

});

localStorage.setItem(

"cashFlowHistory",

JSON.stringify(cashFlowHistory)

);

loadCashFlowHistory();

}

function loadCashFlow(){

let income =
Number(localStorage.getItem("cashIncome")) || 0;

let expense =
Number(localStorage.getItem("cashExpense")) || 0;

let saving =
Number(localStorage.getItem("cashSaving")) || 0;

document.getElementById("cashIncomeResult").innerHTML =
"₹" + income.toFixed(2);

document.getElementById("cashExpenseResult").innerHTML =
"₹" + expense.toFixed(2);

document.getElementById("cashSavingResult").innerHTML =
"₹" + saving.toFixed(2);

document.getElementById("cashFlowResult").innerHTML =
saving>=0 ? "Positive ✅" : "Negative ❌";

}

window.addEventListener("load",function(){

if(document.getElementById("cashIncomeResult")){

loadCashFlow();

loadCashFlowHistory();

}

});

function loadCashFlowHistory(){

cashFlowHistory =
JSON.parse(localStorage.getItem("cashFlowHistory")) || [];

let list =
document.getElementById("cashFlowHistory");

if(!list) return;

list.innerHTML="";

if(cashFlowHistory.length==0){

list.innerHTML="<li>No History</li>";

return;

}

cashFlowHistory.forEach(function(item,index){

list.innerHTML += `

<li>

💰 Income : ₹${item.income}<br>

💸 Expense : ₹${item.expense}<br>

💵 Saving : ₹${item.saving}<br><br>

<button onclick="editCashFlow(${index})">

✏ Edit

</button>

<button onclick="deleteCashFlow(${index})">

🗑 Delete

</button>

</li>

<hr>

`;

});

drawCashFlowChart();

}

function deleteCashFlow(index){

if(confirm("Delete Record?")){

cashFlowHistory.splice(index,1);

localStorage.setItem(

"cashFlowHistory",

JSON.stringify(cashFlowHistory)

);

loadCashFlowHistory();

}

}

function editCashFlow(index){

document.getElementById("cashIncome").value =
cashFlowHistory[index].income;

document.getElementById("cashExpense").value =
cashFlowHistory[index].expense;

cashFlowHistory.splice(index,1);

localStorage.setItem(

"cashFlowHistory",

JSON.stringify(cashFlowHistory)

);

loadCashFlowHistory();

}

function drawCashFlowChart(){

let income = 0;

let expense = 0;

cashFlowHistory.forEach(function(item){

income += Number(item.income);

expense += Number(item.expense);

});

let chart =
document.getElementById("cashFlowChart");

if(!chart) return;

if(window.cashChartInstance){

window.cashChartInstance.destroy();

}

window.cashChartInstance = new Chart(chart,{

type:"pie",

data:{

labels:["Income","Expense"],

datasets:[{

data:[income,expense]

}]

}

});

}

let comparisonHistory =
JSON.parse(localStorage.getItem("comparisonHistory")) || [];

// ===============================
// Step 80A + 80B
// Monthly vs Yearly Comparison
// ===============================
function calculateComparison(){

let income =
Number(document.getElementById("monthlyIncome").value);

let expense =
Number(document.getElementById("monthlyExpense").value);

if(income<=0){

alert("Enter Valid Income");

return;

}

let monthlySaving = income - expense;

let yearlyIncome = income * 12;

let yearlyExpense = expense * 12;

let yearlySaving = yearlyIncome - yearlyExpense;

// Result

document.getElementById("monthlySaving").innerHTML =
"₹" + monthlySaving.toFixed(2);

document.getElementById("yearlyIncome").innerHTML =
"₹" + yearlyIncome.toFixed(2);

document.getElementById("yearlyExpense").innerHTML =
"₹" + yearlyExpense.toFixed(2);

document.getElementById("yearlySaving").innerHTML =
"₹" + yearlySaving.toFixed(2);

// Save Result

localStorage.setItem("cmpMonthlySaving",monthlySaving);

localStorage.setItem("cmpYearlyIncome",yearlyIncome);

localStorage.setItem("cmpYearlyExpense",yearlyExpense);

localStorage.setItem("cmpYearlySaving",yearlySaving);

// Save History

comparisonHistory.push({

monthlySaving:monthlySaving,

yearlyIncome:yearlyIncome,

yearlyExpense:yearlyExpense,

yearlySaving:yearlySaving

});

localStorage.setItem(

"comparisonHistory",

JSON.stringify(comparisonHistory)

);

loadComparisonHistory();

}

function loadComparison(){

let monthlySaving =
Number(localStorage.getItem("cmpMonthlySaving") || 0);

let yearlyIncome =
Number(localStorage.getItem("cmpYearlyIncome") || 0);

let yearlyExpense =
Number(localStorage.getItem("cmpYearlyExpense") || 0);

let yearlySaving =
Number(localStorage.getItem("cmpYearlySaving") || 0);

if(document.getElementById("monthlySaving"))
document.getElementById("monthlySaving").innerHTML =
"₹"+monthlySaving.toFixed(2);

if(document.getElementById("yearlyIncome"))
document.getElementById("yearlyIncome").innerHTML =
"₹"+yearlyIncome.toFixed(2);

if(document.getElementById("yearlyExpense"))
document.getElementById("yearlyExpense").innerHTML =
"₹"+yearlyExpense.toFixed(2);

if(document.getElementById("yearlySaving"))
document.getElementById("yearlySaving").innerHTML =
"₹"+yearlySaving.toFixed(2);

}

function loadComparisonHistory(){

comparisonHistory =
JSON.parse(localStorage.getItem("comparisonHistory")) || [];

let list =
document.getElementById("comparisonHistory");

if(!list) return;

list.innerHTML="";

if(comparisonHistory.length==0){

list.innerHTML="<li>No History</li>";

drawComparisonChart();

return;

}

comparisonHistory.forEach(function(item,index){

list.innerHTML += `

<li>

💰 Monthly Saving : ₹${item.monthlySaving}<br>

🏦 Yearly Income : ₹${item.yearlyIncome}<br>

💸 Yearly Expense : ₹${item.yearlyExpense}<br>

💵 Yearly Saving : ₹${item.yearlySaving}<br><br>

<button onclick="editComparison(${index})">

✏ Edit

</button>

<button onclick="deleteComparison(${index})">

🗑 Delete

</button>

</li>

<hr>

`;

});

drawComparisonChart();

}

// Auto Load

window.addEventListener("load",function(){

loadComparison();

loadComparisonHistory();

});

function deleteComparison(index){

if(confirm("Delete Record?")){

comparisonHistory.splice(index,1);

localStorage.setItem(

"comparisonHistory",

JSON.stringify(comparisonHistory)

);

loadComparisonHistory();

}

}

function editComparison(index){

let item = comparisonHistory[index];

document.getElementById("monthlyIncome").value =
(item.yearlyIncome/12).toFixed(0);

document.getElementById("monthlyExpense").value =
(item.yearlyExpense/12).toFixed(0);

comparisonHistory.splice(index,1);

localStorage.setItem(

"comparisonHistory",

JSON.stringify(comparisonHistory)

);

loadComparisonHistory();

}

  function drawComparisonChart(){

let income = 0;

let expense = 0;

comparisonHistory.forEach(function(item){

income += Number(item.yearlyIncome);

expense += Number(item.yearlyExpense);

});

let chart =
document.getElementById("comparisonChart");

if(!chart) return;

if(window.comparisonChartInstance){

window.comparisonChartInstance.destroy();

}

window.comparisonChartInstance = new Chart(chart,{

type:"pie",

data:{

labels:["Yearly Income","Yearly Expense"],

datasets:[{

data:[income,expense]

}]

}

});

  }  


// ===============================
// Step 81A - Top Spending Categories
// ===============================

let spendingHistory =
JSON.parse(localStorage.getItem("spendingHistory")) || [];

function saveSpending(){

let category =
document.getElementById("spendingCategory").value;

let amount =
Number(document.getElementById("spendingAmount").value);

if(category=="" || amount<=0){

alert("Fill All Fields");

return;

}

spendingHistory.push({

category:category,

amount:amount

});

localStorage.setItem(

"spendingHistory",

JSON.stringify(spendingHistory)

);

loadSpending();

document.getElementById("spendingCategory").value="";

document.getElementById("spendingAmount").value="";

}

function loadSpending(){

spendingHistory =
JSON.parse(localStorage.getItem("spendingHistory")) || [];

let list =
document.getElementById("spendingHistory");

if(!list) return;

list.innerHTML="";

if(spendingHistory.length==0){

list.innerHTML="<li>No Records</li>";

document.getElementById("topCategory").innerHTML="-";

document.getElementById("topAmount").innerHTML="₹0";

return;

}

let highest = spendingHistory[0];

spendingHistory.forEach(function(item,index){

if(item.amount > highest.amount){

highest = item;

}

list.innerHTML += `

<li>

📂 ${item.category}<br>

💸 ₹${item.amount}<br><br>

<button onclick="editSpending(${index})">

✏ Edit

</button>

<button onclick="deleteSpending(${index})">

🗑 Delete

</button>

</li>

<hr>

`;

});

document.getElementById("topCategory").innerHTML =
highest.category;

document.getElementById("topAmount").innerHTML =
"₹"+highest.amount;

    drawSpendingChart();

}

window.addEventListener("load",function(){

if(document.getElementById("spendingHistory")){

loadSpending();

}

});

function deleteSpending(index){

if(confirm("Delete Record?")){

spendingHistory.splice(index,1);

localStorage.setItem(

"spendingHistory",

JSON.stringify(spendingHistory)

);

loadSpending();

}

}

function editSpending(index){

document.getElementById("spendingCategory").value =
spendingHistory[index].category;

document.getElementById("spendingAmount").value =
spendingHistory[index].amount;

spendingHistory.splice(index,1);

localStorage.setItem(

"spendingHistory",

JSON.stringify(spendingHistory)

);

loadSpending();

}

function drawSpendingChart(){

let chart =
document.getElementById("spendingChart");

if(!chart) return;

if(window.spendingChartInstance){

window.spendingChartInstance.destroy();

}

let labels = [];

let amounts = [];

spendingHistory.forEach(function(item){

labels.push(item.category);

amounts.push(item.amount);

});

window.spendingChartInstance = new Chart(chart,{

type:"pie",

data:{

labels:labels,

datasets:[{

data:amounts

}]

}

});

}

let incomeGrowthHistory =
JSON.parse(localStorage.getItem("incomeGrowthHistory")) || [];

// ===============================
// Step 82A - Income Growth Analysis
// ===============================

function calculateIncomeGrowth(){

let oldIncome =
Number(document.getElementById("oldIncome").value);

let newIncome =
Number(document.getElementById("newIncome").value);

if(oldIncome<=0){

alert("Enter Previous Income");

return;

}

let growth =
((newIncome-oldIncome)/oldIncome)*100;

document.getElementById("oldIncomeResult").innerHTML =
"₹"+oldIncome.toFixed(2);

document.getElementById("newIncomeResult").innerHTML =
"₹"+newIncome.toFixed(2);

document.getElementById("incomeGrowthResult").innerHTML =
growth.toFixed(2)+"%";

// Save Result

localStorage.setItem("oldIncome",oldIncome);

localStorage.setItem("newIncome",newIncome);

localStorage.setItem("incomeGrowth",growth);

    incomeGrowthHistory.push({

oldIncome: oldIncome,

newIncome: newIncome,

growth: growth

});

localStorage.setItem(

"incomeGrowthHistory",

JSON.stringify(incomeGrowthHistory)

);

loadIncomeGrowthHistory();

}

function loadIncomeGrowth(){

let oldIncome =
Number(localStorage.getItem("oldIncome")) || 0;

let newIncome =
Number(localStorage.getItem("newIncome")) || 0;

let growth =
Number(localStorage.getItem("incomeGrowth")) || 0;

if(document.getElementById("oldIncomeResult"))
document.getElementById("oldIncomeResult").innerHTML =
"₹"+oldIncome.toFixed(2);

if(document.getElementById("newIncomeResult"))
document.getElementById("newIncomeResult").innerHTML =
"₹"+newIncome.toFixed(2);

if(document.getElementById("incomeGrowthResult"))
document.getElementById("incomeGrowthResult").innerHTML =
growth.toFixed(2)+"%";

}

window.addEventListener("load",function(){

if(document.getElementById("oldIncomeResult")){

loadIncomeGrowth();

loadIncomeGrowthHistory();

}

});

function loadIncomeGrowthHistory(){

incomeGrowthHistory =
JSON.parse(localStorage.getItem("incomeGrowthHistory")) || [];

let list =
document.getElementById("incomeGrowthHistory");

if(!list) return;

list.innerHTML="";

if(incomeGrowthHistory.length==0){

list.innerHTML="<li>No Records</li>";

drawIncomeGrowthChart();

return;

}

incomeGrowthHistory.forEach(function(item,index){

list.innerHTML += `

<li>

💵 Previous Income : ₹${item.oldIncome}<br>

💰 Current Income : ₹${item.newIncome}<br>

📈 Growth : ${item.growth.toFixed(2)}%<br><br>

<button onclick="editIncomeGrowth(${index})">

✏ Edit

</button>

<button onclick="deleteIncomeGrowth(${index})">

🗑 Delete

</button>

</li>

<hr>

`;

});

drawIncomeGrowthChart();

}

function deleteIncomeGrowth(index){

if(confirm("Delete Record?")){

incomeGrowthHistory.splice(index,1);

localStorage.setItem(

"incomeGrowthHistory",

JSON.stringify(incomeGrowthHistory)

);

loadIncomeGrowthHistory();

}

}

function editIncomeGrowth(index){

let item = incomeGrowthHistory[index];

document.getElementById("oldIncome").value =
item.oldIncome;

document.getElementById("newIncome").value =
item.newIncome;

incomeGrowthHistory.splice(index,1);

localStorage.setItem(

"incomeGrowthHistory",

JSON.stringify(incomeGrowthHistory)

);

loadIncomeGrowthHistory();

}

function drawIncomeGrowthChart(){

let chart =
document.getElementById("incomeGrowthChart");

if(!chart) return;

if(window.incomeGrowthChartInstance){

window.incomeGrowthChartInstance.destroy();

}

let labels = [];

let values = [];

incomeGrowthHistory.forEach(function(item){

labels.push("Record " + (labels.length+1));

values.push(item.growth);

});

window.incomeGrowthChartInstance = new Chart(chart,{

type:"pie",

data:{

labels:labels,

datasets:[{

data:values

}]

}

});

}

let expenseGrowthHistory =
JSON.parse(localStorage.getItem("expenseGrowthHistory")) || [];

// ===============================
// Step 82D - Expense Growth Analysis
// ===============================

function calculateExpenseGrowth(){

let oldExpense =
Number(document.getElementById("oldExpense").value);

let newExpense =
Number(document.getElementById("newExpense").value);

if(oldExpense<=0){

alert("Enter Previous Expense");

return;

}

let growth =
((newExpense-oldExpense)/oldExpense)*100;

document.getElementById("oldExpenseResult").innerHTML =
"₹"+oldExpense.toFixed(2);

document.getElementById("newExpenseResult").innerHTML =
"₹"+newExpense.toFixed(2);

document.getElementById("expenseGrowthResult").innerHTML =
growth.toFixed(2)+"%";

// Save Result

localStorage.setItem("oldExpense",oldExpense);

localStorage.setItem("newExpense",newExpense);

localStorage.setItem("expenseGrowth",growth);

    let period =
document.getElementById("expensePeriod").value;

expenseGrowthHistory.push({

period:period,

oldExpense:oldExpense,

newExpense:newExpense,

growth:growth

});

localStorage.setItem(

"expenseGrowthHistory",

JSON.stringify(expenseGrowthHistory)

);

loadExpenseGrowthHistory();

}

function loadExpenseGrowth(){

let oldExpense =
Number(localStorage.getItem("oldExpense")) || 0;

let newExpense =
Number(localStorage.getItem("newExpense")) || 0;

let growth =
Number(localStorage.getItem("expenseGrowth")) || 0;

if(document.getElementById("oldExpenseResult"))
document.getElementById("oldExpenseResult").innerHTML =
"₹"+oldExpense.toFixed(2);

if(document.getElementById("newExpenseResult"))
document.getElementById("newExpenseResult").innerHTML =
"₹"+newExpense.toFixed(2);

if(document.getElementById("expenseGrowthResult"))
document.getElementById("expenseGrowthResult").innerHTML =
growth.toFixed(2)+"%";

}

window.addEventListener("load",function(){

if(document.getElementById("oldExpenseResult")){

loadExpenseGrowth();

loadExpenseGrowthHistory();

}

});

function loadExpenseGrowthHistory(){

expenseGrowthHistory =
JSON.parse(localStorage.getItem("expenseGrowthHistory")) || [];

let list =
document.getElementById("expenseGrowthHistory");

if(!list) return;

list.innerHTML="";

if(expenseGrowthHistory.length==0){

list.innerHTML="<li>No Records</li>";

drawExpenseGrowthChart();

return;

}

expenseGrowthHistory.forEach(function(item,index){

list.innerHTML += `

<li>

📅 ${item.period}<br>

💸 Previous : ₹${item.oldExpense}<br>

💰 Current : ₹${item.newExpense}<br>

📈 Growth : ${item.growth.toFixed(2)}%<br><br>

<button onclick="editExpenseGrowth(${index})">✏ Edit</button>

<button onclick="deleteExpenseGrowth(${index})">🗑 Delete</button>

</li>

<hr>

`;

});

drawExpenseGrowthChart();

}

function deleteExpenseGrowth(index){

expenseGrowthHistory.splice(index,1);

localStorage.setItem(

"expenseGrowthHistory",

JSON.stringify(expenseGrowthHistory)

);

loadExpenseGrowthHistory();

}

function editExpenseGrowth(index){

let item = expenseGrowthHistory[index];

document.getElementById("expensePeriod").value=item.period;

document.getElementById("oldExpense").value=item.oldExpense;

document.getElementById("newExpense").value=item.newExpense;

expenseGrowthHistory.splice(index,1);

localStorage.setItem(

"expenseGrowthHistory",

JSON.stringify(expenseGrowthHistory)

);

loadExpenseGrowthHistory();

}

function drawExpenseGrowthChart(){

let chart =
document.getElementById("expenseGrowthChart");

if(!chart) return;

if(window.expenseChartInstance){

window.expenseChartInstance.destroy();

}

let labels=[];

let values=[];

expenseGrowthHistory.forEach(function(item){

labels.push(item.period);

values.push(item.growth);

});

window.expenseChartInstance = new Chart(chart,{

type:"pie",

data:{

labels:labels,

datasets:[{

data:values

}]

}

});

}

// ===============================
// Step 83A + 83B + 83C + 83D + 83E
// AI Spending Suggestions
// ===============================

function analyzeSpending(){

let income =
Number(document.getElementById("incomeAI").value);

let expense =
Number(document.getElementById("expenseAI").value);

if(income<=0){

alert("Enter Valid Income");

return;

}

let suggestion="";

if(expense>income){

suggestion="🚨 Your expenses are higher than your income. Reduce unnecessary spending.";

}

else if(expense>income*0.8){

suggestion="⚠️ Your expenses are very high. Try to save more every month.";

}

else if(expense>income*0.6){

suggestion="🙂 Good, but you can still improve your savings.";

}

else{

suggestion="🎉 Excellent! Your spending is under control. Keep investing and saving.";

}

document.getElementById("aiSuggestion").innerHTML =
suggestion;

localStorage.setItem("aiSuggestion",suggestion);

// ===============================
// Smart Saving Tips
// ===============================

let saving =
income-expense;

let tips=[];

if(saving<income*0.10){

tips.push("💰 Try to save at least 10% of your income.");

}

if(expense>income*0.70){

tips.push("🛒 Reduce unnecessary shopping expenses.");

}

if(expense>income*0.50){

tips.push("🍔 Cut down food & entertainment expenses.");

}

if(saving>=income*0.30){

tips.push("🎉 Excellent! Keep investing regularly.");

}

localStorage.setItem(
"aiSavingTips",
JSON.stringify(tips)
);

loadSavingTips();

// ===============================
// Financial Score
// ===============================

let score =
100-((expense/income)*100);

if(score<0){

score=0;

}

let status="";

if(score>=90){

status="🟢 Excellent";

}

else if(score>=70){

status="🔵 Good";

}

else if(score>=50){

status="🟡 Average";

}

else{

status="🔴 Poor";

}

document.getElementById("financialScore").innerHTML =
score.toFixed(0)+"%";

document.getElementById("financialStatus").innerHTML =
status;

localStorage.setItem("financialScore",score);

localStorage.setItem("financialStatus",status);

// ===============================
// AI Risk Alert
// ===============================

let risk="";

if(expense>income){

risk="🚨 Critical Alert : Your expenses are higher than your income.";

}

else if(saving<income*0.10){

risk="⚠️ Warning : Your savings are below 10%.";

}

else if(expense>income*0.80){

risk="🟡 Alert : Your spending is too high.";

}

else{

risk="🟢 No Financial Risk Detected.";

}

document.getElementById("riskAlert").innerHTML =
risk;

localStorage.setItem("riskAlert",risk);

// ===============================
// Personalized Financial Advice
// ===============================

let advice="";

if(expense>income){

advice="❌ Spend less than your income and avoid unnecessary purchases.";

}

else if(saving<income*0.20){

advice="💰 Increase your monthly savings and build an emergency fund.";

}

else if(saving>=income*0.30){

advice="📈 Great! You can invest more in SIPs, Mutual Funds or other long-term investments.";

}

else{

advice="✅ Maintain your current budget and continue tracking your expenses.";

}

document.getElementById("financialAdvice").innerHTML =
advice;

localStorage.setItem("financialAdvice",advice);

}

function loadSavingTips(){

let tips=
JSON.parse(localStorage.getItem("aiSavingTips")) || [];

let list=
document.getElementById("savingTips");

if(!list) return;

list.innerHTML="";

if(tips.length==0){

list.innerHTML="<li>No Tips Yet</li>";

return;

}

tips.forEach(function(item){

list.innerHTML += "<li>"+item+"</li>";

});

}

function loadFinancialScore(){

let score=
Number(localStorage.getItem("financialScore")) || 0;

let status=
localStorage.getItem("financialStatus") || "Not Calculated";

if(document.getElementById("financialScore")){

document.getElementById("financialScore").innerHTML=
score.toFixed(0)+"%";

}

if(document.getElementById("financialStatus")){

document.getElementById("financialStatus").innerHTML=
status;

}

}

function loadRiskAlert(){

let risk=
localStorage.getItem("riskAlert") || "No Risk Detected";

if(document.getElementById("riskAlert")){

document.getElementById("riskAlert").innerHTML=
risk;

}

}

function loadFinancialAdvice(){

let advice=
localStorage.getItem("financialAdvice") || "No Advice Yet";

if(document.getElementById("financialAdvice")){

document.getElementById("financialAdvice").innerHTML=
advice;

}

}

window.addEventListener("load", function(){

    loadBudgetRecommendation();

    loadReductionPlan();

    loadSpendingHabit();

    loadMonthlySummary();

    loadHealthScore();

    loadHealthTips();

    loadForecast();

    loadWealthGrowth();

    loadRetirement();

    loadRiskAlert();

    loadFinancialAdvice();

    loadFinancialScore();

    loadSavingTips();

    loadBudgetPerformance();

    loadBudgetScore();

    loadGoalProgress();

    loadGoalPrediction();

    loadGoalRecommendation();

    loadGoalScore();

    loadFinancialGoals();

    loadFamilyMembers();

    loadFamilyFinanceReport();

    loadFamilySummary();

    loadFamilyAnalytics();

    loadSharedExpense();

    loadSharedHistory();

    loadSharedAnalytics();

    loadPaymentStatus();

    calculateSettlement();

});

// ===============================
// Step 83F - AI Monthly Summary
// ===============================

function generateMonthlySummary(){

let income =
Number(document.getElementById("incomeAI").value);

let expense =
Number(document.getElementById("expenseAI").value);

if(income<=0){

alert("Enter Income");

return;

}

let saving =
income-expense;

let score =
100-((expense/income)*100);

if(score<0){

score=0;

}

let rating="";

if(score>=90){

rating="🟢 Excellent";

}

else if(score>=70){

rating="🔵 Good";

}

else if(score>=50){

rating="🟡 Average";

}

else{

rating="🔴 Poor";

}

let today =
new Date();

let month =
today.toLocaleString("default",{
month:"long",
year:"numeric"
});

document.getElementById("summaryMonth").innerHTML =
month;

document.getElementById("summaryIncome").innerHTML =
"₹"+income.toFixed(2);

document.getElementById("summaryExpense").innerHTML =
"₹"+expense.toFixed(2);

document.getElementById("summarySaving").innerHTML =
"₹"+saving.toFixed(2);

document.getElementById("summaryScore").innerHTML =
score.toFixed(0)+"%";

document.getElementById("summaryRating").innerHTML =
rating;

localStorage.setItem("summaryMonth",month);

localStorage.setItem("summaryIncome",income);

localStorage.setItem("summaryExpense",expense);

localStorage.setItem("summarySaving",saving);

localStorage.setItem("summaryScore",score);

localStorage.setItem("summaryRating",rating);

}

function loadMonthlySummary(){

if(document.getElementById("summaryMonth")){

document.getElementById("summaryMonth").innerHTML =
localStorage.getItem("summaryMonth") || "-";

document.getElementById("summaryIncome").innerHTML =
"₹"+(Number(localStorage.getItem("summaryIncome"))||0).toFixed(2);

document.getElementById("summaryExpense").innerHTML =
"₹"+(Number(localStorage.getItem("summaryExpense"))||0).toFixed(2);

document.getElementById("summarySaving").innerHTML =
"₹"+(Number(localStorage.getItem("summarySaving"))||0).toFixed(2);

document.getElementById("summaryScore").innerHTML =
(Number(localStorage.getItem("summaryScore"))||0).toFixed(0)+"%";

document.getElementById("summaryRating").innerHTML =
localStorage.getItem("summaryRating") ||
"Not Generated";

}

    }

// ===============================
// Step 84A - Advanced Financial Health Score
// ===============================

function calculateHealthScore(){

// Income & Expense from AI Summary
let income =
Number(localStorage.getItem("summaryIncome")) || 0;

let expense =
Number(localStorage.getItem("summaryExpense")) || 0;

if(income<=0){

alert("Please Generate Monthly Summary First");

return;

}

let saving = income - expense;

let savingRate = (saving/income)*100;

let expenseRate = (expense/income)*100;

let score = 0;

// Saving Score
if(savingRate>=40){

score += 40;

}

else if(savingRate>=30){

score += 35;

}

else if(savingRate>=20){

score += 25;

}

else if(savingRate>=10){

score += 15;

}

else{

score += 5;

}

// Expense Score
if(expenseRate<=50){

score += 30;

}

else if(expenseRate<=70){

score += 20;

}

else{

score += 10;

}

// Bonus
if(income>expense){

score += 30;

}

if(score>100){

score=100;

}

let grade="";
let status="";

if(score>=90){

grade="A+";
status="🟢 Excellent";

}

else if(score>=80){

grade="A";
status="🔵 Very Good";

}

else if(score>=70){

grade="B";
status="🟡 Good";

}

else if(score>=60){

grade="C";
status="🟠 Average";

}

else{

grade="D";
status="🔴 Poor";

}

document.getElementById("overallHealthScore").innerHTML =
score;

document.getElementById("healthGrade").innerHTML =
grade;

document.getElementById("healthStatus").innerHTML =
status;

localStorage.setItem("overallHealthScore",score);

localStorage.setItem("healthGrade",grade);

localStorage.setItem("healthStatus",status);

    // ===============================
// Step 84B - Health Tips
// ===============================

let healthTips=[];

if(score<50){

healthTips.push("🚨 Reduce unnecessary expenses.");

healthTips.push("💰 Increase your monthly savings.");

healthTips.push("📒 Create a monthly budget.");

}

else if(score<70){

healthTips.push("🙂 Try to save at least 20% of your income.");

healthTips.push("🛒 Control shopping expenses.");

}

else if(score<90){

healthTips.push("📈 Start investing regularly.");

healthTips.push("🏦 Build an emergency fund.");

}

else{

healthTips.push("🎉 Excellent! Keep maintaining your financial discipline.");

healthTips.push("🚀 Continue investing for long-term wealth.");

}

localStorage.setItem(
"healthTips",
JSON.stringify(healthTips)
);

loadHealthTips();

}

function loadHealthScore(){

if(document.getElementById("overallHealthScore")){

document.getElementById("overallHealthScore").innerHTML =
localStorage.getItem("overallHealthScore") || "0";

document.getElementById("healthGrade").innerHTML =
localStorage.getItem("healthGrade") || "-";

document.getElementById("healthStatus").innerHTML =
localStorage.getItem("healthStatus") || "Not Calculated";

}

}

function loadHealthTips(){

let tips=
JSON.parse(localStorage.getItem("healthTips")) || [];

let list=
document.getElementById("healthTips");

if(!list) return;

list.innerHTML="";

if(tips.length==0){

list.innerHTML="<li>No Tips Yet</li>";

return;

}

tips.forEach(function(item){

list.innerHTML += "<li>"+item+"</li>";

});

}

// ===============================
// Step 84C - AI Financial Forecast
// ===============================

function generateForecast(){

let income =
Number(localStorage.getItem("summaryIncome")) || 0;

let expense =
Number(localStorage.getItem("summaryExpense")) || 0;

if(income<=0){

alert("Generate Monthly Summary First");

return;

}

// AI Prediction
let nextIncome =
income*1.05;

let nextExpense =
expense*1.03;

let saving =
nextIncome-nextExpense;

let prediction="";

if(saving>income*0.30){

prediction="🟢 Excellent Growth Expected";

}

else if(saving>income*0.20){

prediction="🔵 Stable Financial Growth";

}

else{

prediction="🟡 Spending May Increase";

}

document.getElementById("forecastIncome").innerHTML =
"₹"+nextIncome.toFixed(2);

document.getElementById("forecastExpense").innerHTML =
"₹"+nextExpense.toFixed(2);

document.getElementById("forecastSaving").innerHTML =
"₹"+saving.toFixed(2);

document.getElementById("forecastStatus").innerHTML =
prediction;

localStorage.setItem("forecastIncome",nextIncome);

localStorage.setItem("forecastExpense",nextExpense);

localStorage.setItem("forecastSaving",saving);

localStorage.setItem("forecastStatus",prediction);

}

function loadForecast(){

if(document.getElementById("forecastIncome")){

document.getElementById("forecastIncome").innerHTML =
"₹"+(Number(localStorage.getItem("forecastIncome"))||0).toFixed(2);

document.getElementById("forecastExpense").innerHTML =
"₹"+(Number(localStorage.getItem("forecastExpense"))||0).toFixed(2);

document.getElementById("forecastSaving").innerHTML =
"₹"+(Number(localStorage.getItem("forecastSaving"))||0).toFixed(2);

document.getElementById("forecastStatus").innerHTML =
localStorage.getItem("forecastStatus") ||
"Not Generated";

}

}

// ===============================
// Step 84D - AI Budget Optimizer
// ===============================

function optimizeBudget(){

let income =
Number(localStorage.getItem("summaryIncome"));

let expense =
Number(localStorage.getItem("summaryExpense"));

if(isNaN(income) || income<=0){

alert("⚠️ First go to AI Spending Suggestions and click 'Generate Monthly Summary'.");

return;

}

let recommendedBudget = income*0.70;

let recommendedSaving = income-recommendedBudget;

let advice="";

if(expense>recommendedBudget){

advice="⚠️ Reduce expenses by ₹"+(expense-recommendedBudget).toFixed(2);

}else{

advice="🎉 Great! Your spending is already within the recommended budget.";

}

document.getElementById("recommendedBudget").innerHTML =
"₹"+recommendedBudget.toFixed(2);

document.getElementById("recommendedSaving").innerHTML =
"₹"+recommendedSaving.toFixed(2);

document.getElementById("budgetAdvice").innerHTML =
advice;

localStorage.setItem("recommendedBudget",recommendedBudget);

localStorage.setItem("recommendedSaving",recommendedSaving);

localStorage.setItem("budgetAdvice",advice);

}

// ===============================
// Step 84E - AI Wealth Growth Planner
// ===============================

function calculateWealthGrowth(){

let saving =
Number(localStorage.getItem("summarySaving")) || 0;

if(saving<=0){

alert("Generate Monthly Summary First");

return;

}

let wealth1 = saving * 12;

let wealth5 = saving * 12 * 5;

let wealth10 = saving * 12 * 10;

let advice="";

if(saving>=20000){

advice="🟢 Excellent! Continue investing regularly for long-term wealth.";

}

else if(saving>=10000){

advice="🔵 Good! Increase your monthly savings gradually.";

}

else{

advice="🟡 Try to save more every month to build wealth faster.";

}

document.getElementById("wealth1Year").innerHTML =
"₹"+wealth1.toFixed(2);

document.getElementById("wealth5Year").innerHTML =
"₹"+wealth5.toFixed(2);

document.getElementById("wealth10Year").innerHTML =
"₹"+wealth10.toFixed(2);

document.getElementById("wealthAdvice").innerHTML =
advice;

localStorage.setItem("wealth1Year",wealth1);

localStorage.setItem("wealth5Year",wealth5);

localStorage.setItem("wealth10Year",wealth10);

localStorage.setItem("wealthAdvice",advice);

}

function loadWealthGrowth(){

if(document.getElementById("wealth1Year")){

document.getElementById("wealth1Year").innerHTML =
"₹"+(Number(localStorage.getItem("wealth1Year"))||0).toFixed(2);

document.getElementById("wealth5Year").innerHTML =
"₹"+(Number(localStorage.getItem("wealth5Year"))||0).toFixed(2);

document.getElementById("wealth10Year").innerHTML =
"₹"+(Number(localStorage.getItem("wealth10Year"))||0).toFixed(2);

document.getElementById("wealthAdvice").innerHTML =
localStorage.getItem("wealthAdvice") || "Not Generated";

}

}

// ===============================
// Step 84F - AI Retirement Planner
// ===============================

function calculateRetirement(){

let currentAge =
Number(document.getElementById("currentAge").value);

let retirementAge =
Number(document.getElementById("retirementAge").value);

let monthlyInvestment =
Number(document.getElementById("monthlyInvestment").value);

if(currentAge<=0 || retirementAge<=currentAge){

alert("Enter Valid Ages");

return;

}

if(monthlyInvestment<=0){

alert("Enter Monthly Investment");

return;

}

let years =
retirementAge-currentAge;

let corpus =
monthlyInvestment*12*years;

let score =
(years*2);

if(score>100){

score=100;

}

let advice="";

if(score>=80){

advice="🟢 Excellent! You are on track for retirement.";

}

else if(score>=60){

advice="🔵 Good! Increase investments gradually.";

}

else{

advice="🟡 Start investing more for a comfortable retirement.";

}

document.getElementById("retirementCorpus").innerHTML =
"₹"+corpus.toFixed(2);

document.getElementById("retirementScore").innerHTML =
score+"%";

document.getElementById("retirementAdvice").innerHTML =
advice;

localStorage.setItem("retirementCorpus",corpus);

localStorage.setItem("retirementScore",score);

localStorage.setItem("retirementAdvice",advice);

}

function loadRetirement(){

if(document.getElementById("retirementCorpus")){

document.getElementById("retirementCorpus").innerHTML =
"₹"+(Number(localStorage.getItem("retirementCorpus"))||0).toFixed(2);

document.getElementById("retirementScore").innerHTML =
(Number(localStorage.getItem("retirementScore"))||0)+"%";

document.getElementById("retirementAdvice").innerHTML =
localStorage.getItem("retirementAdvice") ||
"Not Generated";

}

}

// ===============================
// Step 85A - Smart Budget Recommendations
// ===============================

function generateBudgetRecommendation(){

let income =
Number(localStorage.getItem("summaryIncome")) || 0;

if(income<=0){

alert("Generate Monthly Summary First");

return;

}

let budget = income * 0.80;

let food = budget * 0.30;

let transport = budget * 0.15;

let entertainment = budget * 0.10;

let saving = income * 0.20;

let advice =
"✅ Spend within your recommended budget and save at least 20% every month.";

document.getElementById("recommendedBudgetAmount").innerHTML =
"₹"+budget.toFixed(2);

document.getElementById("foodBudget").innerHTML =
"₹"+food.toFixed(2);

document.getElementById("transportBudget").innerHTML =
"₹"+transport.toFixed(2);

document.getElementById("entertainmentBudget").innerHTML =
"₹"+entertainment.toFixed(2);

document.getElementById("savingTarget").innerHTML =
"₹"+saving.toFixed(2);

document.getElementById("budgetRecommendation").innerHTML =
advice;

localStorage.setItem("recommendedBudgetAmount",budget);

localStorage.setItem("foodBudget",food);

localStorage.setItem("transportBudget",transport);

localStorage.setItem("entertainmentBudget",entertainment);

localStorage.setItem("savingTarget",saving);

localStorage.setItem("budgetRecommendation",advice);

}

function loadBudgetRecommendation(){

if(document.getElementById("recommendedBudgetAmount")){

document.getElementById("recommendedBudgetAmount").innerHTML =
"₹"+(Number(localStorage.getItem("recommendedBudgetAmount"))||0).toFixed(2);

document.getElementById("foodBudget").innerHTML =
"₹"+(Number(localStorage.getItem("foodBudget"))||0).toFixed(2);

document.getElementById("transportBudget").innerHTML =
"₹"+(Number(localStorage.getItem("transportBudget"))||0).toFixed(2);

document.getElementById("entertainmentBudget").innerHTML =
"₹"+(Number(localStorage.getItem("entertainmentBudget"))||0).toFixed(2);

document.getElementById("savingTarget").innerHTML =
"₹"+(Number(localStorage.getItem("savingTarget"))||0).toFixed(2);

document.getElementById("budgetRecommendation").innerHTML =
localStorage.getItem("budgetRecommendation") ||
"Not Generated";

}

}

// ===============================
// Step 85B - Smart Expense Reduction Plan
// ===============================

function generateReductionPlan(){

let income =
Number(localStorage.getItem("summaryIncome")) || 0;

let expense =
Number(localStorage.getItem("summaryExpense")) || 0;

if(income<=0){

alert("Generate Monthly Summary First");

return;

}

let plan="";

let ratio=(expense/income)*100;

if(ratio>=90){

plan="🚨 Your expenses are extremely high. Reduce food, shopping, travel and entertainment expenses immediately.";

}

else if(ratio>=75){

plan="⚠️ Reduce entertainment and shopping expenses. Try to save at least 20% of your income.";

}

else if(ratio>=60){

plan="🙂 Your spending is under control, but reducing unnecessary expenses can increase savings.";

}

else{

plan="🎉 Excellent! Your spending is healthy. Continue following your budget.";

}

document.getElementById("expenseReductionPlan").innerHTML =
plan;

localStorage.setItem("expenseReductionPlan",plan);

}

function loadReductionPlan(){

if(document.getElementById("expenseReductionPlan")){

document.getElementById("expenseReductionPlan").innerHTML =

localStorage.getItem("expenseReductionPlan") ||

"Not Generated";

}

}

// ===============================
// Step 85C - AI Spending Habit Analyzer
// ===============================

function analyzeSpendingHabit(){

let income =
Number(localStorage.getItem("summaryIncome")) || 0;

let expense =
Number(localStorage.getItem("summaryExpense")) || 0;

if(income<=0){

alert("Generate Monthly Summary First");

return;

}

let ratio = (expense/income)*100;

let habit="";
let suggestion="";

if(ratio>=90){

habit="🔴 Overspender";

suggestion="Reduce unnecessary expenses immediately.";

}

else if(ratio>=70){

habit="🟡 Average Spender";

suggestion="Control shopping and entertainment expenses.";

}

else if(ratio>=50){

habit="🟢 Smart Spender";

suggestion="Good! Continue maintaining your budget.";

}

else{

habit="🏆 Excellent Saver";

suggestion="Fantastic! Increase investments for long-term wealth.";

}

document.getElementById("spendingHabit").innerHTML = habit;

document.getElementById("habitSuggestion").innerHTML = suggestion;

localStorage.setItem("spendingHabit",habit);

localStorage.setItem("habitSuggestion",suggestion);

}

function loadSpendingHabit(){

if(document.getElementById("spendingHabit")){

document.getElementById("spendingHabit").innerHTML =
localStorage.getItem("spendingHabit") || "Not Analyzed";

document.getElementById("habitSuggestion").innerHTML =
localStorage.getItem("habitSuggestion") || "No Suggestion";

}

}

// ===============================
// Step 85D - Budget Performance
// ===============================

function calculateBudgetPerformance(){

let budget =
Number(localStorage.getItem("recommendedBudgetAmount")) || 0;

let expense =
Number(localStorage.getItem("summaryExpense")) || 0;

if(budget<=0){

alert("Generate Budget Recommendation First");

return;

}

let follow =
((budget-expense)/budget)*100;

if(follow<0){

follow=0;

}

let remain =
budget-expense;

let performance="";

if(expense>budget){

performance="🔴 Budget Exceeded";

}

else if(follow>=30){

performance="🟢 Excellent Budget Control";

}

else if(follow>=10){

performance="🔵 Good Budget Control";

}

else{

performance="🟡 Budget Almost Used";

}

document.getElementById("budgetFollowPercent").innerHTML =
follow.toFixed(0)+"%";

document.getElementById("budgetRemaining").innerHTML =
"₹"+remain.toFixed(2);

document.getElementById("budgetPerformance").innerHTML =
performance;

localStorage.setItem("budgetFollowPercent",follow);

localStorage.setItem("budgetRemaining",remain);

localStorage.setItem("budgetPerformance",performance);

}

function loadBudgetPerformance(){

if(document.getElementById("budgetFollowPercent")){

document.getElementById("budgetFollowPercent").innerHTML =
(Number(localStorage.getItem("budgetFollowPercent"))||0).toFixed(0)+"%";

document.getElementById("budgetRemaining").innerHTML =
"₹"+(Number(localStorage.getItem("budgetRemaining"))||0).toFixed(2);

document.getElementById("budgetPerformance").innerHTML =
localStorage.getItem("budgetPerformance") ||
"Not Calculated";

}

}

// ===============================
// Step 85E - Smart Budget Score
// ===============================

function calculateBudgetScore(){

let budget =
Number(localStorage.getItem("recommendedBudgetAmount")) || 0;

let expense =
Number(localStorage.getItem("summaryExpense")) || 0;

if(budget<=0){

alert("Generate Budget Recommendation First");

return;

}

let score = 100;

if(expense>budget){

score -= 40;

}

else{

let remain =
budget-expense;

score = (remain/budget)*100;

}

if(score<0){

score=0;

}

if(score>100){

score=100;

}

let grade="";
let status="";

if(score>=90){

grade="A+";
status="🟢 Excellent";

}

else if(score>=80){

grade="A";
status="🔵 Very Good";

}

else if(score>=70){

grade="B";
status="🟡 Good";

}

else if(score>=60){

grade="C";
status="🟠 Average";

}

else{

grade="D";
status="🔴 Poor";

}

document.getElementById("budgetScore").innerHTML =
score.toFixed(0);

document.getElementById("budgetGrade").innerHTML =
grade;

document.getElementById("budgetScoreStatus").innerHTML =
status;

localStorage.setItem("budgetScore",score);

localStorage.setItem("budgetGrade",grade);

localStorage.setItem("budgetScoreStatus",status);

}

function loadBudgetScore(){

if(document.getElementById("budgetScore")){

document.getElementById("budgetScore").innerHTML =
Number(localStorage.getItem("budgetScore")) || 0;

document.getElementById("budgetGrade").innerHTML =
localStorage.getItem("budgetGrade") || "-";

document.getElementById("budgetScoreStatus").innerHTML =
localStorage.getItem("budgetScoreStatus") ||
"Not Calculated";

}

}

// ===============================
// Step 86A - Savings Goal Progress
// ===============================

function calculateGoalProgress(){

let goal =
Number(document.getElementById("goalTarget").value);

let saving =
Number(document.getElementById("currentSaving").value);

if(goal<=0){

alert("Enter Goal Amount");

return;

}

let progress = (saving/goal)*100;

if(progress>100){

progress=100;

}

let status="";

if(progress>=100){

status="🏆 Goal Achieved";

}
else if(progress>=75){

status="🟢 Almost There";

}
else if(progress>=50){

status="🔵 Halfway Completed";

}
else if(progress>=25){

status="🟡 Good Start";

}
else{

status="🔴 Keep Saving";

}

document.getElementById("goalAmountDisplay").innerHTML =
"₹"+goal.toFixed(2);

document.getElementById("currentSavingDisplay").innerHTML =
"₹"+saving.toFixed(2);

document.getElementById("goalProgressPercent").innerHTML =
progress.toFixed(0)+"%";

document.getElementById("goalStatus").innerHTML =
status;

localStorage.setItem("goalTarget",goal);

localStorage.setItem("currentSaving",saving);

localStorage.setItem("goalProgressPercent",progress);

localStorage.setItem("goalStatus",status);

}

function loadGoalProgress(){

if(document.getElementById("goalAmountDisplay")){

document.getElementById("goalTarget").value =
Number(localStorage.getItem("goalTarget")) || "";

document.getElementById("currentSaving").value =
Number(localStorage.getItem("currentSaving")) || "";

document.getElementById("goalAmountDisplay").innerHTML =
"₹"+(Number(localStorage.getItem("goalTarget"))||0).toFixed(2);

document.getElementById("currentSavingDisplay").innerHTML =
"₹"+(Number(localStorage.getItem("currentSaving"))||0).toFixed(2);

document.getElementById("goalProgressPercent").innerHTML =
(Number(localStorage.getItem("goalProgressPercent"))||0).toFixed(0)+"%";

document.getElementById("goalStatus").innerHTML =
localStorage.getItem("goalStatus") || "Not Calculated";

}

}

// ===============================
// Step 86B - Goal Time Predictor
// ===============================

function predictGoalTime(){

let goal =
Number(localStorage.getItem("goalTarget")) || 0;

let current =
Number(localStorage.getItem("currentSaving")) || 0;

let monthly =
Number(document.getElementById("monthlySaving").value);

if(goal<=0){

alert("Calculate Goal Progress First");

return;

}

if(monthly<=0){

alert("Enter Monthly Saving");

return;

}

let remaining = goal-current;

if(remaining<0){

remaining=0;

}

let months =
Math.ceil(remaining/monthly);

let advice="";

if(months<=6){

advice="🟢 Excellent! You will achieve your goal very soon.";

}

else if(months<=12){

advice="🔵 Good Progress. Stay consistent.";

}

else{

advice="🟡 Increase your monthly savings to reach your goal faster.";

}

document.getElementById("remainingGoalAmount").innerHTML =
"₹"+remaining.toFixed(2);

document.getElementById("goalCompletionTime").innerHTML =
months+" Months";

document.getElementById("goalPredictionAdvice").innerHTML =
advice;

localStorage.setItem("remainingGoalAmount",remaining);

localStorage.setItem("goalCompletionTime",months);

localStorage.setItem("goalPredictionAdvice",advice);

}

function loadGoalPrediction(){

if(document.getElementById("remainingGoalAmount")){

document.getElementById("remainingGoalAmount").innerHTML =
"₹"+(Number(localStorage.getItem("remainingGoalAmount"))||0).toFixed(2);

document.getElementById("goalCompletionTime").innerHTML =
(localStorage.getItem("goalCompletionTime")||0)+" Months";

document.getElementById("goalPredictionAdvice").innerHTML =
localStorage.getItem("goalPredictionAdvice") ||
"Not Calculated";

}

}

// ===============================
// Step 86C - AI Goal Recommendation
// ===============================

function generateGoalRecommendation(){

let goal =
Number(localStorage.getItem("goalTarget")) || 0;

let current =
Number(localStorage.getItem("currentSaving")) || 0;

let monthly =
Number(document.getElementById("monthlySaving").value);

if(goal<=0){

alert("Calculate Goal Progress First");

return;

}

if(monthly<=0){

alert("Enter Monthly Saving");

return;

}

let remaining = goal-current;

if(remaining<0){

remaining=0;

}

let months =
Math.ceil(remaining/monthly);

let difficulty="";
let advice="";

if(months<=6){

difficulty="🟢 Easy";

advice="Excellent! Continue your current saving habit.";

}

else if(months<=12){

difficulty="🔵 Moderate";

advice="Increase your monthly saving slightly to reach the goal faster.";

}

else{

difficulty="🔴 Difficult";

advice="Increase monthly savings or reduce unnecessary expenses.";

}

document.getElementById("requiredMonthlySaving").innerHTML =
"₹"+monthly.toFixed(2);

document.getElementById("goalDifficulty").innerHTML =
difficulty;

document.getElementById("goalRecommendation").innerHTML =
advice;

localStorage.setItem("requiredMonthlySaving",monthly);

localStorage.setItem("goalDifficulty",difficulty);

localStorage.setItem("goalRecommendation",advice);

}

function loadGoalRecommendation(){

if(document.getElementById("requiredMonthlySaving")){

document.getElementById("requiredMonthlySaving").innerHTML =
"₹"+(Number(localStorage.getItem("requiredMonthlySaving"))||0).toFixed(2);

document.getElementById("goalDifficulty").innerHTML =
localStorage.getItem("goalDifficulty") || "Not Calculated";

document.getElementById("goalRecommendation").innerHTML =
localStorage.getItem("goalRecommendation") || "Not Generated";

}

}

// ===============================
// Step 86D - Goal Achievement Score
// ===============================

function calculateGoalScore(){

let goal =
Number(localStorage.getItem("goalTarget")) || 0;

let current =
Number(localStorage.getItem("currentSaving")) || 0;

if(goal<=0){

alert("Calculate Goal Progress First");

return;

}

let score = (current/goal)*100;

if(score>100){

score=100;

}

let grade="";
let status="";

if(score>=90){

grade="A+";
status="🟢 Excellent";

}

else if(score>=75){

grade="A";
status="🔵 Very Good";

}

else if(score>=50){

grade="B";
status="🟡 Good";

}

else if(score>=25){

grade="C";
status="🟠 Average";

}

else{

grade="D";
status="🔴 Poor";

}

document.getElementById("goalScore").innerHTML =
score.toFixed(0);

document.getElementById("goalGrade").innerHTML =
grade;

document.getElementById("goalScoreStatus").innerHTML =
status;

localStorage.setItem("goalScore",score);

localStorage.setItem("goalGrade",grade);

localStorage.setItem("goalScoreStatus",status);

}

function loadGoalScore(){

if(document.getElementById("goalScore")){

document.getElementById("goalScore").innerHTML =
Number(localStorage.getItem("goalScore")) || 0;

document.getElementById("goalGrade").innerHTML =
localStorage.getItem("goalGrade") || "-";

document.getElementById("goalScoreStatus").innerHTML =
localStorage.getItem("goalScoreStatus") || "Not Calculated";

}

}

// ===============================
// Step 86E - Multiple Financial Goals
// ===============================

function addFinancialGoal(){

let name =
document.getElementById("goalName").value.trim();

let amount =
Number(document.getElementById("goalAmount").value);

if(name=="" || amount<=0){

alert("Enter Goal Name and Amount");

return;

}

let goals =
JSON.parse(localStorage.getItem("financialGoals")) || [];

goals.push({

name:name,

amount:amount

});

localStorage.setItem(
"financialGoals",
JSON.stringify(goals)
);

document.getElementById("goalName").value="";

document.getElementById("goalAmount").value="";

loadFinancialGoals();

}

function loadFinancialGoals(){

let goals =
JSON.parse(localStorage.getItem("financialGoals")) || [];

let list =
document.getElementById("goalList");

if(!list) return;

list.innerHTML="";

if(goals.length==0){

list.innerHTML="<li>No Goals Added</li>";

return;

}

goals.forEach(function(goal,index){

list.innerHTML +=
`
<li>

🎯 <b>${goal.name}</b> - ₹${goal.amount.toFixed(2)}

<button onclick="editGoal(${index})">
✏️
</button>

<button onclick="deleteGoal(${index})">
🗑️
</button>

</li>
`;

});

}

// ===============================
// Step 86F - Delete Goal
// ===============================

function deleteGoal(index){

let goals =
JSON.parse(localStorage.getItem("financialGoals")) || [];

goals.splice(index,1);

localStorage.setItem(
"financialGoals",
JSON.stringify(goals)
);

loadFinancialGoals();

}

// ===============================
// Step 86F - Edit Goal
// ===============================

function editGoal(index){

let goals =
JSON.parse(localStorage.getItem("financialGoals")) || [];

let newName =
prompt("Edit Goal Name",goals[index].name);

let newAmount =
prompt("Edit Goal Amount",goals[index].amount);

if(newName!=null && newAmount!=null){

goals[index].name=newName;

goals[index].amount=Number(newAmount);

localStorage.setItem(
"financialGoals",
JSON.stringify(goals)
);

loadFinancialGoals();

}

}

// ===============================
// Step 87C - Family Members
// ===============================

function addFamilyMember(){

let name =
document.getElementById("memberName").value.trim();

if(name==""){

alert("Enter Member Name");

return;

}

let members =
JSON.parse(localStorage.getItem("familyMembers")) || [];

members.push({

name:name

});

localStorage.setItem(
"familyMembers",
JSON.stringify(members)
);

document.getElementById("memberName").value="";

loadFamilyMembers();

}

function loadFamilyMembers(){

let members =
JSON.parse(localStorage.getItem("familyMembers")) || [];

let list =
document.getElementById("familyList");

if(!list) return;

    let select =
document.getElementById("memberSelect");

if(select){

select.innerHTML="<option>Select Member</option>";

}

list.innerHTML="";

if(members.length==0){

list.innerHTML="<li>No Members Added</li>";

return;

}

members.forEach(function(member,index){

list.innerHTML +=
`
<li>

👤 ${member.name}

<button onclick="deleteFamilyMember(${index})">

🗑️

</button>

</li>
`;

    if(select){

select.innerHTML +=
`<option>${member.name}</option>`;

    }

});

}

function deleteFamilyMember(index){

let members =
JSON.parse(localStorage.getItem("familyMembers")) || [];

members.splice(index,1);

localStorage.setItem(
"familyMembers",
JSON.stringify(members)
);

loadFamilyMembers();

}

// ===============================
// Step 87D - Member Finance
// ===============================

function saveMemberFinance(){

let member =
document.getElementById("memberSelect").value;

let income =
Number(document.getElementById("memberIncome").value);

let expense =
Number(document.getElementById("memberExpense").value);

if(member=="Select Member"){

alert("Select Member");

return;

}

let finance =
JSON.parse(localStorage.getItem("familyFinance")) || {};

finance[member]={

income:income,

expense:expense,

balance:income-expense

};

localStorage.setItem(
"familyFinance",
JSON.stringify(finance)
);

    console.log(localStorage.getItem("familyFinance"));

alert("Saved Successfully");

loadFamilyFinanceReport();
loadFamilySummary();
loadFamilyAnalytics();

}

// ===============================
// Step 87E - Family Financial Report
// ===============================

function loadFamilyFinanceReport(){

let finance =
JSON.parse(localStorage.getItem("familyFinance")) || {};

let report =
document.getElementById("familyFinanceReport");

if(!report) return;

report.innerHTML="";

let members = Object.keys(finance);

if(members.length==0){

report.innerHTML="No Data Available";

return;

}

members.forEach(function(member){

report.innerHTML +=
`
<div class="card">

<h3>👤 ${member}</h3>

<p>💰 Income : ₹${finance[member].income.toFixed(2)}</p>

<p>💸 Expense : ₹${finance[member].expense.toFixed(2)}</p>

<p>💵 Balance : ₹${finance[member].balance.toFixed(2)}</p>

</div>
`;

});

}

// ===============================
// Step 88G - Load Family Members
// ===============================

function loadPaymentMembers(){

let members =
JSON.parse(localStorage.getItem("familyMembers")) || [];

let select =
document.getElementById("paymentMember");

if(!select) return;

select.innerHTML =
'<option>Select Member</option>';

members.forEach(function(member){

select.innerHTML +=
`<option>${member.name}</option>`;

});
}

// ===============================
// Step 87F - Family Total Dashboard
// ===============================

function loadFamilySummary(){

let finance =
JSON.parse(localStorage.getItem("familyFinance")) || {};

let totalIncome = 0;
let totalExpense = 0;
let totalBalance = 0;

Object.keys(finance).forEach(function(member){

totalIncome += finance[member].income || 0;

totalExpense += finance[member].expense || 0;

totalBalance += finance[member].balance || 0;

});

let members =
JSON.parse(localStorage.getItem("familyMembers")) || [];

if(document.getElementById("familyTotalIncome")){

document.getElementById("familyTotalIncome").innerHTML =
"₹"+totalIncome.toFixed(2);

document.getElementById("familyTotalExpense").innerHTML =
"₹"+totalExpense.toFixed(2);

document.getElementById("familyTotalBalance").innerHTML =
"₹"+totalBalance.toFixed(2);

document.getElementById("familyMemberCount").innerHTML =
members.length;

}

}

// ===============================
// Step 87G - Family Analytics
// ===============================

function loadFamilyAnalytics(){

let finance =
JSON.parse(localStorage.getItem("familyFinance")) || {};

let names=[];
let balances=[];

Object.keys(finance).forEach(function(member){

names.push(member);

balances.push(finance[member].balance);

});

let canvas =
document.getElementById("familyChart");

if(!canvas) return;

new Chart(canvas,{

type:"bar",

data:{

labels:names,

datasets:[{

label:"Balance",

data:balances,

backgroundColor:[
"#4CAF50",
"#2196F3",
"#FFC107",
"#FF5722",
"#9C27B0",
"#009688"
]

}]

},

options:{

responsive:true,

plugins:{

legend:{

display:false

}

}

}

});

}

// ===============================
// Step 88A - Generate Member Fields
// ===============================

function generateMemberFields(){

let total =
Number(document.getElementById("sharedMembers").value);

let box =
document.getElementById("memberFields");

if(total<=0){

alert("Enter Valid Member Count");

return;

}

box.innerHTML="";

for(let i=1;i<=total;i++){

box.innerHTML +=
`
<div class="card">

<h3>👤 Member ${i}</h3>

<input
type="text"
id="memberName${i}"
placeholder="Enter Member Name">

</div>
`;

}

}

// ===============================
// Step 88B - Get Member Names
// ===============================

function getMemberNames(){

let total =
Number(document.getElementById("sharedMembers").value);

let memberNames = [];

for(let i=1;i<=total;i++){

let name =
document.getElementById("memberName"+i).value.trim();

if(name==""){

alert("Please Enter Name of Member "+i);

return null;

}

memberNames.push(name);

}

return memberNames;

}

// ===============================
// Step 88C - Shared Expense Split
// ===============================

function calculateSharedExpense(){

let title =
document.getElementById("sharedTitle").value.trim();

let amount =
Number(document.getElementById("sharedAmount").value);

if(title==""){

alert("Enter Expense Name");

return;

}

if(amount<=0){

alert("Enter Valid Amount");

return;

}

// Get Member Names

let memberNames = getMemberNames();

if(memberNames==null){

return;

}

let members = memberNames.length;

let perPerson = amount/members;

// Split Result

let splitHTML="";

memberNames.forEach(function(name){

splitHTML +=
`
<p>

👤 ${name}

➡️ ₹${perPerson.toFixed(2)}

</p>
`;

});

// Show Result

document.getElementById("sharedTotal").innerHTML =
"₹"+amount.toFixed(2);

document.getElementById("sharedMemberCount").innerHTML =
members;

document.getElementById("perPersonExpense").innerHTML =
"₹"+perPerson.toFixed(2);

document.getElementById("memberSplitList").innerHTML =
splitHTML;

// Save

localStorage.setItem("sharedTitle",title);

localStorage.setItem("sharedTotal",amount);

localStorage.setItem("sharedMembers",members);

localStorage.setItem("perPersonExpense",perPerson);

localStorage.setItem("memberSplitList",splitHTML);

localStorage.setItem(
"sharedMemberNames",
JSON.stringify(memberNames)
);

// Save History

let history =
JSON.parse(localStorage.getItem("sharedExpenseHistory")) || [];

history.unshift({

title:title,

amount:amount,

members:members,

memberNames:memberNames,

perPerson:perPerson,

date:new Date().toLocaleDateString()

});

localStorage.setItem(
"sharedExpenseHistory",
JSON.stringify(history)
);

// Refresh

loadSharedExpense();

loadSharedHistory();

loadSharedAnalytics();

loadPaymentStatus();

calculateSettlement();

alert("Shared Expense Saved Successfully");

}

// ===============================
// Load Shared Expense
// ===============================

function loadSharedExpense(){

if(!document.getElementById("sharedTotal")) return;

document.getElementById("sharedTotal").innerHTML =
"₹"+(Number(localStorage.getItem("sharedTotal"))||0).toFixed(2);

document.getElementById("sharedMemberCount").innerHTML =
localStorage.getItem("sharedMembers") || "0";

document.getElementById("perPersonExpense").innerHTML =
"₹"+(Number(localStorage.getItem("perPersonExpense"))||0).toFixed(2);

document.getElementById("memberSplitList").innerHTML =
localStorage.getItem("memberSplitList") ||
"No Split Generated";

}

// ===============================
// Step 88D - Generate Payment Status
// ===============================

function loadPaymentStatus(){

let memberNames =
JSON.parse(localStorage.getItem("sharedMemberNames")) || [];

let payment =
JSON.parse(localStorage.getItem("paymentStatus")) || {};

let box =
document.getElementById("paymentSection");

if(!box) return;

box.innerHTML="";

if(memberNames.length==0){

box.innerHTML="No Members Generated";

return;

}

memberNames.forEach(function(name){

let status = payment[name] || "Unpaid";

box.innerHTML +=
`
<div class="card">

<b>👤 ${name}</b>

<select
id="status_${name}">

<option value="Paid"
${status=="Paid" ? "selected" : ""}>

Paid

</option>

<option value="Unpaid"
${status=="Unpaid" ? "selected" : ""}>

Unpaid

</option>

</select>

</div>
`;

});

box.innerHTML +=
`
<br>

<button onclick="savePaymentStatus()">

💾 Save Payment Status

</button>
`;

}

// ===============================
// Step 88E - Save Payment Status
// ===============================

function savePaymentStatus(){

let memberNames =
JSON.parse(localStorage.getItem("sharedMemberNames")) || [];

let payment = {};

memberNames.forEach(function(name){

payment[name] =
document.getElementById("status_"+name).value;

});

localStorage.setItem(
"paymentStatus",
JSON.stringify(payment)
);

alert("Payment Status Saved Successfully");

loadPaymentStatus();

calculateSettlement();

}

// ===============================
// Step 88F - Shared Expense History
// ===============================

function loadSharedHistory(){

let history =
JSON.parse(localStorage.getItem("sharedExpenseHistory")) || [];

let box =
document.getElementById("sharedHistory");

if(!box) return;

box.innerHTML = "";

if(history.length===0){

box.innerHTML = "<p>No History Available</p>";

return;

}

history.forEach(function(item){

let memberList = "";

if(item.memberNames && item.memberNames.length>0){

memberList = item.memberNames.join(", ");

}else{

memberList = item.members;

}

box.innerHTML += `
<div class="card">

<h3>📌 ${item.title}</h3>

<p>💰 Total : ₹${Number(item.amount).toFixed(2)}</p>

<p>👥 Members : ${memberList}</p>

<p>💵 Per Person : ₹${Number(item.perPerson).toFixed(2)}</p>

<p>📅 ${item.date}</p>

</div>
`;

});

}

// ===============================
// Step 88G - Shared Expense Analytics
// ===============================

function loadSharedAnalytics(){

let history =
JSON.parse(localStorage.getItem("sharedExpenseHistory")) || [];

if(!document.getElementById("analyticsTotalExpense")) return;

let total = 0;
let highest = 0;
let average = 0;

history.forEach(function(item){

total += Number(item.amount);

if(Number(item.amount) > highest){

highest = Number(item.amount);

}

});

if(history.length>0){

average = total/history.length;

}

document.getElementById("analyticsTotalExpense").innerHTML =
"₹"+total.toFixed(2);

document.getElementById("analyticsTotalRecords").innerHTML =
history.length;

document.getElementById("analyticsAverageExpense").innerHTML =
"₹"+average.toFixed(2);

document.getElementById("analyticsHighestExpense").innerHTML =
"₹"+highest.toFixed(2);

// Extra Analytics

let lowest = 0;

if(history.length>0){

lowest = Math.min(...history.map(item => Number(item.amount)));

}

if(document.getElementById("analyticsLowestExpense")){

document.getElementById("analyticsLowestExpense").innerHTML =
"₹"+lowest.toFixed(2);

}

}

// ===============================
// Step 88H - Final Settlement Calculator
// ===============================

function calculateSettlement(){

let memberNames =
JSON.parse(localStorage.getItem("sharedMemberNames")) || [];

let payment =
JSON.parse(localStorage.getItem("paymentStatus")) || {};

let amount =
Number(localStorage.getItem("perPersonExpense")) || 0;

let result =
document.getElementById("settlementResult");

if(!result) return;

result.innerHTML="";

if(memberNames.length==0){

result.innerHTML="<p>No Members Found</p>";

return;

}

let pending = 0;
let paid = 0;

memberNames.forEach(function(name){

let status = payment[name] || "Unpaid";

if(status=="Paid"){

result.innerHTML += `
<p>

🟢 <b>${name}</b> → Already Paid

</p>
`;

paid += amount;

}else{

result.innerHTML += `
<p>

🔴 <b>${name}</b> → Pay ₹${amount.toFixed(2)}

</p>
`;

pending += amount;

}

});

result.innerHTML += `

<hr>

<h3>💰 Total Paid : ₹${paid.toFixed(2)}</h3>

<h3>💸 Total Pending : ₹${pending.toFixed(2)}</h3>

<h3>👥 Grand Total : ₹${(paid+pending).toFixed(2)}</h3>

`;

}

// ===============================
// Step 95.2 - GST Variables
// ===============================

let invoiceCounter =
Number(localStorage.getItem("invoiceCounter")) || 1;

function loadGSTPage(){

const invoiceNo =
"AF-" + String(invoiceCounter).padStart(4,"0");

const today =
new Date().toISOString().split("T")[0];

if(document.getElementById("invoiceNumber")){

document.getElementById("invoiceNumber").value =
invoiceNo;

}

if(document.getElementById("invoiceDate")){

document.getElementById("invoiceDate").value =
today;

}

if(document.getElementById("dueDate")){

document.getElementById("dueDate").value =
today;

}

}

    // ===============================
// Step 95.2 - Add Product Row
// ===============================

function addProductRow(){

const table =
document.getElementById("productTable");

if(!table) return;

const row =
document.createElement("tr");

row.innerHTML = `
<td><input type="text" placeholder="Product"></td>
<td><input type="text" placeholder="HSN"></td>
<td><input type="number" class="qty" value="1" min="1"></td>
<td><input type="number" class="rate" value="0" min="0"></td>
<td><input type="number" class="gst" value="18" min="0"></td>
<td class="total">₹0.00</td>
<td>
<button class="deleteBtn">🗑️</button>
</td>
`;

table.appendChild(row);

}

window.addEventListener("load", function(){

    loadGSTPage();

    loadGSTData();

    calculateGST();

    const btn =
    document.getElementById("addProductBtn");

    if(btn){

        btn.addEventListener("click", addProductRow);

    }

});

// ===============================
// Step 95.2 - GST Auto Calculation
// ===============================

function calculateGST(){

let subtotal = 0;

document.querySelectorAll("#productTable tr").forEach(row=>{

const qty =
Number(row.querySelector(".qty")?.value)||0;

const rate =
Number(row.querySelector(".rate")?.value)||0;

const gst =
Number(row.querySelector(".gst")?.value)||0;

const amount = qty * rate;

    const gstAmount = amount * gst / 100;

const total = amount + gstAmount;

subtotal += amount;

if(row.querySelector(".total")){

row.querySelector(".total").innerHTML =
"₹" + total.toFixed(2);

}

});

const cgst = subtotal * 0.09;

const sgst = subtotal * 0.09;

const igst = 0;

const grand =
subtotal + cgst + sgst;

if(document.getElementById("subTotal")){

document.getElementById("subTotal").innerHTML =
"₹" + subtotal.toFixed(2);

}

if(document.getElementById("cgstTotal")){

document.getElementById("cgstTotal").innerHTML =
"₹" + cgst.toFixed(2);

}

if(document.getElementById("sgstTotal")){

document.getElementById("sgstTotal").innerHTML =
"₹" + sgst.toFixed(2);

}

if(document.getElementById("igstTotal")){

document.getElementById("igstTotal").innerHTML =
"₹" + igst.toFixed(2);

}

if(document.getElementById("grandTotal")){

document.getElementById("grandTotal").innerHTML =
"₹" + grand.toFixed(2);

}

}

document.addEventListener("input",function(e){

if(

e.target.classList.contains("qty") ||

e.target.classList.contains("rate") ||

e.target.classList.contains("gst")

){

calculateGST();

}

});

document.querySelectorAll(
"#productTable input"
).forEach(input=>{

input.addEventListener(
"input",
calculateGST
);

});

// ===============================
// Step 95.3 - Generate Invoice
// ===============================

function generateInvoice(){

calculateGST();

invoiceCounter++;

localStorage.setItem(
"invoiceCounter",
invoiceCounter
);

alert(
"✅ GST Invoice Generated Successfully!"
);

loadGSTPage();

}

// ===============================
// Step 95.3 - Invoice Preview
// ===============================

function generateInvoice(){

calculateGST();

let preview = "";

preview += "<h2>🧾 GST TAX INVOICE</h2>";

preview += "<hr>";

preview += "<h3>🏢 Business Details</h3>";

preview += "<p><b>Name :</b> " +
document.getElementById("businessName").value +
"</p>";

preview += "<p><b>GST :</b> " +
document.getElementById("businessGST").value +
"</p>";

preview += "<p><b>Mobile :</b> " +
document.getElementById("businessMobile").value +
"</p>";

preview += "<p><b>Email :</b> " +
document.getElementById("businessEmail").value +
"</p>";

preview += "<hr>";

preview += "<h3>👤 Customer Details</h3>";

preview += "<p><b>Name :</b> " +
document.getElementById("customerName").value +
"</p>";

preview += "<p><b>GST :</b> " +
document.getElementById("customerGST").value +
"</p>";

preview += "<p><b>Mobile :</b> " +
document.getElementById("customerMobile").value +
"</p>";

preview += "<hr>";

preview += "<h3>📦 Products</h3>";

preview += "<table border='1' width='100%'>";

preview += `
<tr>

<th>Product</th>

<th>Qty</th>

<th>Rate</th>

<th>GST%</th>

<th>Total</th>

</tr>
`;

document.querySelectorAll("#productTable tr").forEach(row=>{

const product =
row.cells[0].querySelector("input")?.value || "";

const qty =
row.cells[2].querySelector("input")?.value || "0";

const rate =
row.cells[3].querySelector("input")?.value || "0";

const gst =
row.cells[4].querySelector("input")?.value || "0";

const total =
row.cells[5].innerText;

preview += `
<tr>

<td>${product}</td>

<td>${qty}</td>

<td>₹${rate}</td>

<td>${gst}%</td>

<td>${total}</td>

</tr>
`;

});

preview += "</table>";

preview += "<hr>";

preview += "<h3>💰 GST Summary</h3>";

preview += "<p><b>Subtotal :</b> " +
document.getElementById("subTotal").innerHTML +
"</p>";

preview += "<p><b>CGST :</b> " +
document.getElementById("cgstTotal").innerHTML +
"</p>";

preview += "<p><b>SGST :</b> " +
document.getElementById("sgstTotal").innerHTML +
"</p>";

preview += "<h2>Grand Total : " +
document.getElementById("grandTotal").innerHTML +
"</h2>";

const win = window.open("","_blank");

    win.document.write(`

<html>

<head>

<title>ArthaFlow Invoice</title>

<style>

body{

font-family:Arial,sans-serif;

padding:30px;

background:#F8FAFC;

color:#111827;

}

.header{

display:flex;

align-items:center;

justify-content:space-between;

border-bottom:3px solid #2563EB;

padding-bottom:15px;

margin-bottom:25px;

}

.logo{

height:70px;

}

.company{

text-align:right;

}

.company h2{

margin:0;

color:#2563EB;

}

table{

width:100%;

border-collapse:collapse;

margin-top:20px;

}

th{

background:#2563EB;

color:#fff;

padding:10px;

}

td{

padding:10px;

border:1px solid #CBD5E1;

text-align:center;

}

.summary{

margin-top:25px;

float:right;

width:320px;

}

.summary p{

display:flex;

justify-content:space-between;

margin:8px 0;

}

.total{

font-size:22px;

font-weight:bold;

color:#2563EB;

border-top:2px solid #2563EB;

padding-top:10px;

}

.footer{

margin-top:80px;

text-align:center;

color:#64748B;

font-size:14px;

}

.watermark{

position:fixed;

top:40%;

left:25%;

font-size:90px;

font-weight:bold;

color:rgba(37,99,235,.08);

transform:rotate(-30deg);

pointer-events:none;

}

</style>

</head>

<body>

<div class="watermark">

ArthaFlow

</div>

<div class="header">

<img src="pdf-logo.png" class="logo">

<div class="company">

<h2>ArthaFlow Premium</h2>

<p>GST TAX INVOICE</p>

</div>

</div>

`);

win.document.write(preview);

win.document.close();

invoiceCounter++;

localStorage.setItem(
"invoiceCounter",
invoiceCounter
);

loadGSTPage();

}

// ===============================
// Step 95.5 - GST Auto Save
// ===============================

function saveGSTData(){

const ids = [

"businessName",
"businessGST",
"businessAddress",
"businessMobile",
"businessEmail",

"customerName",
"customerGST",
"customerMobile",
"customerAddress",

"invoiceNumber",
"invoiceDate",
"dueDate"

];

ids.forEach(id=>{

const el = document.getElementById(id);

if(el){

localStorage.setItem(id,el.value);

}

});

}

// ===============================
// Step 95.5 - GST Auto Load
// ===============================

function loadGSTData(){

const ids = [

"businessName",
"businessGST",
"businessAddress",
"businessMobile",
"businessEmail",

"customerName",
"customerGST",
"customerMobile",
"customerAddress",

"invoiceNumber",
"invoiceDate",
"dueDate"

];

ids.forEach(id=>{

const el = document.getElementById(id);

if(el && localStorage.getItem(id)!=null){

el.value = localStorage.getItem(id);

}

});

}

// ===============================
// Step 95.5 - Auto Save While Typing
// ===============================

document.addEventListener("input", function(e){

const ids = [

"businessName",
"businessGST",
"businessAddress",
"businessMobile",
"businessEmail",

"customerName",
"customerGST",
"customerMobile",
"customerAddress",

"invoiceNumber",
"invoiceDate",
"dueDate"

];

if(ids.includes(e.target.id)){

saveGSTData();

}

});

// ===============================
// Delete Product Row
// ===============================

document.addEventListener("click", function(e){

    if(e.target.classList.contains("deleteBtn")){

        const table =
        document.getElementById("productTable");

        if(table.rows.length > 1){

            e.target.closest("tr").remove();

            calculateGST();

        }else{

            alert("At least one product row is required.");

        }

    }

});

// ===============================
// Step 95.8 - Generate Invoice Preview
// ===============================

function generateInvoice(){

let preview = "";

preview += `
<div style="text-align:center;border-bottom:3px solid #2563EB;padding-bottom:15px;margin-bottom:20px;">

<img src="header-logo.png"
style="width:90px;height:auto;margin-bottom:10px;">

<h2 style="color:#2563EB;margin:0;">
ArthaFlow GST Invoice
</h2>

<p style="color:#666;">
Create • Calculate • Export
</p>

</div>
`;
preview += "<hr>";

preview += "<h3>🏢 Business Details</h3>";
preview += "<p><b>Business :</b> " + document.getElementById("businessName").value + "</p>";
preview += "<p><b>GST No :</b> " + document.getElementById("businessGST").value + "</p>";
preview += "<p><b>Mobile :</b> " + document.getElementById("businessMobile").value + "</p>";
preview += "<p><b>Email :</b> " + document.getElementById("businessEmail").value + "</p>";

preview += "<hr>";

preview += "<h3>👤 Customer Details</h3>";
preview += "<p><b>Name :</b> " + document.getElementById("customerName").value + "</p>";
preview += "<p><b>GST No :</b> " + document.getElementById("customerGST").value + "</p>";
preview += "<p><b>Mobile :</b> " + document.getElementById("customerMobile").value + "</p>";
preview += "<p><b>Address :</b> " + document.getElementById("customerAddress").value + "</p>";

preview += "<hr>";

preview += "<h3>🧾 Invoice Information</h3>";

preview += "<p><b>Invoice No :</b> " +
document.getElementById("invoiceNumber").value +
"</p>";

preview += "<p><b>Invoice Date :</b> " +
document.getElementById("invoiceDate").value +
"</p>";

preview += "<p><b>Due Date :</b> " +
document.getElementById("dueDate").value +
"</p>";

preview += "<hr>";

preview += "<h3>📦 Product Details</h3>";

preview += `
<table border="1" width="100%" cellspacing="0" cellpadding="6">
<tr>
<th>Product</th>
<th>HSN</th>
<th>Qty</th>
<th>Rate</th>
<th>GST</th>
<th>Total</th>
</tr>
`;

document.querySelectorAll("#productTable tr").forEach(row=>{

const product = row.cells[0].querySelector("input")?.value || "";
const hsn = row.cells[1].querySelector("input")?.value || "";
const qty = row.cells[2].querySelector("input")?.value || "0";
const rate = row.cells[3].querySelector("input")?.value || "0";
const gst = row.cells[4].querySelector("input")?.value || "0";
const total = row.cells[5].innerText || "₹0.00";

preview += `
<tr>
<td>${product || "-"}</td>
<td>${hsn || "-"}</td>
<td>${qty}</td>
<td>₹${Number(rate).toFixed(2)}</td>
<td>${gst}%</td>
<td>${total}</td>
</tr>
`;

});

preview += "</table>";

preview += "<hr>";

preview += "<h3>💰 GST Summary</h3>";
preview += "<p><b>Subtotal :</b> " + document.getElementById("subTotal").innerHTML + "</p>";
preview += "<p><b>CGST :</b> " + document.getElementById("cgstTotal").innerHTML + "</p>";
preview += "<p><b>SGST :</b> " + document.getElementById("sgstTotal").innerHTML + "</p>";
preview += "<p><b>IGST :</b> " + document.getElementById("igstTotal").innerHTML + "</p>";
preview += "<h2>Grand Total : " + document.getElementById("grandTotal").innerHTML + "</h2>";

preview += "<hr>";

preview += `
<br><br>

<table width="100%">

<tr>

<td align="left">

____________________
<br>

Customer Signature

</td>

<td align="right">

____________________
<br>

Authorized Signature

</td>

</tr>

</table>

`;

preview += `
<div style="text-align:center;margin-top:30px;">

<h3 style="color:#2563EB;">
💎 ArthaFlow Premium
</h3>

<p>Create • Calculate • Export</p>

<p style="font-size:12px;color:gray;">
© 2026 ArthaFlow
</p>

<p style="font-size:12px;">
Developed with ❤️ by <b>Aditya Aakash</b>
</p>

</div>
`;

document.getElementById("invoicePreview").innerHTML = preview;

}

// ===============================
// Step 95.9 - Print Invoice
// ===============================

function printInvoice(){

generateInvoice();

setTimeout(() => {

const printWindow = window.open("", "_blank");

printWindow.document.write(`
<html>
<head>
<title>ArthaFlow GST Invoice</title>
</head>
<body>
${document.getElementById("invoicePreview").innerHTML}
</body>
</html>
`);

printWindow.document.close();
printWindow.focus();
printWindow.print();

},500);

}

// ===============================
// Step 95.15 - Download Invoice PDF
// ===============================

async function downloadInvoicePDF(){

alert("Download Function Started");

generateInvoice();

const { jsPDF } = window.jspdf;

// PDF Logo
const logo = document.getElementById("pdfLogo");

const pdf = new jsPDF();

let y = 20;

// ===============================
// Premium Header with Logo
// ===============================

pdf.setFillColor(37,99,235);
pdf.rect(0,0,210,30,"F");

// Logo
if(logo){
    pdf.addImage(
        logo,
        "PNG",
        12,
        6,
        16,
        16
    );
}

// Title
pdf.setTextColor(255,255,255);
pdf.setFontSize(20);
pdf.text("ArthaFlow Premium",35,18);

// Right Side
pdf.setFontSize(11);
pdf.text("GST Invoice",160,18);

// Reset Text Color
pdf.setTextColor(0,0,0);

y = 40;
    
// ===============================
// Business & Customer Details
// ===============================

pdf.setFontSize(13);
pdf.setTextColor(37,99,235);
pdf.text("Business Details",20,y);

pdf.text("Customer Details",115,y);

y += 8;

pdf.setFontSize(10);
pdf.setTextColor(0,0,0);

// Left Column (Business)

pdf.text("Business :",20,y);
pdf.text(document.getElementById("businessName").value,50,y);

y += 6;

pdf.text("GST No :",20,y);
pdf.text(document.getElementById("businessGST").value,50,y);

y += 6;

pdf.text("Mobile :",20,y);
pdf.text(document.getElementById("businessMobile").value,50,y);

y += 6;

pdf.text("Email :",20,y);
pdf.text(document.getElementById("businessEmail").value,50,y);

// Right Column (Customer)

let y2 = y - 18;

pdf.text("Customer :",115,y2);
pdf.text(document.getElementById("customerName").value,150,y2);

y2 += 6;

pdf.text("GST No :",115,y2);
pdf.text(document.getElementById("customerGST").value,150,y2);

y2 += 6;

pdf.text("Mobile :",115,y2);
pdf.text(document.getElementById("customerMobile").value,150,y2);

y2 += 6;

pdf.text("Address :",115,y2);
pdf.text(document.getElementById("customerAddress").value,150,y2);

y = Math.max(y,y2) + 12;

pdf.line(20,y,190,y);

y += 10;

// ===============================
// Invoice Information Box
// ===============================

pdf.setFillColor(245,247,250);
pdf.roundedRect(20,y,170,28,3,3,"F");

pdf.setDrawColor(200);
pdf.roundedRect(20,y,170,28,3,3);

pdf.setFontSize(12);
pdf.setTextColor(37,99,235);
pdf.text("Invoice Information",25,y+7);

pdf.setFontSize(10);
pdf.setTextColor(0,0,0);

pdf.text("Invoice No : " + document.getElementById("invoiceNumber").value,25,y+15);

pdf.text("Invoice Date : " + document.getElementById("invoiceDate").value,100,y+15);

pdf.text("Due Date : " + document.getElementById("dueDate").value,25,y+23);

y += 40;


// ===============================
// Premium Product Table
// ===============================

pdf.setFillColor(37,99,235);
pdf.rect(20,y,170,8,"F");

pdf.setTextColor(255,255,255);
pdf.setFontSize(10);

pdf.text("Product",22,y+5);
pdf.text("HSN",65,y+5);
pdf.text("Qty",90,y+5);
pdf.text("Rate",110,y+5);
pdf.text("GST",140,y+5);
pdf.text("Total",165,y+5);

y += 12;

pdf.setTextColor(0,0,0);

document.querySelectorAll("#productTable tr").forEach(row=>{

const product =
row.cells[0].querySelector("input")?.value.trim() || "-";

const hsn =
row.cells[1].querySelector("input")?.value.trim() || "-";

const qty =
row.cells[2].querySelector("input")?.value || "0";

const rate =
row.cells[3].querySelector("input")?.value || "0";

const gst =
row.cells[4].querySelector("input")?.value || "0";

const total =
parseFloat(
row.cells[5].innerText.replace(/[^\d.]/g,"")
) || 0;

pdf.text(product,22,y);
pdf.text(hsn,65,y);
pdf.text(qty,90,y);
pdf.text("₹" + Number(rate).toFixed(2),110,y);
pdf.text(gst + "%",140,y);
pdf.text("₹" + total.toFixed(2),165,y);

y += 7;

// अगर पेज भर जाए तो नया पेज
if(y > 260){
    pdf.addPage();
    y = 20;
}

});

// ===============================
// Premium GST Summary
// ===============================

pdf.setFillColor(245,247,250);
pdf.roundedRect(20,y,170,38,3,3,"F");

pdf.setDrawColor(200);
pdf.roundedRect(20,y,170,38,3,3);

pdf.setFontSize(13);
pdf.setTextColor(37,99,235);
pdf.text("GST Summary",25,y+8);

pdf.setFontSize(10);
pdf.setTextColor(0,0,0);

pdf.text("Subtotal : " + document.getElementById("subTotal").innerText,25,y+17);

pdf.text("CGST : " + document.getElementById("cgstTotal").innerText,25,y+24);

pdf.text("SGST : " + document.getElementById("sgstTotal").innerText,25,y+31);

pdf.setFillColor(34,197,94);
pdf.roundedRect(115,y+12,65,18,3,3,"F");

pdf.setTextColor(255,255,255);
pdf.setFontSize(12);

const grand =
document.getElementById("grandTotal")
.innerText
.replace(/[^\d.]/g,"");

pdf.text(
"Grand : ₹" + Number(grand).toFixed(2),
120,
y+24
);

y += 50;
    
// ===============================
// Terms & Conditions
// ===============================

pdf.setTextColor(37,99,235);
pdf.setFontSize(13);
pdf.text("Terms & Conditions",20,y);

y += 8;

pdf.setTextColor(90);
pdf.setFontSize(9);

pdf.text("• Goods once sold will not be taken back.",20,y);

y += 5;

pdf.text("• Payment is due on or before the due date.",20,y);

y += 5;

pdf.text("• Subject to local jurisdiction only.",20,y);

y += 12;

// ===============================
// Signature
// ===============================

pdf.setTextColor(0,0,0);

pdf.line(140,y,190,y);

pdf.setFontSize(10);

pdf.text("Authorized Signature",145,y+6);

// ===============================
// Footer
// ===============================

pdf.setTextColor(120);

pdf.setFontSize(9);

pdf.text("Generated by ArthaFlow Premium",20,285);

pdf.text("Developed with ❤️ by Aditya Aakash",120,285);

// ===============================
// Save PDF
// ===============================

pdf.save("ArthaFlow_GST_Invoice.pdf");

}

// ===============================
// Step 95.16 - Download Filter PDF
// ===============================

async function downloadFilterPDF(){

    alert("Filter PDF Started");

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF();

    let y = 20;

// Header
pdf.setFillColor(37,99,235);
pdf.rect(0,0,210,28,"F");

pdf.setTextColor(255,255,255);
pdf.setFontSize(20);
pdf.text("ArthaFlow Premium",20,16);

pdf.setFontSize(10);
pdf.text("Filtered Financial Report",135,16);

pdf.setTextColor(0,0,0);

y = 40;

// Filter Dates
const fromDate = document.getElementById("fromDate").value || "Not Selected";
const toDate = document.getElementById("toDate").value || "Not Selected";

pdf.setFontSize(12);
pdf.text("From : " + fromDate,20,y);

pdf.text("To : " + toDate,120,y);

y += 12;

// ===============================
// Filter Summary
// ===============================

pdf.setFillColor(245,247,250);
pdf.roundedRect(20,y,170,35,3,3,"F");

pdf.setDrawColor(200);
pdf.roundedRect(20,y,170,35,3,3);

pdf.setTextColor(37,99,235);
pdf.setFontSize(13);
pdf.text("Filter Summary",25,y+8);

pdf.setTextColor(0,0,0);
pdf.setFontSize(11);

pdf.text(
"Total Income : " +
document.getElementById("filterIncome").innerText,
25,
y+18
);

pdf.text(
"Total Expense : " +
document.getElementById("filterExpense").innerText,
25,
y+25
);

pdf.setTextColor(34,197,94);

pdf.text(
"Balance : " +
document.getElementById("filterBalance").innerText,
25,
y+32
);

pdf.setTextColor(0,0,0);

y += 45;

// ===============================
// Filtered Transactions
// ===============================

pdf.setFillColor(37,99,235);
pdf.rect(20,y,170,8,"F");

pdf.setTextColor(255,255,255);
pdf.setFontSize(10);

pdf.text("Date",22,y+5);
pdf.text("Category",55,y+5);
pdf.text("Type",105,y+5);
pdf.text("Amount",145,y+5);

y += 12;

pdf.setTextColor(0,0,0);

// Income Transactions
incomeHistory.forEach(item=>{

if(item.date>=fromDate && item.date<=toDate){

pdf.text(item.date,22,y);

pdf.text(item.source || "-",55,y);

pdf.text("Income",105,y);

pdf.text("₹"+Number(item.amount).toFixed(2),145,y);

y += 7;

if(y>270){

pdf.addPage();

y=20;

}

}

});

// Expense Transactions
expenseHistory.forEach(item=>{

if(item.date>=fromDate && item.date<=toDate){

pdf.text(item.date,22,y);

pdf.text(item.category || "-",55,y);

pdf.text("Expense",105,y);

pdf.text("₹"+Number(item.amount).toFixed(2),145,y);

y += 7;

if(y>270){

pdf.addPage();

y=20;

}

}

});

// ===============================
// Category Wise Summary
// ===============================

y += 10;

pdf.setFillColor(34,197,94);
pdf.rect(20,y,170,8,"F");

pdf.setTextColor(255,255,255);
pdf.setFontSize(11);

pdf.text("Category Wise Expense Summary",22,y+5);

y += 12;

pdf.setTextColor(0,0,0);

let categorySummary = {};

// Filtered Expense Summary
expenseHistory.forEach(item=>{

if(item.date>=fromDate && item.date<=toDate){

if(!categorySummary[item.category]){

categorySummary[item.category] = 0;

}

categorySummary[item.category] += Number(item.amount);

}

});

Object.keys(categorySummary).forEach(cat=>{

pdf.text(cat,25,y);

pdf.text(
"₹"+categorySummary[cat].toFixed(2),
145,
y
);

y += 7;

if(y>270){

pdf.addPage();

y = 20;

}

});

// ===============================
// Footer
// ===============================

y += 10;

pdf.setTextColor(120);
pdf.setFontSize(9);

pdf.text(
"Generated by ArthaFlow Premium",
20,
285
);

pdf.text(
"Developed with ❤️ by Aditya Aakash",
110,
285
);

// ===============================
// Save PDF
// ===============================

pdf.save("ArthaFlow_Filter_Report.pdf");

}

// ===============================
// Phase 11A - Step 4.2
// Google Login
// ===============================

function googleLogin(){

    const provider = new firebase.auth.GoogleAuthProvider();

    auth.signInWithPopup(provider)

    .then(function(result){

        const user = result.user;

        console.log("Google Login Successful");

        console.log("User:", user.email);

        // Login status
        sessionStorage.setItem("loggedIn", "true");

        // User information
        localStorage.setItem(
            "userEmail",
            user.email
        );

        localStorage.setItem(
            "userName",
            user.displayName || ""
        );

        localStorage.setItem(
            "userPhoto",
            user.photoURL || ""
        );

        alert("✅ Google Login Successful");

        window.location.href = "index.html";

    })

    .catch(function(error){

        console.error("Google Login Error:", error);

        alert(
            "❌ Google Login Failed\n\n" +
            error.message
        );

    });

}
    
}
