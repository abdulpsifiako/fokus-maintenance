import { useSearchParams } from "next/navigation";
import ModalAkhiriUjian from "./modalAkhiriUjian";
import StatusLegend from "./statusLegend";
import { useCallback, useEffect, useState } from "react";
import { getPembahasan, getPembahasanById } from "@/lib/axios/programUtama";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export default function ContentPembahasan() {
  const router = useRouter();
  const token = Cookies.get("token");
  const searchParams = useSearchParams();
  const programId = searchParams.get("program_id");
  const title = searchParams.get("title");
  const jenis = searchParams.get("jenis");
  const id = searchParams.get("id");
  const module_name = searchParams.get("module_name");

  const [data, setData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchDataAnswer = useCallback(async () => {
    try {
      let res;
      if (id) {
        res = await getPembahasanById({ answer_id: id }, token);
      } else {
        res = await getPembahasan(
          { program_id: programId, jenis, title, module_name },
          token,
        );
      }
      setData(res.data);
    } catch (error) {
      //  //  console.log(error);
    }
  }, [programId, jenis, token, title, id, module_name]);

  useEffect(() => {
    fetchDataAnswer();
  }, [fetchDataAnswer]);

  if (!data)
    return (
      <p className="h-screen max-w-[1440px] flex items-center justify-center m-auto">
        Belum mengerjakan latihan
      </p>
    );

  const soalList = data.properties.data_soal?.datasoal || [];
  const jawabanList = data.properties.data_answer || [];
  const totalQuestions = soalList.length;
  const currentSoal = soalList[currentIndex];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-5">
      {/* ===================== BAGIAN SOAL DAN PEMBAHASAN ===================== */}
      <div className="md:col-span-3 bg-white rounded-2xl shadow-lg p-6 space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="font-semibold text-red-700 text-sm">
            Soal No {currentIndex + 1}
          </p>
          <div className="flex gap-2">{/* bisa isi tombol tambahan */}</div>
        </div>

        {/* Informasi Soal */}
        <div className="border-y py-2 space-y-1">
          <p className="text-xs font-semibold text-red-700">
            {data.properties.data_soal.module_name} -{" "}
            {data.properties.data_soal.title}
          </p>
          <p className="text-[11px] text-gray-500 leading-tight">
            Subkompetensi:{" "}
            {currentSoal.submateri == "" ? "Umum" : currentSoal.submateri}
          </p>
        </div>

        <div className="border-b py-2 text-center">
          <p className="text-xs text-gray-600">
            ⏱ Waktu Pengerjaan:{" "}
            <span className="font-semibold">
              {jawabanList[currentIndex]?.timeSpent || 0} Detik
            </span>
          </p>
        </div>

        {/* Pertanyaan */}
        <div
          className="text-md text-gray-800 leading-relaxed text-justify"
          dangerouslySetInnerHTML={{ __html: currentSoal?.pertanyaan }}
        />

        {/* Opsi Jawaban */}
        <div className="space-y-3 mt-2">
          {currentSoal?.opsi?.map((opt, i) => {
            const label = String.fromCharCode(65 + i); // A, B, C, D
            const maxPoin = Math.max(
              ...currentSoal.opsi.map((o) => o?.poin ?? 0),
            );
            const isCorrect = opt.poin === maxPoin;
            const userAnswerIndex = jawabanList[currentIndex]?.option;
            const isUserAnswer = userAnswerIndex === i;

            let bgClass =
              "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50";
            let icon = "";

            if (userAnswerIndex === undefined) {
              if (isCorrect) {
                bgClass = "border-blue-600 bg-blue-50";
                icon = "✓";
              }
            } else if (isUserAnswer && isCorrect) {
              bgClass = "bg-blue-600 text-white border-blue-600";
              icon = "✓";
            } else if (isUserAnswer && !isCorrect) {
              bgClass = "bg-red-600 text-white border-red-600";
              icon = "×";
            } else if (!isUserAnswer && isCorrect) {
              bgClass = "bg-blue-600 text-white border-blue-600";
              icon = "✓";
            }

            return (
              <div
                key={i}
                className={`flex items-center justify-between gap-3 p-2 rounded-xl shadow-sm transition-all ${bgClass}`}
              >
                {/* Opsi */}
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-white/30">
                    {icon}
                  </div>
                  <span className="font-semibold">{label}.</span>
                  <span
                    className="flex-1 text-xs"
                    dangerouslySetInnerHTML={{ __html: opt.text }}
                  />
                </div>

                {/* Poin */}
                <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  Poin: {opt.poin ?? 0}
                </span>
              </div>
            );
          })}
        </div>

        {/* Pembahasan */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-4">
          <p className="font-bold text-md mb-2 text-gray-800">Pembahasan</p>
          <div
            className="text-sm text-gray-700 leading-relaxed text-justify"
            dangerouslySetInnerHTML={{ __html: currentSoal?.pembahasan }}
          />
        </div>

        {/* Navigasi Soal */}
        <div className="flex justify-between mt-6">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => i - 1)}
            className="bg-red-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-800 disabled:opacity-50 transition"
          >
            &lt; Sebelumnya
          </button>
          <button
            disabled={currentIndex === totalQuestions - 1}
            onClick={() => setCurrentIndex((i) => i + 1)}
            className="bg-red-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-800 disabled:opacity-50 transition"
          >
            Selanjutnya &gt;
          </button>
        </div>
      </div>

      {/* ===================== NAVIGASI DAFTAR SOAL ===================== */}
      <div className="bg-white p-5 rounded-2xl shadow-lg flex flex-col h-fit md:h-full max-h-[520px]">
        <p className="text-sm font-bold text-gray-800 mb-3">Daftar Soal</p>

        <div
          className="flex flex-wrap gap-2 text-xs overflow-y-auto pr-1 flex-1
  content-start"
        >
          {" "}
          {/* ✅ tambah content-start */}
          {soalList.map((_, i) => {
            const num = i + 1;
            const isActive = i === currentIndex;

            return (
              <div
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-9 h-9 flex items-center justify-center
          rounded-lg font-semibold cursor-pointer transition-all text-xs
          ${
            isActive
              ? "bg-red-700 text-white scale-105 shadow"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
              >
                {num}
              </div>
            );
          })}
        </div>

        <button
          onClick={() => router.push(`/detail/${programId}`)}
          className="mt-4 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
        >
          Akhiri Pembahasan
        </button>
      </div>
    </div>
  );
}
