# super-bas

Aplikasi untuk menghubungkan data dengan Google Sheets API.

## 🚀 Fitur

- Koneksi ke Google Sheets API
- Mengambil data dari spreadsheet
- Format data otomatis dengan header
- REST API endpoints
- Test koneksi API

## 📋 Prerequisites

- Node.js (v14 atau lebih tinggi)
- Google Sheets API Key
- Google Spreadsheet ID

## 🔧 Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Konfigurasi Google Sheets API

#### Mendapatkan API Key:

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih project yang ada
3. Aktifkan Google Sheets API:
   - Pergi ke "APIs & Services" > "Library"
   - Cari "Google Sheets API"
   - Klik "Enable"
4. Buat API Key:
   - Pergi ke "APIs & Services" > "Credentials"
   - Klik "Create Credentials" > "API Key"
   - Copy API key yang dibuat

#### Mendapatkan Spreadsheet ID:

1. Buka Google Sheets yang ingin digunakan
2. Copy ID dari URL spreadsheet:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
   ```
3. SPREADSHEET_ID adalah ID yang perlu dicopy

### 3. Konfigurasi Environment Variables

Copy file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Edit file `.env` dan isi dengan konfigurasi Anda:

```env
GOOGLE_SHEETS_API_KEY=your_api_key_here
SPREADSHEET_ID=your_spreadsheet_id_here
SHEET_NAME=Sheet1
PORT=3000
```

**Penting**: Pastikan spreadsheet Anda di-set ke "Anyone with the link can view" agar API key bisa mengakses.

### 4. Jalankan Aplikasi

```bash
npm start
```

Server akan berjalan di `http://localhost:3000`

## 📡 API Endpoints

### Health Check
```
GET /
```
Menampilkan status aplikasi dan daftar endpoints.

### Test Connection
```
GET /api/test
```
Test koneksi ke Google Sheets API.

**Response:**
```json
{
  "success": true,
  "message": "Successfully connected to Google Sheets API"
}
```

### Get Data
```
GET /api/data
GET /api/data?range=Sheet1!A1:D10
```
Mengambil data mentah dari spreadsheet.

**Response:**
```json
{
  "success": true,
  "rowCount": 10,
  "data": [
    ["Header1", "Header2", "Header3"],
    ["Value1", "Value2", "Value3"]
  ]
}
```

### Get Formatted Data
```
GET /api/data/formatted
GET /api/data/formatted?range=Sheet1!A1:D10
```
Mengambil data yang sudah diformat dengan header sebagai key.

**Response:**
```json
{
  "success": true,
  "recordCount": 9,
  "data": [
    {
      "Header1": "Value1",
      "Header2": "Value2",
      "Header3": "Value3"
    }
  ]
}
```

## 🧪 Testing

Test koneksi dengan mengunjungi:
```
http://localhost:3000/api/test
```

## 🔒 Keamanan

- Jangan commit file `.env` ke repository
- Simpan API key dengan aman
- Gunakan service account untuk production
- Set proper permissions di Google Sheets

## 🐛 Troubleshooting

### Error: "Missing API configuration"
- Pastikan file `.env` sudah dibuat dan diisi dengan benar
- Check apakah `GOOGLE_SHEETS_API_KEY` dan `SPREADSHEET_ID` sudah diset

### Error: "The caller does not have permission"
- Pastikan spreadsheet di-set ke "Anyone with the link can view"
- Atau gunakan service account dengan akses yang sesuai

### Error: "API key not valid"
- Verify API key di Google Cloud Console
- Pastikan Google Sheets API sudah diaktifkan

## 📝 Lisensi

ISC