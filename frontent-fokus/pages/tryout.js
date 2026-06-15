import { useState, useEffect, useCallback } from "react";
import BannerTryout from "@/components/user/bannerTryout";
import Banner from "../components/user/banner";
import FilterTabs from "../components/user/filterTab";
import SearchBarWithFilter from "../components/user/searchBarWithFilter";
import TryoutCard from "../components/user/tryOutCard";
import Image from "next/image";
import Cookies from "js-cookie";
import { getProgramku } from "@/lib/axios/programUtama";
import { addTransaksiProgramUtama } from "@/lib/redux/store/transaksi";
import {
  addDataLatihan,
  addDataSoalTO,
  addDetailPurchased,
} from "@/lib/redux/store/tryout";
import LoadingModal from "@/components/public/loadingModal";
import { cekTryout } from "@/lib/axios/tryout";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import FilterTabsTo from "@/components/user/filterTabTo";

export default function TryOuts() {
  const router = useRouter();
  const dataUser = useSelector((state) => state.user.detail);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("token");
  const [filterBar, setFilterBar] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("created_at|desc");

  const [jenis, setJenis] = useState("Tryout");
  const [dataProgram, setDataProgram] = useState(null);

  const fetchProgramku = useCallback(
    async (params) => {
      if (!token) {
        return;
      }
      const res = await getProgramku(jenis, token);
      setDataProgram(res.data);
    },
    [jenis, token],
  );

  useEffect(() => {
    fetchProgramku();
  }, [fetchProgramku]);

  const handleBeliAkses = async (item) => {
    if (!token) {
      router.push("/auth/login");
      return;
    }
    try {
      const res = await cekTryout(item.id, token, "Tryout");

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
          op_pembahasan: oldData.properties?.op_pembahasan ?? "",
        };
      };

      // Transformasikan datanya
      const data = transformData(item);

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
      // //  //  console.log(error)
      if (error.status == 404) {
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
    <div className="landing-page font-poppins">
      <BannerTryout />

      <div className="p-7 font-poppins">
        {dataProgram && dataProgram.length > 0 && (
          <section className="mb-10">
            <h2 className="text-primary text-lg sm:text-xl font-semibold mb-3">
              Try Outku
            </h2>

            {/* Scroll horizontal */}
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-3">
              {dataProgram.map((tryout) => (
                <div
                  key={tryout.id}
                  onClick={async () => {
                    setLoading(true);
                    try {
                      await Promise.all([
                        handleBeliAkses(tryout),
                        new Promise((resolve) => setTimeout(resolve, 2000)),
                      ]);
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="
        w-[200px]
        shrink-0
        bg-white
        rounded-xl
        shadow-sm
        hover:shadow-md
        hover:scale-[1.02]
        transition
        cursor-pointer
        flex flex-col
      "
                >
                  {/* IMAGE */}
                  <div className="relative w-full aspect-square bg-gray-50 rounded-t-xl overflow-hidden">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/landing/images/${tryout.properties?.gambar}`}
                      alt={tryout.properties?.judul}
                      fill
                      className="object-contain p-3"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-3 flex flex-col flex-1">
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
                      {tryout.properties?.judul}
                    </h3>

                    <p className="text-[11px] text-gray-500 mt-1 line-clamp-1">
                      {tryout.kategori}
                    </p>

                    {/* FOOTER */}
                    <div className="mt-auto pt-2 flex items-center justify-between text-xs">
                      <span
                        className={`font-medium ${
                          tryout.status === "Selesai"
                            ? "text-green-600"
                            : tryout.status === "Sedang Berlangsung"
                              ? "text-blue-600"
                              : "text-gray-500"
                        }`}
                      >
                        {tryout.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION: Semua Tryout */}
        <h1 className="text-primary my-3 font-semibold text-lg sm:text-xl">
          Try Out
        </h1>
        <FilterTabsTo filterBar={(param) => setFilterBar(param)} />
        <SearchBarWithFilter
          setSearch={setSearch}
          search={search}
          filter={filter}
          setFilter={setFilter}
        />
        <TryoutCard search={search} filter={filter} filterBar={filterBar} />
      </div>
      <LoadingModal show={loading} />
    </div>
  );
}
