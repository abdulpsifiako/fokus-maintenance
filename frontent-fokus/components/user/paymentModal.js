import { useState } from "react";

export default function PaymentModal({ open, onClose, paymentData }) {
  const [showLaterModal, setShowLaterModal] = useState(false);

  if (!open && !showLaterModal) return null;

  const closeAllModal = () => {
    setShowLaterModal(false);
    onClose();
  };

  if (showLaterModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl">
          <h2 className="mb-3 text-lg font-semibold">Pembayaran Ditunda</h2>

          <p className="mb-6 text-sm text-gray-600">
            Anda bisa membayar melalui menu profil → Riwayat pembelian.
          </p>

          <button
            onClick={closeAllModal}
            className="w-full rounded-xl bg-gray-200 py-2 text-sm font-medium hover:bg-gray-300"
          >
            Tutup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-2 text-lg font-semibold">Konfirmasi Pembayaran</h2>

        <p className="mb-6 text-sm text-gray-600">
          Transaksi berhasil dibuat. Silakan lanjutkan pembayaran.
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => {
              closeAllModal();
              setTimeout(() => {
                window.open(paymentData, "_blank", "noopener,noreferrer");
              }, 0);
            }}
            className="flex-1 rounded-xl bg-primary py-2 text-sm font-semibold text-white"
          >
            Bayar Sekarang
          </button>

          <button
            onClick={() => setShowLaterModal(true)}
            className="flex-1 rounded-xl border border-gray-300 py-2 text-sm"
          >
            Bayar Nanti
          </button>
        </div>
      </div>
    </div>
  );
}
