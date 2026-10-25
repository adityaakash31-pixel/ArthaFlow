(() => {
  'use strict';

  const KEY = 'arthaflow_salary_dues_ledger_v1';
  const $ = id => document.getElementById(id);

  const money = n => '₹' + (Number(n) || 0).toLocaleString('en-IN', {
    maximumFractionDigits: 2
  });

  const today = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const makeId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

  function loadData() {
    try {
      const data = JSON.parse(localStorage.getItem(KEY) || '{"months":[],"payments":[]}');
      return {
        months: Array.isArray(data.months) ? data.months : [],
        payments: Array.isArray(data.payments) ? data.payments : []
      };
    } catch (e) {
      console.error('Salary dues data could not be read:', e);
      return { months: [], payments: [] };
    }
  }

  let data = loadData();
  let editingMonthId = '';
  let editingPaymentId = '';

  function saveData() {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function paymentsFor(monthId) {
    return data.payments.filter(p => String(p.monthId) === String(monthId));
  }

  function receivedFor(monthId) {
    return paymentsFor(monthId).reduce(
      (total, p) => total + (Number(p.cash) || 0) + (Number(p.online) || 0), 0
    );
  }

  function remainingFor(month) {
    return (Number(month.total) || 0) - receivedFor(month.id);
  }

  function monthName(value) {
    if (!value || !/^\d{4}-\d{2}$/.test(value)) return value || '';
    const [year, month] = value.split('-').map(Number);
    return new Date(year, month - 1, 1).toLocaleDateString('en-IN', {
      month: 'long', year: 'numeric'
    });
  }

  function sortedMonths() {
    return [...data.months].sort((a, b) => b.month.localeCompare(a.month));
  }

  function getFilteredMonths() {
    const from = $('duesFrom').value;
    const to = $('duesTo').value;

    return sortedMonths().filter(m =>
      (!from || m.month >= from) && (!to || m.month <= to)
    );
  }

  function refreshTotals() {
    const totalSalary = data.months.reduce((s, m) => s + (Number(m.total) || 0), 0);
    const totalReceived = data.payments.reduce(
      (s, p) => s + (Number(p.cash) || 0) + (Number(p.online) || 0), 0
    );
    const totalRemaining = totalSalary - totalReceived;

    $('duesTotalSalary').textContent = money(totalSalary);
    $('duesTotalReceived').textContent = money(totalReceived);
    $('duesTotalRemaining').textContent = money(totalRemaining);
    $('duesTotalRemaining').style.color = totalRemaining > 0 ? '#b45309' : '#15803d';
  }

  function refreshPaymentMonthOptions() {
    const select = $('duesPaymentMonth');
    const previous = select.value;

    select.innerHTML = '<option value="">Select salary month</option>';

    sortedMonths().forEach(m => {
      const option = document.createElement('option');
      option.value = m.id;
      option.textContent = `${monthName(m.month)} — Due ${money(remainingFor(m))}`;
      select.appendChild(option);
    });

    if (data.months.some(m => String(m.id) === String(previous))) {
      select.value = previous;
    } else if (editingPaymentId) {
      const p = data.payments.find(x => String(x.id) === String(editingPaymentId));
      if (p) select.value = p.monthId;
    }
  }

  function renderHistory() {
    const months = getFilteredMonths();

    if (!months.length) {
      $('salaryDuesHistory').innerHTML =
        '<div class="empty">No salary records in this month range.</div>';
      return;
    }

    $('salaryDuesHistory').innerHTML = months.map(month => {
      const payments = paymentsFor(month.id).sort((a, b) =>
        String(a.date).localeCompare(String(b.date))
      );
      const received = receivedFor(month.id);
      const remaining = remainingFor(month);
      const overpaid = remaining < 0;

      const paymentRows = payments.length ? payments.map(p => `
        <article class="record">
          <div class="record-top">
            <div class="record-title">💸 Payment • ${esc(p.date)}</div>
            <div class="record-amount">${money((Number(p.cash) || 0) + (Number(p.online) || 0))}</div>
          </div>
          <div class="record-meta">
            Cash: ${money(p.cash)} • Online: ${money(p.online)}
            ${p.givenBy ? '<br>Given By: ' + esc(p.givenBy) : ''}
            ${p.note ? '<br>Note: ' + esc(p.note) : ''}
          </div>
          <div class="record-actions">
            <button type="button" class="light" data-dues-edit-payment="${esc(p.id)}">✏️ Edit Payment</button>
            <button type="button" class="danger" data-dues-delete-payment="${esc(p.id)}">🗑 Delete Payment</button>
          </div>
        </article>
      `).join('') : '<div class="empty">No payments recorded for this month.</div>';

      return `
        <article class="record" style="border-left:5px solid ${overpaid ? '#dc2626' : remaining > 0 ? '#f59e0b' : '#16a34a'}">
          <div class="record-top">
            <div class="record-title">📅 ${esc(monthName(month.month))}</div>
            <div class="record-amount">${money(month.total)}</div>
          </div>
          <div class="record-meta">
            <strong>Total Salary:</strong> ${money(month.total)}<br>
            <strong>Received:</strong> ${money(received)}<br>
            <strong>Remaining:</strong> ${money(remaining)}
            ${month.givenBy ? '<br><strong>Salary From:</strong> ' + esc(month.givenBy) : ''}
            ${month.note ? '<br><strong>Note:</strong> ' + esc(month.note) : ''}
            ${overpaid ? '<br><strong>Warning:</strong> Payments exceed the recorded salary.' : ''}
          </div>
          <div class="record-actions">
            <button type="button" class="light" data-dues-add-payment="${esc(month.id)}">➕ Add Payment</button>
            <button type="button" class="light" data-dues-edit-month="${esc(month.id)}">✏️ Edit Salary</button>
            <button type="button" class="danger" data-dues-delete-month="${esc(month.id)}">🗑 Delete Month</button>
          </div>
          <h3 style="margin-top:16px">Payment Details</h3>
          ${paymentRows}
        </article>
      `;
    }).join('');
  }

  function refresh() {
    refreshTotals();
    refreshPaymentMonthOptions();
    renderHistory();
  }

  function resetMonthForm() {
    $('salaryDuesForm').reset();
    $('duesMonth').value = today().slice(0, 7);
    editingMonthId = '';
    $('duesSaveBtn').textContent = '➕ Save Monthly Salary';
    $('duesCancelEdit').classList.add('hidden');
  }

  function resetPaymentForm() {
    $('duesPaymentForm').reset();
    $('duesPaymentDate').value = today();
    $('duesPaymentCash').value = '0';
    $('duesPaymentOnline').value = '0';
    editingPaymentId = '';
    $('duesPaymentSaveBtn').textContent = '💾 Save Payment';
    $('duesPaymentCancelEdit').classList.add('hidden');
    refreshPaymentMonthOptions();
  }

  $('salaryDuesForm').addEventListener('submit', e => {
    e.preventDefault();

    const month = $('duesMonth').value;
    const total = Number($('duesTotal').value);

    if (!month || !Number.isFinite(total) || total <= 0) {
      alert('Enter a valid month and salary amount.');
      return;
    }

    const duplicate = data.months.find(m =>
      m.month === month && String(m.id) !== String(editingMonthId)
    );

    if (duplicate) {
      alert('This month already has a salary record. Edit that record instead.');
      return;
    }

    const old = data.months.find(m => String(m.id) === String(editingMonthId));

    if (old) {
      const alreadyReceived = receivedFor(old.id);
      if (total < alreadyReceived) {
        const proceed = confirm(
          `Payments already total ${money(alreadyReceived)}, which is more than this new salary. Save anyway?`
        );
        if (!proceed) return;
      }
    }

    const record = {
      id: editingMonthId || makeId(),
      month,
      total,
      givenBy: $('duesGivenBy').value.trim(),
      note: $('duesNote').value.trim()
    };

    if (editingMonthId) {
      data.months = data.months.map(m =>
        String(m.id) === String(editingMonthId) ? record : m
      );
    } else {
      data.months.push(record);
    }

    saveData();
    resetMonthForm();
    refresh();
    alert('Monthly salary record saved.');
  });

  $('duesPaymentForm').addEventListener('submit', e => {
    e.preventDefault();

    const monthId = $('duesPaymentMonth').value;
    const date = $('duesPaymentDate').value;
    const cash = Number($('duesPaymentCash').value);
    const online = Number($('duesPaymentOnline').value);

    if (!data.months.some(m => String(m.id) === String(monthId))) {
      alert('Select a salary month first.');
      return;
    }

    if (!date || !Number.isFinite(cash) || !Number.isFinite(online) ||
        cash < 0 || online < 0 || cash + online <= 0) {
      alert('Enter a valid date and a positive Cash/Online payment amount.');
      return;
    }

    const record = {
      id: editingPaymentId || makeId(),
      monthId,
      date,
      cash,
      online,
      givenBy: $('duesPaymentGivenBy').value.trim(),
      note: $('duesPaymentNote').value.trim()
    };

    if (editingPaymentId) {
      data.payments = data.payments.map(p =>
        String(p.id) === String(editingPaymentId) ? record : p
      );
    } else {
      data.payments.push(record);
    }

    saveData();
    resetPaymentForm();
    refresh();
    alert('Salary payment saved.');
  });

  $('duesCancelEdit').addEventListener('click', resetMonthForm);
  $('duesPaymentCancelEdit').addEventListener('click', resetPaymentForm);
  $('duesFrom').addEventListener('change', renderHistory);
  $('duesTo').addEventListener('change', renderHistory);

  $('salaryDuesHistory').addEventListener('click', e => {
    const addPayment = e.target.closest('[data-dues-add-payment]');
    if (addPayment) {
      resetPaymentForm();
      $('duesPaymentMonth').value = addPayment.dataset.duesAddPayment;
      $('duesPaymentDate').value = today();
      $('duesPaymentGivenBy').focus();
      $('duesPaymentForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    const editMonth = e.target.closest('[data-dues-edit-month]');
    if (editMonth) {
      const m = data.months.find(x => String(x.id) === editMonth.dataset.duesEditMonth);
      if (!m) return;
      editingMonthId = m.id;
      $('duesMonth').value = m.month;
      $('duesTotal').value = m.total;
      $('duesGivenBy').value = m.givenBy || '';
      $('duesNote').value = m.note || '';
      $('duesSaveBtn').textContent = '💾 Update Monthly Salary';
      $('duesCancelEdit').classList.remove('hidden');
      $('salaryDuesForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    const editPayment = e.target.closest('[data-dues-edit-payment]');
    if (editPayment) {
      const p = data.payments.find(x => String(x.id) === editPayment.dataset.duesEditPayment);
      if (!p) return;
      editingPaymentId = p.id;
      refreshPaymentMonthOptions();
      $('duesPaymentMonth').value = p.monthId;
      $('duesPaymentDate').value = p.date || today();
      $('duesPaymentCash').value = p.cash || 0;
      $('duesPaymentOnline').value = p.online || 0;
      $('duesPaymentGivenBy').value = p.givenBy || '';
      $('duesPaymentNote').value = p.note || '';
      $('duesPaymentSaveBtn').textContent = '💾 Update Payment';
      $('duesPaymentCancelEdit').classList.remove('hidden');
      $('duesPaymentForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    const deletePayment = e.target.closest('[data-dues-delete-payment]');
    if (deletePayment) {
      if (!confirm('Delete this payment record?')) return;
      data.payments = data.payments.filter(p =>
        String(p.id) !== deletePayment.dataset.duesDeletePayment
      );
      saveData();
      refresh();
      return;
    }

    const deleteMonth = e.target.closest('[data-dues-delete-month]');
    if (deleteMonth) {
      const id = deleteMonth.dataset.duesDeleteMonth;
      const count = paymentsFor(id).length;
      if (!confirm(`Delete this salary month and its ${count} payment record(s)? This cannot be undone.`)) return;
      data.months = data.months.filter(m => String(m.id) !== id);
      data.payments = data.payments.filter(p => String(p.monthId) !== id);
      saveData();
      refresh();
    }
  });

  function makeReportHtml(months) {
    const totalSalary = months.reduce((s, m) => s + (Number(m.total) || 0), 0);
    const totalReceived = months.reduce((s, m) => s + receivedFor(m.id), 0);
    const totalRemaining = totalSalary - totalReceived;

    const rows = months.map(m => `
      <tr>
        <td>${esc(monthName(m.month))}</td>
        <td>${esc(m.givenBy || '—')}</td>
        <td class="num">${money(m.total)}</td>
        <td class="num">${money(receivedFor(m.id))}</td>
        <td class="num">${money(remainingFor(m))}</td>
      </tr>
    `).join('');

    const paymentRows = months.flatMap(m =>
      paymentsFor(m.id).map(p => ({
        month: monthName(m.month),
        ...p
      }))
    ).sort((a, b) => String(a.date).localeCompare(String(b.date))).map(p => `
      <tr>
        <td>${esc(p.month)}</td>
        <td>${esc(p.date)}</td>
        <td>${esc(p.givenBy || '—')}</td>
        <td class="num">${money(p.cash)}</td>
        <td class="num">${money(p.online)}</td>
        <td class="num">${money((Number(p.cash) || 0) + (Number(p.online) || 0))}</td>
        <td>${esc(p.note || '—')}</td>
      </tr>
    `).join('');

    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Salary Dues Report</title>
<style>
  body{font-family:Arial,sans-serif;color:#172033;margin:24px}
  h1{color:#1e3a8a;margin-bottom:4px}
  .subtitle{color:#64748b;margin-top:0}
  .summary{display:flex;gap:12px;flex-wrap:wrap;margin:20px 0}
  .stat{flex:1;min-width:150px;padding:14px;border-radius:10px;color:#fff}
  .blue{background:#1e40af}.green{background:#15803d}.orange{background:#c2410c}
  .label{font-size:12px;text-transform:uppercase;letter-spacing:.5px}
  .value{font-size:21px;font-weight:bold;margin-top:7px}
  h2{margin-top:26px;color:#1e3a8a}
  table{width:100%;border-collapse:collapse;margin:12px 0 22px;font-size:12px}
  th{background:#1e3a8a;color:white;text-align:left}
  th,td{border:1px solid #dbe3ef;padding:8px}
  tbody tr:nth-child(even){background:#f1f5f9}
  .num{text-align:right;white-space:nowrap}
  .footer{margin-top:25px;color:#64748b;font-size:11px}
  @media print{body{margin:10mm}.no-print{display:none}.stat{-webkit-print-color-adjust:exact;print-color-adjust:exact}th,.blue,.green,.orange{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style>
</head>
<body>
  <h1>ArthaFlow — Salary Dues Report</h1>
  <p class="subtitle">Month-wise salary, received payments and outstanding dues</p>
  <div class="summary">
    <div class="stat blue"><div class="label">Total Salary</div><div class="value">${money(totalSalary)}</div></div>
    <div class="stat green"><div class="label">Total Received</div><div class="value">${money(totalReceived)}</div></div>
    <div class="stat orange"><div class="label">Total Remaining</div><div class="value">${money(totalRemaining)}</div></div>
  </div>
  <h2>Monthly Summary</h2>
  <table><thead><tr><th>Month</th><th>Salary From</th><th>Total Salary</th><th>Received</th><th>Remaining</th></tr></thead>
  <tbody>${rows || '<tr><td colspan="5">No records in this range.</td></tr>'}</tbody></table>
  <h2>Payment Details</h2>
  <table><thead><tr><th>Salary Month</th><th>Payment Date</th><th>Given By</th><th>Cash</th><th>Online</th><th>Total</th><th>Notes</th></tr></thead>
  <tbody>${paymentRows || '<tr><td colspan="7">No payments recorded.</td></tr>'}</tbody></table>
  <p class="footer">Generated from ArthaFlow. Please verify amounts before sharing.</p>
  <button class="no-print" onclick="window.print()">Print / Save as PDF</button>
  <script>window.onload=()=>setTimeout(()=>window.print(),300);<\/script>
</body></html>`;
  }

  $('duesExportPdf').addEventListener('click', () => {
    const months = getFilteredMonths();
    if (!months.length) {
      alert('There are no salary records in the selected month range.');
      return;
    }

    const reportWindow = window.open('', '_blank');
    if (!reportWindow) {
      alert('The report window was blocked. Allow pop-ups for this site, then try again.');
      return;
    }

    reportWindow.document.open();
    reportWindow.document.write(makeReportHtml(months));
    reportWindow.document.close();
  });

  $('duesMonth').value = today().slice(0, 7);
  $('duesPaymentDate').value = today();
  refresh();
})();
