/**
 * ═══════════════════════════════════════════════════════════════
 *  TAMBAHKAN KODE INI KE GOOGLE APPS SCRIPT
 *  (di file Code.gs yang sama dengan action handler lainnya)
 * ═══════════════════════════════════════════════════════════════
 * 
 *  Sheet yang diperlukan: "DataOwner"
 *  Kolom: A=OPS | B=Nama | C=NIK | D=STATION | E=NOMOR WHATSAPP | F=STATUS
 *  
 *  Contoh data:
 *  | OPS   | Nama   | NIK  | STATION          | NOMOR WHATSAPP | STATUS |
 *  |-------|--------|------|------------------|----------------|--------|
 *  | 10001 | ALIM   | 2026 | ALL              | 089677500934   | OWNER  |
 *  | 10002 | DHIMAS | 2026 | TANJUNG REDEB DC | -              | KORLAP |
 */

// ─── Tambahkan case ini di dalam fungsi doPost() ───
// Di dalam switch(action) atau if-else chain:

/*
  case 'loginOwner':
    return loginOwner(data);
*/

function loginOwner(data) {
  var opsId = String(data.opsId || '').trim();
  var nik = String(data.nik || '').trim();
  
  if (!opsId || !nik) {
    return ContentService.createTextOutput(JSON.stringify({ isOwner: false, error: 'Missing credentials' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('DataOwner');
  
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ isOwner: false, error: 'DataOwner sheet not found' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  var rows = sheet.getDataRange().getValues();
  // Skip header row (index 0)
  for (var i = 1; i < rows.length; i++) {
    var rowOps = String(rows[i][0]).trim();   // Column A: OPS
    var rowNama = String(rows[i][1]).trim();   // Column B: Nama
    var rowNik = String(rows[i][2]).trim();    // Column C: NIK
    var rowStation = String(rows[i][3]).trim();// Column D: STATION
    var rowWa = String(rows[i][4]).trim();     // Column E: NOMOR WHATSAPP
    var rowStatus = String(rows[i][5]).trim().toUpperCase(); // Column F: STATUS
    
    // Match OPS + NIK
    if (rowOps === opsId && rowNik === nik) {
      // Valid owner or korlap
      if (rowStatus === 'OWNER' || rowStatus === 'KORLAP') {
        return ContentService.createTextOutput(JSON.stringify({
          isOwner: true,
          ops: rowOps,
          nama: rowNama,
          station: rowStation,
          status: rowStatus,
          wa: rowWa
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
  }
  
  // Not found in DataOwner sheet
  return ContentService.createTextOutput(JSON.stringify({ isOwner: false }))
    .setMimeType(ContentService.MimeType.JSON);
}
