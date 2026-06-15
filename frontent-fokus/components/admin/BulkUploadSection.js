import { useRef } from "react";
import { useBulkUpload } from "./useBulkUpload";

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────

function ProgressBar({ done, total }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>
          Mengupload... {done} / {total} email
        </span>
        <span className="font-semibold">{pct}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-200 rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── RESULT BADGE ─────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const map = {
    success: "bg-green-100 text-green-700",
    skip: "bg-yellow-100 text-yellow-700",
    error: "bg-red-100 text-red-600",
  };
  const label = { success: "Berhasil", skip: "Dilewati", error: "Gagal" };
  return (
    <span
      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${map[status] || ""}`}
    >
      {label[status] || status}
    </span>
  );
}

// ─── SUMMARY COUNTS ───────────────────────────────────────────────────────────

function SummaryCounts({ counts, total }) {
  return (
    <div className="flex flex-wrap gap-3 text-xs mt-2">
      <span className="text-gray-500">
        Total: <strong>{total}</strong>
      </span>
      <span className="text-green-600">
        ✓ Berhasil: <strong>{counts.success}</strong>
      </span>
      <span className="text-yellow-600">
        ⤵ Dilewati: <strong>{counts.skip}</strong>
      </span>
      <span className="text-red-500">
        ✕ Gagal: <strong>{counts.error}</strong>
      </span>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function BulkUploadSection({
  dataProgram,
  dataTryout,
  dataKelas,
}) {
  const fileRef = useRef(null);

  const {
    uploading,
    progress,
    results,
    parseError,
    previewRows,
    counts,
    reset,
    downloadTemplate,
    handleFileChange,
    startUpload,
  } = useBulkUpload({ dataProgram, dataTryout, dataKelas });

  const isDone = !uploading && results.length > 0;
  const hasPreview = !!previewRows;

  return (
    <div className="border border-dashed border-red-200 rounded-lg p-4 bg-red-50/30 space-y-4 mt-4">
      {/* ── JUDUL ── */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="text-sm font-semibold text-gray-700">
            Import Bulk via Excel
          </p>
          <p className="text-xs text-gray-400">
            Unduh template, isi email & pilih program, lalu upload kembali.
          </p>
        </div>

        {/* Tombol reset jika sudah ada preview/hasil */}
        {(hasPreview || isDone) && !uploading && (
          <button
            onClick={() => {
              reset();
              if (fileRef.current) fileRef.current.value = "";
            }}
            className="text-xs text-gray-400 hover:text-red-500 underline"
          >
            Ulangi dari awal
          </button>
        )}
      </div>

      {/* ── STEP 1: Unduh + Upload ── */}
      {!hasPreview && !isDone && (
        <div className="flex flex-wrap gap-2">
          {/* Unduh Template */}
          <button
            type="button"
            onClick={downloadTemplate}
            className="flex items-center gap-1.5 border border-primary text-primary px-3 py-1.5 rounded text-xs hover:bg-primary hover:text-white transition"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
              />
            </svg>
            Unduh Template
          </button>

          {/* Import File */}
          <label className="flex items-center gap-1.5 bg-primary text-white px-3 py-1.5 rounded text-xs cursor-pointer hover:bg-red-700 transition">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 8l5-5 5 5M12 3v12"
              />
            </svg>
            Import Excel
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            />
          </label>
        </div>
      )}

      {/* ── PARSE ERROR ── */}
      {parseError && (
        <p className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded">
          ⚠ {parseError}
        </p>
      )}

      {/* ── STEP 2: Preview sebelum upload ── */}
      {hasPreview && !uploading && !isDone && (
        <div className="space-y-3">
          <div className="bg-white border border-gray-200 rounded-lg p-3 text-xs space-y-1">
            <p className="font-semibold text-gray-700">Preview File</p>
            <p className="text-gray-500">
              Total baris: <strong>{previewRows.total}</strong> &nbsp;·&nbsp;
              Email valid:{" "}
              <strong className="text-green-600">
                {previewRows.valid.length}
              </strong>{" "}
              &nbsp;·&nbsp; Email tidak valid / kosong:{" "}
              <strong className="text-red-500">
                {previewRows.total - previewRows.valid.length}
              </strong>
            </p>

            {/* Daftar email valid (max 5 preview) */}
            {previewRows.valid.length > 0 && (
              <div className="mt-2">
                <p className="text-gray-400 mb-1">Email yang akan diproses:</p>
                <div className="max-h-28 overflow-y-auto space-y-1">
                  {previewRows.valid.slice(0, 5).map((r, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-[11px] bg-gray-50 px-2 py-1 rounded"
                    >
                      <span className="font-mono text-gray-700">{r.email}</span>
                      <div className="flex gap-2 text-gray-400">
                        {r.programNama && (
                          <span>
                            📋 {r.programNama} ({r.programBulan} bln)
                          </span>
                        )}
                        {r.tryoutNama && <span>📝 {r.tryoutNama}</span>}
                        {r.kelasNama && <span>🎓 {r.kelasNama}</span>}
                      </div>
                    </div>
                  ))}
                  {previewRows.valid.length > 5 && (
                    <p className="text-gray-400 text-[11px] px-2">
                      ... dan {previewRows.valid.length - 5} email lainnya
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Email tidak valid */}
            {previewRows.invalid?.length > 0 && (
              <div className="mt-2">
                <p className="text-yellow-600 mb-1">
                  Email tidak valid (akan dilewati):
                </p>
                <div className="max-h-20 overflow-y-auto space-y-1">
                  {previewRows.invalid.map((r, i) => (
                    <div
                      key={i}
                      className="text-[11px] font-mono text-yellow-700 bg-yellow-50 px-2 py-1 rounded"
                    >
                      {r.email || "(kosong)"}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tombol aksi */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                reset();
                if (fileRef.current) fileRef.current.value = "";
              }}
              className="border border-gray-300 text-gray-500 px-3 py-1.5 rounded text-xs hover:bg-gray-50 transition"
            >
              Ganti File
            </button>
            <button
              type="button"
              disabled={!previewRows.valid.length}
              onClick={startUpload}
              className="bg-primary text-white px-4 py-1.5 rounded text-xs hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Mulai Upload ({previewRows.valid.length} email)
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Progress ── */}
      {uploading && (
        <div className="space-y-3">
          <ProgressBar done={progress.done} total={progress.total} />

          {/* Hasil real-time saat upload berlangsung */}
          {results.length > 0 && (
            <div className="max-h-40 overflow-y-auto space-y-1 border border-gray-100 rounded-lg p-2 bg-white">
              {results.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-[11px] px-1"
                >
                  <span className="font-mono text-gray-600 truncate max-w-[60%]">
                    {r.email}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={r.status} />
                    <span className="text-gray-400 hidden sm:inline">
                      {r.message}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── STEP 4: Hasil akhir ── */}
      {isDone && (
        <div className="space-y-3">
          <SummaryCounts counts={counts} total={results.length} />

          {/* Tabel hasil lengkap */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-[2fr_1fr_3fr] gap-2 px-3 py-2 bg-gray-50 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              <span>Email</span>
              <span>Status</span>
              <span>Keterangan</span>
            </div>

            {/* Rows — scroll jika banyak */}
            <div className="max-h-60 overflow-y-auto divide-y divide-gray-50">
              {results.map((r, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-[2fr_1fr_3fr] gap-2 px-3 py-2 text-[11px] items-center
                    ${r.status === "error" ? "bg-red-50" : r.status === "skip" ? "bg-yellow-50/50" : ""}`}
                >
                  <span className="font-mono text-gray-700 truncate">
                    {r.email}
                  </span>
                  <StatusBadge status={r.status} />
                  <span className="text-gray-500 truncate">{r.message}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tombol export hasil gagal */}
          {(counts.error > 0 || counts.skip > 0) && (
            <button
              type="button"
              onClick={() => {
                const failRows = results
                  .filter((r) => r.status !== "success")
                  .map((r) => [
                    r.email,
                    r.status === "skip" ? "Dilewati" : "Gagal",
                    r.message,
                  ]);

                const wb = require("xlsx").utils.book_new();
                const ws = require("xlsx").utils.aoa_to_sheet([
                  ["Email", "Status", "Keterangan"],
                  ...failRows,
                ]);
                ws["!cols"] = [{ wch: 32 }, { wch: 12 }, { wch: 40 }];
                require("xlsx").utils.book_append_sheet(wb, ws, "Gagal");
                require("xlsx").writeFile(wb, "hasil_gagal_bulk_upload.xlsx");
              }}
              className="flex items-center gap-1.5 border border-red-200 text-red-500 px-3 py-1.5 rounded text-xs hover:bg-red-50 transition"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
                />
              </svg>
              Unduh Daftar Gagal ({counts.error + counts.skip} email)
            </button>
          )}
        </div>
      )}
    </div>
  );
}
