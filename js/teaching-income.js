(() => {
'use strict';

// Original storage keys are retained to protect existing records.
const KEYS = {
  teaching: 'arthaflow_teaching_records',
  copy: 'arthaflow_copy_records',
  salary: 'arthaflow_salary_records',
  monthlySalary: 'arthaflow_monthly_salary',
  salaryMode: 'arthaflow_salary_mode',
  selectedTab: 'arthaflow_teaching_selected_tab'
};

const $ = id => document.getElementById(id);

const money = n => '₹' + (Number(n) || 0).toLocaleString('en-IN', {
  maximumFractionDigits: 2
});

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};

const newId = () => `${Date.now()}_${Math.random().toString(36).slice(2,9)}`;
const monthKey = d => String(d || '').slice(0,7);
const yearKey = d => String(d || '').slice(0,4);

const read = k => {
  try {
    const x = JSON.parse(localStorage.getItem(k) || '[]');
    return Array.isArray(x) ? x : [];
  } catch(e) {
    console.error('Could not read', k, e);
    return [];
  }
};

const write = (k,v) => localStorage.setItem(k,JSON.stringify(v));

const esc = s => String(s ?? '').replace(/[&<>"']/g,c => ({
  '&':'&amp;',
  '<':'&lt;',
  '>':'&gt;',
  '"':'&quot;',
  "'":'&#39;'
}[c]));

let teaching = read(KEYS.teaching);
let copies = read(KEYS.copy);
let salaries = read(KEYS.salary);

let monthlySalary = Number(localStorage.getItem(KEYS.monthlySalary)) || 0;
let salaryMode = localStorage.getItem(KEYS.salaryMode) || 'period';
let view = 'month';

function persist() {
  write(KEYS.teaching, teaching);
  write(KEYS.copy, copies);
  write(KEYS.salary, salaries);

  localStorage.setItem(KEYS.monthlySalary, String(monthlySalary));
  localStorage.setItem(KEYS.salaryMode, salaryMode);
}

function sum(list, field = 'total') {
  return list.reduce((s,r) => s + (Number(r[field]) || 0), 0);
}

function periodMatch(r) {
  const d = String(r.date || '');

  if (view === 'total') return true;

  if (view === 'year') {
    return yearKey(d) === $('periodYear').value;
  }

  return monthKey(d) === $('periodMonth').value;
}

function earnedSalary() {
  if (salaryMode === 'period') {
    return sum(teaching.filter(periodMatch));
  }

  if (view === 'month') {
    return monthlySalary;
  }

  if (view === 'year') {
    const y = $('periodYear').value;

    const months = new Set(
      [...teaching, ...copies, ...salaries]
        .filter(r => yearKey(r.date) === y)
        .map(r => monthKey(r.date))
    );

    return monthlySalary * Math.max(
      months.size,
      (monthlySalary && y === today().slice(0,4)) ? 1 : 0
    );
  }

  const months = new Set(
    [...teaching, ...copies, ...salaries]
      .map(r => monthKey(r.date))
      .filter(Boolean)
  );

  return monthlySalary * Math.max(
    months.size,
    monthlySalary ? 1 : 0
  );
}

function periodName() {
  if (view === 'total') return 'All available history';

  if (view === 'year') {
    return 'Year ' + $('periodYear').value;
  }

  const [y,m] = $('periodMonth').value.split('-');

  return new Date(Number(y),Number(m)-1,1)
    .toLocaleDateString('en-IN',{
      month:'long',
      year:'numeric'
    });
}

function renderBreakdown() {
  let months = [
    ...new Set(
      [...teaching,...copies,...salaries]
        .map(r => monthKey(r.date))
        .filter(Boolean)
    )
  ].sort().reverse();

  if (view === 'month') {
    months = months.filter(m => m === $('periodMonth').value);
  }

  if (view === 'year') {
    months = months.filter(m => m.startsWith($('periodYear').value));
  }

  if (
    view === 'month' &&
    salaryMode === 'fixed' &&
    monthlySalary &&
    !months.includes($('periodMonth').value)
  ) {
    months.unshift($('periodMonth').value);
  }

  if (!months.length) {
    $('periodBreakdown').innerHTML =
      '<div class="empty">No records for this period yet.</div>';
    return;
  }

  const rows = months.map(m => {
    const t = sum(teaching.filter(r => monthKey(r.date) === m));
    const c = sum(copies.filter(r => monthKey(r.date) === m));

    const rec = sum(
      salaries.filter(r => monthKey(r.date) === m),
      'amount'
    );

    const earned = salaryMode === 'period' ? t : monthlySalary;
    const due = Math.max(0,earned-rec);
    const pct = earned ? Math.min(100,rec/earned*100) : 0;

    return `<tr>
      <td>${esc(m)}</td>
      <td>${money(t)}</td>
      <td>${money(c)}</td>
      <td>${money(t+c)}</td>
      <td>${money(rec)}</td>
      <td>${money(due)}</td>
      <td>${pct.toFixed(1)}%</td>
    </tr>`;
  }).join('');

  $('periodBreakdown').innerHTML = `
    <div style="overflow-x:auto">
      <table class="breakdown">
        <thead>
          <tr>
            <th>Month</th>
            <th>Teaching</th>
            <th>Copy</th>
            <th>Total Earn.</th>
            <th>Received</th>
            <th>Due</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function renderRates() {
  const list = teaching.filter(periodMatch);

  const rates = [
    150,200,225,
    ...new Set(
      list.map(r => Number(r.rate))
        .filter(n => n > 0 && ![150,200,225].includes(n))
    )
  ];

  if (!list.length) {
    $('rateSummary').innerHTML =
      '<div class="empty">No teaching entries for this period.</div>';
    return;
  }

  const rows = rates.map(rate => {
    const records = list.filter(r => Number(r.rate) === rate);

    return `<tr>
      <td>${money(rate)}${[150,200,225].includes(rate) ? '' : ' (Custom)'}</td>
      <td>${sum(records,'count')}</td>
      <td>${money(sum(records))}</td>
    </tr>`;
  }).join('');

  $('rateSummary').innerHTML = `
    <div style="overflow-x:auto">
      <table class="breakdown">
        <thead>
          <tr><th>Rate / Period</th><th>Periods</th><th>Earning</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function refreshSummary() {
  const t = sum(teaching.filter(periodMatch));
  const c = sum(copies.filter(periodMatch));
  const rec = sum(salaries.filter(periodMatch),'amount');

  const earned = earnedSalary();
  const due = Math.max(0,earned-rec);
  const pct = earned ? Math.min(100,rec/earned*100) : 0;

  $('teachingTotal').textContent = money(t);
  $('copyTotal').textContent = money(c);
  $('totalEarning').textContent = money(t+c);
  $('salaryReceivedTotal').textContent = money(rec);
  $('totalDues').textContent = money(due);
  $('receivedPercent').textContent = pct.toFixed(1)+'%';

  $('periodLabel').textContent =
    `Showing: ${periodName()} • Salary mode: ${
      salaryMode === 'period' ? 'Period-Wise' : 'Fixed Monthly'
    }`;

  $('monthlySalary').value = monthlySalary || '';
  $('salaryMode').value = salaryMode;

  $('fixedSalaryBox').classList.toggle(
    'hidden',salaryMode !== 'fixed'
  );

  $('periodSalaryInfo').classList.toggle(
    'hidden',salaryMode !== 'period'
  );

  document.querySelectorAll('[data-view]').forEach(b => {
    b.classList.toggle('active',b.dataset.view === view);
  });

  renderBreakdown();
  renderRates();
}

function card(type,r) {
  let title,amount,detail;

  if (type === 'teaching') {
    title = 'Teaching • ' + (r.className || 'Class not specified');
    amount = r.total;

    detail = `${r.date || ''} • ${r.timing || 'Timing not specified'}
${r.count || 0} period(s) × ${money(r.rate)}${r.note ? '\n'+r.note : ''}`;

  } else if (type === 'copy') {
    title = 'Copy Checking • ' + (r.className || 'Class not specified');
    amount = r.total;

    detail = `${r.date || ''} • ${r.count || 0} copy/set(s) × ${money(r.rate)}${r.note ? '\n'+r.note : ''}`;

  } else {
    title = 'Salary Payment';
    amount = r.amount;
    detail = `${r.date || ''}${r.note ? '\n'+r.note : ''}`;
  }

  return `<article class="record">
    <div class="record-top">
      <div class="record-title">${esc(title)}</div>
      <div class="record-amount">${money(amount)}</div>
    </div>
    <div class="record-meta">${esc(detail)}</div>
    <div class="record-actions">
      <button type="button" class="light"
        data-edit="${type}" data-id="${esc(r.id)}">✏️ Edit</button>
      <button type="button" class="danger"
        data-delete="${type}" data-id="${esc(r.id)}">🗑 Delete</button>
    </div>
  </article>`;
}

function renderHistory() {
  const filter = $('historyFilter').value;
  let all = [];

  if (filter === 'all' || filter === 'teaching') {
    all.push(...teaching.map(r => ({t:'teaching',r})));
  }

  if (filter === 'all' || filter === 'copy') {
    all.push(...copies.map(r => ({t:'copy',r})));
  }

  if (filter === 'all' || filter === 'salary') {
    all.push(...salaries.map(r => ({t:'salary',r})));
  }

  all.sort((a,b) =>
    String(b.r.date || '').localeCompare(String(a.r.date || ''))
  );

  $('allHistory').innerHTML = all.length
    ? all.map(x => card(x.t,x.r)).join('')
    : '<div class="empty">No records yet.</div>';

  const sh = [...salaries].sort((a,b) =>
    String(b.date || '').localeCompare(String(a.date || ''))
  );

  $('salaryHistory').innerHTML = sh.length
    ? sh.map(r => card('salary',r)).join('')
    : '<div class="empty">No salary payments recorded yet.</div>';
}

function refresh() {
  refreshSummary();
  renderHistory();
}

function showTab(id) {
  document.querySelectorAll('.tab-panel').forEach(x => {
    x.classList.toggle('hidden',x.id !== id);
  });

  document.querySelectorAll('.tabs .tab').forEach(x => {
    x.classList.toggle('active',x.dataset.tab === id);
  });

  localStorage.setItem(KEYS.selectedTab,id);
}

function updateTeachTotal() {
  $('teachingEntryTotal').textContent = money(
    (Number($('teachingCount').value)||0) *
    (Number($('teachingRate').value)||0)
  );
}

function updateCopyTotal() {
  $('copyEntryTotal').textContent = money(
    (Number($('copyCount').value)||0) *
    (Number($('copyRate').value)||0)
  );
}

function resetTeach() {
  $('teachingForm').reset();
  $('teachingEditId').value = '';
  $('teachingDate').value = today();
  $('teachingType').value = '150';
  $('teachingRate').value = '150';
  $('teachingCount').value = '1';
  $('saveTeachingBtn').textContent = '➕ Save Teaching Record';
  $('cancelTeachingEdit').classList.add('hidden');
  updateTeachTotal();
}

function resetCopy() {
  $('copyForm').reset();
  $('copyEditId').value = '';
  $('copyDate').value = today();
  $('copyCount').value = '1';
  $('copyRate').value = '225';
  $('saveCopyBtn').textContent = '➕ Save Copy Checking Record';
  $('cancelCopyEdit').classList.add('hidden');
  updateCopyTotal();
}

function resetSalary() {
  $('salaryForm').reset();
  $('salaryEditId').value = '';
  $('salaryDate').value = today();
  $('saveSalaryBtn').textContent = '➕ Save Salary Payment';
  $('cancelSalaryEdit').classList.add('hidden');
}

function edit(type,id) {
  const list = type === 'teaching'
    ? teaching
    : type === 'copy' ? copies : salaries;

  const r = list.find(x => String(x.id) === String(id));
  if (!r) return;

  if (type === 'teaching') {
    showTab('teachingSection');

    $('teachingEditId').value = r.id;
    $('teachingDate').value = r.date || today();
    $('teachingCount').value = r.count || 1;
    $('teachingRate').value = r.rate || 0;
    $('teachingClass').value = r.className || '';
    $('teachingTiming').value = r.timing || 'Custom / Not Specified';
    $('teachingNote').value = r.note || '';

    $('teachingType').value = [150,200,225].includes(Number(r.rate))
      ? String(Number(r.rate))
      : 'custom';

    $('saveTeachingBtn').textContent = '💾 Update Teaching Record';
    $('cancelTeachingEdit').classList.remove('hidden');
    updateTeachTotal();

  } else if (type === 'copy') {
    showTab('copySection');

    $('copyEditId').value = r.id;
    $('copyDate').value = r.date || today();
    $('copyClass').value = r.className || '';
    $('copyCount').value = r.count || 1;
    $('copyRate').value = r.rate || 0;
    $('copyNote').value = r.note || '';

    $('saveCopyBtn').textContent = '💾 Update Copy Record';
    $('cancelCopyEdit').classList.remove('hidden');
    updateCopyTotal();

  } else {
    showTab('salarySection');

    $('salaryEditId').value = r.id;
    $('salaryDate').value = r.date || today();
    $('salaryAmount').value = r.amount || '';
    $('salaryNote').value = r.note || '';

    $('saveSalaryBtn').textContent = '💾 Update Salary Payment';
    $('cancelSalaryEdit').classList.remove('hidden');
  }

  window.scrollTo({top:0,behavior:'smooth'});
}

function del(type,id) {
  if (!confirm('Delete this record? This cannot be undone.')) return;

  if (type === 'teaching') {
    teaching = teaching.filter(r => String(r.id) !== String(id));
  } else if (type === 'copy') {
    copies = copies.filter(r => String(r.id) !== String(id));
  } else {
    salaries = salaries.filter(r => String(r.id) !== String(id));
  }

  persist();
  refresh();
}

// Add IDs to legacy entries only; preserve saved records.
let idsChanged = false;

[teaching,copies,salaries].forEach(list => {
  list.forEach(r => {
    if (!r.id) {
      r.id = newId();
      idsChanged = true;
    }
  });
});

if (idsChanged) persist();

$('periodMonth').value = today().slice(0,7);

const thisYear = Number(today().slice(0,4));

for (let y = thisYear-5; y <= thisYear+5; y++) {
  const option = document.createElement('option');
  option.value = String(y);
  option.textContent = String(y);

  if (y === thisYear) option.selected = true;

  $('periodYear').appendChild(option);
}

$('periodMonth').addEventListener('change',refresh);
$('periodYear').addEventListener('change',refresh);

document.querySelectorAll('[data-view]').forEach(b => {
  b.addEventListener('click',() => {
    view = b.dataset.view;
    refresh();
  });
});

document.querySelectorAll('.tabs .tab').forEach(b => {
  b.addEventListener('click',() => showTab(b.dataset.tab));
});

$('teachingType').addEventListener('change',() => {
  if ($('teachingType').value !== 'custom') {
    $('teachingRate').value = $('teachingType').value;
  }
  updateTeachTotal();
});

$('teachingRate').addEventListener('input',() => {
  if ($('teachingRate').value !== $('teachingType').value) {
    $('teachingType').value = 'custom';
  }
  updateTeachTotal();
});

$('teachingCount').addEventListener('input',updateTeachTotal);
$('copyCount').addEventListener('input',updateCopyTotal);
$('copyRate').addEventListener('input',updateCopyTotal);

$('salaryMode').addEventListener('change',() => {
  salaryMode = $('salaryMode').value;
  persist();
  refresh();
});

$('saveSalarySetup').addEventListener('click',() => {
  const n = Number($('monthlySalary').value);

  if (!Number.isFinite(n) || n < 0) {
    alert('Enter a valid fixed monthly salary.');
    return;
  }

  monthlySalary = n;
  salaryMode = 'fixed';

  persist();
  refresh();

  alert('Fixed salary settings saved.');
});

$('historyFilter').addEventListener('change',renderHistory);

$('teachingForm').addEventListener('submit',e => {
  e.preventDefault();

  const count = Number($('teachingCount').value);
  const rate = Number($('teachingRate').value);

  if (!Number.isInteger(count) || count < 1 ||
      !Number.isFinite(rate) || rate < 0) {
    alert('Enter a valid period count and rate.');
    return;
  }

  const id = $('teachingEditId').value;

  const r = {
    id: id || newId(),
    date: $('teachingDate').value,
    count,
    rate,
    total: count * rate,
    className: $('teachingClass').value.trim(),
    timing: $('teachingTiming').value,
    note: $('teachingNote').value.trim()
  };

  if (id) {
    teaching = teaching.map(x => String(x.id) === String(id) ? r : x);
  } else {
    teaching.push(r);
  }

  persist();
  resetTeach();
  refresh();

  alert(id ? 'Teaching record updated.' : 'Teaching record saved.');
});

$('copyForm').addEventListener('submit',e => {
  e.preventDefault();

  const count = Number($('copyCount').value);
  const rate = Number($('copyRate').value);

  if (!Number.isInteger(count) || count < 1 ||
      !Number.isFinite(rate) || rate < 0) {
    alert('Enter a valid copy count and rate.');
    return;
  }

  const id = $('copyEditId').value;

  const r = {
    id: id || newId(),
    date: $('copyDate').value,
    count,
    rate,
    total: count * rate,
    className: $('copyClass').value.trim(),
    note: $('copyNote').value.trim()
  };

  if (id) {
    copies = copies.map(x => String(x.id) === String(id) ? r : x);
  } else {
    copies.push(r);
  }

  persist();
  resetCopy();
  refresh();

  alert(id ? 'Copy checking record updated.' : 'Copy checking record saved.');
});

$('salaryForm').addEventListener('submit',e => {
  e.preventDefault();

  const amount = Number($('salaryAmount').value);

  if (!Number.isFinite(amount) || amount <= 0) {
    alert('Enter the amount actually received.');
    return;
  }

  const id = $('salaryEditId').value;

  const r = {
    id: id || newId(),
    date: $('salaryDate').value,
    amount,
    note: $('salaryNote').value.trim()
  };

  if (id) {
    salaries = salaries.map(x => String(x.id) === String(id) ? r : x);
  } else {
    salaries.push(r);
  }

  persist();
  resetSalary();
  refresh();

  alert(id ? 'Salary payment updated.' : 'Salary payment saved.');
});

$('cancelTeachingEdit').addEventListener('click',resetTeach);
$('cancelCopyEdit').addEventListener('click',resetCopy);
$('cancelSalaryEdit').addEventListener('click',resetSalary);

document.addEventListener('click',e => {
  const editButton = e.target.closest('[data-edit]');

  if (editButton) {
    edit(editButton.dataset.edit,editButton.dataset.id);
    return;
  }

  const deleteButton = e.target.closest('[data-delete]');

  if (deleteButton) {
    del(deleteButton.dataset.delete,deleteButton.dataset.id);
  }
});

['teachingDate','salaryDate','copyDate'].forEach(id => {
  $(id).value = today();
});

const savedTab = localStorage.getItem(KEYS.selectedTab);

showTab(
  ['teachingSection','salarySection','copySection','historySection'].includes(savedTab)
    ? savedTab
    : 'teachingSection'
);

updateTeachTotal();
updateCopyTotal();
refresh();

})();
