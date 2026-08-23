/**
 * KaiSer Warung Controller (js/warung.js)
 * Kasir Simpel, Bisnis Lancar 🌊
 * POS Engine optimized for Mobile, Tablet & Offline Storage
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const loginSection = document.getElementById('loginSection');
  const appSection = document.getElementById('appSection');

  // Auth Form
  const warungLoginForm = document.getElementById('warungLoginForm');
  const warungIdInput = document.getElementById('warungIdInput');
  const warungPwdInput = document.getElementById('warungPwdInput');
  const toggleWarungPwd = document.getElementById('toggleWarungPwd');

  // Header & Info
  const headerWarungName = document.getElementById('headerWarungName');
  const headerWarungId = document.getElementById('headerWarungId');
  const onlineStatusBadge = document.getElementById('onlineStatusBadge');
  const btnLogoutWarung = document.getElementById('btnLogoutWarung');

  // Navigation Tabs
  const navTabs = document.querySelectorAll('.nav-tab');
  const tabPages = document.querySelectorAll('.tab-page');

  // POS Elements
  const productSearchInput = document.getElementById('productSearchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const productGrid = document.getElementById('productGrid');
  const emptyProductsState = document.getElementById('emptyProductsState');

  // Cart Elements
  const cartItemsList = document.getElementById('cartItemsList');
  const emptyCartState = document.getElementById('emptyCartState');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const cartTotalEl = document.getElementById('cartTotal');
  const btnClearCart = document.getElementById('btnClearCart');
  const btnCheckout = document.getElementById('btnCheckout');

  // Payment Modal
  const checkoutModal = document.getElementById('checkoutModal');
  const modalPayTotal = document.getElementById('modalPayTotal');
  const payAmountInput = document.getElementById('payAmountInput');
  const payChangeDisplay = document.getElementById('payChangeDisplay');
  const quickCashBtns = document.querySelectorAll('.btn-quick-cash');
  const btnProcessPay = document.getElementById('btnProcessPay');
  const btnClosePayModal = document.getElementById('btnClosePayModal');
  let selectedPaymentMethod = 'TUNAI';

  // Receipt Modal
  const receiptModal = document.getElementById('receiptModal');
  const receiptContainer = document.getElementById('receiptContainer');
  const btnPrintReceipt = document.getElementById('btnPrintReceipt');
  const btnShareWA = document.getElementById('btnShareWA');
  const btnCloseReceiptModal = document.getElementById('btnCloseReceiptModal');

  // Product Manager
  const productTableBody = document.getElementById('productTableBody');
  const btnAddProduct = document.getElementById('btnAddProduct');
  const productModal = document.getElementById('productModal');
  const productForm = document.getElementById('productForm');
  const btnCloseProductModal = document.getElementById('btnCloseProductModal');
  const modalProductTitle = document.getElementById('modalProductTitle');

  // Transactions History
  const txHistoryTableBody = document.getElementById('txHistoryTableBody');

  // Reports
  const reportOmset = document.getElementById('reportOmset');
  const reportProfit = document.getElementById('reportProfit');
  const reportTxCount = document.getElementById('reportTxCount');
  const reportItemsSold = document.getElementById('reportItemsSold');
  const topProductsList = document.getElementById('topProductsList');

  // Settings & Backup
  const settingWarungName = document.getElementById('settingWarungName');
  const settingOwnerName = document.getElementById('settingOwnerName');
  const settingPhone = document.getElementById('settingPhone');
  const settingAddress = document.getElementById('settingAddress');
  const settingReceiptNote = document.getElementById('settingReceiptNote');
  const btnSaveSettings = document.getElementById('btnSaveSettings');
  const btnExportBackup = document.getElementById('btnExportBackup');
  const inputImportBackup = document.getElementById('inputImportBackup');

  // --- APP STATE ---
  let activeWarung = null;
  let products = [];
  let cart = [];
  let transactions = [];
  let editingProductId = null;
  let currentReceiptTx = null;

  // --- INITIALIZATION ---
  initApp();

  function initApp() {
    listenNetworkStatus();
    checkWarungSession();

    if (toggleWarungPwd) {
      toggleWarungPwd.addEventListener('click', () => {
        const isPwd = warungPwdInput.type === 'password';
        warungPwdInput.type = isPwd ? 'text' : 'password';
        toggleWarungPwd.textContent = isPwd ? '👁️‍🗨️' : '👁️';
      });
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
        const warung = KaiSerCore.getWarungById(session.id);
        if (warung && warung.status === KaiSerCore.STATUS.AKTIF) {
          activeWarung = warung;
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
  }

  function showDashboard() {
    loginSection.style.display = 'none';
    appSection.style.display = 'block';

    headerWarungName.textContent = activeWarung.warungName;
    headerWarungId.textContent = activeWarung.id;

    loadWarungData();
    renderPOSProducts();
    renderCart();
    renderProductTable();
    renderTxHistory();
    renderReports();
    loadSettingsForm();
  }

  // --- AUTHENTICATION ---
  warungLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = warungIdInput.value.trim().toUpperCase();
    const pwd = warungPwdInput.value.trim();

    const warung = KaiSerCore.getWarungById(id);
    if (!warung) {
      showToast('⚠️ ID Warung tidak ditemukan!', 'error');
      return;
    }

    if (warung.password !== pwd) {
      showToast('⚠️ Password Warung salah!', 'error');
      return;
    }

    if (warung.status === KaiSerCore.STATUS.SUSPEND) {
      showToast('🟡 Akun Warung Anda sedang ditangguhkan (SUSPEND). Hubungi Creator KaiSer.', 'error');
      return;
    }

    if (warung.status === KaiSerCore.STATUS.NONAKTIF) {
      showToast('🔴 Akun Warung ini sudah NONAKTIF.', 'error');
      return;
    }

    // Save session
    activeWarung = warung;
    localStorage.setItem('kaiser_warung_session', JSON.stringify({ id: warung.id, loginTime: new Date().toISOString() }));
    showToast(`🌊 Selamat Datang di ${warung.warungName}!`, 'success');
    showDashboard();
  });

  btnLogoutWarung.addEventListener('click', () => {
    localStorage.removeItem('kaiser_warung_session');
    activeWarung = null;
    showToast('🚪 Berhasil keluar dari aplikasi.', 'info');
    showLogin();
  });

  // --- NAVIGATION TABS ---
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      navTabs.forEach(t => t.classList.remove('active'));
      tabPages.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(`tab-${target}`).classList.add('active');

      if (target === 'produk') renderProductTable();
      if (target === 'riwayat') renderTxHistory();
      if (target === 'laporan') renderReports();
    });
  });

  // --- LOCAL DATA PERSISTENCE ---
  function loadWarungData() {
    if (!activeWarung) return;

    // Load Products
    const prodData = localStorage.getItem(`kaiser_products_${activeWarung.id}`);
    if (prodData) {
      try { products = JSON.parse(prodData); } catch (e) { products = []; }
    } else {
      // Default demo products for immediate use
      products = [
        { id: 'P001', name: 'Kopi Susu Gula Aren', category: 'Minuman', costPrice: 8000, price: 15000, stock: 45, sku: '8991001' },
        { id: 'P002', name: 'Nasi Goreng Spesial', category: 'Makanan', costPrice: 12000, price: 20000, stock: 30, sku: '8991002' },
        { id: 'P003', name: 'Es Teh Manis', category: 'Minuman', costPrice: 2000, price: 5000, stock: 100, sku: '8991003' },
        { id: 'P004', name: 'Minyak Goreng 1L', category: 'Sembako', costPrice: 14000, price: 17500, stock: 20, sku: '8991004' },
        { id: 'P005', name: 'Beras Premium 5kg', category: 'Sembako', costPrice: 65000, price: 72000, stock: 12, sku: '8991005' },
        { id: 'P006', name: 'Roti Bakar Coklat', category: 'Makanan', costPrice: 7000, price: 12000, stock: 15, sku: '8991006' }
      ];
      saveProducts();
    }

    // Load Transactions
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
        <div class="product-cat">${escapeHtml(p.category)}</div>
        <div class="product-title">${escapeHtml(p.name)}</div>
        <div class="product-price">Rp ${formatRupiah(p.price)}</div>
        <div class="product-stock ${p.stock <= 5 ? 'stock-low' : ''}">Stok: ${p.stock}</div>
      `;

      card.addEventListener('click', () => addToCart(p));
      productGrid.appendChild(card);
    });
  }

  // --- CART MANAGEMENT ---
  function addToCart(product) {
    if (product.stock <= 0) {
      showToast('⚠️ Stok produk ini sudah habis!', 'error');
      return;
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

  btnClearCart.addEventListener('click', () => {
    if (cart.length === 0) return;
    cart = [];
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

    cartSubtotalEl.textContent = `Rp ${formatRupiah(subtotal)}`;
    cartTotalEl.textContent = `Rp ${formatRupiah(subtotal)}`;
  }

  window.updateCartQty = updateCartQty;

  // --- CHECKOUT & PAYMENT ---
  btnCheckout.addEventListener('click', () => {
    if (cart.length === 0) return;

    const total = getCartTotal();
    modalPayTotal.textContent = `Rp ${formatRupiah(total)}`;
    payAmountInput.value = total;
    calculateChange();
    checkoutModal.classList.add('active');
  });

  btnClosePayModal.addEventListener('click', () => {
    checkoutModal.classList.remove('active');
  });

  payAmountInput.addEventListener('input', calculateChange);

  quickCashBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const amount = parseInt(btn.dataset.amount, 10);
      const total = getCartTotal();

      if (amount === 0) {
        payAmountInput.value = total; // Uang Pas
      } else {
        payAmountInput.value = amount;
      }
      calculateChange();
    });
  });

  function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);
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

    if (pay < total) {
      showToast('⚠️ Uang pembayaran kurang!', 'error');
      return;
    }

    // Deduct stock & prepare items payload
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

    // Create Transaction Record
    const txNumber = 'INV/' + new Date().toISOString().slice(2,10).replace(/-/g,'') + '/' + Math.floor(1000 + Math.random() * 9000);
    const newTx = {
      invoiceNo: txNumber,
      warungId: activeWarung.id,
      date: new Date().toISOString(),
      items: itemsPayload,
      subtotal: total,
      total: total,
      payAmount: pay,
      changeAmount: change,
      paymentMethod: selectedPaymentMethod,
      synced: false
    };

    transactions.unshift(newTx);
    saveTransactions();

    // Reset Cart & Close Payment Modal
    cart = [];
    renderCart();
    renderPOSProducts();
    checkoutModal.classList.remove('active');

    showToast(`✅ Transaksi ${txNumber} Berhasil!`, 'success');

    // Open Thermal Receipt Modal
    openReceiptModal(newTx);
  });

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

  btnShareWA.addEventListener('click', () => {
    if (!currentReceiptTx) return;
    const text = generateWAReceiptText(currentReceiptTx);
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  });

  function generateReceiptHTML(tx) {
    const formattedDate = new Date(tx.date).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
    let itemsHTML = '';

    tx.items.forEach(item => {
      itemsHTML += `
        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 2px;">
          <span>${escapeHtml(item.name)} x${item.qty}</span>
          <span>${formatRupiah(item.subtotal)}</span>
        </div>
      `;
    });

    return `
      <div class="thermal-receipt">
        <div style="text-align: center; border-bottom: 1px dashed #000; padding-bottom: 8px; margin-bottom: 8px;">
          <h3 style="margin: 0; font-size: 16px; font-weight: 800;">${escapeHtml(activeWarung.warungName)}</h3>
          <p style="margin: 2px 0; font-size: 11px;">${escapeHtml(activeWarung.address || '')}</p>
          <p style="margin: 0; font-size: 11px;">Telp: ${escapeHtml(activeWarung.phone || '')}</p>
        </div>

        <div style="font-size: 11px; margin-bottom: 8px; border-bottom: 1px dashed #000; padding-bottom: 8px;">
          <div>No: <strong>${tx.invoiceNo}</strong></div>
          <div>Tgl: ${formattedDate}</div>
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

  function generateWAReceiptText(tx) {
    let itemsText = '';
    tx.items.forEach(i => {
      itemsText += `• ${i.name} (${i.qty}x) = Rp ${formatRupiah(i.subtotal)}\n`;
    });

    return `🧾 *STRUK PEMBAYARAN ${activeWarung.warungName.toUpperCase()}*
━━━━━━━━━━━━━━━━━━━━━━━━━━
No Invoice: \`${tx.invoiceNo}\`
Tanggal: ${new Date(tx.date).toLocaleString('id-ID')}

${itemsText}
━━━━━━━━━━━━━━━━━━━━━━━━━━
*TOTAL: Rp ${formatRupiah(tx.total)}*
Bayar: Rp ${formatRupiah(tx.payAmount)}
Kembali: Rp ${formatRupiah(tx.changeAmount)}

_${localStorage.getItem(`kaiser_receipt_note_${activeWarung.id}`) || 'Terima kasih telah berbelanja!'}_ 🌊`;
  }

  // --- PRODUCT INVENTORY MANAGEMENT ---
  function renderProductTable() {
    productTableBody.innerHTML = '';

    products.forEach((p, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${escapeHtml(p.sku || 'P' + (index + 1))}</strong></td>
        <td><strong style="color: var(--dark-ocean);">${escapeHtml(p.name)}</strong></td>
        <td><span class="product-cat">${escapeHtml(p.category)}</span></td>
        <td>Rp ${formatRupiah(p.costPrice || 0)}</td>
        <td><strong>Rp ${formatRupiah(p.price)}</strong></td>
        <td><span class="status-badge ${p.stock <= 5 ? 'badge-suspend' : 'badge-aktif'}">${p.stock} pcs</span></td>
        <td>
          <button class="btn-icon btn-icon-reset" onclick="openEditProductModal('${p.id}')">✏️ Edit</button>
          <button class="btn-icon btn-icon-danger" onclick="deleteProduct('${p.id}')">🗑️</button>
        </td>
      `;
      productTableBody.appendChild(tr);
    });
  }

  btnAddProduct.addEventListener('click', () => {
    editingProductId = null;
    modalProductTitle.textContent = '➕ Tambah Produk Baru';
    productForm.reset();
    productModal.classList.add('active');
  });

  btnCloseProductModal.addEventListener('click', () => {
    productModal.classList.remove('active');
  });

  window.openEditProductModal = (id) => {
    const p = products.find(item => item.id === id);
    if (!p) return;

    editingProductId = id;
    modalProductTitle.textContent = '✏️ Edit Produk';
    document.getElementById('prodName').value = p.name;
    document.getElementById('prodCategory').value = p.category;
    document.getElementById('prodCostPrice').value = p.costPrice || 0;
    document.getElementById('prodPrice').value = p.price;
    document.getElementById('prodStock').value = p.stock;
    document.getElementById('prodSKU').value = p.sku || '';

    productModal.classList.add('active');
  };

  productForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('prodName').value.trim();
    const category = document.getElementById('prodCategory').value;
    const costPrice = parseInt(document.getElementById('prodCostPrice').value, 10) || 0;
    const price = parseInt(document.getElementById('prodPrice').value, 10) || 0;
    const stock = parseInt(document.getElementById('prodStock').value, 10) || 0;
    const sku = document.getElementById('prodSKU').value.trim();

    if (editingProductId) {
      const p = products.find(item => item.id === editingProductId);
      if (p) {
        p.name = name;
        p.category = category;
        p.costPrice = costPrice;
        p.price = price;
        p.stock = stock;
        p.sku = sku;
      }
      showToast('✏️ Produk berhasil diperbarui!', 'success');
    } else {
      const newProd = {
        id: 'P' + Date.now().toString().slice(-6),
        name, category, costPrice, price, stock, sku
      };
      products.unshift(newProd);
      showToast('✨ Produk baru ditambahkan!', 'success');
    }

    saveProducts();
    productModal.classList.remove('active');
    renderProductTable();
    renderPOSProducts();
  });

  window.deleteProduct = (id) => {
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
        <td>${formattedDate}</td>
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

    const netProfit = totalOmset - totalModal;

    reportOmset.textContent = `Rp ${formatRupiah(totalOmset)}`;
    reportProfit.textContent = `Rp ${formatRupiah(netProfit)}`;
    reportTxCount.textContent = transactions.length;
    reportItemsSold.textContent = `${totalItems} pcs`;

    // Render Top Products
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
    if (!activeWarung) return;
    settingWarungName.value = activeWarung.warungName;
    settingOwnerName.value = activeWarung.ownerName || '';
    settingPhone.value = activeWarung.phone || '';
    settingAddress.value = activeWarung.address || '';
    settingReceiptNote.value = localStorage.getItem(`kaiser_receipt_note_${activeWarung.id}`) || 'Terima kasih atas kunjungan Anda!';
  }

  btnSaveSettings.addEventListener('click', () => {
    activeWarung.warungName = settingWarungName.value;
    activeWarung.ownerName = settingOwnerName.value;
    activeWarung.phone = settingPhone.value;
    activeWarung.address = settingAddress.value;

    localStorage.setItem(`kaiser_receipt_note_${activeWarung.id}`, settingReceiptNote.value);
    showToast('💾 Pengaturan profil warung disimpan!', 'success');
    showDashboard();
  });

  btnExportBackup.addEventListener('click', () => {
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
