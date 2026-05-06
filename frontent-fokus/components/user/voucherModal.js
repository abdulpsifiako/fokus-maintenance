import { useState } from "react";
// import { cekVoucher } from "@/lib/axios/voucher";
import Cookies from "js-cookie";
import { cekVoucher } from "@/lib/axios/transaksi";

export default function VoucherModal({ harga, onClose, onLanjut }) {
  const token = Cookies.get("token");

  const [kode, setKode] = useState("");
  const [result, setResult] = useState(null); // data voucher valid
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const formatRp = (val) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  const handleCek = async () => {
    if (!kode) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await cekVoucher({ name: kode }, token);
      setResult(res.data);
    } catch (err) {
      console.log(error);
      setError(err?.response?.data?.message || "Voucher tidak valid");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setKode("");
    setResult(null);
    setError("");
  };

  // Lanjut ke payment — kirim harga_akhir & kode ke parent
  const handleLanjut = () => {
    onLanjut({
      harga_akhir: result ? harga - result.nilai : harga,
      voucherCode: result ? kode : "",
      potongan: result ? result.nilai : 0,
      tipe: result.tipe,
    });
  };
  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center
        bg-black/50 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl
          animate-[modal-in_0.2s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 pt-5 pb-3
          border-b border-slate-100"
        >
          <h2 className="font-bold text-gray-800">Voucher / Referral</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200
              flex items-center justify-center text-gray-500 text-sm"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Harga awal */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Harga Program</span>
            <span className="font-semibold">{formatRp(harga)}</span>
          </div>

          {/* Input kode */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Kode Voucher / Referral
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={kode}
                onChange={(e) => {
                  setKode(e.target.value.toUpperCase());
                  setResult(null);
                  setError("");
                }}
                placeholder="Masukkan kode..."
                disabled={!!result}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2
                  text-sm focus:outline-none focus:ring-1 focus:ring-primary
                  disabled:bg-gray-50 disabled:text-gray-400 uppercase"
              />
              {result ? (
                <button
                  onClick={handleReset}
                  className="px-3 py-2 rounded-lg border border-gray-200
                    text-sm text-gray-500 hover:bg-gray-50"
                >
                  Ganti
                </button>
              ) : (
                <button
                  onClick={handleCek}
                  disabled={loading || !kode.trim()}
                  className="px-4 py-2 rounded-lg bg-primary text-white
                    text-sm font-semibold disabled:opacity-50
                    hover:opacity-80 transition-all"
                >
                  {loading ? (
                    <div
                      className="w-4 h-4 border-2 border-white/30
                      border-t-white rounded-full animate-spin"
                    />
                  ) : (
                    "Cek"
                  )}
                </button>
              )}
            </div>

            {/* Error */}
            {error && <p className="text-xs text-red-500 mt-1.5">⚠ {error}</p>}
          </div>

          {/* Hasil voucher valid */}
          {result && (
            <div
              className="bg-green-50 border border-green-200
              rounded-xl p-3 space-y-1.5 text-sm"
            >
              <div className="flex justify-between">
                <span className="text-gray-500">Kode</span>
                <span className="font-semibold text-green-700">{kode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Potongan</span>
                <span className="font-semibold text-green-600">
                  - {formatRp(result.nilai)}
                  {result.tipe === "persen" && (
                    <span className="text-xs ml-1 text-green-500">
                      ({result.nilai}%)
                    </span>
                  )}
                </span>
              </div>
              <div className="flex justify-between border-t border-green-200 pt-1.5">
                <span className="font-semibold text-gray-700">Total Bayar</span>
                <span className="font-bold text-primary text-base">
                  {formatRp(harga - result.nilai)}
                </span>
              </div>
            </div>
          )}

          {/* Tanpa voucher */}
          {!result && (
            <p className="text-xs text-gray-400 text-center">
              Tidak punya voucher?{" "}
              <button
                onClick={() =>
                  onLanjut({ harga_akhir: harga, voucherCode: "", potongan: 0 })
                }
                className="text-primary underline"
              >
                Lanjut tanpa voucher
              </button>
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5">
          <button
            onClick={handleLanjut}
            className="w-full py-2.5 rounded-xl bg-primary text-white
              font-semibold text-sm hover:opacity-80 transition-all"
          >
            Lanjut Pembayaran →
          </button>
        </div>
      </div>
    </div>
  );
}
