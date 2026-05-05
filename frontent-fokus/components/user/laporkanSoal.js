import { laporkanSoal } from "@/lib/axios/programUtama";
import { useState } from "react";

import Cookies from "js-cookie";

export default function ModalLaporkanSoal({
  show,
  setShow,
  soalId,
  nomorSoal,
  dataSoal,
}) {
  const token = Cookies.get("token");
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (!reason.trim()) {
      alert("Alasan laporan tidak boleh kosong!");
      return;
    }

    // Kirim data laporan (contoh pakai console.log, ganti dengan API request)
    //  //  console.log({
    //   soalId,
    //   nomorSoal,
    //   reason,
    // });

    alert("Laporan berhasil dikirim. Terima kasih!");
    setReason("");
    setShow(false);
  };
  if (!show) return null;
  const handleLaporkanSoal = async () => {
    try {
      const res = await laporkanSoal(
        {
          data_soal: {
            jenis: dataSoal.jenis,
            module_name: dataSoal.module_name,
            program_utama: dataSoal.program_utama,
            title: dataSoal.title,
            jenis_program: dataSoal.jenis_program,
            nomor_soal: nomorSoal,
          },
          alasan: reason,
        },
        token
      );
      if (res.status == 200) setShow(false);
    } catch (error) {
      setShow(false);
      // //  //  console.log(error)
    }
  };
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md transform transition-all animate-scaleIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Laporkan Soal <span className="text-red-600">No. {nomorSoal}</span>
          </h2>
          <button
            onClick={() => setShow(false)}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            ✕
          </button>
        </div>

        {/* Textarea */}
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Tuliskan alasan laporan soal ini..."
          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-300 focus:border-red-400 outline-none transition"
          rows={4}
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setShow(false)}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 transition"
          >
            Batal
          </button>
          <button
            onClick={handleLaporkanSoal}
            className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-sm transition"
          >
            Kirim Laporan
          </button>
        </div>
      </div>

      {/* Animasi sederhana */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
