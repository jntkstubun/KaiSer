/**
 * KaiSer Creator Dashboard Controller (js/creator.js)
 * Kasir Simpel, Bisnis Lancar 🌊
 * Handles Master Creator Login, Subscription Expirations, Admin Quotas, Extra Admin Approvals, Broadcasts, WA Auto-Importer & Quick 1-Click Activation, Storage Sync
 */

document.addEventListener('DOMContentLoaded', () => {
  // UI Containers
  const creatorLoginSection = document.getElementById('creatorLoginSection');
  const creatorAppSection = document.getElementById('creatorAppSection');
  
  // Login Elements
  const creatorLoginForm = document.getElementById('creatorLoginForm');
  const creatorIdInput = document.getElementById('creatorIdInput');
  const creatorPwdInput = document.getElementById('creatorPwdInput');
  const toggleCreatorPwd = document.getElementById('toggleCreatorPwd');

  // App Header & Logout
  const creatorNameBadge = document.getElementById('creatorNameBadge');
  const btnLogoutCreator = document.getElementById('btnLogoutCreator');

  // Dashboard Stats
  const statTotalWarungs = document.getElementById('statTotalWarungs');
  const statActiveWarungs = document.getElementById('statActiveWarungs');
  const statSuspendWarungs = document.getElementById('statSuspendWarungs');
  const statExpiredWarungs = document.getElementById('statExpiredWarungs');

  // Broadcast
  const inputBroadcastMsg = document.getElementById('inputBroadcastMsg');
  const btnPublishBroadcast = document.getElementById('btnPublishBroadcast');
  const btnClearBroadcast = document.getElementById('btnClearBroadcast');

  // WA Auto Importer Elements
  const inputWAImportPayload = document.getElementById('inputWAImportPayload');
  const btnImportWAActivate = document.getElementById('btnImportWAActivate');
  const btnImportWASaveNonactive = document.getElementById('btnImportWASaveNonactive');

  // Form Create Warung
  const createWarungForm = document.getElementById('createWarungForm');
  const newOwnerName = document.getElementById('newOwnerName');
  const newWarungName = document.getElementById('newWarungName');
  const newPhone = document.getElementById('newPhone');
  const newAddress = document.getElementById('newAddress');
  const newWarungId = document.getElementById('newWarungId');
  const newPassword = document.getElementById('newPassword');
  const newDuration = document.getElementById('newDuration');
  const btnGenId = document.getElementById('btnGenId');
  const btnGenPwd = document.getElementById('btnGenPwd');

  // Table & Search
  const searchWarungInput = document.getElementById('searchWarungInput');
  const warungTableBody = document.getElementById('warungTableBody');

  // Modals
  const waModal = document.getElementById('waModal');
  const waPhoneInput = document.getElementById('waPhoneInput');
  const waMessagePreview = document.getElementById('waMessagePreview');
  const btnOpenWAChat = document.getElementById('btnOpenWAChat');
  const btnCloseWaModal = document.getElementById('btnCloseWaModal');

  const extendModal = document.getElementById('extendModal');
  const extendWarungName = document.getElementById('extendWarungName');
  const extendDuration = document.getElementById('extendDuration');
  const btnProcessExtend = document.getElementById('btnProcessExtend');
  const btnCloseExtendModal = document.getElementById('btnCloseExtendModal');

  let currentExtendWarungId = null;
  let currentWAPhone = '';
  let currentWAMessage = '';

  // --- CROSS-TAB LOCALSTORAGE SYNC ---
  window.addEventListener('storage', (e) => {
    if (e.key === 'kaiser_warungs_db') {
      renderDashboard();
    }
  });

  // --- INITIALIZATION ---
  checkSessionState();

  function checkSessionState() {
    const session = KaiSerCore.getCreatorSession();
    if (session) {
      if (creatorLoginSection) creatorLoginSection.style.display = 'none';
      if (creatorAppSection) creatorAppSection.style.display = 'block';
      if (creatorNameBadge) creatorNameBadge.textContent = `👑 ${session.name || session.username}`;
      if (inputBroadcastMsg) inputBroadcastMsg.value = KaiSerCore.getAnnouncement();
      renderDashboard();
    } else {
      if (creatorLoginSection) creatorLoginSection.style.display = 'flex';
      if (creatorAppSection) creatorAppSection.style.display = 'none';
      if (creatorIdInput && !creatorIdInput.value) creatorIdInput.value = 'ilyas0905';
      if (creatorPwdInput) creatorPwdInput.focus();
    }
  }

  // --- WA AUTO-IMPORTER & QUICK ACTIVATION ---
  if (btnImportWAActivate) {
    btnImportWAActivate.addEventListener('click', () => {
      const text = inputWAImportPayload.value;
      const res = KaiSerCore.parseAndImportWAMessage(text, true);
      if (res.success) {
        showToast(`🟢 ${res.message}`, 'success');
        inputWAImportPayload.value = '';
        renderDashboard();
        openWAModal(res.warung.id);
      } else {
        showToast(`⚠️ ${res.message}`, 'error');
      }
    });
  }

  if (btnImportWASaveNonactive) {
    btnImportWASaveNonactive.addEventListener('click', () => {
      const text = inputWAImportPayload.value;
      const res = KaiSerCore.parseAndImportWAMessage(text, false);
      if (res.success) {
        showToast(`💾 ${res.message}`, 'info');
        inputWAImportPayload.value = '';
        renderDashboard();
      } else {
        showToast(`⚠️ ${res.message}`, 'error');
      }
    });
  }

  // --- PASSWORD TOGGLE ---
  if (toggleCreatorPwd) {
    toggleCreatorPwd.addEventListener('click', () => {
      const isPassword = creatorPwdInput.type === 'password';
      creatorPwdInput.type = isPassword ? 'text' : 'password';
      toggleCreatorPwd.textContent = isPassword ? '👁️‍🗨️' : '👁️';
    });
  }

  // --- LOGIN SUBMIT HANDLER ---
  if (creatorLoginForm) {
    creatorLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = creatorIdInput.value.trim();
      const pwd = creatorPwdInput.value.trim();

      const res = KaiSerCore.loginCreator(id, pwd);
      if (res.success) {
        showToast('🔑 Login Creator Master Berhasil!', 'success');
        checkSessionState();
      } else {
        showToast(`⚠️ ${res.message}`, 'error');
      }
    });
  }

  if (btnLogoutCreator) {
    btnLogoutCreator.addEventListener('click', () => {
      KaiSerCore.logoutCreator();
      showToast('🔒 Telah keluar dari KaiSer Creator Master.', 'info');
      checkSessionState();
    });
  }

  // --- BROADCAST ANNOUNCEMENTS ---
  if (btnPublishBroadcast) {
    btnPublishBroadcast.addEventListener('click', () => {
      const msg = inputBroadcastMsg.value;
      KaiSerCore.setAnnouncement(msg);
      showToast('🚀 Broadcast Pengumuman terkirim ke seluruh layar warung!', 'success');
    });
  }

  if (btnClearBroadcast) {
    btnClearBroadcast.addEventListener('click', () => {
      inputBroadcastMsg.value = '';
      KaiSerCore.setAnnouncement('');
      showToast('🗑️ Broadcast Pengumuman dihapus.', 'info');
    });
  }

  // --- DASHBOARD RENDER & STATS ---
  function renderDashboard() {
    if (!warungTableBody) return;
    const warungs = KaiSerCore.getWarungs();
    
    // Update Stats
    const total = warungs.length;
    const active = warungs.filter(w => w.status === KaiSerCore.STATUS.AKTIF).length;
    const suspend = warungs.filter(w => w.status === KaiSerCore.STATUS.SUSPEND || w.status === KaiSerCore.STATUS.NONAKTIF).length;
    const expired = warungs.filter(w => w.status === KaiSerCore.STATUS.EXPIRED).length;

    if (statTotalWarungs) statTotalWarungs.textContent = total;
    if (statActiveWarungs) statActiveWarungs.textContent = active;
    if (statSuspendWarungs) statSuspendWarungs.textContent = suspend;
    if (statExpiredWarungs) statExpiredWarungs.textContent = expired;

    const query = searchWarungInput ? searchWarungInput.value.toLowerCase().trim() : '';
    const filtered = warungs.filter(w => 
      w.warungName.toLowerCase().includes(query) ||
      w.id.toLowerCase().includes(query) ||
      w.ownerName.toLowerCase().includes(query) ||
      w.phone.includes(query)
    );

    renderTable(filtered);
  }

  function renderTable(warungs) {
    warungTableBody.innerHTML = '';

    if (warungs.length === 0) {
      warungTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 30px; color: var(--text-muted);">Belum ada warung terdaftar.</td></tr>`;
      return;
    }

    warungs.forEach(w => {
      const tr = document.createElement('tr');

      let badgeClass = 'badge-aktif';
      if (w.status === KaiSerCore.STATUS.SUSPEND) badgeClass = 'badge-suspend';
      if (w.status === KaiSerCore.STATUS.EXPIRED || w.status === KaiSerCore.STATUS.NONAKTIF) badgeClass = 'badge-nonaktif';

      const expiredDateStr = w.expiredAt ? new Date(w.expiredAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';
      const adminCount = (w.admins || []).length;
      const quota = w.adminQuota || 2;
      const pendingReqs = w.pendingRequests || [];

      let pendingBtnHTML = '';
      if (pendingReqs.length > 0) {
        pendingReqs.forEach(req => {
          pendingBtnHTML += `
            <div style="margin-top: 4px;">
              <button class="btn-primary" style="background: #10b981; font-size: 11px; padding: 4px 8px;" onclick="approveExtraAdmin('${w.id}', '${req.id}')">
                ✅ Setujui +1 Admin (Rp 50rb)
              </button>
            </div>
          `;
        });
      }

      let quickActivateBtnHTML = '';
      if (w.status === 'NONAKTIF' || w.status === 'SUSPEND' || w.status === 'EXPIRED') {
        quickActivateBtnHTML = `
          <div style="margin-top: 4px;">
            <button class="btn-primary" style="background: #10b981; font-size: 11px; padding: 4px 8px; width: 100%;" onclick="changeWarungStatusDirect('${w.id}', 'AKTIF')">
              🟢 1-KLIK AKTIFKAN AKUN
            </button>
          </div>
        `;
      }

      tr.innerHTML = `
        <td><span class="warung-id-tag">${w.id}</span></td>
        <td>
          <strong style="color: var(--dark-ocean); font-size: 14px;">${escapeHtml(w.warungName)}</strong><br>
          <span style="font-size: 12px; color: var(--text-muted);">👤 Owner: ${escapeHtml(w.ownerName)} (${escapeHtml(w.phone)})</span>
        </td>
        <td>
          <code>${escapeHtml(w.password)}</code>
        </td>
        <td>
          <select class="status-select ${badgeClass}" onchange="changeWarungStatusDirect('${w.id}', this.value)" title="Klik untuk mengubah status akun">
            <option value="AKTIF" ${w.status === 'AKTIF' ? 'selected' : ''}>🟢 AKTIF</option>
            <option value="SUSPEND" ${w.status === 'SUSPEND' ? 'selected' : ''}>🟡 SUSPEND</option>
            <option value="NONAKTIF" ${w.status === 'NONAKTIF' ? 'selected' : ''}>🔴 NONAKTIF</option>
          </select>
          <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">👥 ${adminCount}/${quota} Admin</div>
          ${quickActivateBtnHTML}
          ${pendingBtnHTML}
        </td>
        <td>
          <span style="font-size: 12px; font-weight: 700;">🗓️ Expired: ${expiredDateStr}</span><br>
          <span style="font-size: 11px; color: var(--text-muted);">${escapeHtml(w.durationLabel || '1 Bulan')}</span>
          <div style="margin-top: 4px; display: flex; gap: 4px;">
            <button class="btn-secondary" style="font-size: 10px; padding: 2px 6px;" onclick="openExtendModal('${w.id}')">🗓️ Perpanjang</button>
            <button class="btn-secondary" style="font-size: 10px; padding: 2px 6px; color: var(--warning);" title="Kirim WA Pengingat Expired" onclick="openWAReminderModal('${w.id}')">📢 WA Remind</button>
          </div>
        </td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon btn-icon-wa" title="Salin Info Akun WA" onclick="openWAModal('${w.id}')">
              📱
            </button>
            <button class="btn-icon btn-icon-danger" title="Hapus Warung" onclick="deleteWarung('${w.id}')">
              🗑️
            </button>
          </div>
        </td>
      `;

      warungTableBody.appendChild(tr);
    });
  }

  // --- DIRECT STATUS SELECTOR HANDLER ---
  window.changeWarungStatusDirect = (warungId, newStatus) => {
    const res = KaiSerCore.updateWarungStatus(warungId, newStatus);
    if (res.success) {
      showToast(`🎉 Status ${res.warung.warungName} berhasil DI-AKTIFKAN!`, 'success');
      renderDashboard();
    }
  };

  // --- FORM CREATE WARUNG HANDLERS ---
  if (newWarungName) {
    newWarungName.addEventListener('input', () => {
      if (!newWarungId.value || newWarungId.dataset.auto === 'true') {
        newWarungId.value = KaiSerCore.generateWarungId(newWarungName.value);
        newWarungId.dataset.auto = 'true';
      }
    });
  }

  if (newWarungId) {
    newWarungId.addEventListener('input', () => {
      newWarungId.dataset.auto = 'false';
    });
  }

  if (btnGenId) {
    btnGenId.addEventListener('click', () => {
      newWarungId.value = KaiSerCore.generateWarungId(newWarungName.value);
      newWarungId.dataset.auto = 'true';
      showToast('✨ ID Warung dibuat otomatis!', 'info');
    });
  }

  if (btnGenPwd) {
    btnGenPwd.addEventListener('click', () => {
      newPassword.value = KaiSerCore.generateSecurePassword();
      showToast('🔐 Password aman dibuat!', 'info');
    });
  }

  if (createWarungForm) {
    createWarungForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const payload = {
        ownerName: newOwnerName.value,
        warungName: newWarungName.value,
        phone: newPhone.value,
        address: newAddress.value,
        id: newWarungId.value,
        password: newPassword.value,
        duration: newDuration.value,
        status: 'AKTIF'
      };

      const res = KaiSerCore.createWarung(payload);
      if (res.success) {
        showToast(`✅ ${res.message}`, 'success');
        createWarungForm.reset();
        newWarungId.value = '';
        newWarungId.dataset.auto = 'true';
        renderDashboard();
        openWAModal(res.warung.id);
      } else {
        showToast(`⚠️ ${res.message}`, 'error');
      }
    });
  }

  // --- EXTEND SUBSCRIPTION MODAL HANDLERS ---
  window.openExtendModal = (warungId) => {
    const warung = KaiSerCore.getWarungById(warungId);
    if (!warung) return;
    currentExtendWarungId = warungId;
    if (extendWarungName) extendWarungName.textContent = `${warung.warungName} (${warung.id})`;
    if (extendModal) extendModal.classList.add('active');
  };

  if (btnCloseExtendModal) {
    btnCloseExtendModal.addEventListener('click', () => {
      extendModal.classList.remove('active');
    });
  }

  if (btnProcessExtend) {
    btnProcessExtend.addEventListener('click', () => {
      if (!currentExtendWarungId) return;
      const res = KaiSerCore.extendWarungSubscription(currentExtendWarungId, extendDuration.value);
      if (res.success) {
        showToast(`🗓️ ${res.message}`, 'success');
        extendModal.classList.remove('active');
        renderDashboard();
      } else {
        showToast(`⚠️ ${res.message}`, 'error');
      }
    });
  }

  // --- APPROVE EXTRA ADMIN REQUEST ---
  window.approveExtraAdmin = (warungId, requestId) => {
    const res = KaiSerCore.approveExtraAdminRequest(warungId, requestId);
    if (res.success) {
      showToast(`💰 ${res.message}`, 'success');
      renderDashboard();
    }
  };

  // --- SEARCH HANDLER ---
  if (searchWarungInput) {
    searchWarungInput.addEventListener('input', renderDashboard);
  }

  window.deleteWarung = (warungId) => {
    const warung = KaiSerCore.getWarungById(warungId);
    if (!warung) return;

    if (confirm(`Apakah Anda yakin ingin menghapus akun ${warung.warungName} (${warung.id})?`)) {
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

    currentWAPhone = warung.phone ? warung.phone.replace(/[^0-9]/g, '') : '';
    if (currentWAPhone.startsWith('0')) currentWAPhone = '62' + currentWAPhone.slice(1);

    currentWAMessage = KaiSerCore.formatWhatsAppPayload(warung);
    if (waPhoneInput) waPhoneInput.value = warung.phone || '';
    if (waMessagePreview) waMessagePreview.value = currentWAMessage;
    if (waModal) waModal.classList.add('active');
  };

  window.openWAReminderModal = (warungId) => {
    const warung = KaiSerCore.getWarungById(warungId);
    if (!warung) return;

    currentWAPhone = warung.phone ? warung.phone.replace(/[^0-9]/g, '') : '';
    if (currentWAPhone.startsWith('0')) currentWAPhone = '62' + currentWAPhone.slice(1);

    currentWAMessage = KaiSerCore.formatWAReminderPayload(warung);
    if (waPhoneInput) waPhoneInput.value = warung.phone || '';
    if (waMessagePreview) waMessagePreview.value = currentWAMessage;
    if (waModal) waModal.classList.add('active');
  };

  if (btnCloseWaModal) {
    btnCloseWaModal.addEventListener('click', () => {
      waModal.classList.remove('active');
    });
  }

  if (btnOpenWAChat) {
    btnOpenWAChat.addEventListener('click', () => {
      const waUrl = `https://api.whatsapp.com/send?phone=${currentWAPhone}&text=${encodeURIComponent(currentWAMessage)}`;
      window.open(waUrl, '_blank');
    });
  }

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
