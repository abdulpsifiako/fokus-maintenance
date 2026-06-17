import { addDataLatihan, addOpPembahasan } from "@/lib/redux/store/tryout";
import { BarChart2, Award, BookOpen, Clock } from "lucide-react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { GiSandsOfTime } from "react-icons/gi";
import { IoMenuSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";
import { getRapor } from "@/lib/axios/programUtama";
import { cekTryout } from "@/lib/axios/tryout";
import LoadingModal from "@/components/public/loadingModal";
import React from "react";
import { Lock } from "lucide-react";
import Link from "next/link";

// ─── PERIODE HELPERS ──────────────────────────────────────────────────────────

const toDay = (dateStr) => {
  if (!dateStr || String(dateStr).trim() === "") return null;
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

/**
 * Tentukan fitur mana yang dipakai untuk cek periode pengerjaan.
 *
 * Aturan:
 * - Kalau fitur ada Gratis DAN Premium → pakai Premium
 * - Kalau hanya Gratis                 → pakai Gratis
 * - Kalau hanya Premium                → pakai Premium
 *
 * @param {object}   props      - dataSoal.properties
 * @param {string[]} ownedFitur - fitur yang dimiliki user dari cekTryout
 *                                kosong = belum tahu, cek semua (fallback)
 */
const getPeriodeLatihanStatus = (props, ownedFitur = []) => {
  const allFitur = props?.fitur || [];

  // Tidak ada fitur → tidak ada batasan → boleh kerjakan
  if (!allFitur.length) return { bisaDiklik: true, statuses: [] };

  // Tentukan fitur target berdasarkan yang dimiliki user
  // Kalau ownedFitur kosong → gunakan semua fitur di props (fallback)
  const candidateFitur = ownedFitur.length
    ? allFitur.filter((f) => ownedFitur.includes(f))
    : allFitur;

  if (!candidateFitur.length) return { bisaDiklik: false, statuses: [] };

  // Aturan: jika ada Gratis DAN Premium → prioritaskan Premium
  const hasGratis = candidateFitur.includes("Gratis");
  const hasPremium = candidateFitur.includes("Premium");
  const targetFitur =
    hasGratis && hasPremium
      ? ["Premium"] // keduanya ada → pakai Premium
      : candidateFitur; // salah satu saja → pakai apa adanya

  const statuses = targetFitur.map((fitur) => {
    const start = props[`start${fitur}`] || null;
    const end = props[`end${fitur}`] || null;
    return {
      fitur,
      aktif: isInPeriode(start, end),
      ended: isPeriodeEnded(end),
      belum: !isPeriodeStarted(start),
      start,
      end,
    };
  });

  const bisaDiklik = statuses.some((s) => s.aktif);
  return { bisaDiklik, statuses };
};

// ─────────────────────────────────────────────────────────────────────────────

const totalMax = 220;
const nilai = { manaso: 120, wawancara: 65 };

export default function DetailSummaryTO() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const token = Cookies.get("token");
  const searchParams = useSearchParams();
  const programId = searchParams.get("id");

  const [dataRapor, setDataRapor] = useState(null);
  const [userHasPurchased, setUserHasPurchased] = useState(null); // null = belum tahu
  const dataLatihan = useSelector((state) => state.tryout.dataLatihan);
  const [mengerjakan, setMengerjakan] = useState(false);
  const openPembahasan = useSelector((state) => state.tryout.op_pembahasan);
  const dataSoal = useSelector((state) => state.tryout.dataSoal);

  const [open, setOpen] = useState(false);
  const detailPurchased = useSelector((state) => state.tryout.purchased);

  const total = nilai.manaso + nilai.wawancara;
  const percentManaso = (nilai.manaso / totalMax) * 100;
  const percentWawancara = (nilai.wawancara / totalMax) * 100;
  const percentSisa = 100 - (percentManaso + percentWawancara);
  const [maxPoin, setMaxPoin] = useState(0);

  // Tentukan fitur yang dimiliki user dari response cekTryout:
  // isFreeTO = true              → punya Gratis
  // isPurchase = true            → punya Premium
  // Keduanya bisa true sekaligus (user upgrade dari Gratis ke Premium)
  const ownedFitur = userHasPurchased
    ? [
        ...(userHasPurchased.isFreeTO ? ["Gratis"] : []),
        ...(userHasPurchased.isPurchase ? ["Premium"] : []),
      ]
    : []; // belum tahu → fallback cek semua

  // ── Cek periode berdasarkan fitur yang dimiliki ───────────────────────────
  const { bisaDiklik, statuses } = getPeriodeLatihanStatus(
    dataSoal?.properties || {},
    ownedFitur,
  );

  // Keterangan singkat di bawah tombol
  const periodeInfo = (() => {
    if (!statuses.length) return null;
    const now = todayDay();

    const aktif = statuses.find((s) => s.aktif);
    if (aktif) {
      const endDay = toDay(aktif.end);
      if (endDay) {
        const sisa = Math.round((endDay - now) / 86400000);
        return {
          text: `Periode ${aktif.fitur}: berakhir ${sisa} hari lagi (${fmtDate(aktif.end)})`,
          color: "text-green-600",
        };
      }
      return null; // unlimited, tidak perlu info
    }

    if (statuses.every((s) => s.ended)) {
      const last = statuses.reduce((a, b) =>
        new Date(a.end) > new Date(b.end) ? a : b,
      );
      return {
        text: `Periode pengerjaan telah berakhir sejak ${fmtDate(last.end)}`,
        color: "text-red-500",
      };
    }

    const belum = statuses.find((s) => s.belum);
    if (belum) {
      const diff = Math.round((toDay(belum.start) - now) / 86400000);
      return {
        text: `Periode ${belum.fitur} dimulai ${diff} hari lagi (${fmtDate(belum.start)})`,
        color: "text-yellow-600",
      };
    }

    return null;
  })();

  // ─────────────────────────────────────────────────────────────────────────

  const handleNavigation = async (url) => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      router.push(url);
    } finally {
      setLoading(false);
    }
  };

  const handleLatihan = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const transformData = (oldData) => {
      const allSoal = (oldData.properties?.materi || []).flatMap((m) =>
        (m.data_soal || []).map((s) => ({
          nama_materi: m.nama || "",
          sub_materi: m.submateri || "",
          passing_grade: m.passing || "",
          pertanyaan: s.pertanyaan || "",
          opsi: (s.opsi || []).map((o) => ({
            text: o.text || "",
            poin: o.poin || 0,
          })),
          kunci: s.kunci || "",
          pembahasan: s.pembahasan || "",
        })),
      );
      return {
        id: oldData.id || null,
        jenis: "Tryout",
        module_name: oldData.properties?.judul || "",
        program_utama: oldData.properties?.judul || "",
        title: oldData.properties?.judul || "",
        program_id: oldData.id,
        jenis_program: oldData.properties?.jenis || "",
        kategori: Array.isArray(oldData.properties?.fitur)
          ? oldData.properties.fitur.join(", ")
          : oldData.properties?.fitur || "",
        waktu: oldData.properties?.waktu || "",
        datasoal: allSoal,
        questions: allSoal.length,
        status: oldData.properties?.status ?? true,
      };
    };
    const data = transformData(dataSoal);
    dispatch(addDataLatihan(data));
    router.push("/detail-to/latihan-soal");
  };

  const [detailMateri, setDetailMateri] = useState([]);
  const [totalSkor, setTotalSkor] = useState(0);

  const fetchDataAnswer = useCallback(async () => {
    try {
      const res = await getRapor(
        {
          jenis: "Tryout",
          title: dataLatihan.title,
          module_name: dataLatihan.title,
        },
        token,
      );
      const raporData = res.data[0];
      if (raporData) setMengerjakan(true);

      const dataSoalRapor = raporData.properties.data_soal.datasoal;
      const dataAnswer = raporData.properties.data_answer;

      const maxPoinVal = dataSoalRapor.reduce((total, soal) => {
        if (soal.opsi.length > 0) {
          return total + Math.max(...soal.opsi.map((o) => o.poin));
        }
        return total;
      }, 0);
      setMaxPoin(maxPoinVal);

      const poinPerMateri = {};
      let totalUserPoin = 0;

      Object.entries(dataAnswer).forEach(([index, jawaban]) => {
        const soal = dataSoalRapor[index];
        if (!soal) return;
        const poinDiperoleh = soal.opsi[jawaban.option]?.poin || 0;
        const namaMateri = soal.nama_materi;
        const passing = soal.passing_grade;

        totalUserPoin += poinDiperoleh;

        if (!poinPerMateri[namaMateri]) {
          poinPerMateri[namaMateri] = {
            totalPoin: 0,
            passing_grade: Number(passing),
            jumlahSoal: 0,
          };
        }
        poinPerMateri[namaMateri].totalPoin += poinDiperoleh;
        poinPerMateri[namaMateri].jumlahSoal += 1;
      });

      const hasilPerMateri = Object.entries(poinPerMateri).map(
        ([namaMateri, data]) => ({
          nama_materi: namaMateri,
          totalPoin: data.totalPoin,
          passing_grade: data.passing_grade,
          jumlahSoal: data.jumlahSoal,
          status:
            data.totalPoin >= data.passing_grade ? "Lulus" : "Tidak Lulus",
        }),
      );

      setDataRapor(res.data);
      setDetailMateri(hasilPerMateri);
      setTotalSkor(totalUserPoin);
    } catch (error) {}
  }, [dataLatihan?.title, token]);

  const getTransaksiProgram = useCallback(async () => {
    try {
      const res = await cekTryout(dataLatihan.id, token, "Tryout");
      setUserHasPurchased(res.data); // simpan full object { isFreeTO, isPurchase, ... }
    } catch (error) {
      setUserHasPurchased(null);
    }
  }, [token, dataLatihan?.id]);

  useEffect(() => {
    if (!dataLatihan) {
      router.push("/");
      return;
    }
    if (dataLatihan.op_pembahasan)
      dispatch(addOpPembahasan(dataLatihan?.op_pembahasan));
    getTransaksiProgram();
    fetchDataAnswer();
  }, [getTransaksiProgram, fetchDataAnswer, dataLatihan, router]);

  if (!dataLatihan) return null;

  return (
    <>
      <div className="p-7 font-poppins">
        <header className="flex space-x-2 text-xs">
          <Link href="/tryout">
            <p>Tryout</p>
          </Link>
          <span>›</span>
          <p>{dataSoal.properties.judul}</p>
        </header>

        <div className="my-3 w-full">
          <div className="text-[10px]">
            <p className="gap-1 flex items-center">
              <span>
                <IoMenuSharp />
              </span>{" "}
              {dataSoal.properties.materi.reduce(
                (total, m) => total + (m.data_soal?.length || 0),
                0,
              )}{" "}
              Soal
            </p>
            <p className="gap-1 flex items-center">
              <span>
                <GiSandsOfTime />
              </span>{" "}
              {dataSoal.properties.waktu} Menit Waktu Pengerjaan
            </p>
          </div>

          {/* ── TOMBOL KERJAKAN ── */}
          <button
            onClick={() => {
              if (!bisaDiklik) return;
              setOpen(true);
            }}
            disabled={!bisaDiklik}
            className={`bg-primary text-white px-4 py-2 rounded font-poppins my-3 text-xs
              ${bisaDiklik ? "hover:bg-primary cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
          >
            {bisaDiklik
              ? dataSoal &&
                (dataSoal.length > 0 ? "Ulangi latihan" : "Kerjakan latihan")
              : statuses.every((s) => s.ended)
                ? "Periode Berakhir"
                : "Belum Tersedia"}
          </button>

          {/* Keterangan periode */}
          {periodeInfo && (
            <p className={`text-[10px] ${periodeInfo.color}`}>
              {periodeInfo.text}
            </p>
          )}

          {/* Modal konfirmasi mulai latihan */}
          {open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center font-poppins bg-gray-300/60 backdrop-blur-sm">
              <div className="bg-white rounded-md shadow-md max-w-md w-full p-6 space-y-4">
                <h2 className="text-lg font-bold text-center">
                  Harap dibaca terlebih dahulu
                </h2>
                <ul className="text-sm list-decimal list-outside pl-6 text-gray-700 space-y-1 text-justify">
                  <li>
                    Pastikan Anda membuka situs ini melalui browser (disarankan
                    menggunakan Google Chrome).
                  </li>
                  <li>
                    Setelah Anda memulai latihan soal, waktu akan langsung
                    berjalan dan tidak dapat dijeda. Pastikan Anda memiliki
                    waktu yang cukup sebelum memulai.
                  </li>
                  <li>
                    Jika waktu habis, jawaban Anda akan terkirim secara
                    otomatis.
                  </li>
                </ul>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setOpen(false)}
                    className="border border-red-500 text-red-600 px-4 py-1 rounded hover:bg-red-50 text-sm"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => handleLatihan()}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded text-sm"
                  >
                    Mulai Sekarang
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6 bg-white">
          <div className="relative">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <button
                className={`${!detailPurchased.isFreeTO ? "" : "disabled pointer-events-none"}`}
                type="button"
                onClick={() =>
                  handleNavigation(
                    `/detail-to/statistik?program_id=${dataSoal.id}&jenis=Tryout&title=${dataSoal.properties.judul}`,
                  )
                }
              >
                <CardMenu
                  icon={<BarChart2 size={32} />}
                  label="Statistik Nilai"
                  color="bg-white shadow-md cursor-pointer"
                  textColor="text-blue-600"
                  border="border-gray-200"
                />
              </button>
              <button
                className={`${!detailPurchased.isFreeTO ? "" : "disabled pointer-events-none"}`}
                type="button"
                onClick={() =>
                  handleNavigation(
                    `rapor?id=${dataSoal.id}&jenis=Tryout&title=${dataSoal.properties.judul}`,
                  )
                }
              >
                <CardMenu
                  icon={<Award size={32} />}
                  label="Rapor"
                  color="bg-white shadow-md cursor-pointer"
                  textColor="text-yellow-600"
                  border="border-gray-200"
                />
              </button>
              <button
                className={`${!detailPurchased.isFreeTO ? "" : "disabled pointer-events-none"}`}
                type="button"
                onClick={() =>
                  handleNavigation(
                    `pembahasan?program_id=${dataSoal.id}&jenis=Tryout&title=${dataSoal.properties.judul}`,
                  )
                }
              >
                <CardMenu
                  icon={<BookOpen size={32} />}
                  label="Pembahasan"
                  color="bg-white shadow-md cursor-pointer"
                  textColor="text-green-600"
                  border="border-gray-200"
                />
              </button>
              <button
                className={`${!detailPurchased.isFreeTO ? "" : "disabled pointer-events-none"}`}
                type="button"
                onClick={() =>
                  handleNavigation(
                    `/detail-to/waktu-pengerjaan?program_id=${dataSoal.id}&jenis=Tryout&title=${dataSoal.properties.judul}`,
                  )
                }
              >
                <CardMenu
                  icon={<Clock size={32} />}
                  label="Waktu Pengerjaan"
                  color="bg-white shadow-md cursor-pointer"
                  textColor="text-pink-600"
                  border="border-gray-200"
                />
              </button>
            </div>

            {/* Overlay 1: Belum beli premium */}
            {detailPurchased.isFreeTO && (
              <div className="absolute inset-0 z-10 rounded-xl bg-gray-900/40 flex items-center justify-center">
                <div className="text-center px-3 sm:px-5 max-w-[90%]">
                  <div className="flex justify-center mb-3 sm:mb-4">
                    <Lock className="text-white/90 w-[clamp(28px,6vw,56px)] h-[clamp(28px,6vw,56px)]" />
                  </div>
                  <p className="text-white font-semibold text-[clamp(12px,2.5vw,18px)]">
                    Fitur ini dikunci
                  </p>
                  <p className="text-white/80 mt-1 text-[clamp(10px,2vw,14px)] leading-snug">
                    Upgrade ke premium untuk menikmati semua fitur
                  </p>
                  <button
                    onClick={() => router.push(`/detail-to/${dataLatihan?.id}`)}
                    className="mt-3 sm:mt-4 px-[clamp(12px,3vw,24px)] py-[clamp(6px,1.5vw,10px)]
                      bg-orange-500 hover:bg-orange-600 text-white font-semibold
                      text-[clamp(10px,2vw,14px)] rounded-md shadow-md transition"
                  >
                    Upgrade Sekarang
                  </button>
                </div>
              </div>
            )}

            {/* Overlay 2: Pembahasan belum dibuka */}
            {!detailPurchased.isFreeTO &&
              (dataLatihan?.op_pembahasan || openPembahasan) &&
              (dataLatihan.op_pembahasan !== "" || openPembahasan) &&
              new Date() <
                new Date(dataLatihan.op_pembahasan || openPembahasan) && (
                <div className="absolute inset-0 z-10 rounded-xl bg-gray-900/40 flex items-center justify-center">
                  <div className="text-center px-3 sm:px-5 max-w-[90%]">
                    <div className="flex justify-center mb-3 sm:mb-4">
                      <svg
                        className="text-white/90 w-[clamp(28px,6vw,56px)] h-[clamp(28px,6vw,56px)]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-white font-semibold text-[clamp(12px,2.5vw,18px)]">
                      Pembahasan Belum Dibuka
                    </p>
                    <p className="text-white/80 mt-1 text-[clamp(10px,2vw,14px)] leading-snug">
                      Akan dibuka pada{" "}
                      <span className="font-semibold text-orange-300">
                        {new Date(
                          dataLatihan.op_pembahasan || openPembahasan,
                        ).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </p>
                  </div>
                </div>
              )}
          </div>

          {/* Panel Nilai */}
          <div className="border border-gray-300 rounded-md p-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="flex flex-col items-center">
                <div className="relative w-[120px] h-[120px]">
                  <svg
                    viewBox="0 0 36 36"
                    className="w-full h-full -rotate-90deg"
                  >
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9155"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="3"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9155"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      strokeDasharray="100, 100"
                      strokeDashoffset={100 - (totalSkor / maxPoin) * 100}
                      strokeLinecap="round"
                      style={{ transition: "stroke-dashoffset 0.8s ease" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-xl">
                    {totalSkor}
                    <span className="text-gray-500 text-sm">/{maxPoin}</span>
                  </div>
                </div>
                <div className="flex gap-3 mt-2 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-blue-500 rounded-full" />
                    Poin terakhir
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-gray-300 rounded-full" />
                    Maksimal Poin
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
                {(() => {
                  const mergedMateri = dataSoal.properties.materi.reduce(
                    (acc, curr) => {
                      const existing = acc.find(
                        (item) => item.nama === curr.nama,
                      );
                      if (existing) {
                        existing.passing = (
                          Number(existing.passing) + Number(curr.passing)
                        ).toString();
                        existing.data_soal = [
                          ...existing.data_soal,
                          ...curr.data_soal,
                        ];
                      } else {
                        acc.push({ ...curr });
                      }
                      return acc;
                    },
                    [],
                  );

                  return mergedMateri.map((item, index) => {
                    const materi = detailMateri.find(
                      (m) => m.nama_materi === item.nama,
                    );
                    return (
                      <NilaiCard
                        key={index}
                        label={item.nama}
                        value={materi ? materi.totalPoin : 0}
                        grade={item.passing}
                        status={materi ? materi.status : "Belum Dikerjakan"}
                      />
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
      <LoadingModal show={loading} />
    </>
  );
}

function CardMenu({ icon, label, color, textColor, border }) {
  return (
    <div
      className={`p-[clamp(10px,2vw,16px)] border aspect-square rounded-xl
      flex flex-col items-center justify-center gap-[clamp(6px,1.5vw,10px)]
      transition ${color} ${border} ${textColor}`}
    >
      <div className="flex items-center justify-center w-[clamp(28px,6vw,48px)] h-[clamp(28px,6vw,48px)]">
        {React.cloneElement(icon, {
          className: "w-full h-full",
          strokeWidth: 1.8,
        })}
      </div>
      <span className="font-semibold text-center leading-tight text-[clamp(10px,2.3vw,14px)]">
        {label}
      </span>
    </div>
  );
}

function NilaiCard({ label, value, grade }) {
  return (
    <div
      className="aspect-square w-full max-w-[220px] mx-auto rounded-xl border border-orange-200
      bg-linear-to-br from-orange-50 to-white shadow-sm flex flex-col items-center justify-center text-center p-4"
    >
      <p className="text-[clamp(11px,2vw,14px)] text-gray-500 font-medium mb-1">
        {label}
      </p>
      <div className="flex items-end gap-1">
        <span className="text-[clamp(26px,6vw,36px)] font-bold text-orange-600">
          {value}
        </span>
        <span className="text-[clamp(10px,2vw,14px)] text-gray-400 mb-1">
          poin
        </span>
      </div>
      <div className="mt-2 text-[clamp(10px,2vw,13px)] text-gray-600">
        Passing Grade
        <span className="block font-semibold text-gray-800">{grade}</span>
      </div>
    </div>
  );
}

function hitungMaxPoin(datasoal = []) {
  return datasoal.reduce((total, soal) => {
    const maxOpsi = Math.max(
      ...(soal.opsi || []).map((o) => Number(o.poin) || 0),
      0,
    );
    return total + maxOpsi;
  }, 0);
}
