/**
 * KaiSer Core Engine (kaiser-core.js)
 * Kasir Simpel, Bisnis Lancar 🌊
 * 
 * Provides storage management, Creator authentication, 
 * Warung account lifecycle (Create, Suspend, Activate, Reset PW),
 * and Multi-tenant data scoping.
 */

const KaiSerCore = (() => {
  // Storage Keys
  const STORAGE_KEYS = {
    CREATOR_SESSION: 'kaiser_creator_session',
    WARUNGS: 'kaiser_warungs_db',
    WARUNG_SESSION: 'kaiser_warung_session'
  };

  // Master Creator Credentials (Enforced via hash logic)
  const MASTER_CREATOR = {
    username: 'ilyas0905',
    passwordHash: btoa('imamakbar199817'), // Base64 encoding for simple obfuscation in demo environment
    name: 'Ilyas (Creator)'
  };

  // Status Constants
  const STATUS = {
    AKTIF: 'AKTIF',
    SUSPEND: 'SUSPEND',
    NONAKTIF: 'NONAKTIF'
  };

  // Seed default data if database is empty
  function initSeedData() {
    if (!localStorage.getItem(STORAGE_KEYS.WARUNGS)) {
      const initialWarungs = [
        {
          id: 'BERKAH001',
          ownerName: 'Ahmad Supardi',
          warungName: 'Warung Berkah',
          phone: '081234567890',
          address: 'Jl. Merdeka No. 45, Jakarta',
          password: 'Bk#2026@001',
          status: STATUS.AKTIF,
          createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
          lastLogin: new Date(Date.now() - 2 * 3600000).toISOString()
        },
        {
          id: 'MAKMUR002',
          ownerName: 'Siti Rahma',
          warungName: 'Toko Makmur Jaya',
          phone: '085712345678',
          address: 'Jl. Mawar No. 12, Bandung',
          password: 'Mk#9981@002',
          status: STATUS.AKTIF,
          createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
          lastLogin: new Date(Date.now() - 1 * 86400000).toISOString()
        },
        {
          id: 'SEDAP003',
          ownerName: 'Budi Santoso',
          warungName: 'Kedai Sedap Malam',
          phone: '081987654321',
          address: 'Jl. Sudirman No. 88, Surabaya',
          password: 'Sd#1029@003',
          status: STATUS.SUSPEND,
          createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
          lastLogin: new Date(Date.now() - 4 * 86400000).toISOString()
        }
      ];
      localStorage.setItem(STORAGE_KEYS.WARUNGS, JSON.stringify(initialWarungs));
    }
  }

  initSeedData();

  // Helper to read database
  function getWarungsList() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WARUNGS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to parse warungs database', e);
      return [];
    }
  }

  // Helper to save database
  function saveWarungsList(list) {
    localStorage.setItem(STORAGE_KEYS.WARUNGS, JSON.stringify(list));
  }

  return {
    STATUS,

    // --- CREATOR AUTHENTICATION ---
    loginCreator(username, password) {
      if (!username || !password) {
        return { success: false, message: 'ID Creator dan Password harus diisi!' };
      }

      const inputUser = username.trim().toLowerCase();
      const inputHash = btoa(password);

      if (inputUser === MASTER_CREATOR.username.toLowerCase() && inputHash === MASTER_CREATOR.passwordHash) {
        const session = {
          username: MASTER_CREATOR.username,
          name: MASTER_CREATOR.name,
          loginTime: new Date().toISOString()
        };
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
      } catch (e) {
        return null;
      }
    },

    logoutCreator() {
      localStorage.removeItem(STORAGE_KEYS.CREATOR_SESSION);
    },

    // --- WARUNG ACCOUNT MANAGEMENT (FOR CREATOR) ---
    getWarungs() {
      return getWarungsList();
    },

    getWarungById(warungId) {
      const list = getWarungsList();
      return list.find(w => w.id.toUpperCase() === warungId.toUpperCase()) || null;
    },

    createWarung(data) {
      const list = getWarungsList();
      
      const cleanId = data.id ? data.id.trim().toUpperCase() : this.generateWarungId(data.warungName);

      // Check duplicate ID
      if (list.some(w => w.id === cleanId)) {
        return { success: false, message: `ID Warung ${cleanId} sudah digunakan!` };
      }

      const newWarung = {
        id: cleanId,
        ownerName: data.ownerName ? data.ownerName.trim() : '-',
        warungName: data.warungName ? data.warungName.trim() : 'Warung KaiSer',
        phone: data.phone ? data.phone.trim() : '-',
        address: data.address ? data.address.trim() : '-',
        password: data.password ? data.password.trim() : this.generateSecurePassword(),
        status: data.status || STATUS.AKTIF,
        createdAt: new Date().toISOString(),
        lastLogin: null
      };

      list.unshift(newWarung);
      saveWarungsList(list);

      return { success: true, warung: newWarung, message: `Akun Warung ${newWarung.warungName} (${newWarung.id}) berhasil dibuat!` };
    },

    updateWarungStatus(warungId, newStatus) {
      const list = getWarungsList();
      const index = list.findIndex(w => w.id.toUpperCase() === warungId.toUpperCase());
      
      if (index === -1) {
        return { success: false, message: 'Akun Warung tidak ditemukan!' };
      }

      list[index].status = newStatus;
      saveWarungsList(list);
      return { success: true, warung: list[index], message: `Status ${list[index].warungName} diubah menjadi ${newStatus}.` };
    },

    resetWarungPassword(warungId, newPassword) {
      const list = getWarungsList();
      const index = list.findIndex(w => w.id.toUpperCase() === warungId.toUpperCase());

      if (index === -1) {
        return { success: false, message: 'Akun Warung tidak ditemukan!' };
      }

      const passwordToSet = newPassword ? newPassword.trim() : this.generateSecurePassword();
      list[index].password = passwordToSet;
      saveWarungsList(list);

      return { success: true, password: passwordToSet, warung: list[index], message: `Password ${list[index].warungName} berhasil diperbarui.` };
    },

    deleteWarung(warungId) {
      let list = getWarungsList();
      const target = list.find(w => w.id.toUpperCase() === warungId.toUpperCase());
      
      if (!target) {
        return { success: false, message: 'Akun Warung tidak ditemukan!' };
      }

      list = list.filter(w => w.id.toUpperCase() !== warungId.toUpperCase());
      saveWarungsList(list);

      // Clean warung local store if present
      localStorage.removeItem(`kaiser_products_${warungId}`);
      localStorage.removeItem(`kaiser_txs_${warungId}`);

      return { success: true, message: `Akun ${target.warungName} (${warungId}) telah dihapus.` };
    },

    // --- GENERATOR UTILITIES ---
    generateWarungId(warungName) {
      let prefix = 'WARUNG';
      if (warungName && warungName.trim().length > 0) {
        // Extract main name without "Warung" or "Toko"
        const cleanName = warungName.replace(/^(warung|toko|kedai|kios|depot)\s+/i, '').trim();
        const lettersOnly = cleanName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        if (lettersOnly.length >= 3) {
          prefix = lettersOnly.substring(0, 6);
        }
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
      
      // Random length 8-10
      for (let i = 0; i < 2; i++) {
        pass += chars.charAt(Math.floor(Math.random() * 24)); // Uppercase
      }
      pass += symbols.charAt(Math.floor(Math.random() * symbols.length));
      for (let i = 0; i < 3; i++) {
        pass += chars.charAt(24 + Math.floor(Math.random() * 24)); // Lowercase
      }
      for (let i = 0; i < 2; i++) {
        pass += chars.charAt(48 + Math.floor(Math.random() * 8)); // Numbers
      }
      return pass;
    },

    formatWhatsAppPayload(warung) {
      return `🌊 *KAI SER — KASIR SIMPEL, BISNIS LANCAR*
━━━━━━━━━━━━━━━━━━━━━━━━━━
Yth. *${warung.ownerName || 'Pemilik Warung'}*
${warung.warungName}

Berikut adalah detail Akun KaiSer Warung Anda:

🔑 *ID WARUNG:* 
\`${warung.id}\`

🔒 *PASSWORD:* 
\`${warung.password}\`

🌐 *Link Akses Aplikasi:*
https://ilyas0905.github.io/kaiser/warung.html

━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 *Petunjuk Penggunaan:*
1. Buka link di atas di Google Chrome / Browser HP / Laptop Anda.
2. Masukkan ID Warung dan Password di atas.
3. Aplikasi siap digunakan secara offline & otomatis menyimpan data usaha Anda.

_Terima kasih telah menggunakan KaiSer!_ 🚀`;
    }
  };
})();
