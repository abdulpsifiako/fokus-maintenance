import * as XLSX from "xlsx";

// ─── KONFIGURASI ──────────────────────────────────────────────────────────────

// Maksimal opsi yang disediakan kolomnya di template.
// Opsi yang teksnya kosong di Excel akan otomatis diabaikan saat parsing,
// sehingga soal dengan 2 opsi maupun 6 opsi tetap bisa pakai template yang sama.
const MAX_OPSI_TEMPLATE = 6;

// ─── GENERATE TEMPLATE ────────────────────────────────────────────────────────

/**
 * Membuat & mengunduh file template Excel untuk import soal.
 * Struktur kolom:
 *   Sub Materi | Pertanyaan | Opsi 1 | Poin 1 | Opsi 2 | Poin 2 | ... | Kunci | Pembahasan
 *
 * Catatan: Pertanyaan/Opsi/Pembahasan diisi sebagai teks/HTML polos.
 * Jika ingin styling (bold, dsb) gunakan tag HTML dasar langsung di cell,
 * karena akan dimasukkan ke Editor (Quill) sebagai innerHTML.
 */
export const generateSoalTemplate = (jumlahOpsi = MAX_OPSI_TEMPLATE) => {
  const header = ["Sub Materi", "Pertanyaan"];
  for (let i = 1; i <= jumlahOpsi; i++) {
    header.push(`Opsi ${i}`, `Poin ${i}`);
  }
  header.push("Kunci (A/B/C/...)", "Pembahasan");

  // Baris contoh agar admin paham formatnya
  const contoh = ["Integritas", "Contoh pertanyaan soal di sini..."];
  for (let i = 1; i <= jumlahOpsi; i++) {
    if (i <= 4) {
      contoh.push(
        `Contoh opsi ${String.fromCharCode(64 + i)}`,
        i === 1 ? 4 : i === 2 ? 3 : i === 3 ? 2 : 1,
      );
    } else {
      contoh.push("", ""); // opsi tambahan dibiarkan kosong di contoh
    }
  }
  contoh.push("A", "Contoh pembahasan...");

  const ws = XLSX.utils.aoa_to_sheet([header, contoh]);

  // Lebar kolom
  ws["!cols"] = [
    { wch: 18 }, // Sub Materi
    { wch: 45 }, // Pertanyaan
    ...Array.from({ length: jumlahOpsi }, () => [
      { wch: 30 },
      { wch: 8 },
    ]).flat(),
    { wch: 14 }, // Kunci
    { wch: 45 }, // Pembahasan
  ];

  ws["!freeze"] = { xSplit: 0, ySplit: 1 };

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template Soal");

  // Sheet petunjuk
  const petunjuk = [
    ["Petunjuk Pengisian Template Soal"],
    [""],
    ["1. Satu baris = satu soal."],
    ["2. Kolom 'Sub Materi' wajib diisi untuk setiap soal."],
    [
      "3. Kolom Pertanyaan & Pembahasan boleh diisi tag HTML dasar, contoh: <p>Teks</p> atau <b>tebal</b>.",
    ],
    [
      `4. Tersedia ${jumlahOpsi} pasang kolom Opsi & Poin. Jika soal hanya butuh 4 opsi, kosongkan saja Opsi 5, 6, dst — baris tetap akan terbaca benar.`,
    ],
    ["5. Kolom Poin harus berupa angka."],
    [
      "6. Kolom Kunci diisi huruf opsi yang benar, contoh: A, B, C, dst (berdasarkan urutan opsi yang TERISI, bukan nomor kolom).",
    ],
    ["7. Jangan menghapus atau mengubah urutan baris header (baris pertama)."],
  ];
  const wsInfo = XLSX.utils.aoa_to_sheet(petunjuk);
  wsInfo["!cols"] = [{ wch: 90 }];
  XLSX.utils.book_append_sheet(wb, wsInfo, "Petunjuk");

  XLSX.writeFile(wb, "template_import_soal.xlsx");
};

// ─── PARSE FILE EXCEL ────────────────────────────────────────────────────────

/**
 * Parse file Excel yang diupload menjadi array soal sesuai struktur datasoal:
 * { pertanyaan, opsi: [{text, poin}], kunci, pembahasan, submateri }
 *
 * @param {File} file
 * @returns {Promise<{ valid: object[], errors: {row:number, message:string}[] }>}
 */
export const parseSoalExcel = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

        if (!rows.length) {
          return resolve({
            valid: [],
            errors: [{ row: 0, message: "File kosong." }],
          });
        }

        const header = rows[0].map((h) => String(h).trim());
        const dataRows = rows
          .slice(1)
          .filter((row) => row.some((c) => String(c).trim() !== ""));

        // Cari index kolom dasar
        const idxSubMateri = header.findIndex((h) =>
          h.toLowerCase().includes("sub materi"),
        );
        const idxPertanyaan = header.findIndex((h) =>
          h.toLowerCase().includes("pertanyaan"),
        );
        const idxKunci = header.findIndex((h) =>
          h.toLowerCase().includes("kunci"),
        );
        const idxPembahasan = header.findIndex((h) =>
          h.toLowerCase().includes("pembahasan"),
        );

        // Cari semua pasangan kolom Opsi N / Poin N secara dinamis
        // sehingga template dengan 4, 6, atau 10 opsi tetap terbaca
        const opsiColumns = [];
        header.forEach((h, i) => {
          const m = h.match(/^Opsi\s*(\d+)$/i);
          if (m) {
            const n = parseInt(m[1], 10);
            const poinIdx = header.findIndex((hh) =>
              hh.match(new RegExp(`^Poin\\s*${n}$`, "i")),
            );
            opsiColumns.push({ opsiIdx: i, poinIdx, n });
          }
        });
        opsiColumns.sort((a, b) => a.n - b.n);

        if (idxPertanyaan === -1 || idxKunci === -1 || !opsiColumns.length) {
          return resolve({
            valid: [],
            errors: [
              {
                row: 0,
                message:
                  "Format header tidak dikenali. Gunakan template yang disediakan.",
              },
            ],
          });
        }

        const valid = [];
        const errors = [];

        dataRows.forEach((row, i) => {
          const rowNum = i + 2; // +2 karena baris 1 = header, index mulai 0

          const pertanyaan = String(row[idxPertanyaan] ?? "").trim();
          const submateri =
            idxSubMateri !== -1 ? String(row[idxSubMateri] ?? "").trim() : "";
          const kunciRaw =
            idxKunci !== -1
              ? String(row[idxKunci] ?? "")
                  .trim()
                  .toUpperCase()
              : "";
          const pembahasan =
            idxPembahasan !== -1 ? String(row[idxPembahasan] ?? "").trim() : "";

          if (!pertanyaan) {
            errors.push({
              row: rowNum,
              message: "Pertanyaan kosong, baris dilewati.",
            });
            return;
          }

          // Ambil opsi yang TERISI saja (skip opsi kosong)
          const opsi = [];
          opsiColumns.forEach(({ opsiIdx, poinIdx }) => {
            const text = String(row[opsiIdx] ?? "").trim();
            if (!text) return; // opsi kosong → skip, mendukung jumlah opsi dinamis
            const poinRaw = poinIdx !== -1 ? row[poinIdx] : 0;
            const poin = Number(poinRaw) || 0;
            opsi.push({ text, poin });
          });

          if (opsi.length < 2) {
            errors.push({
              row: rowNum,
              message: `Minimal 2 opsi terisi (ditemukan ${opsi.length}), baris dilewati.`,
            });
            return;
          }

          // Validasi kunci — harus salah satu huruf sesuai urutan opsi yang terisi
          const kunciIndex = kunciRaw ? kunciRaw.charCodeAt(0) - 65 : -1;
          if (kunciIndex < 0 || kunciIndex >= opsi.length) {
            errors.push({
              row: rowNum,
              message: `Kunci "${kunciRaw || "(kosong)"}" tidak valid untuk ${opsi.length} opsi yang terisi.`,
            });
            return;
          }

          valid.push({
            pertanyaan,
            opsi,
            kunci: kunciRaw,
            pembahasan,
            submateri,
          });
        });

        resolve({ valid, errors });
      } catch (err) {
        reject(
          new Error(
            "Gagal membaca file. Pastikan format .xlsx atau .csv valid.",
          ),
        );
      }
    };

    reader.onerror = () => reject(new Error("Gagal membaca file."));
    reader.readAsArrayBuffer(file);
  });
