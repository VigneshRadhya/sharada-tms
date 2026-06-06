/**
 * SHREE SHARADA TUITION CENTRE MANAGEMENT SYSTEM
 * Main Application JavaScript
 * Version: 1.0.0
 */

"use strict";

/* ══════════════════════════════════════
   1. THEME MANAGEMENT
══════════════════════════════════════ */
const ThemeManager = {
  init() {
    const saved = localStorage.getItem('ssTmsTheme') || 'light';
    this.apply(saved);
    const btn = document.getElementById('themeToggle');
    if (btn) btn.addEventListener('click', () => this.toggle());
  },
  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ssTmsTheme', theme);
    const icon = document.getElementById('themeIcon');
    if (icon) {
      icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  },
  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    this.apply(current === 'dark' ? 'light' : 'dark');
  }
};

/* ══════════════════════════════════════
   2. SIDEBAR MANAGEMENT
══════════════════════════════════════ */
const SidebarManager = {
  init() {
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar   = document.getElementById('sidebar');
    const wrapper   = document.getElementById('mainWrapper');
    if (!toggleBtn || !sidebar) return;

    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      if (window.innerWidth > 768) {
        wrapper.style.marginLeft = sidebar.classList.contains('open') ? '' :
          (wrapper.style.marginLeft === '0px' ? '260px' : '0px');
      }
    });

    // Close sidebar on mobile when clicking outside
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 &&
          !sidebar.contains(e.target) &&
          !toggleBtn.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }
};

/* ══════════════════════════════════════
   3. DATE DISPLAY
══════════════════════════════════════ */
const DateManager = {
  init() {
    const el = document.getElementById('currentDate');
    if (!el) return;
    const now = new Date();
    const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    el.textContent = now.toLocaleDateString('en-IN', opts);
  }
};

/* ══════════════════════════════════════
   4. COUNTER ANIMATION
══════════════════════════════════════ */
const CounterAnimation = {
  init() {
    const elements = document.querySelectorAll('.stat-value[data-target]');
    elements.forEach(el => {
      const target  = parseInt(el.getAttribute('data-target'));
      const isCurrency = el.classList.contains('currency');
      const duration = 1200;
      const start = performance.now();

      const tick = (now) => {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current  = Math.floor(eased * target);

        el.textContent = isCurrency
          ? '₹' + current.toLocaleString('en-IN')
          : current.toLocaleString('en-IN');

        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }
};

/* ══════════════════════════════════════
   5. CHARTS — DASHBOARD
══════════════════════════════════════ */
const DashboardCharts = {
  feeChart: null,
  attendanceDonut: null,
  classChart: null,
  feeStatusChart: null,

  getChartColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      grid: isDark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.06)',
      text: isDark ? '#8b949e' : '#64748b',
    };
  },

  initFeeChart() {
    const ctx = document.getElementById('feeChart');
    if (!ctx) return;
    const { grid, text } = this.getChartColors();
    const months = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];
    const collected = [68000, 72000, 74500, 79000, 81200, 84500];
    const pending   = [14000, 11200, 10800, 9500, 8800, 7400];

    this.feeChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Collected',
            data: collected,
            backgroundColor: 'rgba(37,99,235,.85)',
            borderRadius: 6,
            borderSkipped: false,
          },
          {
            label: 'Pending',
            data: pending,
            backgroundColor: 'rgba(234,88,12,.7)',
            borderRadius: 6,
            borderSkipped: false,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { color: text, font: { size: 12 }, boxWidth: 12 } },
          tooltip: {
            callbacks: {
              label: ctx => ' ₹' + ctx.parsed.y.toLocaleString('en-IN')
            }
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: text } },
          y: {
            grid: { color: grid },
            ticks: {
              color: text,
              callback: v => '₹' + (v/1000).toFixed(0) + 'k'
            }
          }
        }
      }
    });
  },

  initAttendanceDonut() {
    const ctx = document.getElementById('attendanceDonut');
    if (!ctx) return;
    this.attendanceDonut = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Present', 'Absent'],
        datasets: [{
          data: [298, 44],
          backgroundColor: ['#16a34a', '#dc2626'],
          borderWidth: 0,
          hoverOffset: 8,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.label}: ${ctx.parsed} students`
            }
          }
        }
      }
    });
  },

  initClassChart() {
    const ctx = document.getElementById('classChart');
    if (!ctx) return;
    const { text, grid } = this.getChartColors();
    const classes = ['Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];
    const counts  = [28, 42, 56, 63, 71, 82];

    this.classChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: classes,
        datasets: [{
          label: 'Students',
          data: counts,
          backgroundColor: [
            'rgba(20,184,166,.8)', 'rgba(37,99,235,.8)', 'rgba(124,58,237,.8)',
            'rgba(234,88,12,.8)',  'rgba(220,38,38,.8)',  'rgba(22,163,74,.8)',
          ],
          borderRadius: 6, borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: text } },
          y: { grid: { color: grid }, ticks: { color: text } }
        }
      }
    });
  },

  initFeeStatusChart() {
    const ctx = document.getElementById('feeStatusChart');
    if (!ctx) return;
    this.feeStatusChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Paid', 'Partially Paid', 'Due'],
        datasets: [{
          data: [264, 40, 38],
          backgroundColor: ['#16a34a', '#ea580c', '#dc2626'],
          borderWidth: 3,
          borderColor: '#ffffff',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { font: { size: 12 }, padding: 14 }
          }
        }
      }
    });
  },

  init() {
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js not loaded');
      return;
    }
    Chart.defaults.font.family = "'DM Sans', system-ui, sans-serif";
    this.initFeeChart();
    this.initAttendanceDonut();
    this.initClassChart();
    this.initFeeStatusChart();
  }
};

/* ══════════════════════════════════════
   6. STUDENT MANAGEMENT
══════════════════════════════════════ */
const StudentManager = {
  students: [],
  editingId: null,

  sampleData: [
    { id: 'SSC-2026-001', name: 'Riya Sharma',     dob: '2012-03-15', gender: 'Female', grade: 'Class 8',  parentName: 'Rajesh Sharma',   mobile: '9876543210', email: 'rajesh@email.com', city: 'Pune', fee: 1500, status: 'Active',   admDate: '2024-06-01', blood: 'B+' },
    { id: 'SSC-2026-002', name: 'Arjun Patil',     dob: '2010-07-22', gender: 'Male',   grade: 'Class 10', parentName: 'Suresh Patil',    mobile: '9876543211', email: '',               city: 'Pune', fee: 2000, status: 'Active',   admDate: '2024-06-01', blood: 'O+' },
    { id: 'SSC-2026-003', name: 'Sneha Kulkarni',  dob: '2013-11-08', gender: 'Female', grade: 'Class 6',  parentName: 'Anil Kulkarni',   mobile: '9876543212', email: '',               city: 'Pune', fee: 1200, status: 'Active',   admDate: '2024-07-15', blood: 'A+' },
    { id: 'SSC-2026-004', name: 'Mahesh Joshi',    dob: '2011-05-30', gender: 'Male',   grade: 'Class 9',  parentName: 'Dinesh Joshi',    mobile: '9876543213', email: '',               city: 'Pune', fee: 1800, status: 'Active',   admDate: '2024-06-01', blood: 'AB+' },
    { id: 'SSC-2026-005', name: 'Priya Desai',     dob: '2012-09-14', gender: 'Female', grade: 'Class 7',  parentName: 'Vijay Desai',     mobile: '9876543214', email: '',               city: 'Pune', fee: 1400, status: 'Active',   admDate: '2024-08-01', blood: 'B-' },
    { id: 'SSC-2026-006', name: 'Kavya Nair',      dob: '2010-01-20', gender: 'Female', grade: 'Class 10', parentName: 'Krishnan Nair',   mobile: '9876543215', email: '',               city: 'Pune', fee: 2000, status: 'Active',   admDate: '2024-06-01', blood: 'O-' },
    { id: 'SSC-2026-007', name: 'Vikram Singh',    dob: '2011-12-05', gender: 'Male',   grade: 'Class 8',  parentName: 'Harpreet Singh',  mobile: '9876543216', email: '',               city: 'Pune', fee: 1500, status: 'Active',   admDate: '2024-09-01', blood: 'A-' },
    { id: 'SSC-2026-008', name: 'Neha Rao',        dob: '2012-06-18', gender: 'Female', grade: 'Class 7',  parentName: 'Prasad Rao',      mobile: '9876543217', email: '',               city: 'Pune', fee: 1400, status: 'Active',   admDate: '2024-06-01', blood: 'B+' },
    { id: 'SSC-2026-009', name: 'Dev Kumar',       dob: '2011-04-25', gender: 'Male',   grade: 'Class 9',  parentName: 'Ramesh Kumar',    mobile: '9876543218', email: '',               city: 'Pune', fee: 1800, status: 'Active',   admDate: '2024-07-01', blood: 'O+' },
    { id: 'SSC-2026-010', name: 'Tanvi Mehta',     dob: '2013-08-12', gender: 'Female', grade: 'Class 6',  parentName: 'Amit Mehta',      mobile: '9876543219', email: '',               city: 'Pune', fee: 1200, status: 'Inactive', admDate: '2024-06-01', blood: 'A+' },
    { id: 'SSC-2026-011', name: 'Rohan Verma',     dob: '2011-02-28', gender: 'Male',   grade: 'Class 8',  parentName: 'Deepak Verma',    mobile: '9876543220', email: '',               city: 'Pune', fee: 1500, status: 'Active',   admDate: '2025-01-01', blood: 'AB-' },
    { id: 'SSC-2026-012', name: 'Ananya Pillai',   dob: '2012-10-10', gender: 'Female', grade: 'Class 7',  parentName: 'Suresh Pillai',   mobile: '9876543221', email: '',               city: 'Pune', fee: 1400, status: 'Active',   admDate: '2025-01-15', blood: 'B+' },
  ],

  init() {
    this.students = JSON.parse(localStorage.getItem('ssTmsStudents') || 'null') || this.sampleData;
    this.render();
    this.bindSearch();
    this.bindFilters();
    this.generateNextId();
  },

  save() {
    localStorage.setItem('ssTmsStudents', JSON.stringify(this.students));
  },

  generateNextId() {
    const idInput = document.getElementById('studentId');
    if (!idInput) return;
    const nums = this.students.map(s => parseInt(s.id.split('-')[2]) || 0);
    const next = Math.max(0, ...nums) + 1;
    idInput.value = 'SSC-2026-' + String(next).padStart(3, '0');
  },

  render(list = null) {
    const tbody = document.getElementById('studentTbody');
    if (!tbody) return;
    const data = list || this.students;
    tbody.innerHTML = '';

    if (!data.length) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center" style="padding:40px;color:var(--text-muted)"><i class="fas fa-search" style="font-size:28px;margin-bottom:10px;display:block;opacity:.4"></i>No students found</td></tr>`;
      return;
    }

    data.forEach(s => {
      const initials = s.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
      const colors   = ['blue','green','orange','purple','red','teal','indigo'];
      const color    = colors[s.id.charCodeAt(s.id.length-1) % colors.length];
      const statusBadge = s.status === 'Active'
        ? '<span class="badge-paid">Active</span>'
        : '<span style="background:#fee2e2;color:#b91c1c;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:600">Inactive</span>';

      tbody.insertAdjacentHTML('beforeend', `
        <tr>
          <td>
            <div class="student-cell">
              <div class="s-avatar ${color}">${initials}</div>
              <div><b>${s.name}</b><small>${s.id}</small></div>
            </div>
          </td>
          <td>${s.grade}</td>
          <td>${s.parentName}</td>
          <td>${s.mobile}</td>
          <td>₹${s.fee.toLocaleString('en-IN')}/mo</td>
          <td>${statusBadge}</td>
          <td>${new Date(s.admDate).toLocaleDateString('en-IN', {day:'2-digit',month:'short',year:'numeric'})}</td>
          <td>
            <div class="action-btns">
              <button class="btn-icon view" onclick="StudentManager.viewProfile('${s.id}')" title="View Profile"><i class="fas fa-eye"></i></button>
              <button class="btn-icon edit" onclick="StudentManager.editStudent('${s.id}')" title="Edit"><i class="fas fa-edit"></i></button>
              <button class="btn-icon delete" onclick="StudentManager.deleteStudent('${s.id}')" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
          </td>
        </tr>
      `);
    });

    const countEl = document.getElementById('studentCount');
    if (countEl) countEl.textContent = `Showing ${data.length} of ${this.students.length} students`;
  },

  bindSearch() {
    const search = document.getElementById('searchStudent');
    if (!search) return;
    search.addEventListener('input', () => this.applyFilters());
  },

  bindFilters() {
    ['filterGrade', 'filterStatus'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', () => this.applyFilters());
    });
  },

  applyFilters() {
    const q       = (document.getElementById('searchStudent')?.value || '').toLowerCase();
    const grade   = document.getElementById('filterGrade')?.value || '';
    const status  = document.getElementById('filterStatus')?.value || '';

    const filtered = this.students.filter(s => {
      const matchQ = !q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.parentName.toLowerCase().includes(q) || s.mobile.includes(q);
      const matchG = !grade  || s.grade === grade;
      const matchS = !status || s.status === status;
      return matchQ && matchG && matchS;
    });
    this.render(filtered);
  },

  openModal(id = null) {
    const overlay = document.getElementById('studentModal');
    if (!overlay) return;
    this.editingId = id;
    const title = overlay.querySelector('.modal-title span');
    if (title) title.textContent = id ? 'Edit Student' : 'Add New Student';

    if (id) {
      const s = this.students.find(x => x.id === id);
      if (s) this.populateForm(s);
    } else {
      document.getElementById('studentForm')?.reset();
      this.generateNextId();
    }
    overlay.classList.add('show');
  },

  populateForm(s) {
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
    set('studentId',      s.id);
    set('studentName',    s.name);
    set('studentDob',     s.dob);
    set('studentGender',  s.gender);
    set('studentGrade',   s.grade);
    set('parentName',     s.parentName);
    set('parentMobile',   s.mobile);
    set('studentEmail',   s.email);
    set('studentCity',    s.city);
    set('monthlyFee',     s.fee);
    set('studentStatus',  s.status);
    set('admissionDate',  s.admDate);
    set('bloodGroup',     s.blood);
  },

  closeModal() {
    const overlay = document.getElementById('studentModal');
    if (overlay) overlay.classList.remove('show');
    this.editingId = null;
  },

  saveStudent() {
    const get = (id) => document.getElementById(id)?.value?.trim() || '';
    const student = {
      id:         get('studentId'),
      name:       get('studentName'),
      dob:        get('studentDob'),
      gender:     get('studentGender'),
      grade:      get('studentGrade'),
      parentName: get('parentName'),
      mobile:     get('parentMobile'),
      email:      get('studentEmail'),
      city:       get('studentCity'),
      fee:        parseInt(get('monthlyFee')) || 0,
      status:     get('studentStatus'),
      admDate:    get('admissionDate'),
      blood:      get('bloodGroup'),
    };

    if (!student.name || !student.grade || !student.mobile) {
      alert('Please fill in all required fields (Name, Grade, Mobile).');
      return;
    }

    if (this.editingId) {
      const idx = this.students.findIndex(s => s.id === this.editingId);
      if (idx > -1) this.students[idx] = student;
      ToastManager.show('Student updated successfully!', 'success');
    } else {
      this.students.push(student);
      ToastManager.show('Student added successfully!', 'success');
    }

    this.save();
    this.render();
    this.closeModal();
  },

  editStudent(id) { this.openModal(id); },

  deleteStudent(id) {
    const s = this.students.find(x => x.id === id);
    if (!s) return;
    if (!confirm(`Delete ${s.name}? This action cannot be undone.`)) return;
    this.students = this.students.filter(x => x.id !== id);
    this.save();
    this.render();
    ToastManager.show('Student deleted.', 'error');
  },

  viewProfile(id) {
    window.location.href = `student-profile.html?id=${id}`;
  }
};

/* ══════════════════════════════════════
   7. ATTENDANCE MANAGER
══════════════════════════════════════ */
const AttendanceManager = {
  today: new Date().toISOString().split('T')[0],
  records: {},

  init() {
    this.records = JSON.parse(localStorage.getItem('ssTmsAttendance') || '{}');
    this.renderMarkingList();
    this.updateStats();
  },

  save() { localStorage.setItem('ssTmsAttendance', JSON.stringify(this.records)); },

  getKey(studentId, date) { return `${date}_${studentId}`; },

  mark(studentId, status) {
    const key = this.getKey(studentId, this.today);
    this.records[key] = {
      studentId, date: this.today, status,
      inTime:  status === 'Present' ? this.formatTime(new Date()) : '',
      outTime: '',
    };
    this.save();
    this.updateBtnState(studentId, status);
    this.updateStats();
  },

  formatTime(d) {
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  },

  getStatus(studentId, date = null) {
    const d = date || this.today;
    return this.records[this.getKey(studentId, d)]?.status || 'Not Marked';
  },

  updateBtnState(studentId, status) {
    const row = document.querySelector(`[data-student-id="${studentId}"]`);
    if (!row) return;
    const btns = row.querySelectorAll('.att-btn');
    btns.forEach(btn => btn.classList.remove('active'));
    const activeBtn = row.querySelector(`.att-btn.${status.toLowerCase()}`);
    if (activeBtn) activeBtn.classList.add('active');
    const statusEl = row.querySelector('.att-status');
    if (statusEl) {
      statusEl.textContent = status;
      statusEl.className = `att-status ${status === 'Present' ? 'badge-present' : 'badge-absent'}`;
    }
  },

  updateStats() {
    const students = JSON.parse(localStorage.getItem('ssTmsStudents') || '[]');
    const todayKeys = Object.keys(this.records).filter(k => k.startsWith(this.today));
    const present = todayKeys.filter(k => this.records[k].status === 'Present').length;
    const absent  = todayKeys.filter(k => this.records[k].status === 'Absent').length;
    const total   = students.length || 342;
    const pct     = total ? Math.round((present / total) * 100) : 0;

    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setEl('attPresent', present);
    setEl('attAbsent',  absent);
    setEl('attPct',     pct + '%');
  },

  renderMarkingList() {
    const container = document.getElementById('attendanceList');
    if (!container) return;
    const students = JSON.parse(localStorage.getItem('ssTmsStudents') || 'null') || StudentManager.sampleData;
    const colors   = ['blue','green','orange','purple','red','teal','indigo'];
    container.innerHTML = '';

    students.filter(s => s.status === 'Active').forEach(s => {
      const initials = s.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
      const color    = colors[s.id.charCodeAt(s.id.length-1) % colors.length];
      const current  = this.getStatus(s.id);
      const pActive  = current === 'Present' ? 'active' : '';
      const aActive  = current === 'Absent'  ? 'active' : '';
      const badgeCls = current === 'Present' ? 'badge-present' : current === 'Absent' ? 'badge-absent' : '';
      const badgeTxt = current !== 'Not Marked' ? current : '';

      container.insertAdjacentHTML('beforeend', `
        <div class="att-student-row" data-student-id="${s.id}">
          <div class="s-avatar ${color}">${initials}</div>
          <div class="att-student-info">
            <b>${s.name}</b>
            <small>${s.grade} · ID: ${s.id}</small>
          </div>
          ${badgeTxt ? `<span class="att-status ${badgeCls}">${badgeTxt}</span>` : '<span class="att-status" style="display:none"></span>'}
          <div class="att-actions">
            <button class="att-btn present ${pActive}" onclick="AttendanceManager.mark('${s.id}', 'Present')">
              <i class="fas fa-check"></i> Present
            </button>
            <button class="att-btn absent ${aActive}" onclick="AttendanceManager.mark('${s.id}', 'Absent')">
              <i class="fas fa-times"></i> Absent
            </button>
          </div>
        </div>
      `);
    });
  }
};

/* ══════════════════════════════════════
   8. FEE MANAGER
══════════════════════════════════════ */
const FeeManager = {
  payments: [],

  samplePayments: [
    { id: 'PAY-001', studentId: 'SSC-2026-001', name: 'Riya Sharma',    grade: 'Class 8',  month: 'May 2026', totalFee: 1500, paid: 1500, due: 0,    date: '2026-05-02', mode: 'UPI',   status: 'Paid' },
    { id: 'PAY-002', studentId: 'SSC-2026-002', name: 'Arjun Patil',    grade: 'Class 10', month: 'May 2026', totalFee: 2000, paid: 2000, due: 0,    date: '2026-05-03', mode: 'Cash',  status: 'Paid' },
    { id: 'PAY-003', studentId: 'SSC-2026-003', name: 'Sneha Kulkarni', grade: 'Class 6',  month: 'May 2026', totalFee: 1200, paid: 750,  due: 450,  date: '2026-05-04', mode: 'UPI',   status: 'Partially Paid' },
    { id: 'PAY-004', studentId: 'SSC-2026-004', name: 'Mahesh Joshi',   grade: 'Class 9',  month: 'May 2026', totalFee: 1800, paid: 1800, due: 0,    date: '2026-05-05', mode: 'Bank',  status: 'Paid' },
    { id: 'PAY-005', studentId: 'SSC-2026-005', name: 'Priya Desai',    grade: 'Class 7',  month: 'May 2026', totalFee: 1400, paid: 0,    due: 1400, date: '',           mode: '—',     status: 'Due' },
    { id: 'PAY-006', studentId: 'SSC-2026-006', name: 'Kavya Nair',     grade: 'Class 10', month: 'May 2026', totalFee: 2000, paid: 2000, due: 0,    date: '2026-05-01', mode: 'UPI',   status: 'Paid' },
    { id: 'PAY-007', studentId: 'SSC-2026-007', name: 'Vikram Singh',   grade: 'Class 8',  month: 'May 2026', totalFee: 1500, paid: 0,    due: 1500, date: '',           mode: '—',     status: 'Due' },
    { id: 'PAY-008', studentId: 'SSC-2026-008', name: 'Neha Rao',       grade: 'Class 7',  month: 'May 2026', totalFee: 1400, paid: 1400, due: 0,    date: '2026-05-06', mode: 'Cash',  status: 'Paid' },
  ],

  init() {
    this.payments = JSON.parse(localStorage.getItem('ssTmsFees') || 'null') || this.samplePayments;
    this.render();
    this.updateStats();
  },

  save() { localStorage.setItem('ssTmsFees', JSON.stringify(this.payments)); },

  render(list = null) {
    const tbody = document.getElementById('feeTbody');
    if (!tbody) return;
    const data = list || this.payments;
    tbody.innerHTML = '';

    data.forEach(p => {
      let badge = '';
      if (p.status === 'Paid')            badge = '<span class="badge-paid">Paid</span>';
      else if (p.status === 'Partially Paid') badge = '<span class="badge-partial">Partial</span>';
      else                                 badge = '<span class="badge-due">Due</span>';

      const paidPct = p.totalFee ? Math.round((p.paid / p.totalFee) * 100) : 0;

      tbody.insertAdjacentHTML('beforeend', `
        <tr>
          <td><b>${p.name}</b><small style="display:block;color:var(--text-muted)">${p.studentId}</small></td>
          <td>${p.grade}</td>
          <td>${p.month}</td>
          <td>₹${p.totalFee.toLocaleString('en-IN')}</td>
          <td style="color:var(--green);font-weight:600">₹${p.paid.toLocaleString('en-IN')}</td>
          <td style="color:${p.due > 0 ? 'var(--red)' : 'var(--green)'};font-weight:600">₹${p.due.toLocaleString('en-IN')}</td>
          <td>${p.date || '—'}</td>
          <td><span class="mode-tag">${p.mode}</span></td>
          <td>${badge}</td>
          <td>
            <div class="action-btns">
              ${p.due > 0 ? `<button class="btn-primary" style="padding:5px 12px;font-size:12px" onclick="FeeManager.collectFee('${p.id}')"><i class="fas fa-plus"></i> Collect</button>` : ''}
              <button class="btn-icon view" onclick="ReceiptManager.generateReceipt('${p.id}')" title="Receipt"><i class="fas fa-receipt"></i></button>
            </div>
          </td>
        </tr>
      `);
    });
  },

  updateStats() {
    const totalCollected = this.payments.reduce((a, p) => a + p.paid, 0);
    const totalDue       = this.payments.reduce((a, p) => a + p.due, 0);
    const dueCount       = this.payments.filter(p => p.status !== 'Paid').length;

    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setEl('totalCollected', '₹' + totalCollected.toLocaleString('en-IN'));
    setEl('totalDue',       '₹' + totalDue.toLocaleString('en-IN'));
    setEl('dueCount',       dueCount);
  },

  collectFee(paymentId) {
    const p = this.payments.find(x => x.id === paymentId);
    if (!p) return;
    const amount = prompt(`Collect fee for ${p.name}\nDue amount: ₹${p.due}\nEnter amount to collect:`);
    if (!amount || isNaN(amount) || amount <= 0) return;
    const collected = Math.min(parseInt(amount), p.due);
    p.paid += collected;
    p.due  -= collected;
    p.date  = new Date().toISOString().split('T')[0];
    p.mode  = 'Cash';
    p.status = p.due === 0 ? 'Paid' : 'Partially Paid';
    this.save();
    this.render();
    this.updateStats();
    ToastManager.show(`₹${collected.toLocaleString('en-IN')} collected from ${p.name}!`, 'success');
  }
};

/* ══════════════════════════════════════
   9. RECEIPT MANAGER
══════════════════════════════════════ */
const ReceiptManager = {
  receiptCounter: 1,

  generateReceipt(paymentId) {
    const fees = JSON.parse(localStorage.getItem('ssTmsFees') || 'null') || FeeManager.samplePayments;
    const p = fees.find(x => x.id === paymentId);
    if (!p) return;

    const receiptNo = `SSC-2026-${String(this.receiptCounter++).padStart(4, '0')}`;
    const now = new Date();
    const printDate = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

    const win = window.open('', '_blank', 'width=700,height=900');
    win.document.write(`
<!DOCTYPE html>
<html>
<head>
  <title>Receipt ${receiptNo}</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'DM Sans', sans-serif; background: #f8fafc; padding: 30px; }
    .receipt { background: white; max-width: 580px; margin: 0 auto; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,.12); border: 1px solid #e5e7eb; }
    .rh { background: linear-gradient(135deg, #1d4ed8, #7c3aed); padding: 28px 32px; color: white; text-align: center; }
    .rh .logo { width: 52px; height: 52px; background: rgba(255,255,255,.2); border-radius: 12px; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
    .rh h1 { font-family: 'Playfair Display', serif; font-size: 22px; }
    .rh p  { font-size: 12px; opacity: .8; margin-top: 3px; }
    .rh .rno { background: rgba(255,255,255,.15); padding: 4px 16px; border-radius: 20px; font-size: 12px; font-weight: 700; letter-spacing: 1px; display: inline-block; margin-top: 10px; }
    .rb { padding: 24px 32px; }
    .rrow { display: flex; justify-content: space-between; padding: 9px 0; border-bottom: 1px dashed #e5e7eb; }
    .rrow:last-child { border: none; }
    .rl { font-size: 12px; color: #6b7280; font-weight: 500; }
    .rv { font-size: 13px; color: #111827; font-weight: 600; }
    .amt-box { background: linear-gradient(135deg, #dcfce7, #bbf7d0); border: 2px solid #16a34a; border-radius: 12px; padding: 18px; text-align: center; margin: 16px 0; }
    .amt-box .big { font-family: 'Playfair Display', serif; font-size: 36px; color: #15803d; font-weight: 700; }
    .amt-box .words { font-size: 12px; color: #166534; margin-top: 3px; }
    .rf { background: #f8fafc; padding: 16px 32px; display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid #e5e7eb; }
    .sig .line { width: 120px; border-bottom: 2px solid #9ca3af; margin-bottom: 4px; }
    .sig .lbl { font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: .5px; }
    .watermark { font-size: 10px; color: #d1d5db; }
    @media print { body { background: white; padding: 0; } .receipt { box-shadow: none; border: none; } }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="rh">
      <div class="logo">🎓</div>
      <h1>Shree Sharada Tuition Centre</h1>
      <p>Excellence in Education · Pune, Maharashtra</p>
      <div class="rno">RECEIPT NO: ${receiptNo}</div>
    </div>
    <div class="rb">
      <div class="rrow"><span class="rl">Student Name</span><span class="rv">${p.name}</span></div>
      <div class="rrow"><span class="rl">Student ID</span><span class="rv">${p.studentId}</span></div>
      <div class="rrow"><span class="rl">Grade / Class</span><span class="rv">${p.grade}</span></div>
      <div class="rrow"><span class="rl">Fee For Month</span><span class="rv">${p.month}</span></div>
      <div class="rrow"><span class="rl">Total Fee</span><span class="rv">₹${p.totalFee.toLocaleString('en-IN')}</span></div>
      <div class="rrow"><span class="rl">Payment Date</span><span class="rv">${p.date || printDate}</span></div>
      <div class="rrow"><span class="rl">Payment Mode</span><span class="rv">${p.mode}</span></div>
      <div class="rrow"><span class="rl">Payment Status</span><span class="rv">${p.status}</span></div>
      <div class="amt-box">
        <div class="big">₹${p.paid.toLocaleString('en-IN')}</div>
        <div class="words">Amount Paid Today</div>
      </div>
      ${p.due > 0 ? `<div class="rrow"><span class="rl">Balance Due</span><span class="rv" style="color:#dc2626">₹${p.due.toLocaleString('en-IN')}</span></div>` : ''}
    </div>
    <div class="rf">
      <div>
        <div class="watermark">Printed: ${printDate}</div>
        <div class="watermark">This is a computer-generated receipt.</div>
      </div>
      <div class="sig">
        <div class="line"></div>
        <div class="lbl">Authorized Signatory</div>
      </div>
    </div>
  </div>
  <div style="text-align:center;margin-top:16px">
    <button onclick="window.print()" style="padding:10px 24px;background:#1d4ed8;color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:600">🖨 Print Receipt</button>
    <button onclick="window.close()" style="padding:10px 24px;background:#f1f5f9;color:#475569;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:600;margin-left:8px">Close</button>
  </div>
</body>
</html>
    `);
    win.document.close();
  }
};

/* ══════════════════════════════════════
   10. TOAST NOTIFICATIONS
══════════════════════════════════════ */
const ToastManager = {
  container: null,

  init() {
    this.container = document.createElement('div');
    this.container.style.cssText = `
      position: fixed; bottom: 24px; right: 24px;
      z-index: 9999; display: flex; flex-direction: column;
      gap: 8px; pointer-events: none;
    `;
    document.body.appendChild(this.container);
  },

  show(message, type = 'success') {
    const colors = {
      success: { bg: '#dcfce7', border: '#16a34a', text: '#15803d', icon: 'fa-check-circle' },
      error:   { bg: '#fee2e2', border: '#dc2626', text: '#b91c1c', icon: 'fa-times-circle' },
      info:    { bg: '#eff6ff', border: '#2563eb', text: '#1d4ed8', icon: 'fa-info-circle' },
      warning: { bg: '#fff7ed', border: '#ea580c', text: '#c2410c', icon: 'fa-exclamation-circle' },
    };
    const c = colors[type] || colors.info;
    const toast = document.createElement('div');
    toast.style.cssText = `
      background: ${c.bg}; border: 1px solid ${c.border};
      color: ${c.text}; padding: 12px 18px;
      border-radius: 10px; font-size: 13px; font-weight: 600;
      display: flex; align-items: center; gap: 8px;
      box-shadow: 0 4px 16px rgba(0,0,0,.12);
      pointer-events: auto; max-width: 320px;
      animation: slideUp .25s cubic-bezier(.4,0,.2,1);
    `;
    toast.innerHTML = `<i class="fas ${c.icon}"></i>${message}`;
    this.container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'all .3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
};

/* ══════════════════════════════════════
   11. MODAL UTILITIES
══════════════════════════════════════ */
const ModalManager = {
  init() {
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('show');
      });
    });
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('.modal-overlay')?.classList.remove('show');
      });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.show').forEach(m => m.classList.remove('show'));
      }
    });
  },
  open(id)  { document.getElementById(id)?.classList.add('show'); },
  close(id) { document.getElementById(id)?.classList.remove('show'); },
};

/* ══════════════════════════════════════
   12. PROFILE PAGE
══════════════════════════════════════ */
const ProfilePage = {
  init() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return;
    const students = JSON.parse(localStorage.getItem('ssTmsStudents') || 'null') || StudentManager.sampleData;
    const s = students.find(x => x.id === id);
    if (!s) return;

    const set = (sel, val) => {
      const el = document.querySelector(sel);
      if (el) el.textContent = val;
    };

    set('#p-name',   s.name);
    set('#p-id',     s.id);
    set('#p-grade',  s.grade);
    set('#p-parent', s.parentName);
    set('#p-mobile', s.mobile);
    set('#p-fee',    '₹' + s.fee.toLocaleString('en-IN') + '/month');
    set('#p-status', s.status);
    set('#p-adm',    new Date(s.admDate).toLocaleDateString('en-IN', {day:'2-digit',month:'long',year:'numeric'}));
    set('#p-city',   s.city);
    set('#p-blood',  s.blood);
    set('#p-initials', s.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase());

    const initials = s.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
    document.querySelectorAll('.profile-initial').forEach(el => el.textContent = initials);
  }
};

/* ══════════════════════════════════════
   13. BOOTSTRAP APP
══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  SidebarManager.init();
  DateManager.init();
  ToastManager.init();
  ModalManager.init();
  CounterAnimation.init();
  DashboardCharts.init();

  // Page-specific inits
  const page = document.body.dataset.page;
  if (page === 'students')   StudentManager.init();
  if (page === 'attendance') AttendanceManager.init();
  if (page === 'fees')       FeeManager.init();
  if (page === 'profile')    ProfilePage.init();

  // Export buttons
  document.querySelector('[data-export="excel"]')?.addEventListener('click', () => {
    ToastManager.show('Exporting to Excel...', 'info');
    setTimeout(() => ToastManager.show('Excel file downloaded!', 'success'), 1500);
  });
  document.querySelector('[data-export="pdf"]')?.addEventListener('click', () => {
    ToastManager.show('Generating PDF...', 'info');
    setTimeout(() => window.print(), 800);
  });

  // Greeting message
  const hour = new Date().getHours();
  const greet = document.querySelector('.welcome-banner h2');
  if (greet) {
    const g = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
    const emoji = hour < 12 ? '🌅' : hour < 17 ? '☀️' : '🌙';
    greet.textContent = `${g}, Admin! ${emoji}`;
  }
});

// Global function aliases (for HTML onclick)
window.openStudentModal     = (id) => StudentManager.openModal(id);
window.closeStudentModal    = ()   => StudentManager.closeModal();
window.saveStudent          = ()   => StudentManager.saveStudent();
window.generateReceiptFor   = (id) => ReceiptManager.generateReceipt(id);
window.openModal            = (id) => ModalManager.open(id);
window.closeModal           = (id) => ModalManager.close(id);
