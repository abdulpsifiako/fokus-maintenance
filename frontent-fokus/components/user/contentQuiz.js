import { useSelector } from "react-redux";
import ModalAkhiriUjian from "./modalAkhiriUjian";
import { useEffect, useState } from "react";
import ModalLaporkanSoal from "./laporkanSoal";
import useExitWarning from "@/pages/hooks/useExitWarning";
import ModalKeluarUjian from "./modalKeluarUjian";

export default function ContentQuiz({
  dataSoal,
  showEndModal,
  setShowEndModal,
  isTimeOut,
  currentIndex,
  setCurrentIndex,
}) {
  const totalQuestions = dataSoal?.questions || 0;

  const [answered, setAnswered] = useState([]);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState([]);
  const [startTime, setStartTime] = useState(Date.now());

  const currentSoal = dataSoal?.datasoal?.[currentIndex];

  const [showReportModal, setShowReportModal] = useState(false);
  // Reset waktu setiap pindah soal
  useEffect(() => {
    setStartTime(Date.now());
  }, [currentIndex]);

  // Menyimpan jawaban + lama waktu
  const handleAnswer = (num, optionId) => {
    const endTime = Date.now();
    const timeSpent = Math.floor((endTime - startTime) / 1000); // dalam detik

    setAnswers((prev) => ({
      ...prev,
      [num]: {
        option: optionId,
        timeSpent: (prev[num]?.timeSpent || 0) + timeSpent, // akumulasi waktu kalau bolak balik
      },
    }));

    if (!answered.includes(num)) {
      setAnswered([...answered, num]);
    }
  };

  const handleMark = () => {
    const num = currentIndex;
    setMarked((prev) =>
      prev.includes(num) ? prev.filter((x) => x !== num) : [...prev, num],
    );
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const { showModal, handleStay, handleLeave } = useExitWarning(true);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Bagian Soal */}
        <div className="md:col-span-3 bg-white rounded-2xl shadow-lg p-6">
          {/* Header Soal */}
          <div className="flex justify-between items-center mb-4">
            <p className="font-semibold text-md text-red-700">
              Soal No {currentIndex + 1}
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleMark}
                className="text-xs font-medium bg-orange-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg transition-all"
              >
                Tandai
              </button>
              <button
                onClick={() => setShowReportModal(true)}
                className="text-xs font-medium bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all"
              >
                Laporkan Soal
              </button>
            </div>
          </div>

          {/* Pertanyaan */}
          <div
            className="text-md leading-relaxed text-gray-800 text-justify py-5 rounded-lg mb-4 p-1"
            dangerouslySetInnerHTML={{
              __html: currentSoal?.pertanyaan || "Tidak ada pertanyaan",
            }}
          />

          {/* Opsi Jawaban */}
          <div className="space-y-3">
            {(currentSoal?.opsi || []).map((opt, i) => {
              const label = String.fromCharCode(65 + i);
              const num = currentIndex;
              const isSelected = answers[num]?.option === i;

              return (
                <label
                  key={i}
                  className={`flex items-center gap-1 border rounded-lg px-2 py-3 cursor-pointer transition-all ${
                    isSelected
                      ? "bg-blue-50 border-blue-500"
                      : "bg-white hover:bg-gray-50 border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name={`answer-${num}`}
                    checked={isSelected}
                    onChange={() => handleAnswer(num, i)}
                    className="accent-blue-600 hidden"
                  />
                  <span className="font-semibold">{label}.</span>
                  <span
                    className="text-sm text-gray-700"
                    dangerouslySetInnerHTML={{ __html: opt.text }}
                  />
                </label>
              );
            })}
          </div>

          {/* Navigasi Soal */}
          <div className="flex justify-between mt-6">
            <button
              disabled={currentIndex === 0}
              onClick={handlePrev}
              className="bg-red-700 hover:bg-red-800 text-white text-sm px-5 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              &lt; Sebelumnya
            </button>
            <button
              disabled={currentIndex === totalQuestions - 1}
              onClick={handleNext}
              className="bg-red-700 hover:bg-red-800 text-white text-sm px-5 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Selanjutnya &gt;
            </button>
          </div>
        </div>

        {/* Sidebar Navigasi */}
        <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col h-full max-h-[520px] justify-between">
          <div>
            <p className="text-sm font-bold text-gray-700 mb-3">Daftar Soal</p>
            <div className="flex flex-wrap gap-2 text-xs">
              {Array.from({ length: totalQuestions }).map((_, i) => {
                const num = i;
                const isAnswered = answered.includes(num);
                const isMarked = marked.includes(num);

                const base =
                  "w-9 h-9 flex items-center shadow justify-center rounded-lg font-semibold cursor-pointer transition-all";
                const styles = isMarked
                  ? "bg-orange-400 text-white shadow-md hover:bg-orange-500"
                  : isAnswered
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-800 hover:bg-gray-400";

                return (
                  <div
                    key={num}
                    className={`${base} ${styles}`}
                    onClick={() => setCurrentIndex(i)}
                  >
                    {num + 1}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tombol Akhiri Ujian */}
          <div className="pt-5 border-t mt-4">
            <button
              onClick={() => setShowEndModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2.5 rounded-lg text-sm font-semibold transition-all"
            >
              Akhiri Ujian
            </button>
          </div>
        </div>
      </div>

      {/* Modal Akhiri Ujian */}
      {showEndModal && (
        <ModalAkhiriUjian
          answerUser={answers}
          setShowEndModal={setShowEndModal}
          dataSoal={dataSoal}
          answered={answered}
          isTimeOut={isTimeOut}
        />
      )}

      {/* Modal Laporkan Soal */}
      {showReportModal && (
        <ModalLaporkanSoal
          dataSoal={dataSoal}
          show={showReportModal}
          setShow={setShowReportModal}
          soalId={currentSoal?.id}
          nomorSoal={currentIndex + 1}
        />
      )}
      {showModal && (
        <ModalKeluarUjian onStay={handleStay} onLeave={handleLeave} />
      )}
    </div>
  );
}
