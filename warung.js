/**
 * KaiSer Warung Controller (js/warung.js)
 * Kasir Simpel, Bisnis Lancar OCEAN 🌊
 * Full Suite: Glassmorphic Sidebar Layout (Expand/Collapse), Dual Language (ID/EN), 2-Step Roles, Custom Categories, Daily Invoice Counter (Reset 00:00 #0001), Table/Meja Support, A.N. Customer Tracking, Admin Settings Panel (Printer Thermal 58mm/80mm, Auto-Print, Beep Sound, Cash Drawer), Expenses, Petty Cash, Suppliers, Purchase Orders, Vouchers, Stock Opname, Expiry Alert, Sales Bar Chart, Cashier Commission, Staff Attendance, WA Daily Summary, Shelf Tag Printer, QRIS Display, Hold/Resume Cart, Member Loyalty, Shift Recap, CSV Export
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- I18N DICTIONARY & MULTI-LANGUAGE ENGINE ---
  let currentLang = localStorage.getItem('kaiser_language') || 'id';

  const i18nDict = {
    id: {
      appTitle: 'KaiSer POS',
      slogan: 'Kasir Simpel, Bisnis Lancar',
      chooseAccess: 'Pilih Jenis Akses Masuk',
      loginOwner: '👑 LOGIN OWNER',
      loginAdmin: '👤 LOGIN ADMIN',
      warungIdLabel: 'ID WARUNG (DARI CREATOR)',
      ownerPwdLabel: 'PASSWORD OWNER',
      adminIdLabel: 'ID ADMIN KASIR (DARI OWNER)',
      adminPwdLabel: 'PASSWORD ADMIN',
      btnEnterOwner: '👑 MASUK SEBAGAI OWNER',
      btnEnterAdmin: '👤 MASUK SEBAGAI ADMIN',
      registerLink: '✨ Daftar Pengguna Baru',
      registerTitle: '✨ Form Pendaftaran Pengguna Baru',
      regOwnerName: 'NAMA PEMILIK',
      regWarungName: 'NAMA WARUNG / USAHA',
      regPhone: 'NO TELEPON / WHATSAPP',
      regAddress: 'ALAMAT WARUNG',
      regWarungId: 'ID WARUNG (LOGIN)',
      regPassword: 'PASSWORD OWNER',
      regDuration: 'MASA BERLAKU PAKET & HARGA',
      btnSubmitRegister: '📱 DAFTAR & HUBUNGI ADMIN WA',
      groupPOS: 'MENU POS (UTAMA)',
      groupOps: 'OPERASIONAL & BISNIS',
      groupAnalytics: 'ANALISIS & PENGATURAN',
      tabPos: 'Kasir (POS)',
      tabProduct: 'Produk & Stok',
      tabHistory: 'Riwayat Transaksi',
      tabExpenses: 'Pengeluaran & Kas Kecil',
      tabSuppliers: 'Pemasok & Kulakan',
      tabVoucher: 'Kupon Voucher',
      tabOpname: 'Stok Opname',
      tabKasbon: 'Kas Bon & Piutang',
      tabAttendance: 'Absensi Staf',
      tabCustomers: 'Pelanggan Setia',
      tabReports: 'Laporan & Komisi',
      tabSettings: 'Pengaturan',
      searchPlaceholder: 'Cari nama produk / kode SKU / scan barcode...',
      allCategories: 'Semua Kategori',
      cartTitle: '🛒 Keranjang Belanja',
      btnHold: '⏸️ Tahan',
      btnResume: 'Panggil',
      cartEmpty: 'Keranjang masih kosong.\nKlik produk di sebelah kiri untuk menambah.',
      voucherCode: 'KODE VOUCHER PROMO',
      applyVoucher: 'Gunakan',
      manualDiscount: 'DISKON MANUAL (RP)',
      subtotal: 'Subtotal:',
      total: 'TOTAL:',
      btnCheckout: '🚀 PROSES BAYAR',
      payTitle: '💵 Pembayaran Kasir',
      payTotalHeader: 'TOTAL HARUS DIBAYAR',
      payMethod: 'METODE PEMBAYARAN',
      payTableNo: 'TABLE / MEJA (NO. MEJA / TAKEAWAY)',
      payCustomerAN: 'ATAS NAMA (A.N. PELANGGAN / PEMBAYARAN)',
      payNote: 'CATATAN TRANSAKSI (OPSIONAL)',
      payAmount: 'UANG DITERIMA (RP)',
      payChange: 'KEMBALIAN:',
      btnCompletePay: '✅ SELESAIKAN TRANSAKSI',
      langSettingLabel: '🌐 BAHASA APLIKASI (APPLICATION LANGUAGE)',
      langOptionID: '🇮🇩 Bahasa Indonesia',
      langOptionEN: '🇬🇧 English (Inggris)',
      btnClockInOut: '⏱️ Absensi Kasir',
      btnTutupShift: '📋 Tutup Shift Kasir',
      btnMode: 'Mode',
      btnLogout: '🚪 Keluar'
    },
    en: {
      appTitle: 'KaiSer POS',
      slogan: 'Simple POS, Smooth Business',
      chooseAccess: 'Select Login Access Role',
      loginOwner: '👑 OWNER LOGIN',
      loginAdmin: '👤 ADMIN LOGIN',
      warungIdLabel: 'STORE ID (FROM CREATOR)',
      ownerPwdLabel: 'OWNER PASSWORD',
      adminIdLabel: 'CASHIER ADMIN ID (FROM OWNER)',
      adminPwdLabel: 'ADMIN PASSWORD',
      btnEnterOwner: '👑 LOGIN AS OWNER',
      btnEnterAdmin: '👤 LOGIN AS ADMIN',
      registerLink: '✨ Register New Store Account',
      registerTitle: '✨ New User Registration Form',
      regOwnerName: 'OWNER FULL NAME',
      regWarungName: 'STORE / BUSINESS NAME',
      regPhone: 'PHONE / WHATSAPP NUMBER',
      regAddress: 'STORE ADDRESS',
      regWarungId: 'STORE ID (LOGIN)',
      regPassword: 'OWNER PASSWORD',
      regDuration: 'PACKAGE DURATION & PRICE',
      btnSubmitRegister: '📱 REGISTER & CONTACT ADMIN WA',
      groupPOS: 'POS MENU (MAIN)',
      groupOps: 'OPERATIONS & BUSINESS',
      groupAnalytics: 'ANALYTICS & SETTINGS',
      tabPos: 'Cashier (POS)',
      tabProduct: 'Products & Stock',
      tabHistory: 'Transaction History',
      tabExpenses: 'Expenses & Petty Cash',
      tabSuppliers: 'Suppliers & POs',
      tabVoucher: 'Promo Vouchers',
      tabOpname: 'Stock Audit',
      tabKasbon: 'Debt & Receivables',
      tabAttendance: 'Staff Attendance',
      tabCustomers: 'Member Loyalty',
      tabReports: 'Reports & Commission',
      tabSettings: 'Settings',
      searchPlaceholder: 'Search product name / SKU / scan barcode...',
      allCategories: 'All Categories',
      cartTitle: '🛒 Shopping Cart',
      btnHold: '⏸️ Hold',
      btnResume: 'Resume',
      cartEmpty: 'Cart is currently empty.\nClick items on the left to add.',
      voucherCode: 'PROMO VOUCHER CODE',
      applyVoucher: 'Apply',
      manualDiscount: 'MANUAL DISCOUNT (RP)',
      subtotal: 'Subtotal:',
      total: 'TOTAL:',
      btnCheckout: '🚀 PROCEED TO CHECKOUT',
      payTitle: '💵 Cashier Checkout',
      payTotalHeader: 'TOTAL AMOUNT DUE',
      payMethod: 'PAYMENT METHOD',
      payTableNo: 'TABLE / SEAT NO. (OR TAKEAWAY)',
      payCustomerAN: 'ACCOUNT HOLDER NAME (A.N.)',
      payNote: 'TRANSACTION NOTE (OPTIONAL)',
      payAmount: 'CASH RECEIVED (RP)',
      payChange: 'CHANGE DUE:',
      btnCompletePay: '✅ COMPLETE TRANSACTION',
      langSettingLabel: '🌐 APPLICATION LANGUAGE',
      langOptionID: '🇮🇩 Indonesian',
      langOptionEN: '🇬🇧 English',
      btnClockInOut: '⏱️ Cashier Clock In/Out',
      btnTutupShift: '📋 Close Cashier Shift',
      btnMode: 'View Mode',
      btnLogout: '🚪 Logout'
    }
  };

  // UI Language Selectors
  const langSelectorLogin = document.getElementById('langSelectorLogin');
  const langSelectorLoginCard = document.getElementById('langSelectorLoginCard');
  const langSelectorSettings = document.getElementById('langSelectorSettings');

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('kaiser_language', lang);

    if (langSelectorLogin) langSelectorLogin.value = lang;
    if (langSelectorLoginCard) langSelectorLoginCard.value = lang;
    if (langSelectorSettings) langSelectorSettings.value = lang;

    const dict = i18nDict[lang] || i18nDict.id;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) {
        el.placeholder = dict[key];
      }
    });
  }

  if (langSelectorLogin) {
    langSelectorLogin.addEventListener('change', () => {
      applyLanguage(langSelectorLogin.value);
      showToast(langSelectorLogin.value === 'en' ? '🇬🇧 Language changed to English' : '🇮🇩 Bahasa diubah ke Indonesia', 'success');
    });
  }

  if (langSelectorLoginCard) {
    langSelectorLoginCard.addEventListener('change', () => {
      applyLanguage(langSelectorLoginCard.value);
      showToast(langSelectorLoginCard.value === 'en' ? '🇬🇧 Language changed to English' : '🇮🇩 Bahasa diubah ke Indonesia', 'success');
    });
  }

  if (langSelectorSettings) {
    langSelectorSettings.addEventListener('change', () => {
      applyLanguage(langSelectorSettings.value);
      showToast(langSelectorSettings.value === 'en' ? '🇬🇧 Language changed to English' : '🇮🇩 Bahasa diubah ke Indonesia', 'success');
    });
  }

  // --- UI Elements ---
  const loginSection = document.getElementById('loginSection');
  const appSection = document.getElementById('appSection');

  // Sidebar Elements
  const sidebarNav = document.getElementById('sidebarNav');
  const btnToggleSidebar = document.getElementById('btnToggleSidebar');
  const sidebarWarungNameDisplay = document.getElementById('sidebarWarungNameDisplay');
  const roleBadgeSidebar = document.getElementById('roleBadgeSidebar');

  // Announcement Banner
  const announcementBanner = document.getElementById('announcementBanner');
  const announcementText = document.getElementById('announcementText');

  // Role Switcher Tabs
  const tabRoleOwner = document.getElementById('tabRoleOwner');
  const tabRoleAdmin = document.getElementById('tabRoleAdmin');
  const ownerLoginForm = document.getElementById('ownerLoginForm');
  const adminLoginForm = document.getElementById('adminLoginForm');

  // Inputs Owner Login
  const ownerWarungIdInput = document.getElementById('ownerWarungIdInput');
  const ownerPwdInput = document.getElementById('ownerPwdInput');
  const toggleOwnerPwd = document.getElementById('toggleOwnerPwd');

  // Inputs Admin Login
  const adminWarungIdInput = document.getElementById('adminWarungIdInput');
  const adminIdInput = document.getElementById('adminIdInput');
  const adminPwdInput = document.getElementById('adminPwdInput');
  const toggleAdminPwd = document.getElementById('toggleAdminPwd');

  // Self-Service Registration Elements
  const btnOpenRegisterModal = document.getElementById('btnOpenRegisterModal');
  const registerModal = document.getElementById('registerModal');
  const btnCloseRegisterModal = document.getElementById('btnCloseRegisterModal');
  const selfRegisterForm = document.getElementById('selfRegisterForm');
  const regOwnerName = document.getElementById('regOwnerName');
  const regWarungName = document.getElementById('regWarungName');
  const regPhone = document.getElementById('regPhone');
  const regAddress = document.getElementById('regAddress');
  const regWarungId = document.getElementById('regWarungId');
  const regPassword = document.getElementById('regPassword');
  const regDuration = document.getElementById('regDuration');
  const btnGenRegId = document.getElementById('btnGenRegId');
  const btnGenRegPwd = document.getElementById('btnGenRegPwd');

  // Device Selection Elements
  const deviceSelectionModal = document.getElementById('deviceSelectionModal');
  const btnSelectPhoneMode = document.getElementById('btnSelectPhoneMode');
  const btnSelectTabletMode = document.getElementById('btnSelectTabletMode');
  const btnToggleDeviceMode = document.getElementById('btnToggleDeviceMode');
  const currentModeLabel = document.getElementById('currentModeLabel');

  // Header & Info
  const headerWarungName = document.getElementById('headerWarungName');
  const headerLogoImg = document.getElementById('headerLogoImg');
  const headerDefaultLogo = document.getElementById('headerDefaultLogo');
  const roleBadge = document.getElementById('roleBadge');
  const onlineStatusBadge = document.getElementById('onlineStatusBadge');
  const btnLogoutWarung = document.getElementById('btnLogoutWarung');
  const btnOpenShiftModal = document.getElementById('btnOpenShiftModal');
  const btnClockInOut = document.getElementById('btnClockInOut');

  // Navigation Tabs & Sidebar Buttons
  const navTabs = document.querySelectorAll('.nav-tab');
  const tabPages = document.querySelectorAll('.tab-page');

  // Dual-Panel Settings Elements
  const ownerSettingsPanel = document.getElementById('ownerSettingsPanel');
  const adminSettingsPanel = document.getElementById('adminSettingsPanel');
  const adminPrinterPaperSize = document.getElementById('adminPrinterPaperSize');
  const adminAutoPrintCheck = document.getElementById('adminAutoPrintCheck');
  const btnTestPrintReceipt = document.getElementById('btnTestPrintReceipt');
  const btnTestKickDrawer = document.getElementById('btnTestKickDrawer');
  const adminBeepSoundCheck = document.getElementById('adminBeepSoundCheck');
  const btnTestBeepSound = document.getElementById('btnTestBeepSound');

  // Subscription Info
  const displayDurationLabel = document.getElementById('displayDurationLabel');
  const displayExpiredDate = document.getElementById('displayExpiredDate');
  const displaySubscriptionBadge = document.getElementById('displaySubscriptionBadge');

  // Admin Account Manager by Owner
  const createAdminForm = document.getElementById('createAdminForm');
  const inputAdminName = document.getElementById('inputAdminName');
  const inputAdminPassword = document.getElementById('inputAdminPassword');
  const btnGenAdminPwd = document.getElementById('btnGenAdminPwd');
  const adminQuotaBadge = document.getElementById('adminQuotaBadge');
  const adminAccountsTableBody = document.getElementById('adminAccountsTableBody');

  // Kas Bon / Customer Debt
  const kasBonForm = document.getElementById('kasBonForm');
  const bonCustomerName = document.getElementById('bonCustomerName');
  const bonPhone = document.getElementById('bonPhone');
  const bonAmount = document.getElementById('bonAmount');
  const bonNote = document.getElementById('bonNote');
  const kasBonTableBody = document.getElementById('kasBonTableBody');

  // Expense Tracker & Petty Cash
  const expenseForm = document.getElementById('expenseForm');
  const expTitle = document.getElementById('expTitle');
  const expCategory = document.getElementById('expCategory');
  const expAmount = document.getElementById('expAmount');
  const expenseTableBody = document.getElementById('expenseTableBody');
  const pettyCashForm = document.getElementById('pettyCashForm');
  const pettyNote = document.getElementById('pettyNote');
  const pettyAmount = document.getElementById('pettyAmount');

  // Suppliers & Purchase Orders
  const poForm = document.getElementById('poForm');
  const poSupplierName = document.getElementById('poSupplierName');
  const poInvoiceNo = document.getElementById('poInvoiceNo');
  const poTotalAmount = document.getElementById('poTotalAmount');
  const poTableBody = document.getElementById('poTableBody');

  // Vouchers
  const voucherForm = document.getElementById('voucherForm');
  const vouchCode = document.getElementById('vouchCode');
  const vouchAmount = document.getElementById('vouchAmount');
  const vouchMinSpend = document.getElementById('vouchMinSpend');
  const voucherTableBody = document.getElementById('voucherTableBody');
  const cartVoucherCode = document.getElementById('cartVoucherCode');
  const btnApplyVoucher = document.getElementById('btnApplyVoucher');
  const voucherBadgeDisplay = document.getElementById('voucherBadgeDisplay');

  // Stock Opname
  const stockAdjForm = document.getElementById('stockAdjForm');
  const adjProductSelect = document.getElementById('adjProductSelect');
  const adjReason = document.getElementById('adjReason');
  const adjQty = document.getElementById('adjQty');
  const stockAdjTableBody = document.getElementById('stockAdjTableBody');

  // Staff Attendance
  const attendanceTableBody = document.getElementById('attendanceTableBody');

  // Customer Loyalty
  const customerForm = document.getElementById('customerForm');
  const custName = document.getElementById('custName');
  const custPhone = document.getElementById('custPhone');
  const customerTableBody = document.getElementById('customerTableBody');

  // POS Elements
  const productSearchInput = document.getElementById('productSearchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const productGrid = document.getElementById('productGrid');
  const emptyProductsState = document.getElementById('emptyProductsState');
  const btnPrintRestokList = document.getElementById('btnPrintRestokList');
  const btnPrintShelfTags = document.getElementById('btnPrintShelfTags');
  const expiringAlertBanner = document.getElementById('expiringAlertBanner');
  const expiringAlertList = document.getElementById('expiringAlertList');

  // Cart Elements
  const cartItemsList = document.getElementById('cartItemsList');
  const emptyCartState = document.getElementById('emptyCartState');
  const cartDiscountInput = document.getElementById('cartDiscountInput');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const cartTotalEl = document.getElementById('cartTotal');
  const btnClearCart = document.getElementById('btnClearCart');
  const btnHoldCart = document.getElementById('btnHoldCart');
  const btnResumeCart = document.getElementById('btnResumeCart');
  const heldCartCount = document.getElementById('heldCartCount');
  const btnCheckout = document.getElementById('btnCheckout');

  // Payment Modal, Table/Meja & A.N. Input
  const checkoutModal = document.getElementById('checkoutModal');
  const modalPayTotal = document.getElementById('modalPayTotal');
  const payMethodSelect = document.getElementById('payMethodSelect');
  const payTableNoInput = document.getElementById('payTableNoInput');
  const payCustomerANInput = document.getElementById('payCustomerANInput');
  const qrisDisplayContainer = document.getElementById('qrisDisplayContainer');
  const modalQrisImg = document.getElementById('modalQrisImg');
  const payNoteInput = document.getElementById('payNoteInput');
  const payAmountInput = document.getElementById('payAmountInput');
  const payChangeDisplay = document.getElementById('payChangeDisplay');
  const quickCashBtns = document.querySelectorAll('.btn-quick-cash');
  const btnProcessPay = document.getElementById('btnProcessPay');
  const btnClosePayModal = document.getElementById('btnClosePayModal');

  // Shelf Tag Printer Modal
  const shelfTagModal = document.getElementById('shelfTagModal');
  const shelfTagGrid = document.getElementById('shelfTagGrid');
  const btnPrintTagsNow = document.getElementById('btnPrintTagsNow');
  const btnCloseShelfTagModal = document.getElementById('btnCloseShelfTagModal');

  // Shift Modal
  const shiftModal = document.getElementById('shiftModal');
  const shiftCashierName = document.getElementById('shiftCashierName');
  const shiftStartCash = document.getElementById('shiftStartCash');
  const shiftEndCash = document.getElementById('shiftEndCash');
  const btnProcessShiftRecap = document.getElementById('btnProcessShiftRecap');
  const btnCloseShiftModal = document.getElementById('btnCloseShiftModal');

  // Thermal Receipt Modal
  const receiptModal = document.getElementById('receiptModal');
  const receiptContainer = document.getElementById('receiptContainer');
  const btnPrintReceipt = document.getElementById('btnPrintReceipt');
  const btnOpenWASendModal = document.getElementById('btnOpenWASendModal');
  const btnCloseReceiptModal = document.getElementById('btnCloseReceiptModal');

  // WA Receipt Image Modal
  const waSendModal = document.getElementById('waSendModal');
  const waCustomerPhone = document.getElementById('waCustomerPhone');
  const waReceiptImgPreview = document.getElementById('waReceiptImgPreview');
  const btnDownloadReceiptImg = document.getElementById('btnDownloadReceiptImg');
  const btnOpenWAChatDirect = document.getElementById('btnOpenWAChatDirect');
  const btnCloseWASendModal = document.getElementById('btnCloseWASendModal');

  // Product Manager & Custom Category
  const productTableBody = document.getElementById('productTableBody');
  const btnAddProduct = document.getElementById('btnAddProduct');
  const productModal = document.getElementById('productModal');
  const productForm = document.getElementById('productForm');
  const btnCloseProductModal = document.getElementById('btnCloseProductModal');
  const modalProductTitle = document.getElementById('modalProductTitle');
  const prodCategory = document.getElementById('prodCategory');
  const prodCategoryCustom = document.getElementById('prodCategoryCustom');
  const prodUnit = document.getElementById('prodUnit');
  const prodExpiredDate = document.getElementById('prodExpiredDate');

  // Transactions History & CSV
  const txHistoryTableBody = document.getElementById('txHistoryTableBody');
  const btnExportTxCSV = document.getElementById('btnExportTxCSV');

  // Reports, Chart, Cashier Perf & WA Daily Summary
  const reportOmset = document.getElementById('reportOmset');
  const reportTotalExpenses = document.getElementById('reportTotalExpenses');
  const reportProfit = document.getElementById('reportProfit');
  const reportTxCount = document.getElementById('reportTxCount');
  const salesChartContainer = document.getElementById('salesChartContainer');
  const cashierPerfTableBody = document.getElementById('cashierPerfTableBody');
  const topProductsList = document.getElementById('topProductsList');
  const btnSendWASalesSummary = document.getElementById('btnSendWASalesSummary');

  // Settings & QRIS & Logo
  const settingWarungName = document.getElementById('settingWarungName');
  const settingOwnerName = document.getElementById('settingOwnerName');
  const settingPhone = document.getElementById('settingPhone');
  const settingAddress = document.getElementById('settingAddress');
  const settingReceiptNote = document.getElementById('settingReceiptNote');
  const settingLogoInput = document.getElementById('settingLogoInput');
  const settingLogoPreview = document.getElementById('settingLogoPreview');
  const settingLogoDefaultIcon = document.getElementById('settingLogoDefaultIcon');
  const btnRemoveLogo = document.getElementById('btnRemoveLogo');
  const settingQrisInput = document.getElementById('settingQrisInput');
  const settingQrisPreview = document.getElementById('settingQrisPreview');
  const settingQrisDefaultIcon = document.getElementById('settingQrisDefaultIcon');
  const btnSaveSettings = document.getElementById('btnSaveSettings');
  const btnExportBackup = document.getElementById('btnExportBackup');
  const inputImportBackup = document.getElementById('inputImportBackup');

  // --- APP STATE ---
  let activeWarung = null;
  let currentRole = 'OWNER';
  let currentAdminUser = null;
  let products = [];
  let cart = [];
  let heldCartsList = [];
  let transactions = [];
  let activeAppliedVoucher = null;
  let editingProductId = null;
  let currentReceiptTx = null;
  let deviceMode = localStorage.getItem('kaiser_device_mode') || 'tablet';

  // --- WEB AUDIO BEEP SYNTHESISER ---
  function playBeepSound() {
    if (adminBeepSoundCheck && !adminBeepSoundCheck.checked) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {}
  }

  // --- SIDEBAR TOGGLE HANDLER ---
  const isSidebarCollapsed = localStorage.getItem('kaiser_sidebar_collapsed') === 'true';
  if (isSidebarCollapsed && sidebarNav) {
    sidebarNav.classList.add('collapsed');
    if (btnToggleSidebar) btnToggleSidebar.textContent = '❯';
  }

  if (btnToggleSidebar) {
    btnToggleSidebar.addEventListener('click', () => {
      if (!sidebarNav) return;
      const collapsed = sidebarNav.classList.toggle('collapsed');
      btnToggleSidebar.textContent = collapsed ? '❯' : '❮';
      localStorage.setItem('kaiser_sidebar_collapsed', collapsed ? 'true' : 'false');
    });
  }

  // --- INITIALIZATION ---
  initApp();

  function initApp() {
    applyLanguage(currentLang);
    applyDeviceMode(deviceMode);
    listenNetworkStatus();
    checkWarungSession();

    if (toggleOwnerPwd) {
      toggleOwnerPwd.addEventListener('click', () => {
        const isPwd = ownerPwdInput.type === 'password';
        ownerPwdInput.type = isPwd ? 'text' : 'password';
        toggleOwnerPwd.textContent = isPwd ? '👁️‍🗨️' : '👁️';
      });
    }

    if (toggleAdminPwd) {
      toggleAdminPwd.addEventListener('click', () => {
        const isPwd = adminPwdInput.type === 'password';
        adminPwdInput.type = isPwd ? 'text' : 'password';
        toggleAdminPwd.textContent = isPwd ? '👁️‍🗨️' : '👁️';
      });
    }

    if (tabRoleOwner && tabRoleAdmin) {
      tabRoleOwner.addEventListener('click', () => {
        tabRoleOwner.classList.add('active');
        tabRoleOwner.style.background = '#0284c7';
        tabRoleOwner.style.color = 'white';

        tabRoleAdmin.classList.remove('active');
        tabRoleAdmin.style.background = 'none';
        tabRoleAdmin.style.color = '#64748b';

        ownerLoginForm.style.display = 'block';
        adminLoginForm.style.display = 'none';
      });

      tabRoleAdmin.addEventListener('click', () => {
        tabRoleAdmin.classList.add('active');
        tabRoleAdmin.style.background = '#06b6d4';
        tabRoleAdmin.style.color = 'white';

        tabRoleOwner.classList.remove('active');
        tabRoleOwner.style.background = 'none';
        tabRoleOwner.style.color = '#64748b';

        adminLoginForm.style.display = 'block';
        ownerLoginForm.style.display = 'none';
      });
    }

    if (prodCategory) {
      prodCategory.addEventListener('change', () => {
        if (prodCategory.value === 'Lainnya') {
          prodCategoryCustom.style.display = 'block';
          prodCategoryCustom.focus();
        } else {
          prodCategoryCustom.style.display = 'none';
          prodCategoryCustom.value = '';
        }
      });
    }
  }

  // --- SELF-SERVICE REGISTRATION HANDLERS ---
  if (btnOpenRegisterModal) {
    btnOpenRegisterModal.addEventListener('click', (e) => {
      e.preventDefault();
      selfRegisterForm.reset();
      regPassword.value = KaiSerCore.generateSecurePassword();
      registerModal.classList.add('active');
    });
  }

  if (btnCloseRegisterModal) {
    btnCloseRegisterModal.addEventListener('click', () => {
      registerModal.classList.remove('active');
    });
  }

  if (regWarungName) {
    regWarungName.addEventListener('input', () => {
      if (regWarungId.getAttribute('data-auto') === 'true') {
        regWarungId.value = KaiSerCore.generateWarungId(regWarungName.value);
      }
    });
  }

  if (regWarungId) {
    regWarungId.addEventListener('input', () => {
      regWarungId.setAttribute('data-auto', 'false');
    });
  }

  if (btnGenRegId) {
    btnGenRegId.addEventListener('click', () => {
      regWarungId.value = KaiSerCore.generateWarungId(regWarungName.value || 'WARUNG');
      regWarungId.setAttribute('data-auto', 'true');
    });
  }

  if (btnGenRegPwd) {
    btnGenRegPwd.addEventListener('click', () => {
      regPassword.value = KaiSerCore.generateSecurePassword();
    });
  }

  if (selfRegisterForm) {
    selfRegisterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const res = KaiSerCore.registerWarungSelfService({
        ownerName: regOwnerName.value,
        warungName: regWarungName.value,
        phone: regPhone.value,
        address: regAddress.value,
        id: regWarungId.value,
        password: regPassword.value,
        duration: regDuration.value
      });

      if (res.success) {
        showToast(res.message, 'success');
        registerModal.classList.remove('active');
        setTimeout(() => {
          window.open(res.waUrl, '_blank');
        }, 600);
      } else {
        showToast(`⚠️ ${res.message}`, 'error');
      }
    });
  }

  // --- DEVICE MODE MANAGER ---
  function applyDeviceMode(mode) {
    deviceMode = mode;
    localStorage.setItem('kaiser_device_mode', mode);

    if (mode === 'phone') {
      document.body.className = 'mode-phone';
      if (currentModeLabel) currentModeLabel.textContent = 'HP';
    } else {
      document.body.className = 'mode-tablet';
      if (currentModeLabel) currentModeLabel.textContent = 'Tablet';
    }
  }

  if (btnSelectPhoneMode) {
    btnSelectPhoneMode.addEventListener('click', () => {
      applyDeviceMode('phone');
      deviceSelectionModal.classList.remove('active');
      showToast('📱 Mode Handphone (HP) diaktifkan!', 'info');
    });
  }

  if (btnSelectTabletMode) {
    btnSelectTabletMode.addEventListener('click', () => {
      applyDeviceMode('tablet');
      deviceSelectionModal.classList.remove('active');
      showToast('💻 Mode Tablet / POS diaktifkan!', 'info');
    });
  }

  if (btnToggleDeviceMode) {
    btnToggleDeviceMode.addEventListener('click', () => {
      const nextMode = (deviceMode === 'tablet') ? 'phone' : 'tablet';
      applyDeviceMode(nextMode);
      showToast(`🔄 Tampilan diubah ke Mode ${nextMode === 'phone' ? 'Handphone (HP)' : 'Tablet / POS'}`, 'success');
    });
  }

  function promptDeviceSelection() {
    const hasChosenBefore = localStorage.getItem('kaiser_device_mode_prompted');
    if (!hasChosenBefore) {
      deviceSelectionModal.classList.add('active');
      localStorage.setItem('kaiser_device_mode_prompted', 'true');
    }
  }

  function listenNetworkStatus() {
    function updateStatus() {
      if (navigator.onLine) {
        onlineStatusBadge.className = 'status-badge badge-aktif';
        onlineStatusBadge.innerHTML = '<span class="status-dot dot-aktif"></span> Online';
      } else {
        onlineStatusBadge.className = 'status-badge badge-suspend';
        onlineStatusBadge.innerHTML = '<span class="status-dot dot-suspend"></span> Offline Mode';
      }
    }
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    updateStatus();
  }

  function checkWarungSession() {
    const sessionData = localStorage.getItem('kaiser_warung_session');
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        const warung = KaiSerCore.getWarungById(session.warungId);
        if (warung && warung.status === KaiSerCore.STATUS.AKTIF) {
          activeWarung = warung;
          currentRole = session.role || 'OWNER';
          currentAdminUser = session.admin || null;
          showDashboard();
          return;
        }
      } catch (e) {}
    }
    showLogin();
  }

  function showLogin() {
    loginSection.style.display = 'flex';
    appSection.style.display = 'none';
    applyLanguage(currentLang);
  }

  function showDashboard() {
    loginSection.style.display = 'none';
    appSection.style.display = 'block';

    headerWarungName.textContent = activeWarung.warungName;
    if (sidebarWarungNameDisplay) sidebarWarungNameDisplay.textContent = activeWarung.warungName;
    updateLogoDisplay();
    updateQrisDisplay();

    const msg = KaiSerCore.getAnnouncement();
    if (msg) {
      announcementText.textContent = msg;
      announcementBanner.style.display = 'block';
    } else {
      announcementBanner.style.display = 'none';
    }

    if (currentRole === 'OWNER') {
      roleBadge.textContent = '👑 OWNER';
      roleBadge.className = 'status-badge badge-aktif';
      if (roleBadgeSidebar) {
        roleBadgeSidebar.textContent = '👑 OWNER';
        roleBadgeSidebar.className = 'status-badge badge-aktif';
      }
      document.querySelectorAll('.owner-only').forEach(el => el.style.display = '');
    } else {
      const adminLabel = `👤 ADMIN (${currentAdminUser ? currentAdminUser.name : 'Kasir'})`;
      roleBadge.textContent = adminLabel;
      roleBadge.className = 'status-badge badge-suspend';
      if (roleBadgeSidebar) {
        roleBadgeSidebar.textContent = adminLabel;
        roleBadgeSidebar.className = 'status-badge badge-suspend';
      }
      document.querySelectorAll('.owner-only').forEach(el => el.style.display = 'none');
    }

    promptDeviceSelection();
    loadWarungData();
    updateCategoryFilterOptions();
    checkExpiringProductsAlert();
    renderPOSProducts();
    renderCart();
    renderProductTable();
    renderTxHistory();
    applyLanguage(currentLang);

    if (currentRole === 'OWNER') {
      renderExpenseTable();
      renderPOTable();
      renderVoucherTable();
      renderStockAdjTable();
      renderKasBonTable();
      renderAttendanceTable();
      renderCustomerTable();
      renderReports();
      renderCashierPerformance();
      renderSalesChart();
      loadSettingsForm();
      renderAdminAccountsTable();
    } else {
      loadAdminSettingsPanel();
    }
  }

  // --- DYNAMIC POS CATEGORY FILTER ---
  function updateCategoryFilterOptions() {
    if (!categoryFilter) return;

    const currentVal = categoryFilter.value;
    const defaultCats = ['Makanan', 'Minuman', 'Sembako'];
    const customCats = [];

    products.forEach(p => {
      if (p.category && !defaultCats.includes(p.category) && !customCats.includes(p.category)) {
        customCats.push(p.category);
      }
    });

    const dict = i18nDict[currentLang] || i18nDict.id;
    let html = `<option value="ALL">${dict.allCategories || 'Semua Kategori'}</option>`;
    defaultCats.forEach(c => {
      html += `<option value="${c}">${c}</option>`;
    });

    customCats.forEach(c => {
      html += `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`;
    });

    categoryFilter.innerHTML = html;
    if ([...categoryFilter.options].some(o => o.value === currentVal)) {
      categoryFilter.value = currentVal;
    } else {
      categoryFilter.value = 'ALL';
    }
  }

  // --- EXPIRING PRODUCTS ALERT ENGINE ---
  function checkExpiringProductsAlert() {
    if (!expiringAlertBanner || !expiringAlertList) return;
    const now = new Date();
    const alertDays = 30;

    const expiring = products.filter(p => {
      if (!p.expiredDate) return false;
      const exp = new Date(p.expiredDate);
      const diffTime = exp - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= alertDays;
    });

    if (expiring.length === 0) {
      expiringAlertBanner.style.display = 'none';
      return;
    }

    expiringAlertBanner.style.display = 'block';
    expiringAlertList.innerHTML = '';
    expiring.forEach(p => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${escapeHtml(p.name)}</strong> — Expired pada: <strong style="color: red;">${p.expiredDate}</strong> (Sisa stok: ${p.stock} ${p.unit || 'pcs'})`;
      expiringAlertList.appendChild(li);
    });
  }

  // --- LOGIN OWNER & STEALTH SECRET TRIGGER ---
  ownerLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputIdRaw = ownerWarungIdInput.value.trim();
    const idLower = inputIdRaw.toLowerCase();
    const pwd = ownerPwdInput.value.trim();

    if (idLower === 'ilyas0905') {
      if (pwd === '123456789') {
        showToast('🔑 Pintu Rahasia Creator Terverifikasi! Mengalihkan ke Halaman Login Creator...', 'info');
        localStorage.removeItem('kaiser_creator_session');
        setTimeout(() => {
          window.location.href = 'creator.html';
        }, 800);
        return;
      } else {
        showToast('⚠️ ID Warung tidak ditemukan!', 'error');
        return;
      }
    }

    const res = KaiSerCore.loginOwner(inputIdRaw, pwd);
    if (res.success) {
      activeWarung = res.warung;
      currentRole = 'OWNER';
      currentAdminUser = null;
      localStorage.setItem('kaiser_warung_session', JSON.stringify({ warungId: res.warung.id, role: 'OWNER', loginTime: new Date().toISOString() }));
      showToast(`👑 Welcome Owner ${res.warung.warungName}!`, 'success');
      showDashboard();
    } else {
      showToast(`⚠️ ${res.message}`, 'error');
    }
  });

  // --- LOGIN ADMIN ---
  adminLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const warungId = adminWarungIdInput.value.trim();
    const adminId = adminIdInput.value.trim();
    const pwd = adminPwdInput.value.trim();

    const res = KaiSerCore.loginAdmin(warungId, adminId, pwd);
    if (res.success) {
      activeWarung = res.warung;
      currentRole = 'ADMIN';
      currentAdminUser = res.admin;
      localStorage.setItem('kaiser_warung_session', JSON.stringify({ warungId: res.warung.id, role: 'ADMIN', admin: res.admin, loginTime: new Date().toISOString() }));
      showToast(`👤 Welcome Admin Kasir ${res.admin.name}!`, 'success');
      showDashboard();
    } else {
      showToast(`⚠️ ${res.message}`, 'error');
    }
  });

  btnLogoutWarung.addEventListener('click', () => {
    localStorage.removeItem('kaiser_warung_session');
    activeWarung = null;
    currentRole = 'OWNER';
    currentAdminUser = null;
    showToast('🚪 Berhasil keluar dari aplikasi.', 'info');
    showLogin();
  });

  // --- NAVIGATION TABS (SIDEBAR + CONTENT TABS) ---
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      if (currentRole === 'ADMIN' && (target === 'laporan' || target === 'kasbon' || target === 'pengeluaran' || target === 'pelanggan' || target === 'pemasok' || target === 'opname' || target === 'voucher' || target === 'absensi')) {
        showToast('🔒 Akses Laporan & Fitur Khusus hanya untuk Owner!', 'error');
        return;
      }

      navTabs.forEach(t => t.classList.remove('active'));
      tabPages.forEach(p => p.classList.remove('active'));

      // Highlight active sidebar items
      document.querySelectorAll(`.nav-tab[data-tab="${target}"]`).forEach(t => t.classList.add('active'));
      document.getElementById(`tab-${target}`).classList.add('active');

      if (target === 'produk') renderProductTable();
      if (target === 'riwayat') renderTxHistory();
      if (target === 'pengeluaran') renderExpenseTable();
      if (target === 'pemasok') renderPOTable();
      if (target === 'voucher') renderVoucherTable();
      if (target === 'opname') renderStockAdjTable();
      if (target === 'kasbon') renderKasBonTable();
      if (target === 'absensi') renderAttendanceTable();
      if (target === 'pelanggan') renderCustomerTable();
      if (target === 'laporan') {
        renderReports();
        renderCashierPerformance();
        renderSalesChart();
      }
      if (target === 'pengaturan') {
        if (currentRole === 'OWNER') {
          ownerSettingsPanel.style.display = 'block';
          adminSettingsPanel.style.display = 'none';
          loadSettingsForm();
        } else {
          ownerSettingsPanel.style.display = 'none';
          adminSettingsPanel.style.display = 'block';
          loadAdminSettingsPanel();
        }
      }
    });
  });

  // --- ADMIN SETTINGS PANEL LOGIC ---
  function loadAdminSettingsPanel() {
    if (!adminSettingsPanel) return;
    ownerSettingsPanel.style.display = 'none';
    adminSettingsPanel.style.display = 'block';

    const storedPaper = localStorage.getItem('kaiser_admin_paper_size') || '58mm';
    if (adminPrinterPaperSize) adminPrinterPaperSize.value = storedPaper;

    const storedAuto = localStorage.getItem('kaiser_admin_auto_print') === 'true';
    if (adminAutoPrintCheck) adminAutoPrintCheck.checked = storedAuto;

    const storedBeep = localStorage.getItem('kaiser_admin_beep_sound') !== 'false';
    if (adminBeepSoundCheck) adminBeepSoundCheck.checked = storedBeep;
  }

  if (adminPrinterPaperSize) {
    adminPrinterPaperSize.addEventListener('change', () => {
      localStorage.setItem('kaiser_admin_paper_size', adminPrinterPaperSize.value);
      showToast(`🖨️ Ukuran Kertas Printer diubah ke ${adminPrinterPaperSize.value}`, 'success');
    });
  }

  if (adminAutoPrintCheck) {
    adminAutoPrintCheck.addEventListener('change', () => {
      localStorage.setItem('kaiser_admin_auto_print', adminAutoPrintCheck.checked ? 'true' : 'false');
      showToast(`⚡ Otomatis Cetak Struk: ${adminAutoPrintCheck.checked ? 'AKTIF' : 'NON-AKTIF'}`, 'info');
    });
  }

  if (adminBeepSoundCheck) {
    adminBeepSoundCheck.addEventListener('change', () => {
      localStorage.setItem('kaiser_admin_beep_sound', adminBeepSoundCheck.checked ? 'true' : 'false');
      showToast(`🔊 Suara Beep Kasir: ${adminBeepSoundCheck.checked ? 'AKTIF' : 'NON-AKTIF'}`, 'info');
    });
  }

  if (btnTestBeepSound) {
    btnTestBeepSound.addEventListener('click', () => {
      playBeepSound();
      showToast('🔊 Tes Suara Beep Kasir Berhasil!', 'success');
    });
  }

  if (btnTestPrintReceipt) {
    btnTestPrintReceipt.addEventListener('click', () => {
      const dummyTx = {
        invoiceNo: 'INV/TEST-0001',
        cashier: currentAdminUser ? currentAdminUser.name : 'Kasir',
        tableNo: 'Meja Test',
        customerAN: 'Pelanggan Test',
        date: new Date().toISOString(),
        items: [
          { name: 'Kopi Susu Test', qty: 1, subtotal: 15000 },
          { name: 'Roti Bakar Test', qty: 2, subtotal: 24000 }
        ],
        total: 39000,
        payAmount: 50000,
        changeAmount: 11000,
        paymentMethod: 'TUNAI',
        note: 'Struk Uji Coba Printer'
      };
      openReceiptModal(dummyTx);
    });
  }

  if (btnTestKickDrawer) {
    btnTestKickDrawer.addEventListener('click', () => {
      playBeepSound();
      showToast('🚪 Sinyal Perintah Buka Laci Kasir (Cash Drawer) Terkirim!', 'success');
    });
  }

  // --- PROMO VOUCHERS ENGINE ---
  if (voucherForm) {
    voucherForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const res = KaiSerCore.addVoucher(activeWarung.id, vouchCode.value, 'FLAT', vouchAmount.value, vouchMinSpend.value);
      if (res.success) {
        showToast(`🎟️ ${res.message}`, 'success');
        voucherForm.reset();
        renderVoucherTable();
      } else {
        showToast(`⚠️ ${res.message}`, 'error');
      }
    });
  }

  function renderVoucherTable() {
    if (!activeWarung || !voucherTableBody) return;
    const warung = KaiSerCore.getWarungById(activeWarung.id);
    if (!warung) return;

    const vchs = warung.vouchers || [];
    voucherTableBody.innerHTML = '';

    if (vchs.length === 0) {
      voucherTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: var(--text-muted);">Belum ada voucher promo.</td></tr>`;
      return;
    }

    vchs.forEach(v => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong style="font-family: monospace; color: var(--primary);">${escapeHtml(v.code)}</strong></td>
        <td><strong>Rp ${formatRupiah(v.amount)}</strong></td>
        <td>Rp ${formatRupiah(v.minSpend || 0)}</td>
        <td><button class="btn-icon btn-icon-danger" onclick="deleteVoucherItem('${v.id}')">🗑️</button></td>
      `;
      voucherTableBody.appendChild(tr);
    });
  }

  window.deleteVoucherItem = (vouchId) => {
    if (confirm('Hapus voucher ini?')) {
      KaiSerCore.deleteVoucher(activeWarung.id, vouchId);
      renderVoucherTable();
      showToast('🗑️ Voucher telah dihapus.', 'info');
    }
  };

  if (btnApplyVoucher) {
    btnApplyVoucher.addEventListener('click', () => {
      const code = cartVoucherCode.value.trim().toUpperCase();
      if (!code) return;
      const warung = KaiSerCore.getWarungById(activeWarung.id);
      const v = (warung.vouchers || []).find(vch => vch.code === code && vch.status === 'AKTIF');

      if (!v) {
        showToast('⚠️ Kode Voucher tidak valid atau tidak aktif!', 'error');
        activeAppliedVoucher = null;
        voucherBadgeDisplay.style.display = 'none';
        renderCart();
        return;
      }

      const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);
      if (subtotal < (v.minSpend || 0)) {
        showToast(`⚠️ Minimal belanja Rp ${formatRupiah(v.minSpend)} untuk menggunakan voucher ini!`, 'error');
        return;
      }

      activeAppliedVoucher = v;
      voucherBadgeDisplay.textContent = `✅ Voucher ${v.code} dipasang (-Rp ${formatRupiah(v.amount)})`;
      voucherBadgeDisplay.style.display = 'block';
      showToast(`🎟️ Voucher ${v.code} Berhasil Digunakan!`, 'success');
      renderCart();
    });
  }

  // --- PURCHASE ORDERS (KULAKAN BARANG) ---
  if (poForm) {
    poForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const res = KaiSerCore.addPurchaseOrder(activeWarung.id, poSupplierName.value, poInvoiceNo.value, poTotalAmount.value);
      if (res.success) {
        showToast(`📜 ${res.message}`, 'success');
        poForm.reset();
        renderPOTable();
      }
    });
  }

  function renderPOTable() {
    if (!activeWarung || !poTableBody) return;
    const warung = KaiSerCore.getWarungById(activeWarung.id);
    if (!warung) return;

    const pos = warung.purchaseOrders || [];
    poTableBody.innerHTML = '';

    if (pos.length === 0) {
      poTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: var(--text-muted);">Belum ada riwayat kulakan barang.</td></tr>`;
      return;
    }

    pos.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${escapeHtml(p.supplierName)}</strong></td>
        <td><code>${escapeHtml(p.invoiceNo)}</code></td>
        <td><strong style="color: var(--danger);">Rp ${formatRupiah(p.total)}</strong></td>
        <td>${new Date(p.date).toLocaleDateString('id-ID')}</td>
      `;
      poTableBody.appendChild(tr);
    });
  }

  // --- PETTY CASH (KAS KECIL LACI KASIR) ---
  if (pettyCashForm) {
    pettyCashForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const res = KaiSerCore.addPettyCash(activeWarung.id, pettyNote.value, pettyAmount.value);
      if (res.success) {
        showToast(`💸 ${res.message}`, 'success');
        pettyCashForm.reset();
        renderExpenseTable();
      }
    });
  }

  // --- STAFF ATTENDANCE & SHIFT CLOCK ---
  if (btnClockInOut) {
    btnClockInOut.addEventListener('click', () => {
      const cashier = currentRole === 'ADMIN' ? (currentAdminUser ? currentAdminUser.name : 'Admin') : 'Owner';
      const warung = KaiSerCore.getWarungById(activeWarung.id);
      const atts = warung.attendance || [];
      const hasClockedIn = atts.some(a => a.cashierName === cashier && !a.clockOut);

      const action = hasClockedIn ? 'CLOCK_OUT' : 'CLOCK_IN';
      const res = KaiSerCore.recordAttendance(activeWarung.id, cashier, action);

      if (res.success) {
        showToast(res.message, 'success');
        renderAttendanceTable();
      } else {
        showToast(`⚠️ ${res.message}`, 'error');
      }
    });
  }

  function renderAttendanceTable() {
    if (!activeWarung || !attendanceTableBody) return;
    const warung = KaiSerCore.getWarungById(activeWarung.id);
    if (!warung) return;

    const atts = warung.attendance || [];
    attendanceTableBody.innerHTML = '';

    if (atts.length === 0) {
      attendanceTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: var(--text-muted);">Belum ada catatan absensi staf.</td></tr>`;
      return;
    }

    atts.forEach(a => {
      const tr = document.createElement('tr');
      const inTime = new Date(a.clockIn).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });
      const outTime = a.clockOut ? new Date(a.clockOut).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) : 'Masih Bertugas (Aktif)';

      tr.innerHTML = `
        <td><strong>${escapeHtml(a.cashierName)}</strong></td>
        <td>🟢 ${inTime}</td>
        <td>🔴 ${outTime}</td>
        <td><span class="status-badge ${a.clockOut ? 'badge-suspend' : 'badge-aktif'}">${a.clockOut ? 'Selesai Shift' : 'Sedang Bertugas'}</span></td>
      `;
      attendanceTableBody.appendChild(tr);
    });
  }

  // --- CASHIER PERFORMANCE & ESTIMATED COMMISSION ---
  function renderCashierPerformance() {
    if (!cashierPerfTableBody) return;
    const stats = {};

    transactions.forEach(t => {
      const cashier = t.cashier || 'Kasir';
      if (!stats[cashier]) stats[cashier] = { count: 0, omset: 0 };
      stats[cashier].count += 1;
      stats[cashier].omset += t.total;
    });

    cashierPerfTableBody.innerHTML = '';
    const keys = Object.keys(stats);

    if (keys.length === 0) {
      cashierPerfTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: var(--text-muted);">Belum ada transaksi kasir.</td></tr>`;
      return;
    }

    keys.forEach(k => {
      const item = stats[k];
      const commission = Math.round(item.omset * 0.01);

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${escapeHtml(k)}</strong></td>
        <td>${item.count} Transaksi</td>
        <td><strong>Rp ${formatRupiah(item.omset)}</strong></td>
        <td><strong style="color: var(--success);">Rp ${formatRupiah(commission)}</strong></td>
      `;
      cashierPerfTableBody.appendChild(tr);
    });
  }

  // --- DAILY WA SALES SUMMARY ---
  if (btnSendWASalesSummary) {
    btnSendWASalesSummary.addEventListener('click', () => {
      const warung = KaiSerCore.getWarungById(activeWarung.id);
      const exps = warung.expenses || [];
      const petties = warung.pettyCash || [];

      const waText = KaiSerCore.generateDailyWASummaryPayload(activeWarung, transactions, exps, petties);
      let cleanPhone = activeWarung.phone ? activeWarung.phone.replace(/[^0-9]/g, '') : '';
      if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.slice(1);

      const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(waText)}`;
      window.open(url, '_blank');
    });
  }

  // --- STOCK OPNAME & ADJUSTMENT ---
  function populateAdjProductSelect() {
    if (!adjProductSelect) return;
    adjProductSelect.innerHTML = '';
    products.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.name;
      opt.textContent = `${p.name} (Sisa Stok: ${p.stock} ${p.unit || 'pcs'})`;
      adjProductSelect.appendChild(opt);
    });
  }

  if (stockAdjForm) {
    stockAdjForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const pName = adjProductSelect.value;
      const qtyDelta = parseInt(adjQty.value, 10) || 0;
      const reason = adjReason.value;

      const p = products.find(prod => prod.name === pName);
      if (p) {
        p.stock += qtyDelta;
        saveProducts();
        renderProductTable();
        renderPOSProducts();
      }

      const res = KaiSerCore.addStockAdjustment(activeWarung.id, pName, qtyDelta, reason);
      if (res.success) {
        showToast(`📦 ${res.message}`, 'success');
        stockAdjForm.reset();
        populateAdjProductSelect();
        renderStockAdjTable();
      }
    });
  }

  function renderStockAdjTable() {
    if (!activeWarung || !stockAdjTableBody) return;
    populateAdjProductSelect();
    const warung = KaiSerCore.getWarungById(activeWarung.id);
    if (!warung) return;

    const adjs = warung.stockAdjustments || [];
    stockAdjTableBody.innerHTML = '';

    if (adjs.length === 0) {
      stockAdjTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: var(--text-muted);">Belum ada riwayat stok opname.</td></tr>`;
      return;
    }

    adjs.forEach(a => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${escapeHtml(a.productName)}</strong></td>
        <td><strong style="color: ${a.qty < 0 ? 'var(--danger)' : 'var(--success)'}">${a.qty > 0 ? '+' : ''}${a.qty} pcs</strong></td>
        <td><span class="status-badge ${a.qty < 0 ? 'badge-suspend' : 'badge-aktif'}">${escapeHtml(a.reason)}</span></td>
        <td>${new Date(a.date).toLocaleDateString('id-ID')}</td>
      `;
      stockAdjTableBody.appendChild(tr);
    });
  }

  // --- SHELF TAG PRINTER MODAL HANDLERS ---
  if (btnPrintShelfTags) {
    btnPrintShelfTags.addEventListener('click', () => {
      shelfTagGrid.innerHTML = '';
      products.forEach(p => {
        const tag = document.createElement('div');
        tag.style.border = '2px dashed #0f172a';
        tag.style.padding = '10px';
        tag.style.borderRadius = '8px';
        tag.style.textAlign = 'center';
        tag.style.background = '#ffffff';

        tag.innerHTML = `
          <div style="font-size: 10px; font-weight: 800; color: #0284c7; text-transform: uppercase;">${escapeHtml(activeWarung.warungName)}</div>
          <div style="font-size: 13px; font-weight: 800; color: #0f172a; margin: 4px 0;">${escapeHtml(p.name)}</div>
          <div style="font-size: 18px; font-weight: 800; color: #059669;">Rp ${formatRupiah(p.price)} / ${escapeHtml(p.unit || 'pcs')}</div>
          <div style="font-size: 9px; color: #64748b; font-family: monospace; margin-top: 2px;">SKU: ${escapeHtml(p.sku || p.id)}</div>
        `;
        shelfTagGrid.appendChild(tag);
      });
      shelfTagModal.classList.add('active');
    });
  }

  if (btnCloseShelfTagModal) {
    btnCloseShelfTagModal.addEventListener('click', () => shelfTagModal.classList.remove('active'));
  }

  if (btnPrintTagsNow) {
    btnPrintTagsNow.addEventListener('click', () => window.print());
  }

  // --- VISUAL SALES BAR CHART RENDERER ---
  function renderSalesChart() {
    if (!salesChartContainer) return;
    salesChartContainer.innerHTML = '';

    const days = 7;
    const dailyTotals = {};

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().slice(0, 10);
      dailyTotals[dateKey] = 0;
    }

    transactions.forEach(t => {
      const tKey = t.date.slice(0, 10);
      if (dailyTotals.hasOwnProperty(tKey)) {
        dailyTotals[tKey] += t.total;
      }
    });

    const maxVal = Math.max(...Object.values(dailyTotals), 100000);

    Object.keys(dailyTotals).forEach(dateStr => {
      const amount = dailyTotals[dateStr];
      const heightPercent = Math.max(10, (amount / maxVal) * 100);
      const dayName = new Date(dateStr).toLocaleDateString(currentLang === 'en' ? 'en-US' : 'id-ID', { weekday: 'short' });

      const col = document.createElement('div');
      col.style.display = 'flex';
      col.style.flexDirection = 'column';
      col.style.alignItems = 'center';
      col.style.flex = '1';

      col.innerHTML = `
        <span style="font-size: 10px; font-weight: 700; color: #0284c7; margin-bottom: 4px;">Rp ${(amount/1000).toFixed(0)}k</span>
        <div style="width: 24px; height: ${heightPercent}%; background: linear-gradient(180deg, #38bdf8 0%, #0284c7 100%); border-radius: 4px 4px 0 0;"></div>
        <span style="font-size: 11px; font-weight: 700; color: #64748b; margin-top: 6px;">${dayName}</span>
      `;

      salesChartContainer.appendChild(col);
    });
  }

  // --- CUSTOM LOGO & QRIS MANAGER ---
  function updateLogoDisplay() {
    if (!activeWarung) return;
    const logoData = localStorage.getItem(`kaiser_logo_${activeWarung.id}`);

    if (logoData) {
      headerLogoImg.src = logoData;
      headerLogoImg.style.display = 'block';
      headerDefaultLogo.style.display = 'none';

      if (settingLogoPreview) {
        settingLogoPreview.src = logoData;
        settingLogoPreview.style.display = 'block';
        settingLogoDefaultIcon.style.display = 'none';
        btnRemoveLogo.style.display = 'inline-block';
      }
    } else {
      headerLogoImg.style.display = 'none';
      headerDefaultLogo.style.display = 'inline-block';

      if (settingLogoPreview) {
        settingLogoPreview.style.display = 'none';
        settingLogoDefaultIcon.style.display = 'inline-block';
        btnRemoveLogo.style.display = 'none';
      }
    }
  }

  function updateQrisDisplay() {
    if (!activeWarung) return;
    const qrisData = localStorage.getItem(`kaiser_qris_${activeWarung.id}`);
    if (qrisData) {
      if (settingQrisPreview) {
        settingQrisPreview.src = qrisData;
        settingQrisPreview.style.display = 'block';
        settingQrisDefaultIcon.style.display = 'none';
      }
      if (modalQrisImg) modalQrisImg.src = qrisData;
    } else {
      if (settingQrisPreview) {
        settingQrisPreview.style.display = 'none';
        settingQrisDefaultIcon.style.display = 'inline-block';
      }
    }
  }

  if (settingLogoInput) {
    settingLogoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        localStorage.setItem(`kaiser_logo_${activeWarung.id}`, evt.target.result);
        updateLogoDisplay();
        showToast('🖼️ Logo toko berhasil diunggah!', 'success');
      };
      reader.readAsDataURL(file);
    });
  }

  if (settingQrisInput) {
    settingQrisInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        localStorage.setItem(`kaiser_qris_${activeWarung.id}`, evt.target.result);
        updateQrisDisplay();
        showToast('📱 Barcode QRIS Toko berhasil diunggah!', 'success');
      };
      reader.readAsDataURL(file);
    });
  }

  if (btnRemoveLogo) {
    btnRemoveLogo.addEventListener('click', () => {
      if (confirm('Hapus logo custom toko ini?')) {
        localStorage.removeItem(`kaiser_logo_${activeWarung.id}`);
        settingLogoInput.value = '';
        updateLogoDisplay();
        showToast('🗑️ Logo custom dihapus.', 'info');
      }
    });
  }

  // --- EXPENSE TRACKER ---
  if (expenseForm) {
    expenseForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const res = KaiSerCore.addExpense(activeWarung.id, expTitle.value, expCategory.value, expAmount.value);
      if (res.success) {
        showToast(`💸 ${res.message}`, 'success');
        expenseForm.reset();
        renderExpenseTable();
        renderReports();
      }
    });
  }

  function renderExpenseTable() {
    if (!activeWarung || !expenseTableBody) return;
    const warung = KaiSerCore.getWarungById(activeWarung.id);
    if (!warung) return;

    const exps = warung.expenses || [];
    const petties = warung.pettyCash || [];
    expenseTableBody.innerHTML = '';

    if (exps.length === 0 && petties.length === 0) {
      expenseTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: var(--text-muted);">Belum ada pengeluaran / kas kecil.</td></tr>`;
      return;
    }

    exps.forEach(e => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${escapeHtml(e.title)}</strong></td>
        <td><span class="product-cat">${escapeHtml(e.category)}</span></td>
        <td><strong style="color: var(--danger);">Rp ${formatRupiah(e.amount)}</strong></td>
        <td>${new Date(e.date).toLocaleDateString('id-ID')}</td>
      `;
      expenseTableBody.appendChild(tr);
    });

    petties.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>💸 ${escapeHtml(p.note)} (Kas Kecil)</strong></td>
        <td><span class="product-cat" style="background: #fff7ed; color: #c2410c;">Kas Kecil Laci</span></td>
        <td><strong style="color: var(--danger);">Rp ${formatRupiah(p.amount)}</strong></td>
        <td>${new Date(p.date).toLocaleDateString('id-ID')}</td>
      `;
      expenseTableBody.appendChild(tr);
    });
  }

  // --- CUSTOMER LOYALTY ---
  if (customerForm) {
    customerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const res = KaiSerCore.addCustomerMember(activeWarung.id, custName.value, custPhone.value);
      if (res.success) {
        showToast(`👤 ${res.message}`, 'success');
        customerForm.reset();
        renderCustomerTable();
      } else {
        showToast(`⚠️ ${res.message}`, 'error');
      }
    });
  }

  function renderCustomerTable() {
    if (!activeWarung || !customerTableBody) return;
    const warung = KaiSerCore.getWarungById(activeWarung.id);
    if (!warung) return;

    const custs = warung.customers || [];
    customerTableBody.innerHTML = '';

    if (custs.length === 0) {
      customerTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: var(--text-muted);">Belum ada member terdaftar.</td></tr>`;
      return;
    }

    custs.forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${escapeHtml(c.name)}</strong></td>
        <td>📱 ${escapeHtml(c.phone)}</td>
        <td><span class="status-badge badge-aktif">⭐ ${c.points || 0} Poin</span></td>
        <td>Rp ${formatRupiah(c.totalSpend || 0)}</td>
      `;
      customerTableBody.appendChild(tr);
    });
  }

  // --- KAS BON & PIUTANG ---
  if (kasBonForm) {
    kasBonForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const res = KaiSerCore.addKasBon(activeWarung.id, bonCustomerName.value, bonPhone.value, bonAmount.value, bonNote.value);
      if (res.success) {
        showToast(`📝 ${res.message}`, 'success');
        kasBonForm.reset();
        renderKasBonTable();
      } else {
        showToast(`⚠️ ${res.message}`, 'error');
      }
    });
  }

  function renderKasBonTable() {
    if (!activeWarung || !kasBonTableBody) return;
    const warung = KaiSerCore.getWarungById(activeWarung.id);
    if (!warung) return;

    const debts = warung.debts || [];
    kasBonTableBody.innerHTML = '';

    if (debts.length === 0) {
      kasBonTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--text-muted);">Belum ada catatan kas bon / piutang.</td></tr>`;
      return;
    }

    debts.forEach(b => {
      const tr = document.createElement('tr');
      const isLunas = b.status === 'LUNAS';

      tr.innerHTML = `
        <td>
          <strong style="color: var(--dark-ocean);">${escapeHtml(b.customerName)}</strong><br>
          <span style="font-size: 11px; color: var(--text-muted);">📱 ${escapeHtml(b.phone)}</span>
        </td>
        <td><strong style="color: var(--danger);">Rp ${formatRupiah(b.amount)}</strong></td>
        <td><span style="font-size: 12px;">${escapeHtml(b.note || '-')}</span></td>
        <td>
          <span class="status-badge ${isLunas ? 'badge-aktif' : 'badge-suspend'}">
            ${isLunas ? '✅ LUNAS' : '🟡 BELUM LUNAS'}
          </span>
        </td>
        <td>
          ${!isLunas ? `<button class="btn-primary" style="font-size: 11px; padding: 4px 8px; background: #10b981;" onclick="payBon('${b.id}')">✅ Pelunasan</button>` : `<span style="font-size: 11px; color: var(--text-muted);">-</span>`}
        </td>
      `;
      kasBonTableBody.appendChild(tr);
    });
  }

  window.payBon = (bonId) => {
    if (confirm('Tandai kas bon ini sebagai LUNAS?')) {
      const res = KaiSerCore.payKasBon(activeWarung.id, bonId);
      if (res.success) {
        showToast(`🎉 ${res.message}`, 'success');
        renderKasBonTable();
      }
    }
  };

  // --- ADMIN ACCOUNTS CREATION BY OWNER ---
  function renderAdminAccountsTable() {
    if (!activeWarung || !adminAccountsTableBody) return;
    const warung = KaiSerCore.getWarungById(activeWarung.id);
    if (!warung) return;

    const admins = warung.admins || [];
    const quota = warung.adminQuota || 2;
    adminQuotaBadge.textContent = `Kuota: ${admins.length}/${quota} Gratis`;

    adminAccountsTableBody.innerHTML = '';
    if (admins.length === 0) {
      adminAccountsTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: var(--text-muted);">Belum ada akun Admin Kasir.</td></tr>`;
      return;
    }

    admins.forEach(adm => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="warung-id-tag">${adm.id}</span></td>
        <td><strong>${escapeHtml(adm.name)}</strong></td>
        <td><code>${escapeHtml(adm.password)}</code></td>
        <td>
          <button class="btn-icon btn-icon-danger" onclick="deleteAdmin('${adm.id}')">🗑️ Hapus</button>
        </td>
      `;
      adminAccountsTableBody.appendChild(tr);
    });
  }

  if (btnGenAdminPwd) {
    btnGenAdminPwd.addEventListener('click', () => {
      inputAdminPassword.value = Math.floor(100000 + Math.random() * 900000);
    });
  }

  if (createAdminForm) {
    createAdminForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = inputAdminName.value.trim();
      const pwd = inputAdminPassword.value.trim();

      const res = KaiSerCore.createAdminAccount(activeWarung.id, name, pwd);
      if (res.success) {
        showToast(`✅ ${res.message}`, 'success');
        createAdminForm.reset();
        renderAdminAccountsTable();
      } else if (res.needsApproval) {
        showToast(`⚠️ ${res.message}`, 'warning');
        alert(res.message);
      } else {
        showToast(`⚠️ ${res.message}`, 'error');
      }
    });
  }

  window.deleteAdmin = (adminId) => {
    if (confirm(`Hapus akun Admin ${adminId}?`)) {
      const res = KaiSerCore.deleteAdminAccount(activeWarung.id, adminId);
      if (res.success) {
        showToast(`🗑️ ${res.message}`, 'success');
        renderAdminAccountsTable();
      }
    }
  };

  // --- LOCAL DATA PERSISTENCE ---
  function loadWarungData() {
    if (!activeWarung) return;

    const prodData = localStorage.getItem(`kaiser_products_${activeWarung.id}`);
    if (prodData) {
      try { products = JSON.parse(prodData); } catch (e) { products = []; }
    } else {
      products = [
        { id: 'P001', name: 'Kopi Susu Gula Aren', category: 'Minuman', unit: 'Botol', costPrice: 8000, price: 15000, stock: 45, sku: '8991001' },
        { id: 'P002', name: 'Nasi Goreng Spesial', category: 'Makanan', unit: 'Pcs', costPrice: 12000, price: 20000, stock: 30, sku: '8991002' },
        { id: 'P003', name: 'Es Teh Manis', category: 'Minuman', unit: 'Pcs', costPrice: 2000, price: 5000, stock: 100, sku: '8991003' },
        { id: 'P004', name: 'Minyak Goreng 1L', category: 'Sembako', unit: 'Liter', costPrice: 14000, price: 17500, stock: 2, sku: '8991004' },
        { id: 'P005', name: 'Beras Premium 5kg', category: 'Sembako', unit: 'Kg', costPrice: 65000, price: 72000, stock: 2, sku: '8991005' },
        { id: 'P006', name: 'Roti Bakar Coklat', category: 'Makanan', unit: 'Pcs', costPrice: 7000, price: 12000, stock: 15, sku: '8991006' }
      ];
      saveProducts();
    }

    const txData = localStorage.getItem(`kaiser_txs_${activeWarung.id}`);
    if (txData) {
      try { transactions = JSON.parse(txData); } catch (e) { transactions = []; }
    } else {
      transactions = [];
    }
  }

  function saveProducts() {
    if (!activeWarung) return;
    localStorage.setItem(`kaiser_products_${activeWarung.id}`, JSON.stringify(products));
    updateCategoryFilterOptions();
    checkExpiringProductsAlert();
  }

  function saveTransactions() {
    if (!activeWarung) return;
    localStorage.setItem(`kaiser_txs_${activeWarung.id}`, JSON.stringify(transactions));
  }

  // --- POS PRODUCT GRID & SEARCH ---
  productSearchInput.addEventListener('input', renderPOSProducts);
  categoryFilter.addEventListener('change', renderPOSProducts);

  function renderPOSProducts() {
    const query = productSearchInput.value.toLowerCase().trim();
    const cat = categoryFilter.value;

    const filtered = products.filter(p => {
      const matchQuery = p.name.toLowerCase().includes(query) || (p.sku && p.sku.includes(query));
      const matchCat = (cat === 'ALL' || p.category === cat);
      return matchQuery && matchCat;
    });

    productGrid.innerHTML = '';

    if (filtered.length === 0) {
      emptyProductsState.style.display = 'block';
      return;
    } else {
      emptyProductsState.style.display = 'none';
    }

    filtered.forEach(p => {
      const card = document.createElement('div');
      card.className = 'product-card';
      if (p.stock <= 0) card.classList.add('out-of-stock');

      card.innerHTML = `
        <div class="product-cat">${escapeHtml(p.category)} (${escapeHtml(p.unit || 'Pcs')})</div>
        <div class="product-title">${escapeHtml(p.name)}</div>
        <div class="product-price">Rp ${formatRupiah(p.price)}</div>
        <div class="product-stock ${p.stock <= 5 ? 'stock-low' : ''}">Stok: ${p.stock} ${escapeHtml(p.unit || 'Pcs')}</div>
      `;

      card.addEventListener('click', () => addToCart(p));
      productGrid.appendChild(card);
    });
  }

  // --- RESTOCK LIST GENERATOR ---
  if (btnPrintRestokList) {
    btnPrintRestokList.addEventListener('click', () => {
      const lowStockItems = products.filter(p => p.stock <= 5);
      if (lowStockItems.length === 0) {
        showToast('✨ Semua stok produk masih aman (> 5 pcs)!', 'success');
        return;
      }

      let text = `📋 *DAFTAR RESTOK BARANG ${activeWarung.warungName.toUpperCase()}*\nTanggal: ${new Date().toLocaleDateString('id-ID')}\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      lowStockItems.forEach(i => {
        text += `• ${i.name} (Sisa Stock: ${i.stock} ${i.unit || 'Pcs'})\n`;
      });

      navigator.clipboard.writeText(text).then(() => {
        showToast('📋 Daftar Restok berhasil disalin! Siap dikirim ke Suplier via WA.', 'success');
      });
    });
  }

  // --- CART MANAGEMENT (HOLD & RESUME) ---
  function addToCart(product) {
    if (product.stock <= 0) {
      showToast('⚠️ Stok produk ini sudah habis!', 'error');
      return;
    }

    playBeepSound();

    if (product.stock < 3) {
      showToast(`⚠️ Stok ${product.name} sisa ${product.stock} ${product.unit || 'Pcs'} lagi!`, 'info');
    }

    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      if (existing.qty + 1 > product.stock) {
        showToast('⚠️ Jumlah di keranjang melebihi stok yang tersedia!', 'error');
        return;
      }
      existing.qty++;
    } else {
      cart.push({ product, qty: 1 });
    }

    renderCart();
  }

  function updateCartQty(productId, delta) {
    const item = cart.find(i => i.product.id === productId);
    if (!item) return;

    const newQty = item.qty + delta;
    if (newQty <= 0) {
      cart = cart.filter(i => i.product.id !== productId);
    } else {
      if (newQty > item.product.stock) {
        showToast('⚠️ Jumlah melebihi stok produk!', 'error');
        return;
      }
      item.qty = newQty;
    }
    renderCart();
  }

  if (btnHoldCart) {
    btnHoldCart.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('Keranjang masih kosong!', 'error');
        return;
      }
      heldCartsList.push([...cart]);
      cart = [];
      activeAppliedVoucher = null;
      if (voucherBadgeDisplay) voucherBadgeDisplay.style.display = 'none';
      if (cartDiscountInput) cartDiscountInput.value = 0;
      renderCart();
      btnResumeCart.style.display = 'inline-block';
      heldCartCount.textContent = heldCartsList.length;
      showToast('⏸️ Transaksi ditahan sementara.', 'info');
    });
  }

  if (btnResumeCart) {
    btnResumeCart.addEventListener('click', () => {
      if (heldCartsList.length === 0) return;
      cart = heldCartsList.pop();
      if (heldCartsList.length === 0) btnResumeCart.style.display = 'none';
      heldCartCount.textContent = heldCartsList.length;
      renderCart();
      showToast('▶️ Transaksi tertahan berhasil dipanggil kembali!', 'success');
    });
  }

  if (cartDiscountInput) {
    cartDiscountInput.addEventListener('input', renderCart);
  }

  btnClearCart.addEventListener('click', () => {
    if (cart.length === 0) return;
    cart = [];
    activeAppliedVoucher = null;
    if (voucherBadgeDisplay) voucherBadgeDisplay.style.display = 'none';
    if (cartDiscountInput) cartDiscountInput.value = 0;
    renderCart();
    showToast('🛒 Keranjang dikosongkan.', 'info');
  });

  function renderCart() {
    cartItemsList.innerHTML = '';

    if (cart.length === 0) {
      emptyCartState.style.display = 'block';
      cartSubtotalEl.textContent = 'Rp 0';
      cartTotalEl.textContent = 'Rp 0';
      btnCheckout.disabled = true;
      btnCheckout.style.opacity = '0.5';
      return;
    }

    emptyCartState.style.display = 'none';
    btnCheckout.disabled = false;
    btnCheckout.style.opacity = '1';

    let subtotal = 0;

    cart.forEach(item => {
      const itemSubtotal = item.product.price * item.qty;
      subtotal += itemSubtotal;

      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <div class="cart-item-info">
          <div class="cart-item-title">${escapeHtml(item.product.name)}</div>
          <div class="cart-item-price">Rp ${formatRupiah(item.product.price)} x ${item.qty} = <strong>Rp ${formatRupiah(itemSubtotal)}</strong></div>
        </div>
        <div class="cart-item-actions">
          <button class="btn-qty" onclick="event.stopPropagation(); updateCartQty('${item.product.id}', -1)">-</button>
          <span class="qty-badge">${item.qty}</span>
          <button class="btn-qty" onclick="event.stopPropagation(); updateCartQty('${item.product.id}', 1)">+</button>
        </div>
      `;

      cartItemsList.appendChild(div);
    });

    const manualDiscount = parseInt(cartDiscountInput ? cartDiscountInput.value : 0, 10) || 0;
    const voucherDiscount = activeAppliedVoucher ? activeAppliedVoucher.amount : 0;
    const finalTotal = Math.max(0, subtotal - manualDiscount - voucherDiscount);

    cartSubtotalEl.textContent = `Rp ${formatRupiah(subtotal)}`;
    cartTotalEl.textContent = `Rp ${formatRupiah(finalTotal)}`;
  }

  window.updateCartQty = updateCartQty;

  // --- CHECKOUT & PAYMENT ---
  btnCheckout.addEventListener('click', () => {
    if (cart.length === 0) return;

    const total = getCartTotal();
    modalPayTotal.textContent = `Rp ${formatRupiah(total)}`;
    payAmountInput.value = total;
    calculateChange();
    toggleQrisImagePreview();
    checkoutModal.classList.add('active');
  });

  if (payMethodSelect) {
    payMethodSelect.addEventListener('change', toggleQrisImagePreview);
  }

  function toggleQrisImagePreview() {
    if (!payMethodSelect || !qrisDisplayContainer) return;
    if (payMethodSelect.value === 'QRIS') {
      const qrisData = localStorage.getItem(`kaiser_qris_${activeWarung.id}`);
      if (qrisData) {
        modalQrisImg.src = qrisData;
        qrisDisplayContainer.style.display = 'block';
      } else {
        qrisDisplayContainer.style.display = 'none';
      }
    } else {
      qrisDisplayContainer.style.display = 'none';
    }
  }

  btnClosePayModal.addEventListener('click', () => {
    checkoutModal.classList.remove('active');
  });

  payAmountInput.addEventListener('input', calculateChange);

  quickCashBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const amount = parseInt(btn.dataset.amount, 10);
      const total = getCartTotal();

      if (amount === 0) {
        payAmountInput.value = total;
      } else {
        payAmountInput.value = amount;
      }
      calculateChange();
    });
  });

  function getCartTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);
    const manualDiscount = parseInt(cartDiscountInput ? cartDiscountInput.value : 0, 10) || 0;
    const voucherDiscount = activeAppliedVoucher ? activeAppliedVoucher.amount : 0;
    return Math.max(0, subtotal - manualDiscount - voucherDiscount);
  }

  function calculateChange() {
    const total = getCartTotal();
    const pay = parseInt(payAmountInput.value, 10) || 0;
    const change = pay - total;

    if (change >= 0) {
      payChangeDisplay.textContent = `Rp ${formatRupiah(change)}`;
      payChangeDisplay.style.color = 'var(--success)';
      btnProcessPay.disabled = false;
      btnProcessPay.style.opacity = '1';
    } else {
      payChangeDisplay.textContent = `Kurang Rp ${formatRupiah(Math.abs(change))}`;
      payChangeDisplay.style.color = 'var(--danger)';
      btnProcessPay.disabled = true;
      btnProcessPay.style.opacity = '0.5';
    }
  }

  btnProcessPay.addEventListener('click', () => {
    const total = getCartTotal();
    const pay = parseInt(payAmountInput.value, 10) || 0;
    const change = pay - total;
    const method = payMethodSelect ? payMethodSelect.value : 'TUNAI';
    const note = payNoteInput ? payNoteInput.value.trim() : '';
    const tableNo = payTableNoInput ? payTableNoInput.value.trim() : '';
    const customerAN = payCustomerANInput ? payCustomerANInput.value.trim() : '';

    if (pay < total) {
      showToast('⚠️ Uang pembayaran kurang!', 'error');
      return;
    }

    const itemsPayload = [];
    cart.forEach(item => {
      const p = products.find(prod => prod.id === item.product.id);
      if (p) {
        p.stock -= item.qty;
      }
      itemsPayload.push({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        costPrice: item.product.costPrice || 0,
        qty: item.qty,
        subtotal: item.product.price * item.qty
      });
    });

    saveProducts();

    // GENERATE DAILY RESETTING INVOICE NUMBER (RESET AT 00:00 TO #0001)
    const txNumber = KaiSerCore.generateDailyInvoiceNo(activeWarung.id);

    const newTx = {
      invoiceNo: txNumber,
      warungId: activeWarung.id,
      cashier: currentRole === 'ADMIN' ? (currentAdminUser ? currentAdminUser.name : 'Admin') : 'Owner',
      tableNo: tableNo || '-',
      customerAN: customerAN || '-',
      date: new Date().toISOString(),
      items: itemsPayload,
      subtotal: total,
      total: total,
      payAmount: pay,
      changeAmount: change,
      paymentMethod: method,
      note: note,
      synced: false
    };

    transactions.unshift(newTx);
    saveTransactions();

    cart = [];
    activeAppliedVoucher = null;
    if (voucherBadgeDisplay) voucherBadgeDisplay.style.display = 'none';
    if (cartDiscountInput) cartDiscountInput.value = 0;
    if (payNoteInput) payNoteInput.value = '';
    if (payTableNoInput) payTableNoInput.value = '';
    if (payCustomerANInput) payCustomerANInput.value = '';
    renderCart();
    renderPOSProducts();
    checkoutModal.classList.remove('active');

    showToast(`✅ Transaksi ${txNumber} Berhasil!`, 'success');
    openReceiptModal(newTx);

    const isAutoPrint = localStorage.getItem('kaiser_admin_auto_print') === 'true';
    if (isAutoPrint) {
      setTimeout(() => window.print(), 500);
    }
  });

  // --- SHIFT RECAP ENGINE ---
  if (btnOpenShiftModal) {
    btnOpenShiftModal.addEventListener('click', () => {
      shiftCashierName.value = currentRole === 'ADMIN' ? (currentAdminUser ? currentAdminUser.name : 'Admin') : 'Owner';
      shiftModal.classList.add('active');
    });
  }

  if (btnCloseShiftModal) {
    btnCloseShiftModal.addEventListener('click', () => shiftModal.classList.remove('active'));
  }

  if (btnProcessShiftRecap) {
    btnProcessShiftRecap.addEventListener('click', () => {
      const cashier = shiftCashierName.value;
      const startCash = parseInt(shiftStartCash.value, 10) || 0;
      const endCash = parseInt(shiftEndCash.value, 10) || 0;

      const cashSales = transactions.filter(t => t.paymentMethod === 'TUNAI').reduce((sum, t) => sum + t.total, 0);
      const expectedCash = startCash + cashSales;
      const diff = endCash - expectedCash;

      shiftModal.classList.remove('active');

      const html = `
        <div class="thermal-receipt">
          <div style="text-align: center; border-bottom: 1px dashed #000; padding-bottom: 8px; margin-bottom: 8px;">
            <h3 style="margin: 0; font-size: 16px; font-weight: 800;">📋 REKAP SHIFT KASIR</h3>
            <p style="margin: 2px 0; font-size: 11px;">${escapeHtml(activeWarung.warungName)}</p>
            <p style="margin: 0; font-size: 11px;">Waktu: ${new Date().toLocaleString('id-ID')}</p>
          </div>
          <div style="font-size: 12px; margin-bottom: 8px;">
            <div>Kasir: <strong>${escapeHtml(cashier)}</strong></div>
            <div>Total Transaksi: ${transactions.length} tx</div>
            <div>Modal Laci Awal: Rp ${formatRupiah(startCash)}</div>
            <div>Total Omset Tunai: Rp ${formatRupiah(cashSales)}</div>
            <div>Target Uang Laci: <strong>Rp ${formatRupiah(expectedCash)}</strong></div>
            <div>Fisik Uang Laci: <strong>Rp ${formatRupiah(endCash)}</strong></div>
            <div style="margin-top: 4px; font-weight: 700; color: ${diff >= 0 ? 'green' : 'red'};">
              Selisih: Rp ${formatRupiah(diff)} (${diff >= 0 ? 'Sesuai/Lebih' : 'Kurang'})
            </div>
          </div>
        </div>
      `;

      receiptContainer.innerHTML = html;
      receiptModal.classList.add('active');
      showToast('📋 Rekap Shift Berhasil Dibuat!', 'success');
    });
  }

  // --- THERMAL RECEIPT GENERATOR ---
  function openReceiptModal(tx) {
    currentReceiptTx = tx;
    receiptContainer.innerHTML = generateReceiptHTML(tx);
    receiptModal.classList.add('active');
  }

  btnCloseReceiptModal.addEventListener('click', () => {
    receiptModal.classList.remove('active');
  });

  btnPrintReceipt.addEventListener('click', () => {
    window.print();
  });

  if (btnExportTxCSV) {
    btnExportTxCSV.addEventListener('click', () => {
      KaiSerCore.exportTransactionsToCSV(transactions, activeWarung.warungName);
      showToast('📊 Laporan CSV Penjualan berhasil di-download!', 'success');
    });
  }

  // --- WA RECEIPT IMAGE GENERATOR MODAL HANDLERS ---
  if (btnOpenWASendModal) {
    btnOpenWASendModal.addEventListener('click', () => {
      if (!currentReceiptTx) return;
      const dataURL = generateReceiptCanvasImage(currentReceiptTx);
      waReceiptImgPreview.src = dataURL;
      btnDownloadReceiptImg.href = dataURL;
      btnDownloadReceiptImg.download = `Struk_${currentReceiptTx.invoiceNo.replace(/[\/\-]/g, '_')}.png`;
      waSendModal.classList.add('active');
    });
  }

  if (btnCloseWASendModal) {
    btnCloseWASendModal.addEventListener('click', () => {
      waSendModal.classList.remove('active');
    });
  }

  if (btnOpenWAChatDirect) {
    btnOpenWAChatDirect.addEventListener('click', () => {
      if (!currentReceiptTx) return;
      const rawPhone = waCustomerPhone ? waCustomerPhone.value.trim() : '';
      let cleanPhone = rawPhone.replace(/[^0-9]/g, '');

      if (cleanPhone.startsWith('0')) {
        cleanPhone = '62' + cleanPhone.slice(1);
      }

      const textMsg = `ini adalah Struk belanja Anda, Terima Kasih 🌊`;
      const waURL = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(textMsg)}`;
      window.open(waURL, '_blank');
    });
  }

  // --- HTML5 CANVAS RECEIPT IMAGE GENERATOR ---
  function generateReceiptCanvasImage(tx) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 440;
    const itemHeight = tx.items.length * 28;
    const extraHeight = ((tx.customerAN && tx.customerAN !== '-') ? 20 : 0) + ((tx.tableNo && tx.tableNo !== '-') ? 20 : 0);
    canvas.height = 380 + itemHeight + extraHeight;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'center';
    ctx.font = 'bold 22px Inter, sans-serif';
    ctx.fillText(activeWarung.warungName, 220, 42);

    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText(activeWarung.address || '', 220, 64);
    ctx.fillText(`Telp: ${activeWarung.phone || ''}`, 220, 82);

    ctx.beginPath();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.moveTo(20, 100);
    ctx.lineTo(420, 100);
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(`No Invoice : ${tx.invoiceNo}`, 24, 122);
    ctx.font = '12px monospace';
    ctx.fillText(`Kasir      : ${tx.cashier || 'Kasir'}`, 24, 140);
    
    let currentY = 158;

    if (tx.tableNo && tx.tableNo !== '-') {
      ctx.fillText(`Table/Meja : ${tx.tableNo}`, 24, currentY);
      currentY += 18;
    }

    if (tx.customerAN && tx.customerAN !== '-') {
      ctx.fillText(`Atas Nama  : ${tx.customerAN}`, 24, currentY);
      currentY += 18;
    }
    ctx.fillText(`Tanggal    : ${new Date(tx.date).toLocaleString('id-ID')}`, 24, currentY);
    currentY += 18;

    if (tx.note) {
      ctx.font = 'italic 11px Inter, sans-serif';
      ctx.fillText(`Catatan    : ${tx.note}`, 24, currentY);
      currentY += 16;
    }

    ctx.beginPath();
    ctx.moveTo(20, currentY);
    ctx.lineTo(420, currentY);
    ctx.stroke();

    let y = currentY + 24;
    tx.items.forEach(i => {
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${i.name} x${i.qty}`, 24, y);
      ctx.textAlign = 'right';
      ctx.fillText(`Rp ${formatRupiah(i.subtotal)}`, 416, y);
      y += 26;
    });

    ctx.beginPath();
    ctx.moveTo(20, y);
    ctx.lineTo(420, y);
    ctx.stroke();
    y += 24;

    ctx.font = 'bold 15px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('TOTAL :', 24, y);
    ctx.textAlign = 'right';
    ctx.fillText(`Rp ${formatRupiah(tx.total)}`, 416, y);
    y += 22;

    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Bayar (${tx.paymentMethod}) :`, 24, y);
    ctx.textAlign = 'right';
    ctx.fillText(`Rp ${formatRupiah(tx.payAmount)}`, 416, y);
    y += 20;

    ctx.fillText('Kembali :', 24, y);
    ctx.fillText(`Rp ${formatRupiah(tx.changeAmount)}`, 416, y);
    y += 32;

    ctx.textAlign = 'center';
    ctx.font = 'italic 12px Inter, sans-serif';
    ctx.fillText(localStorage.getItem(`kaiser_receipt_note_${activeWarung.id}`) || 'Terima kasih atas kunjungan Anda!', 220, y);
    y += 22;
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.fillStyle = '#0284c7';
    ctx.fillText('KaiSer POS — Kasir Simpel 🌊', 220, y);

    return canvas.toDataURL('image/png');
  }

  function generateReceiptHTML(tx) {
    const formattedDate = new Date(tx.date).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
    const logoData = localStorage.getItem(`kaiser_logo_${activeWarung.id}`);
    let itemsHTML = '';

    tx.items.forEach(item => {
      itemsHTML += `
        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 2px;">
          <span>${escapeHtml(item.name)} x${item.qty}</span>
          <span>${formatRupiah(item.subtotal)}</span>
        </div>
      `;
    });

    const receiptLogoHTML = logoData 
      ? `<img src="${logoData}" style="max-height: 48px; max-width: 120px; object-fit: contain; margin-bottom: 6px;">` 
      : `<div style="font-size: 24px; margin-bottom: 4px;">🌊</div>`;

    const tableHTML = (tx.tableNo && tx.tableNo !== '-') ? `<div>Table/Meja: <strong>${escapeHtml(tx.tableNo)}</strong></div>` : '';
    const anHTML = (tx.customerAN && tx.customerAN !== '-') ? `<div>A.N.: <strong>${escapeHtml(tx.customerAN)}</strong></div>` : '';
    const noteHTML = tx.note ? `<div style="font-size: 11px; font-style: italic; margin-top: 4px;">Catatan: ${escapeHtml(tx.note)}</div>` : '';

    return `
      <div class="thermal-receipt">
        <div style="text-align: center; border-bottom: 1px dashed #000; padding-bottom: 8px; margin-bottom: 8px;">
          ${receiptLogoHTML}
          <h3 style="margin: 0; font-size: 16px; font-weight: 800;">${escapeHtml(activeWarung.warungName)}</h3>
          <p style="margin: 2px 0; font-size: 11px;">${escapeHtml(activeWarung.address || '')}</p>
          <p style="margin: 0; font-size: 11px;">Telp: ${escapeHtml(activeWarung.phone || '')}</p>
        </div>

        <div style="font-size: 11px; margin-bottom: 8px; border-bottom: 1px dashed #000; padding-bottom: 8px;">
          <div>No: <strong>${tx.invoiceNo}</strong></div>
          <div>Kasir: ${escapeHtml(tx.cashier || 'Kasir')}</div>
          ${tableHTML}
          ${anHTML}
          <div>Tgl: ${formattedDate}</div>
          ${noteHTML}
        </div>

        <div style="margin-bottom: 8px; border-bottom: 1px dashed #000; padding-bottom: 8px;">
          ${itemsHTML}
        </div>

        <div style="font-size: 12px; font-weight: 700; text-align: right; margin-bottom: 8px; border-bottom: 1px dashed #000; padding-bottom: 8px;">
          <div style="display: flex; justify-content: space-between;">
            <span>TOTAL:</span>
            <span>Rp ${formatRupiah(tx.total)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-weight: 400; font-size: 11px; margin-top: 2px;">
            <span>Bayar (${tx.paymentMethod}):</span>
            <span>Rp ${formatRupiah(tx.payAmount)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-weight: 400; font-size: 11px; margin-top: 2px;">
            <span>Kembali:</span>
            <span>Rp ${formatRupiah(tx.changeAmount)}</span>
          </div>
        </div>

        <div style="text-align: center; font-size: 11px; margin-top: 10px;">
          <p style="margin: 0;">${escapeHtml(localStorage.getItem(`kaiser_receipt_note_${activeWarung.id}`) || 'Terima kasih atas kunjungan Anda!')}</p>
          <p style="margin-top: 4px; font-weight: 700;">KaiSer POS — Kasir Simpel 🌊</p>
        </div>
      </div>
    `;
  }

  // --- PRODUCT INVENTORY MANAGEMENT ---
  function renderProductTable() {
    productTableBody.innerHTML = '';

    products.forEach((p, index) => {
      const tr = document.createElement('tr');
      const actionButtonsHTML = currentRole === 'OWNER' 
        ? `<button class="btn-icon btn-icon-reset" onclick="openEditProductModal('${p.id}')">✏️ Edit</button>
           <button class="btn-icon btn-icon-danger" onclick="deleteProduct('${p.id}')">🗑️</button>`
        : `<span style="font-size: 12px; color: var(--text-muted);">Akses Terbatas</span>`;

      const costPriceHTML = currentRole === 'OWNER'
        ? `<td>Rp ${formatRupiah(p.costPrice || 0)}</td>`
        : ``;

      const expiredBadgeHTML = p.expiredDate 
        ? `<br><span style="font-size: 10.5px; color: var(--warning);">Exp: ${p.expiredDate}</span>`
        : ``;

      tr.innerHTML = `
        <td><strong>${escapeHtml(p.sku || 'P' + (index + 1))}</strong></td>
        <td><strong style="color: var(--dark-ocean);">${escapeHtml(p.name)}</strong></td>
        <td>
          <span class="product-cat">${escapeHtml(p.category)}</span>
          <span style="font-size: 11px; font-weight: 700; color: var(--primary);">(${escapeHtml(p.unit || 'Pcs')})</span>
        </td>
        ${costPriceHTML}
        <td><strong>Rp ${formatRupiah(p.price)}</strong></td>
        <td>
          <span class="status-badge ${p.stock <= 5 ? 'badge-suspend' : 'badge-aktif'}">${p.stock} ${escapeHtml(p.unit || 'Pcs')}</span>
          ${expiredBadgeHTML}
        </td>
        <td>${actionButtonsHTML}</td>
      `;
      productTableBody.appendChild(tr);
    });
  }

  btnAddProduct.addEventListener('click', () => {
    if (currentRole !== 'OWNER') return;
    editingProductId = null;
    modalProductTitle.textContent = '➕ Tambah Produk Baru';
    productForm.reset();
    if (prodCategoryCustom) {
      prodCategoryCustom.style.display = 'none';
      prodCategoryCustom.value = '';
    }
    productModal.classList.add('active');
  });

  btnCloseProductModal.addEventListener('click', () => {
    productModal.classList.remove('active');
  });

  window.openEditProductModal = (id) => {
    if (currentRole !== 'OWNER') return;
    const p = products.find(item => item.id === id);
    if (!p) return;

    editingProductId = id;
    modalProductTitle.textContent = '✏️ Edit Produk';
    document.getElementById('prodName').value = p.name;
    
    const stdCats = ['Makanan', 'Minuman', 'Sembako'];
    if (stdCats.includes(p.category)) {
      prodCategory.value = p.category;
      prodCategoryCustom.style.display = 'none';
      prodCategoryCustom.value = '';
    } else {
      prodCategory.value = 'Lainnya';
      prodCategoryCustom.style.display = 'block';
      prodCategoryCustom.value = p.category;
    }

    document.getElementById('prodUnit').value = p.unit || 'Pcs';
    document.getElementById('prodCostPrice').value = p.costPrice || 0;
    document.getElementById('prodPrice').value = p.price;
    document.getElementById('prodStock').value = p.stock;
    document.getElementById('prodSKU').value = p.sku || '';
    document.getElementById('prodExpiredDate').value = p.expiredDate || '';

    productModal.classList.add('active');
  };

  productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (currentRole !== 'OWNER') return;

    const name = document.getElementById('prodName').value.trim();
    
    let category = prodCategory.value;
    if (category === 'Lainnya') {
      category = prodCategoryCustom.value.trim() || 'Lainnya';
    }

    const unit = document.getElementById('prodUnit').value;
    const costPrice = parseInt(document.getElementById('prodCostPrice').value, 10) || 0;
    const price = parseInt(document.getElementById('prodPrice').value, 10) || 0;
    const stock = parseInt(document.getElementById('prodStock').value, 10) || 0;
    const sku = document.getElementById('prodSKU').value.trim();
    const expDate = document.getElementById('prodExpiredDate').value;

    if (editingProductId) {
      const p = products.find(item => item.id === editingProductId);
      if (p) {
        p.name = name;
        p.category = category;
        p.unit = unit;
        p.costPrice = costPrice;
        p.price = price;
        p.stock = stock;
        p.sku = sku;
        p.expiredDate = expDate;
      }
      showToast('✏️ Produk berhasil diperbarui!', 'success');
    } else {
      const newProd = {
        id: 'P' + Date.now().toString().slice(-6),
        name, category, unit, costPrice, price, stock, sku, expiredDate: expDate
      };
      products.unshift(newProd);
      showToast(`✨ Produk baru kategori "${category}" ditambahkan!`, 'success');
    }

    saveProducts();
    productModal.classList.remove('active');
    renderProductTable();
    renderPOSProducts();
  });

  window.deleteProduct = (id) => {
    if (currentRole !== 'OWNER') return;
    if (confirm('Hapus produk ini dari katalog?')) {
      products = products.filter(p => p.id !== id);
      saveProducts();
      renderProductTable();
      renderPOSProducts();
      showToast('🗑️ Produk telah dihapus.', 'info');
    }
  };

  // --- TRANSACTIONS HISTORY ---
  function renderTxHistory() {
    txHistoryTableBody.innerHTML = '';

    transactions.forEach(tx => {
      const tr = document.createElement('tr');
      const formattedDate = new Date(tx.date).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });

      tr.innerHTML = `
        <td><strong style="font-family: monospace;">${tx.invoiceNo}</strong></td>
        <td><span class="product-cat">${escapeHtml(tx.tableNo || '-')}</span></td>
        <td><strong>${escapeHtml(tx.customerAN || '-')}</strong></td>
        <td>${formattedDate}</td>
        <td>${escapeHtml(tx.cashier || 'Kasir')}</td>
        <td>${tx.items.length} item</td>
        <td><strong>Rp ${formatRupiah(tx.total)}</strong></td>
        <td><span class="status-badge badge-aktif">${tx.paymentMethod}</span></td>
        <td>
          <button class="btn-icon btn-icon-reset" onclick="reprintReceipt('${tx.invoiceNo}')">🖨️ Struk</button>
        </td>
      `;
      txHistoryTableBody.appendChild(tr);
    });
  }

  window.reprintReceipt = (invoiceNo) => {
    const tx = transactions.find(t => t.invoiceNo === invoiceNo);
    if (tx) openReceiptModal(tx);
  };

  // --- REPORTS & ANALYTICS ---
  function renderReports() {
    if (currentRole !== 'OWNER') return;

    let totalOmset = 0;
    let totalModal = 0;
    let totalItems = 0;
    const productStats = {};

    transactions.forEach(tx => {
      totalOmset += tx.total;
      tx.items.forEach(i => {
        totalModal += (i.costPrice || 0) * i.qty;
        totalItems += i.qty;

        if (!productStats[i.name]) {
          productStats[i.name] = { qty: 0, revenue: 0 };
        }
        productStats[i.name].qty += i.qty;
        productStats[i.name].revenue += i.subtotal;
      });
    });

    const warung = KaiSerCore.getWarungById(activeWarung.id);
    const totalExp = (warung && warung.expenses) ? warung.expenses.reduce((sum, e) => sum + e.amount, 0) : 0;
    const totalPetty = (warung && warung.pettyCash) ? warung.pettyCash.reduce((sum, p) => sum + p.amount, 0) : 0;

    const netProfit = totalOmset - totalModal - totalExp - totalPetty;

    reportOmset.textContent = `Rp ${formatRupiah(totalOmset)}`;
    if (reportTotalExpenses) reportTotalExpenses.textContent = `Rp ${formatRupiah(totalExp + totalPetty)}`;
    reportProfit.textContent = `Rp ${formatRupiah(netProfit)}`;
    reportTxCount.textContent = transactions.length;

    const sorted = Object.keys(productStats)
      .map(key => ({ name: key, ...productStats[key] }))
      .sort((a,b) => b.qty - a.qty);

    topProductsList.innerHTML = '';
    sorted.slice(0, 5).forEach((item, index) => {
      const li = document.createElement('li');
      li.style.display = 'flex';
      li.style.justifySpaceBetween = 'space-between';
      li.style.padding = '8px 0';
      li.style.borderBottom = '1px solid var(--border-color)';
      li.innerHTML = `
        <span><strong>#${index + 1} ${escapeHtml(item.name)}</strong></span>
        <span><strong>${item.qty} pcs</strong> (Rp ${formatRupiah(item.revenue)})</span>
      `;
      topProductsList.appendChild(li);
    });
  }

  // --- SETTINGS & BACKUP ---
  function loadSettingsForm() {
    if (!activeWarung || currentRole !== 'OWNER') return;

    settingWarungName.value = activeWarung.warungName;
    settingOwnerName.value = activeWarung.ownerName || '';
    settingPhone.value = activeWarung.phone || '';
    settingAddress.value = activeWarung.address || '';
    settingReceiptNote.value = localStorage.getItem(`kaiser_receipt_note_${activeWarung.id}`) || 'Terima kasih atas kunjungan Anda!';
    
    displayDurationLabel.textContent = `Paket ${activeWarung.durationLabel || '1 Bulan'}`;
    displayExpiredDate.textContent = activeWarung.expiredAt ? new Date(activeWarung.expiredAt).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' }) : '-';
    
    if (activeWarung.status === KaiSerCore.STATUS.AKTIF) {
      displaySubscriptionBadge.className = 'status-badge badge-aktif';
      displaySubscriptionBadge.innerHTML = '<span class="status-dot dot-aktif"></span> AKTIF';
    } else if (activeWarung.status === KaiSerCore.STATUS.EXPIRED) {
      displaySubscriptionBadge.className = 'status-badge badge-nonaktif';
      displaySubscriptionBadge.innerHTML = '<span class="status-dot dot-nonaktif"></span> KADALUARSA / EXPIRED';
    }

    updateLogoDisplay();
    updateQrisDisplay();
  }

  btnSaveSettings.addEventListener('click', () => {
    if (currentRole !== 'OWNER') return;

    activeWarung.warungName = settingWarungName.value;
    activeWarung.ownerName = settingOwnerName.value;
    activeWarung.phone = settingPhone.value;
    activeWarung.address = settingAddress.value;

    localStorage.setItem(`kaiser_receipt_note_${activeWarung.id}`, settingReceiptNote.value);
    showToast('💾 Pengaturan profil warung disimpan!', 'success');
    showDashboard();
  });

  btnExportBackup.addEventListener('click', () => {
    if (currentRole !== 'OWNER') return;

    const backupData = {
      warung: activeWarung,
      products,
      transactions,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KaiSer_Backup_${activeWarung.id}_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    showToast('📦 Data Backup lokal berhasil di-download!', 'success');
  });

  inputImportBackup.addEventListener('change', (e) => {
    if (currentRole !== 'OWNER') return;
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.products) products = data.products;
        if (data.transactions) transactions = data.transactions;

        saveProducts();
        saveTransactions();

        showToast('📥 Restore Data Backup Berhasil!', 'success');
        showDashboard();
      } catch (err) {
        showToast('⚠️ Format file backup tidak valid!', 'error');
      }
    };
    reader.readAsText(file);
  });

  // --- UTILS ---
  function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID').format(number || 0);
  }

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
    if (type === 'warning') toast.style.borderLeft = '4px solid var(--warning)';

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
