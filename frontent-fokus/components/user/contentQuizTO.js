import { useSelector } from "react-redux";
import ModalAkhiriUjian from "./modalAkhiriUjian";
import { useEffect, useState } from "react";
import ModalLaporkanSoal from "./laporkanSoal";
import ModalAkhiriUjianTO from "./modalAkhiriUjianTO";

export default function ContentQuizTO({
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
  //  //  console.log(dataSoal)
  const currentSoal = dataSoal?.datasoal?.[currentIndex];
  //  //  console.log(currentSoal)

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
        nama_materi: currentSoal.nama_materi,
        passing_grade: currentSoal.passing_grade,
        sub_materi: currentSoal.sub_materi,
      },
    }));

    if (!answered.includes(num)) {
      setAnswered([...answered, num]);
    }
  };

  const handleMark = () => {
    const num = currentIndex;
    setMarked((prev) =>
      prev.includes(num) ? prev.filter((x) => x !== num) : [...prev, num]
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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Soal */}
        <div className="md:col-span-3 bg-white p-4 rounded-lg shadow-xl">
          <div className="flex justify-between">
            <p className="font-bold text-sm text-red-700 mb-2">
              Soal No. {currentIndex + 1}
            </p>

            <div className="flex gap-2 mb-3">
              <button
                onClick={handleMark}
                className="text-xs bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-2 rounded"
              >
                Tandai
              </button>
              <button
                onClick={() => setShowReportModal(true)}
                className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded"
              >
                Laporkan Soal
              </button>
            </div>
          </div>

          {/* Pertanyaan */}
          <div
            className="text-sm my-4 p-4 text-justify"
            dangerouslySetInnerHTML={{
              __html: currentSoal?.pertanyaan || "Tidak ada pertanyaan",
            }}
          />

          {/* Opsi */}
          <div className="space-y-3 p-4">
            {(currentSoal?.opsi?.length > 0 ? currentSoal.opsi : []).map(
              (opt, i) => {
                const label = String.fromCharCode(65 + i);
                const num = currentIndex;
                return (
                  <label
                    key={i}
                    className="flex items-center gap-2 border border-gray-300 p-3 rounded cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`answer-${num}`}
                      checked={answers[num]?.option === i}
                      onChange={() => handleAnswer(num, i)}
                    />
                    <span className="font-semibold">{label}.</span>
                    <span
                      className="text-xs"
                      dangerouslySetInnerHTML={{ __html: opt.text }}
                    />
                  </label>
                );
              }
            )}
          </div>

          <div className="flex justify-between mt-5">
            <button
              disabled={currentIndex === 0}
              onClick={handlePrev}
              className="bg-red-700 text-white text-sm px-4 py-2 rounded disabled:opacity-50"
            >
              &lt; Sebelumnya
            </button>
            <button
              disabled={currentIndex === totalQuestions - 1}
              onClick={handleNext}
              className="bg-red-700 text-white text-sm px-4 py-2 rounded disabled:opacity-50"
            >
              Selanjutnya &gt;
            </button>
          </div>
        </div>

        {/* Navigasi */}
        <div className="bg-white p-4 rounded-lg shadow-xl flex flex-col h-full max-h-[500px] justify-between">
          <div>
            <p className="text-sm font-bold mb-3">Daftar Soal</p>
            <div className="text-xs pr-1 flex flex-row flex-wrap gap-2 items-start">
              {Array.from({ length: totalQuestions }).map((_, i) => {
                const num = i;
                const isAnswered = answered.includes(num);
                const isMarked = marked.includes(num);

                const base =
                  "w-8 h-8 flex items-center justify-center rounded font-medium cursor-pointer";
                const styles = isMarked
                  ? "bg-yellow-400 text-white"
                  : isAnswered
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-black";

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

          <div className="pt-4">
            <button
              onClick={() => setShowEndModal(true)}
              className="bg-blue-600 text-white w-full py-2 rounded text-sm font-semibold"
            >
              Akhiri Ujian
            </button>
          </div>
        </div>
      </div>

      {showEndModal && (
        <ModalAkhiriUjianTO
          answerUser={answers}
          setShowEndModal={setShowEndModal}
          dataSoal={dataSoal}
          answered={answered}
          isTimeOut={isTimeOut}
        />
      )}
      {showReportModal && (
        <ModalLaporkanSoal
          dataSoal={dataSoal}
          show={showReportModal}
          setShow={setShowReportModal}
          soalId={currentSoal?.id}
          nomorSoal={currentIndex + 1}
        />
      )}
    </div>
  );
}
