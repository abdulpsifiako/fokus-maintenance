import {
  FaCalendarAlt,
  FaCheckCircle,
  FaFileAlt,
  FaVideo,
} from "react-icons/fa";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import LoadingModal from "@/components/public/loadingModal";
import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { addTransaksiProgramUtama } from "@/lib/redux/store/transaksi";
import {
  createSnapTransaksi,
  createTransaksiFreeKelas,
  getTransaksiPembelian,
} from "@/lib/axios/transaksi";
import PaymentModal from "@/components/user/paymentModal";
import Alert from "@/components/public/alert";
import {
  FileText,
  PlayCircle,
  Video,
  KeyRound,
  ExternalLink,
  Eye,
  EyeOff,
} from "lucide-react";
import PasswordButton from "@/components/user/passwordBotton";
import VoucherModal from "@/components/user/voucherModal"; // ← (1) import
import Link from "next/link";

export default function DetailKelasZoom() {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = Cookies.get("token");
  const programId = router.query.id;

  const datTransaksi = useSelector((state) => state.transaksi.program_utama);
  const dataKelas = useSelector((state) => state.tryout.detailKelasonline);
  const dataUser = useSelector((state) => state.user.detail);

  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [alert, setAlert] = useState(null);

  // ── (2) State voucher ─────────────────────────────────────────────────────
  const [openVoucherModal, setOpenVoucherModal] = useState(false);

  // ── (3) Fix: userHasPurchased hanya true jika isPurchased === true ────────
  // Sebelumnya: setUserHasPurchased(res.data) → semua status (pending pun) dianggap punya akses
  // Sesudah   : cek isPurchased boolean dari response
  const [userHasPurchased, setUserHasPurchased] = useState(false);

  const getTransaksiProgram = useCallback(async () => {
    if (!programId) return; // tunggu sampai router.query.id tersedia
    try {
      const res = await getTransaksiPembelian(programId, token, "Kelas Online");
      setUserHasPurchased(
        res.data?.isPurchase === true || res.data?.isActive === true,
      );
    } catch (error) {
      setUserHasPurchased(false);
    }
  }, [programId, token]);

  useEffect(() => {
    getTransaksiProgram();
  }, [getTransaksiProgram]);

  // ── Hitung harga setelah diskon ───────────────────────────────────────────
  const hargaAsli = Number(dataKelas?.properties?.harga || 0);
  const diskon = Number(dataKelas?.properties?.diskon || 0);
  const hargaSetelahDiskon = diskon
    ? Math.floor(hargaAsli - (diskon / 100) * hargaAsli)
    : hargaAsli;

  // ── (4) Handler lanjut pembayaran (dipanggil dari VoucherModal) ───────────
  const handleLanjutPembayaran = async ({
    harga_akhir,
    voucherCode,
    potongan,
  } = {}) => {
    setOpenVoucherModal(false);
    setLoading(true);

    const hargaFinal = Math.floor(Number(harga_akhir) || 0);

    try {
      // Gratis (harga 0 dari backend atau voucher 100%)
      if (hargaFinal < 1) {
        dispatch(
          addTransaksiProgramUtama({
            user_id: dataUser.id,
            jenis: "Kelas Online",
            program_id: dataKelas.id,
            status: "CREATED",
            program_name: dataKelas.properties.judul,
            kelas_data: dataKelas,
            harga: 0,
          }),
        );
        const res = await createTransaksiFreeKelas(
          { data_transaksi: datTransaksi },
          token,
        );
        if (res.status === 200) {
          router.push("/pembelian");
        }
        return;
      }

      // Berbayar → Midtrans Snap
      const res = await createSnapTransaksi(
        {
          data_transaksi: {
            user_id: dataUser.id,
            jenis: "Kelas Online",
            program_id: dataKelas.id,
            status: "CREATED",
            program_name: dataKelas.properties.judul,
            kelas_data: dataKelas,
            harga: hargaFinal,
            harga_akhir: hargaFinal,
          },
          detail: dataUser,
        },
        token,
      );
      if (res.status === 200) {
        setPaymentData(res.data.redirect_url);
        setOpenModal(true);
      } else {
        setAlert({
          type: "error",
          title: "Info",
          message: "Gagal membuat transaksi",
        });
      }
    } catch {
      setAlert({
        type: "error",
        title: "Info",
        message: "Gagal membuat transaksi",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-7 font-poppins mt-5">
      {/* Header */}
      <p className="text-xs text-gray-500 mb-2">
        <Link href={`/kelas-online`}>Live Class &gt; </Link>
        <span className="font-semibold">
          {userHasPurchased ? dataKelas.properties.judul : "Daftar Sekarang"}
        </span>
      </p>
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-red-700">
          {dataKelas.properties.judul}
        </h1>
        <p className="text-xs">{dataKelas.properties.deskripsi}</p>
        <div className="flex items-center text-xs text-gray-600 gap-2 mt-1">
          <FaCalendarAlt />
          <span>{dataKelas.properties.tanggalMulai}</span>
        </div>

        {!userHasPurchased && (
          <>
            <div className="text-red-700 font-bold text-xl mt-4">
              Rp {hargaSetelahDiskon.toLocaleString()}
            </div>

            {/* ── (5) Tombol beli — buka VoucherModal dulu ── */}
            <button
              type="button"
              onClick={async () => {
                if (!token) {
                  router.push("/auth/login");
                  return;
                }

                // Harga 0 dari backend → langsung gratis tanpa voucher
                if (hargaAsli === 0) {
                  setLoading(true);
                  try {
                    await Promise.all([
                      handleLanjutPembayaran({
                        harga_akhir: 0,
                        voucherCode: "",
                        potongan: 0,
                      }),
                      new Promise((resolve) => setTimeout(resolve, 2000)),
                    ]);
                  } finally {
                    setLoading(false);
                  }
                  return;
                }

                // Berbayar → buka modal voucher dulu
                setOpenVoucherModal(true);
              }}
              className="mt-2 bg-red-700 text-white px-4 py-2 rounded-md text-sm"
            >
              Daftar Sekarang
            </button>
          </>
        )}
      </div>

      {/* Grid Content — tidak diubah dari asli */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Tentang Paket */}
        <div className="bg-white rounded-md mt-3">
          <h2 className="text-red-700 font-semibold mb-1">Tentang Paket</h2>
          <ul className="text-xs text-gray-700 space-y-2">
            {dataKelas.properties.tentang_paket.map((item, idx) => (
              <li key={idx}>
                <FaCheckCircle className="inline mr-2 text-green-500" /> {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Materi */}
        <div className="bg-white rounded-md p-4 col-span-2">
          <h2 className="text-red-700 font-semibold mb-3">Materi</h2>
          <div className="flex flex-col gap-2 text-sm max-w-xs">
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded flex items-center gap-2">
              <FaFileAlt /> {dataKelas.properties.total_materi} Materi
            </div>
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded flex items-center gap-2">
              <FaVideo /> {dataKelas.properties.total_video} Video
            </div>
          </div>
        </div>

        {/* Fasilitator */}
        <div className="bg-white rounded-md shadow p-4">
          <h2 className="text-red-700 font-semibold mb-3">Fasilitator</h2>
          <div className="space-y-3">
            {dataKelas.properties.pengajar.map((item, i) => (
              <div className="flex items-center gap-3" key={i}>
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/landing/images/${item.gambar}`}
                  alt="Fasilitator"
                  width={40}
                  height={40}
                  className="rounded-full bg-primary"
                />
                <div>
                  <p className="font-medium text-sm">{item.nama}</p>
                  <p className="text-xs text-gray-500">{item.jobdesk}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Jadwal */}
        <div className="bg-white rounded-md shadow p-4 col-span-2">
          <h2 className="text-red-700 font-semibold mb-3">Jadwal</h2>
          <p className="text-xs text-gray-600 mb-2">
            * Jika ada perubahan akan diinformasikan di grup belajar
          </p>
          <ul className="text-sm text-gray-700 space-y-4">
            {dataKelas.properties.jadwal.map((item, i) => {
              const tanggalObj = new Date(item.tanggal);
              const tanggalFormatted = tanggalObj.toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              });

              return (
                <li
                  key={i}
                  className="border rounded-xl p-4 bg-white shadow-sm"
                >
                  <p className="font-medium text-gray-800">
                    {tanggalFormatted} | {item.mulai} – {item.selesai} WIB
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{item.materi}</p>

                  {/* Konten hanya tampil jika isPurchased/isActive = true */}
                  {userHasPurchased && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.link_modul && (
                        <a
                          href={item.link_modul}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                        >
                          <FileText size={16} />
                          Buka Modul
                          <ExternalLink size={14} />
                        </a>
                      )}

                      {item.link_video && (
                        <a
                          href={item.link_video}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-50 text-purple-700 hover:bg-purple-100 transition"
                        >
                          <PlayCircle size={16} />
                          Tonton Video
                          <ExternalLink size={14} />
                        </a>
                      )}

                      {item.link_record && (
                        <a
                          href={item.link_record}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                        >
                          <Video size={16} />
                          Lihat Rekaman
                          <ExternalLink size={14} />
                        </a>
                      )}

                      {item.password_modul && (
                        <PasswordButton password={item.password_modul} />
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <LoadingModal show={loading} />
      <PaymentModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        paymentData={paymentData}
      />
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* ── (6) VoucherModal ── */}
      {openVoucherModal && (
        <VoucherModal
          harga={hargaSetelahDiskon}
          onClose={() => setOpenVoucherModal(false)}
          onLanjut={handleLanjutPembayaran}
        />
      )}
    </div>
  );
}
