/* =========================================================
   ArthaFlow - Teaching Income Manager
   REVISED VERSION - PART 1 OF 3
   Core Storage, Salary Modes, Date & Calculation Helpers
   ========================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     1. PRESERVE EXISTING LOCAL STORAGE KEYS
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

  function el(id) {
    return document.getElementById(id);
  }

  function value(id, fallback = "") {
    const node = el(id);
    return node ? String(node.value ?? "").trim() : fallback;
  }

  function number(input) {
    const result = Number(input);
    return Number.isFinite(result) ? result : 0;
  }

  function money(amount) {
    return "₹" + number(amount).toLocaleString("en-IN", {
      maximumFractionDigits: 2
    });
  }

  function id() {
    return (
      Date.now().toString(36) +
      Math.random().toString(36).slice(2, 10)
    );
  }

  function safeHTML(input) {
    return String(input ?? "").replace(/[&<>"']/g, function (ch) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[ch];
    });
  }

  function setText(elementId, text) {
    const node = el(elementId);
    if (node) node.textContent = text;
  }

  /* ---------------------------------------------------------
     3. SAFE STORAGE
     --------------------------------------------------------- */

  function readArray(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return [];

      const data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Unable to read local data:", key, error);
      return [];
    }
  }

  function writeArray(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error("Unable to save local data:", key, error);

      alert(
        "Unable to save data. Please check device storage " +
        "and keep a backup of your records."
      );

      return false;
    }
  }

  /* ---------------------------------------------------------
     4. DATE & MONTH HELPERS
     --------------------------------------------------------- */

  function today() {
    const date = new Date();

    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0")
    ].join("-");
  }

  function currentMonth() {
    return today().slice(0, 7);
  }

  function monthFromDate(dateValue) {
    const match = String(dateValue || "").match(/^(\d{4})-(\d{2})/);

    if (match) return match[1] + "-" + match[2];

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "";

    return (
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0")
    );
  }

  function monthName(month) {
    if (!/^\d{4}-\d{2}$/.test(String(month))) {
      return "Unknown Month";
    }

    const parts = month.split("-").map(Number);

    return new Date(parts[0], parts[1] - 1, 1)
      .toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
      });
  }

  /* ---------------------------------------------------------
     5. SALARY MODE CONFIGURATION

     Backward compatibility:
     An old monthlySalary value such as 25000 is treated as
     Fixed Salary until the user selects another mode.
     --------------------------------------------------------- */

  function getSalaryConfig() {
    const raw = localStorage.getItem(KEYS.monthlySalary);

    if (!raw) {
      return {
        mode: "fixed",
        fixedAmount: 0,
        defaultRate: 150
      };
    }

    try {
      const saved = JSON.parse(raw);

      if (saved && typeof saved === "object") {
        return {
          mode: saved.mode === "period" ? "period" : "fixed",
          fixedAmount: Math.max(
            0,
            number(saved.fixedAmount ?? saved.amount ?? saved.salary)
          ),
          defaultRate: Math.max(
            0,
            number(saved.defaultRate ?? 150)
          )
        };
      }

      // Old storage format: a plain numeric monthly salary.
      return {
        mode: "fixed",
        fixedAmount: Math.max(0, number(saved)),
        defaultRate: 150
      };
    } catch (error) {
      return {
        mode: "fixed",
        fixedAmount: Math.max(
          0,
          number(raw)
        ),
        defaultRate: 150
      };
    }
  }

  function saveSalaryConfig(config) {
    const clean = {
      mode: config.mode === "period" ? "period" : "fixed",
      fixedAmount: Math.max(0, number(config.fixedAmount)),
      defaultRate: Math.max(0, number(config.defaultRate || 150))
    };

    try {
      localStorage.setItem(
        KEYS.monthlySalary,
        JSON.stringify(clean)
      );
      return true;
    } catch (error) {
      console.error("Unable to save salary configuration:", error);
      alert("Unable to save salary settings.");
      return false;
    }
  }

  /* ---------------------------------------------------------
     6. NORMALIZE EXISTING RECORDS
     --------------------------------------------------------- */

  function getTeachingRecords() {
    return readArray(KEYS.teaching).map(function (record) {
      return {
        ...record,
        id: record.id || id(),
        date: record.date || "",
        amount: number(record.amount),
        count: number(record.count),
        rate: number(record.rate)
      };
    });
  }

  function getCopyRecords() {
    return readArray(KEYS.copy).map(function (record) {
      const earned = number(
        record.earned ?? record.amount ?? record.total ?? 0
      );

      return {
        ...record,
        id: record.id || id(),
        date: record.date || "",
        amount: earned,
        earned: earned,
        received: number(record.received ?? record.amountReceived ?? 0),
        count: number(record.count),
        rate: number(record.rate)
      };
    });
  }

  /*
   * Salary storage now supports two types:
   *
   * type: "period"  -> one day's periods for a class/batch
   * type: "payment" -> money actually received
   *
   * Old records without a type are treated as payments.
   */

  function getSalaryRecords() {
    return readArray(KEYS.salary).map(function (record) {
      const recordType =
        record.type === "period" ? "period" : "payment";

      return {
        ...record,
        id: record.id || id(),
        type: recordType,
        date: record.date || "",
        month: record.month || monthFromDate(record.date || ""),
        amount: number(record.amount),
        periods: number(record.periods),
        rate: number(record.rate),
        note: record.note || ""
      };
    });
  }

  function recordMonth(record) {
    if (!record) return "";

    if (/^\d{4}-\d{2}$/.test(String(record.month || ""))) {
      return record.month;
    }

    return monthFromDate(record.date || "");
  }

  function monthRecords(records, month) {
    return records.filter(function (record) {
      return recordMonth(record) === month;
    });
  }

  /* ---------------------------------------------------------
     7. DAILY PERIOD EARNING

     Different classes/batches can have different rates.
     Example:
       4 periods × ₹150 = ₹600
       3 periods × ₹200 = ₹600
       Daily total = ₹1,200
     --------------------------------------------------------- */

  function calculatePeriodRecord(record) {
    return Math.max(0, number(record.periods)) *
           Math.max(0, number(record.rate));
  }

  function getPeriodRecords(month) {
    return monthRecords(getSalaryRecords(), month).filter(
      function (record) {
        return record.type === "period";
      }
    );
  }

  function getPaymentRecords(month) {
    return monthRecords(getSalaryRecords(), month).filter(
      function (record) {
        return record.type === "payment";
      }
    );
  }

  function totalPeriodEarning(month) {
    return getPeriodRecords(month).reduce(function (total, record) {
      return total + calculatePeriodRecord(record);
    }, 0);
  }

  function totalPeriods(month) {
    return getPeriodRecords(month).reduce(function (total, record) {
      return total + Math.max(0, number(record.periods));
    }, 0);
  }

  function totalSalaryPayments(month) {
    return getPaymentRecords(month).reduce(function (total, record) {
      return total + Math.max(0, number(record.amount));
    }, 0);
  }

  /* ---------------------------------------------------------
     8. MONTHLY FINANCIAL SUMMARY

     Fixed mode:
       Salary Earned = configured fixed monthly amount

     Period mode:
       Salary Earned = sum of daily periods × their rates

     Due never becomes negative.
     --------------------------------------------------------- */

  function calculateSalaryMonth(month) {
    const config = getSalaryConfig();

    const earned = config.mode === "period"
      ? totalPeriodEarning(month)
      : config.fixedAmount;

    const received = totalSalaryPayments(month);

    const due = Math.max(0, earned - received);

    const percentage = earned > 0
      ? Math.min(100, (received / earned) * 100)
      : 0;

    return {
      month: month,
      monthName: monthName(month),
      mode: config.mode,
      periods: totalPeriods(month),
      earned: earned,
      received: received,
      due: due,
      percentage: percentage
    };
  }

  /* ---------------------------------------------------------
     9. GENERAL DASHBOARD CALCULATIONS
     --------------------------------------------------------- */

  function calculateMonth(month) {
    const teaching = monthRecords(getTeachingRecords(), month);
    const copy = monthRecords(getCopyRecords(), month);

    const teachingEarning = teaching.reduce(function (sum, record) {
      return sum + number(record.amount);
    }, 0);

    const copyEarned = copy.reduce(function (sum, record) {
      return sum + number(record.earned);
    }, 0);

    const copyReceived = copy.reduce(function (sum, record) {
      return sum + number(record.received);
    }, 0);

    const salary = calculateSalaryMonth(month);

    return {
      month: month,
      monthName: monthName(month),

      teachingEarning: teachingEarning,
      copyEarned: copyEarned,
      copyReceived: copyReceived,
      copyDue: Math.max(0, copyEarned - copyReceived),

      salaryMode: salary.mode,
      salaryPeriods: salary.periods,
      salaryEarned: salary.earned,
      salaryReceived: salary.received,
      salaryDue: salary.due,
      salaryPercentage: salary.percentage,

      totalEarning: teachingEarning + copyEarned,
      totalRemaining:
        salary.due + Math.max(0, copyEarned - copyReceived)
    };
  }

  // PART 1 END
  // Paste Part 2 directly below this line.
  // Do not run until Parts 2 and 3 are added.

   /* =========================================================
     ArthaFlow - Teaching Income Manager
     REVISED VERSION - PART 2 OF 3
     Daily Period Entry, Batch Rates & Salary Payments
     ========================================================= */

  /* ---------------------------------------------------------
     10. ENSURE DAILY PERIOD ENTRY FORM
     --------------------------------------------------------- */

  function ensurePeriodEntryUI() {
    let host = el("periodSalarySection");

    if (host) return host;

    host = document.createElement("section");
    host.id = "periodSalarySection";
    host.style.cssText =
      "margin:16px 0;padding:16px;border:1px solid #d1d5db;" +
      "border-radius:14px;";

    host.innerHTML = `
      <h2>Period-Wise Salary</h2>
      <p>Record the periods taught each day for each class or batch.</p>

      <form id="periodEntryForm">
        <div style="margin-bottom:12px">
          <label for="periodDate">Date</label>
          <input id="periodDate" type="date" required
            style="display:block;width:100%;box-sizing:border-box">
        </div>

        <div style="margin-bottom:12px">
          <label for="periodClass">Class / Batch</label>
          <input id="periodClass" type="text" required
            placeholder="e.g. Class 10 - Morning Batch"
            style="display:block;width:100%;box-sizing:border-box">
        </div>

        <div style="margin-bottom:12px">
          <label for="periodCount">Periods Taught</label>
          <input id="periodCount" type="number" min="1" step="1"
            required placeholder="Enter number of periods"
            style="display:block;width:100%;box-sizing:border-box">
        </div>

        <div style="margin-bottom:12px">
          <label for="periodRate">Rate per Period (₹)</label>
          <input id="periodRate" type="number" min="0.01" step="0.01"
            required placeholder="Enter rate for this class/batch"
            style="display:block;width:100%;box-sizing:border-box">
        </div>

        <div style="margin-bottom:12px">
          <label for="periodNote">Notes (optional)</label>
          <input id="periodNote" type="text"
            placeholder="Optional notes"
            style="display:block;width:100%;box-sizing:border-box">
        </div>

        <p id="periodCalculation">
          Daily Earning: ₹0
        </p>

        <button type="submit">Save Period Entry</button>
        <button type="button" id="cancelPeriodEdit"
          style="display:none">Cancel Edit</button>
      </form>

      <hr>
      <h3>Daily Period Records</h3>
      <div id="periodHistory"></div>
    `;

    const salarySection = el("salarySection");

    if (salarySection) {
      salarySection.appendChild(host);
    } else {
      document.body.appendChild(host);
    }

    return host;
  }

  /* ---------------------------------------------------------
     11. ENSURE SALARY MODE SELECTOR
     --------------------------------------------------------- */

  function ensureSalaryModeUI() {
    let host = el("salaryModeControls");

    if (host) return host;

    host = document.createElement("div");
    host.id = "salaryModeControls";
    host.style.cssText =
      "margin:16px 0;padding:14px;border:1px solid #d1d5db;" +
      "border-radius:12px;";

    host.innerHTML = `
      <h3>Salary Calculation Mode</h3>

      <label for="salaryModeSelect">Choose Salary Type</label>
      <select id="salaryModeSelect"
        style="display:block;width:100%;max-width:100%;padding:8px">
        <option value="fixed">Fixed Salary</option>
        <option value="period">Period-Wise Salary</option>
      </select>

      <div id="fixedSalaryControls" style="margin-top:12px">
        <label for="monthlySalary">Fixed Monthly Salary (₹)</label>
        <input id="monthlySalary" type="number" min="0" step="0.01"
          placeholder="Enter fixed monthly salary"
          style="display:block;width:100%;box-sizing:border-box">
        <button type="button" id="saveFixedSalaryButton">
          Save Fixed Salary
        </button>
      </div>

      <div id="periodSalaryControls" style="display:none;margin-top:12px">
        <p>Salary is calculated from the daily period entries below.</p>
        <label for="defaultPeriodRate">Suggested Default Rate (₹)</label>
        <input id="defaultPeriodRate" type="number" min="0" step="0.01"
          placeholder="e.g. 150"
          style="display:block;width:100%;box-sizing:border-box">
        <p>
          Each class or batch can have its own rate.
          The default rate is only a suggestion for new entries.
        </p>
      </div>
    `;

    const salarySection = el("salarySection");

    if (salarySection) {
      salarySection.prepend(host);
    } else {
      document.body.appendChild(host);
    }

    return host;
  }

  /* ---------------------------------------------------------
     12. CLASS / BATCH RATE MEMORY
     --------------------------------------------------------- */

  /*
   * Rates are remembered in this page session by class/batch name.
   * This does not create another localStorage key.
   * Every saved daily record permanently retains its own rate.
   */

  const batchRateMemory = Object.create(null);

  function rememberBatchRate(batchName, rate) {
    const key = String(batchName || "").trim().toLowerCase();

    if (key && number(rate) > 0) {
      batchRateMemory[key] = number(rate);
    }
  }

  function getRememberedBatchRate(batchName) {
    const key = String(batchName || "").trim().toLowerCase();
    return number(batchRateMemory[key]);
  }

  function updatePeriodCalculation() {
    const count = Math.max(0, number(value("periodCount")));
    const rate = Math.max(0, number(value("periodRate")));
    const total = count * rate;

    setText("periodCalculation", "Daily Earning: " + money(total));

    return total;
  }

  function suggestBatchRate() {
    const batch = value("periodClass");
    const rememberedRate = getRememberedBatchRate(batch);
    const rateInput = el("periodRate");

    if (!rateInput) return;

    if (rememberedRate > 0 && !rateInput.dataset.userEdited) {
      rateInput.value = rememberedRate;
    } else if (!rateInput.value) {
      const config = getSalaryConfig();

      if (config.defaultRate > 0) {
        rateInput.value = config.defaultRate;
      }
    }

    updatePeriodCalculation();
  }

  /* ---------------------------------------------------------
     13. RESET PERIOD FORM
     --------------------------------------------------------- */

  function resetPeriodForm() {
    const form = el("periodEntryForm");

    if (!form) return;

    form.reset();
    delete form.dataset.editingId;

    if (el("periodDate")) {
      el("periodDate").value = today();
    }

    const rateInput = el("periodRate");

    if (rateInput) {
      delete rateInput.dataset.userEdited;
    }

    setText("periodCalculation", "Daily Earning: ₹0");

    const button = form.querySelector('button[type="submit"]');

    if (button) {
      button.textContent = "Save Period Entry";
    }

    const cancel = el("cancelPeriodEdit");

    if (cancel) {
      cancel.style.display = "none";
    }
  }

  /* ---------------------------------------------------------
     14. SAVE / UPDATE DAILY PERIOD ENTRY
     --------------------------------------------------------- */

  function savePeriodEntry(event) {
    if (event) event.preventDefault();

    const date = value("periodDate") || today();
    const batch = value("periodClass");
    const periods = number(value("periodCount"));
    const rate = number(value("periodRate"));
    const note = value("periodNote");

    if (!batch) {
      alert("Please enter the class or batch name.");
      return;
    }

    if (!Number.isInteger(periods) || periods <= 0) {
      alert("Please enter a valid number of periods.");
      return;
    }

    if (rate <= 0) {
      alert("Please enter a rate greater than zero.");
      return;
    }

    const records = readArray(KEYS.salary);
    const form = el("periodEntryForm");
    const editingId = form ? form.dataset.editingId || "" : "";

    const record = {
      id: editingId || id(),
      type: "period",
      date: date,
      month: monthFromDate(date),
      batch: batch,
      className: batch,
      periods: periods,
      rate: rate,
      amount: periods * rate,
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

    if (!writeArray(KEYS.salary, records)) return;

    rememberBatchRate(batch, rate);
    resetPeriodForm();

    updateDashboard();
    renderPeriodHistory();
    renderSalarySection();
    renderHistory();

    alert(editingId
      ? "Period entry updated successfully."
      : "Period entry saved successfully."
    );
  }

  /* ---------------------------------------------------------
     15. SAVE SALARY MODE SETTINGS
     --------------------------------------------------------- */

  function saveSalaryModeSettings() {
    const mode = value("salaryModeSelect", "fixed");
    const oldConfig = getSalaryConfig();

    const fixedAmount = Math.max(
      0,
      number(value("monthlySalary", String(oldConfig.fixedAmount)))
    );

    const defaultRate = Math.max(
      0,
      number(value("defaultPeriodRate", String(oldConfig.defaultRate || 150)))
    );

    const config = {
      mode: mode === "period" ? "period" : "fixed",
      fixedAmount: fixedAmount,
      defaultRate: defaultRate || 150
    };

    if (!saveSalaryConfig(config)) return;

    updateSalaryModeVisibility();
    updateDashboard();
    renderSalarySection();
    renderHistory();

    alert("Salary settings saved successfully.");
  }

  function updateSalaryModeVisibility() {
    const config = getSalaryConfig();
    const mode = value("salaryModeSelect", config.mode);

    const fixedControls = el("fixedSalaryControls");
    const periodControls = el("periodSalaryControls");
    const periodSection = el("periodSalarySection");

    if (fixedControls) {
      fixedControls.style.display = mode === "fixed" ? "block" : "none";
    }

    if (periodControls) {
      periodControls.style.display = mode === "period" ? "block" : "none";
    }

    if (periodSection) {
      periodSection.style.display = mode === "period" ? "block" : "none";
    }
  }

  /* ---------------------------------------------------------
     16. RECORD SALARY PAYMENT
     --------------------------------------------------------- */

  function ensureSalaryPaymentForm() {
    let form = el("salaryPaymentForm");

    if (form) return form;

    const host = el("salarySection") || document.body;

    const wrapper = document.createElement("section");
    wrapper.id = "salaryPaymentPanel";
    wrapper.style.cssText =
      "margin:16px 0;padding:14px;border:1px solid #d1d5db;" +
      "border-radius:12px;";

    wrapper.innerHTML = `
      <h3>Record Salary Payment</h3>
      <form id="salaryPaymentForm">
        <label for="salaryMonth">Salary Month</label>
        <input id="salaryMonth" type="month" required
          style="display:block;width:100%;box-sizing:border-box">

        <label for="salaryPaymentDate">Payment Date</label>
        <input id="salaryPaymentDate" type="date" required
          style="display:block;width:100%;box-sizing:border-box">

        <label for="salaryPaymentAmount">Amount Received (₹)</label>
        <input id="salaryPaymentAmount" type="number" min="0.01"
          step="0.01" required
          style="display:block;width:100%;box-sizing:border-box">

        <label for="salaryNote">Notes (optional)</label>
        <input id="salaryNote" type="text"
          style="display:block;width:100%;box-sizing:border-box">

        <button type="submit">Save Payment</button>
        <button type="button" id="cancelSalaryEdit"
          style="display:none">Cancel Edit</button>
      </form>
    `;

    host.appendChild(wrapper);

    return el("salaryPaymentForm");
  }

  function saveSalaryPayment(event) {
    if (event) event.preventDefault();

    const month = value("salaryMonth") || currentMonth();
    const date = value("salaryPaymentDate") || today();
    const amount = number(value("salaryPaymentAmount"));
    const note = value("salaryNote");

    if (!/^\d{4}-\d{2}$/.test(month)) {
      alert("Please select the salary month.");
      return;
    }

    if (amount <= 0) {
      alert("Please enter an amount greater than zero.");
      return;
    }

    const records = readArray(KEYS.salary);
    const form = el("salaryPaymentForm");
    const editingId = form ? form.dataset.editingId || "" : "";

    const payment = {
      id: editingId || id(),
      type: "payment",
      month: month,
      date: date,
      amount: amount,
      note: note,
      updatedAt: new Date().toISOString()
    };

    const index = records.findIndex(function (record) {
      return String(record.id) === String(payment.id);
    });

    if (index >= 0) {
      records[index] = {
        ...records[index],
        ...payment
      };
    } else {
      records.push(payment);
    }

    if (!writeArray(KEYS.salary, records)) return;

    resetSalaryPaymentForm();
    updateDashboard();
    renderSalarySection();
    renderPeriodHistory();
    renderHistory();

    alert(editingId
      ? "Salary payment updated successfully."
      : "Salary payment saved successfully."
    );
  }

  function resetSalaryPaymentForm() {
    const form = el("salaryPaymentForm");

    if (!form) return;

    form.reset();
    delete form.dataset.editingId;

    if (el("salaryMonth")) {
      el("salaryMonth").value = currentMonth();
    }

    if (el("salaryPaymentDate")) {
      el("salaryPaymentDate").value = today();
    }

    const button = form.querySelector('button[type="submit"]');

    if (button) button.textContent = "Save Payment";

    const cancel = el("cancelSalaryEdit");

    if (cancel) cancel.style.display = "none";
  }

  /* ---------------------------------------------------------
     17. EDIT / DELETE PERIOD & PAYMENT RECORDS
     --------------------------------------------------------- */

  function editSalaryRecord(recordId) {
    const records = readArray(KEYS.salary);

    const record = records.find(function (item) {
      return String(item.id) === String(recordId);
    });

    if (!record) {
      alert("Salary record not found.");
      return;
    }

    if (record.type === "period") {
      ensurePeriodEntryUI();

      const form = el("periodEntryForm");

      if (!form) return;

      form.dataset.editingId = record.id;

      if (el("periodDate")) el("periodDate").value = record.date || today();
      if (el("periodClass")) el("periodClass").value = record.batch || record.className || "";
      if (el("periodCount")) el("periodCount").value = record.periods ?? "";
      if (el("periodRate")) el("periodRate").value = record.rate ?? "";
      if (el("periodNote")) el("periodNote").value = record.note || "";

      const button = form.querySelector('button[type="submit"]');

      if (button) button.textContent = "Update Period Entry";

      if (el("cancelPeriodEdit")) {
        el("cancelPeriodEdit").style.display = "inline-block";
      }

      updatePeriodCalculation();
      form.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    ensureSalaryPaymentForm();

    const paymentForm = el("salaryPaymentForm");

    if (!paymentForm) return;

    paymentForm.dataset.editingId = record.id;

    if (el("salaryMonth")) el("salaryMonth").value = record.month || monthFromDate(record.date);
    if (el("salaryPaymentDate")) el("salaryPaymentDate").value = record.date || today();
    if (el("salaryPaymentAmount")) el("salaryPaymentAmount").value = record.amount ?? "";
    if (el("salaryNote")) el("salaryNote").value = record.note || "";

    const button = paymentForm.querySelector('button[type="submit"]');

    if (button) button.textContent = "Update Payment";

    if (el("cancelSalaryEdit")) {
      el("cancelSalaryEdit").style.display = "inline-block";
    }

    paymentForm.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function deleteSalaryRecord(recordId) {
    const records = readArray(KEYS.salary);

    const record = records.find(function (item) {
      return String(item.id) === String(recordId);
    });

    if (!record) {
      alert("Salary record not found.");
      return;
    }

    const label = record.type === "period"
      ? "this period entry"
      : "this salary payment";

    if (!confirm("Are you sure you want to delete " + label + "?")) {
      return;
    }

    const updated = records.filter(function (item) {
      return String(item.id) !== String(recordId);
    });

    if (!writeArray(KEYS.salary, updated)) return;

    updateDashboard();
    renderPeriodHistory();
    renderSalarySection();
    renderHistory();

    alert("Record deleted successfully.");
  }

  // PART 2 END
  // Paste Part 3 directly below this line.
  // Do not run until all three parts are joined.

   /* =========================================================
     ArthaFlow - Teaching Income Manager
     REVISED VERSION - PART 3 OF 3
     Dashboard, Monthly Summary, History & Initialization
     ========================================================= */

  /* ---------------------------------------------------------
     18. SAFE HTML DISPLAY HELPERS
     --------------------------------------------------------- */

  function displayDate(date) {
    if (!date) return "—";

    const parts = String(date).split("-");

    if (parts.length === 3) {
      return parts[2] + "/" + parts[1] + "/" + parts[0];
    }

    return String(date);
  }

  function escapeText(text) {
    return safeHTML(text == null ? "" : String(text));
  }

  function actionButton(label, action, recordId) {
    return `
      <button type="button"
        onclick="${action}('${escapeText(recordId)}')">
        ${label}
      </button>
    `;
  }

  function getRecordAmount(record) {
    if (record.type === "period") {
      return calculatePeriodRecord(record);
    }

    return number(record.amount);
  }

  /* ---------------------------------------------------------
     19. MONTH-WISE SALARY SUMMARY
     --------------------------------------------------------- */

  /*
   * Fixed mode:
   * Earned = fixed salary for the selected month.
   *
   * Period mode:
   * Earned = sum of daily periods × the saved rate per entry.
   *
   * Payments are assigned to their selected salary month.
   * Previous month's unpaid balance is not added to the
   * next month's salary earnings.
   */

  function calculateSalaryMonth(month) {
    const config = getSalaryConfig();
    const mode = config.mode === "period" ? "period" : "fixed";

    const periodRecords = getPeriodRecords(month);
    const paymentRecords = getPaymentRecords(month);

    const earned = mode === "period"
      ? periodRecords.reduce(function (sum, record) {
          return sum + calculatePeriodRecord(record);
        }, 0)
      : Math.max(0, number(config.fixedAmount));

    const received = paymentRecords.reduce(function (sum, record) {
      return sum + number(record.amount);
    }, 0);

    const due = Math.max(0, earned - received);

    const percentage = earned > 0
      ? Math.min(100, (received / earned) * 100)
      : 0;

    return {
      month: month,
      mode: mode,
      earned: earned,
      received: received,
      due: due,
      percentage: percentage,
      periods: periodRecords.reduce(function (sum, record) {
        return sum + number(record.periods);
      }, 0),
      periodRecords: periodRecords,
      paymentRecords: paymentRecords
    };
  }

  /* ---------------------------------------------------------
     20. MONTH-WISE TEACHING / COPY SUMMARY
     --------------------------------------------------------- */

  function getMonthRecordsFromKey(key, month) {
    return readArray(key).filter(function (record) {
      return recordMonth(record) === month;
    });
  }

  function sumAmounts(records) {
    return records.reduce(function (sum, record) {
      return sum + number(record.amount);
    }, 0);
  }

  function calculateMonth(month) {
    const teachingRecords = getMonthRecordsFromKey(KEYS.teaching, month);
    const copyRecords = getMonthRecordsFromKey(KEYS.copy, month);
    const salary = calculateSalaryMonth(month);

    const teachingEarning = sumAmounts(teachingRecords);
    const copyEarned = sumAmounts(copyRecords);

    /*
     * Copy checking earned and received are different concepts.
     * Existing copy records count as earned income.
     * If a copy record has a received field, it is used;
     * otherwise its amount is treated as earned, not as a
     * separate receipt.
     */

    const copyReceived = copyRecords.reduce(function (sum, record) {
      if (record.receivedAmount != null) {
        return sum + number(record.receivedAmount);
      }

      if (record.received != null) {
        return sum + number(record.received);
      }

      return sum;
    }, 0);

    const copyDue = Math.max(0, copyEarned - copyReceived);

    return {
      month: month,
      teachingEarning: teachingEarning,
      copyEarned: copyEarned,
      copyReceived: copyReceived,
      copyDue: copyDue,

      salaryMode: salary.mode,
      salaryPeriods: salary.periods,
      salaryEarned: salary.earned,
      salaryReceived: salary.received,
      salaryDue: salary.due,
      salaryPercentage: salary.percentage,

      totalEarning: teachingEarning + copyEarned,
      totalRemaining: salary.due + copyDue
    };
  }

  /* ---------------------------------------------------------
     21. DASHBOARD UPDATE
     --------------------------------------------------------- */

  function updateDashboard() {
    const month = currentMonth();
    const summary = calculateMonth(month);

    setText("teachingTotal", money(summary.teachingEarning));
    setText("copyTotal", money(summary.copyEarned));
    setText("salaryReceivedTotal", money(summary.salaryReceived));
    setText("totalDues", money(summary.totalRemaining));

    setText("salaryExpected", money(summary.salaryEarned));
    setText("salaryMonthReceived", money(summary.salaryReceived));
    setText("salaryMonthDues", money(summary.salaryDue));

    setText(
      "copyMonthTotal",
      money(summary.copyEarned)
    );

    const copyRecords = getMonthRecordsFromKey(KEYS.copy, month);
    const copyCount = copyRecords.reduce(function (sum, record) {
      return sum + number(record.count);
    }, 0);

    setText("copyMonthCount", String(copyCount));

    /*
     * If the dashboard contains these optional IDs,
     * update them too. Existing layouts remain unchanged.
     */

    setText("totalEarning", money(summary.totalEarning));
    setText("totalIncome", money(summary.totalEarning));
    setText("salaryDue", money(summary.salaryDue));
    setText("salaryPercentage", summary.salaryPercentage.toFixed(1) + "%");
    setText("salaryPeriodsTotal", String(summary.salaryPeriods));

    const salaryConfig = getSalaryConfig();

    if (el("salaryModeSelect")) {
      el("salaryModeSelect").value = salaryConfig.mode;
    }

    if (el("monthlySalary")) {
      el("monthlySalary").value = salaryConfig.fixedAmount || "";
    }

    if (el("defaultPeriodRate")) {
      el("defaultPeriodRate").value = salaryConfig.defaultRate || "";
    }

    updateSalaryModeVisibility();
  }

  /* ---------------------------------------------------------
     22. RENDER DAILY PERIOD HISTORY
     --------------------------------------------------------- */

  function renderPeriodHistory() {
    const host = el("periodHistory");

    if (!host) return;

    const month = value("salaryMonth") || currentMonth();

    const records = getPeriodRecords(month).sort(function (a, b) {
      return String(b.date || "").localeCompare(String(a.date || ""));
    });

    if (!records.length) {
      host.innerHTML = "<p>No period entries found for this month.</p>";
      return;
    }

    let totalPeriodsCount = 0;
    let totalEarned = 0;

    const rows = records.map(function (record) {
      const periods = number(record.periods);
      const amount = calculatePeriodRecord(record);

      totalPeriodsCount += periods;
      totalEarned += amount;

      return `
        <tr>
          <td>${escapeText(displayDate(record.date))}</td>
          <td>${escapeText(record.batch || record.className || "—")}</td>
          <td>${periods}</td>
          <td>${escapeText(money(record.rate))}</td>
          <td>${escapeText(money(amount))}</td>
          <td>
            ${actionButton("Edit", "editSalaryRecord", record.id)}
            ${actionButton("Delete", "deleteSalaryRecord", record.id)}
          </td>
        </tr>
      `;
    }).join("");

    host.innerHTML = `
      <p><strong>Total Periods:</strong> ${totalPeriodsCount}</p>
      <p><strong>Total Period-Wise Earning:</strong> ${escapeText(money(totalEarned))}</p>

      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr>
              <th>Date</th>
              <th>Class / Batch</th>
              <th>Periods</th>
              <th>Rate</th>
              <th>Earned</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  }

  /* ---------------------------------------------------------
     23. RENDER SALARY MONTH SUMMARY & PAYMENTS
     --------------------------------------------------------- */

  function renderSalarySection() {
    const month = value("salaryMonth") || currentMonth();
    const summary = calculateSalaryMonth(month);

    setText("salaryExpected", money(summary.earned));
    setText("salaryMonthReceived", money(summary.received));
    setText("salaryMonthDues", money(summary.due));

    const history = el("salaryHistory");

    if (history) {
      const payments = summary.paymentRecords.slice().sort(function (a, b) {
        return String(b.date || "").localeCompare(String(a.date || ""));
      });

      if (!payments.length) {
        history.innerHTML = "<p>No salary payments recorded for this month.</p>";
      } else {
        history.innerHTML = `
          <div style="overflow-x:auto">
            <table style="width:100%;border-collapse:collapse">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount Received</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${payments.map(function (record) {
                  return `
                    <tr>
                      <td>${escapeText(displayDate(record.date))}</td>
                      <td>${escapeText(money(record.amount))}</td>
                      <td>${escapeText(record.note || "—")}</td>
                      <td>
                        ${actionButton("Edit", "editSalaryRecord", record.id)}
                        ${actionButton("Delete", "deleteSalaryRecord", record.id)}
                      </td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>
        `;
      }
    }

    const percent = summary.percentage.toFixed(1);

    setText("salaryPercentage", percent + "%");

    const progress = el("salaryPaymentProgress");

    if (progress) {
      progress.max = 100;
      progress.value = summary.percentage;
    }

    renderPeriodHistory();
  }

  /* ---------------------------------------------------------
     24. RENDER COMPLETE TRANSACTION HISTORY
     --------------------------------------------------------- */

  function renderHistory() {
    const host = el("completeHistory");

    if (!host) return;

    const typeFilter = value("historyType", "all");
    const search = value("historySearch").trim().toLowerCase();

    const teaching = readArray(KEYS.teaching).map(function (record) {
      return {
        ...record,
        _type: "teaching",
        _amount: number(record.amount),
        _label: record.batch || record.type || "Teaching"
      };
    });

    const copy = readArray(KEYS.copy).map(function (record) {
      return {
        ...record,
        _type: "copy",
        _amount: number(record.amount),
        _label: record.className || record.class || "Copy Checking"
      };
    });

    const salary = readArray(KEYS.salary).map(function (record) {
      const isPeriod = record.type === "period";

      return {
        ...record,
        _type: isPeriod ? "period" : "salary",
        _amount: isPeriod
          ? calculatePeriodRecord(record)
          : number(record.amount),
        _label: isPeriod
          ? (record.batch || record.className || "Period Entry")
          : "Salary Payment"
      };
    });

    let records = teaching.concat(copy, salary);

    records = records.filter(function (record) {
      if (
        typeFilter !== "all" &&
        typeFilter !== record._type
      ) {
        return false;
      }

      const searchable = [
        record.date,
        record.month,
        record._label,
        record.note,
        record.batch,
        record.className
      ].join(" ").toLowerCase();

      return !search || searchable.includes(search);
    });

    records.sort(function (a, b) {
      return String(b.date || "").localeCompare(String(a.date || ""));
    });

    if (!records.length) {
      host.innerHTML = "<p>No matching records found.</p>";
      return;
    }

    host.innerHTML = `
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Class / Details</th>
              <th>Periods</th>
              <th>Amount</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${records.map(function (record) {
              const canEditSalary =
                record._type === "salary" ||
                record._type === "period";

              const actions = canEditSalary
                ? actionButton("Edit", "editSalaryRecord", record.id) +
                  actionButton("Delete", "deleteSalaryRecord", record.id)
                : "";

              return `
                <tr>
                  <td>${escapeText(displayDate(record.date))}</td>
                  <td>${escapeText(record._type)}</td>
                  <td>${escapeText(record._label)}</td>
                  <td>${record._type === "period" ? number(record.periods) : "—"}</td>
                  <td>${escapeText(money(record._amount))}</td>
                  <td>${escapeText(record.note || "—")}</td>
                  <td>${actions}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  /* ---------------------------------------------------------
     25. MONTH FILTERS
     --------------------------------------------------------- */

  function refreshSelectedMonth() {
    updateDashboard();
    renderSalarySection();
    renderHistory();
  }

  /* ---------------------------------------------------------
     26. CONNECT EXISTING FORMS & BUTTONS
     --------------------------------------------------------- */

  function bindIncomeEvents() {
    ensureSalaryModeUI();
    ensurePeriodEntryUI();
    ensureSalaryPaymentForm();

    const periodForm = el("periodEntryForm");

    if (periodForm && !periodForm.dataset.bound) {
      periodForm.addEventListener("submit", savePeriodEntry);
      periodForm.dataset.bound = "1";
    }

    const paymentForm = el("salaryPaymentForm");

    if (paymentForm && !paymentForm.dataset.bound) {
      paymentForm.addEventListener("submit", saveSalaryPayment);
      paymentForm.dataset.bound = "1";
    }

    const modeSelect = el("salaryModeSelect");

    if (modeSelect && !modeSelect.dataset.bound) {
      modeSelect.addEventListener("change", function () {
        updateSalaryModeVisibility();
      });

      modeSelect.dataset.bound = "1";
    }

    const saveButton = el("saveFixedSalaryButton");

    if (saveButton && !saveButton.dataset.bound) {
      saveButton.addEventListener("click", saveSalaryModeSettings);
      saveButton.dataset.bound = "1";
    }

    const periodDate = el("periodDate");

    if (periodDate && !periodDate.value) {
      periodDate.value = today();
    }

    const salaryMonthInput = el("salaryMonth");

    if (salaryMonthInput) {
      if (!salaryMonthInput.value) {
        salaryMonthInput.value = currentMonth();
      }

      if (!salaryMonthInput.dataset.bound) {
        salaryMonthInput.addEventListener("change", refreshSelectedMonth);
        salaryMonthInput.dataset.bound = "1";
      }
    }

    const paymentDate = el("salaryPaymentDate");

    if (paymentDate && !paymentDate.value) {
      paymentDate.value = today();
    }

    const periodClass = el("periodClass");

    if (periodClass && !periodClass.dataset.bound) {
      periodClass.addEventListener("change", suggestBatchRate);
      periodClass.dataset.bound = "1";
    }

    const periodRate = el("periodRate");

    if (periodRate && !periodRate.dataset.bound) {
      periodRate.addEventListener("input", function () {
        periodRate.dataset.userEdited = "1";
        updatePeriodCalculation();
      });

      periodRate.dataset.bound = "1";
    }

    const periodCount = el("periodCount");

    if (periodCount && !periodCount.dataset.bound) {
      periodCount.addEventListener("input", updatePeriodCalculation);
      periodCount.dataset.bound = "1";
    }

    const cancelPeriod = el("cancelPeriodEdit");

    if (cancelPeriod && !cancelPeriod.dataset.bound) {
      cancelPeriod.addEventListener("click", resetPeriodForm);
      cancelPeriod.dataset.bound = "1";
    }

    const cancelPayment = el("cancelSalaryEdit");

    if (cancelPayment && !cancelPayment.dataset.bound) {
      cancelPayment.addEventListener("click", resetSalaryPaymentForm);
      cancelPayment.dataset.bound = "1";
    }

    const historySearch = el("historySearch");

    if (historySearch && !historySearch.dataset.bound) {
      historySearch.addEventListener("input", renderHistory);
      historySearch.dataset.bound = "1";
    }

    const historyType = el("historyType");

    if (historyType && !historyType.dataset.bound) {
      historyType.addEventListener("change", renderHistory);
      historyType.dataset.bound = "1";
    }

    /*
     * Keep existing inline HTML handlers working.
     * These functions are also exposed globally below.
     */
  }

  /* ---------------------------------------------------------
     27. GLOBAL HANDLERS FOR EXISTING HTML
     --------------------------------------------------------- */

  window.saveSalarySetup = function () {
    saveSalaryModeSettings();
  };

  window.addSalaryPayment = function () {
    saveSalaryPayment();
  };

  window.savePeriodEntry = function () {
    savePeriodEntry();
  };

  window.editSalaryRecord = function (recordId) {
    editSalaryRecord(recordId);
  };

  window.deleteSalaryRecord = function (recordId) {
    deleteSalaryRecord(recordId);
  };

  /*
   * If the old page already calls updateDashboard(),
   * renderHistory(), or renderSalarySection(), those calls
   * will continue to work.
   */

  window.updateDashboard = updateDashboard;
  window.renderHistory = renderHistory;
  window.renderSalarySection = renderSalarySection;
  window.renderPeriodHistory = renderPeriodHistory;

  /* ---------------------------------------------------------
     28. INITIALIZE
     --------------------------------------------------------- */

  function initializeTeachingIncome() {
    ensureSalaryModeUI();
    ensurePeriodEntryUI();
    ensureSalaryPaymentForm();

    bindIncomeEvents();

    const config = getSalaryConfig();

    if (el("salaryModeSelect")) {
      el("salaryModeSelect").value = config.mode;
    }

    if (el("monthlySalary")) {
      el("monthlySalary").value = config.fixedAmount || "";
    }

    if (el("defaultPeriodRate")) {
      el("defaultPeriodRate").value = config.defaultRate || 150;
    }

    if (el("periodDate")) {
      el("periodDate").value = today();
    }

    if (el("salaryMonth")) {
      el("salaryMonth").value = currentMonth();
    }

    if (el("salaryPaymentDate")) {
      el("salaryPaymentDate").value = today();
    }

    updateDashboard();
    renderSalarySection();
    renderHistory();
    updatePeriodCalculation();
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

  /* =========================================================
     END OF PART 3
     Close the IIFE started in Part 1.
     =====
