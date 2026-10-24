
(function () {
    "use strict";

    const STORAGE_PREFIX = "arthaflow_personal_ledger_v1_";
    const uid = localStorage.getItem("firebaseUID") || "local";
    const STORAGE_KEY = STORAGE_PREFIX + uid;

    const $ = (id) => document.getElementById(id);

    const ledgerForm = $("ledgerForm");
    const repaymentForm = $("repaymentForm");

    if (!ledgerForm || !repaymentForm) return;

    let entries = [];

    function today() {
        const d = new Date();
        return [
            d.getFullYear(),
            String(d.getMonth() + 1).padStart(2, "0"),
            String(d.getDate()).padStart(2, "0")
        ].join("-");
    }

    function money(value) {
        return Number(value || 0).toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2
        });
    }

    function makeId() {
        return Date.now().toString(36) +
            Math.random().toString(36).slice(2, 9);
    }

    function showMessage(message) {
        const box = $("ledgerMessage");
        if (box) box.textContent = message;
    }

    function loadEntries() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            const parsed = saved ? JSON.parse(saved) : [];

            if (!Array.isArray(parsed)) {
                throw new Error("Invalid ledger data format.");
            }

            entries = parsed;
        } catch (error) {
            entries = [];
            showMessage(
                "Unable to read saved ledger data. Please check your browser data before making changes."
            );
            console.error("Personal Ledger load error:", error);
        }
    }

    function saveEntries() {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(entries)
            );
            return true;
        } catch (error) {
            showMessage(
                "Unable to save data. Browser storage may be full or unavailable."
            );
            console.error("Personal Ledger save error:", error);
            return false;
        }
    }

    function repaymentsTotal(entry) {
        return (entry.repayments || []).reduce(
            (sum, payment) =>
                sum + Number(payment.amount || 0),
            0
        );
    }

    function remaining(entry) {
        return Math.max(
            0,
            Number(entry.amount) - repaymentsTotal(entry)
        );
    }

    function renderSummary() {
        let totalGiven = 0;
        let totalReceived = 0;
        let totalBorrowed = 0;
        let totalRepaid = 0;

        entries.forEach((entry) => {
            const paid = repaymentsTotal(entry);

            if (entry.type === "given") {
                totalGiven += Number(entry.amount);
                totalReceived += paid;
            } else if (entry.type === "borrowed") {
                totalBorrowed += Number(entry.amount);
                totalRepaid += paid;
            }
        });

        $("totalGiven").textContent = money(totalGiven);
        $("totalReceived").textContent = money(totalReceived);
        $("stillToReceive").textContent =
            money(totalGiven - totalReceived);
        $("totalBorrowed").textContent = money(totalBorrowed);
        $("totalRepaid").textContent = money(totalRepaid);
        $("stillToPay").textContent =
            money(totalBorrowed - totalRepaid);
    }

    function renderRepaymentOptions() {
        const select = $("repaymentEntry");
        const previous = select.value;

        select.innerHTML = "";

        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = "Select Ledger Entry";
        select.appendChild(placeholder);

        entries
            .filter((entry) => remaining(entry) > 0)
            .forEach((entry) => {
                const option = document.createElement("option");
                option.value = entry.id;

                const transactionType =
                    entry.type === "given"
                        ? "Money Given"
                        : "Money Borrowed";

                const balanceType =
                    entry.type === "given"
                        ? "Receivable"
                        : "Payable";

                option.textContent =
                    entry.personName + " — " +
                    transactionType + " — Remaining: " +
                    money(remaining(entry)) + " (" +
                    balanceType + ")";

                select.appendChild(option);
            });

        if (
            [...select.options].some(
                (option) => option.value === previous
            )
        ) {
            select.value = previous;
        }
    }

    function renderHistory() {
        const tbody = $("ledgerHistory");
        const query = (
            $("ledgerSearch").value || ""
        ).trim().toLowerCase();

        tbody.innerHTML = "";

        const rows = [];

        entries.forEach((entry) => {
            rows.push({
                date: entry.date,
                personName: entry.personName,
                type: entry.type === "given"
                    ? "Money Given"
                    : "Money Borrowed",
                amount: Number(entry.amount),
                entryId: entry.id,
                note: entry.note || ""
            });

            (entry.repayments || []).forEach((payment) => {
                rows.push({
                    date: payment.date,
                    personName: entry.personName,
                    type: entry.type === "given"
                        ? "Repayment Received"
                        : "Loan Repaid",
                    amount: Number(payment.amount),
                    entryId: entry.id,
                    note: payment.note || ""
                });
            });
        });

        rows.sort((a, b) =>
            b.date.localeCompare(a.date)
        );

        const filtered = rows.filter((row) =>
            row.personName.toLowerCase().includes(query) ||
            row.type.toLowerCase().includes(query) ||
            row.note.toLowerCase().includes(query)
        );

        if (!filtered.length) {
            const tr = document.createElement("tr");
            const td = document.createElement("td");

            td.colSpan = 6;
            td.textContent = query
                ? "No matching transactions found."
                : "No transactions recorded yet.";

            tr.appendChild(td);
            tbody.appendChild(tr);
            return;
        }

        filtered.forEach((row) => {
            const tr = document.createElement("tr");
            const entry = entries.find(
                (item) => item.id === row.entryId
            );

            const values = [
                row.date,
                row.personName,
                row.type,
                money(row.amount),
                entry ? money(remaining(entry)) : "—",
                row.note || "—"
            ];

            values.forEach((value) => {
                const td = document.createElement("td");
                td.textContent = value;
                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });
    }

    function render() {
        renderSummary();
        renderRepaymentOptions();
        renderHistory();
    }

    ledgerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const type = $("entryType").value;
        const personName = $("personName").value.trim();
        const amount = Number($("entryAmount").value);
        const date = $("entryDate").value;

        if (
            !personName ||
            !date ||
            !Number.isFinite(amount) ||
            amount <= 0
        ) {
            showMessage(
                "Please enter a valid person name, amount, and date."
            );
            return;
        }

        const entry = {
            id: makeId(),
            type: type,
            personName: personName,
            personMobile: $("personMobile").value.trim(),
            amount: amount,
            date: date,
            note: $("entryNote").value.trim(),
            repayments: [],
            createdAt: new Date().toISOString()
        };

        entries.push(entry);

        if (!saveEntries()) {
            entries.pop();
            return;
        }

        ledgerForm.reset();
        $("entryDate").value = today();

        render();
        showMessage("Ledger entry saved successfully.");
    });

    repaymentForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const entryId = $("repaymentEntry").value;
        const amount = Number($("repaymentAmount").value);
        const date = $("repaymentDate").value;

        const entry = entries.find(
            (item) => item.id === entryId
        );

        if (!entry) {
            showMessage("Please select a valid ledger entry.");
            return;
        }

        if (
            !date ||
            !Number.isFinite(amount) ||
            amount <= 0
        ) {
            showMessage(
                "Please enter a valid repayment amount and date."
            );
            return;
        }

        if (amount > remaining(entry) + 0.000001) {
            showMessage(
                "Repayment cannot exceed the remaining balance. Remaining: " +
                money(remaining(entry))
            );
            return;
        }

        const payment = {
            id: makeId(),
            amount: amount,
            date: date,
            note: $("repaymentNote").value.trim(),
            createdAt: new Date().toISOString()
        };

        entry.repayments.push(payment);

        if (!saveEntries()) {
            entry.repayments.pop();
            return;
        }

        repaymentForm.reset();
        $("repaymentDate").value = today();

        render();

        showMessage(
            entry.type === "given"
                ? "Repayment received successfully."
                : "Loan repayment saved successfully."
        );
    });

    $("ledgerSearch").addEventListener(
        "input",
        renderHistory
    );

    $("entryDate").value = today();
    $("repaymentDate").value = today();

    loadEntries();
    render();

    if (!localStorage.getItem(STORAGE_KEY)) {
        showMessage("Personal Ledger is ready.");
    }
})();
