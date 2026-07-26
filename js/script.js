// Login Check
if (
    !window.location.pathname.includes("login.html") &&
    !window.location.pathname.includes("splash.html")
) {
    if (localStorage.getItem("loggedIn") !== "true") {
        window.location.href = "login.html";
    }
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

window.onload = function () {

    totalIncome = Number(localStorage.getItem("totalIncome")) || 0;
totalExpense = Number(localStorage.getItem("totalExpense")) || 0;

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

    showNotification("✅ Income Saved Successfully");

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

    showNotification("💸 Expense Saved Successfully");

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

let biggestIncome =
document.getElementById("biggestIncome");

if(biggestIncome){

let maxIncome = 0;

incomeHistory.forEach(function(item){

if(item.amount > maxIncome){
maxIncome = item.amount;
}

});

biggestIncome.innerText = "₹" + maxIncome;

}

let biggestExpense =
document.getElementById("biggestExpense");

if(biggestExpense){

let maxExpense = 0;

expenseHistory.forEach(function(item){

if(item.amount > maxExpense){
maxExpense = item.amount;
}

});

biggestExpense.innerText = "₹" + maxExpense;

}

let savingRate =
document.getElementById("savingRate");

if(savingRate){

let rate = 0;

if(totalIncome > 0){
rate = ((totalIncome - totalExpense) / totalIncome) * 100;
}

savingRate.innerText = rate.toFixed(1) + "%";

    let financialHealth =
document.getElementById("financialHealth");

if(financialHealth){

if(rate >= 50){
financialHealth.innerText = "🟢 Excellent";
}
else if(rate >= 25){
financialHealth.innerText = "🟡 Good";
}
else{
financialHealth.innerText = "🔴 Needs Improvement";
}

}

}

let savingRateBar =
document.getElementById("savingRateBar");

if(savingRateBar){

savingRateBar.style.width =
rate + "%";

savingRateBar.innerText =
rate.toFixed(1) + "%";

}

let monthlyHistory =
document.getElementById("monthlyHistory");

if(monthlyHistory){

let balance =
totalIncome-totalExpense;

let monthlyHistory =
document.getElementById("monthlyHistory");

if(monthlyHistory){

let balance =
totalIncome-totalExpense;

let monthlyHistory =
document.getElementById("monthlyHistory");

if(monthlyHistory){

monthlyHistory.innerHTML="";

let data =
JSON.parse(localStorage.getItem("monthlyData")) || {};

for(let month in data){

monthlyHistory.innerHTML +=

"<tr>" +

"<td>"+month+"</td>"+

"<td>₹"+data[month].income+"</td>"+

"<td>₹"+data[month].expense+"</td>"+

"<td>₹"+data[month].balance+"</td>"+

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

balance: totalIncome-totalExpense

};

localStorage.setItem(
    "monthlyData",
    JSON.stringify(monthlyData)
);

}

}

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
// PDF Report
// ===============================

async function downloadPDF(){

const { jsPDF } = window.jspdf;

const pdf = new jsPDF();

pdf.setFontSize(18);
pdf.text("ArthaFlow Financial Report",20,20);

pdf.setFontSize(12);

pdf.text("Total Income : ₹"+totalIncome,20,40);

pdf.text("Total Expense : ₹"+totalExpense,20,50);

pdf.text("Current Balance : ₹"+(totalIncome-totalExpense),20,60);

pdf.text("Total Transactions : "+(incomeHistory.length+expenseHistory.length),20,70);

pdf.text("Generated by ArthaFlow",20,90);

pdf.save("ArthaFlow_Report.pdf");

}

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

}

function loadNetWorth(){

let assets =
Number(localStorage.getItem("netAssets")) || 0;

let liabilities =
Number(localStorage.getItem("netLiabilities")) || 0;

let netWorth =
Number(localStorage.getItem("netWorth")) || 0;

if(document.getElementById("totalAssets")){

document.getElementById("totalAssets").value =
assets;

}

if(document.getElementById("totalLiabilities")){

document.getElementById("totalLiabilities").value =
liabilities;

}

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

// Auto Load Net Worth

window.addEventListener("load",function(){

if(document.getElementById("totalAssets")){

loadNetWorth();

}

});
