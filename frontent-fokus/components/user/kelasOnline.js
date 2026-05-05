import { FaCalendarAlt, FaTags } from "react-icons/fa";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { getKelasOnline } from "@/lib/axios/kelasOnline";
import LoadingModal from "../public/loadingModal";
import { addKelasOnline } from "@/lib/redux/store/tryout";
import { getTransaksiPembelian } from "@/lib/axios/transaksi";
import { addTransaksiKelasOnline } from "@/lib/redux/store/transaksi";

export default function KelasOnline({
  filterBar,
  search,
  filter,
  currentPage,
  setCurrentPage,
  data,
  setData,
}) {
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("token");
  const dataUser = useSelector((state) => state.user.detail);
  const [limit, setLimit] = useState(20);
  const dispatch = useDispatch();
  const router = useRouter();

  const fetchKelasOnline = useCallback(async () => {
    try {
      const res = await getKelasOnline(
        currentPage,
        limit,
        search,
        filter,
        filterBar === "Semua" ? "" : filterBar
      );
      setData(res.data);
    } catch (error) {
      // //  //  console.log(error);
    }
  }, [currentPage, filter, search, filterBar, limit, setData]);

  useEffect(() => {
    fetchKelasOnline();
  }, [fetchKelasOnline]);

  const handleDetail = async (item) => {
    dispatch(addKelasOnline(item));
    router.push(`/detail-kelas/${item.id}`);
  };

  const isExpired = (date) => {
    const today = new Date();
    const endDate = new Date(date);
    return endDate < today;
  };

  return (
    <div className="w-full font-poppins">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data && data.data.length > 0 ? (
          data.data.map((item, i) => (
            <div
              key={i}
              onClick={async () => {
                setLoading(true); // tampilkan modal langsung

                try {
                  await Promise.all([
                    handleDetail(item),
                    new Promise((resolve) => setTimeout(resolve, 2000)), // minimal tampil 2 detik
                  ]);
                } catch (error) {
                  // //  //  console.log(error)
                } finally {
                  setLoading(false); // sembunyikan modal setelah semua selesai
                }
              }}
              className={
                "relative bg-white border border-gray-100 transition hover:scale-[1.02] rounded-2xl shadow-sm hover:shadow-md hover:border hover:border-gray-400 duration-300 flex flex-col overflow-hidden" +
                (isExpired(item.properties.tanggalBerakhir)
                  ? " cursor-not-allowed pointer-events-none opacity-80"
                  : " cursor-pointer")
              }
            >
              {/* Header */}
              <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/landing/images/${item.properties.gambar}`}
                  alt={item.properties.judul || "Kelas Online"}
                  fill
                  sizes="(max-width: 640px) 100vw,
           (max-width: 1024px) 50vw,
           25vw"
                  className="object-cover"
                />
              </div>

              {isExpired(item.properties.tanggalBerakhir) && (
                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                  <p className="text-white font-bold text-lg">Kelas Berakhir</p>
                </div>
              )}

              {/* Body */}
              <div className="p-4 text-sm flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  {/* Judul */}
                  <p className="text-base font-semibold text-gray-800 line-clamp-2">
                    {item.properties.judul}
                  </p>

                  {/* Deskripsi */}
                  <p className="text-xs text-gray-600 text-justify line-clamp-6">
                    {item.properties.deskripsi}
                  </p>

                  {/* Tanggal */}
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <FaCalendarAlt className="text-gray-400" />
                    <span>{item.properties.tanggalMulai}</span>
                  </div>

                  {/* Harga */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 font-bold text-sm text-red-700">
                      <FaTags />
                      <span>
                        Rp{" "}
                        {item.properties.diskon
                          ? parseInt(
                              item.properties.harga -
                                (item.properties.valueDiskon / 100) *
                                  item.properties.harga
                            ).toLocaleString()
                          : parseInt(item.properties.harga).toLocaleString()}
                      </span>
                    </div>

                    {item.properties.diskon && (
                      <span className="bg-green-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
                        Diskon {item.properties.valueDiskon}%
                      </span>
                    )}
                  </div>

                  {/* Harga Coret */}
                  {item.properties.diskon && (
                    <p className="text-[11px] text-gray-400 line-through ml-6">
                      Rp {parseInt(item.properties.harga).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 pb-4">
                <button className="w-full bg-red-700 cursor-pointer hover:bg-red-800 text-white text-sm py-2 rounded-lg font-medium transition">
                  Detail Kelas
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-10">
            Belum ada data
          </div>
        )}
      </div>
      <LoadingModal show={loading} />
    </div>
  );
}
