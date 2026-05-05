import { X } from "lucide-react";

export const ModalPreview = ({ latihan, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl p-6 overflow-y-auto max-h-[90vh] relative">
        
        {/* Tombol close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">📖 Preview Latihan Soal</h2>
          <p className="text-sm text-gray-500 mt-2">
            Submateri: <span className="font-medium text-gray-700">{latihan.submateri_name}</span> |{" "}
            Kategori: <span className="font-medium text-gray-700">{latihan.kategori}</span> |{" "}
            Status:{" "}
            <span
              className={`px-2 py-1 rounded-md text-xs font-medium ${
                latihan.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {latihan.status ? "Aktif" : "Tidak Aktif"}
            </span>
          </p>
        </div>

        {/* Daftar soal */}
        <div className="space-y-6">
          {latihan.datasoal.map((soal, idx) => (
            <div
              key={idx}
              className="border border-gray-200 shadow-sm rounded-xl p-5 space-y-4 hover:shadow-md transition"
            >
              {/* Header soal */}
              <h3 className="font-semibold text-lg text-gray-800">
                Soal {idx + 1}
              </h3>

              {/* Pertanyaan */}
              <div>
                <p className="font-medium text-gray-700 mb-1">Pertanyaan:</p>
                <div
                  className="p-3 border rounded-md bg-gray-50 text-gray-800"
                  dangerouslySetInnerHTML={{ __html: soal.pertanyaan }}
                />
              </div>

              {/* Opsi */}
              <div>
                <p className="font-medium text-gray-700 mb-1">Opsi Jawaban:</p>
                <ul className="space-y-2">
                  {soal.opsi.map((opt, i) => {
                    const optionLabel = String.fromCharCode(65 + i);
                    return (
                      <li
                        key={i}
                        className={`flex justify-between items-center p-2 border rounded-md ${
                          opt.poin > 0
                            ? "bg-green-50 border-green-200"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div
                          dangerouslySetInnerHTML={{ __html: `${optionLabel}. ${opt.text}` }}
                        />
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            opt.poin > 0
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {opt.poin} poin
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Kunci */}
              <div>
                <p className="font-medium text-gray-700 mb-1">Kunci:</p>
                <p className="p-2 border rounded-md bg-green-50 text-green-700 font-medium">
                  {soal.kunci}
                </p>
              </div>

              {/* Pembahasan */}
              <div>
                <p className="font-medium text-gray-700 mb-1">Pembahasan:</p>
                <div
                  className="p-3 border rounded-md bg-blue-50 text-gray-800"
                  dangerouslySetInnerHTML={{ __html: soal.pembahasan }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
