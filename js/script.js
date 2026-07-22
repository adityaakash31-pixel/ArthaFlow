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
