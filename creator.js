/**
 * KaiSer Creator Dashboard Controller (js/creator.js)
 * Kasir Simpel, Bisnis Lancar 🌊
 */

document.addEventListener('DOMContentLoaded', () => {
  // UI Elements
  const loginSection = document.getElementById('loginSection');
  const appSection = document.getElementById('appSection');
  
  // Login Elements
  const loginForm = document.getElementById('loginForm');
  const creatorIdInput = document.getElementById('creatorIdInput');
  const creatorPasswordInput = document.getElementById('creatorPasswordInput');
  const toggleLoginPwd = document.getElementById('toggleLoginPwd');

  // App Header & Logout
  const currentUserDisplay = document.getElementById('currentUserDisplay');
  const btnLogout = document.getElementById('btnLogout');

  // Dashboard Stats
  const statTotalWarung = document.getElementById('statTotalWarung');
  const statActiveWarung = document.getElementById('statActiveWarung');
  const statSuspendWarung = document.getElementById('statSuspendWarung');
  const statNonactiveWarung = document.getElementById('statNonactiveWarung');

  // Form Create Warung
  const createWarungForm = document.getElementById('createWarungForm');
  const inputOwnerName = document.getElementById('inputOwnerName');
  const inputWarungName = document.getElementById('inputWarungName');
  const inputPhone = document.getElementById('inputPhone');
  const inputAddress = document.getElementById('inputAddress');
  const inputWarungId = document.getElementById('inputWarungId');
  const inputWarungPassword = document.getElementById('inputWarungPassword');
  const inputStatus = document.getElementById('inputStatus');
  const btnGenId = document.getElementById('btnGenId');
  const btnGenPassword = document.getElementById('btnGenPassword');

  // Table & Search
  const searchInput = document.getElementById('searchInput');
  const warungsTableBody = document.getElementById('warungsTableBody');
  const emptyState = document.getElementById('emptyState');

  // Modals
  const waModal = document.getElementById('waModal');
  const waPreviewText = document.getElementById('waPreviewText');
  const btnCopyWA = document.getElementById('btnCopyWA');
  const btnCloseWAModal = document.getElementById('btnCloseWAModal');

  const resetModal = document.getElementById('resetModal');
  const resetWarungName = document.getElementById('resetWarungName');
  const inputResetPassword = document.getElementById('inputResetPassword');
  const btnGenResetPwd = document.getElementById('btnGenResetPwd');
  const btnSaveResetPwd = document.getElementById('btnSaveResetPwd');
  const btnCloseResetModal = document.getElementById('btnCloseResetModal');

  let currentResetWarungId = null;
  let currentWAPayload = '';

  // --- INITIALIZATION ---
  checkSessionState();

  function checkSessionState() {
    const session = KaiSerCore.getCreatorSession();
    if (session) {
      loginSection.style.display = 'none';
      appSection.style.display = 'block';
      currentUserDisplay.textContent = session.name || session.username;
      renderDashboard();
    } else {
      loginSection.style.display = 'flex';
      appSection.style.display = 'none';
    }
  }

  // --- LOGIN HANDLER ---
  if (toggleLoginPwd) {
    toggleLoginPwd.addEventListener('click', () => {
      const isPassword = creatorPasswordInput.type === 'password';
      creatorPasswordInput.type = isPassword ? 'text' : 'password';
      toggleLoginPwd.textContent = isPassword ? '👁️‍🗨️' : '👁️';
    });
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = creatorIdInput.value;
    const pwd = creatorPasswordInput.value;

    const res = KaiSerCore.loginCreator(id, pwd);
    if (res.success) {
      showToast('🔑 Login Creator Berhasil!', 'success');
      creatorPasswordInput.value = '';
      checkSessionState();
    } else {
      showToast(`⚠️ ${res.message}`, 'error');
    }
  });

  btnLogout.addEventListener('click', () => {
    KaiSerCore.logoutCreator();
    showToast('🔒 Telah keluar dari KaiSer Creator.', 'info');
    checkSessionState();
  });

  // --- DASHBOARD RENDER & STATS ---
  function renderDashboard() {
    const warungs = KaiSerCore.getWarungs();
    
    // Update Stats
    const total = warungs.length;
    const active = warungs.filter(w => w.status === KaiSerCore.STATUS.AKTIF).length;
    const suspend = warungs.filter(w => w.status === KaiSerCore.STATUS.SUSPEND).length;
    const nonactive = warungs.filter(w => w.status === KaiSerCore.STATUS.NONAKTIF).length;

    statTotalWarung.textContent = total;
    statActiveWarung.textContent = active;
    statSuspendWarung.textContent = suspend;
    statNonactiveWarung.textContent = nonactive;

    // Filter list
    const query = searchInput.value.toLowerCase().trim();
    const filtered = warungs.filter(w => 
      w.warungName.toLowerCase().includes(query) ||
      w.id.toLowerCase().includes(query) ||
      w.ownerName.toLowerCase().includes(query) ||
      w.phone.includes(query)
    );

    renderTable(filtered);
  }

  function renderTable(warungs) {
    warungsTableBody.innerHTML = '';

    if (warungs.length === 0) {
      emptyState.style.display = 'block';
      return;
    } else {
      emptyState.style.display = 'none';
    }

    warungs.forEach(w => {
      const tr = document.createElement('tr');

      let badgeClass = 'badge-aktif';
      let dotClass = 'dot-aktif';
      if (w.status === KaiSerCore.STATUS.SUSPEND) {
        badgeClass = 'badge-suspend';
        dotClass = 'dot-suspend';
      } else if (w.status === KaiSerCore.STATUS.NONAKTIF) {
        badgeClass = 'badge-nonaktif';
        dotClass = 'dot-nonaktif';
      }

      tr.innerHTML = `
        <td><span class="warung-id-tag">${w.id}</span></td>
        <td>
          <strong style="color: var(--dark-ocean); font-size: 14px;">${escapeHtml(w.warungName)}</strong><br>
          <span style="font-size: 12px; color: var(--text-muted);">👤 ${escapeHtml(w.ownerName)}</span>
        </td>
        <td>
          <span style="font-size: 12px;">📱 ${escapeHtml(w.phone)}</span><br>
          <span style="font-size: 11px; color: var(--text-muted);">📍 ${escapeHtml(w.address)}</span>
        </td>
        <td>
          <span class="status-badge ${badgeClass}">
            <span class="status-dot ${dotClass}"></span>
            ${w.status}
          </span>
        </td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon btn-icon-wa" title="Salin Info Akun WA" onclick="openWAModal('${w.id}')">
              📱
            </button>
            <button class="btn-icon btn-icon-reset" title="Reset Password" onclick="openResetModal('${w.id}')">
              🔑
            </button>
            <button class="btn-icon" title="Ubah Status" onclick="toggleStatus('${w.id}')">
              🔄
            </button>
            <button class="btn-icon btn-icon-danger" title="Hapus Warung" onclick="deleteWarung('${w.id}')">
              🗑️
            </button>
          </div>
        </td>
      `;

      warungsTableBody.appendChild(tr);
    });
  }

  // --- FORM CREATE WARUNG HANDLERS ---
  inputWarungName.addEventListener('input', () => {
    if (!inputWarungId.value || inputWarungId.dataset.auto === 'true') {
      inputWarungId.value = KaiSerCore.generateWarungId(inputWarungName.value);
      inputWarungId.dataset.auto = 'true';
    }
  });

  inputWarungId.addEventListener('input', () => {
    inputWarungId.dataset.auto = 'false';
  });

  btnGenId.addEventListener('click', () => {
    inputWarungId.value = KaiSerCore.generateWarungId(inputWarungName.value);
    inputWarungId.dataset.auto = 'true';
    showToast('✨ ID Warung dibuat otomatis!', 'info');
  });

  btnGenPassword.addEventListener('click', () => {
    inputWarungPassword.value = KaiSerCore.generateSecurePassword();
    showToast('🔐 Password aman dibuat!', 'info');
  });

  createWarungForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const payload = {
      ownerName: inputOwnerName.value,
      warungName: inputWarungName.value,
      phone: inputPhone.value,
      address: inputAddress.value,
      id: inputWarungId.value,
      password: inputWarungPassword.value,
      status: inputStatus.value
    };

    const res = KaiSerCore.createWarung(payload);
    if (res.success) {
      showToast(`✅ ${res.message}`, 'success');
      createWarungForm.reset();
      inputWarungId.value = '';
      inputWarungId.dataset.auto = 'true';
      renderDashboard();
      
      // Prompt to open WhatsApp payload immediately
      openWAModal(res.warung.id);
    } else {
      showToast(`⚠️ ${res.message}`, 'error');
    }
  });

  // --- SEARCH HANDLER ---
  searchInput.addEventListener('input', renderDashboard);

  // --- GLOBAL ACTION FUNCTIONS ---
  window.toggleStatus = (warungId) => {
    const warung = KaiSerCore.getWarungById(warungId);
    if (!warung) return;

    let nextStatus = KaiSerCore.STATUS.SUSPEND;
    if (warung.status === KaiSerCore.STATUS.AKTIF) {
      nextStatus = KaiSerCore.STATUS.SUSPEND;
    } else if (warung.status === KaiSerCore.STATUS.SUSPEND) {
      nextStatus = KaiSerCore.STATUS.NONAKTIF;
    } else {
      nextStatus = KaiSerCore.STATUS.AKTIF;
    }

    const res = KaiSerCore.updateWarungStatus(warungId, nextStatus);
    if (res.success) {
      showToast(`🔄 ${res.message}`, 'info');
      renderDashboard();
    }
  };

  window.deleteWarung = (warungId) => {
    const warung = KaiSerCore.getWarungById(warungId);
    if (!warung) return;

    if (confirm(`Apakah Anda yakin ingin menghapus akun ${warung.warungName} (${warung.id})? Data lokal warung ini tidak dapat dikembalikan.`)) {
      const res = KaiSerCore.deleteWarung(warungId);
      if (res.success) {
        showToast(`🗑️ ${res.message}`, 'success');
        renderDashboard();
      }
    }
  };

  // --- MODAL WHATSAPP HANDLERS ---
  window.openWAModal = (warungId) => {
    const warung = KaiSerCore.getWarungById(warungId);
    if (!warung) return;

    currentWAPayload = KaiSerCore.formatWhatsAppPayload(warung);
    waPreviewText.textContent = currentWAPayload;
    waModal.classList.add('active');
  };

  btnCloseWAModal.addEventListener('click', () => {
    waModal.classList.remove('active');
  });

  btnCopyWA.addEventListener('click', () => {
    navigator.clipboard.writeText(currentWAPayload).then(() => {
      showToast('📋 Info Akun berhasil disalin! Siap dikirim via WA.', 'success');
      waModal.classList.remove('active');
    }).catch(err => {
      showToast('Gagal menyalin teks.', 'error');
    });
  });

  // --- MODAL RESET PASSWORD HANDLERS ---
  window.openResetModal = (warungId) => {
    const warung = KaiSerCore.getWarungById(warungId);
    if (!warung) return;

    currentResetWarungId = warungId;
    resetWarungName.textContent = `${warung.warungName} (${warung.id})`;
    inputResetPassword.value = KaiSerCore.generateSecurePassword();
    resetModal.classList.add('active');
  };

  btnCloseResetModal.addEventListener('click', () => {
    resetModal.classList.remove('active');
  });

  btnGenResetPwd.addEventListener('click', () => {
    inputResetPassword.value = KaiSerCore.generateSecurePassword();
  });

  btnSaveResetPwd.addEventListener('click', () => {
    if (!currentResetWarungId) return;

    const newPwd = inputResetPassword.value;
    const res = KaiSerCore.resetWarungPassword(currentResetWarungId, newPwd);

    if (res.success) {
      showToast(`🔑 ${res.message}`, 'success');
      resetModal.classList.remove('active');
      renderDashboard();
      openWAModal(currentResetWarungId);
    } else {
      showToast(`⚠️ ${res.message}`, 'error');
    }
  });

  // --- UTILS: TOAST NOTIFICATION ---
  function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    if (type === 'error') toast.style.borderLeft = '4px solid var(--danger)';
    if (type === 'success') toast.style.borderLeft = '4px solid var(--success)';
    if (type === 'info') toast.style.borderLeft = '4px solid var(--primary)';

    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/[&<>"']/g, function(m) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      }[m];
    });
  }
});
