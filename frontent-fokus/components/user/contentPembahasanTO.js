import { useSearchParams } from "next/navigation";
import ModalAkhiriUjian from "./modalAkhiriUjian";
import StatusLegend from "./statusLegend";
import { useCallback, useEffect, useState } from "react";
import { getPembahasan, getPembahasanById } from "@/lib/axios/programUtama";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export default function ContentPembahasanTO() {
  const router = useRouter();
  const token = Cookies.get("token");
  const searchParams = useSearchParams();
  const programId = searchParams.get("program_id");
  const title = searchParams.get("title");
  const jenis = searchParams.get("jenis");
  const id = searchParams.get("id");

  const [data, setData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchDataAnswer = useCallback(async () => {
    try {
      let res;
      if (id) {
        res = await getPembahasanById({ answer_id: id }, token);
      } else {
        res = await getPembahasan(
          { program_id: programId, jenis, title, module_name: title },
          token
        );
      }
      setData(res.data);
    } catch (error) {
      // //  //  console.log(error);
    }
  }, [programId, jenis, token, title, id]);

  useEffect(() => {
    fetchDataAnswer();
  }, [fetchDataAnswer]);

  if (!data) return <p>Belum mengerjakan tryout</p>;
  const soalList = data.properties.data_soal?.datasoal || [];
  const jawabanList = data.properties.data_answer || [];
  const totalQuestions = soalList.length;
  const currentSoal = soalList[currentIndex];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Soal dan Pembahasan */}
      <div className="md:col-span-3 bg-white p-4 rounded-lg shadow-xl space-y-4">
        {/* Header Soal */}
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <p className="font-bold text-sm text-red-700 mb-1">
            Soal No. {currentIndex + 1}
          </p>
          <div className="flex gap-2 mt-2 sm:mt-0"></div>
        </div>

        {/* Info tambahan */}
        <div className="w-full border-t border-b py-3">
          <p className="text-xs text-red-700 font-semibold">
            {data.properties.data_soal.module_name} - {currentSoal.nama_materi}
          </p>
          <p className="text-[10px] text-gray-500">
            Subkompetensi: {currentSoal.sub_materi}
          </p>
        </div>
        <div className="w-full border-b pt-0 pb-3 font-light">
          <p className="text-xs text-center">
            Waktu Pengerjaan {jawabanList[currentIndex]?.timeSpent || 0} Detik
          </p>
        </div>

        {/* Pertanyaan */}
        <div
          className="text-sm text-justify"
          dangerouslySetInnerHTML={{ __html: currentSoal?.pertanyaan }}
        />

        {/* Opsi Jawaban */}
        <div className="space-y-3">
          {currentSoal?.opsi?.map((opt, i) => {
            const label = String.fromCharCode(65 + i); // A, B, C, D

            // cari poin tertinggi (jawaban benar)
            const maxPoin = Math.max(
              ...currentSoal.opsi.map((o) => o?.poin ?? 0)
            );
            const isCorrect = opt.poin === maxPoin;

            // ambil jawaban user
            const userAnswerIndex = jawabanList[currentIndex]?.option;
            const isUserAnswer = userAnswerIndex === i;

            // kondisi
            let bgClass = "border border-gray-300 bg-white text-gray-700";
            let icon = "";

            if (userAnswerIndex === undefined) {
              // case 3: user tidak jawab → hanya kunci ditandai
              if (isCorrect) {
                bgClass = "border border-blue-600";
                icon = "✓";
              }
            } else if (isUserAnswer && isCorrect) {
              // case 1: user jawab benar
              bgClass = "bg-blue-500 text-white border-blue-600";
              icon = "✓";
            } else if (isUserAnswer && !isCorrect) {
              // case 2: user jawab salah
              bgClass = "bg-red-500 text-white border-red-600";
              icon = "×";
            } else if (!isUserAnswer && isCorrect) {
              // tetap highlight jawaban benar
              bgClass = "bg-blue-500 text-white border-blue-600";
              icon = "✓";
            }

            return (
              <div
                key={i}
                className={`flex items-center justify-between gap-3 p-4 rounded-lg shadow-sm transition ${bgClass}`}
              >
                {/* Kiri: status + opsi */}
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs bg-white/30">
                    {icon}
                  </div>

                  <span className="font-semibold">{label}.</span>
                  <span
                    className="flex-1"
                    dangerouslySetInnerHTML={{ __html: opt.text }}
                  />
                </div>

                {/* Kanan: poin */}
                <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded items-center my-auto">
                  Poin: {opt.poin ?? 0}
                </span>
              </div>
            );
          })}
        </div>

        {/* Pembahasan */}
        <div className="text-sm rounded p-4">
          <p className="font-bold mb-2">Pembahasan</p>
          <p
            className="text-justify"
            dangerouslySetInnerHTML={{ __html: currentSoal?.pembahasan }}
          />
        </div>

        {/* Navigasi Soal */}
        <div className="flex justify-between mt-5">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => i - 1)}
            className="bg-red-700 text-white text-sm px-4 py-2 rounded disabled:opacity-50"
          >
            &lt; Sebelumnya
          </button>
          <button
            disabled={currentIndex === totalQuestions - 1}
            onClick={() => setCurrentIndex((i) => i + 1)}
            className="bg-red-700 text-white text-sm px-4 py-2 rounded disabled:opacity-50"
          >
            Selanjutnya &gt;
          </button>
        </div>
      </div>

      {/* Navigasi Daftar Soal */}
      <div className="bg-white p-4 rounded-lg shadow-xl flex flex-col h-full max-h-[500px]">
        <p className="text-sm font-bold mb-3">Daftar Soal</p>
        {/* <StatusLegend /> */}
        <div className="flex flex-wrap gap-2 text-xs pr-1 overflow-y-auto flex-1">
          {soalList.map((_, i) => {
            const num = i + 1;

            const base =
              "w-8 h-8 flex items-center justify-center rounded-lg font-medium cursor-pointer";
            const styles =
              i === currentIndex
                ? "bg-red-700 text-white"
                : "bg-gray-300 text-black";

            return (
              <div
                key={num}
                className={`${base} ${styles}`}
                onClick={() => setCurrentIndex(i)}
              >
                {num}
              </div>
            );
          })}
        </div>

        {/* Tombol Akhiri Pembahasan */}
        <button
          onClick={() => router.push(`/detail-to/summary?id=${programId}`)} // ganti "/" ke halaman yang kamu mau
          className="mt-3 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
        >
          Akhiri Pembahasan
        </button>
      </div>
    </div>
  );
}
