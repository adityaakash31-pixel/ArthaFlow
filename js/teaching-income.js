/* =========================================================
   ArthaFlow - Teaching Income Manager
   PART 1 OF 3
   Storage, Date Helpers, Data Normalization & Calculations
   ========================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     1. EXISTING STORAGE KEYS
     Do not change these keys: old records must remain available.
     --------------------------------------------------------- */

  const KEYS = {
    teaching: "arthaflow_teaching_records",
    copy: "arthaflow_copy_records",
    salary: "arthaflow_salary_records",
    monthlySalary: "arthaflow_monthly_salary"
  };

  /* ---------------------------------------------------------
     2. GENERAL HELPERS
     --------------------------------------------------------- */

  function getElement(id) {
    return document.getElementById(id);
  }

  function getValue(id, fallback = "") {
    const element = getElement(id);

    if (!element || element.value === undefined) {
      return fallback;
    }

    return String(element.value).trim();
  }

  function setText(id, value) {
    const element = getElement(id);

    if (element) {
      element.textContent = value;
    }
  }

  function toNumber(value) {
    const number = Number(value);

    return Number.isFinite(number) ? number : 0;
  }

  function formatMoney(value) {
    return "₹" + toNumber(value).toLocaleString("en-IN", {
      maximumFractionDigits: 2
    });
  }

  function createId() {
    return (
      Date.now().toString(36) +
      Math.random().toString(36).slice(2, 9)
    );
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (character) {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      };

      return entities[character];
    });
  }

  /* ---------------------------------------------------------
     3. SAFE LOCAL STORAGE HELPERS
     Existing records are read without changing their keys.
     --------------------------------------------------------- */

  function readArray(key) {
    try {
      const raw = localStorage.getItem(key);

      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw);

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Unable to read records:", key, error);
      return [];
    }
  }

  function writeArray(key, records) {
    try {
      localStorage.setItem(key, JSON.stringify(records));
      return true;
    } catch (error) {
      console.error("Unable to save records:", key, error);

      alert(
        "Unable to save data. Please check your device storage " +
        "and keep a backup of your records."
      );

      return false;
    }
  }

  function readMonthlySalary() {
    try {
      const raw = localStorage.getItem(KEYS.monthlySalary);

      if (!raw) {
        return 0;
      }

      // Supports a number stored directly.
      const parsed = JSON.parse(raw);

      // Also supports an object containing an amount.
      if (parsed && typeof parsed === "object") {
        return toNumber(
          parsed.amount ??
          parsed.salary ??
          parsed.monthlySalary ??
          0
        );
      }

      return toNumber(parsed);
    } catch (error) {
      // Supports an older value stored as plain text.
      return toNumber(localStorage.getItem(KEYS.monthlySalary));
    }
  }

  function saveMonthlySalary(amount) {
    const safeAmount = Math.max(0, toNumber(amount));

    try {
      localStorage.setItem(
        KEYS.monthlySalary,
        JSON.stringify(safeAmount)
      );

      return true;
    } catch (error) {
      console.error("Unable to save monthly salary:", error);
      alert("Unable to save the monthly salary amount.");
      return false;
    }
  }

  /* ---------------------------------------------------------
     4. DATE & MONTH HELPERS
     Month format: YYYY-MM
     Display format: August 2026, September 2026, etc.
     --------------------------------------------------------- */

  function todayString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function currentMonthKey() {
    return todayString().slice(0, 7);
  }

  function monthFromDate(dateValue) {
    if (!dateValue) {
      return "";
    }

    const text = String(dateValue).trim();

    // Standard HTML date: YYYY-MM-DD
    const standardMatch = text.match(/^(\d{4})-(\d{2})/);

    if (standardMatch) {
      return `${standardMatch[1]}-${standardMatch[2]}`;
    }

    // Fallback for other valid date formats.
    const date = new Date(text);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return (
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0")
    );
  }

  function monthLabel(monthKey) {
    if (!/^\d{4}-\d{2}$/.test(String(monthKey))) {
      return "Unknown Month";
    }

    const parts = monthKey.split("-").map(Number);
    const date = new Date(parts[0], parts[1] - 1, 1);

    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric"
    });
  }

  function getSelectedMonth() {
    const salaryMonth = getValue("salaryMonth");

    if (/^\d{4}-\d{2}$/.test(salaryMonth)) {
      return salaryMonth;
    }

    const selectedDate = getValue("teachingDate");

    if (selectedDate) {
      return monthFromDate(selectedDate) || currentMonthKey();
    }

    return currentMonthKey();
  }

  function recordMonth(record) {
    if (!record || typeof record !== "object") {
      return "";
    }

    // Salary records may have an explicit month.
    if (/^\d{4}-\d{2}$/.test(String(record.month || ""))) {
      return record.month;
    }

    // Old salary records may not have a month field.
    // Their payment date is used as a fallback.
    return monthFromDate(
      record.date ||
      record.paymentDate ||
      record.createdAt ||
      ""
    );
  }

  /* ---------------------------------------------------------
     5. LOAD EXISTING RECORDS
     Old records are normalized in memory only.
     They are not automatically deleted or overwritten.
     --------------------------------------------------------- */

  function getTeachingRecords() {
    return readArray(KEYS.teaching).map(function (record) {
      return {
        ...record,
        id: record.id || createId(),
        amount: toNumber(record.amount),
        count: toNumber(record.count),
        rate: toNumber(record.rate),
        date: record.date || "",
        category: record.category || record.type || "Teaching"
      };
    });
  }

  function getCopyRecords() {
    return readArray(KEYS.copy).map(function (record) {
      const earned = toNumber(
        record.earned ??
        record.amount ??
        record.total ??
        0
      );

      // Older records may not contain a separate received amount.
      // Do not assume that the full earned amount was received.
      const received = toNumber(
        record.received ??
        record.amountReceived ??
        0
      );

      return {
        ...record,
        id: record.id || createId(),
        amount: earned,
        earned: earned,
        received: received,
        count: toNumber(record.count),
        rate: toNumber(record.rate),
        date: record.date || ""
      };
    });
  }

  function getSalaryRecords() {
    return readArray(KEYS.salary).map(function (record) {
      const amount = toNumber(
        record.amount ??
        record.amountReceived ??
        record.received ??
        0
      );

      return {
        ...record,
        id: record.id || createId(),
        date: record.date || "",
        month: record.month || monthFromDate(record.date || ""),
        amount: amount,
        note: record.note || ""
      };
    });
  }

  /* ---------------------------------------------------------
     6. MONTH-WISE RECORD FILTERING
     --------------------------------------------------------- */

  function filterByMonth(records, monthKey) {
    return records.filter(function (record) {
      return recordMonth(record) === monthKey;
    });
  }

  function sumAmounts(records, amountField = "amount") {
    return records.reduce(function (total, record) {
      return total + toNumber(record[amountField]);
    }, 0);
  }

  /* ---------------------------------------------------------
     7. MONTHLY FINANCIAL CALCULATIONS
     Teaching Earning = teaching records
     Copy Earned = copy work completed
     Copy Received = actual copy payments received
     Salary Received = salary payment records
     --------------------------------------------------------- */

  function calculateMonth(monthKey) {
    const teachingRecords = filterByMonth(
      getTeachingRecords(),
      monthKey
    );

    const copyRecords = filterByMonth(
      getCopyRecords(),
      monthKey
    );

    const salaryRecords = filterByMonth(
      getSalaryRecords(),
      monthKey
    );

    const teachingEarning = sumAmounts(
      teachingRecords,
      "amount"
    );

    const copyEarned = sumAmounts(
      copyRecords,
      "earned"
    );

    const copyReceived = sumAmounts(
      copyRecords,
      "received"
    );

    const salaryReceived = sumAmounts(
      salaryRecords,
      "amount"
    );

    const totalEarning = teachingEarning + copyEarned;

    const copyDue = Math.max(
      0,
      copyEarned - copyReceived
    );

    const salaryExpected = readMonthlySalary();

    const salaryDue = Math.max(
      0,
      salaryExpected - salaryReceived
    );

    const totalRemaining = salaryDue + copyDue;

    return {
      month: monthKey,
      monthLabel: monthLabel(monthKey),

      teachingEarning,
      copyEarned,
      copyReceived,
      copyDue,

      totalEarning,

      salaryExpected,
      salaryReceived,
      salaryDue,

      totalRemaining,

      teachingCount: teachingRecords.length,
      copyCount: copyRecords.length,
      salaryPaymentCount: salaryRecords.length
    };
  }

  /* ---------------------------------------------------------
     8. CURRENT MONTH SUMMARY
     Later parts will connect these calculations to the UI.
     --------------------------------------------------------- */

  function getAllMonthKeys() {
    const keys = new Set();

    getTeachingRecords().forEach(function (record) {
      const month = recordMonth(record);
      if (month) keys.add(month);
    });

    getCopyRecords().forEach(function (record) {
      const month = recordMonth(record);
      if (month) keys.add(month);
    });

    getSalaryRecords().forEach(function (record) {
      const month = recordMonth(record);
      if (month) keys.add(month);
    });

    keys.add(currentMonthKey());

    return Array.from(keys).sort();
  }

  function getMonthlySummary(monthKey) {
    return calculateMonth(monthKey || currentMonthKey());
  }

  // PART 1 END
  // Do not run the file yet.
  // Part 2 will continue inside this same function.

     /* =========================================================
     ArthaFlow - Teaching Income Manager
     PART 2 OF 3
     Forms, Saving, Editing & Salary Payments
     ========================================================= */

  /* ---------------------------------------------------------
     9. SET DEFAULT FORM DATES
     --------------------------------------------------------- */

  function setDefaultDates() {
    const today = todayString();

    ["teachingDate", "copyDate", "salaryPaymentDate"].forEach(
      function (id) {
        const element = getElement(id);

        if (element && !element.value) {
          element.value = today;
        }
      }
    );

    const monthElement = getElement("salaryMonth");

    if (monthElement && !monthElement.value) {
      monthElement.value = currentMonthKey();
    }
  }

  /* ---------------------------------------------------------
     10. SHOW / HIDE SECTIONS
     --------------------------------------------------------- */

  function showSection(sectionId) {
    const sections = [
      "teachingSection",
      "salarySection",
      "copySection",
      "historySection"
    ];

    sections.forEach(function (id) {
      const section = getElement(id);

      if (section) {
        section.style.display = id === sectionId ? "block" : "none";
      }
    });

    if (sectionId === "historySection") {
      renderHistory();
    }

    if (sectionId === "teachingSection") {
      updateTeachingCalculation();
    }

    if (sectionId === "copySection") {
      updateCopyCalculation();
    }

    if (sectionId === "salarySection") {
      renderSalarySection();
    }

    updateDashboard();
  }

  /* ---------------------------------------------------------
     11. TEACHING CALCULATION
     --------------------------------------------------------- */

  function updateTeachingCalculation() {
    const type = getValue("teachingType", "150");
    const count = Math.max(0, toNumber(getValue("teachingCount")));
    const customRate = Math.max(0, toNumber(getValue("teachingRate")));

    let rate = 0;

    if (type === "custom") {
      rate = customRate;
    } else {
      rate = toNumber(type);
    }

    const total = count * rate;

    const calculation = getElement("teachingCalculation");

    if (calculation) {
      calculation.textContent =
        "Total: " + formatMoney(total) +
        " (" + count + " × " + formatMoney(rate) + ")";
    }

    const rateElement = getElement("teachingRate");

    if (rateElement) {
      rateElement.disabled = type !== "custom";

      if (type !== "custom") {
        rateElement.value = rate;
      }
    }

    return total;
  }

  /* ---------------------------------------------------------
     12. SAVE TEACHING RECORD
     --------------------------------------------------------- */

  function saveTeachingRecord(event) {
    if (event) {
      event.preventDefault();
    }

    const date = getValue("teachingDate") || todayString();
    const type = getValue("teachingType", "150");
    const count = Math.max(0, toNumber(getValue("teachingCount")));
    const rate = type === "custom"
      ? Math.max(0, toNumber(getValue("teachingRate")))
      : toNumber(type);

    const batch = getValue("teachingBatch");
    const timing = getValue("teachingTiming");
    const customTiming = getValue("customTiming");
    const note = getValue("teachingNote");

    if (count <= 0) {
      alert("Please enter a valid teaching count.");
      return;
    }

    if (rate <= 0) {
      alert("Please enter a valid teaching rate.");
      return;
    }

    const records = readArray(KEYS.teaching);
    const editingId = getValue("teachingForm")
      ? (getElement("teachingForm").dataset.editingId || "")
      : "";

    const record = {
      id: editingId || createId(),
      date: date,
      count: count,
      rate: rate,
      amount: count * rate,
      category: "Teaching",
      type: type,
      batch: batch,
      timing: timing === "अन्य" ? customTiming : timing,
      note: note,
      updatedAt: new Date().toISOString()
    };

    const existingIndex = records.findIndex(function (item) {
      return String(item.id) === String(record.id);
    });

    if (existingIndex >= 0) {
      records[existingIndex] = {
        ...records[existingIndex],
        ...record
      };
    } else {
      records.push(record);
    }

    if (!writeArray(KEYS.teaching, records)) {
      return;
    }

    const form = getElement("teachingForm");

    if (form) {
      form.reset();
      delete form.dataset.editingId;
    }

    setDefaultDates();
    updateTeachingCalculation();
    updateDashboard();
    renderHistory();

    alert(editingId
      ? "Teaching record updated successfully."
      : "Teaching record saved successfully."
    );
  }

  /* ---------------------------------------------------------
     13. COPY CHECKING FORM
     --------------------------------------------------------- */

  function updateCopyCalculation() {
    const count = Math.max(0, toNumber(getValue("copyCount")));
    const rate = Math.max(0, toNumber(getValue("copyRate")));
    const total = count * rate;

    const calculation = getElement("copyCalculation");

    if (calculation) {
      calculation.textContent =
        "Total Earned: " + formatMoney(total) +
        " (" + count + " × " + formatMoney(rate) + ")";
    }

    return total;
  }

  /*
   * Copy checking requires separate tracking of:
   * - Earned amount
   * - Amount actually received
   *
   * If the HTML does not yet contain copyReceived, Part 3 will
   * add the missing input dynamically.
   */

  function saveCopyRecord(event) {
    if (event) {
      event.preventDefault();
    }

    const date = getValue("copyDate") || todayString();
    const className = getValue("copyClass");
    const count = Math.max(0, toNumber(getValue("copyCount")));
    const rate = Math.max(0, toNumber(getValue("copyRate")));
    const note = getValue("copyNote");

    const receivedInput = getValue("copyReceived", "0");
    const received = Math.max(0, toNumber(receivedInput));
    const earned = count * rate;

    if (count <= 0) {
      alert("Please enter a valid copy checking count.");
      return;
    }

    if (rate < 0) {
      alert("Please enter a valid copy checking rate.");
      return;
    }

    if (received > earned) {
      alert("Amount received cannot exceed the earned amount.");
      return;
    }

    const records = readArray(KEYS.copy);
    const form = getElement("copyForm");
    const editingId = form ? (form.dataset.editingId || "") : "";

    const record = {
      id: editingId || createId(),
      date: date,
      className: className,
      count: count,
      rate: rate,
      amount: earned,
      earned: earned,
      received: received,
      note: note,
      updatedAt: new Date().toISOString()
    };

    const existingIndex = records.findIndex(function (item) {
      return String(item.id) === String(record.id);
    });

    if (existingIndex >= 0) {
      records[existingIndex] = {
        ...records[existingIndex],
        ...record
      };
    } else {
      records.push(record);
    }

    if (!writeArray(KEYS.copy, records)) {
      return;
    }

    if (form) {
      form.reset();
      delete form.dataset.editingId;
    }

    setDefaultDates();
    updateCopyCalculation();
    updateDashboard();
    renderHistory();

    alert(editingId
      ? "Copy checking record updated successfully."
      : "Copy checking record saved successfully."
    );
  }

  /* ---------------------------------------------------------
     14. SALARY SETUP
     --------------------------------------------------------- */

  function saveSalarySetup() {
    const salaryInput = getElement("monthlySalary");

    if (!salaryInput) {
      alert("Monthly salary input was not found.");
      return;
    }

    const amount = Math.max(0, toNumber(salaryInput.value));

    if (!saveMonthlySalary(amount)) {
      return;
    }

    updateDashboard();
    renderSalarySection();

    alert("Monthly salary amount saved successfully.");
  }

  /* ---------------------------------------------------------
     15. ADD SALARY PAYMENT
     --------------------------------------------------------- */

  function addSalaryPayment(event) {
    if (event) {
      event.preventDefault();
    }

    const month = getValue("salaryMonth") || currentMonthKey();
    const date = getValue("salaryPaymentDate") || todayString();
    const amount = Math.max(0, toNumber(getValue("salaryPaymentAmount")));
    const note = getValue("salaryNote");

    if (amount <= 0) {
      alert("Please enter a payment amount greater than zero.");
      return;
    }

    const records = readArray(KEYS.salary);
    const form = getElement("salaryForm");
    const editingId = form ? (form.dataset.editingId || "") : "";

    const record = {
      id: editingId || createId(),
      month: month,
      date: date,
      amount: amount,
      note: note,
      updatedAt: new Date().toISOString()
    };

    const existingIndex = records.findIndex(function (item) {
      return String(item.id) === String(record.id);
    });

    if (existingIndex >= 0) {
      records[existingIndex] = {
        ...records[existingIndex],
        ...record
      };
    } else {
      records.push(record);
    }

    if (!writeArray(KEYS.salary, records)) {
      return;
    }

    if (form) {
      form.reset();
      delete form.dataset.editingId;
    } else {
      const amountInput = getElement("salaryPaymentAmount");
      const noteInput = getElement("salaryNote");

      if (amountInput) amountInput.value = "";
      if (noteInput) noteInput.value = "";
    }

    setDefaultDates();
    updateDashboard();
    renderSalarySection();
    renderHistory();

    alert(editingId
      ? "Salary payment updated successfully."
      : "Salary payment saved successfully."
    );
  }

  /* ---------------------------------------------------------
     16. EDIT EXISTING RECORDS
     --------------------------------------------------------- */

  function editRecord(type, id) {
    let key;
    let formId;

    if (type === "teaching") {
      key = KEYS.teaching;
      formId = "teachingForm";
      showSection("teachingSection");
    } else if (type === "copy") {
      key = KEYS.copy;
      formId = "copyForm";
      showSection("copySection");
    } else if (type === "salary") {
      key = KEYS.salary;
      formId = "salaryForm";
      showSection("salarySection");
    } else {
      alert("Unknown record type.");
      return;
    }

    const records = readArray(key);
    const record = records.find(function (item) {
      return String(item.id) === String(id);
    });

    if (!record) {
      alert("Record not found.");
      return;
    }

    const form = getElement(formId);

    if (!form) {
      alert("The required form could not be found.");
      return;
    }

    form.dataset.editingId = record.id;

    if (type === "teaching") {
      if (getElement("teachingDate")) getElement("teachingDate").value = record.date || "";
      if (getElement("teachingCount")) getElement("teachingCount").value = record.count ?? "";
      if (getElement("teachingRate")) getElement("teachingRate").value = record.rate ?? "";
      if (getElement("teachingBatch")) getElement("teachingBatch").value = record.batch || "";
      if (getElement("teachingTiming")) getElement("teachingTiming").value = record.timing || "";
      if (getElement("teachingNote")) getElement("teachingNote").value = record.note || "";

      const typeInput = getElement("teachingType");

      if (typeInput) {
        typeInput.value = ["150", "200"].includes(String(record.type))
          ? String(record.type)
          : "custom";
      }

      updateTeachingCalculation();
    }

    if (type === "copy") {
      if (getElement("copyDate")) getElement("copyDate").value = record.date || "";
      if (getElement("copyClass")) getElement("copyClass").value = record.className || "";
      if (getElement("copyCount")) getElement("copyCount").value = record.count ?? "";
      if (getElement("copyRate")) getElement("copyRate").value = record.rate ?? "";
      if (getElement("copyNote")) getElement("copyNote").value = record.note || "";
      if (getElement("copyReceived")) {
        getElement("copyReceived").value =
          record.received ?? record.amountReceived ?? 0;
      }

      updateCopyCalculation();
    }

    if (type === "salary") {
      if (getElement("salaryMonth")) {
        getElement("salaryMonth").value =
          record.month || monthFromDate(record.date) || currentMonthKey();
      }

      if (getElement("salaryPaymentDate")) {
        getElement("salaryPaymentDate").value = record.date || todayString();
      }

      if (getElement("salaryPaymentAmount")) {
        getElement("salaryPaymentAmount").value = record.amount ?? "";
      }

      if (getElement("salaryNote")) {
        getElement("salaryNote").value = record.note || "";
      }
    }

    const submitButton = form.querySelector(
      'button[type="submit"], input[type="submit"]'
    );

    if (submitButton) {
      submitButton.dataset.originalText =
        submitButton.dataset.originalText || submitButton.textContent;

      if (submitButton.tagName === "INPUT") {
        submitButton.value = "Update Record";
      } else {
        submitButton.textContent = "Update Record";
      }
    }

    window.scrollTo({
      top: form.getBoundingClientRect().top + window.scrollY - 20,
      behavior: "smooth"
    });
  }

  /* ---------------------------------------------------------
     17. DELETE EXISTING RECORDS
     --------------------------------------------------------- */

  function deleteRecord(type, id) {
    const keys = {
      teaching: KEYS.teaching,
      copy: KEYS.copy,
      salary: KEYS.salary
    };

    const key = keys[type];

    if (!key) {
      alert("Unknown record type.");
      return;
    }

    if (!confirm("Are you sure you want to delete this record?")) {
      return;
    }

    const records = readArray(key);
    const updated = records.filter(function (record) {
      return String(record.id) !== String(id);
    });

    if (updated.length === records.length) {
      alert("Record not found.");
      return;
    }

    if (!writeArray(key, updated)) {
      return;
    }

    updateDashboard();
    renderHistory();
    renderSalarySection();

    alert("Record deleted successfully.");
  }

  /* ---------------------------------------------------------
     18. PART 2 END
     Part 3 will add dashboard, monthly history, UI wiring,
     dynamic fields, and the final closing code.
     --------------------------------------------------------- */


     /* =========================================================
     ArthaFlow - Teaching Income Manager
     PART 3 OF 3
     Dashboard, Monthly History, Search & Initialization
     ========================================================= */

  /* ---------------------------------------------------------
     19. CREATE MISSING INPUTS SAFELY
     --------------------------------------------------------- */

  function ensureCopyReceivedField() {
    const form = getElement("copyForm");

    if (!form || getElement("copyReceived")) {
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.id = "copyReceivedWrapper";
    wrapper.style.margin = "12px 0";

    const label = document.createElement("label");
    label.htmlFor = "copyReceived";
    label.textContent = "Amount Received (₹)";
    label.style.display = "block";
    label.style.marginBottom = "6px";

    const input = document.createElement("input");
    input.id = "copyReceived";
    input.name = "copyReceived";
    input.type = "number";
    input.min = "0";
    input.step = "0.01";
    input.value = "0";
    input.placeholder = "Enter amount actually received";
    input.style.width = "100%";
    input.style.boxSizing = "border-box";

    wrapper.appendChild(label);
    wrapper.appendChild(input);

    const note = getElement("copyNote");

    if (note && note.parentElement) {
      note.parentElement.before(wrapper);
    } else {
      form.appendChild(wrapper);
    }
  }

  function ensureSummaryContainer() {
    let container = getElement("teachingMonthlySummary");

    if (!container) {
      const dashboard =
        getElement("teachingSection") ||
        getElement("historySection") ||
        document.body;

      container = document.createElement("div");
      container.id = "teachingMonthlySummary";
      container.style.margin = "16px 0";
      container.style.padding = "14px";
      container.style.border = "1px solid #d1d5db";
      container.style.borderRadius = "10px";

      const heading = document.createElement("h3");
      heading.textContent = "Monthly Financial Summary";

      container.appendChild(heading);
      dashboard.prepend(container);
    }

    return container;
  }

  function ensureMonthSelector() {
    let selector = getElement("incomeMonthFilter");

    if (selector) {
      return selector;
    }

    const host =
      getElement("teachingSection") ||
      getElement("historySection");

    if (!host) {
      return null;
    }

    const wrapper = document.createElement("div");
    wrapper.style.margin = "12px 0";

    const label = document.createElement("label");
    label.htmlFor = "incomeMonthFilter";
    label.textContent = "Select Month";
    label.style.display = "block";
    label.style.marginBottom = "6px";

    selector = document.createElement("input");
    selector.id = "incomeMonthFilter";
    selector.type = "month";
    selector.value = currentMonthKey();
    selector.style.maxWidth = "100%";

    wrapper.appendChild(label);
    wrapper.appendChild(selector);
    host.prepend(wrapper);

    return selector;
  }

  /* ---------------------------------------------------------
     20. DASHBOARD SUMMARY
     --------------------------------------------------------- */

  function updateDashboard() {
    const monthSelector = getElement("incomeMonthFilter");
    const month = monthSelector && monthSelector.value
      ? monthSelector.value
      : currentMonthKey();

    const summary = calculateMonth(month);

    // Existing dashboard elements.
    setText("teachingTotal", formatMoney(summary.teachingEarning));
    setText("copyTotal", formatMoney(summary.copyEarned));
    setText("salaryReceivedTotal", formatMoney(summary.salaryReceived));
    setText("totalDues", formatMoney(summary.salaryDue + summary.copyDue));
    setText("salaryExpected", formatMoney(summary.salaryExpected));
    setText("salaryMonthReceived", formatMoney(summary.salaryReceived));
    setText("salaryMonthDues", formatMoney(summary.salaryDue));

    // Existing monthly salary input.
    const salaryInput = getElement("monthlySalary");

    if (salaryInput && document.activeElement !== salaryInput) {
      salaryInput.value = readMonthlySalary() || "";
    }

    // Copy checking monthly count and amount.
    const copyRecords = filterByMonth(getCopyRecords(), month);
    const copyCount = copyRecords.reduce(function (total, record) {
      return total + toNumber(record.count);
    }, 0);

    setText("copyMonthCount", String(copyCount));
    setText("copyMonthTotal", formatMoney(summary.copyEarned));

    // New financial summary panel.
    const container = getElement("teachingMonthlySummary");

    if (container) {
      container.innerHTML = `
        <h3>Monthly Financial Summary</h3>
        <p><strong>Month:</strong> ${escapeHTML(monthLabel(month))}</p>
        <p><strong>Teaching Earning:</strong> ${formatMoney(summary.teachingEarning)}</p>
        <p><strong>Copy Checking Earned:</strong> ${formatMoney(summary.copyEarned)}</p>
        <p><strong>Copy Checking Received:</strong> ${formatMoney(summary.copyReceived)}</p>
        <p><strong>Copy Checking Due:</strong> ${formatMoney(summary.copyDue)}</p>
        <hr>
        <p><strong>Total Earning:</strong> ${formatMoney(summary.totalEarning)}</p>
        <p><strong>Salary Expected:</strong> ${formatMoney(summary.salaryExpected)}</p>
        <p><strong>Salary Received:</strong> ${formatMoney(summary.salaryReceived)}</p>
        <p><strong>Salary Due:</strong> ${formatMoney(summary.salaryDue)}</p>
        <p><strong>Total Remaining:</strong> ${formatMoney(summary.totalRemaining)}</p>
      `;
    }

    return summary;
  }

  /* ---------------------------------------------------------
     21. SALARY SECTION & PAYMENT HISTORY
     --------------------------------------------------------- */

  function renderSalarySection() {
    const month = getValue("salaryMonth") || currentMonthKey();
    const summary = calculateMonth(month);

    setText("salaryExpected", formatMoney(summary.salaryExpected));
    setText("salaryMonthReceived", formatMoney(summary.salaryReceived));
    setText("salaryMonthDues", formatMoney(summary.salaryDue));

    const host = getElement("salaryHistory");

    if (!host) {
      updateDashboard();
      return;
    }

    const payments = filterByMonth(getSalaryRecords(), month)
      .sort(function (a, b) {
        return String(b.date).localeCompare(String(a.date));
      });

    if (payments.length === 0) {
      host.innerHTML = "<p>No salary payments recorded for this month.</p>";
      updateDashboard();
      return;
    }

    host.innerHTML = `
      <h3>Salary Payment History — ${escapeHTML(monthLabel(month))}</h3>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr>
              <th style="text-align:left;padding:8px">Date</th>
              <th style="text-align:left;padding:8px">Amount</th>
              <th style="text-align:left;padding:8px">Notes</th>
              <th style="text-align:left;padding:8px">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${payments.map(function (record) {
              return `
                <tr>
                  <td style="padding:8px">${escapeHTML(record.date)}</td>
                  <td style="padding:8px">${formatMoney(record.amount)}</td>
                  <td style="padding:8px">${escapeHTML(record.note || "—")}</td>
                  <td style="padding:8px">
                    <button type="button"
                      onclick="editRecord('salary','${escapeHTML(record.id)}')">
                      Edit
                    </button>
                    <button type="button"
                      onclick="deleteRecord('salary','${escapeHTML(record.id)}')">
                      Delete
                    </button>
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    `;

    updateDashboard();
  }

  /* ---------------------------------------------------------
     22. COMPLETE MONTH-WISE HISTORY
     --------------------------------------------------------- */

  function renderHistory() {
    const host = getElement("completeHistory");

    if (!host) {
      return;
    }

    const selectedType = getValue("historyType", "all").toLowerCase();
    const search = getValue("historySearch").toLowerCase();
    const month = getValue("incomeMonthFilter");

    let records = [];

    if (selectedType === "all" || selectedType === "teaching") {
      getTeachingRecords().forEach(function (record) {
        records.push({ ...record, recordType: "teaching" });
      });
    }

    if (selectedType === "all" || selectedType === "copy") {
      getCopyRecords().forEach(function (record) {
        records.push({ ...record, recordType: "copy" });
      });
    }

    if (selectedType === "all" || selectedType === "salary") {
      getSalaryRecords().forEach(function (record) {
        records.push({ ...record, recordType: "salary" });
      });
    }

    records = records.filter(function (record) {
      const recordDate = record.date || "";
      const recordMonthKey = recordMonth(record);

      const searchableText = [
        recordDate,
        recordMonthKey,
        monthLabel(recordMonthKey),
        record.note,
        record.batch,
        record.className,
        record.timing,
        record.recordType,
        record.amount,
        record.earned,
        record.received
      ].join(" ").toLowerCase();

      const matchesSearch = !search || searchableText.includes(search);
      const matchesMonth = !month || recordMonthKey === month;

      return matchesSearch && matchesMonth;
    });

    records.sort(function (a, b) {
      return String(b.date || "").localeCompare(String(a.date || ""));
    });

    if (records.length === 0) {
      host.innerHTML = "<p>No records found for the selected filters.</p>";
      return;
    }

    host.innerHTML = `
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr>
              <th style="text-align:left;padding:8px">Date</th>
              <th style="text-align:left;padding:8px">Type</th>
              <th style="text-align:left;padding:8px">Details</th>
              <th style="text-align:left;padding:8px">Earned / Amount</th>
              <th style="text-align:left;padding:8px">Received</th>
              <th style="text-align:left;padding:8px">Due</th>
              <th style="text-align:left;padding:8px">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${records.map(function (record) {
              const type = record.recordType;
              const earned = type === "copy"
                ? toNumber(record.earned)
                : toNumber(record.amount);

              const received = type === "copy"
                ? toNumber(record.received)
                : type === "salary"
                  ? toNumber(record.amount)
                  : 0;

              const due = type === "copy"
                ? Math.max(0, earned - received)
                : 0;

              const details = type === "teaching"
                ? [record.batch, record.timing, record.note].filter(Boolean).join(" • ")
                : type === "copy"
                  ? [record.className, record.note].filter(Boolean).join(" • ")
                  : [record.note, record.month].filter(Boolean).join(" • ");

              return `
                <tr>
                  <td style="padding:8px">${escapeHTML(record.date || "—")}</td>
                  <td style="padding:8px">${escapeHTML(type)}</td>
                  <td style="padding:8px">${escapeHTML(details || "—")}</td>
                  <td style="padding:8px">${formatMoney(earned)}</td>
                  <td style="padding:8px">${type === "copy" || type === "salary" ? formatMoney(received) : "—"}</td>
                  <td style="padding:8px">${type === "copy" ? formatMoney(due) : "—"}</td>
                  <td style="padding:8px">
                    <button type="button"
                      onclick="editRecord('${type}','${escapeHTML(record.id)}')">
                      Edit
                    </button>
                    <button type="button"
                      onclick="deleteRecord('${type}','${escapeHTML(record.id)}')">
                      Delete
                    </button>
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
      <p><strong>Records:</strong> ${records.length}</p>
    `;
  }

  /* ---------------------------------------------------------
     23. SHOW / HIDE CUSTOM TIMING
     --------------------------------------------------------- */

  function updateCustomTimingVisibility() {
    const timing = getValue("teachingTiming");
    const box = getElement("customTimingBox");

    if (box) {
      box.style.display = timing === "अन्य" ? "block" : "none";
    }
  }

  /* ---------------------------------------------------------
     24. FORM AND INPUT EVENTS
     --------------------------------------------------------- */

  function connectForms() {
    const teachingForm = getElement("teachingForm");

    if (teachingForm) {
      teachingForm.addEventListener("submit", saveTeachingRecord);
    }

    const copyForm = getElement("copyForm");

    if (copyForm) {
      copyForm.addEventListener("submit", saveCopyRecord);
    }

    const salaryForm = getElement("salaryForm");

    if (salaryForm) {
      salaryForm.addEventListener("submit", addSalaryPayment);
    }

    [
      "teachingType",
      "teachingCount",
      "teachingRate"
    ].forEach(function (id) {
      const element = getElement(id);

      if (element) {
        element.addEventListener("input", updateTeachingCalculation);
        element.addEventListener("change", updateTeachingCalculation);
      }
    });

    [
      "copyCount",
      "copyRate"
    ].forEach(function (id) {
      const element = getElement(id);

      if (element) {
        element.addEventListener("input", updateCopyCalculation);
        element.addEventListener("change", updateCopyCalculation);
      }
    });

    const timing = getElement("teachingTiming");

    if (timing) {
      timing.addEventListener("change", updateCustomTimingVisibility);
    }

    const monthSelector = getElement("incomeMonthFilter");

    if (monthSelector) {
      monthSelector.addEventListener("change", function () {
        updateDashboard();
        renderHistory();
      });
    }

    const salaryMonth = getElement("salaryMonth");

    if (salaryMonth) {
      salaryMonth.addEventListener("change", function () {
        renderSalarySection();
        updateDashboard();
      });
    }

    const historyType = getElement("historyType");

    if (historyType) {
      historyType.addEventListener("change", renderHistory);
    }

    const historySearch = getElement("historySearch");

    if (historySearch) {
      historySearch.addEventListener("input", renderHistory);
    }
  }

  /* ---------------------------------------------------------
     25. EXPOSE FUNCTIONS FOR EXISTING HTML BUTTONS
     Existing inline onclick handlers will continue to work.
     --------------------------------------------------------- */

  window.showSection = showSection;
  window.saveSalarySetup = saveSalarySetup;
  window.addSalaryPayment = addSalaryPayment;
  window.renderHistory = renderHistory;
  window.updateDashboard = updateDashboard;
  window.updateTeachingCalculation = updateTeachingCalculation;
  window.updateCopyCalculation = updateCopyCalculation;
  window.saveTeachingRecord = saveTeachingRecord;
  window.saveCopyRecord = saveCopyRecord;
  window.editRecord = editRecord;
  window.deleteRecord = deleteRecord;
  window.renderSalarySection = renderSalarySection;

  // Compatibility aliases in case existing HTML uses these names.
  window.editTeaching = function (id) {
    editRecord("teaching", id);
  };

  window.deleteTeaching = function (id) {
    deleteRecord("teaching", id);
  };

  window.editCopy = function (id) {
    editRecord("copy", id);
  };

  window.deleteCopy = function (id) {
    deleteRecord("copy", id);
  };

  window.updateTeachingPreview = updateTeachingCalculation;
  window.updateCopyPreview = updateCopyCalculation;

  /* ---------------------------------------------------------
     26. INITIALIZE APPLICATION
     --------------------------------------------------------- */

  function initializeTeachingIncome() {
    setDefaultDates();

    ensureCopyReceivedField();
    ensureMonthSelector();
    ensureSummaryContainer();

    connectForms();

    updateCustomTimingVisibility();
    updateTeachingCalculation();
    updateCopyCalculation();

    updateDashboard();
    renderSalarySection();
    renderHistory();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeTeachingIncome,
      { once: true }
    );
  } else {
    initializeTeachingIncome();
  }

  /* ---------------------------------------------------------
     END OF ARTHAFLOW TEACHING INCOME MANAGER
     --------------------------------------------------------- */

})();
