/**
 * ═══════════════════════════════════════════════════════════════
 *  PT. BAROKAH AMANAH SENTOSA — COMPLETE GOOGLE APPS SCRIPT
 *  Deep Learning Enhanced HR System v2.0
 * ═══════════════════════════════════════════════════════════════
 *
 *  FITUR UTAMA:
 *  ✓ HEADER-BASED DYNAMIC MAPPING — membaca kolom dari header row 1
 *  ✓ TIDAK mengubah struktur sheet yang sudah ada
 *  ✓ Field names otomatis dari camelCase conversion header
 *  ✓ Kompatibel dengan semua struktur kolom yang sudah ada
 *
 *  PETUNJUK DEPLOY:
 *  1. Buka Google Sheets → Extensions → Apps Script
 *  2. Hapus semua kode lama di Code.gs
 *  3. Copy-paste SELURUH kode ini ke Code.gs
 *  4. Save (Ctrl+S)
 *  5. Deploy → New deployment → Web app
 *     - Execute as: Me
 *     - Who has access: Anyone
 *  6. Copy URL deployment, paste ke index.html dan owner.html
 *
 *  SHEETS YANG DIGUNAKAN (struktur TIDAK diubah):
 *  • Employees    — Data karyawan (kolom sesuai existing)
 *  • Attendance   — Data presensi (kolom sesuai existing)
 *  • Payslips     — Data slip gaji (kolom sesuai existing)
 *  • DataOwner    — Login Owner/Korlap
 *  • SystemMessage— Broadcast message
 */

// ═══════════════════════════════════════════════════════════════
//  CORS & ENTRY POINTS
// ═══════════════════════════════════════════════════════════════

function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ status: 'ONLINE', version: '2.0-DL', timestamp: new Date().toISOString() })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;

    switch (action) {
      case 'login':              return jsonResponse(handleLogin(data));
      case 'loginOwner':         return jsonResponse(handleLoginOwner(data));
      case 'getAllEmployees':     return jsonResponse(handleGetAllEmployees());
      case 'getAttendance':      return jsonResponse(handleGetAttendance(data));
      case 'getPayslips':        return jsonResponse(handleGetPayslips(data));
      case 'getSystemMessage':   return jsonResponse(handleGetSystemMessage());
      case 'addEmployee':        return jsonResponse(handleAddEmployee(data));
      case 'updateEmployee':     return jsonResponse(handleUpdateEmployee(data));
      case 'deleteEmployee':     return jsonResponse(handleDeleteEmployee(data));
      case 'addAttendance':      return jsonResponse(handleAddAttendance(data));
      case 'addPayslip':         return jsonResponse(handleAddPayslip(data));
      case 'updatePayslipStatus':return jsonResponse(handleUpdatePayslipStatus(data));
      case 'setup':              return jsonResponse(handleSetup());
      default:                   return jsonResponse({ error: 'Unknown action: ' + action });
    }
  } catch (err) {
    return jsonResponse({ error: err.toString() });
  }
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ═══════════════════════════════════════════════════════════════
//  HELPERS: Sheet Access & Dynamic Header Mapping
// ═══════════════════════════════════════════════════════════════

function getSheet(name) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
}

/**
 * Convert sheet header to camelCase field name.
 * Examples:
 *   "OPS ID"              → "opsId"
 *   "Total Dibayarkan"    → "totalDibayarkan"
 *   "HK"                  → "hk"
 *   "Hub DC"              → "hubDc"
 *   "Kota/Kab"            → "kotaKab"
 *   "Rate Perhari"        → "ratePerhari"
 *   "Incentive Performance Cache" → "incentivePerformanceCache"
 *   "DW Event"            → "dwEvent"
 *   "Note Mutia Neng"     → "noteMutiaNeng"
 */
function toCamelCase(header) {
  var words = String(header).replace(/[^a-zA-Z0-9]+/g, ' ').trim().split(/\s+/);
  if (words.length === 0) return '';
  var result = words[0].toLowerCase();
  for (var i = 1; i < words.length; i++) {
    result += words[i].charAt(0).toUpperCase() + words[i].substring(1).toLowerCase();
  }
  return result;
}

/**
 * Read entire sheet → array of objects using header row (baris 1).
 * Automatically converts headers to camelCase field names.
 * Date values are formatted as 'yyyy-MM-dd'.
 */
function readSheet(sheetName) {
  var sheet = getSheet(sheetName);
  if (!sheet) return { headers: [], fields: [], objects: [] };

  var data = sheet.getDataRange().getValues();
  if (data.length < 1) return { headers: [], fields: [], objects: [] };

  var headers = data[0].map(function(h) { return String(h).trim(); });
  var fields = headers.map(toCamelCase);
  var tz = Session.getScriptTimeZone();
  var objects = [];

  for (var i = 1; i < data.length; i++) {
    var obj = {};
    var hasData = false;
    for (var j = 0; j < headers.length; j++) {
      var val = data[i][j];
      if (val instanceof Date) {
        val = Utilities.formatDate(val, tz, 'yyyy-MM-dd');
      }
      obj[fields[j]] = val;
      if (val !== '' && val !== null && val !== undefined) hasData = true;
    }
    if (hasData) objects.push(obj);
  }

  return { headers: headers, fields: fields, objects: objects };
}

/**
 * Find column index for OPS ID (case-insensitive).
 * Matches: "OPS ID", "OPS", "OPSID", "Ops"
 */
function findOpsColumn(headers) {
  for (var i = 0; i < headers.length; i++) {
    var h = String(headers[i]).trim().toUpperCase().replace(/\s+/g, '');
    if (h === 'OPSID' || h === 'OPS') return i;
  }
  return -1;
}

/**
 * Find column index by exact header name (case-insensitive).
 */
function findColumn(headers, name) {
  var target = String(name).trim().toUpperCase();
  for (var i = 0; i < headers.length; i++) {
    if (String(headers[i]).trim().toUpperCase() === target) return i;
  }
  return -1;
}

/**
 * Build a row array from data object, mapped to sheet headers.
 */
function buildRow(headers, data) {
  return headers.map(function(h) {
    var key = toCamelCase(String(h).trim());
    // Handle alternative field names for shift/shifting
    if (key === 'shifting' && data[key] === undefined && data.shift !== undefined) return data.shift;
    if (key === 'shift' && data[key] === undefined && data.shifting !== undefined) return data.shifting;
    return data[key] !== undefined ? data[key] : '';
  });
}

// ═══════════════════════════════════════════════════════════════
//  ACTION: setup — Hanya membuat sheet yang BELUM ADA
//  ⚠ TIDAK mengubah sheet yang sudah ada!
// ═══════════════════════════════════════════════════════════════

function handleSetup() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var created = [];

    var sheetsConfig = [
      { name: 'Employees',     headers: ['OPS ID', 'NIK', 'Name', 'Position', 'Phone', 'Address', 'Status'] },
      { name: 'Attendance',    headers: ['OPS ID', 'Date', 'Station', 'Shifting', 'Status'] },
      { name: 'Payslips',      headers: ['ID', 'Period', 'No', 'Help', 'Nama', 'Ops', 'Divisi', 'Hub Dc', 'Area',
        'Kota Kab', 'HK', 'HK Rapel', 'Rate Perhari', 'Gaji', 'Rapel', 'Attendance Incentive',
        'Campaign Incentive', 'Incentive Performance Cache', 'Claim', 'Pot Pribadi', 'Asuransi',
        'Total Dibayarkan', 'Done Proses', 'Nomor Rekening', 'Atas Nama', 'Nama Bank', 'Status',
        'Tanggal Proses', 'Note', 'Bouncing', 'Nominal Invalid', 'Nominal Bouncing',
        'Note Mutia Neng', 'DW Event', 'UMK', 'Area2', 'Jadwal Proses', 'Cash'] },
      { name: 'DataOwner',     headers: ['OPS', 'Nama', 'NIK', 'STATION', 'NOMOR WHATSAPP', 'STATUS'] },
      { name: 'SystemMessage', headers: ['ID', 'Active', 'Type', 'Title', 'Content', 'Date'] }
    ];

    sheetsConfig.forEach(function(cfg) {
      var sheet = ss.getSheetByName(cfg.name);
      if (!sheet) {
        sheet = ss.insertSheet(cfg.name);
        sheet.getRange(1, 1, 1, cfg.headers.length).setValues([cfg.headers]);
        sheet.getRange(1, 1, 1, cfg.headers.length).setFontWeight('bold');
        sheet.setFrozenRows(1);
        created.push(cfg.name);
      }
      // Sheet sudah ada → TIDAK diubah
    });

    if (created.length === 0) {
      return { status: 'Success', message: 'Semua sheet sudah ada. Tidak ada perubahan.' };
    }
    return { status: 'Success', message: 'Sheet baru dibuat: ' + created.join(', ') + '. Sheet lama tidak diubah.' };
  } catch (err) {
    return { error: err.toString() };
  }
}

// ═══════════════════════════════════════════════════════════════
//  ACTION: login — Employee login (main app)
//  Dynamic mapping dari Employees sheet
// ═══════════════════════════════════════════════════════════════

function handleLogin(data) {
  var opsId = String(data.opsId || '').trim().toUpperCase().replace('OPS', '');
  var nik = String(data.nik || '').trim();

  if (!opsId || !nik) return { error: 'ID dan NIK wajib diisi' };

  var sheet = getSheet('Employees');
  if (!sheet) return { error: 'Sheet Employees tidak ditemukan' };

  var allData = sheet.getDataRange().getValues();
  if (allData.length < 2) return { error: 'Data karyawan kosong' };

  var headers = allData[0].map(function(h) { return String(h).trim(); });
  var opsCol = findOpsColumn(headers);
  var nikCol = findColumn(headers, 'NIK');

  if (opsCol === -1) return { error: 'Kolom OPS ID tidak ditemukan di sheet Employees' };
  if (nikCol === -1) return { error: 'Kolom NIK tidak ditemukan di sheet Employees' };

  var fields = headers.map(toCamelCase);
  var tz = Session.getScriptTimeZone();

  for (var i = 1; i < allData.length; i++) {
    var rowOps = String(allData[i][opsCol]).trim().replace('OPS', '');
    var rowNik = String(allData[i][nikCol]).trim();

    if (rowOps === opsId && rowNik === nik) {
      var result = {};
      for (var j = 0; j < headers.length; j++) {
        var val = allData[i][j];
        if (val instanceof Date) val = Utilities.formatDate(val, tz, 'yyyy-MM-dd');
        result[fields[j]] = typeof val === 'string' ? val.trim() : val;
      }
      return result;
    }
  }

  return { error: 'OPS ID atau NIK tidak terdaftar atau salah.' };
}

// ═══════════════════════════════════════════════════════════════
//  ACTION: loginOwner — Owner/Korlap login (owner dashboard)
//  DataOwner sheet with dynamic header mapping
//  Expected headers: OPS, Nama, NIK, STATION, NOMOR WHATSAPP, STATUS
// ═══════════════════════════════════════════════════════════════

function handleLoginOwner(data) {
  var opsId = String(data.opsId || '').trim();
  var nik = String(data.nik || '').trim();

  if (!opsId || !nik) return { isOwner: false, error: 'Missing credentials' };

  var sheet = getSheet('DataOwner');
  if (!sheet) return { isOwner: false, error: 'DataOwner sheet not found' };

  var allData = sheet.getDataRange().getValues();
  if (allData.length < 2) return { isOwner: false, error: 'DataOwner sheet is empty' };

  // Dynamic header mapping
  var headers = allData[0].map(function(h) { return String(h).trim(); });
  var opsCol = findColumn(headers, 'OPS');
  var namaCol = findColumn(headers, 'Nama');
  var nikCol = findColumn(headers, 'NIK');
  var stationCol = findColumn(headers, 'STATION');
  var waCol = findColumn(headers, 'NOMOR WHATSAPP');
  var statusCol = findColumn(headers, 'STATUS');

  if (opsCol === -1 || nikCol === -1 || statusCol === -1) {
    return { isOwner: false, error: 'DataOwner sheet missing required columns (OPS, NIK, or STATUS)' };
  }

  // Search for matching owner/korlap
  for (var i = 1; i < allData.length; i++) {
    var rowOps = String(allData[i][opsCol] || '').trim();
    var rowNik = String(allData[i][nikCol] || '').trim();
    var rowStatus = String(allData[i][statusCol] || '').trim().toUpperCase();

    // Skip empty rows
    if (!rowOps && !rowNik) continue;

    if (rowOps === opsId && rowNik === nik) {
      if (rowStatus === 'OWNER' || rowStatus === 'KORLAP') {
        return {
          isOwner: true,
          ops: rowOps,
          nama: namaCol !== -1 ? String(allData[i][namaCol] || '').trim() : '',
          station: stationCol !== -1 ? String(allData[i][stationCol] || '').trim() : '',
          status: rowStatus,
          wa: waCol !== -1 ? String(allData[i][waCol] || '').trim() : ''
        };
      } else {
        return { isOwner: false, error: 'User found but status is not OWNER or KORLAP' };
      }
    }
  }

  return { isOwner: false };
}

// ═══════════════════════════════════════════════════════════════
//  ACTION: getAllEmployees — Dynamic header mapping
//  Membaca SEMUA kolom sesuai header yang ada di sheet
// ═══════════════════════════════════════════════════════════════

function handleGetAllEmployees() {
  var result = readSheet('Employees');
  return result.objects;
}

// ═══════════════════════════════════════════════════════════════
//  ACTION: getAttendance — Dynamic header + filter OPS ID
// ═══════════════════════════════════════════════════════════════

function handleGetAttendance(data) {
  var opsId = String(data.opsId || '').trim();
  if (!opsId) return [];

  var sheet = getSheet('Attendance');
  if (!sheet) return [];

  var allData = sheet.getDataRange().getValues();
  if (allData.length < 2) return [];

  var headers = allData[0].map(function(h) { return String(h).trim(); });
  var opsCol = findOpsColumn(headers);
  if (opsCol === -1) return [];

  var fields = headers.map(toCamelCase);
  var tz = Session.getScriptTimeZone();
  var result = [];

  for (var i = 1; i < allData.length; i++) {
    var rowOps = String(allData[i][opsCol]).trim();
    if (rowOps !== opsId) continue;

    var obj = {};
    var hasData = false;
    for (var j = 0; j < headers.length; j++) {
      var val = allData[i][j];
      if (val instanceof Date) val = Utilities.formatDate(val, tz, 'yyyy-MM-dd');
      obj[fields[j]] = val;
      if (val !== '' && val !== null && val !== undefined) hasData = true;
    }
    if (hasData) result.push(obj);
  }

  return result;
}

// ═══════════════════════════════════════════════════════════════
//  ACTION: getPayslips — Dynamic header + filter OPS ID
//  Membaca SEMUA kolom dari Payslips sheet (bisa 35+ kolom)
// ═══════════════════════════════════════════════════════════════

function handleGetPayslips(data) {
  var opsId = String(data.opsId || '').trim();
  if (!opsId) return [];

  var sheet = getSheet('Payslips');
  if (!sheet) return [];

  var allData = sheet.getDataRange().getValues();
  if (allData.length < 2) return [];

  var headers = allData[0].map(function(h) { return String(h).trim(); });
  var opsCol = findOpsColumn(headers);
  if (opsCol === -1) return [];

  var fields = headers.map(toCamelCase);
  var tz = Session.getScriptTimeZone();
  var result = [];

  // Clean incoming opsId for flexible matching
  var cleanReq = opsId.replace(/^OPS/i, '').trim();

  for (var i = 1; i < allData.length; i++) {
    var rowOps = String(allData[i][opsCol]).trim();
    var cleanRow = rowOps.replace(/^OPS/i, '').trim();

    // Match exact or without OPS prefix
    if (rowOps !== opsId && cleanRow !== cleanReq && cleanRow !== opsId && rowOps !== cleanReq) continue;

    var obj = {};
    var hasData = false;
    for (var j = 0; j < headers.length; j++) {
      var val = allData[i][j];
      if (val instanceof Date) val = Utilities.formatDate(val, tz, 'yyyy-MM-dd');
      obj[fields[j]] = val;
      if (val !== '' && val !== null && val !== undefined) hasData = true;
    }
    if (hasData) result.push(obj);
  }

  return result;
}

// ═══════════════════════════════════════════════════════════════
//  ACTION: getSystemMessage — PascalCase keys (sesuai frontend)
//  Frontend expects: {ID, Active, Type, Title, Content, Date}
// ═══════════════════════════════════════════════════════════════

function handleGetSystemMessage() {
  var sheet = getSheet('SystemMessage');
  if (!sheet) return null;

  var rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return null;

  var headers = rows[0].map(function(h) { return String(h).trim(); });
  var activeCol = findColumn(headers, 'Active');
  if (activeCol === -1) activeCol = 1; // fallback to column B
  var tz = Session.getScriptTimeZone();

  for (var i = 1; i < rows.length; i++) {
    var active = String(rows[i][activeCol]).trim().toUpperCase();
    if (active === 'TRUE' || active === 'YES' || active === '1') {
      var obj = {};
      for (var j = 0; j < headers.length; j++) {
        var val = rows[i][j];
        if (val instanceof Date) val = Utilities.formatDate(val, tz, 'yyyy-MM-dd');
        // Use RAW header names (PascalCase) — frontend expects {ID, Active, Type, Title, Content, Date}
        obj[headers[j]] = typeof val === 'string' ? val.trim() : val;
      }
      return obj;
    }
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════
//  ACTION: addEmployee — Dynamic column detection dari header
// ═══════════════════════════════════════════════════════════════

function handleAddEmployee(data) {
  var sheet = getSheet('Employees');
  if (!sheet) return { error: 'Sheet Employees tidak ditemukan. Jalankan setup terlebih dahulu.' };

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  headers = headers.map(function(h) { return String(h).trim(); });
  var opsCol = findOpsColumn(headers);

  var opsId = String(data.opsId || '').trim();
  var nik   = String(data.nik || '').trim();
  var name  = String(data.name || '').trim();

  if (!opsId || !nik || !name) return { error: 'OPS ID, NIK, dan Nama wajib diisi' };

  // Check duplicate OPS ID
  if (opsCol !== -1) {
    var allData = sheet.getDataRange().getValues();
    for (var i = 1; i < allData.length; i++) {
      if (String(allData[i][opsCol]).trim() === opsId) {
        return { error: 'OPS ID sudah terdaftar: ' + opsId };
      }
    }
  }

  var row = buildRow(headers, data);
  sheet.appendRow(row);
  return { success: true, opsId: opsId, message: 'Karyawan berhasil ditambahkan.' };
}

// ═══════════════════════════════════════════════════════════════
//  ACTION: updateEmployee — Dynamic column detection
// ═══════════════════════════════════════════════════════════════

function handleUpdateEmployee(data) {
  var opsId = String(data.opsId || '').trim();
  if (!opsId) return { error: 'OPS ID wajib diisi' };

  var sheet = getSheet('Employees');
  if (!sheet) return { error: 'Sheet Employees tidak ditemukan' };

  var allData = sheet.getDataRange().getValues();
  var headers = allData[0].map(function(h) { return String(h).trim(); });
  var opsCol = findOpsColumn(headers);
  if (opsCol === -1) return { error: 'Kolom OPS ID tidak ditemukan' };

  var fields = headers.map(toCamelCase);

  for (var i = 1; i < allData.length; i++) {
    if (String(allData[i][opsCol]).trim() === opsId) {
      var rowNum = i + 1;
      for (var j = 0; j < fields.length; j++) {
        if (j === opsCol) continue; // Don't update OPS ID itself
        if (data[fields[j]] !== undefined) {
          sheet.getRange(rowNum, j + 1).setValue(data[fields[j]]);
        }
      }
      return { success: true, message: 'Data karyawan berhasil diupdate.' };
    }
  }

  return { error: 'Karyawan dengan OPS ID ' + opsId + ' tidak ditemukan.' };
}

// ═══════════════════════════════════════════════════════════════
//  ACTION: deleteEmployee
// ═══════════════════════════════════════════════════════════════

function handleDeleteEmployee(data) {
  var opsId = String(data.opsId || '').trim();
  if (!opsId) return { error: 'OPS ID wajib diisi' };

  var sheet = getSheet('Employees');
  if (!sheet) return { error: 'Sheet Employees tidak ditemukan' };

  var allData = sheet.getDataRange().getValues();
  var headers = allData[0].map(function(h) { return String(h).trim(); });
  var opsCol = findOpsColumn(headers);
  if (opsCol === -1) return { error: 'Kolom OPS ID tidak ditemukan' };

  for (var i = 1; i < allData.length; i++) {
    if (String(allData[i][opsCol]).trim() === opsId) {
      sheet.deleteRow(i + 1);
      return { success: true, message: 'Karyawan berhasil dihapus.' };
    }
  }

  return { error: 'Karyawan dengan OPS ID ' + opsId + ' tidak ditemukan.' };
}

// ═══════════════════════════════════════════════════════════════
//  ACTION: addAttendance — Dynamic column detection
// ═══════════════════════════════════════════════════════════════

function handleAddAttendance(data) {
  var sheet = getSheet('Attendance');
  if (!sheet) return { error: 'Sheet Attendance tidak ditemukan. Jalankan setup terlebih dahulu.' };

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  headers = headers.map(function(h) { return String(h).trim(); });

  var row = buildRow(headers, data);
  sheet.appendRow(row);
  return { success: true, message: 'Presensi berhasil ditambahkan.' };
}

// ═══════════════════════════════════════════════════════════════
//  ACTION: addPayslip — Dynamic column detection
// ═══════════════════════════════════════════════════════════════

function handleAddPayslip(data) {
  var sheet = getSheet('Payslips');
  if (!sheet) return { error: 'Sheet Payslips tidak ditemukan. Jalankan setup terlebih dahulu.' };

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  headers = headers.map(function(h) { return String(h).trim(); });

  // Auto-calculate totalDibayarkan if not provided
  if (data.totalDibayarkan === undefined && data.gaji !== undefined) {
    var gaji    = Number(data.gaji) || 0;
    var rapel   = Number(data.rapel) || 0;
    var attInc  = Number(data.attendanceIncentive) || 0;
    var campInc = Number(data.campaignIncentive) || 0;
    var perfInc = Number(data.incentivePerformanceCache) || 0;
    var claim   = Number(data.claim) || 0;
    var pot     = Number(data.potPribadi) || 0;
    var asuransi= Number(data.asuransi) || 0;
    data.totalDibayarkan = gaji + rapel + attInc + campInc + perfInc + claim - pot - asuransi;
  }

  var row = buildRow(headers, data);
  sheet.appendRow(row);
  return { success: true, message: 'Payslip berhasil ditambahkan.' };
}

// ═══════════════════════════════════════════════════════════════
//  ACTION: updatePayslipStatus — Dynamic column detection
// ═══════════════════════════════════════════════════════════════

function handleUpdatePayslipStatus(data) {
  var opsId    = String(data.opsId || '').trim();
  var period   = String(data.period || '').trim();
  var newStatus= String(data.status || '').trim();

  if (!opsId || !period || !newStatus) {
    return { error: 'OPS ID, Period, dan Status wajib diisi' };
  }

  var sheet = getSheet('Payslips');
  if (!sheet) return { error: 'Sheet Payslips tidak ditemukan' };

  var allData = sheet.getDataRange().getValues();
  var headers = allData[0].map(function(h) { return String(h).trim(); });
  var opsCol    = findOpsColumn(headers);
  var periodCol = findColumn(headers, 'Period');
  var statusCol = findColumn(headers, 'Status');

  if (opsCol === -1) return { error: 'Kolom OPS tidak ditemukan di sheet Payslips' };
  if (statusCol === -1) return { error: 'Kolom Status tidak ditemukan di sheet Payslips' };

  var cleanReq = opsId.replace(/^OPS/i, '').trim();
  var updated = 0;

  for (var i = 1; i < allData.length; i++) {
    var rowOps = String(allData[i][opsCol]).trim();
    var cleanRow = rowOps.replace(/^OPS/i, '').trim();
    var matchOps = (rowOps === opsId || cleanRow === cleanReq);

    var matchPeriod = true;
    if (periodCol !== -1) {
      matchPeriod = String(allData[i][periodCol]).trim() === period;
    }

    if (matchOps && matchPeriod) {
      sheet.getRange(i + 1, statusCol + 1).setValue(newStatus);
      updated++;
    }
  }

  if (updated > 0) {
    return { success: true, message: updated + ' payslip status diupdate.' };
  }
  return { error: 'Payslip tidak ditemukan untuk OPS ID ' + opsId + ' periode ' + period };
}
