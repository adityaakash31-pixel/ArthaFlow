
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

    
function pdfMoney(value) {
    const amount = Number(value || 0);

    return "INR " + amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
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

    
    // ===== PERSON-WISE DETAILS AND PDF REPORTS =====

    let selectedPersonName = "";

    function getPersonEntries(personName) {
        return entries.filter(
            entry =>
                (entry.personName || "").trim().toLowerCase() ===
                personName.trim().toLowerCase()
        );
    }

    function getPersonNames() {
        return [...new Set(
            entries
                .map(entry => (entry.personName || "").trim())
                .filter(Boolean)
        )].sort((a, b) => a.localeCompare(b));
    }

    function getPersonTotals(personName) {
        const personEntries = getPersonEntries(personName);

        let given = 0;
        let received = 0;
        let borrowed = 0;
        let repaid = 0;

        personEntries.forEach(entry => {
            const paid = repaymentsTotal(entry);

            if (entry.type === "given") {
                given += Number(entry.amount || 0);
                received += paid;
            } else {
                borrowed += Number(entry.amount || 0);
                repaid += paid;
            }
        });

        return {
            entries: personEntries,
            given,
            received,
            toReceive: Math.max(0, given - received),
            borrowed,
            repaid,
            toPay: Math.max(0, borrowed - repaid)
        };
    }

    
    function getPersonTransactions(personName) {
        const personEntries = getPersonEntries(personName);
        const rows = [];

        personEntries.forEach(entry => {
            const transactions = [{
                date: entry.date || "",
                type: entry.type === "given"
                    ? "Money Given"
                    : "Money Borrowed",
                amount: Number(entry.amount || 0),
                note: entry.note || "",
                isOriginal: true,
                order: 0
            }];

            (entry.repayments || []).forEach(payment => {
                transactions.push({
                    date: payment.date || "",
                    type: entry.type === "given"
                        ? "Repayment Received"
                        : "Loan Repaid",
                    amount: Number(payment.amount || 0),
                    note: payment.note || "",
                    isOriginal: false,
                    order: 1
                });
            });

            transactions.sort((a, b) =>
                a.date.localeCompare(b.date) || a.order - b.order
            );

            let balance = 0;

            transactions.forEach(transaction => {
                if (transaction.isOriginal) {
                    balance = transaction.amount;
                } else {
                    balance = Math.max(0, balance - transaction.amount);
                }

                rows.push({
                    date: transaction.date,
                    type: transaction.type,
                    amount: transaction.amount,
                    note: transaction.note,
                    entryId: entry.id,
                    remaining: balance
                });
            });
        });

        return rows.sort((a, b) =>
            a.date.localeCompare(b.date)
        );
    }


    function renderPeopleList() {
        const tableWrap = document.querySelector(".ledger-table-wrap");
        if (!tableWrap) return;

        let peopleBox = $("ledgerPeopleList");

        if (!peopleBox) {
            peopleBox = document.createElement("div");
            peopleBox.id = "ledgerPeopleList";
            peopleBox.style.margin = "16px 0";

            const heading = document.createElement("h3");
            heading.textContent = "People — View Individual Accounts";
            peopleBox.appendChild(heading);

            const list = document.createElement("div");
            list.id = "ledgerPeopleButtons";
            list.style.display = "flex";
            list.style.flexWrap = "wrap";
            list.style.gap = "8px";

            peopleBox.appendChild(list);
            tableWrap.parentNode.insertBefore(peopleBox, tableWrap);
        }

        const list = $("ledgerPeopleButtons");
        list.innerHTML = "";

        const names = getPersonNames();

        if (!names.length) {
            const message = document.createElement("p");
            message.textContent = "People will appear here after you add ledger entries.";
            list.appendChild(message);
            return;
        }

        names.forEach(name => {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = name;
            button.style.padding = "10px 14px";
            button.style.border = "0";
            button.style.borderRadius = "8px";
            button.style.cursor = "pointer";
            button.style.background = "#1e3a8a";
            button.style.color = "#fff";
            button.addEventListener("click", () => showPersonDetails(name));
            list.appendChild(button);
        });
    }

    function showPersonDetails(personName) {
        const section = $("personDetailsSection");
        const summary = $("personDetailsSummary");
        const history = $("personDetailsHistory");

        if (!section || !summary || !history) {
            showMessage("Person details section is missing from the HTML.");
            return;
        }

        selectedPersonName = personName;

        const totals = getPersonTotals(personName);
        const rows = getPersonTransactions(personName);

        $("personDetailsTitle").textContent =
            "Account Details: " + personName;

        summary.innerHTML = "";

        const info = [
            ["Total Money Given", money(totals.given)],
            ["Repayment Received", money(totals.received)],
            ["Still To Receive", money(totals.toReceive)],
            ["Total Money Borrowed", money(totals.borrowed)],
            ["Loan Repaid", money(totals.repaid)],
            ["Still To Pay", money(totals.toPay)]
        ];

        info.forEach(([label, value]) => {
            const item = document.createElement("p");
            const strong = document.createElement("strong");
            strong.textContent = label + ": ";
            item.appendChild(strong);
            item.appendChild(document.createTextNode(value));
            summary.appendChild(item);
        });

        history.innerHTML = "";

        const table = document.createElement("table");
        table.className = "ledger-table";

        const thead = document.createElement("thead");
        const headRow = document.createElement("tr");

        ["Date", "Transaction", "Amount", "Remaining Balance", "Note"]
            .forEach(label => {
                const th = document.createElement("th");
                th.textContent = label;
                headRow.appendChild(th);
            });

        thead.appendChild(headRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");

        if (!rows.length) {
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            td.colSpan = 5;
            td.textContent = "No transactions found.";
            tr.appendChild(td);
            tbody.appendChild(tr);
        } else {
            rows.forEach(row => {
                const tr = document.createElement("tr");

                [
                    row.date,
                    row.type,
                    money(row.amount),
                    money(row.remaining),
                    row.note || "—"
                ].forEach(value => {
                    const td = document.createElement("td");
                    td.textContent = value;
                    tr.appendChild(td);
                });

                tbody.appendChild(tr);
            });
        }

        table.appendChild(tbody);
        history.appendChild(table);

        section.style.display = "block";
        section.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function closePersonDetails() {
        const section = $("personDetailsSection");
        if (section) section.style.display = "none";
        selectedPersonName = "";
    }

    function createPDFDocument() {
        if (!window.jspdf || !window.jspdf.jsPDF) {
            showMessage("PDF library did not load. Check your internet connection and refresh the page.");
            return null;
        }

        return new window.jspdf.jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });
    }

    function addPDFLine(doc, text, state) {
        const pageHeight = doc.internal.pageSize.getHeight();
        const lines = doc.splitTextToSize(
            String(text),
            180
        );

        lines.forEach(line => {
            if (state.y > pageHeight - 15) {
                doc.addPage();
                state.y = 15;
            }

            doc.text(line, 15, state.y);
            state.y += 7;
        });
    }

    
    function drawReportHeader(doc, title, subtitle) {
        const pageWidth = doc.internal.pageSize.getWidth();

        doc.setFillColor(22, 59, 120);
        doc.rect(0, 0, pageWidth, 42, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(21);
        doc.text("ArthaFlow", 15, 15);

        doc.setFontSize(14);
        doc.text(title, 15, 25);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(subtitle, 15, 34);

        doc.setTextColor(35, 45, 65);
        return 52;
    }

    function drawSummaryCard(doc, x, y, w, label, value, rgb) {
        doc.setFillColor(rgb[0], rgb[1], rgb[2]);
        doc.roundedRect(x, y, w, 20, 2, 2, "F");

        doc.setTextColor(65, 75, 90);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text(label, x + 4, y + 7);

        doc.setTextColor(25, 40, 65);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);

        const valueLines = doc.splitTextToSize(value, w - 8);
        doc.text(valueLines[0], x + 4, y + 15);
    }

    function drawTransactionTable(doc, rows, startY) {
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 12;
        const widths = [25, 43, 28, 35, 45];
        const headers = [
            "Date",
            "Transaction",
            "Amount",
            "Balance",
            "Note"
        ];

        let y = startY;

        function drawTableHeader() {
            doc.setFillColor(37, 99, 235);
            doc.rect(margin, y, pageWidth - margin * 2, 9, "F");

            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.setTextColor(255, 255, 255);

            let x = margin;

            headers.forEach((header, i) => {
                doc.text(header, x + 2, y + 6);
                x += widths[i];
            });

            y += 9;
        }

        drawTableHeader();

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);

        rows.forEach((row, index) => {
            const noteLines = doc.splitTextToSize(
                row.note || "—",
                widths[4] - 4
            );

            const typeLines = doc.splitTextToSize(
                row.type,
                widths[1] - 4
            );

            const lineCount = Math.max(
                1,
                noteLines.length,
                typeLines.length
            );

            const rowHeight = Math.max(9, lineCount * 4 + 4);
            const pageHeight = doc.internal.pageSize.getHeight();

            if (y + rowHeight > pageHeight - 15) {
                doc.addPage();
                y = 15;
                drawTableHeader();

                doc.setFont("helvetica", "normal");
                doc.setFontSize(7.5);
            }

            if (index % 2 === 0) {
                doc.setFillColor(239, 246, 255);
                doc.rect(
                    margin,
                    y,
                    pageWidth - margin * 2,
                    rowHeight,
                    "F"
                );
            }

            doc.setDrawColor(220, 228, 239);
            doc.line(margin, y + rowHeight, pageWidth - margin, y + rowHeight);

            const values = [
                row.date || "—",
                typeLines,
                money(row.amount),
                money(row.remaining),
                noteLines
            ];

            let x = margin;

            values.forEach((value, i) => {
                if (i === 2) {
                    doc.setTextColor(29, 78, 216);
                } else if (i === 3) {
                    doc.setTextColor(
                        row.remaining > 0 ? 185 : 5,
                        row.remaining > 0 ? 28 : 120,
                        row.remaining > 0 ? 28 : 70
                    );
                } else {
                    doc.setTextColor(45, 55, 72);
                }

                const lines = Array.isArray(value) ? value : [value];

                lines.forEach((line, lineIndex) => {
                    const maxWidth = widths[i] - 4;
                    const text = doc.splitTextToSize(
                        String(line),
                        maxWidth
                    )[0];

                    doc.text(
                        text,
                        x + 2,
                        y + 5 + lineIndex * 4
                    );
                });

                x += widths[i];
            });

            y += rowHeight;
        });

        return y;
    }

    function addPageNumbers(doc) {
        const pageCount = doc.getNumberOfPages();

        for (let page = 1; page <= pageCount; page++) {
            doc.setPage(page);

            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            doc.setDrawColor(215, 225, 238);
            doc.line(12, pageHeight - 11, pageWidth - 12, pageHeight - 11);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(100, 110, 125);

            doc.text(
                "ArthaFlow Personal Ledger",
                12,
                pageHeight - 6
            );

            doc.text(
                "Page " + page + " of " + pageCount,
                pageWidth - 12,
                pageHeight - 6,
                { align: "right" }
            );
        }
    }

    function downloadPersonLedgerPDF() {
        if (!selectedPersonName) {
            showMessage("Please select a person first.");
            return;
        }

        const doc = createPDFDocument();
        if (!doc) return;

        const name = selectedPersonName;
        const totals = getPersonTotals(name);
        const rows = getPersonTransactions(name);

        let y = drawReportHeader(
            doc,
            "PERSON-WISE LEDGER",
            "Account Statement | Generated: " + today()
        );

        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(22, 59, 120);
        doc.text("Person: " + name, 12, y);

        y += 10;

        const gap = 4;
        const cardWidth = (doc.internal.pageSize.getWidth() - 24 - gap) / 2;

        drawSummaryCard(doc, 12, y, cardWidth, "MONEY GIVEN", money(totals.given), [220, 252, 231]);
        drawSummaryCard(doc, 12 + cardWidth + gap, y, cardWidth, "RECEIVED BACK", money(totals.received), [219, 234, 254]);

        y += 24;

        drawSummaryCard(doc, 12, y, cardWidth, "STILL TO RECEIVE", money(totals.toReceive), [254, 243, 199]);
        drawSummaryCard(doc, 12 + cardWidth + gap, y, cardWidth, "MONEY BORROWED", money(totals.borrowed), [237, 233, 254]);

        y += 24;

        drawSummaryCard(doc, 12, y, cardWidth, "LOAN REPAID", money(totals.repaid), [204, 251, 241]);
        drawSummaryCard(doc, 12 + cardWidth + gap, y, cardWidth, "STILL TO PAY", money(totals.toPay), [254, 226, 226]);

        y += 29;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(22, 59, 120);
        doc.text("Date-wise Transaction History", 12, y);

        y += 6;

        drawTransactionTable(doc, rows, y);
        addPageNumbers(doc);

        const safeName = name
            .replace(/[^\w -]/g, "")
            .trim()
            .replace(/\s+/g, "-") || "Person";

        doc.save("ArthaFlow-" + safeName + "-Ledger.pdf");
        showMessage("Person-wise PDF downloaded successfully.");
    }

    function downloadFullLedgerPDF() {
        const doc = createPDFDocument();
        if (!doc) return;

        let given = 0;
        let received = 0;
        let borrowed = 0;
        let repaid = 0;

        entries.forEach(entry => {
            const paid = repaymentsTotal(entry);

            if (entry.type === "given") {
                given += Number(entry.amount || 0);
                received += paid;
            } else {
                borrowed += Number(entry.amount || 0);
                repaid += paid;
            }
        });

        let y = drawReportHeader(
            doc,
            "COMPLETE LEDGER REPORT",
            "All Accounts | Generated: " + today()
        );

        const gap = 4;
        const cardWidth = (doc.internal.pageSize.getWidth() - 24 - gap) / 2;

        drawSummaryCard(doc, 12, y, cardWidth, "TOTAL MONEY GIVEN", money(given), [220, 252, 231]);
        drawSummaryCard(doc, 12 + cardWidth + gap, y, cardWidth, "RECEIVED BACK", money(received), [219, 234, 254]);

        y += 24;

        drawSummaryCard(doc, 12, y, cardWidth, "STILL TO RECEIVE", money(Math.max(0, given - received)), [254, 243, 199]);
        drawSummaryCard(doc, 12 + cardWidth + gap, y, cardWidth, "TOTAL BORROWED", money(borrowed), [237, 233, 254]);

        y += 24;

        drawSummaryCard(doc, 12, y, cardWidth, "LOAN REPAID", money(repaid), [204, 251, 241]);
        drawSummaryCard(doc, 12 + cardWidth + gap, y, cardWidth, "STILL TO PAY", money(Math.max(0, borrowed - repaid)), [254, 226, 226]);

        y += 30;

        const names = getPersonNames();

        if (!names.length) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(11);
            doc.setTextColor(70, 80, 95);
            doc.text("No ledger entries recorded.", 12, y);
        }

        names.forEach(name => {
            const totals = getPersonTotals(name);
            const rows = getPersonTransactions(name);

            if (y > doc.internal.pageSize.getHeight() - 65) {
                doc.addPage();
                y = 18;
            }

            doc.setFillColor(22, 59, 120);
            doc.roundedRect(
                12,
                y,
                doc.internal.pageSize.getWidth() - 24,
                10,
                2,
                2,
                "F"
            );

            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.setTextColor(255, 255, 255);
            doc.text("Person: " + name, 16, y + 6.5);

            y += 16;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(8.5);
            doc.setTextColor(35, 45, 65);

            doc.text(
                "Given: " + money(totals.given) +
                " | Received: " + money(totals.received) +
                " | To Receive: " + money(totals.toReceive),
                12,
                y
            );

            y += 6;

            doc.text(
                "Borrowed: " + money(totals.borrowed) +
                " | Repaid: " + money(totals.repaid) +
                " | To Pay: " + money(totals.toPay),
                12,
                y
            );

            y += 7;

            y = drawTransactionTable(doc, rows, y);
            y += 10;
        });

        addPageNumbers(doc);
        doc.save("ArthaFlow-Complete-Ledger.pdf");
        showMessage("Complete Ledger PDF downloaded successfully.");
    }


    function downloadFullLedgerPDF() {
        const doc = createPDFDocument();
        if (!doc) return;

        const state = { y: 18 };

        let given = 0;
        let received = 0;
        let borrowed = 0;
        let repaid = 0;

        entries.forEach(entry => {
            const paid = repaymentsTotal(entry);

            if (entry.type === "given") {
                given += Number(entry.amount || 0);
                received += paid;
            } else {
                borrowed += Number(entry.amount || 0);
                repaid += paid;
            }
        });

        doc.setFontSize(18);
        addPDFLine(doc, "ArthaFlow - Complete Personal Ledger", state);

        doc.setFontSize(12);
        addPDFLine(doc, "Report Generated: " + today(), state);

        state.y += 3;
        addPDFLine(doc, "OVERALL SUMMARY", state);
        addPDFLine(doc, "Total Money Given: " + money(given), state);
        addPDFLine(doc, "Repayment Received: " + money(received), state);
        addPDFLine(doc, "Still To Receive: " + money(Math.max(0, given - received)), state);
        addPDFLine(doc, "Total Money Borrowed: " + money(borrowed), state);
        addPDFLine(doc, "Loan Repaid: " + money(repaid), state);
        addPDFLine(doc, "Still To Pay: " + money(Math.max(0, borrowed - repaid)), state);

        getPersonNames().forEach(name => {
            const totals = getPersonTotals(name);
            const rows = getPersonTransactions(name);

            state.y += 4;
            addPDFLine(doc, "PERSON: " + name, state);
            addPDFLine(doc, "Given: " + money(totals.given) +
                " | Received: " + money(totals.received) +
                " | To Receive: " + money(totals.toReceive), state);
            addPDFLine(doc, "Borrowed: " + money(totals.borrowed) +
                " | Repaid: " + money(totals.repaid) +
                " | To Pay: " + money(totals.toPay), state);

            rows.forEach(row => {
                addPDFLine(
                    doc,
                    (row.date || "No date") + " | " +
                    row.type + " | " +
                    money(row.amount) + " | Remaining: " +
                    money(row.remaining) + " | " +
                    (row.note || "—"),
                    state
                );
            });
        });

        if (!entries.length) {
            addPDFLine(doc, "No ledger entries recorded.", state);
        }

        doc.save("ArthaFlow-Complete-Ledger.pdf");
    }

    // Make HTML buttons able to call these functions.
    window.downloadPersonLedgerPDF = downloadPersonLedgerPDF;
    window.downloadFullLedgerPDF = downloadFullLedgerPDF;
    window.closePersonDetails = closePersonDetails;
            

        function render() {
        renderSummary();
        renderRepaymentOptions();
        renderPeopleList();
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
