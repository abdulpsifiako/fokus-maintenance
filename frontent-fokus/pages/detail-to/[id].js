import LoadingModal from "@/components/public/loadingModal";
import { createSnapTransaksi } from "@/lib/axios/transaksi";
import { addNewPropertiesTransaksi } from "@/lib/redux/store/transaksi";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import PaymentModal from "@/components/user/paymentModal";
import Alert from "@/components/public/alert";
import { freeTOPremium, freeTryout } from "@/lib/axios/tryout";
import VoucherModal from "@/components/user/voucherModal"; // ← (1) import

// ─── PERIODE HELPERS ──────────────────────────────────────────────────────────

const toDay = (dateStr) => {
  if (!dateStr || dateStr.trim() === "") return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  d.setHours(0, 0, 0, 0);
  return d;
};

const todayDay = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const isInPeriode = (start, end) => {
  const now = todayDay();
  const s = toDay(start);
  const e = toDay(end);
  if (s && now < s) return false;
  if (e && now > e) return false;
  return true;
};

const isPeriodeEnded = (end) => {
  const e = toDay(end);
  return !!e && todayDay() > e;
};
const isPeriodeStarted = (start) => {
  const s = toDay(start);
  return !s || todayDay() >= s;
};

const fmtDate = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function PeriodeInfo({ label, start, end }) {
  const now = todayDay();
  const started = isPeriodeStarted(start);
  const ended = isPeriodeEnded(end);
  const active = started && !ended;

  if (!start && !end) return null;

  let msg = "";
  let color = "";

  if (!started) {
    const diff = Math.round((toDay(start) - now) / 86400000);
    msg = `${label} dibuka ${diff} hari lagi (${fmtDate(start)})`;
    color = "text-yellow-700 bg-yellow-50 border-yellow-200";
  } else if (ended) {
    msg = `${label} telah berakhir sejak ${fmtDate(end)}`;
    color = "text-red-600 bg-red-50 border-red-200";
  } else {
    const diffEnd = toDay(end)
      ? Math.round((toDay(end) - now) / 86400000)
      : null;
    msg =
      diffEnd !== null
        ? `${label} aktif · berakhir ${diffEnd} hari lagi (${fmtDate(end)})`
        : `${label} aktif`;
    color = "text-green-700 bg-green-50 border-green-200";
  }

  return (
    <p className={`text-xs px-3 py-2 rounded-md border ${color}`}>{msg}</p>
  );
}

const fasilitas = [
  { nama: "Sistem CAB/CBT", gratis: true, premium: true },
  { nama: "Timer Ujian", gratis: true, premium: true },
  { nama: "Skor Akhir", gratis: true, premium: true },
  { nama: "Perangkingan Nasional", gratis: false, premium: true },
  { nama: "Statistik Nilai", gratis: false, premium: true },
  { nama: "Pembahasan", gratis: false, premium: true },
  { nama: "Dapat Dikerjakan Berulang Kali", gratis: false, premium: true },
  { nama: "Komentar Postingan Instagram", gratis: false, premium: true },
  { nama: "Masa Aktif 6 Bulan", gratis: false, premium: true },
];

export default function PaketTryout() {
  const token = Cookies.get("token");
  const [paymentData, setPaymentData] = useState("");
  const [loadingPage, setLoadingPage] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [alert, setAlert] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const datTransaksi = useSelector((state) => state.transaksi.program_utama);

  const detailPurchased = useSelector((state) => state.tryout.purchased);
  const detailSoal = useSelector((state) => state.tryout.dataSoal);
  const dataUser = useSelector((state) => state.user.detail);

  const [paket, setPaket] = useState("Premium");

  // ── (2) State voucher ─────────────────────────────────────────────────────
  const [openVoucherModal, setOpenVoucherModal] = useState(false);

  const props = detailSoal?.properties || {};

  const fiturList = (props.fitur || []).map((fitur) => {
    const lower = fitur.toLowerCase();
    return {
      name: fitur,
      label: fitur,
      harga: lower === "premium" ? parseInt(props.hargaPremium || 0) : 0,
      start: props[`start${fitur}`] || null,
      end: props[`end${fitur}`] || null,
    };
  });

  const adaPeriodeBeli = !!props.pemMulai || !!props.pemSelesai;
  const pemBeliAktif = isInPeriode(props.pemMulai, props.pemSelesai);
  const pemBeliEnded = isPeriodeEnded(props.pemSelesai);
  const pemBeliStarted = isPeriodeStarted(props.pemMulai);

  const selectedFitur = fiturList.find((f) => f.name === paket);
  const periodeStart = selectedFitur?.start || null;
  const periodeEnd = selectedFitur?.end || null;
  const periodeAktif = isInPeriode(periodeStart, periodeEnd);
  const periodeEnded = isPeriodeEnded(periodeEnd);
  const periodeNotStarted = !isPeriodeStarted(periodeStart);

  const hanyaGratis = fiturList.length === 1 && fiturList[0].name === "Gratis";
  const sudahPunyaGratis = detailPurchased?.isFreeTO === true;
  const isGratisExpired = isPeriodeEnded(props.endGratis);
  const hideBeliButton = hanyaGratis && sudahPunyaGratis;

  const beliDisabled =
    (adaPeriodeBeli && !pemBeliAktif) || periodeEnded || periodeNotStarted;

  const normalizeDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // ── (3) Logika pembayaran asli dipindah ke fungsi ini ────────────────────
  // onLanjut dari VoucherModal memanggil ini dengan harga setelah potongan
  const handleLanjutPembayaran = async ({
    harga_akhir,
    voucherCode,
    potongan,
  } = {}) => {
    setOpenVoucherModal(false);
    setLoadingPage(true);

    // Pastikan harga berupa integer — Midtrans tidak menerima desimal atau string
    const hargaAkhir = Math.floor(Number(harga_akhir) || 0);

    if (paket === "Gratis") {
      dispatch(addNewPropertiesTransaksi({ harga: 0 }));
      router.push("/form-to");
      return;
    }

    // Jika harga setelah voucher = 0 (diskon 100%) atau
    // hargaPremium memang 0 dari backend → pakai freeTOPremium, bukan Midtrans
    if (hargaAkhir < 1) {
      try {
        const res = await freeTOPremium(
          {
            data_transaksi: {
              ...datTransaksi,
              harga: 0,
              harga_akhir: 0,
            },
          },
          token,
        );
        if (res.status == 200) {
          setLoadingPage(false);
          setAlert({
            type: "success",
            title: "Info",
            message: "Sukses menambahkan Tryout",
          });
          router.push("/pembelian");
        }
      } catch {
        setLoadingPage(false);
        setAlert({
          type: "error",
          title: "Info",
          message: "Gagal membuat transaksi",
        });
      }
      return;
    }

    // Harga > 0 → bayar via Midtrans Snap
    try {
      const res = await createSnapTransaksi(
        {
          data_transaksi: {
            ...datTransaksi,
            harga: hargaAkhir,
            harga_akhir: hargaAkhir,
          },
          detail: dataUser,
        },
        token,
      );
      if (res.status == 200) {
        setPaymentData(res.data.redirect_url);
        setLoadingPage(false);
        setOpenModal(true);
      } else {
        setLoadingPage(false);
        setAlert({
          type: "error",
          title: "Info",
          message: "Gagal membuat transaksi",
        });
      }
    } catch {
      setLoadingPage(false);
      setAlert({
        type: "error",
        title: "Info",
        message: "Gagal membuat transaksi",
      });
    }
  };

  useEffect(() => {
    if (!datTransaksi && !detailPurchased && !detailSoal) {
      router.push("/tryout");
    }
  }, [router, datTransaksi, detailPurchased, detailSoal]);

  useEffect(() => {
    if (fiturList.length === 1) {
      setPaket(fiturList[0].name);
    }
  }, [datTransaksi?.to_data, fiturList]);

  if (!datTransaksi && !detailPurchased && !detailSoal) {
    return null;
  }

  return (
    <div className="p-7 font-poppins my-7">
      {/* Header */}
      <div className="sm:flex">
        {/* Deskripsi dan Pilihan Paket */}
        <div className="sm:w-1/2 bg-white rounded-xl p-4">
          <div className="sm:w-1/2 justify-end flex flex-col ml-auto">
            <h2 className="font-bold text-red-700 mb-2 text-sm">
              {datTransaksi?.program_name || detailSoal?.judul}
            </h2>
            <p className="text-xs mb-2">Jenis Paket</p>

            {adaPeriodeBeli && (
              <div className="mb-3 space-y-1">
                <PeriodeInfo
                  label="Periode pembelian"
                  start={props.pemMulai}
                  end={props.pemSelesai}
                />
                {pemBeliEnded && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-md">
                    ⛔ Pembelian sudah ditutup sejak {fmtDate(props.pemSelesai)}
                    .
                  </p>
                )}
              </div>
            )}

            <div className="space-y-3">
              <div className="flex flex-col gap-4 text-xs">
                {fiturList.map((item) => {
                  const endGratis = props.endGratis;
                  const isGratisExp =
                    endGratis && new Date() > new Date(endGratis);
                  const isHidden =
                    item.name === "Gratis" &&
                    (detailPurchased?.isFreeTO === true || isGratisExp);

                  return (
                    <label
                      key={item.name}
                      className={`flex items-center gap-1 cursor-pointer ${isHidden ? "hidden" : ""}`}
                    >
                      <input
                        type="radio"
                        name="paket"
                        value={item.name}
                        checked={paket === item.name}
                        onChange={() => setPaket(item.name)}
                      />
                      {item.label}
                    </label>
                  );
                })}
              </div>

              {paket && (
                <div className="text-xs">
                  {(() => {
                    const selected = fiturList.find((f) => f.name === paket);
                    const endGratis = props.endGratis;
                    const isGratisExp =
                      endGratis && new Date() > new Date(endGratis);
                    if (paket === "Gratis" && isGratisExp) return null;
                    return (
                      <p className="font-semibold">
                        Harga:{" "}
                        {selected?.harga === 0
                          ? "Rp 0"
                          : `Rp ${selected?.harga.toLocaleString("id-ID")}`}
                      </p>
                    );
                  })()}
                </div>
              )}

              {paket && (
                <div className="space-y-1">
                  <PeriodeInfo
                    label={`Periode pengerjaan ${paket}`}
                    start={periodeStart}
                    end={periodeEnd}
                  />
                  {periodeEnded && (
                    <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-md">
                      ⌛ Waktu pengerjaan paket {paket} telah berakhir pada{" "}
                      {fmtDate(periodeEnd)}.
                    </p>
                  )}
                  {periodeNotStarted && (
                    <p className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 px-3 py-2 rounded-md">
                      📅 Pengerjaan paket {paket} baru bisa dimulai pada{" "}
                      {fmtDate(periodeStart)}.
                    </p>
                  )}
                </div>
              )}
            </div>

            {detailPurchased && (
              <button
                type="button"
                onClick={() => router.push("/detail-to/summary")}
                className={`
                  ${
                    detailPurchased?.isFreeTO &&
                    normalizeDate(detailPurchased?.toStart) <
                      normalizeDate(props.endGratis)
                      ? ""
                      : "hidden"
                  }
                  ${
                    normalizeDate(detailPurchased?.toStart) >
                    normalizeDate(new Date())
                      ? "disabled cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }
                  text-white px-4 py-2 rounded-md text-xs bg-primary mt-2
                `}
              >
                {normalizeDate(detailPurchased?.toStart) >
                normalizeDate(new Date())
                  ? (() => {
                      const start = normalizeDate(detailPurchased?.toStart);
                      const today = normalizeDate(new Date());
                      const diffDays = Math.round(
                        (start - today) / (1000 * 60 * 60 * 24),
                      );
                      return `Bisa dikerjakan dalam ${diffDays} hari lagi`;
                    })()
                  : "Mulai kerjakan"}
              </button>
            )}

            {/* ── (4) Tombol beli — sekarang buka VoucherModal dulu ── */}
            {(() => {
              const endGratis = props.endGratis;
              const isGratisExp = endGratis && new Date() > new Date(endGratis);
              const shouldHide =
                hideBeliButton || (paket === "Gratis" && isGratisExp);

              return (
                !shouldHide && (
                  <button
                    type="button"
                    disabled={beliDisabled}
                    onClick={() => {
                      if (beliDisabled) return;

                      if (paket === "Gratis") {
                        handleLanjutPembayaran({
                          harga_akhir: 0,
                          voucherCode: "",
                          potongan: 0,
                        });
                        return;
                      }

                      // Premium → buka modal voucher/referral dulu
                      setOpenVoucherModal(true);
                    }}
                    className={`mt-2 px-4 py-2 rounded-md text-xs text-white
                      ${
                        beliDisabled
                          ? "bg-gray-400 cursor-not-allowed opacity-60"
                          : "bg-red-700 cursor-pointer"
                      }`}
                  >
                    {paket === "Premium" ? "Beli" : "Daftar"} Sekarang
                  </button>
                )
              );
            })()}
          </div>
        </div>

        {/* Gambar (tidak diubah) */}
        <div className="sm:w-1/2 flex items-center justify-start">
          <div className="rounded-xl overflow-hidden sm:w-[300px] sm:h-[200px] flex items-center justify-center bg-white">
            <Image
              src="/tofok.webp"
              alt="Tryout"
              width={1000}
              height={1000}
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Tabel Fasilitas (tidak diubah dari asli) */}
      <div className="mt-10 bg-white rounded-xl shadow p-4 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="text-center">
              <th className="py-2 text-left">Fasilitas</th>
              {fiturList.some((item) => item.name == "Gratis") ? (
                <th className="py-2">
                  Gratis
                  <div className="text-xs font-normal">
                    {props.startGratis} s/d {props.endGratis}
                  </div>
                </th>
              ) : (
                ""
              )}
              {fiturList.some((item) => item.name == "Premium") ? (
                <th className="py-2">
                  Premium
                  <div className="text-xs font-normal">
                    {/* Tidak Ada Batas Periode Pengerjaan */}
                  </div>
                </th>
              ) : (
                ""
              )}
            </tr>
          </thead>
          <tbody>
            {fasilitas.map((item, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="py-3 px-2">{item.nama}</td>
                {fiturList.some((item) => item.name == "Gratis") ? (
                  <td className="text-center">
                    {item.gratis ? (
                      <FaCheckCircle className="text-blue-600 mx-auto" />
                    ) : (
                      <FaTimesCircle className="text-red-500 mx-auto" />
                    )}
                  </td>
                ) : (
                  ""
                )}
                {fiturList.some((item) => item.name == "Premium") ? (
                  <td className="text-center">
                    {item.premium ? (
                      <FaCheckCircle className="text-blue-600 mx-auto" />
                    ) : (
                      <FaTimesCircle className="text-red-500 mx-auto" />
                    )}
                  </td>
                ) : (
                  ""
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaymentModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        paymentData={paymentData}
      />
      <LoadingModal show={loadingPage} />
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* ── (5) VoucherModal ── */}
      {openVoucherModal && (
        <VoucherModal
          harga={Number(props.hargaPremium)}
          onClose={() => setOpenVoucherModal(false)}
          onLanjut={handleLanjutPembayaran}
        />
      )}
    </div>
  );
}
