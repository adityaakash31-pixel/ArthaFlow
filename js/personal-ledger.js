
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
    let storageReady = true;

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
            storageReady = false;
            entries = [];

            showMessage(
                "Unable to read saved data. Editing and saving have been disabled to protect your existing records."
            );

            console.error("Personal Ledger load error:", error);
        }
    }

    function saveEntries() {
        if (!storageReady) {
            showMessage(
                "Saving is disabled because the existing ledger data could not be read."
            );
            return false;
        }

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

    function addCell(row, value) {
        const td = document.createElement("td");
        td.textContent = value;
        row.appendChild(td);
        return td;
    }

    function addActionButton(container, label, action, isDelete) {
        const button = document.createElement("button");

        button.type = "button";
        button.textContent = label;
        button.style.margin = "3px";
        button.style.padding = "7px 10px";
        button.style.border = "0";
        button.style.borderRadius = "6px";
        button.style.cursor = "pointer";
        button.style.color = "#fff";
        button.style.background = isDelete ? "#b91c1c" : "#1e3a8a";
        button.disabled = !storageReady;

        button.addEventListener("click", action);
        container.appendChild(button);
    }

    function editEntry(entryId) {
        if (!storageReady) return;

        const entry = entries.find((item) => item.id === entryId);
        if (!entry) {
            showMessage("Ledger entry not found.");
            return;
        }

        const name = prompt("Person Name:", entry.personName);
        if (name === null) return;

        if (!name.trim()) {
            showMessage("Person name cannot be empty.");
            return;
        }

        const amountText = prompt(
            "Original Amount (₹):",
            String(entry.amount)
        );
        if (amountText === null) return;

        const amount = Number(amountText);

        if (!Number.isFinite(amount) || amount <= 0) {
            showMessage("Please enter a valid amount.");
            return;
        }

        const paid = repaymentsTotal(entry);

        if (amount + 0.000001 < paid) {
            showMessage(
                "Original amount cannot be less than repayments already recorded (" +
                money(paid) + ")."
            );
            return;
        }

        const date = prompt("Transaction Date (YYYY-MM-DD):", entry.date);
        if (date === null) return;

        if (!/^\d{4}-\d{2}-\d{2}$/.test(date) ||
            Number.isNaN(Date.parse(date + "T00:00:00"))) {
            showMessage("Please enter a valid date in YYYY-MM-DD format.");
            return;
        }

        const note = prompt("Note:", entry.note || "");
        if (note === null) return;

        const mobile = prompt(
            "Mobile Number (optional):",
            entry.personMobile || ""
        );
        if (mobile === null) return;

        const oldEntry = { ...entry };

        entry.personName = name.trim();
        entry.amount = amount;
        entry.date = date;
        entry.note = note.trim();
        entry.personMobile = mobile.trim();

        if (!saveEntries()) {
            Object.assign(entry, oldEntry);
            return;
        }

        render();
        showMessage("Ledger entry updated successfully.");
    }

    function deleteEntry(entryId) {
        if (!storageReady) return;

        const index = entries.findIndex(
            (item) => item.id === entryId
        );

        if (index === -1) {
            showMessage("Ledger entry not found.");
            return;
        }

        const entry = entries[index];
        const paymentCount = (entry.repayments || []).length;

        const warning = paymentCount
            ? "Delete this ledger entry and all " +
              paymentCount +
              " linked repayment record(s)? This cannot be undone."
            : "Delete this ledger entry? This cannot be undone.";

        if (!confirm(warning)) return;

        const removed = entries.splice(index, 1)[0];

        if (!saveEntries()) {
            entries.splice(index, 0, removed);
            return;
        }

        render();
        showMessage(
            "Ledger entry and its linked repayments deleted successfully."
        );
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
                note: entry.note || "",
                isRepayment: false
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
                    note: payment.note || "",
                    isRepayment: true
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

            td.colSpan = 7;
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

            addCell(tr, row.date);
            addCell(tr, row.personName);
            addCell(tr, row.type);
            addCell(tr, money(row.amount));
            addCell(tr, entry ? money(remaining(entry)) : "—");
            addCell(tr, row.note || "—");

            const actionCell = document.createElement("td");

            if (!row.isRepayment) {
                addActionButton(
                    actionCell,
                    "Edit",
                    () => editEntry(row.entryId),
                    false
                );

                addActionButton(
                    actionCell,
                    "Delete",
                    () => deleteEntry(row.entryId),
                    true
                );
            } else {
                const label = document.createElement("span");
                label.textContent = "Managed with entry";
                actionCell.appendChild(label);
            }

            tr.appendChild(actionCell);
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

        if (!storageReady) return;

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

        if (!storageReady) return;

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

    if (storageReady && !localStorage.getItem(STORAGE_KEY)) {
        showMessage("Personal Ledger is ready.");
    }
})();
