import { useRouter } from "next/router";
import { useState } from "react";
import LoadingModal from "../public/loadingModal"; // pastikan path benar

export default function ModalKerjakan({ dataRapor }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLatihan = async () => {
    try {
      setLoading(true); // tampilkan modal loading
      await new Promise((resolve) => setTimeout(resolve, 2000)); // delay agar terlihat halus
      router.push("/latihan-soal");
    } finally {
      setLoading(false);
    }
  };

  //  //  console.log("INI RAPOR", dataRapor);

  return (
    <>
      {/* Tombol utama */}
      <button
        onClick={() => setOpen(true)}
        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md font-poppins my-3 text-xs md:text-sm transition-all"
      >
        {dataRapor &&
          (dataRapor.length > 0 ? "Ulangi Latihan" : "Kerjakan Latihan")}
      </button>

      {/* Modal konfirmasi */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center font-poppins bg-black/40 backdrop-blur-sm px-3">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 space-y-4 animate-fadeIn">
            <h2 className="text-lg font-semibold text-center text-gray-800">
              Harap Dibaca Terlebih Dahulu
            </h2>

            <ul className="text-sm list-decimal list-outside pl-5 text-gray-700 space-y-2 text-justify leading-relaxed">
              <li>
                Gunakan browser seperti <b>Google Chrome</b> untuk hasil
                terbaik.
              </li>
              <li>
                Setelah Anda memulai latihan,{" "}
                <b>waktu akan langsung berjalan</b> dan tidak dapat dijeda.
              </li>
              <li>
                Jika waktu habis, jawaban Anda akan dikirim secara otomatis.
              </li>
            </ul>

            <div className="flex justify-end gap-3 pt-3">
              <button
                onClick={() => setOpen(false)}
                className="border border-red-500 text-red-600 px-4 py-1.5 rounded-md hover:bg-red-50 text-sm font-medium transition"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  handleLatihan();
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition"
              >
                Mulai Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      <LoadingModal show={loading} />

      {/* Animasi lembut */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}
