export default function ModalInfo({ info, onClose }) {
  if (!info) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center
        bg-black/55 backdrop-blur-sm px-4"
      onClick={onClose} // klik backdrop = tutup
    >
      <div
        className="bg-white rounded-2xl w-full max-w-sm overflow-hidden
          shadow-2xl animate-[modal-in_0.25s_ease]"
        onClick={(e) => e.stopPropagation()} // jangan tutup saat klik isi
      >
        {/* Header */}
        <div className="relative p-5 pb-4" style={{ background: "#cb1e0e" }}>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 rounded-full
              bg-white/20 hover:bg-white/35 text-white text-sm
              flex items-center justify-center transition-all"
          >
            ✕
          </button>

          {/* Badge */}
          <span
            className="inline-flex items-center gap-1.5 text-white/90
            text-xs font-semibold bg-white/20 px-3 py-1
            rounded-full mb-3"
          >
            📢 Pengumuman
          </span>

          <h2 className="text-white font-bold text-base leading-snug pr-6">
            {info.judul}
          </h2>
        </div>

        {/* Body */}
        <div className="p-5">
          <p className="text-sm text-slate-600 leading-relaxed mb-3">
            {info.deskripsi}
          </p>

          {/* Tanggal — opsional */}
          {info.tanggal && (
            <p className="text-xs text-slate-400 mb-4">
              📅{" "}
              {new Date(info.tanggal).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}

          {/* Tombol CTA — opsional jika ada link */}
          {info.link ? (
            <a
              href={info.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-2.5 rounded-xl
                text-white text-sm font-semibold transition-all"
              style={{ background: "#cb1e0e" }}
              onMouseEnter={(e) => (e.target.style.background = "#af0011")}
              onMouseLeave={(e) => (e.target.style.background = "#cb1e0e")}
            >
              Lihat Selengkapnya
            </a>
          ) : (
            <button
              onClick={onClose}
              className="block w-full text-center py-2.5 rounded-xl
                text-white text-sm font-semibold transition-all"
              style={{ background: "#cb1e0e" }}
            >
              Mengerti
            </button>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 pb-4">
          Klik di luar atau ✕ untuk menutup
        </p>
      </div>
    </div>
  );
}
