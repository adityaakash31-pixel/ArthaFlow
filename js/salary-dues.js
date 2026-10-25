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

  const id = () => `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;',
    '"': '&quot;', "'": '&#39;'
  }[c]));

  function load() {
    try {
      const d = JSON.parse(localStorage.getItem(KEY) || '{"records":[]}');

      // Supports records created by the earlier Salary Dues version.
      if (Array.isArray(d.records)) return d.records;

      if (Array.isArray(d.months)) {
        return d.months.map(m => {
          const payments = (d.payments || []).filter(p =>
            String(p.monthId) === String(m.id)
          );

          const cash = payments.reduce((s, p) => s + (Number(p.cash) || 0), 0);
          const online = payments.reduce((s, p) => s + (Number(p.online) || 0), 0);

          return {
            id: m.id || id(),
            date: (m.month || today().slice(0, 7)) + '-01',
            total: Number(m.total) || 0,
            received: cash + online,
            givenBy: m.givenBy || '',
            method: cash && online ? 'Both' : online ? 'Online' : 'Cash',
            cash,
            online,
            note: m.note || ''
          };
        });
      }

      return [];
    } catch (e) {
      console.error('Could not load Salary Dues records:', e);
      return [];
    }
  }

  let records = load();
  let editingId = '';

  function save() {
    localStorage.setItem(KEY, JSON.stringify({ records }));
  }

  function remaining(r) {
    return (Number(r.total) || 0) - (Number(r.received) || 0);
  }

  function filteredRecords() {
    const from = $('duesFrom').value;
    const to = $('duesTo').value;

    return [...records]
      .filter(r => (!from || r.date >= from) && (!to || r.date <= to))
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  function refreshTotals() {
    const list = filteredRecords();

    $('duesTotalSalary').textContent =
      money(list.reduce((s, r) => s + Number(r.total || 0), 0));

    $('duesTotalReceived').textContent =
      money(list.reduce((s, r) => s + Number(r.received || 0), 0));

    $('duesTotalRemaining').textContent =
      money(list.reduce((s, r) => s + remaining(r), 0));
  }

  function updateRemaining() {
    const total = Number($('duesTotal').value) || 0;
    const received = Number($('duesReceived').value) || 0;

    $('duesRemaining').value = (total - received).toFixed(2);
  }

  function updateMethodFields() {
    const method = $('duesMethod').value;

    $('duesCashBox').classList.toggle(
      'hidden', method !== 'Both' && method !== 'Cash'
    );

    $('duesOnlineBox').classList.toggle(
      'hidden', method !== 'Both' && method !== 'Online'
    );

    if (method === 'Cash') {
      $('duesCash').value = $('duesReceived').value || '0';
      $('duesOnline').value = '0';
    } else if (method === 'Online') {
      $('duesOnline').value = $('duesReceived').value || '0';
      $('duesCash').value = '0';
    } else {
      $('duesCash').value = '0';
      $('duesOnline').value = '0';
    }
  }

  function render() {
    refreshTotals();

    const list = filteredRecords();

    $('salaryDuesHistory').innerHTML = list.length ? list.map(r => `
      <article class="record">
        <div class="record-top">
          <div class="record-title">${esc(r.date)} • ${esc(r.method)}</div>
          <div class="record-amount">${money(r.total)}</div>
        </div>

        <div class="record-meta">
          <strong>Date:</strong> ${esc(r.date)}<br>
          <strong>Salary / Amount:</strong> ${money(r.total)}<br>
          <strong>Received:</strong> ${money(r.received)}<br>
          <strong>Remaining:</strong> ${money(remaining(r))}<br>
          <strong>Given By:</strong> ${esc(r.givenBy || '—')}<br>
          <strong>Method:</strong> ${esc(r.method)}<br>
          ${r.method === 'Both' || r.method === 'Cash'
            ? '<strong>Cash:</strong> ' + money(r.cash) + '<br>' : ''}
          ${r.method === 'Both' || r.method === 'Online'
            ? '<strong>Online:</strong> ' + money(r.online) + '<br>' : ''}
          ${r.note ? '<strong>Notes:</strong> ' + esc(r.note) : ''}
        </div>

        <div class="record-actions">
          <button type="button" class="light" data-dues-edit="${esc(r.id)}">
            ✏️ Edit
          </button>
          <button type="button" class="danger" data-dues-delete="${esc(r.id)}">
            🗑 Delete
          </button>
        </div>
      </article>
    `).join('') : '<div class="empty">No salary records found.</div>';
  }

  function resetForm() {
    $('salaryDuesForm').reset();
    $('duesDate').value = today();
    $('duesReceived').value = '0';
    $('duesCash').value = '0';
    $('duesOnline').value = '0';
    $('duesMethod').value = 'Cash';

    editingId = '';
    $('duesFormTitle').textContent = 'Add Salary Record';
    $('duesSaveBtn').textContent = 'Save Salary Record';
    $('duesCancelEdit').classList.add('hidden');

    updateMethodFields();
    updateRemaining();
  }

  $('duesTotal').addEventListener('input', updateRemaining);

  $('duesReceived').addEventListener('input', () => {
    updateRemaining();

    if ($('duesMethod').value === 'Cash') {
      $('duesCash').value = $('duesReceived').value || '0';
    } else if ($('duesMethod').value === 'Online') {
      $('duesOnline').value = $('duesReceived').value || '0';
    }
  });

  $('duesMethod').addEventListener('change', updateMethodFields);

  ['duesCash', 'duesOnline'].forEach(field => {
    $(field).addEventListener('input', () => {
      const method = $('duesMethod').value;

      if (method === 'Both') {
        const total = (Number($('duesCash').value) || 0) +
          (Number($('duesOnline').value) || 0);

        $('duesReceived').value = total.toFixed(2);
        updateRemaining();
      } else if (method === 'Cash') {
        $('duesReceived').value = $('duesCash').value || '0';
        updateRemaining();
      } else if (method === 'Online') {
        $('duesReceived').value = $('duesOnline').value || '0';
        updateRemaining();
      }
    });
  });

  $('salaryDuesForm').addEventListener('submit', e => {
    e.preventDefault();

    const date = $('duesDate').value;
    const total = Number($('duesTotal').value);
    const received = Number($('duesReceived').value);
    const method = $('duesMethod').value;
    const cash = Number($('duesCash').value) || 0;
    const online = Number($('duesOnline').value) || 0;

    if (!date || !Number.isFinite(total) || total <= 0 ||
        !Number.isFinite(received) || received < 0) {
      alert('Please enter a valid Date, Salary / Amount and Received amount.');
      return;
    }

    if (method === 'Both' && Math.abs(cash + online - received) > 0.01) {
      alert('Cash Amount + Online Amount must equal Received.');
      return;
    }

    if (method === 'Cash' && Math.abs(cash - received) > 0.01) {
      alert('Cash Amount must equal Received.');
      return;
    }

    if (method === 'Online' && Math.abs(online - received) > 0.01) {
      alert('Online Amount must equal Received.');
      return;
    }

    const record = {
      id: editingId || id(),
      date,
      total,
      received,
      givenBy: $('duesGivenBy').value.trim(),
      method,
      cash: method === 'Online' ? 0 : cash,
      online: method === 'Cash' ? 0 : online,
      note: $('duesNote').value.trim()
    };

    if (editingId) {
      records = records.map(r => r.id === editingId ? record : r);
    } else {
      records.push(record);
    }

    save();
    resetForm();
    render();
    alert('Salary record saved successfully.');
  });

  $('duesCancelEdit').addEventListener('click', resetForm);

  $('duesFrom').addEventListener('change', render);
  $('duesTo').addEventListener('change', render);

  $('salaryDuesHistory').addEventListener('click', e => {
    const editBtn = e.target.closest('[data-dues-edit]');
    const deleteBtn = e.target.closest('[data-dues-delete]');

    if (editBtn) {
      const r = records.find(x => x.id === editBtn.dataset.duesEdit);
      if (!r) return;

      editingId = r.id;
      $('duesDate').value = r.date;
      $('duesTotal').value = r.total;
      $('duesReceived').value = r.received;
      $('duesGivenBy').value = r.givenBy || '';
      $('duesMethod').value = r.method || 'Cash';
      $('duesCash').value = r.cash || 0;
      $('duesOnline').value = r.online || 0;
      $('duesNote').value = r.note || '';

      $('duesFormTitle').textContent = 'Edit Salary Record';
      $('duesSaveBtn').textContent = 'Update Salary Record';
      $('duesCancelEdit').classList.remove('hidden');

      updateMethodFields();
      updateRemaining();
      $('salaryDuesForm').scrollIntoView({ behavior: 'smooth' });
    }

    if (deleteBtn) {
      const record = records.find(x => x.id === deleteBtn.dataset.duesDelete);
      if (!record) return;

      if (!confirm('Delete this salary record? This cannot be undone.')) return;

      records = records.filter(x => x.id !== record.id);
      save();
      render();
    }
  });

  function reportHtml(list) {
    const total = list.reduce((s, r) => s + Number(r.total || 0), 0);
    const received = list.reduce((s, r) => s + Number(r.received || 0), 0);
    const remaining = total - received;

    const rows = list.map(r => `
      <tr>
        <td>${esc(r.date)}</td>
        <td>${money(r.total)}</td>
        <td>${money(r.received)}</td>
        <td>${money(remainingForReport(r))}</td>
        <td>${esc(r.givenBy || '—')}</td>
        <td>${esc(r.method)}</td>
        <td>${money(r.cash)}</td>
        <td>${money(r.online)}</td>
      </tr>
    `).join('');

    function remainingForReport(r) {
      return Number(r.total || 0) - Number(r.received || 0);
    }

    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>ArthaFlow Salary Dues Report</title>
<style>
  body{font-family:Arial,sans-serif;margin:25px;color:#172033}
  h1{color:#1e3a8a;margin-bottom:5px}
  p{color:#64748b}
  .summary{display:flex;gap:12px;margin:24px 0;flex-wrap:wrap}
  .box{flex:1;min-width:160px;padding:18px;border-radius:10px;color:white}
  .blue{background:#1d4ed8}.green{background:#15803d}.orange{background:#c2410c}
  .label{font-size:12px;text-transform:uppercase}
  .amount{font-size:23px;font-weight:bold;margin-top:8px}
  table{width:100%;border-collapse:collapse;margin-top:20px;font-size:12px}
  th{background:#1e3a8a;color:white}
  th,td{padding:9px;border:1px solid #dbe3ef;text-align:left}
  tbody tr:nth-child(even){background:#eff6ff}
  @media print{
    body{margin:10mm}
    .box,th{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  }
</style>
</head>
<body>
  <h1>ArthaFlow — Salary Dues Report</h1>
  <p>Salary / Amount • Received • Remaining • Payment Method</p>

  <div class="summary">
    <div class="box blue">
      <div class="label">Total Amount</div>
      <div class="amount">${money(total)}</div>
    </div>
    <div class="box green">
      <div class="label">Total Received</div>
      <div class="amount">${money(received)}</div>
    </div>
    <div class="box orange">
      <div class="label">Total Remaining</div>
      <div class="amount">${money(remaining)}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Date</th><th>Salary / Amount</th><th>Received</th>
        <th>Remaining</th><th>Given By</th><th>Method</th>
        <th>Cash</th><th>Online</th>
      </tr>
    </thead>
    <tbody>${rows || '<tr><td colspan="8">No records found.</td></tr>'}</tbody>
  </table>

  <p>Generated by ArthaFlow.</p>
  <script>window.onload=()=>setTimeout(()=>window.print(),300);<\/script>
</body>
</html>`;
  }

  $('duesExportPdf').addEventListener('click', () => {
    const list = filteredRecords();

    if (!list.length) {
      alert('No records available for the selected date range.');
      return;
    }

    const w = window.open('', '_blank');

    if (!w) {
      alert('Please allow pop-ups for this website to export the report.');
      return;
    }

    w.document.open();
    w.document.write(reportHtml(list));
    w.document.close();
  });

  $('duesDate').value = today();
  updateMethodFields();
  updateRemaining();
  render();
})();
