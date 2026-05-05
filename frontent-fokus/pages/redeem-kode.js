import { useCallback, useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { addPengajuan, cekReferal } from "@/lib/axios/transaksi";
import Alert from "@/components/public/alert";

export default function ReferralPage() {
  const [alert, setAlert] = useState(null);
  const token = Cookies.get("token");
  const [showCara, setShowCara] = useState(false);
  const [copied, setCopied] = useState(false);
  const detail = useSelector((state) => state.user.detail);
  const [jumlah, setJumlah] = useState(0);

  // State untuk pengajuan
  const [ajukan, setAjukan] = useState("");
  const [sisa, setSisa] = useState(0);
  const [pesan, setPesan] = useState("");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(detail?.referal || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin: ", err);
    }
  };

  const fetchCounUse = useCallback(async () => {
    try {
      const res = await cekReferal(detail.referal, token);
      // setJumlah(res.data.jumlah);
      // setSisa(res.data.jumlah); // awalnya sisa = jumlah

      setJumlah(res.data.jumlah);
      setSisa(res.data.totalSisa);
    } catch (error) {
      // //  //  console.log(error);
    }
  }, [detail.referal, token]);

  useEffect(() => {
    fetchCounUse();
  }, [fetchCounUse]);

  const handleAjukan = async () => {
    if (jumlah < 15) {
      setPesan("Minimal 15 kali penggunaan untuk dapat mengajukan.");
      return;
    }
    const angkaAjukan = parseInt(ajukan);
    if (isNaN(angkaAjukan) || angkaAjukan <= 0) {
      setPesan("Masukkan jumlah yang valid.");
      return;
    }
    if (angkaAjukan > jumlah) {
      setPesan("Jumlah yang diajukan melebihi total yang tersedia.");
      return;
    }
    try {
      const sisaBaru = jumlah - angkaAjukan;
      // //  //  console.log({jumlah_total:jumlah, nama:detail.name,email:detail.email, kode:detail.referal, detail_user:detail, jumlah_pengajuan:angkaAjukan, sisa:sisa})
      const res = await addPengajuan(
        {
          jumlah_total: jumlah,
          nama: detail.name,
          email: detail.email,
          kode: detail.referal,
          detail_user: detail,
          jumlah_pengajuan: angkaAjukan,
          sisa: sisaBaru,
          status: "Di Ajukan",
        },
        token
      );
      setAlert({
        type: "success",
        title: "Info",
        message: res.message,
      });
      setSisa(sisaBaru);
      setPesan(`Pengajuan ${angkaAjukan} berhasil! Sisa: ${sisaBaru}`);
    } catch (error) {
      // //  //  console.log(error)
    }
  };
  return (
    <div className="max-w-2xl mx-auto p-6 font-poppins">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-red-700 mb-2">Kode Referral</h1>
        <p className="text-gray-600 text-sm">
          Bagikan kode kamu dan dapatkan reward menarik dari Fokusedu 🎁
        </p>
      </div>

      {/* Banner */}
      <div className="bg-red-50 border border-red-100 rounded-xl p-5 mb-6 flex items-center gap-4 shadow-sm">
        <div className="bg-red-600 text-white rounded-full p-1 sm:p-0 sm:w-12 sm:h-12 flex items-center justify-center text-xl">
          🎁
        </div>
        <div>
          <p className="font-semibold text-red-800">
            Ajak teman ke Fokusedu, dapatkan cashback JUTAAN!
          </p>
          <p className="text-xs text-gray-600">
            Berlaku untuk setiap teman yang membeli program menggunakan kode
            kamu.
          </p>
        </div>
      </div>

      {/* Kode Referral */}
      <div className="mb-6">
        <label className="font-semibold text-gray-700 mb-1 block">
          Kode Referralmu
        </label>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <input
            value={detail?.referal || ""}
            className="border border-gray-300 w-full px-3 py-2 rounded-md text-center font-semibold tracking-wide bg-gray-50 focus:ring-2 focus:ring-red-400"
            readOnly
          />
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              copied
                ? "bg-green-600 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {copied ? "Disalin!" : "Salin"}
          </button>
        </div>
      </div>

      {/* Statistik Penggunaan */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex items-center justify-between shadow-sm">
        <div>
          <p className="text-sm text-gray-500">Kode referral telah digunakan</p>
          <p className="text-lg font-bold text-red-700">{jumlah} kali</p>
        </div>
        <div className="text-3xl text-red-500">📈</div>
      </div>

      {/* === Section Pengajuan Referral === */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3">
          Ajukan Jumlah Referral
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          Kamu dapat mengajukan jumlah referral untuk ditukar dengan reward.
          Minimal <span className="font-semibold text-red-600">15 kali</span>{" "}
          penggunaan untuk bisa diajukan.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <input
            type="number"
            min="1"
            value={ajukan}
            onChange={(e) => setAjukan(e.target.value)}
            placeholder="Masukkan jumlah yang diajukan"
            className="border border-gray-300 w-full px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-red-400 outline-none"
          />
          <button
            onClick={handleAjukan}
            disabled={jumlah < 15}
            className={`px-5 py-2 rounded-md font-semibold text-sm transition ${
              jumlah < 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            Ajukan
          </button>
        </div>

        {pesan && (
          <p
            className={`text-sm mt-3 ${
              pesan.includes("berhasil") ? "text-green-600" : "text-red-600"
            }`}
          >
            {pesan}
          </p>
        )}

        <div className="mt-4 text-sm text-gray-700">
          <p>
            <span className="font-semibold text-red-700">Sisa referral:</span>{" "}
            {sisa} kali
          </p>
        </div>
      </div>

      {/* Cara Menggunakan */}
      <button
        className="w-full border border-red-100 hover:bg-red-50 transition rounded-xl flex justify-between items-center px-4 py-3 mb-2 shadow-sm"
        onClick={() => setShowCara(!showCara)}
      >
        <span className="flex items-center gap-2 text-red-700 font-semibold">
          <span>❓</span> Cara Menggunakan Kode Referral
        </span>
        <FaChevronRight
          className={`text-gray-500 transition-transform duration-300 ${
            showCara ? "rotate-90" : ""
          }`}
        />
      </button>

      {showCara && (
        <div className="text-sm text-gray-700 mt-2 border border-red-100 bg-red-50 rounded-xl p-4 leading-relaxed">
          <ul className="list-decimal pl-5 space-y-1">
            <li>
              Bagikan kode referral kamu ke teman yang ingin bergabung di
              Fokusedu.
            </li>
            <li>
              Temanmu masukkan kode referral saat transaksi program utama.
            </li>
            <li>
              Kamu akan dapat cashback atau voucher setelah transaksi berhasil.
            </li>
            <li>
              Minimal 15 kali penggunaan referral untuk bisa mengajukan reward.
            </li>
            <li>
              Hubungi admin Fokusedu (+6285138026589) untuk penukaran reward.
            </li>
          </ul>
        </div>
      )}
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
}
