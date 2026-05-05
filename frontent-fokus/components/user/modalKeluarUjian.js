export default function ModalKeluarUjian({ onStay, onLeave }) {
  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center
      justify-center bg-black/50 backdrop-blur-sm px-4"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-6
        w-full max-w-sm animate-[fade-in_0.2s_ease]"
      >
        {/* Icon */}
        <div
          className="w-14 h-14 rounded-full bg-red-50
          flex items-center justify-center mx-auto mb-4"
        >
          <svg
            className="w-7 h-7 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 
              18a2 2 0 001.71 3h16.94a2 2 0 
              001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
          </svg>
        </div>

        {/* Teks */}
        <h2
          className="text-base font-bold text-gray-800
          text-center mb-2"
        >
          Yakin ingin keluar?
        </h2>
        <p
          className="text-sm text-gray-500 text-center
          leading-relaxed mb-6"
        >
          Ujian masih berlangsung. Jika keluar sekarang dan sebelumnya tidak
          menekan Kirim Jawaban maka progres jawabanmu tidak akan tersimpan.
        </p>

        {/* Tombol */}
        <div className="flex gap-3">
          <button
            onClick={onStay}
            className="flex-1 py-2.5 rounded-xl border
              border-gray-200 text-sm font-medium
              text-gray-700 hover:bg-gray-50 transition-all"
          >
            Tetap di sini
          </button>
          <button
            onClick={onLeave}
            className="flex-1 py-2.5 rounded-xl bg-red-500
              hover:bg-red-600 text-white text-sm
              font-semibold transition-all"
          >
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
}
