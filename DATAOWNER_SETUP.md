# DataOwner Sheet Setup Guide

## Penjelasan Masalah (Problem Explanation)

Jika Anda mengalami masalah "data owner tidak terhubung" atau sheet DataOwner kosong, ikuti panduan di bawah ini untuk memperbaikinya.

## Struktur DataOwner Sheet

Sheet `DataOwner` harus memiliki struktur kolom sebagai berikut:

| OPS | Nama | NIK | STATION | NOMOR WHATSAPP | STATUS |
|-----|------|-----|---------|----------------|--------|
| 10001 | ALIM | 2026 | ALL | 089677500934 | OWNER |
| 10002 | DHIMAS | 2026 | TANJUNG REDEB DC | - | KORLAP |

### Penjelasan Kolom (Column Descriptions)

1. **OPS** - ID Operasional (contoh: 10001, 10002)
2. **Nama** - Nama lengkap Owner/Korlap
3. **NIK** - Nomor Induk Karyawan (digunakan untuk login)
4. **STATION** - Stasiun kerja (gunakan "ALL" untuk Owner yang bisa akses semua stasiun)
5. **NOMOR WHATSAPP** - Nomor WhatsApp (format: 08xx atau 628xx)
6. **STATUS** - Harus diisi dengan **OWNER** atau **KORLAP** (huruf besar/capital)

## Langkah-langkah Setup (Setup Steps)

### 1. Buka Google Sheets

Buka file Google Sheets yang sudah terhubung dengan Apps Script Anda.

### 2. Periksa Sheet DataOwner

- Cari sheet bernama **"DataOwner"** di bagian bawah spreadsheet
- Jika tidak ada, sheet ini akan dibuat otomatis saat menjalankan fungsi `setup`

### 3. Jalankan Setup (Jika Diperlukan)

Jika sheet DataOwner belum ada:

1. Buka **Extensions → Apps Script**
2. Di menu pilih fungsi **handleSetup**
3. Klik tombol **Run** (▶)
4. Izinkan permisi yang diminta
5. Sheet DataOwner akan dibuat otomatis dengan header yang benar

### 4. Isi Data Owner/Korlap

Tambahkan data Owner/Korlap ke sheet DataOwner:

**Contoh data yang benar:**

```
OPS     | Nama         | NIK  | STATION           | NOMOR WHATSAPP | STATUS
--------|--------------|------|-------------------|----------------|--------
10001   | ALIM         | 2026 | ALL               | 089677500934   | OWNER
10002   | DHIMAS       | 2026 | TANJUNG REDEB DC  | -              | KORLAP
10003   | SITI         | 2027 | JAKARTA DC        | 081234567890   | KORLAP
```

**⚠️ PENTING:**
- **STATUS** harus diisi dengan **OWNER** atau **KORLAP** (HURUF BESAR semua)
- Jangan gunakan "owner", "Owner", "korlap" (huruf kecil tidak akan dikenali)
- OPS dan NIK harus sesuai dengan yang digunakan untuk login
- STATION untuk Owner sebaiknya diisi "ALL" agar bisa akses semua stasiun

### 5. Verifikasi Header

Pastikan baris pertama (header) sheet DataOwner berisi:

```
OPS | Nama | NIK | STATION | NOMOR WHATSAPP | STATUS
```

Header harus **persis sama** (huruf besar/kecil dan spasi).

## Cara Login sebagai Owner/Korlap

1. Buka aplikasi di browser (index.html)
2. Masukkan **OPS ID** (contoh: 10001)
3. Masukkan **NIK** (contoh: 2026)
4. Klik **Login**
5. Sistem akan otomatis:
   - Cek apakah Anda terdaftar di DataOwner
   - Jika ya dan STATUS = OWNER/KORLAP → redirect ke owner.html
   - Jika tidak → login sebagai karyawan biasa

## Troubleshooting

### Problem: "DataOwner sheet not found"
**Solusi:**
1. Jalankan fungsi `handleSetup()` dari Apps Script
2. Atau buat sheet manual dengan nama **"DataOwner"** (huruf besar/kecil persis)

### Problem: "DataOwner sheet is empty"
**Solusi:**
1. Pastikan baris 1 berisi header
2. Tambahkan minimal 1 baris data Owner/Korlap

### Problem: Login gagal meskipun data sudah benar
**Solusi:**
1. Periksa STATUS - harus OWNER atau KORLAP (HURUF BESAR)
2. Periksa OPS dan NIK - harus exact match dengan yang diinput
3. Pastikan tidak ada spasi ekstra di awal/akhir data
4. Coba hapus baris dan input ulang

### Problem: "User found but status is not OWNER or KORLAP"
**Solusi:**
1. Ubah kolom STATUS menjadi **OWNER** atau **KORLAP** (huruf besar semua)
2. Jangan gunakan huruf kecil atau campuran

## Perubahan yang Dilakukan (Changes Made)

Script telah diupdate untuk:

✅ **Dynamic Header Mapping** - Kolom dibaca dari header, tidak hardcoded
✅ **Empty Sheet Detection** - Memberikan pesan error yang jelas jika sheet kosong
✅ **Better Error Messages** - Pesan error lebih informatif untuk debugging
✅ **Null Safety** - Menangani cell kosong dengan aman
✅ **Empty Row Handling** - Melewati baris kosong otomatis
✅ **Status Validation** - Memberikan pesan jelas jika status bukan OWNER/KORLAP

## Testing

Untuk test apakah setup sudah benar:

1. Buka Apps Script Editor
2. Pilih fungsi `handleLoginOwner`
3. Di console, test dengan:
```javascript
handleLoginOwner({ opsId: "10001", nik: "2026" })
```
4. Harusnya return `{ isOwner: true, ops: "10001", ... }`

## Kontak

Jika masih ada masalah, periksa:
1. Console log di browser (F12 → Console)
2. Apps Script log (View → Logs)
3. Pastikan Web App sudah di-deploy ulang setelah perubahan script
