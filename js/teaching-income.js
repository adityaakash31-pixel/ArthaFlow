(() => {
    "use strict";

    const KEYS = {
        teaching: "arthaflow_teaching_records",
        copy: "arthaflow_copy_records",
        salary: "arthaflow_salary_records",
        monthlySalary: "arthaflow_monthly_salary"
    };

    const $ = id => document.getElementById(id);

    const money = value => "₹" + (Number(value) || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    const today = () => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    };

    const currentMonth = () => today().slice(0, 7);

    const newId = () =>
        `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    const read = key => {
        try {
            const data = JSON.parse(localStorage.getItem(key) || "[]");
            return Array.isArray(data) ? data : [];
        } catch {
            return [];
        }
    };

    const write = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
    };

    const monthOf = date => String(date || "").slice(0, 7);

    const escapeHTML = value =>
        String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);

    let teaching = read(KEYS.teaching);
    let copies = read(KEYS.copy);
    let salaries = read(KEYS.salary);

    let monthlySalary =
        Number(localStorage.getItem(KEYS.monthlySalary)) || 0;

    function persist() {
        write(KEYS.teaching, teaching);
        write(KEYS.copy, copies);
        write(KEYS.salary, salaries);
    }

    function setText(id, value) {
        const element = $(id);
        if (element) element.textContent = value;
    }

    function setHTML(id, value) {
        const element = $(id);
        if (element) element.innerHTML = value;
    }

    function recordsForMonth(records, month) {
        return records.filter(record => monthOf(record.date) === month);
    }

    function salaryPaymentMonth(record) {
        return record.month || monthOf(record.date);
    }

    function paymentsForMonth(month) {
        return salaries.filter(record => salaryPaymentMonth(record) === month);
    }

    function totalOf(records, field = "total") {
        return records.reduce(
            (sum, record) => sum + (Number(record[field]) || 0),
            0
        );
    }

    function monthName(month) {
        if (!/^\d{4}-\d{2}$/.test(month)) return month || "Unknown Month";

        const [year, number] = month.split("-").map(Number);

        return new Date(year, number - 1, 1).toLocaleDateString("en-IN", {
            month: "long",
            year: "numeric"
        });
    }

    function getMonthFinancials(month) {
        const copyEarnings = totalOf(recordsForMonth(copies, month));
        const payments = totalOf(paymentsForMonth(month), "amount");

        const expectedSalary = monthlySalary;
        const totalDueBeforePayment = expectedSalary + copyEarnings;

        return {
            month,
            expectedSalary,
            teachingBreakdown: totalOf(recordsForMonth(teaching, month)),
            copyEarnings,
            payments,
            totalDueBeforePayment
        };
    }

    function calculateMonthlyLedger(targetMonth) {
        const allMonths = new Set([
            targetMonth,
            ...teaching.map(record => monthOf(record.date)),
            ...copies.map(record => monthOf(record.date)),
            ...salaries.map(record => salaryPaymentMonth(record))
        ]);

        const validMonths = [...allMonths]
            .filter(month => /^\d{4}-\d{2}$/.test(month))
            .sort();

        if (!validMonths.length) {
            return {
                expectedSalary: monthlySalary,
                teachingBreakdown: 0,
                copyEarnings: 0,
                payments: 0,
                openingDues: 0,
                totalDue: monthlySalary,
                closingDues: monthlySalary,
                credit: 0,
                paymentPercent: 0
            };
        }

        const firstMonth = validMonths[0];
        const [startYear, startMonth] = firstMonth.split("-").map(Number);
        const [endYear, endMonth] = targetMonth.split("-").map(Number);

        let openingDues = 0;
        let result = null;

        const monthCount =
            (endYear - startYear) * 12 + endMonth - startMonth;

        for (let index = 0; index <= monthCount; index++) {
            const date = new Date(startYear, startMonth - 1 + index, 1);

            const month =
                `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

            const data = getMonthFinancials(month);
            const totalDue = openingDues + data.totalDueBeforePayment;
            const closingDues = totalDue - data.payments;

            result = {
                ...data,
                openingDues,
                totalDue,
                closingDues: Math.max(0, closingDues),
                credit: Math.max(0, -closingDues),
                paymentPercent: totalDue > 0
                    ? data.payments / totalDue * 100
                    : 0
            };

            openingDues = result.closingDues;
        }

        return result;
                }

     function refreshSummary() {
        const month = currentMonth();

        setText(
            "teachingTotal",
            money(totalOf(recordsForMonth(teaching, month)))
        );

        setText(
            "copyTotal",
            money(totalOf(recordsForMonth(copies, month)))
        );

        const ledger = calculateMonthlyLedger(month);

        setText("salaryReceivedTotal", money(ledger.payments));
        setText("totalDues", money(ledger.closingDues));

        if ($("monthlySalary")) {
            $("monthlySalary").value = monthlySalary || "";
        }

        if ($("copyMonthCount")) {
            setText(
                "copyMonthCount",
                recordsForMonth(copies, month).reduce(
                    (sum, record) => sum + (Number(record.count) || 0),
                    0
                )
            );
        }

        setText("copyMonthTotal", money(ledger.copyEarnings));

        refreshSalarySection();
    }

    function refreshSalarySection() {
        const month = $("salaryMonth")?.value || currentMonth();
        const ledger = calculateMonthlyLedger(month);

        setText("salaryExpected", money(ledger.expectedSalary));
        setText("salaryMonthReceived", money(ledger.payments));
        setText("salaryMonthDues", money(ledger.closingDues));

        renderSalaryHistory();
    }

    function showSection(sectionId) {
        document.querySelectorAll("body > section").forEach(section => {
            section.classList.toggle("hidden", section.id !== sectionId);
        });
    }

    window.showSection = showSection;

    window.saveSalarySetup = function () {
        monthlySalary = Math.max(
            0,
            Number($("monthlySalary").value) || 0
        );

        localStorage.setItem(KEYS.monthlySalary, String(monthlySalary));

        refreshSummary();
        renderHistory();

        alert("Monthly salary setup saved.");
    };

    function updateTeachingCalculation() {
        const count = Number($("teachingCount").value) || 0;
        const rate = Number($("teachingRate").value) || 0;

        setText("teachingCalculation", money(count * rate));
    }

    function updateCopyCalculation() {
        const count = Number($("copyCount").value) || 0;
        const rate = Number($("copyRate").value) || 0;

        setText("copyCalculation", money(count * rate));
    }

    function recordCard(type, record) {
        let title = "";
        let amount = 0;
        let details = "";

        if (type === "teaching") {
            title = `Teaching — ${record.className || record.batch || "Class not specified"}`;
            amount = record.total;
            details = [
                record.date,
                record.timing || "Timing not specified",
                `${record.count} period(s) × ${money(record.rate)}`,
                record.note || ""
            ].filter(Boolean).join(" • ");
        } else if (type === "copy") {
            title = `Copy Checking — ${record.className || "Class not specified"}`;
            amount = record.total;
            details = [
                record.date,
                `${record.count} class(es) × ${money(record.rate)}`,
                record.note || ""
            ].filter(Boolean).join(" • ");
        } else {
            title = `Salary Payment — ${monthName(salaryPaymentMonth(record))}`;
            amount = record.amount;
            details = [
                `Payment Date: ${record.date || "Not specified"}`,
                record.note || ""
            ].filter(Boolean).join(" • ");
        }

        return `
            <div class="record">
                <strong>${escapeHTML(title)}</strong>
                <div>${escapeHTML(details)}</div>
                <strong>${money(amount)}</strong>
            </div>
        `;
    }

    function renderSalaryHistory() {
        const month = $("salaryMonth")?.value || currentMonth();
        const records = paymentsForMonth(month)
            .slice()
            .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));

        if (!records.length) {
            setHTML("salaryHistory", '<p class="muted">No payments recorded for this month.</p>');
            return;
        }

        setHTML(
            "salaryHistory",
            records.map(record => recordCard("salary", record)).join("")
        );
    }

    window.addSalaryPayment = function () {
        const month = $("salaryMonth").value;
        const date = $("salaryPaymentDate").value || today();
        const amount = Number($("salaryPaymentAmount").value);

        if (!month) {
            alert("Please select the salary month.");
            return;
        }

        if (!Number.isFinite(amount) || amount <= 0) {
            alert("Please enter a valid payment amount.");
            return;
        }

        salaries.push({
            id: newId(),
            month,
            date,
            amount,
            note: $("salaryNote").value.trim()
        });

        persist();

        $("salaryPaymentAmount").value = "";
        $("salaryNote").value = "";

        refreshSummary();
        renderHistory();

        alert("Salary payment saved.");
    };

     function renderHistory() {
        const filter = $("historyType")?.value || "all";
        const query = ($("historySearch")?.value || "").trim().toLowerCase();

        let items = [];

        if (filter === "all" || filter === "teaching") {
            items.push(...teaching.map(record => ({
                type: "teaching",
                record
            })));
        }

        if (filter === "all" || filter === "copy") {
            items.push(...copies.map(record => ({
                type: "copy",
                record
            })));
        }

        if (filter === "all" || filter === "salary") {
            items.push(...salaries.map(record => ({
                type: "salary",
                record
            })));
        }

        items = items.filter(item => {
            const record = item.record;

            const searchable = [
                record.date,
                record.month,
                record.className,
                record.batch,
                record.timing,
                record.note,
                record.count,
                record.rate,
                record.amount,
                record.total,
                item.type
            ].join(" ").toLowerCase();

            return searchable.includes(query);
        });

        items.sort((a, b) => {
            const dateA = a.record.date || "";
            const dateB = b.record.date || "";
            return dateB.localeCompare(dateA);
        });

        if (!items.length) {
            setHTML("completeHistory", '<p class="muted">No matching records found.</p>');
            return;
        }

        setHTML(
            "completeHistory",
            items.map(item => recordCard(item.type, item.record)).join("")
        );
    }

    $("teachingType").addEventListener("change", () => {
        if ($("teachingType").value !== "custom") {
            $("teachingRate").value = $("teachingType").value;
        }

        updateTeachingCalculation();
    });

    ["teachingCount", "teachingRate"].forEach(id => {
        $(id).addEventListener("input", updateTeachingCalculation);
    });

    ["copyCount", "copyRate"].forEach(id => {
        $(id).addEventListener("input", updateCopyCalculation);
    });

    $("teachingTiming").addEventListener("change", () => {
        const otherTiming = $("teachingTiming").value === "अन्य";

        $("customTimingBox").classList.toggle("hidden", !otherTiming);
    });

    $("teachingForm").addEventListener("submit", event => {
        event.preventDefault();

        const count = Math.max(1, Number($("teachingCount").value) || 1);
        const rate = Math.max(0, Number($("teachingRate").value) || 0);

        const timingValue = $("teachingTiming").value;
        const timing = timingValue === "अन्य"
            ? $("customTiming").value.trim()
            : timingValue;

        teaching.push({
            id: newId(),
            date: $("teachingDate").value,
            count,
            rate,
            total: count * rate,
            className: $("teachingBatch").value.trim(),
            timing,
            note: $("teachingNote").value.trim()
        });

        persist();
        $("teachingForm").reset();

        $("teachingDate").value = today();
        $("teachingCount").value = 1;
        $("teachingRate").value = 150;
        $("customTimingBox").classList.add("hidden");

        updateTeachingCalculation();
        refreshSummary();
        renderHistory();

        alert("Teaching record saved.");
    });

    $("copyForm").addEventListener("submit", event => {
        event.preventDefault();

        const count = Math.max(1, Number($("copyCount").value) || 1);
        const rate = Math.max(0, Number($("copyRate").value) || 0);

        copies.push({
            id: newId(),
            date: $("copyDate").value,
            count,
            rate,
            total: count * rate,
            className: $("copyClass").value.trim(),
            note: $("copyNote").value.trim()
        });

        persist();
        $("copyForm").reset();

        $("copyDate").value = today();
        $("copyCount").value = 1;
        $("copyRate").value = 225;

        updateCopyCalculation();
        refreshSummary();
        renderHistory();

        alert("Copy checking record saved.");
    });

    $("historyType").addEventListener("change", renderHistory);
    $("historySearch").addEventListener("input", renderHistory);
    $("salaryMonth").addEventListener("change", refreshSalarySection);

    $("teachingDate").value = today();
    $("copyDate").value = today();
    $("salaryPaymentDate").value = today();
    $("salaryMonth").value = currentMonth();

    updateTeachingCalculation();
    updateCopyCalculation();
    refreshSummary();
    renderHistory();
})();
