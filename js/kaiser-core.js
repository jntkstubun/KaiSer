/**
 * KaiSer Core Engine (kaiser-core.js)
 * Kasir Simpel, Bisnis Lancar 🌊
 * 
 * Comprehensive SaaS Engine:
 * - Creator Master Auth & Official Pricing
 * - 2-Step Roles: Owner & Admin (Cashier)
 * - Self-Service Registration to WA Admin (+62887435377117)
 * - WA Message Auto-Importer & Quick Activation Engine
 * - Daily Resetting Invoice Counter (Reset 00:00 to #0001)
 * - Table / Meja Number Support (Cafes, Restaurants, Warungs)
 * - A.N. Customer / Account Holder Name Tracking
 * - Admin Quotas & Extra Approvals (Rp 50.000)
 * - Broadcast Announcements System
 * - Customer Debt / Kas Bon Tracker
 * - Expense Tracker & Petty Cash (Kas Kecil Laci)
 * - Customer Loyalty & Rewards Points Engine
 * - Supplier Directory & Stock Opname / Damage Adjustments
 * - Promo Voucher / Coupon Generator
 * - Purchase Orders (Nota Kulakan Supplier)
 * - Staff Attendance & Cashier Commission Tracking
 * - Daily WA Sales Summary Payload Generator
 * - Shift Recap Engine & CSV Exporter
 */

const KaiSerCore = (() => {
  const STORAGE_KEYS = {
    CREATOR_SESSION: 'kaiser_creator_session',
    WARUNGS: 'kaiser_warungs_db',
    WARUNG_SESSION: 'kaiser_warung_session',
    ANNOUNCEMENT: 'kaiser_global_announcement'
  };

  const MASTER_CREATOR = {
    username: 'ilyas0905',
    passwordHash: btoa('imamakbar199817'),
    name: 'Ilyas (Creator)'
  };

  const ADMIN_WA_NUMBER = '62887435377117';

  const STATUS = {
    AKTIF: 'AKTIF',
    SUSPEND: 'SUSPEND',
    NONAKTIF: 'NONAKTIF',
    EXPIRED: 'EXPIRED'
  };

  const DURATIONS = {
    MONTH_1: '1_MONTH',
    MONTH_3: '3_MONTHS',
    MONTH_6: '6_MONTHS',
    YEAR_1: '1_YEAR'
  };

  const PRICING = {
    '1_MONTH': { label: '1 Bulan', price: 15000, priceFormatted: 'Rp 15.000' },
    '3_MONTHS': { label: '3 Bulan', price: 40000, priceFormatted: 'Rp 40.000' },
    '6_MONTHS': { label: '6 Bulan', price: 75000, priceFormatted: 'Rp 75.000' },
    '1_YEAR': { label: '1 Tahun', price: 140000, priceFormatted: 'Rp 140.000' }
  };

  function calculateExpiration(duration, baseDate = new Date()) {
    const d = new Date(baseDate);
    switch (duration) {
      case DURATIONS.MONTH_1: d.setDate(d.getDate() + 30); break;
      case DURATIONS.MONTH_3: d.setDate(d.getDate() + 90); break;
      case DURATIONS.MONTH_6: d.setDate(d.getDate() + 180); break;
      case DURATIONS.YEAR_1: d.setDate(d.getDate() + 365); break;
      default: d.setDate(d.getDate() + 30);
    }
    return d.toISOString();
  }

  function initSeedData() {
    if (!localStorage.getItem(STORAGE_KEYS.WARUNGS)) {
      const now = new Date();
      const initialWarungs = [
        {
          id: 'BERKAH001',
          ownerName: 'Ahmad Supardi',
          warungName: 'Warung Berkah',
          phone: '081234567890',
          address: 'Jl. Merdeka No. 45, Jakarta',
          password: 'Bk#2026@001',
          status: STATUS.AKTIF,
          createdAt: new Date(now - 30 * 86400000).toISOString(),
          expiredAt: new Date(now.getTime() + 335 * 86400000).toISOString(),
          durationLabel: '1 Tahun (Rp 140.000)',
          adminQuota: 2,
          admins: [
            { id: 'ADM001', name: 'Siti Kasir 1', password: '123', createdAt: new Date().toISOString() },
            { id: 'ADM002', name: 'Budi Kasir 2', password: '123', createdAt: new Date().toISOString() }
          ],
          pendingRequests: [],
          debts: [
            { id: 'BON001', customerName: 'Pak Joko', phone: '0812334455', amount: 45000, note: 'Rokok & Kopi', date: new Date().toISOString(), status: 'BELUM_LUNAS' }
          ],
          expenses: [
            { id: 'EXP001', title: 'Listrik Toko Bulan Ini', category: 'Listrik', amount: 150000, date: new Date().toISOString() }
          ],
          pettyCash: [
            { id: 'PETTY001', note: 'Bayar Parkir Sales Indofood', amount: 5000, date: new Date().toISOString() }
          ],
          customers: [
            { id: 'CUST001', name: 'Bu Ani', phone: '0813998877', points: 120, totalSpend: 1200000 }
          ],
          suppliers: [
            { id: 'SUP001', name: 'PT Indofood Sukses', salesName: 'Bambang', phone: '0812990011', category: 'Sembako & Mie' }
          ],
          stockAdjustments: [
            { id: 'ADJ001', productName: 'Es Teh Manis', qty: -2, reason: 'RUSAK / BOCOR', date: new Date().toISOString() }
          ],
          vouchers: [
            { id: 'VOUCH001', code: 'BERKAH10K', type: 'FLAT', amount: 10000, minSpend: 50000, status: 'AKTIF' }
          ],
          purchaseOrders: [
            { id: 'PO001', supplierName: 'PT Indofood Sukses', invoiceNo: 'NOTA-9981', total: 450000, date: new Date().toISOString() }
          ],
          attendance: [
            { id: 'ATT001', cashierName: 'Siti Kasir 1', clockIn: new Date(now - 8 * 3600000).toISOString(), clockOut: new Date().toISOString() }
          ]
        }
      ];
      localStorage.setItem(STORAGE_KEYS.WARUNGS, JSON.stringify(initialWarungs));
    }
  }

  initSeedData();

  function getWarungsList() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WARUNGS);
      const list = data ? JSON.parse(data) : [];
      const now = new Date();
      let changed = false;

      list.forEach(w => {
        if (w.expiredAt && new Date(w.expiredAt) < now && w.status === STATUS.AKTIF) {
          w.status = STATUS.EXPIRED;
          changed = true;
        }
      });
      if (changed) saveWarungsList(list);
      return list;
    } catch (e) {
      console.error('Failed to read warungs list', e);
      return [];
    }
  }

  function saveWarungsList(list) {
    localStorage.setItem(STORAGE_KEYS.WARUNGS, JSON.stringify(list));
  }

  function generateWarungId(name) {
    if (!name) return 'WARUNG' + Math.floor(100 + Math.random() * 900);
    const clean = name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 10);
    const num = Math.floor(10 + Math.random() * 90);
    return clean + num;
  }

  function generateSecurePassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let pwd = 'Bk#';
    for (let i = 0; i < 6; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pwd;
  }

  return {
    STATUS,
    DURATIONS,
    PRICING,
    ADMIN_WA_NUMBER,
    generateWarungId,
    generateSecurePassword,

    generateDailyInvoiceNo(warungId) {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const date = String(now.getDate()).padStart(2, '0');
      const todayStr = `${year}${month}${date}`;

      const key = `kaiser_inv_counter_${warungId}`;
      let counterData = { date: todayStr, seq: 0 };

      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.date === todayStr) {
            counterData = parsed;
          }
        }
      } catch (e) {}

      counterData.seq += 1;
      counterData.date = todayStr;
      localStorage.setItem(key, JSON.stringify(counterData));

      const formattedSeq = String(counterData.seq).padStart(4, '0');
      return `INV/${todayStr}-${formattedSeq}`;
    },

    loginCreator(username, password) {
      if (!username || !password) return { success: false, message: 'ID Creator dan Password harus diisi!' };
      const inputUser = username.trim().toLowerCase();
      const inputHash = btoa(password);

      if (inputUser === MASTER_CREATOR.username.toLowerCase() && inputHash === MASTER_CREATOR.passwordHash) {
        const session = { username: MASTER_CREATOR.username, name: MASTER_CREATOR.name, loginTime: new Date().toISOString() };
        localStorage.setItem(STORAGE_KEYS.CREATOR_SESSION, JSON.stringify(session));
        return { success: true, user: session };
      } else {
        return { success: false, message: 'ID Creator atau Password salah!' };
      }
    },

    getCreatorSession() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.CREATOR_SESSION);
        return data ? JSON.parse(data) : null;
      } catch (e) { return null; }
    },

    logoutCreator() {
      localStorage.removeItem(STORAGE_KEYS.CREATOR_SESSION);
    },

    setAnnouncement(message) {
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENT, message ? message.trim() : '');
    },

    getAnnouncement() {
      return localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENT) || '';
    },

    getWarungs() { return getWarungsList(); },

    getWarungById(warungId) {
      const list = getWarungsList();
      return list.find(w => w.id.toUpperCase() === warungId.toUpperCase()) || null;
    },

    createWarung(data) {
      const list = getWarungsList();
      const cleanId = data.id ? data.id.trim().toUpperCase() : generateWarungId(data.warungName);

      if (list.some(w => w.id === cleanId)) {
        return { success: false, message: `ID Warung ${cleanId} sudah digunakan!` };
      }

      const now = new Date();
      const durationCode = data.duration || DURATIONS.MONTH_1;
      const expiredAt = calculateExpiration(durationCode, now);
      const pkgInfo = PRICING[durationCode] || PRICING['1_MONTH'];
      const durationLabel = `${pkgInfo.label} (${pkgInfo.priceFormatted})`;

      const newWarung = {
        id: cleanId,
        ownerName: data.ownerName ? data.ownerName.trim() : '-',
        warungName: data.warungName ? data.warungName.trim() : 'Warung KaiSer',
        phone: data.phone ? data.phone.trim() : '-',
        address: data.address ? data.address.trim() : '-',
        password: data.password ? data.password.trim() : generateSecurePassword(),
        status: data.status || STATUS.AKTIF,
        createdAt: now.toISOString(),
        expiredAt: expiredAt,
        durationLabel: durationLabel,
        adminQuota: 2,
        admins: [],
        pendingRequests: [],
        debts: [],
        expenses: [],
        pettyCash: [],
        customers: [],
        suppliers: [],
        stockAdjustments: [],
        vouchers: [],
        purchaseOrders: [],
        attendance: []
      };

      list.unshift(newWarung);
      saveWarungsList(list);

      return { success: true, warung: newWarung, message: `Akun ${newWarung.warungName} (${newWarung.id}) berhasil dibuat! Paket: ${durationLabel}.` };
    },

    registerWarungSelfService(data) {
      const list = getWarungsList();
      const cleanId = data.id ? data.id.trim().toUpperCase() : generateWarungId(data.warungName);

      if (list.some(w => w.id === cleanId)) {
        return { success: false, message: `ID Warung ${cleanId} sudah digunakan! Silakan gunakan ID lain.` };
      }

      const now = new Date();
      const durationCode = data.duration || DURATIONS.MONTH_1;
      const expiredAt = calculateExpiration(durationCode, now);
      const pkgInfo = PRICING[durationCode] || PRICING['1_MONTH'];
      const durationLabel = `${pkgInfo.label} (${pkgInfo.priceFormatted})`;

      const newWarung = {
        id: cleanId,
        ownerName: data.ownerName ? data.ownerName.trim() : '-',
        warungName: data.warungName ? data.warungName.trim() : 'Warung KaiSer',
        phone: data.phone ? data.phone.trim() : '-',
        address: data.address ? data.address.trim() : '-',
        password: data.password ? data.password.trim() : generateSecurePassword(),
        status: STATUS.NONAKTIF,
        createdAt: now.toISOString(),
        expiredAt: expiredAt,
        durationLabel: durationLabel,
        adminQuota: 2,
        admins: [],
        pendingRequests: [],
        debts: [],
        expenses: [],
        pettyCash: [],
        customers: [],
        suppliers: [],
        stockAdjustments: [],
        vouchers: [],
        purchaseOrders: [],
        attendance: []
      };

      list.unshift(newWarung);
      saveWarungsList(list);

      const waText = `Yth. Admin KaiSer POS,

Halo Admin, saya ingin mengajukan aktivasi Akun KaiSer Warung baru dengan rincian berikut:

📋 *DETAIL PENDAFTARAN AKUN WARUNG*
━━━━━━━━━━━━━━━━━━━━━━━━━━
• Nama Pemilik : ${newWarung.ownerName}
• Nama Usaha   : ${newWarung.warungName}
• ID Warung    : \`${newWarung.id}\`
• Password     : \`${newWarung.password}\`
• No. Telepon  : ${newWarung.phone}
• Alamat       : ${newWarung.address}
• Paket Durasi : ${pkgInfo.label} (${pkgInfo.priceFormatted})

Mohon informasi petunjuk dan instruksi pembayaran sebesar *${pkgInfo.priceFormatted}* untuk aktivasi akun saya ya Min.

Terima kasih! 🌊`;

      return {
        success: true,
        warung: newWarung,
        waText: waText,
        waUrl: `https://api.whatsapp.com/send?phone=${ADMIN_WA_NUMBER}&text=${encodeURIComponent(waText)}`,
        message: 'Pendaftaran berhasil! Akun tersimpan dengan status NONAKTIF. Mengalihkan ke WhatsApp Admin...'
      };
    },

    // --- AUTO PARSE & IMPORT REGISTRATION PAYLOAD FROM WA TEXT ---
    parseAndImportWAMessage(waText, autoActivate = false) {
      if (!waText || !waText.trim()) {
        return { success: false, message: 'Teks pesan WhatsApp tidak boleh kosong!' };
      }

      const ownerMatch = waText.match(/•\s*Nama Pemilik\s*:\s*(.+)/i);
      const warungMatch = waText.match(/•\s*Nama Usaha\s*:\s*(.+)/i);
      const idMatch = waText.match(/•\s*ID Warung\s*:\s*[`"]?([^`"\n\r]+)[`"]?/i);
      const pwdMatch = waText.match(/•\s*Password\s*:\s*[`"]?([^`"\n\r]+)[`"]?/i);
      const phoneMatch = waText.match(/•\s*No\.?\s*Telepon\s*:\s*(.+)/i);
      const addressMatch = waText.match(/•\s*Alamat\s*:\s*(.+)/i);
      const durationMatch = waText.match(/•\s*Paket Durasi\s*:\s*(.+)/i);

      if (!warungMatch && !idMatch) {
        return { success: false, message: 'Format teks pesan WA tidak dikenali! Pastikan menyalin dari pesan pendaftaran resmi.' };
      }

      const list = getWarungsList();
      const warungName = warungMatch ? warungMatch[1].trim() : 'Warung Baru';
      const cleanId = idMatch ? idMatch[1].trim().toUpperCase() : generateWarungId(warungName);
      const existing = list.find(w => w.id === cleanId);

      if (existing) {
        if (autoActivate) {
          existing.status = STATUS.AKTIF;
          saveWarungsList(list);
          return { success: true, warung: existing, message: `Akun ${existing.warungName} (${existing.id}) yang terdaftar berhasil DI-AKTIFKAN!` };
        } else {
          return { success: true, warung: existing, message: `Akun ${existing.warungName} (${existing.id}) sudah ada dalam daftar (Status: ${existing.status}).` };
        }
      }

      const ownerName = ownerMatch ? ownerMatch[1].trim() : '-';
      const phone = phoneMatch ? phoneMatch[1].trim() : '-';
      const address = addressMatch ? addressMatch[1].trim() : '-';
      const password = pwdMatch ? pwdMatch[1].trim() : generateSecurePassword();

      let durationCode = DURATIONS.YEAR_1;
      let durationLabel = '1 Tahun (Rp 140.000)';

      if (durationMatch) {
        const dText = durationMatch[1].toLowerCase();
        if (dText.includes('1 bulan')) { durationCode = DURATIONS.MONTH_1; durationLabel = '1 Bulan (Rp 15.000)'; }
        else if (dText.includes('3 bulan')) { durationCode = DURATIONS.MONTH_3; durationLabel = '3 Bulan (Rp 40.000)'; }
        else if (dText.includes('6 bulan')) { durationCode = DURATIONS.MONTH_6; durationLabel = '6 Bulan (Rp 75.000)'; }
      }

      const now = new Date();
      const expiredAt = calculateExpiration(durationCode, now);

      const newWarung = {
        id: cleanId,
        ownerName: ownerName,
        warungName: warungName,
        phone: phone,
        address: address,
        password: password,
        status: autoActivate ? STATUS.AKTIF : STATUS.NONAKTIF,
        createdAt: now.toISOString(),
        expiredAt: expiredAt,
        durationLabel: durationLabel,
        adminQuota: 2,
        admins: [],
        pendingRequests: [],
        debts: [], expenses: [], pettyCash: [], customers: [], suppliers: [], stockAdjustments: [], vouchers: [], purchaseOrders: [], attendance: []
      };

      list.unshift(newWarung);
      saveWarungsList(list);

      return {
        success: true,
        warung: newWarung,
        message: `Akun ${newWarung.warungName} (${newWarung.id}) berhasil diimpor dari WA & ${autoActivate ? 'DI-AKTIFKAN' : 'disimpan sebagai NONAKTIF'}!`
      };
    },

    extendWarungSubscription(warungId, durationCode) {
      const list = getWarungsList();
      const index = list.findIndex(w => w.id.toUpperCase() === warungId.toUpperCase());
      if (index === -1) return { success: false, message: 'Warung tidak ditemukan!' };

      const warung = list[index];
      const baseDate = (new Date(warung.expiredAt) > new Date()) ? new Date(warung.expiredAt) : new Date();
      const newExpiredAt = calculateExpiration(durationCode, baseDate);
      const pkgInfo = PRICING[durationCode] || PRICING['1_MONTH'];
      const durationLabel = `${pkgInfo.label} (${pkgInfo.priceFormatted})`;

      warung.expiredAt = newExpiredAt;
      warung.durationLabel = durationLabel;
      warung.status = STATUS.AKTIF;

      saveWarungsList(list);
      return { success: true, warung, message: `Masa aktif ${warung.warungName} diperpanjang +${durationLabel}. Expired: ${new Date(newExpiredAt).toLocaleDateString('id-ID')}` };
    },

    updateWarungStatus(warungId, newStatus) {
      const list = getWarungsList();
      const index = list.findIndex(w => w.id.toUpperCase() === warungId.toUpperCase());
      if (index === -1) return { success: false, message: 'Warung tidak ditemukan!' };

      list[index].status = newStatus;
      saveWarungsList(list);
      return { success: true, warung: list[index], message: `Status ${list[index].warungName} diubah menjadi ${newStatus}.` };
    },

    resetWarungPassword(warungId, newPassword) {
      const list = getWarungsList();
      const index = list.findIndex(w => w.id.toUpperCase() === warungId.toUpperCase());
      if (index === -1) return { success: false, message: 'Warung tidak ditemukan!' };

      const passwordToSet = newPassword ? newPassword.trim() : generateSecurePassword();
      list[index].password = passwordToSet;
      saveWarungsList(list);
      return { success: true, password: passwordToSet, warung: list[index] };
    },

    deleteWarung(warungId) {
      let list = getWarungsList();
      list = list.filter(w => w.id.toUpperCase() !== warungId.toUpperCase());
      saveWarungsList(list);
      return { success: true, message: 'Akun Warung telah dihapus.' };
    },

    loginOwner(warungId, password) {
      const warung = this.getWarungById(warungId);
      if (!warung) return { success: false, message: 'ID Warung tidak ditemukan!' };
      if (warung.password !== password) return { success: false, message: 'Password Owner salah!' };
      if (warung.status === STATUS.SUSPEND) return { success: false, message: 'Akun ditangguhkan (SUSPEND). Hubungi Creator.' };
      if (warung.status === STATUS.EXPIRED) return { success: false, message: 'Masa aktif akun telah KADALUARSA/EXPIRED! Hubungi Creator untuk perpanjang.' };
      if (warung.status === STATUS.NONAKTIF) return { success: false, message: 'Akun masih NONAKTIF. Hubungi Admin via WhatsApp (+62887435377117) untuk aktivasi.' };

      return { success: true, role: 'OWNER', warung };
    },

    loginAdmin(warungId, adminId, password) {
      const warung = this.getWarungById(warungId);
      if (!warung) return { success: false, message: 'ID Warung tidak ditemukan!' };
      if (warung.status !== STATUS.AKTIF) return { success: false, message: `Status akun warung: ${warung.status}` };

      const admin = (warung.admins || []).find(a => a.id.toLowerCase() === adminId.toLowerCase());
      if (!admin) return { success: false, message: 'ID Admin Kasir tidak ditemukan di warung ini!' };
      if (admin.password !== password) return { success: false, message: 'Password Admin salah!' };

      return { success: true, role: 'ADMIN', warung, admin };
    },

    createAdminAccount(warungId, adminName, adminPassword) {
      const list = getWarungsList();
      const index = list.findIndex(w => w.id.toUpperCase() === warungId.toUpperCase());
      if (index === -1) return { success: false, message: 'Warung tidak ditemukan!' };

      const warung = list[index];
      warung.admins = warung.admins || [];
      warung.pendingRequests = warung.pendingRequests || [];

      if (warung.admins.length >= warung.adminQuota) {
        const reqId = 'REQ_' + Date.now();
        const request = {
          id: reqId,
          adminName: adminName.trim(),
          adminPassword: adminPassword.trim(),
          fee: 50000,
          status: 'PENDING',
          requestedAt: new Date().toISOString()
        };
        warung.pendingRequests.push(request);
        saveWarungsList(list);

        return { 
          success: false, 
          needsApproval: true, 
          message: `Kuota Akun Admin tercapai (${warung.adminQuota}/${warung.adminQuota}). Permintaan penambahan Admin telah dikirim ke Creator (Biaya Rp 50.000).` 
        };
      }

      const newAdminId = 'ADM' + String(warung.admins.length + 1).padStart(3, '0');
      const newAdmin = {
        id: newAdminId,
        name: adminName.trim(),
        password: adminPassword.trim(),
        createdAt: new Date().toISOString()
      };

      warung.admins.push(newAdmin);
      saveWarungsList(list);

      return { success: true, admin: newAdmin, message: `Akun Admin Kasir ${newAdmin.name} (${newAdmin.id}) berhasil dibuat!` };
    },

    approveExtraAdminRequest(warungId, requestId) {
      const list = getWarungsList();
      const index = list.findIndex(w => w.id.toUpperCase() === warungId.toUpperCase());
      if (index === -1) return { success: false, message: 'Warung tidak ditemukan!' };

      const warung = list[index];
      const reqIndex = (warung.pendingRequests || []).findIndex(r => r.id === requestId);
      if (reqIndex === -1) return { success: false, message: 'Permintaan tidak ditemukan!' };

      const req = warung.pendingRequests[reqIndex];
      warung.adminQuota += 1;
      
      const newAdminId = 'ADM' + String(warung.admins.length + 1).padStart(3, '0');
      warung.admins.push({
        id: newAdminId,
        name: req.adminName,
        password: req.adminPassword,
        createdAt: new Date().toISOString()
      });

      warung.pendingRequests.splice(reqIndex, 1);
      saveWarungsList(list);

      return { success: true, message: `Permintaan Tambah Admin Rp 50.000 untuk ${warung.warungName} disetujui!` };
    },

    deleteAdminAccount(warungId, adminId) {
      const list = getWarungsList();
      const index = list.findIndex(w => w.id.toUpperCase() === warungId.toUpperCase());
      if (index === -1) return { success: false, message: 'Warung tidak ditemukan!' };

      const warung = list[index];
      warung.admins = (warung.admins || []).filter(a => a.id.toLowerCase() !== adminId.toLowerCase());
      saveWarungsList(list);

      return { success: true, message: 'Akun Admin telah dihapus.' };
    },

    addVoucher(warungId, code, type, amount, minSpend) {
      const list = getWarungsList();
      const index = list.findIndex(w => w.id.toUpperCase() === warungId.toUpperCase());
      if (index === -1) return { success: false, message: 'Warung tidak ditemukan!' };

      const warung = list[index];
      warung.vouchers = warung.vouchers || [];
      const cleanCode = code.trim().toUpperCase();

      if (warung.vouchers.some(v => v.code === cleanCode)) {
        return { success: false, message: `Kode Voucher ${cleanCode} sudah ada!` };
      }

      const newVoucher = {
        id: 'VOUCH_' + Date.now(),
        code: cleanCode,
        type: type || 'FLAT',
        amount: parseInt(amount, 10) || 0,
        minSpend: parseInt(minSpend, 10) || 0,
        status: 'AKTIF',
        createdAt: new Date().toISOString()
      };

      warung.vouchers.unshift(newVoucher);
      saveWarungsList(list);
      return { success: true, voucher: newVoucher, message: `Voucher Promo ${newVoucher.code} berhasil dibuat!` };
    },

    deleteVoucher(warungId, voucherId) {
      const list = getWarungsList();
      const index = list.findIndex(w => w.id.toUpperCase() === warungId.toUpperCase());
      if (index === -1) return { success: false, message: 'Warung tidak ditemukan!' };

      const warung = list[index];
      warung.vouchers = (warung.vouchers || []).filter(v => v.id !== voucherId);
      saveWarungsList(list);
      return { success: true, message: 'Voucher telah dihapus.' };
    },

    addPurchaseOrder(warungId, supplierName, invoiceNo, total) {
      const list = getWarungsList();
      const index = list.findIndex(w => w.id.toUpperCase() === warungId.toUpperCase());
      if (index === -1) return { success: false, message: 'Warung tidak ditemukan!' };

      const warung = list[index];
      warung.purchaseOrders = warung.purchaseOrders || [];

      const newPO = {
        id: 'PO_' + Date.now(),
        supplierName: supplierName.trim(),
        invoiceNo: invoiceNo ? invoiceNo.trim() : 'NOTA-' + Math.floor(1000 + Math.random() * 9000),
        total: parseInt(total, 10) || 0,
        date: new Date().toISOString()
      };

      warung.purchaseOrders.unshift(newPO);
      saveWarungsList(list);
      return { success: true, po: newPO, message: `Nota Kulakan ${newPO.invoiceNo} dari ${newPO.supplierName} dicatat!` };
    },

    addPettyCash(warungId, note, amount) {
      const list = getWarungsList();
      const index = list.findIndex(w => w.id.toUpperCase() === warungId.toUpperCase());
      if (index === -1) return { success: false, message: 'Warung tidak ditemukan!' };

      const warung = list[index];
      warung.pettyCash = warung.pettyCash || [];

      const newPetty = {
        id: 'PETTY_' + Date.now(),
        note: note.trim(),
        amount: parseInt(amount, 10) || 0,
        date: new Date().toISOString()
      };

      warung.pettyCash.unshift(newPetty);
      saveWarungsList(list);
      return { success: true, petty: newPetty, message: `Pengambilan kas kecil Rp ${new Intl.NumberFormat('id-ID').format(newPetty.amount)} dicatat!` };
    },

    recordAttendance(warungId, cashierName, actionType) {
      const list = getWarungsList();
      const index = list.findIndex(w => w.id.toUpperCase() === warungId.toUpperCase());
      if (index === -1) return { success: false, message: 'Warung tidak ditemukan!' };

      const warung = list[index];
      warung.attendance = warung.attendance || [];
      const now = new Date().toISOString();

      if (actionType === 'CLOCK_IN') {
        const newAtt = {
          id: 'ATT_' + Date.now(),
          cashierName: cashierName,
          clockIn: now,
          clockOut: null
        };
        warung.attendance.unshift(newAtt);
        saveWarungsList(list);
        return { success: true, message: `⏰ Absensi Masuk ${cashierName} berhasil dicatat!` };
      } else {
        const last = warung.attendance.find(a => a.cashierName === cashierName && !a.clockOut);
        if (last) {
          last.clockOut = now;
          saveWarungsList(list);
          return { success: true, message: `⏰ Absensi Pulang ${cashierName} berhasil dicatat!` };
        } else {
          return { success: false, message: 'Belum ada absensi masuk untuk kasir ini!' };
        }
      }
    },

    generateDailyWASummaryPayload(warung, transactions, expenses, pettyCash) {
      const todayStr = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      const todayTxs = transactions.filter(t => new Date(t.date).toDateString() === new Date().toDateString());
      
      let totalOmset = 0;
      let totalModal = 0;
      todayTxs.forEach(t => {
        totalOmset += t.total;
        t.items.forEach(i => totalModal += (i.costPrice || 0) * i.qty);
      });

      const todayExp = (expenses || []).filter(e => new Date(e.date).toDateString() === new Date().toDateString()).reduce((sum, e) => sum + e.amount, 0);
      const todayPetty = (pettyCash || []).filter(p => new Date(p.date).toDateString() === new Date().toDateString()).reduce((sum, p) => sum + p.amount, 0);
      const netProfit = totalOmset - totalModal - todayExp - todayPetty;

      return `📊 *LAPORAN PENJUALAN HARIAN ${warung.warungName.toUpperCase()}*
📅 Hari/Tgl : ${todayStr}
━━━━━━━━━━━━━━━━━━━━━━━━━━

💵 *Omset Kotor   :* Rp ${new Intl.NumberFormat('id-ID').format(totalOmset)}
🧾 *Total Transaksi:* ${todayTxs.length} Transaksi
💸 *Pengeluaran   :* Rp ${new Intl.NumberFormat('id-ID').format(todayExp + todayPetty)}
📈 *LABA BERSIH   :* *Rp ${new Intl.NumberFormat('id-ID').format(netProfit)}*

━━━━━━━━━━━━━━━━━━━━━━━━━━
_Laporan otomatis dikirim dari KaiSer POS System_ 🌊`;
    },

    addKasBon(warungId, customerName, phone, amount, note) {
      const list = getWarungsList();
      const index = list.findIndex(w => w.id.toUpperCase() === warungId.toUpperCase());
      if (index === -1) return { success: false, message: 'Warung tidak ditemukan!' };

      const warung = list[index];
      warung.debts = warung.debts || [];

      const newBon = {
        id: 'BON_' + Date.now(),
        customerName: customerName.trim(),
        phone: phone ? phone.trim() : '-',
        amount: parseInt(amount, 10) || 0,
        note: note ? note.trim() : '',
        date: new Date().toISOString(),
        status: 'BELUM_LUNAS'
      };

      warung.debts.unshift(newBon);
      saveWarungsList(list);
      return { success: true, debt: newBon, message: `Kas Bon ${newBon.customerName} sebesar Rp ${new Intl.NumberFormat('id-ID').format(newBon.amount)} telah dicatat.` };
    },

    payKasBon(warungId, bonId) {
      const list = getWarungsList();
      const index = list.findIndex(w => w.id.toUpperCase() === warungId.toUpperCase());
      if (index === -1) return { success: false, message: 'Warung tidak ditemukan!' };

      const warung = list[index];
      const bon = (warung.debts || []).find(b => b.id === bonId);
      if (!bon) return { success: false, message: 'Data bon tidak ditemukan!' };

      bon.status = 'LUNAS';
      bon.paidAt = new Date().toISOString();
      saveWarungsList(list);

      return { success: true, message: `Kas Bon ${bon.customerName} telah DILUNASI!` };
    },

    addExpense(warungId, title, category, amount) {
      const list = getWarungsList();
      const index = list.findIndex(w => w.id.toUpperCase() === warungId.toUpperCase());
      if (index === -1) return { success: false, message: 'Warung tidak ditemukan!' };

      const warung = list[index];
      warung.expenses = warung.expenses || [];

      const newExp = {
        id: 'EXP_' + Date.now(),
        title: title.trim(),
        category: category || 'Lainnya',
        amount: parseInt(amount, 10) || 0,
        date: new Date().toISOString()
      };

      warung.expenses.unshift(newExp);
      saveWarungsList(list);
      return { success: true, expense: newExp, message: `Pengeluaran ${newExp.title} (Rp ${new Intl.NumberFormat('id-ID').format(newExp.amount)}) dicatat.` };
    },

    deleteExpense(warungId, expId) {
      const list = getWarungsList();
      const index = list.findIndex(w => w.id.toUpperCase() === warungId.toUpperCase());
      if (index === -1) return { success: false, message: 'Warung tidak ditemukan!' };

      const warung = list[index];
      warung.expenses = (warung.expenses || []).filter(e => e.id !== expId);
      saveWarungsList(list);
      return { success: true, message: 'Catatan pengeluaran dihapus.' };
    },

    addCustomerMember(warungId, name, phone) {
      const list = getWarungsList();
      const index = list.findIndex(w => w.id.toUpperCase() === warungId.toUpperCase());
      if (index === -1) return { success: false, message: 'Warung tidak ditemukan!' };

      const warung = list[index];
      warung.customers = warung.customers || [];

      const cleanPhone = phone ? phone.trim() : '-';
      if (cleanPhone !== '-' && warung.customers.some(c => c.phone === cleanPhone)) {
        return { success: false, message: 'Nomor WA Pelanggan sudah terdaftar!' };
      }

      const newCust = {
        id: 'CUST_' + Date.now(),
        name: name.trim(),
        phone: cleanPhone,
        points: 0,
        totalSpend: 0,
        createdAt: new Date().toISOString()
      };

      warung.customers.unshift(newCust);
      saveWarungsList(list);
      return { success: true, customer: newCust, message: `Pelanggan Setia ${newCust.name} berhasil didaftarkan!` };
    },

    addSupplier(warungId, name, salesName, phone, category) {
      const list = getWarungsList();
      const index = list.findIndex(w => w.id.toUpperCase() === warungId.toUpperCase());
      if (index === -1) return { success: false, message: 'Warung tidak ditemukan!' };

      const warung = list[index];
      warung.suppliers = warung.suppliers || [];

      const newSup = {
        id: 'SUP_' + Date.now(),
        name: name.trim(),
        salesName: salesName ? salesName.trim() : '-',
        phone: phone ? phone.trim() : '-',
        category: category ? category.trim() : 'Umum',
        createdAt: new Date().toISOString()
      };

      warung.suppliers.unshift(newSup);
      saveWarungsList(list);
      return { success: true, supplier: newSup, message: `Pemasok ${newSup.name} berhasil ditambahkan!` };
    },

    deleteSupplier(warungId, supId) {
      const list = getWarungsList();
      const index = list.findIndex(w => w.id.toUpperCase() === warungId.toUpperCase());
      if (index === -1) return { success: false, message: 'Warung tidak ditemukan!' };

      const warung = list[index];
      warung.suppliers = (warung.suppliers || []).filter(s => s.id !== supId);
      saveWarungsList(list);
      return { success: true, message: 'Data pemasok dihapus.' };
    },

    addStockAdjustment(warungId, productName, qtyDelta, reason) {
      const list = getWarungsList();
      const index = list.findIndex(w => w.id.toUpperCase() === warungId.toUpperCase());
      if (index === -1) return { success: false, message: 'Warung tidak ditemukan!' };

      const warung = list[index];
      warung.stockAdjustments = warung.stockAdjustments || [];

      const newAdj = {
        id: 'ADJ_' + Date.now(),
        productName: productName.trim(),
        qty: parseInt(qtyDelta, 10) || 0,
        reason: reason || 'RUSAK',
        date: new Date().toISOString()
      };

      warung.stockAdjustments.unshift(newAdj);
      saveWarungsList(list);
      return { success: true, adjustment: newAdj, message: `Penyesuaian stok ${newAdj.productName} (${newAdj.qty > 0 ? '+' : ''}${newAdj.qty} pcs) berhasil dicatat!` };
    },

    exportTransactionsToCSV(transactions, warungName = 'Warung') {
      let csv = 'No Invoice,Meja/Table,Atas Nama,Waktu,Kasir,Jumlah Item,Total Belanja,Pembayaran,Catatan\n';

      transactions.forEach(t => {
        const cleanNo = `"${t.invoiceNo}"`;
        const cleanTable = `"${t.tableNo || '-'}"`;
        const cleanAN = `"${t.customerAN || '-'}"`;
        const date = `"${new Date(t.date).toLocaleString('id-ID')}"`;
        const cashier = `"${t.cashier || 'Kasir'}"`;
        const count = t.items.length;
        const total = t.total;
        const method = `"${t.paymentMethod}"`;
        const note = `"${t.note || ''}"`;

        csv += `${cleanNo},${cleanTable},${cleanAN},${date},${cashier},${count},${total},${method},${note}\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Laporan_Penjualan_${warungName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
    },

    formatWhatsAppPayload(warung) {
      return `Yth. ${warung.ownerName || 'Pemilik Warung'},

Selamat! Akun KaiSer POS Warung Anda telah resmi aktif. Berikut adalah kredensial login akses sistem Anda:

📋 *DETAIL AKUN KAI SER POS*
━━━━━━━━━━━━━━━━━━━━━━━━━━
• Nama Usaha  : *${warung.warungName}*
• ID Warung   : \`${warung.id}\`
• Status Akun : *${warung.status}*
• Masa Aktif  : *${warung.durationLabel || '1 Tahun'}*
• Expired     : ${warung.expiredAt ? new Date(warung.expiredAt).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' }) : '-'}

🔐 *LOGIN OWNER (PEMILIK)*:
• Password Owner : \`${warung.password}\`

👥 *LOGIN ADMIN (KASIR)*:
• Kuota Admin    : 2 Kasir Gratis
• Tambah Admin   : Dikelola di Menu Pengaturan Owner

🌐 *LINK AKSES POS*:
👉 https://ilyas0905.github.io/kaiser/warung.html

_Terima kasih telah mempercayakan bisnis Anda pada KaiSer POS!_ 🌊`;
    },

    formatWAReminderPayload(warung) {
      const expDate = warung.expiredAt ? new Date(warung.expiredAt).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' }) : '-';
      return `Yth. ${warung.ownerName || 'Pemilik Warung'} (${warung.warungName}),

🔔 *PEMBERITAHUAN MASA AKTIF LISENSI KAI SER POS*

Masa berlaku lisensi akun KaiSer POS usaha Anda (*ID: ${warung.id}*) akan/telah berakhir pada:
📅 *${expDate}*

Untuk memastikan operasional kasir tetap berjalan lancar tanpa gangguan, silakan lakukan perpanjangan paket lisensi:

🗓️ *Pilihan Paket Perpanjangan*:
• 1 Bulan : Rp 15.000
• 3 Bulan : Rp 40.000
• 6 Bulan : Rp 75.000
• 1 Tahun : Rp 140.000 (Hemat 40%)

Mohon balaskan pesan ini untuk mengonfirmasi pilihan perpanjangan Anda. Terima kasih! 🌊`;
    }
  };
})();
