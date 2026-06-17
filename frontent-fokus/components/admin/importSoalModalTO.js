import { useRef, useState } from "react";
import { Upload, Download, X, AlertTriangle, CheckCircle2 } from "lucide-react";
import { generateSoalTemplateTO, parseSoalExcelTO } from "./soalExcelUtilTO";

export const ImportSoalModalTO = ({ onClose, onImport }) => {
  const fileRef = useRef(null);
  const [parsing, setParsing]   = useState(false);
  const [result, setResult]     = useState(null); // { valid, errors }
  const [fileError, setFileError] = useState("");

  const handleFile = async (file) => {
    if (!file) return;
    setFileError("");
    setResult(null);

    const ext = file.name.split(".").pop().toLowerCase();
    if (!["xlsx", "xls", "csv"].includes(ext)) {
      setFileError("Format file harus .xlsx, .xls, atau .csv");
      return;
    }

    setParsing(true);
    try {
      const parsed = await parseSoalExcelTO(file);
      setResult(parsed);
    } catch (err) {
      setFileError(err.message);
    } finally {
      setParsing(false);
    }
  };

  const handleConfirmImport = () => {
    if (!result?.valid?.length) return;
    onImport(result.valid); // append ke data_soal materi aktif
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] bg-gray-300/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h3 className="text-lg font-bold text-primary">Import Soal Tryout dari Excel</h3>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Tombol unduh template */}
          <div className="flex items-center justify-between bg-gray-50 border rounded-lg p-3">
            <div>
              <p className="text-sm font-medium">Belum punya template?</p>
              <p className="text-xs text-gray-500">
                Template khusus soal tryout — tanpa kolom Sub Materi karena soal akan otomatis masuk ke materi yang sedang dibuka.
              </p>
            </div>
            <button
              type="button"
              onClick={() => generateSoalTemplateTO()}
              className="flex items-center gap-1.5 px-3 py-2 border border-primary text-primary rounded-md text-xs font-semibold shrink-0"
            >
              <Download size={14} />
              Unduh Template
            </button>
          </div>

          {/* Upload area */}
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition"
          >
            <Upload className="mx-auto mb-2 text-gray-400" size={28} />
            <p className="text-sm text-gray-600">
              Klik untuk pilih file Excel (.xlsx, .xls, .csv)
            </p>
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>

          {parsing && <p className="text-sm text-gray-500 text-center">Membaca file...</p>}

          {fileError && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-md">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <span>{fileError}</span>
            </div>
          )}

          {/* Hasil parsing */}
          {result && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-md">
                <CheckCircle2 size={18} className="shrink-0" />
                <span>
                  <strong>{result.valid.length}</strong> soal berhasil dibaca dan siap ditambahkan ke materi ini
                  {result.errors.length > 0 && (
                    <> · <strong className="text-red-500">{result.errors.length}</strong> baris dilewati</>
                  )}
                </span>
              </div>

              {result.errors.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 max-h-32 overflow-y-auto">
                  <p className="text-xs font-semibold text-yellow-700 mb-1">Baris yang dilewati:</p>
                  <ul className="text-xs text-yellow-700 space-y-0.5 list-disc list-inside">
                    {result.errors.map((e, i) => (
                      <li key={i}>Baris {e.row}: {e.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.valid.length > 0 && (
                <div className="border rounded-md overflow-hidden max-h-56 overflow-y-auto">
                  {result.valid.map((soal, i) => (
                    <div key={i} className="p-3 border-b last:border-b-0 text-xs">
                      <p className="font-semibold text-gray-700">
                        {i + 1}.{" "}
                        <span dangerouslySetInnerHTML={{ __html: soal.pertanyaan.slice(0, 80) }} />
                        {soal.pertanyaan.length > 80 && "..."}
                      </p>
                      <p className="text-gray-400 mt-1">
                        {soal.opsi.length} opsi · Kunci: <strong>{soal.kunci}</strong>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-5 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border hover:bg-gray-50 text-sm"
          >
            Batal
          </button>
          <button
            onClick={handleConfirmImport}
            disabled={!result?.valid?.length}
            className="px-4 py-2 rounded-md bg-primary text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Tambahkan {result?.valid?.length ? `${result.valid.length} Soal` : ""}
          </button>
        </div>
      </div>
    </div>
  );
};
