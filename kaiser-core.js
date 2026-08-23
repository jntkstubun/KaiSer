/**
 * KaiSer Core Engine (kaiser-core.js)
 * Kasir Simpel, Bisnis Lancar 🌊
 * 
 * Comprehensive SaaS Engine:
 * - Creator Master Auth & Official Pricing
 * - 2-Step Roles: Owner & Admin (Cashier)
 * - Self-Service Registration to WA Admin (+62887435377117)
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

  return {
    STATUS,
    DURATIONS,
    PRICING,
    ADMIN_WA_NUMBER,

    // --- DAILY RESETTING INVOICE COUNTER (RESTARTS AT 00:00 TO #0001) ---
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

    // --- CREATOR AUTHENTICATION ---
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

    // --- BROADCAST ANNOUNCEMENTS ---
    setAnnouncement(message) {
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENT, message ? message.trim() : '');
    },

    getAnnouncement() {
      return localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENT) || '';
    },

    // --- CREATOR WARUNG MANAGEMENT ---
    getWarungs() { return getWarungsList(); },

    getWarungById(warungId) {
      const list = getWarungsList();
      return list.find(w => w.id.toUpperCase() === warungId.toUpperCase()) || null;
    },

    createWarung(data) {
      const list = getWarungsList();
      const cleanId = data.id ? data.id.trim().toUpperCase() : this.generateWarungId(data.warungName);

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
        password: data.password ? data.password.trim() : this.generateSecurePassword(),
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

    // --- SELF-SERVICE NEW USER REGISTRATION ---
    registerWarungSelfService(data) {
      const list = getWarungsList();
      const cleanId = data.id ? data.id.trim().toUpperCase() : this.generateWarungId(data.warungName);

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
        password: data.password ? data.password.trim() : this.generateSecurePassword(),
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

      const passwordToSet = newPassword ? newPassword.trim() : this.generateSecurePassword();
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

    // --- OWNER & ADMIN ROLE LOGIN ---
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

    // --- ADMIN ACCOUNTS & QUOTA ---
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

    // --- PROMO VOUCHERS GENERATOR ---
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

    // --- PURCHASE ORDERS (KULAKAN BARANG) ---
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

    // --- PETTY CASH (KAS KECIL LACI KASIR) ---
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

    // --- STAFF ATTENDANCE & SHIFT CLOCK ---
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

    // --- DAILY SALES WA SUMMARY PAYLOAD GENERATOR ---
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

    // --- KAS BON / CUSTOMER DEBT TRACKER ---
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

    // --- EXPENSE TRACKER ---
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

    // --- CUSTOMER LOYALTY ---
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

    // --- SUPPLIER DIRECTORY ---
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

    // --- STOCK ADJUSTMENT & DAMAGE LOG ---
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

    // --- CSV EXPORTER HELPER ---
    exportTransactionsToCSV(transactions, warungName) {
      let csv = 'No Invoice,Table/Meja,A.N. Pelanggan,Tanggal,Kasir,Jumlah Item,Subtotal,Diskon,Total Belanja,Metode Pembayaran,Catatan\n';
      transactions.forEach(t => {
        const date = new Date(t.date).toLocaleString('id-ID').replace(/,/g, '');
        const cashier = (t.cashier || 'Kasir').replace(/,/g, '');
        const tableNo = (t.tableNo || '-').replace(/,/g, '');
        const customerAN = (t.customerAN || '-').replace(/,/g, '');
        const note = (t.note || '').replace(/,/g, '');
        csv += `"${t.invoiceNo}","${tableNo}","${customerAN}","${date}","${cashier}",${t.items.length},${t.subtotal || t.total},${t.discount || 0},${t.total},"${t.paymentMethod}","${note}"\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Laporan_Penjualan_${warungName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
    },

    // --- GENERATORS & REMINDERS ---
    generateWarungId(warungName) {
      let prefix = 'WARUNG';
      if (warungName && warungName.trim().length > 0) {
        const cleanName = warungName.replace(/^(warung|toko|kedai|kios|depot)\s+/i, '').trim();
        const lettersOnly = cleanName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        if (lettersOnly.length >= 3) prefix = lettersOnly.substring(0, 6);
      }
      const list = getWarungsList();
      let seq = 1;
      let candidate = `${prefix}${String(seq).padStart(3, '0')}`;
      while (list.some(w => w.id === candidate)) {
        seq++;
        candidate = `${prefix}${String(seq).padStart(3, '0')}`;
      }
      return candidate;
    },

    generateSecurePassword() {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
      const symbols = '#@!$';
      let pass = '';
      for (let i = 0; i < 2; i++) pass += chars.charAt(Math.floor(Math.random() * 24));
      pass += symbols.charAt(Math.floor(Math.random() * symbols.length));
      for (let i = 0; i < 3; i++) pass += chars.charAt(24 + Math.floor(Math.random() * 24));
      for (let i = 0; i < 2; i++) pass += chars.charAt(48 + Math.floor(Math.random() * 8));
      return pass;
    },

    formatWhatsAppPayload(warung) {
      const expiredText = warung.expiredAt ? new Date(warung.expiredAt).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' }) : '-';
      return `🌊 *KAI SER — KASIR SIMPEL, BISNIS LANCAR*
━━━━━━━━━━━━━━━━━━━━━━━━━━
Yth. *${warung.ownerName || 'Pemilik Warung'}*
${warung.warungName}

Berikut adalah detail Akun KaiSer Warung Anda:

🔑 *ID WARUNG:* \`${warung.id}\`
🔒 *PASSWORD OWNER:* \`${warung.password}\`
🗓️ *MASA AKTIF:* ${warung.durationLabel || '1 Bulan'} (s/d ${expiredText})
👥 *KUOTA ADMIN:* Max ${warung.adminQuota || 2} Akun Admin Kasir

🌐 *Link Akses Aplikasi:*
https://ilyas0905.github.io/kaiser/warung.html

━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 *Petunjuk Login:*
1. Buka link di atas di HP / Tablet Anda.
2. Pilih Menu **LOGIN OWNER**.
3. Masukkan ID Warung dan Password di atas.
4. Anda dapat membuat hingga ${warung.adminQuota || 2} Akun Admin Kasir sendiri di dalam menu Pengaturan.

_Terima kasih telah menggunakan KaiSer!_ 🚀`;
    },

    formatWAReminderPayload(warung) {
      const expiredText = warung.expiredAt ? new Date(warung.expiredAt).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' }) : '-';
      return `📢 *PENGINGAT PERPANJANGAN LISENSI KAI SER*
━━━━━━━━━━━━━━━━━━━━━━━━━━
Yth. *${warung.ownerName || 'Pemilik Warung'}*
${warung.warungName} (${warung.id})

Kami menginfokan bahwa masa aktif aplikasi KaiSer Anda akan/telah berakhir pada:
🗓️ *Tanggal Expired:* ${expiredText}

Agar layanan kasir POS tetap berjalan lancar tanpa kendala, silakan hubungi kami untuk melakukan perpanjangan lisensi:
• 1 Bulan : Rp 15.000
• 3 Bulan : Rp 40.000
• 6 Bulan : Rp 75.000
• 1 Tahun : Rp 140.000

_Terima kasih atas kepercayaan Anda menggunakan KaiSer POS!_ 🌊`;
    }
  };
})();
