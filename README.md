# 🌊 KaiSer (Kasir Simpel, Bisnis Lancar)

> **Aplikasi Kasir Modern & Sistem Pengelolaan Multi-Warung Offline-First**

---

## 🏗️ Struktur Project

```text
kaiser-app/
├── creator.html        # Aplikasi KaiSer Creator (Panel Pengelola / Admin)
├── warung.html         # Aplikasi KaiSer Warung (POS Kasir Usaha / Pelanggan)
├── css/
│   ├── creator.css     # Theme & Styling khusus Creator Dashboard
│   └── warung.css      # Theme & Styling khusus Warung POS Kasir
├── js/
│   ├── kaiser-core.js  # Core Data Engine, Otentikasi & Multi-Tenant Database
│   ├── creator.js      # Controller & UI Logic untuk KaiSer Creator
│   └── warung.js       # Controller & UI Logic untuk KaiSer Warung POS
└── README.md           # Dokumentasi & Panduan Hosting GitHub Pages
```

---

## 🔑 Kredensial Akses KaiSer Creator (Master)

- **Aplikasi**: `creator.html`
- **ID Creator**: `ilyas0905`
- **Password**: `imamakbar199817`

---

## 🚀 Fitur Utama KaiSer Creator

1. **Masked Credentials & Security**: Password dan ID disamarkan (`••••••••`) pada UI dan diverifikasi dengan aman melalui engine otentikasi core.
2. **Dashboard Statistik Real-time**:
   - Total Warung Terdaftar
   - Warung Aktif (`🟢 AKTIF`)
   - Warung Ditangguhkan (`🟡 SUSPEND`)
   - Warung Nonaktif (`🔴 NONAKTIF`)
3. **Pendaftaran Akun Warung Cepat**:
   - **Auto-Generate ID Warung**: Otomatis membuat ID seperti `BERKAH001`, `MAKMUR002`.
   - **Auto-Generate Secure Password**: Otomatis membuat password kuat acak seperti `Bk#2026@001`.
4. **Manajemen Akun Warung**:
   - Quick Status Switcher (Aktif -> Suspend -> Nonaktif).
   - Reset Password Warung kapan saja.
   - Hapus Akun Warung & Pembersihan Data Terkait.
5. **Kirim Detail Akun via WhatsApp**:
   - Satu klik tombol **Salin Teks WA** untuk langsung mendapatkan format rapi siap kirim ke pemilik warung.

---

## 🌐 Panduan Upload & Launching ke GitHub Pages

Agar **KaiSer** dapat langsung digunakan di mana saja melalui HP, Tablet, atau Laptop:

### Langkah 1: Buat Repository di GitHub
1. Buka [GitHub.com](https://github.com) dan login ke akun Anda.
2. Klik tombol **New Repository** (+).
3. Beri nama repository: `kaiser` (atau nama pilihan Anda).
4. Pilih **Public**.
5. Klik **Create repository**.

### Langkah 2: Upload File ke Repository
1. Di halaman repository baru GitHub, klik **uploading an existing file**.
2. Drag & drop seluruh isi folder `kaiser-app` ini (`creator.html`, `warung.html`, folder `css`, folder `js`, dan `README.md`).
3. Klik **Commit changes**.

### Langkah 3: Aktifkan GitHub Pages (Gratis)
1. Di repository GitHub Anda, masuk ke menu **Settings** > **Pages**.
2. Pada bagian **Build and deployment** > **Branch**, pilih `main` (atau `master`) dan folder `/ (root)`.
3. Klik **Save**.
4. Tunggu 1 - 2 menit, link web Anda akan aktif di:
   - **KaiSer Creator**: `https://<username_github>.github.io/kaiser/creator.html`
   - **KaiSer Warung**: `https://<username_github>.github.io/kaiser/warung.html`

---

## 📜 Lisensi & Pengembang
Dibuat dengan 💙 oleh **Ilyas** untuk **KaiSer — Kasir Simpel, Bisnis Lancar**.
