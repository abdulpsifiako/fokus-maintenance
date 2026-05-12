import { addDataLatihan } from "@/lib/redux/store/tryout";
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

// Total nilai maksimal
const totalMax = 220;

const nilai = {
  manaso: 120,
  wawancara: 65,
};

export default function DetailSummaryTO() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const token = Cookies.get("token");
  const searchParams = useSearchParams();
  const programId = searchParams.get("id");

  const [dataRapor, setDataRapor] = useState(null);

  const [userHasPurchased, setUserHasPurchased] = useState(false);
  const dataLatihan = useSelector((state) => state.tryout.dataLatihan);

  const dataSoal = useSelector((state) => state.tryout.dataSoal);

  const [open, setOpen] = useState(false);
  const detailPurchased = useSelector((state) => state.tryout.purchased);
  const total = nilai.manaso + nilai.wawancara;
  const percentManaso = (nilai.manaso / totalMax) * 100;
  const percentWawancara = (nilai.wawancara / totalMax) * 100;
  const percentSisa = 100 - (percentManaso + percentWawancara);

  const [maxPoin, setMaxPoin] = useState(0);

  const handleNavigation = async (url) => {
    try {
      setLoading(true); // tampilkan loading sebelum pindah halaman
      await new Promise((resolve) => setTimeout(resolve, 500)); // efek delay kecil agar terasa smooth
      router.push(url);
    } finally {
      setLoading(false);
    }
  };

  const handleLatihan = async () => {
    setLoading(true); // tampilkan modal loading
    await new Promise((resolve) => setTimeout(resolve, 2000)); // delay agar terlihat halus
    const transformData = (oldData) => {
      // Gabungkan semua soal dari tiap materi
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

      // Kembalikan data lengkap
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
        datasoal: allSoal, // hasil gabungan semua soal
        questions: allSoal.length,
        status: oldData.properties?.status ?? true,
      };
    };

    // Transformasikan datanya
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

      const dataSoal = raporData.properties.data_soal.datasoal;
      const dataAnswer = raporData.properties.data_answer;

      // Hitung total poin maksimum (poin tertinggi di setiap soal)
      const maxPoin = dataSoal.reduce((total, soal) => {
        if (soal.opsi.length > 0) {
          const poinTertinggi = Math.max(...soal.opsi.map((o) => o.poin));
          return total + poinTertinggi;
        }
        return total; // kalau kosong, jangan tambahkan apa pun
      }, 0);

      setMaxPoin(maxPoin);

      // 🔹 Hitung poin yang didapat per materi
      const poinPerMateri = {};
      let totalUserPoin = 0;

      Object.entries(dataAnswer).forEach(([index, jawaban]) => {
        const soal = dataSoal[index];
        if (!soal) return;

        const opsiIndex = jawaban.option;
        const poinDiperoleh = soal.opsi[opsiIndex]?.poin || 0;
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

      // Ubah ke array biar gampang dipakai di UI
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

      // Simpan semua ke state
      setDataRapor(res.data);
      setDetailMateri(hasilPerMateri);
      setTotalSkor(totalUserPoin);

      //  //  console.log("📊 Hasil per materi:", hasilPerMateri);
      //  //  console.log("🏆 Total poin user:", totalUserPoin);
      //  //  console.log("🎯 Max poin:", maxPoin);
    } catch (error) {
      //  //  console.log("❌ Gagal fetch rapor:", error);
    }
  }, [dataLatihan?.title, token]);

  const getTransaksiProgram = useCallback(async () => {
    try {
      const res = await cekTryout(dataLatihan.id, token, "Tryout");
      setUserHasPurchased(res.data);
    } catch (error) {
      // //  //  console.log(error)
    }
  }, [token, dataLatihan.id]);

  useEffect(() => {
    if (!dataLatihan) {
      router.push("/");
    }
    getTransaksiProgram();
    fetchDataAnswer();
  }, [getTransaksiProgram, fetchDataAnswer, dataLatihan, router]);

  if (!dataLatihan) {
    return null;
  }
  // useEffect(() => {
  //   const maxPoin = hitungMaxPoin(dataLatihan?.datasoal);
  //   setMaxPoin(maxPoin);
  // }, [dataLatihan?.datasoal]);

  return (
    <>
      <div className="p-7 font-poppins">
        <header className="flex space-x-2 text-xs">
          <p>Tryout</p>
          <span>›</span>
          <p>{dataSoal.properties.judul}</p>
        </header>
        <div className="my-3 w-full">
          {/* <h1 className="text-dark-primary font-semibold">Latihan</h1> */}
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
          <button
            onClick={() => setOpen(true)}
            className="bg-primary hover:bg-primary text-white px-4 py-2 rounded font-poppins my-3 text-xs"
          >
            {dataSoal &&
              (dataSoal.length > 0 ? "Ulangi latihan" : "Kerjakan latihan")}
          </button>
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
                    onClick={() => {
                      // setOpen(false);
                      handleLatihan();
                    }}
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
            {/* Menu atas */}
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
                  color={"bg-white shadow-md cursor-pointer"}
                  textColor={"text-blue-600"}
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
                  color={"bg-white shadow-md cursor-pointer"}
                  textColor={"text-yellow-600"}
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
                  color={"bg-white shadow-md cursor-pointer"}
                  textColor={"text-green-600"}
                  border="border-gray-200"
                />
              </button>
              <button
                className={`${!detailPurchased.isFreeTO ? "" : "disabled pointer-events-none"}`}
                type="button"
                onClick={() => {
                  //  //  console.log("none")
                  handleNavigation(
                    `/detail-to/waktu-pengerjaan?program_id=${dataSoal.id}&jenis=Tryout&title=${dataSoal.properties.judul}`,
                  );
                }}
              >
                <CardMenu
                  icon={<Clock size={32} />}
                  label="Waktu Pengerjaan"
                  color={"bg-white shadow-md cursor-pointer"}
                  textColor={"text-pink-600"}
                  border="border-gray-200"
                />
              </button>
            </div>
            {/* Overlay 1: Belum beli (isFreeTO) */}
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

            {/* Overlay 2: Pembahasan belum dibuka (hanya jika bukan isFreeTO) */}
            {!detailPurchased.isFreeTO &&
              dataLatihan?.op_pembahasan &&
              dataLatihan.op_pembahasan !== "" &&
              new Date() < new Date(dataLatihan.op_pembahasan) && (
                <div
                  className="absolute inset-0 z-10 rounded-xl bg-gray-900/40
      flex items-center justify-center"
                >
                  <div className="text-center px-3 sm:px-5 max-w-[90%]">
                    {/* Icon kalender */}
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0
              002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>

                    <p className="text-white font-semibold text-[clamp(12px,2.5vw,18px)]">
                      Pembahasan Belum Dibuka
                    </p>

                    <p className="text-white/80 mt-1 text-[clamp(10px,2vw,14px)] leading-snug">
                      Akan dibuka pada{" "}
                      <span className="font-semibold text-orange-300">
                        {new Date(dataLatihan.op_pembahasan).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )}
                      </span>
                    </p>
                  </div>
                </div>
              )}
          </div>

          {/* Panel Nilai */}
          <div className="border border-gray-300 rounded-md p-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Donut Chart */}
              <div className="flex flex-col items-center">
                <div className="relative w-[120px] h-[120px]">
                  <svg
                    viewBox="0 0 36 36"
                    className="w-full h-full -rotate-90deg"
                  >
                    {/* Latar lingkaran penuh (maks poin) */}
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9155"
                      fill="none"
                      stroke="#e5e7eb" // abu-abu netral
                      strokeWidth="3"
                    />
                    {/* Garis progres (poin didapat) */}
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9155"
                      fill="none"
                      stroke="#3b82f6" // biru
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
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                    Poin terakhir
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
                    Maksimal Poin
                  </div>
                </div>
              </div>
              {/* Detail Nilai */}
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
                {(() => {
                  // 🔹 Gabungkan data materi yang sama berdasarkan nama
                  const mergedMateri = dataSoal.properties.materi.reduce(
                    (acc, curr) => {
                      const existing = acc.find(
                        (item) => item.nama === curr.nama,
                      );

                      if (existing) {
                        // Tambahkan nilai passing
                        existing.passing = (
                          Number(existing.passing) + Number(curr.passing)
                        ).toString();

                        // Gabungkan data_soal juga (opsional)
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

                  // 🔹 Render hasil gabungan
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

// Komponen Menu Atas
// function CardMenu({ icon, label, color, textColor, border }) {
//   return (
//     <div
//       className={`p-4 border rounded-md flex flex-col items-center ${color} ${border} ${textColor}`}
//     >
//       {icon}
//       <span className="mt-2 font-semibold text-sm text-center">{label}</span>
//     </div>
//   );
// }

function CardMenu({ icon, label, color, textColor, border }) {
  return (
    <div
      className={`
        p-[clamp(10px,2vw,16px)]
        border aspect-square rounded-xl
        flex flex-col items-center justify-center
        gap-[clamp(6px,1.5vw,10px)]
        transition
        ${color} ${border} ${textColor}
      `}
    >
      {/* ICON */}
      <div
        className="
          flex items-center justify-center
          w-[clamp(28px,6vw,48px)]
          h-[clamp(28px,6vw,48px)]
        "
      >
        {React.cloneElement(icon, {
          className: "w-full h-full",
          strokeWidth: 1.8,
        })}
      </div>

      {/* LABEL */}
      <span
        className="
          font-semibold text-center leading-tight
          text-[clamp(10px,2.3vw,14px)]
        "
      >
        {label}
      </span>
    </div>
  );
}

// Komponen Kartu Nilai
function NilaiCard({ label, value, grade }) {
  return (
    <div
      className="
        aspect-square
        w-full
        max-w-[220px]
        mx-auto
        rounded-xl
        border border-orange-200
        bg-linear-to-br from-orange-50 to-white
        shadow-sm
        flex flex-col
        items-center
        justify-center
        text-center
        p-4
      "
    >
      {/* LABEL */}
      <p className="text-[clamp(11px,2vw,14px)] text-gray-500 font-medium mb-1">
        {label}
      </p>

      {/* VALUE */}
      <div className="flex items-end gap-1">
        <span className="text-[clamp(26px,6vw,36px)] font-bold text-orange-600">
          {value}
        </span>
        <span className="text-[clamp(10px,2vw,14px)] text-gray-400 mb-1">
          poin
        </span>
      </div>

      {/* PASSING GRADE */}
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
