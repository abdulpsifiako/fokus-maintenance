import { useState } from "react";
import { X, FileSpreadsheet } from "lucide-react";
import Editor from "./editor";
import { v4 as uuidv4 } from "uuid";
import { ImportSoalModalTO } from "./importSoalModalTO"; // ← (1) modal khusus TO (tanpa Sub Materi)

export const SoalItemTO = ({ index, form, setForm, onClose }) => {
  const soal = form?.materi[index];
  const [activeSoal, setActiveSoal] = useState(0); // soal yang sedang ditampilkan
  const [showImport, setShowImport] = useState(false); // ← (2) state modal import

  const [formSoal, setFormSoal] = useState({
    id: uuidv4(),
    pertanyaan: "",
    opsi: [],
    kunci: "",
    pembahasan: "",
  });

  // 🟢 Tambah soal baru
  const handleTambahSoal = () => {
    setForm((prev) => {
      const updatedMateri = [...prev.materi];
      const targetMateri = { ...updatedMateri[index] };
      const updatedSoal = [...(targetMateri.data_soal || []), formSoal];

      targetMateri.data_soal = updatedSoal;
      updatedMateri[index] = targetMateri;

      return { ...prev, materi: updatedMateri };
    });

    setActiveSoal(soal?.data_soal?.length || 0); // pindah ke soal baru
    setFormSoal({
      id: uuidv4(),
      pertanyaan: "",
      opsi: [],
      kunci: "",
      pembahasan: "",
    });
  };

  // 🟠 Hapus soal
  const handleRemoveSoal = (posisiSoal) => {
    setForm((prev) => {
      const updatedMateri = [...prev.materi];
      const targetMateri = { ...updatedMateri[index] };
      const updatedSoal = targetMateri.data_soal.filter(
        (_, i) => i !== posisiSoal,
      );

      targetMateri.data_soal = updatedSoal;
      updatedMateri[index] = targetMateri;

      return { ...prev, materi: updatedMateri };
    });

    // pindah ke soal sebelumnya (jika masih ada)
    setActiveSoal((prev) => (prev > 0 ? prev - 1 : 0));
  };

  // 🧠 Ubah pertanyaan/kunci/pembahasan
  const handleChangeSoal = (posisiSoal, field, value) => {
    setForm((prev) => {
      const updatedMateri = [...prev.materi];
      const targetMateri = { ...updatedMateri[index] };
      const updatedSoal = [...(targetMateri.data_soal || [])];
      const targetSoal = { ...updatedSoal[posisiSoal] };

      targetSoal[field] = value;

      updatedSoal[posisiSoal] = targetSoal;
      targetMateri.data_soal = updatedSoal;
      updatedMateri[index] = targetMateri;

      return { ...prev, materi: updatedMateri };
    });
  };

  // 🟡 Tambah opsi
  const handleAddOpsi = (posisi) => {
    setForm((prev) => {
      const updatedMateri = [...prev.materi];
      const targetMateri = { ...updatedMateri[index] };
      const updatedSoal = [...targetMateri.data_soal];
      const targetSoal = { ...updatedSoal[posisi] };

      targetSoal.opsi = [
        ...(targetSoal.opsi || []),
        { id: uuidv4(), text: "", poin: 0 },
      ];

      updatedSoal[posisi] = targetSoal;
      targetMateri.data_soal = updatedSoal;
      updatedMateri[index] = targetMateri;

      return { ...prev, materi: updatedMateri };
    });
  };

  // 🟣 Ubah opsi
  const handleChangeOpsi = (posisiSoal, posisiOpsi, field, value) => {
    setForm((prev) => {
      const updatedMateri = [...prev.materi];
      const targetMateri = { ...updatedMateri[index] };
      const updatedSoal = [...targetMateri.data_soal];
      const targetSoal = { ...updatedSoal[posisiSoal] };
      const updatedOpsi = [...targetSoal.opsi];

      updatedOpsi[posisiOpsi] = {
        ...updatedOpsi[posisiOpsi],
        [field]: value,
      };

      targetSoal.opsi = updatedOpsi;
      updatedSoal[posisiSoal] = targetSoal;
      targetMateri.data_soal = updatedSoal;
      updatedMateri[index] = targetMateri;

      return { ...prev, materi: updatedMateri };
    });
  };

  // 🔴 Hapus opsi
  const handleRemoveOpsi = (posisiSoal, posisiOpsi) => {
    setForm((prev) => {
      const updatedMateri = [...prev.materi];
      const targetMateri = { ...updatedMateri[index] };
      const updatedSoal = [...targetMateri.data_soal];
      const targetSoal = { ...updatedSoal[posisiSoal] };

      targetSoal.opsi = targetSoal.opsi.filter((_, i) => i !== posisiOpsi);
      updatedSoal[posisiSoal] = targetSoal;
      targetMateri.data_soal = updatedSoal;
      updatedMateri[index] = targetMateri;

      return { ...prev, materi: updatedMateri };
    });
  };

  // ── (3) Handler hasil import — APPEND ke data_soal materi aktif ──────────
  // Struktur di sini beda dari LatihanAdd: tiap soal & opsi punya `id` uuid,
  // dan tidak ada field `submateri` per soal (soal sudah dikelompokkan per materi).
  // Sub Materi dari Excel diabaikan di sini, hanya pertanyaan/opsi/kunci/pembahasan dipakai.
  const handleImportSoal = (soalBaru) => {
    setForm((prev) => {
      const updatedMateri = [...prev.materi];
      const targetMateri = { ...updatedMateri[index] };

      const soalUntukDitambah = soalBaru.map((s) => ({
        id: uuidv4(),
        pertanyaan: s.pertanyaan,
        opsi: s.opsi.map((o) => ({ id: uuidv4(), text: o.text, poin: o.poin })),
        kunci: s.kunci,
        pembahasan: s.pembahasan,
      }));

      const updatedSoal = [
        ...(targetMateri.data_soal || []),
        ...soalUntukDitambah,
      ];
      targetMateri.data_soal = updatedSoal;
      updatedMateri[index] = targetMateri;

      return { ...prev, materi: updatedMateri };
    });

    // Pindah fokus ke soal pertama hasil import
    setActiveSoal((prevActive) => {
      const jumlahSebelumImport = soal?.data_soal?.length || 0;
      return jumlahSebelumImport; // index soal pertama hasil import
    });
  };

  const dataSoal = soal?.data_soal || [];
  const currentSoal = dataSoal[activeSoal];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-xl shadow-lg w-[95%] md:w-[85%] max-h-[90vh] overflow-y-auto p-6 relative">
        {/* Tombol Tutup */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
        >
          <X size={20} />
        </button>

        <div className="flex items-center justify-between mb-4 pr-8">
          <h2 className="text-lg font-semibold text-gray-800">Kelola Soal</h2>

          {/* ── (4) Tombol Import Excel ── */}
          <button
            type="button"
            onClick={() => setShowImport(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-green-600 text-green-600 rounded-md text-xs font-semibold hover:bg-green-50"
          >
            <FileSpreadsheet size={14} />
            Import Excel
          </button>
        </div>

        {/* 🔢 Navigasi Nomor Soal */}
        <div className="flex flex-wrap gap-2 mb-4">
          {dataSoal.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSoal(i)}
              className={`w-8 h-8 rounded-full text-sm font-semibold ${
                i === activeSoal
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={handleTambahSoal}
            className="w-8 h-8 rounded-full bg-green-600 text-white font-bold"
          >
            +
          </button>
        </div>

        {/* 🔍 Tampilkan Soal Aktif */}
        {currentSoal ? (
          <div className="border border-gray-300 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-gray-700">
                Soal {activeSoal + 1}
              </h4>
              {dataSoal.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveSoal(activeSoal)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Hapus Soal Ini
                </button>
              )}
            </div>

            <label className="block mb-1 font-medium">Pertanyaan</label>
            <Editor
              key={currentSoal.id}
              defaultValue={currentSoal.pertanyaan}
              onTextChange={(val) =>
                handleChangeSoal(activeSoal, "pertanyaan", val)
              }
            />

            {/* Opsi Jawaban */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-medium">Opsi Jawaban</label>
                <button
                  type="button"
                  onClick={() => handleAddOpsi(activeSoal)}
                  className="bg-primary text-white px-3 py-1 rounded-md text-xs"
                >
                  + Tambah Opsi
                </button>
              </div>

              {(currentSoal.opsi || []).map((op, i) => (
                <div
                  key={op.id}
                  className="flex items-start gap-3 mt-2 border rounded-md p-2"
                >
                  <span className="font-medium mt-2">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  <div className="flex flex-col gap-2 w-full">
                    <Editor
                      key={op.id}
                      defaultValue={op.text}
                      onTextChange={(val) =>
                        handleChangeOpsi(activeSoal, i, "text", val)
                      }
                    />
                    <input
                      type="number"
                      className="w-24 border rounded p-1 text-sm"
                      placeholder="Poin"
                      value={op.poin ?? 0}
                      onChange={(e) =>
                        handleChangeOpsi(
                          activeSoal,
                          i,
                          "poin",
                          Number(e.target.value),
                        )
                      }
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveOpsi(activeSoal, i)}
                    className="text-red-500 text-xs mt-2"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>

            {/* Kunci */}
            <div className="flex flex-col gap-1 max-w-sm mt-4">
              <label>Kunci</label>
              <input
                value={currentSoal.kunci}
                onChange={(e) =>
                  handleChangeSoal(activeSoal, "kunci", e.target.value)
                }
                placeholder="Masukkan kunci jawaban"
                className="rounded-md border border-gray-400 p-2 focus:outline-red-500"
              />
            </div>

            {/* Pembahasan */}
            <div className="mt-4">
              <label className="block mb-1 font-medium">Pembahasan</label>
              <Editor
                key={currentSoal.id + "-pembahasan"}
                defaultValue={currentSoal.pembahasan}
                onTextChange={(val) =>
                  handleChangeSoal(activeSoal, "pembahasan", val)
                }
              />
            </div>
          </div>
        ) : (
          <p className="text-gray-500 italic">Belum ada soal ditambahkan.</p>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Simpan
          </button>
        </div>
      </div>

      {/* ── (5) Modal Import Excel (versi Tryout — tanpa Sub Materi) ── */}
      {showImport && (
        <ImportSoalModalTO
          onClose={() => setShowImport(false)}
          onImport={handleImportSoal}
        />
      )}
    </div>
  );
};
