import Image from "next/image";
import { FaCalendarAlt, FaClock, FaUsers } from "react-icons/fa";

const CardKelasZoom = ({ title, date, time, status, password, modulLink, countdown }) => {
  return (
    <div className="border rounded-md shadow-sm p-4 w-full max-w-sm">
      {/* Header */}
      <div className="bg-red-100 rounded-md p-3 text-right">
        <Image src="/kelas.png" alt="zoom" width={1000} height={1000} />
      </div>

      {/* Content */}
      <div className="mt-4 text-sm">
        <h4 className="font-bold text-xs text-red-700 mb-1">
          KELAS ONLINE ZOOM SKD 2025 PART 1
        </h4>
        <p>Kelas pertama part 1</p>
        <div className="flex items-center text-xs text-gray-600 mt-1 gap-1">
          <FaCalendarAlt />
          <span>{date}</span>
        </div>
        <div className="flex items-center text-xs text-gray-600 mt-1 gap-1">
          <FaClock />
          <span>{time}</span>
        </div>

        <button className="bg-red-700 text-white text-xs mt-3 px-3 py-1 rounded flex items-center gap-2">
          <FaUsers /> Join Grup Belajar
        </button>

        <p className="mt-2 text-xs">
          <span className="font-semibold">Password Modul:</span> {password}
        </p>
        <a href={modulLink} className="text-blue-600 text-xs underline">
          Download Modul Materi
        </a>

        <p className="text-xs text-gray-500 mt-2">
          Rekaman kelas akan tersedia setelah live class berakhir!
        </p>
      </div>

      {/* Status Button */}
      <div className="mt-4">
        {status === "rekaman" && (
          <button className="w-full bg-red-700 text-white text-sm py-2 rounded">
            Rekaman Kelas
          </button>
        )}
        {status === "masuk" && (
          <button className="w-full bg-red-700 text-white text-sm py-2 rounded">
            Masuk Kelas
          </button>
        )}
        {status === "countdown" && (
          <div className="bg-red-100 text-center py-2 rounded text-red-700 font-semibold text-sm">
            {countdown}
          </div>
        )}
        {status === "info" && (
          <div className="bg-red-100 text-center py-2 rounded text-red-700 font-semibold text-sm">
            3 Hari Lagi
          </div>
        )}
      </div>
    </div>
  );
};

export default CardKelasZoom;
