// ==========================================
// ARTHAFLOW - TEACHING INCOME MANAGER
// ==========================================

const TEACHING_STORAGE_KEY = "arthaflow_teaching_records";
const SALARY_STORAGE_KEY = "arthaflow_salary_records";
const SALARY_SETUP_KEY = "arthaflow_monthly_salary";

// ==========================================
// DATA
// ==========================================

function readTeachingData(key) {
    try {
        const data = JSON.parse(localStorage.getItem(key));
        return Array.isArray(data) ? data : [];
    } catch (error) {
        return [];
    }
}

let teachingRecords = readTeachingData(TEACHING_STORAGE_KEY);
let salaryRecords = readTeachingData(SALARY_STORAGE_KEY);

let monthlySalary = Number(
    localStorage.getItem(SALARY_SETUP_KEY)
) || 0;

let editingTeachingId = null;
let editingCopyId = null;

// ==========================================
// HELPERS
// ==========================================

function todayDate() {
    const now = new Date();
    const localDate = new Date(
        now.getTime() - now.getTimezoneOffset() * 60000
    );

    return localDate.toISOString().slice(0, 10);
}

function money(amount) {
    return "₹" + (Number(amount) || 0).toLocaleString(
        "en-IN",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );
}

function saveTeachingData() {
    localStorage.setItem(
        TEACHING_STORAGE_KEY,
        JSON.stringify(teachingRecords)
    );

    localStorage.setItem(
        SALARY_STORAGE_KEY,
        JSON.stringify(salaryRecords)
    );
}

function makeId() {
    return Date.now().toString(36) +
        Math.random().toString(36).slice(2, 9);
}

function getSelectedMonth() {
    return document.getElementById("salaryMonth").value ||
        todayDate().slice(0, 7);
}

// ==========================================
// NAVIGATION
// ==========================================

function showSection(sectionId) {
    const sections = [
        "teachingSection",
        "salarySection",
        "copySection",
        "historySection"
    ];

    sections.forEach(function(id) {
        const section = document.getElementById(id);

        if (section) {
            section.classList.toggle(
                "hidden",
                id !== sectionId
            );
        }
    });

    if (sectionId === "salarySection") {
        renderSalaryHistory();
        updateSalarySummary();
    }

    if (sectionId === "copySection") {
        updateCopySummary();
    }

    if (sectionId === "historySection") {
        renderHistory();
    }
}

// ==========================================
// SALARY SETUP
// ==========================================

function saveSalarySetup() {
    const input = document.getElementById("monthlySalary");
    const value = Number(input.value);

    if (input.value.trim() === "" || !Number.isFinite(value) || value < 0) {
        alert("कृपया सही मासिक सैलरी दर्ज करें।");
        return;
    }

    monthlySalary = value;

    localStorage.setItem(
        SALARY_SETUP_KEY,
        String(monthlySalary)
    );

    updateSalarySummary();
    updateDashboardSummary();

    alert("Monthly Salary Setup सेव हो गया!");
}

// ==========================================
// TEACHING RATE
// ==========================================

function updateTeachingRate() {
    const type = document.getElementById("teachingType").value;
    const rateInput = document.getElementById("teachingRate");

    if (type === "custom") {
        rateInput.value = "";
        rateInput.readOnly = false;
    } else {
        rateInput.value = type;
        rateInput.readOnly = true;
    }

    calculateTeachingAmount();
}

function calculateTeachingAmount() {
    const count = Number(
        document.getElementById("teachingCount").value
    ) || 0;

    const rate = Number(
        document.getElementById("teachingRate").value
    ) || 0;

    document.getElementById("teachingCalculation").textContent =
        money(count * rate);
}

function updateTeachingTiming() {
    const timing = document.getElementById("teachingTiming").value;

    document.getElementById("customTimingBox")
        .classList.toggle("hidden", timing !== "अन्य");
}

// ==========================================
// ADD / EDIT TEACHING RECORD
// ==========================================

function resetTeachingForm() {
    document.getElementById("teachingForm").reset();

    document.getElementById("teachingDate").value = todayDate();

    document.getElementById("teachingType").value = "150";
    document.getElementById("teachingRate").value = "150";
    document.getElementById("teachingRate").readOnly = true;
    document.getElementById("teachingCount").value = "1";

    document.getElementById("customTimingBox")
        .classList.add("hidden");

    editingTeachingId = null;

    const button = document.querySelector(
        "#teachingForm button[type='submit']"
    );

    button.textContent = "➕ Save Teaching Record";

    calculateTeachingAmount();
}

function handleTeachingSubmit(event) {
    event.preventDefault();

    const date = document.getElementById("teachingDate").value;
    const type = document.getElementById("teachingType").value;
    const count = Number(
        document.getElementById("teachingCount").value
    );
    const rate = Number(
        document.getElementById("teachingRate").value
    );

    if (
        !date ||
        !Number.isInteger(count) ||
        count <= 0 ||
        !Number.isFinite(rate) ||
        rate < 0
    ) {
        alert("कृपया तारीख, बेल और रेट सही दर्ज करें।");
        return;
    }

    let timing = document.getElementById("teachingTiming").value;

    if (timing === "अन्य") {
        timing = document.getElementById("customTiming").value.trim();

        if (!timing) {
            alert("कृपया अपनी टाइमिंग दर्ज करें।");
            return;
        }
    }

    const record = {
        id: editingTeachingId || makeId(),
        type: "teaching",
        date: date,
        classType: type === "custom" ? "custom" : "standard",
        count: count,
        rate: rate,
        amount: count * rate,
        batch: document.getElementById("teachingBatch").value.trim(),
        timing: timing,
        note: document.getElementById("teachingNote").value.trim()
    };

    if (editingTeachingId) {
        const index = teachingRecords.findIndex(
            item => item.id === editingTeachingId
        );

        if (index !== -1) {
            teachingRecords[index] = record;
        }
    } else {
        teachingRecords.push(record);
    }

    saveTeachingData();
    resetTeachingForm();
    refreshAll();

    alert("Teaching Record सेव हो गया!");
}

// ==========================================
// COPY CHECKING CALCULATOR
// ==========================================

function calculateCopyAmount() {
    const count = Number(
        document.getElementById("copyCount").value
    ) || 0;

    const rate = Number(
        document.getElementById("copyRate").value
    ) || 0;

    document.getElementById("copyCalculation").textContent =
        money(count * rate);
}

// ==========================================
// ADD / EDIT COPY CHECKING
// ==========================================

function resetCopyForm() {
    document.getElementById("copyForm").reset();

    document.getElementById("copyDate").value = todayDate();
    document.getElementById("copyCount").value = "1";
    document.getElementById("copyRate").value = "225";

    editingCopyId = null;

    const button = document.querySelector(
        "#copyForm button[type='submit']"
    );

    button.textContent = "➕ Save Copy Checking";

    calculateCopyAmount();
}

function handleCopySubmit(event) {
    event.preventDefault();

    const date = document.getElementById("copyDate").value;
    const count = Number(
        document.getElementById("copyCount").value
    );
    const rate = Number(
        document.getElementById("copyRate").value
    );

    if (
        !date ||
        !Number.isInteger(count) ||
        count <= 0 ||
        !Number.isFinite(rate) ||
        rate < 0
    ) {
        alert("कृपया तारीख, क्लास की संख्या और रेट सही दर्ज करें।");
        return;
    }

    const record = {
        id: editingCopyId || makeId(),
        type: "copy",
        date: date,
        className: document.getElementById("copyClass").value.trim(),
        count: count,
        rate: rate,
        amount: count * rate,
        note: document.getElementById("copyNote").value.trim()
    };

    if (editingCopyId) {
        const index = teachingRecords.findIndex(
            item => item.id === editingCopyId
        );

        if (index !== -1) {
            teachingRecords[index] = record;
        }
    } else {
        teachingRecords.push(record);
    }

    saveTeachingData();
    resetCopyForm();
    refreshAll();

    alert("Copy Checking Record सेव हो गया!");
}

// ==========================================
// SALARY PAYMENT
// ==========================================

function addSalaryPayment() {
    const month = document.getElementById("salaryMonth").value;

    const date = document.getElementById("salaryPaymentDate").value;

    const amountInput = document.getElementById(
        "salaryPaymentAmount"
    );

    const amount = Number(amountInput.value);

    if (!month) {
        alert("कृपया सैलरी का महीना चुनें।");
        return;
    }

    if (
        !date ||
        amountInput.value.trim() === "" ||
        !Number.isFinite(amount) ||
        amount <= 0
    ) {
        alert("कृपया भुगतान की तारीख और रकम सही दर्ज करें।");
        return;
    }

    salaryRecords.push({
        id: makeId(),
        type: "salary",
        month: month,
        date: date,
        amount: amount,
        note: document.getElementById("salaryNote").value.trim()
    });

    saveTeachingData();

    document.getElementById("salaryPaymentAmount").value = "";
    document.getElementById("salaryNote").value = "";

    renderSalaryHistory();
    updateSalarySummary();
    updateDashboardSummary();
    renderHistory();

    alert("Salary Payment सेव हो गया!");
}

// ==========================================
// SALARY CALCULATION
// ==========================================

function getSalaryReceived(month) {
    return salaryRecords
        .filter(item => item.month === month)
        .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
}

function updateSalarySummary() {
    const month = getSelectedMonth();
    const received = getSalaryReceived(month);
    const dues = Math.max(0, monthlySalary - received);

    document.getElementById("salaryExpected").textContent =
        money(monthlySalary);

    document.getElementById("salaryMonthReceived").textContent =
        money(received);

    document.getElementById("salaryMonthDues").textContent =
        money(dues);

    renderSalaryHistory();
    updateDashboardSummary();
}

// ==========================================
// SALARY HISTORY
// ==========================================

function renderSalaryHistory() {
    const container = document.getElementById("salaryHistory");

    if (!container) return;

    container.innerHTML = "";

    const month = getSelectedMonth();

    const records = salaryRecords
        .filter(item => item.month === month)
        .sort((a, b) => b.date.localeCompare(a.date));

    if (records.length === 0) {
        container.textContent = "इस महीने कोई Salary Payment दर्ज नहीं है।";
        return;
    }

    records.forEach(function(item) {
        const row = document.createElement("div");
        row.className = "record";

        const details = document.createElement("p");
        details.textContent =
            item.date + " | " + money(item.amount) +
            (item.note ? " | " + item.note : "");

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "🗑️ Delete";
        deleteButton.className = "secondary";

        deleteButton.onclick = function() {
            deleteSalaryRecord(item.id);
        };

        row.append(details, deleteButton);
        container.appendChild(row);
    });
}

function deleteSalaryRecord(id) {
    if (!confirm("क्या यह Salary Payment हटाना चाहते हैं?")) return;

    salaryRecords = salaryRecords.filter(item => item.id !== id);

    saveTeachingData();
    refreshAll();
}

// ==========================================
// COPY MONTH SUMMARY
// ==========================================

function updateCopySummary() {
    const month = todayDate().slice(0, 7);

    const records = teachingRecords.filter(
        item => item.type === "copy" && item.date.startsWith(month)
    );

    const count = records.reduce(
        (sum, item) => sum + (Number(item.count) || 0),
        0
    );

    const total = records.reduce(
        (sum, item) => sum + (Number(item.amount) || 0),
        0
    );

    document.getElementById("copyMonthCount").textContent = count;

    document.getElementById("copyMonthTotal").textContent =
        money(total);
}

// ==========================================
// DASHBOARD TOTALS
// ==========================================

function updateDashboardSummary() {
    const teachingTotal = teachingRecords
        .filter(item => item.type === "teaching")
        .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

    const copyTotal = teachingRecords
        .filter(item => item.type === "copy")
        .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

    const salaryReceivedTotal = salaryRecords.reduce(
        (sum, item) => sum + (Number(item.amount) || 0),
        0
    );

    // वर्तमान महीने का बकाया दिखाया जाता है।
    // पुराने महीनों के बकाये के लिए आगे अलग salary ledger जोड़ेंगे।
    const currentMonth = todayDate().slice(0, 7);

    const currentMonthDues = Math.max(
        0,
        monthlySalary - getSalaryReceived(currentMonth)
    );

    document.getElementById("teachingTotal").textContent =
        money(teachingTotal);

    document.getElementById("copyTotal").textContent =
        money(copyTotal);

    document.getElementById("salaryReceivedTotal").textContent =
        money(salaryReceivedTotal);

    document.getElementById("totalDues").textContent =
        money(currentMonthDues);
}

// ==========================================
// HISTORY SEARCH
// ==========================================

function renderHistory() {
    const container = document.getElementById("completeHistory");

    if (!container) return;

    const type = document.getElementById("historyType").value;

    const query = document.getElementById("historySearch")
        .value.trim().toLowerCase();

    let records = [
        ...teachingRecords,
        ...salaryRecords
    ];

    records = records.filter(function(item) {
        if (type !== "all" && item.type !== type) {
            return false;
        }

        const searchableText = [
            item.date,
            item.month,
            item.batch,
            item.timing,
            item.className,
            item.note,
            item.amount,
            item.count
        ].filter(Boolean).join(" ").toLowerCase();

        return searchableText.includes(query);
    });

    records.sort(function(a, b) {
        const dateA = a.date || a.month || "";
        const dateB = b.date || b.month || "";

        return dateB.localeCompare(dateA);
    });

    container.innerHTML = "";

    if (records.length === 0) {
        container.textContent = "कोई रिकॉर्ड नहीं मिला।";
        return;
    }

    records.forEach(function(item) {
        const row = document.createElement("div");
        row.className = "record";

        const title = document.createElement("strong");

        if (item.type === "teaching") {
            title.textContent = "📚 Teaching";
        } else if (item.type === "copy") {
            title.textContent = "📝 Copy Checking";
        } else {
            title.textContent = "💼 Salary Payment";
        }

        const details = document.createElement("p");

        if (item.type === "teaching") {
            details.textContent =
                item.date +
                " | " + (item.batch || "बैच नहीं") +
                " | " + (item.timing || "टाइमिंग नहीं") +
                " | " + item.count + " बेल" +
                " × " + money(item.rate) +
                " = " + money(item.amount) +
                (item.note ? " | " + item.note : "");
        } else if (item.type === "copy") {
            details.textContent =
                item.date +
                " | " + (item.className || "क्लास नहीं") +
                " | " + item.count + " क्लास" +
                " × " + money(item.rate) +
                " = " + money(item.amount) +
                (item.note ? " | " + item.note : "");
        } else {
            details.textContent =
                item.date +
                " | महीना: " + item.month +
                " | प्राप्त: " + money(item.amount) +
                (item.note ? " | " + item.note : "");
        }

        row.append(title, details);

        if (item.type === "teaching") {
            row.appendChild(
                makeEditButton("✏️ Edit", function() {
                    editTeachingRecord(item.id);
                })
            );

            row.appendChild(
                makeEditButton("🗑️ Delete", function() {
                    deleteTeachingRecord(item.id);
                })
            );
        }

        if (item.type === "copy") {
            row.appendChild(
                makeEditButton("✏️ Edit", function() {
                    editCopyRecord(item.id);
                })
            );

            row.appendChild(
                makeEditButton("🗑️ Delete", function() {
                    deleteTeachingRecord(item.id);
                })
            );
        }

        if (item.type === "salary") {
            row.appendChild(
                makeEditButton("🗑️ Delete", function() {
                    deleteSalaryRecord(item.id);
                })
            );
        }

        container.appendChild(row);
    });
}

function makeEditButton(label, callback) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.className = "secondary";
    button.onclick = callback;

    return button;
}

// ==========================================
// EDIT TEACHING
// ==========================================

function editTeachingRecord(id) {
    const item = teachingRecords.find(
        record => record.id === id && record.type === "teaching"
    );

    if (!item) return;

    showSection("teachingSection");

    editingTeachingId = item.id;

    document.getElementById("teachingDate").value = item.date;
    document.getElementById("teachingType").value =
        item.classType === "custom" ? "custom" : String(item.rate);

    document.getElementById("teachingRate").readOnly =
        item.classType !== "custom";

    document.getElementById("teachingRate").value = item.rate;
    document.getElementById("teachingCount").value = item.count;
    document.getElementById("teachingBatch").value = item.batch || "";

    const timingSelect = document.getElementById("teachingTiming");
    const knownTimings = Array.from(timingSelect.options)
        .map(option => option.value);

    if (knownTimings.includes(item.timing || "")) {
        timingSelect.value = item.timing || "";
        document.getElementById("customTiming").value = "";
    } else if (item.timing) {
        timingSelect.value = "अन्य";
        document.getElementById("customTiming").value = item.timing;
    } else {
        timingSelect.value = "";
        document.getElementById("customTiming").value = "";
    }

    updateTeachingTiming();

    document.getElementById("teachingNote").value = item.note || "";

    document.querySelector(
        "#teachingForm button[type='submit']"
    
