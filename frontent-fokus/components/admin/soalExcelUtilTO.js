import * as XLSX from "xlsx";

// ─── KONFIGURASI ──────────────────────────────────────────────────────────────

// Maksimal pasang kolom Opsi/Poin yang disediakan di template.
// Opsi kosong otomatis di-skip saat parsing, jadi 1 template ini fleksibel
// dipakai untuk soal dengan jumlah opsi berapapun (selama ≤ batas ini).
const MAX_OPSI_TEMPLATE_TO = 6;

// ─── GENERATE TEMPLATE (khusus SoalItemTO — tanpa kolom Sub Materi) ──────────

/**
 * Template ini dipakai untuk import soal Tryout (SoalItemTO), di mana
 * soal sudah dikelompokkan per materi lewat pemilihan materi di UI,
 * sehingga TIDAK perlu kolom Sub Materi seperti template latihan biasa.
 *
 * Struktur kolom:
 *   Pertanyaan | Opsi 1 | Poin 1 | Opsi 2 | Poin 2 | ... | Kunci | Pembahasan
 */
export const generateSoalTemplateTO = (jumlahOpsi = MAX_OPSI_TEMPLATE_TO) => {
  const header = ["Pertanyaan"];
  for (let i = 1; i <= jumlahOpsi; i++) {
    header.push(`Opsi ${i}`, `Poin ${i}`);
  }
  header.push("Kunci (A/B/C/...)", "Pembahasan");

  // Baris contoh
  const contoh = ["Contoh pertanyaan soal tryout di sini..."];
  const contohPoin = [4, 3, 2, 1]; // ilustrasi sebaran poin per opsi
  for (let i = 1; i <= jumlahOpsi; i++) {
    if (i <= 4) {
      contoh.push(`Contoh opsi ${String.fromCharCode(64 + i)}`, contohPoin[i - 1]);
    } else {
      contoh.push("", ""); // opsi tambahan dibiarkan kosong di contoh
    }
  }
  contoh.push("A", "Contoh pembahasan jawaban di sini...");

  const ws = XLSX.utils.aoa_to_sheet([header, contoh]);

  ws["!cols"] = [
    { wch: 45 }, // Pertanyaan
    ...Array.from({ length: jumlahOpsi }, () => [{ wch: 30 }, { wch: 8 }]).flat(),
    { wch: 14 }, // Kunci
    { wch: 45 }, // Pembahasan
  ];

  ws["!freeze"] = { xSplit: 0, ySplit: 1 };

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template Soal TO");

  // Sheet petunjuk
  const petunjuk = [
    ["Petunjuk Pengisian Template Soal Tryout"],
    [""],
    ["1. Satu baris = satu soal."],
    ["2. Template ini TIDAK memerlukan kolom Sub Materi — soal otomatis masuk ke materi yang sedang Anda buka di form."],
    ["3. Kolom Pertanyaan & Pembahasan boleh diisi tag HTML dasar, contoh: <p>Teks</p> atau <b>tebal</b>."],
    [`4. Tersedia ${jumlahOpsi} pasang kolom Opsi & Poin. Jika soal hanya butuh 4 opsi, kosongkan saja Opsi 5, 6, dst — baris tetap akan terbaca benar.`],
    ["5. Kolom Poin harus berupa angka."],
    ["6. Kolom Kunci diisi huruf opsi yang benar, contoh: A, B, C, dst (berdasarkan urutan opsi yang TERISI, bukan nomor kolom)."],
    ["7. Jangan menghapus atau mengubah urutan baris header (baris pertama)."],
    ["8. Import bersifat MENAMBAHKAN ke soal yang sudah ada pada materi ini, bukan menggantikan."],
  ];
  const wsInfo = XLSX.utils.aoa_to_sheet(petunjuk);
  wsInfo["!cols"] = [{ wch: 90 }];
  XLSX.utils.book_append_sheet(wb, wsInfo, "Petunjuk");

  XLSX.writeFile(wb, "template_import_soal_tryout.xlsx");
};

// ─── PARSE FILE EXCEL (khusus SoalItemTO) ────────────────────────────────────

/**
 * Parse file Excel untuk soal Tryout — sama seperti parseSoalExcel umum,
 * tapi TIDAK mencari kolom Sub Materi sama sekali (lebih sesuai konteks SoalItemTO).
 *
 * @param {File} file
 * @returns {Promise<{ valid: object[], errors: {row:number, message:string}[] }>}
 *          valid berisi: { pertanyaan, opsi: [{text, poin}], kunci, pembahasan }
 */
export const parseSoalExcelTO = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

        if (!rows.length) {
          return resolve({ valid: [], errors: [{ row: 0, message: "File kosong." }] });
        }

        const header = rows[0].map((h) => String(h).trim());
        const dataRows = rows.slice(1).filter((row) => row.some((c) => String(c).trim() !== ""));

        const idxPertanyaan = header.findIndex((h) => h.toLowerCase().includes("pertanyaan"));
        const idxKunci = header.findIndex((h) => h.toLowerCase().includes("kunci"));
        const idxPembahasan = header.findIndex((h) => h.toLowerCase().includes("pembahasan"));

        // Deteksi pasangan kolom Opsi N / Poin N secara dinamis
        const opsiColumns = [];
        header.forEach((h, i) => {
          const m = h.match(/^Opsi\s*(\d+)$/i);
          if (m) {
            const n = parseInt(m[1], 10);
            const poinIdx = header.findIndex((hh) => hh.match(new RegExp(`^Poin\\s*${n}$`, "i")));
            opsiColumns.push({ opsiIdx: i, poinIdx, n });
          }
        });
        opsiColumns.sort((a, b) => a.n - b.n);

        if (idxPertanyaan === -1 || idxKunci === -1 || !opsiColumns.length) {
          return resolve({
            valid: [],
            errors: [{ row: 0, message: "Format header tidak dikenali. Gunakan template Soal Tryout yang disediakan." }],
          });
        }

        const valid = [];
        const errors = [];

        dataRows.forEach((row, i) => {
          const rowNum = i + 2;

          const pertanyaan = String(row[idxPertanyaan] ?? "").trim();
          const kunciRaw    = idxKunci !== -1 ? String(row[idxKunci] ?? "").trim().toUpperCase() : "";
          const pembahasan  = idxPembahasan !== -1 ? String(row[idxPembahasan] ?? "").trim() : "";

          if (!pertanyaan) {
            errors.push({ row: rowNum, message: "Pertanyaan kosong, baris dilewati." });
            return;
          }

          const opsi = [];
          opsiColumns.forEach(({ opsiIdx, poinIdx }) => {
            const text = String(row[opsiIdx] ?? "").trim();
            if (!text) return; // skip opsi kosong → mendukung jumlah opsi dinamis
            const poinRaw = poinIdx !== -1 ? row[poinIdx] : 0;
            const poin = Number(poinRaw) || 0;
            opsi.push({ text, poin });
          });

          if (opsi.length < 2) {
            errors.push({ row: rowNum, message: `Minimal 2 opsi terisi (ditemukan ${opsi.length}), baris dilewati.` });
            return;
          }

          const kunciIndex = kunciRaw ? kunciRaw.charCodeAt(0) - 65 : -1;
          if (kunciIndex < 0 || kunciIndex >= opsi.length) {
            errors.push({
              row: rowNum,
              message: `Kunci "${kunciRaw || "(kosong)"}" tidak valid untuk ${opsi.length} opsi yang terisi.`,
            });
            return;
          }

          valid.push({ pertanyaan, opsi, kunci: kunciRaw, pembahasan });
        });

        resolve({ valid, errors });
      } catch (err) {
        reject(new Error("Gagal membaca file. Pastikan format .xlsx atau .csv valid."));
      }
    };

    reader.onerror = () => reject(new Error("Gagal membaca file."));
    reader.readAsArrayBuffer(file);
  });
