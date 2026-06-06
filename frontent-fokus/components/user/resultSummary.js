import { useRouter } from "next/router";
import { useState } from "react";
import LoadingModal from "../public/loadingModal";

export default function ResultSummary({ dataSoal, skor }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  return (
    <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 flex flex-col items-start space-y-5 border border-gray-100">
      {/* Header */}
      <div className="text-center w-full">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-1">
          Terima Kasih atas Partisipasi Anda 🎉
        </h2>
        <p className="text-sm text-gray-500">
          Berikut adalah hasil yang telah Anda kerjakan
        </p>
      </div>

      {/* Informasi Soal */}
      <div className="w-full text-sm text-gray-700 space-y-3">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-600">Program Utama</span>
          <span className="text-gray-900 font-semibold">
            {dataSoal.module_name}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-600">Materi</span>
          <span className="text-gray-900 font-semibold">{dataSoal.title}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-600">Skor</span>
          <span className="font-semibold">
            <span className="text-red-600">{skor}</span>
            <span className="text-gray-500"> / {dataSoal.maxPoin}</span>
          </span>
        </div>

        <hr className="my-2 border-gray-200" />

        <div className="flex justify-between items-center font-medium">
          <span>Total Poin</span>
          <span className="font-semibold text-gray-900">{skor}</span>
        </div>

        <div className="flex justify-between items-center font-medium">
          <span>Minimal Poin Lulus</span>
          <span className="font-semibold text-gray-900">
            {dataSoal.minPoin}
          </span>
        </div>

        <div className="flex justify-between items-center font-medium">
          <span>Keterangan</span>
          <span
            className={`font-bold ${
              Number(skor) >= Number(dataSoal.minPoin)
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {Number(skor) >= Number(dataSoal.minPoin) ? "Lulus" : "Tidak Lulus"}
          </span>
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="w-full flex justify-center">
        <button
          onClick={async () => {
            setLoading(true); // tampilkan loading sebelum pindah halaman
            await new Promise((resolve) => setTimeout(resolve, 2000));
            // router.push({
            //   pathname: "/pembahasan",
            //   query: {
            //     program_id: dataSoal.program_id,
            //     jenis: dataSoal.jenis,
            //     title: dataSoal.title,
            //     module_name: dataSoal.module_name,
            //   },
            // });
            router.push(`/summary-latihan?id=${dataSoal.program_id}`);
          }}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white cursor-pointer py-2 px-5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Lihat Selengkapnya
        </button>
      </div>
      <LoadingModal show={loading} />
    </div>
  );
}
