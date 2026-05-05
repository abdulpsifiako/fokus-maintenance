import { X } from "lucide-react";

export default function ModalDeleteTestimoni({ isOpen, onClose, onConfirm, nama }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 font-poppins">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md relative">
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        {/* Judul */}
        <h2 className="text-lg font-semibold text-primary mb-2">
          Hapus Testimoni
        </h2>

        {/* Pesan */}
        <p className="text-sm text-gray-600 mb-5">
          Apakah kamu yakin ingin menghapus testimoni{" "}
          <span className="font-semibold text-gray-800">{nama}</span>?  
          Aksi ini tidak dapat dibatalkan.
        </p>

        {/* Tombol Aksi */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="border border-gray-400 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
