/**
 * bulkExcel.js
 * Utility untuk generate template Excel dan parse file upload.
 * Pakai SheetJS (xlsx) — install: npm install xlsx
 */

import * as XLSX from "xlsx";

// ─── GENERATE TEMPLATE ────────────────────────────────────────────────────────

/**
 * Generate file Excel template untuk bulk upload user.
 *
 * Sheet 1 "Import Email" — kolom yang diisi user:
 *   A: Email (wajib)
 *   B: Program Utama (dropdown nama program)
 *   C: Bulan Program Utama (angka, hanya jika kolom B diisi)
 *   D: Try Out (dropdown nama tryout, bisa kosong)
 *   E: Kelas Online (dropdown nama kelas, bisa kosong)
 *
 * Sheet 2 "Referensi" — data master tersembunyi untuk validasi dropdown.
 *
 * @param {Array}  dataProgram  - [{ id, properties: { name } }]
 * @param {Array}  dataTryout   - [{ id, properties: { judul } }]
 * @param {Array}  dataKelas    - [{ id, properties: { judul } }]
 */
export function generateTemplate(dataProgram, dataTryout, dataKelas) {
  const wb = XLSX.utils.book_new();

  // ── Sheet 1: Import Email ──────────────────────────────────────────────────

  const headerRow = [
    "Email *",
    "Program Utama (opsional)",
    "Bulan Program (opsional)",
    "Try Out (opsional)",
    "Kelas Online (opsional)",
  ];

  // Contoh baris panduan (baris ke-2, grey di Excel tidak bisa via SheetJS murni)
  const guideRow = [
    "contoh@email.com",
    dataProgram[0]?.properties?.name || "Nama Program",
    "1",
    dataTryout[0]?.properties?.judul || "Nama Tryout",
    dataKelas[0]?.properties?.judul || "Nama Kelas",
  ];

  const wsData = [headerRow, guideRow];

  // Tambah 100 baris kosong untuk input user
  for (let i = 0; i < 100; i++) wsData.push(["", "", "", "", ""]);

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Lebar kolom
  ws["!cols"] = [
    { wch: 35 }, // Email
    { wch: 35 }, // Program Utama
    { wch: 20 }, // Bulan
    { wch: 35 }, // Try Out
    { wch: 35 }, // Kelas Online
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Import Email");

  // ── Sheet 2: Referensi (data master) ──────────────────────────────────────

  const refData = [
    ["=== REFERENSI PILIHAN ===", "", ""],
    ["", "", ""],
    ["PROGRAM UTAMA", "TRY OUT", "KELAS ONLINE"],
    ...Array.from(
      {
        length: Math.max(
          dataProgram.length,
          dataTryout.length,
          dataKelas.length,
        ),
      },
      (_, i) => [
        dataProgram[i]?.properties?.name || "",
        dataTryout[i]?.properties?.judul || "",
        dataKelas[i]?.properties?.judul || "",
      ],
    ),
  ];

  const wsRef = XLSX.utils.aoa_to_sheet(refData);
  wsRef["!cols"] = [{ wch: 35 }, { wch: 35 }, { wch: 35 }];
  XLSX.utils.book_append_sheet(wb, wsRef, "Referensi");

  // ── Download ───────────────────────────────────────────────────────────────

  XLSX.writeFile(wb, "template_bulk_user.xlsx");
}

// ─── PARSE UPLOADED FILE ──────────────────────────────────────────────────────

/**
 * Baca file Excel yang diupload, kembalikan array of objects.
 * Setiap object: { email, programNama, bulan, tryoutNama, kelasNama }
 *
 * Rules:
 * - Skip baris kosong atau baris panduan (baris pertama setelah header)
 * - Trim email dan hapus spasi/tab tersembunyi
 * - Skip jika email kosong setelah di-trim
 *
 * @param {File} file - File dari input[type=file]
 * @returns {Promise<Array>}
 */
export async function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, { type: "array" });
        const ws = wb.Sheets["Import Email"];

        if (!ws) {
          reject(
            new Error(
              "Sheet 'Import Email' tidak ditemukan. Gunakan template yang disediakan.",
            ),
          );
          return;
        }

        // Baca mulai baris ke-3 (index 2) — lewati header + baris contoh
        const rows = XLSX.utils.sheet_to_json(ws, {
          header: 1,
          range: 2, // mulai row index 2 (baris ke-3)
          defval: "",
        });

        const result = rows
          .map((row) => ({
            email: cleanEmail(row[0]),
            programNama: cleanStr(row[1]),
            bulan: parseInt(row[2]) || 1,
            tryoutNama: cleanStr(row[3]),
            kelasNama: cleanStr(row[4]),
          }))
          .filter((r) => r.email !== ""); // skip baris kosong

        resolve(result);
      } catch (err) {
        reject(new Error("Gagal membaca file: " + err.message));
      }
    };

    reader.onerror = () => reject(new Error("Gagal membaca file."));
    reader.readAsArrayBuffer(file);
  });
}

// ─── RESOLVE IDs dari nama ─────────────────────────────────────────────────

/**
 * Konversi nama (dari Excel) → id (untuk API).
 * Case-insensitive, trim.
 *
 * @param {string} nama
 * @param {Array}  list - array data master
 * @param {string} labelKey - key nama di properties ('name' | 'judul')
 * @returns {string|null}
 */
export function resolveId(nama, list, labelKey) {
  if (!nama) return null;
  const normalized = nama.trim().toLowerCase();
  const found = list.find(
    (item) => (item.properties?.[labelKey] || "").toLowerCase() === normalized,
  );
  return found?.id || null;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

/** Hapus semua whitespace tersembunyi dari email */
function cleanEmail(val) {
  if (!val && val !== 0) return "";
  return String(val)
    .replace(/[\s\t\r\n\u00a0\u200b]+/g, "") // hapus spasi, tab, NBSP, zero-width
    .toLowerCase()
    .trim();
}

function cleanStr(val) {
  if (!val && val !== 0) return "";
  return String(val).trim();
}
