import { useEffect, useState } from "react";

export default function HeaderSoalLatihan({
  dataSoal,
  setShowEndModal,
  setIsTimeOut,
  currentIndex,
}) {
  const [timeLeft, setTimeLeft] = useState(dataSoal?.waktu * 60 || 1200);

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return { h, m, s };
  };

  const { h, m, s } = formatTime(timeLeft);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsTimeOut(true);
      setShowEndModal(true);
      return;
    }
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft, setIsTimeOut, setShowEndModal]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 mb-6">
      {/* LEFT */}
      <div className="md:col-span-3 flex flex-col justify-center px-1 md:px-2">
        <p
          className="
      text-[11px] md:text-xs
      font-semibold
      text-gray-400
      uppercase
      tracking-[0.2em]
      mb-2
    "
        >
          Latihan
        </p>

        <h1
          className="
      text-lg md:text-2xl
      font-semibold
      text-gray-900
      leading-snug
    "
        >
          {dataSoal.module_name}
          <span className="text-gray-400 font-medium"> — {dataSoal.title}</span>
        </h1>

        {/* <p
          className="
      mt-2
      text-sm md:text-base
      text-gray-600
      leading-relaxed
    "
        >
          <span className="text-gray-400 font-medium">Subkompetensi:</span>{" "}
          <span className="font-medium text-gray-700">
            {dataSoal?.datasoal[currentIndex].submateri || "Umum"}
          </span>
        </p> */}
      </div>

      {/* RIGHT */}
      <div className="md:col-span-1 flex flex-col items-center justify-center rounded-xl bg-gray-50 p-4">
        <p
          className="
      text-[11px]
      font-semibold
      text-gray-400
      uppercase
      tracking-[0.2em]
      mb-3
      text-center
    "
        >
          Sisa Waktu
        </p>

        <div className="flex gap-3">
          {[
            { val: h, label: "Jam" },
            { val: m, label: "Menit" },
            { val: s, label: "Detik" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="
            w-14 h-16
            rounded-xl
            bg-primary
            border border-gray-200
            flex flex-col items-center justify-center
            shadow-xs
          "
            >
              <span
                className="
            text-xl
            font-bold
            text-white
            tabular-nums
            leading-none
          "
              >
                {item.val}
              </span>
              <span
                className="
            mt-1
            text-[10px]
            font-medium
            text-white
            uppercase
            tracking-wider
          "
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
