// --- KONFIGURASI ---
var ID_SPREADSHEET = "1N2iOckLvv7GTTdEpG3nGuO8vDEeNeXCOYQW8TJdBOWw";
// -------------------

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle("Presensi Hybrid PPG")
      .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0');
}

// Fungsi mengecek ID saat login/aktivasi di HP
function cariIdentitasExternal(id) {
  try {
    var ss = SpreadsheetApp.openById(ID_SPREADSHEET);
    var sheets = ["Generus", "Tendik"];
    for (var i = 0; i < sheets.length; i++) {
      var sheet = ss.getSheetByName(sheets[i]);
      if (!sheet) continue;
      var values = sheet.getDataRange().getValues();
      for (var j = 1; j < values.length; j++) {
        // ID di kolom B (index 1), Nama di kolom C (index 2)
        if (values[j][1].toString().trim() == id.toString().trim()) { 
          return { nama: values[j][2], ditemukan: true }; 
        }
      }
    }
    return { ditemukan: false };
  } catch(e) {
    return { ditemukan: false, error: e.toString() };
  }
}

// Fungsi menyimpan absensi ke Sheet Absensi
function simpanAbsensi(data) {
  try {
    var ss = SpreadsheetApp.openById(ID_SPREADSHEET);
    var sheetAbsensi = ss.getSheetByName("Absensi");
    
    // Cari nama lagi untuk validasi terakhir
    var identitas = cariIdentitasExternal(data.id);
    
    var tgl = new Date();
    sheetAbsensi.appendRow([
      tgl,
      data.id,
      identitas.nama || "Tidak Dikenal",
      data.kegiatan, // Diambil dari QR Code Panitia
      tgl.getMonth() + 1,
      tgl.getFullYear()
    ]);
    
    return "✅ BERHASIL!\nNama: " + identitas.nama + "\nKegiatan: " + data.kegiatan;
  } catch (e) {
    return "❌ ERROR: " + e.toString();
  }
}
