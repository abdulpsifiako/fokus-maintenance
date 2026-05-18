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
      // //  //  console.log(error);
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

    // ✅ Pindah ke luar try-catch agar bisa diakses di catch
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

    // ✅ Deklarasi data di luar try-catch
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
        dispatch(addDataLatihan(data)); // ✅ bisa diakses
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
        dispatch(addDataLatihan(data)); // ✅ bisa diakses
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
        dispatch(addDataLatihan(data)); // ✅ sekarang bisa diakses di catch
        await router.push(`/detail-to/${item.id}`);
      }
    }
  };

  return (
    <div className="w-full font-poppins">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data &&
          data.data.map((card) => (
            <div
              key={card.id}
              // onClick={() => router.push(`/detail-to/${card.id}`)}
              onClick={async () => {
                if (!token) {
                  router.push("/auth/login");
                  return;
                }
                setLoading(true); // tampilkan modal langsung

                try {
                  await Promise.all([
                    handleBeliAkses(card),
                    new Promise((resolve) => setTimeout(resolve, 2000)), // minimal tampil 2 detik
                  ]);
                } catch (error) {
                  // //  //  console.log(error)
                } finally {
                  setLoading(false); // sembunyikan modal setelah semua selesai
                }
              }}
              className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition hover:scale-[1.02] bg-white flex flex-col cursor-pointer"
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

                <div className="absolute inset-0 bg-black/10"></div>
              </div>

              {/* Info */}
              <div className="text-primary p-2 font-bold text-sm">
                <p className="leading-4">{card.properties?.judul}</p>
                {/* <p className="text-xs">{card.properties?.jenis}</p> */}
              </div>
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

              {/* Judul & Deskripsi */}
              <div className="px-3">
                {/* <p className="text-sm font-bold text-secondary">{card.title}</p> */}
                <p className="text-xs text-justify text-gray-700 mt-1 mb-4 leading-relaxed line-clamp-3">
                  {card.properties.deskripsi}
                </p>
              </div>

              {/* Divider */}
              {/* <div className="border-t border-gray-200 mx-3 mt-auto"></div> */}

              {/* Tombol */}
              <div className="px-3 pb-3 mt-auto hover:cursor-pointer">
                <button className="bg-red-700 hover:bg-red-800 hover:cursor-pointer w-full text-white text-xs py-2 rounded font-semibold">
                  Lihat Selengkapnya
                </button>
              </div>
            </div>
          ))}
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
