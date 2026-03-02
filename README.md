# Super-BAS (PT. Barokah Amanah Sentosa)

Deep Learning Enhanced HR System v2.0

## Perbaikan DataOwner Connection (Fixed)

Jika Anda mengalami masalah **"data owner tidak terhubung ke sheet"** atau sheet DataOwner kosong, masalah ini telah diperbaiki!

### Apa yang Diperbaiki?

✅ **Dynamic Header Mapping** - handleLoginOwner sekarang menggunakan dynamic header mapping seperti fungsi lainnya
✅ **Empty Sheet Detection** - Memberikan error message yang jelas jika sheet kosong
✅ **Better Error Handling** - Pesan error lebih informatif untuk debugging
✅ **Null Safety** - Menangani cell kosong dengan aman
✅ **Status Validation** - Memberikan feedback jika user ditemukan tapi bukan OWNER/KORLAP

### Quick Setup

1. **Deploy Script Baru**
   - Buka Google Sheets → Extensions → Apps Script
   - Copy-paste kode dari `superbas-v6/APPS_SCRIPT_COMPLETE.gs`
   - Deploy → New deployment → Web app
   - Update URL di `index.html` dan `owner.html`

2. **Setup DataOwner Sheet**
   - Jalankan fungsi `handleSetup()` dari Apps Script
   - Atau lihat panduan lengkap di [DATAOWNER_SETUP.md](./DATAOWNER_SETUP.md)

3. **Tambah Data Owner**
   ```
   OPS   | Nama  | NIK  | STATION | NOMOR WHATSAPP | STATUS
   10001 | ALIM  | 2026 | ALL     | 089677500934   | OWNER
   ```
   ⚠️ **STATUS harus OWNER atau KORLAP (huruf besar)**

### Dokumentasi Lengkap

Lihat [DATAOWNER_SETUP.md](./DATAOWNER_SETUP.md) untuk panduan lengkap dan troubleshooting.

## Struktur Folder

- `superbas-v6/` - Versi terbaru dengan perbaikan
  - `APPS_SCRIPT_COMPLETE.gs` - Google Apps Script (UPDATED)
  - `index.html` - Login page untuk karyawan
  - `owner.html` - Dashboard untuk Owner/Korlap
- `superbas-v5/` - Versi sebelumnya
- `DATAOWNER_SETUP.md` - Panduan setup DataOwner sheet

## Fitur Utama

- ✓ Header-based dynamic mapping untuk semua sheet
- ✓ Login Owner/Korlap dengan validasi yang lebih baik
- ✓ Employee management
- ✓ Attendance tracking
- ✓ Payroll analytics
- ✓ Data Science Lab (khusus Owner)
- ✓ ID Card Generator