import Image from "next/image";
import Pagination from "./paginasi";
import { ImBook } from "react-icons/im";
import { IoMdTime } from "react-icons/io";
import { LuNotepadText } from "react-icons/lu";
import { useCallback, useEffect, useState } from "react";
import { cekTryout, getTryout } from "@/lib/axios/tryout";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { addTransaksiProgramUtama } from "@/lib/redux/store/transaksi";
import ModalLanjutkan from "./modalLanjutkan";
import Cookies from "js-cookie";
import {
  addDataLatihan,
  addDataSoalTO,
  addDetailPurchased,
  resetDetailPurchased,
} from "@/lib/redux/store/tryout";
import LoadingModal from "../public/loadingModal";

// ─── PERIODE HELPERS ──────────────────────────────────────────────────────────

const toDay = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return d;
};

const todayDay = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Cek apakah hari ini berada di dalam periode [start, end].
 * Jika start kosong → tidak ada batas awal.
 * Jika end kosong   → tidak ada batas akhir.
 */
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
 * Cek apakah card bisa diklik berdasarkan periode pengerjaan.
 * Bisa diklik jika setidaknya SATU fitur (Gratis atau Premium) sedang
 * dalam periode pengerjaan aktif.
 * Jika suatu fitur tidak ada periodenya (kosong semua) → dianggap aktif.
 */
const getStatusPeriode = (props) => {
  const fiturList = props?.fitur || [];

  // Kumpulkan status tiap fitur yang ada
  const statuses = fiturList.map((fitur) => {
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

  // Bisa diklik jika ada minimal 1 fitur yang aktif
  const bisaDiklik = statuses.some((s) => s.aktif);

  return { statuses, bisaDiklik };
};

// ─── BADGE PERIODE (keterangan kecil di card) ────────────────────────────────

function PeriodeBadge({ fitur, start, end }) {
  const now = todayDay();
  const aktif = isInPeriode(start, end);
  const ended = isPeriodeEnded(end);
  const belum = !isPeriodeStarted(start);

  // Jika tidak ada periode sama sekali → tidak perlu ditampilkan
  if (!start && !end) return null;

  let text = "";
  let style = "";

  if (ended) {
    text = `${fitur} berakhir ${fmtDate(end)}`;
    style = "bg-red-50 text-red-500 border-red-100";
  } else if (belum) {
    const diff = Math.round((toDay(start) - now) / 86400000);
    text = `${fitur} mulai ${diff} hari lagi`;
    style = "bg-yellow-50 text-yellow-600 border-yellow-100";
  } else {
    // Aktif
    const diffEnd = toDay(end)
      ? Math.round((toDay(end) - now) / 86400000)
      : null;
    text =
      diffEnd !== null ? `${fitur} · ${diffEnd} hari lagi` : `${fitur} · aktif`;
    style = "bg-green-50 text-green-600 border-green-100";
  }

  return (
    <span
      className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${style}`}
    >
      {text}
    </span>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function TryoutCard({ filterBar, search, filter }) {
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("token");

  const dataUser = useSelector((state) => state.user.detail);
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const [data, setData] = useState(null);
  const [limit, setLimit] = useState(20);

  const fetchData = useCallback(async () => {
    try {
      const res = await getTryout(
        currentPage,
        limit,
        search,
        filter,
        null,
        filterBar === "Semua" ? "" : filterBar,
      );
      if (res.status === 200) {
        setData(res.data);
        setCurrentPage(res.data.page);
      }
    } catch (error) {
      // console.log(error);
    }
  }, [search, filter, filterBar, currentPage, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleBeliAkses = async (item) => {
    if (!token) {
      router.push("/auth/login");
      return;
    }

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
        link: oldData.properties?.link ?? "",
      };
    };

    const data = transformData(item);

    try {
      const res = await cekTryout(item.id, token, "Tryout");

      if (res.data.isFreeTO && res.data.isPurchase) {
        dispatch(
          addTransaksiProgramUtama({
            user_id: dataUser.id,
            jenis: "Tryout",
            program_id: item.id,
            status: "CREATED",
            program_name: item.properties.judul,
            to_data: item,
          }),
        );
        dispatch(addDetailPurchased(res.data));
        dispatch(addDataSoalTO(item));
        dispatch(addDataLatihan(data));
        await router.push(`/detail-to/${item.id}`);
      }

      if (!res.data.isFreeTO && res.data.isPurchase) {
        dispatch(
          addTransaksiProgramUtama({
            user_id: dataUser.id,
            jenis: "Tryout",
            program_id: item.id,
            status: "CREATED",
            program_name: item.properties.judul,
            to_data: item,
          }),
        );
        dispatch(addDetailPurchased(res.data));
        dispatch(addDataSoalTO(item));
        dispatch(addDataLatihan(data));
        await router.push(`/detail-to/summary?id=${item.id}`);
      }
    } catch (error) {
      if (error.status == 404) {
        dispatch(resetDetailPurchased());
        dispatch(addDataSoalTO(item));
        dispatch(
          addTransaksiProgramUtama({
            user_id: dataUser.id,
            jenis: "Tryout",
            program_id: item.id,
            status: "CREATED",
            program_name: item.properties.judul,
            to_data: item,
          }),
        );
        dispatch(addDataLatihan(data));
        await router.push(`/detail-to/${item.id}`);
      }
    }
  };

  return (
    <div className="w-full font-poppins">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data &&
          data.data.map((card) => {
            // ── Cek periode pengerjaan tiap card ─────────────────────────
            const { statuses, bisaDiklik } = getStatusPeriode(card.properties);
            const adaPeriode = statuses.some((s) => s.start || s.end);

            return (
              <div
                key={card.id}
                onClick={async () => {
                  // Blokir klik jika tidak ada token
                  if (!token) {
                    router.push("/auth/login");
                    return;
                  }
                  // Blokir klik jika semua periode pengerjaan tidak aktif
                  if (!bisaDiklik) return;

                  setLoading(true);
                  try {
                    await Promise.all([
                      handleBeliAkses(card),
                      new Promise((resolve) => setTimeout(resolve, 2000)),
                    ]);
                  } catch (error) {
                    // console.log(error)
                  } finally {
                    setLoading(false);
                  }
                }}
                className={`rounded-lg overflow-hidden shadow-md bg-white flex flex-col transition
                  ${
                    bisaDiklik
                      ? "hover:shadow-xl hover:scale-[1.02] cursor-pointer"
                      : "opacity-60 cursor-not-allowed grayscale-[30%]"
                  }`}
              >
                {/* Header Gambar */}
                <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/landing/images/${card.properties?.gambar}`}
                    alt={card.judul}
                    fill
                    sizes="(max-width: 640px) 100vw,
                     (max-width: 1024px) 50vw,
                     25vw"
                    className="object-cover"
                    priority={false}
                  />
                  <div className="absolute inset-0 bg-black/10" />

                  {/* Badge "Tidak Tersedia" di atas gambar jika tidak aktif */}
                  {!bisaDiklik && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-black/60 text-white text-[10px] font-bold px-3 py-1.5 rounded-full">
                        {statuses.every((s) => s.ended)
                          ? "Periode Berakhir"
                          : "Belum Tersedia"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Judul */}
                <div className="text-primary p-2 font-bold text-sm">
                  <p className="leading-4">{card.properties?.judul}</p>
                </div>

                {/* Info soal & waktu */}
                <div className="flex flex-wrap gap-2 text-blue-600 p-3 text-[10px] font-medium">
                  <div className="flex gap-1 items-center bg-blue-100 px-2 py-0.5 rounded">
                    <ImBook /> {card.properties.materi.length} Materi
                  </div>
                  <div className="flex bg-blue-100">
                    <div className="flex gap-1 items-center bg-blue-100 px-2 py-0.5 rounded">
                      <LuNotepadText />{" "}
                      {card.properties.materi.reduce(
                        (total, m) => total + (m.data_soal?.length || 0),
                        0,
                      )}{" "}
                      Soal
                    </div>
                    <div className="flex gap-1 items-center bg-blue-100 px-2 py-0.5 rounded">
                      <IoMdTime /> {card.properties.waktu} Menit
                    </div>
                  </div>
                </div>

                {/* Deskripsi */}
                <div className="px-3">
                  <p className="text-xs text-justify text-gray-700 mt-1 mb-3 leading-relaxed line-clamp-3">
                    {card.properties.deskripsi}
                  </p>
                </div>

                {/* ── KETERANGAN PERIODE (BARU) ── */}
                {adaPeriode && (
                  <div className="px-3 pb-2 flex flex-wrap gap-1">
                    {statuses.map((s) => (
                      <PeriodeBadge
                        key={s.fitur}
                        fitur={s.fitur}
                        start={s.start}
                        end={s.end}
                      />
                    ))}
                  </div>
                )}

                {/* Tombol */}
                <div className="px-3 pb-3 mt-auto">
                  <button
                    disabled={!bisaDiklik}
                    className={`w-full text-white text-xs py-2 rounded font-semibold transition
                      ${
                        bisaDiklik
                          ? "bg-red-700 hover:bg-red-800 cursor-pointer"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                  >
                    {bisaDiklik
                      ? "Lihat Selengkapnya"
                      : statuses.every((s) => s.ended)
                        ? "Periode Berakhir"
                        : "Belum Dibuka"}
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      {data && (
        <Pagination
          totalPages={data.totalPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}

      <LoadingModal show={loading} />
    </div>
  );
}
