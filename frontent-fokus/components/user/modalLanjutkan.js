import { X } from "lucide-react";
import Cookies from 'js-cookie'
export default function ModalLanjutkan({ open, onClose, onConfirm }) {
  const token = Cookies.get("token")
  
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white rounded-xl border border-gray-300  shadow-lg w-80 p-5 relative animate-fadeIn">
        {/* Tombol close */}
        <button
          type="button"
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold text-gray-800 text-center mb-3">
          Lanjutkan?
        </h2>
        {/* <p className="text-sm text-gray-600 text-center mb-5">
          Apakah kamu yakin ingin melanjutkan proses ini?
        </p> */}

        <div className="flex justify-center gap-3">
          <button
            onClick={onConfirm}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Ya
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Tidak
          </button>
        </div>
      </div>
    </div>
  );
}
