import { useEffect, useState } from "react";

export default function HeaderSoalLatihanTO({
  dataSoal,
  setShowEndModal,
  setIsTimeOut,
  currentIndex,
}) {
  const [timeLeft, setTimeLeft] = useState(dataSoal?.waktu * 60 || 1200); // detik
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
  }, [timeLeft]);
  useEffect(() => {
    // Dorong history palsu supaya back bisa dicegat
    window.history.pushState(null, "", window.location.href);

    const handleBack = () => {
      setShowEndModal(true);

      // Dorong lagi supaya tidak benar-benar keluar
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  //  console.log(dataSoal);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white mb-4">
      <div className="md:col-span-3 rounded-lg px-2 py-7 shadow-lg flex flex-col justify-center-center my-auto">
        <p className="text-xs">Tryout</p>
        <h1 className="text-base font-semibold my-1">
          {dataSoal.module_name} - {dataSoal.datasoal[currentIndex].nama_materi}
        </h1>
        {/* <p className="text-xs">
          Subkompetensi: {dataSoal.datasoal[currentIndex].sub_materi}
        </p> */}
      </div>
      <div className="md:col-span-1 p-4 rounded-lg shadow-lg">
        <p className="text-xs font-semibold text-gray-500 mb-2 text-center">
          Sisa Waktu
        </p>
        <div className="flex justify-center gap-2">
          {[
            { val: h, label: "Jam" },
            { val: m, label: "Menit" },
            { val: s, label: "Detik" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-red-700 text-white w-14 h-12 rounded-md flex flex-col items-center justify-center text-xs"
            >
              <span className="text-lg font-bold leading-none">{item.val}</span>
              <span className="mt-1">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
