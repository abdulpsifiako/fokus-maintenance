import { useEffect, useState, useRef } from "react";
import Image from "next/image";

export default function TransaksiDiprosesModal({ onClose }) {
  const MAX_MINUTES = 2; // ⏱ maksimal 3 menit
  const [timeLeft, setTimeLeft] = useState(MAX_MINUTES * 60);
  const hasClosed = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!hasClosed.current) {
            hasClosed.current = true;
            onClose();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onClose]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-8 max-w-md w-full text-center shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Transaksi Diproses
        </h2>

        <div className="flex justify-center mb-4">
          <Image
            src="/TO.png"
            alt="Transaksi Diproses"
            width={250}
            height={250}
            className="object-contain"
          />
        </div>

        <p className="text-sm text-gray-700 mb-6">
          Mohon menunggu, proses ini membutuhkan waktu {MAX_MINUTES} menit dan
          jangan tinggalkan halaman ini. Apabila setelah {MAX_MINUTES} menit try
          out tidak muncul, silakan hubungi admin.
        </p>

        <div className="bg-red-700 text-white font-semibold py-2 px-6 rounded-full inline-block">
          Tunggu {formatTime(timeLeft)}
        </div>
      </div>
    </div>
  );
}
