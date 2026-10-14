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
