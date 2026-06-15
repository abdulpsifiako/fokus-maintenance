import { useState, useCallback } from "react";
import * as XLSX from "xlsx";
import { addUserProgram } from "@/lib/public/auth";
import Cookies from "js-cookie";

// ─── HELPERS ──────────────────────────────────────────────────────────────────

/** Bersihkan email: trim spasi, tab, newline */
const cleanEmail = (raw) =>
  String(raw ?? "")
    .replace(/[\t\n\r]/g, "")
    .trim()
    .toLowerCase();

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ─── TEMPLATE GENERATOR ───────────────────────────────────────────────────────

/**
 * Generate file .xlsx dengan:
 * - Kolom A: Email (header merah)
 * - Kolom B: Program Utama (dropdown nama program + durasi bulan)
 * - Kolom C: Try Out (dropdown judul tryout)
 * - Kolom D: Kelas Online (dropdown judul kelas)
 *
 * Dropdown menggunakan Data Validation (list) bawaan Excel.
 * User cukup isi email di kolom A; kolom B/C/D opsional.
 */
export const generateTemplate = ({
  dataProgram = [],
  dataTryout = [],
  dataKelas = [],
}) => {
  const wb = XLSX.utils.book_new();

  // ── Sheet utama: Template ──────────────────────────────────────────────────

  // Header row — kolom C adalah Bulan (angka masa berlaku program utama)
  const headerRow = [
    "Email *",
    "Program Utama",
    "Bulan",
    "Try Out",
    "Kelas Online",
  ];

  // Contoh 1 baris agar user paham format
  const exampleRow = ["user@email.com", "", "1", "", ""];

  const ws = XLSX.utils.aoa_to_sheet([headerRow, exampleRow]);

  // Style kolom lebar
  ws["!cols"] = [
    { wch: 32 }, // Email
    { wch: 36 }, // Program Utama
    { wch: 10 }, // Bulan
    { wch: 36 }, // Try Out
    { wch: 36 }, // Kelas Online
  ];

  // Freeze baris pertama (header)
  ws["!freeze"] = { xSplit: 0, ySplit: 1 };

  // ── Sheet referensi: hidden, berisi daftar pilihan ─────────────────────────
  // Cara paling kompatibel: taruh list di sheet kedua, referensikan dari sana

  const programNames = dataProgram.map((p) => p.properties?.name || p.id);
  const tryoutTitles = dataTryout.map((t) => t.properties?.judul || t.id);
  const kelasTitles = dataKelas.map((k) => k.properties?.judul || k.id);

  const maxRows = Math.max(
    programNames.length,
    tryoutTitles.length,
    kelasTitles.length,
    1,
  );
  const refData = [
    ["Program Utama", "Try Out", "Kelas Online"],
    ...Array.from({ length: maxRows }, (_, i) => [
      programNames[i] || "",
      tryoutTitles[i] || "",
      kelasTitles[i] || "",
    ]),
  ];

  const wsRef = XLSX.utils.aoa_to_sheet(refData);
  wsRef["!cols"] = [{ wch: 36 }, { wch: 36 }, { wch: 36 }];

  XLSX.utils.book_append_sheet(wb, ws, "Template");
  XLSX.utils.book_append_sheet(wb, wsRef, "Referensi");

  // ── Data Validation (dropdown) ────────────────────────────────────────────
  // Menggunakan formula referensi ke sheet Referensi untuk 50 baris data
  ws["!dataValidation"] = [];

  const addDropdown = (col, refCol, count) => {
    if (!count) return;
    const formula = `Referensi!$${refCol}$2:$${refCol}$${count + 1}`;
    for (let row = 2; row <= 51; row++) {
      ws["!dataValidation"].push({
        type: "list",
        sqref: `${col}${row}`,
        formula1: formula,
        showDropDown: false,
        showErrorMessage: false,
        showInputMessage: true,
        promptTitle: "Pilih atau kosongkan",
        prompt: "Pilih dari daftar atau biarkan kosong jika tidak perlu.",
      });
    }
  };

  addDropdown("B", "A", programNames.length);
  // Kolom C (Bulan) → input angka bebas, tidak perlu dropdown
  addDropdown("D", "B", tryoutTitles.length);
  addDropdown("E", "C", kelasTitles.length);

  // Download
  XLSX.writeFile(wb, "template_bulk_user.xlsx");
};

// ─── FILE PARSER ──────────────────────────────────────────────────────────────

/**
 * Parse file Excel/CSV yang diupload.
 * Kembalikan array: { email, programNama, tryoutNama, kelasNama }
 */
export const parseExcelFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

        // Abaikan header baris pertama
        const dataRows = rows
          .slice(1)
          .filter((row) => row.some((c) => c !== ""));

        const parsed = dataRows.map((row) => ({
          email: cleanEmail(row[0]),
          programNama: String(row[1] ?? "").trim(),
          programBulan: Math.max(
            1,
            parseInt(String(row[2] ?? "1").trim(), 10) || 1,
          ),
          tryoutNama: String(row[3] ?? "").trim(),
          kelasNama: String(row[4] ?? "").trim(),
        }));

        resolve(parsed);
      } catch (err) {
        reject(
          new Error("File tidak bisa dibaca. Pastikan format .xlsx atau .csv."),
        );
      }
    };
    reader.onerror = () => reject(new Error("Gagal membaca file."));
    reader.readAsArrayBuffer(file);
  });

// ─── HOOK ─────────────────────────────────────────────────────────────────────

export function useBulkUpload({ dataProgram, dataTryout, dataKelas, onDone }) {
  const token = Cookies.get("token");

  // Status upload
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [results, setResults] = useState([]); // { email, status, message }
  const [parseError, setParseError] = useState(null);
  const [previewRows, setPreviewRows] = useState(null); // parsed tapi belum upload

  // Reset
  const reset = useCallback(() => {
    setUploading(false);
    setProgress({ done: 0, total: 0 });
    setResults([]);
    setParseError(null);
    setPreviewRows(null);
  }, []);

  // ── Unduh template ─────────────────────────────────────────────────────────

  const downloadTemplate = useCallback(() => {
    generateTemplate({ dataProgram, dataTryout, dataKelas });
  }, [dataProgram, dataTryout, dataKelas]);

  // ── Parse file (preview sebelum upload) ───────────────────────────────────

  const handleFileChange = useCallback(async (file) => {
    setParseError(null);
    setResults([]);
    setPreviewRows(null);

    if (!file) return;

    const ext = file.name.split(".").pop().toLowerCase();
    if (!["xlsx", "xls", "csv"].includes(ext)) {
      setParseError("Format file harus .xlsx, .xls, atau .csv");
      return;
    }

    try {
      const rows = await parseExcelFile(file);

      // Filter baris kosong / email tidak valid
      const valid = rows.filter((r) => r.email && isValidEmail(r.email));
      const invalid = rows.filter((r) => r.email && !isValidEmail(r.email));

      setPreviewRows({ valid, invalid, total: rows.length });
    } catch (err) {
      setParseError(err.message);
    }
  }, []);

  // ── Resolve ID dari nama ───────────────────────────────────────────────────

  const resolveIds = useCallback(
    (row) => {
      const programUtama = [];
      const tryout = [];
      const kelasOnline = [];

      if (row.programNama) {
        const found = dataProgram.find(
          (p) =>
            (p.properties?.name || "").toLowerCase() ===
            row.programNama.toLowerCase(),
        );
        if (found)
          programUtama.push({
            program_id: found.id,
            bulan: row.programBulan ?? 1,
          });
      }

      if (row.tryoutNama) {
        const found = dataTryout.find(
          (t) =>
            (t.properties?.judul || "").toLowerCase() ===
            row.tryoutNama.toLowerCase(),
        );
        if (found) tryout.push(found.id);
      }

      if (row.kelasNama) {
        const found = dataKelas.find(
          (k) =>
            (k.properties?.judul || "").toLowerCase() ===
            row.kelasNama.toLowerCase(),
        );
        if (found) kelasOnline.push(found.id);
      }

      return { programUtama, tryout, kelasOnline };
    },
    [dataProgram, dataTryout, dataKelas],
  );

  // ── Upload loop ────────────────────────────────────────────────────────────

  const startUpload = useCallback(async () => {
    if (!previewRows?.valid?.length) return;

    const rows = previewRows.valid;
    const total = rows.length;

    setUploading(true);
    setProgress({ done: 0, total });
    setResults([]);

    const newResults = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      try {
        const { programUtama, tryout, kelasOnline } = resolveIds(row);

        const res = await addUserProgram(
          {
            email: row.email,
            nama: "",
            password: "",
            emailOnly: true,
            programUtama,
            tryout,
            kelasOnline,
          },
          token,
        );

        newResults.push({
          email: row.email,
          status: "success",
          message: res.message || "Berhasil ditambahkan",
        });
      } catch (error) {
        const errMsg =
          error?.response?.data?.message ||
          error?.message ||
          "Gagal ditambahkan";

        // Jika 404 (user tidak ditemukan) → skip
        const isNotFound =
          error?.response?.status === 404 || error?.status === 404;

        newResults.push({
          email: row.email,
          status: isNotFound ? "skip" : "error",
          message: isNotFound ? "Email tidak ditemukan, dilewati" : errMsg,
        });
      }

      setProgress({ done: i + 1, total });
      // Tulis hasil satu per satu agar progress terasa real-time
      setResults([...newResults]);

      // Jeda kecil agar UI tidak freeze
      await new Promise((r) => setTimeout(r, 80));
    }

    setUploading(false);
    if (onDone) onDone(newResults);
  }, [previewRows, resolveIds, token, onDone]);

  // ── Derived counts ─────────────────────────────────────────────────────────

  const counts = {
    success: results.filter((r) => r.status === "success").length,
    skip: results.filter((r) => r.status === "skip").length,
    error: results.filter((r) => r.status === "error").length,
  };

  return {
    // state
    uploading,
    progress,
    results,
    parseError,
    previewRows,
    counts,
    // actions
    reset,
    downloadTemplate,
    handleFileChange,
    startUpload,
  };
}
