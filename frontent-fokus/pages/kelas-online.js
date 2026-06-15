import { useState, useEffect, useCallback } from "react";
import BannerKelasOnline from "@/components/user/bannerKelasOnline";
import FilterTabs from "../components/user/filterTab";
import SearchBarWithFilter from "../components/user/searchBarWithFilter";
import KelasOnline from "../components/user/kelasOnline";
import Pagination from "../components/user/paginasi";
import Image from "next/image";
import Cookies from "js-cookie";
import { getProgramku } from "@/lib/axios/programUtama";
import { useDispatch } from "react-redux";
import { addKelasOnline } from "@/lib/redux/store/tryout";
import { useRouter } from "next/router";
import FilterTabsKelas from "@/components/user/filterTabKelas";

export default function KelasOnlinePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const token = Cookies.get("token");
  const [filterBar, setFilterBar] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("created_at|desc");
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [jenis, setJenis] = useState("Kelas Online");
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

  const handleDetail = async (item) => {
    dispatch(addKelasOnline(item));
    router.push(`/detail-kelas/${item.id}`);
  };

  return (
    <div className="landing-page font-poppins">
      <BannerKelasOnline />

      <div className="p-7 font-poppins">
        {dataProgram && dataProgram.length > 0 && (
          <section className="mb-10">
            <h2 className="text-primary text-lg sm:text-xl font-semibold mb-3">
              Live Classku
            </h2>

            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-3">
              {dataProgram.map((kelas) => (
                <div
                  key={kelas.id}
                  onClick={() => handleDetail(kelas)}
                  className="
        w-[180px] sm:w-[200px]
        bg-white rounded-lg
        shadow-sm hover:shadow-md
        transition cursor-pointer
        shrink-0
        flex flex-col
      "
                >
                  {/* IMAGE */}
                  <div className="relative w-full aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/landing/images/${kelas.properties?.gambar}`}
                      alt={kelas.properties?.judul}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-2 flex flex-col flex-1">
                    <h3 className="text-xs font-semibold text-gray-800 line-clamp-2">
                      {kelas.properties?.judul}
                    </h3>

                    <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">
                      {kelas.properties?.deskripsi}
                    </p>

                    {/* FOOTER (posisi selalu sama) */}
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <span className="text-[10px] text-gray-400">
                        {kelas.properties?.tanggalMulai}
                      </span>

                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium
              ${
                kelas.status === "Selesai"
                  ? "bg-green-100 text-green-700"
                  : kelas.status === "Sedang Berlangsung"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600"
              }
            `}
                      >
                        {kelas.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION: Semua Kelas Online */}
        <h1 className="text-primary font-semibold text-lg sm:text-xl my-2">
          Semua Kelas Online
        </h1>
        <FilterTabsKelas filterBar={(param) => setFilterBar(param)} />
        <SearchBarWithFilter
          setSearch={setSearch}
          search={search}
          filter={filter}
          setFilter={setFilter}
        />
        <KelasOnline
          data={data}
          setData={setData}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          search={search}
          filter={filter}
          filterBar={filterBar}
        />
        {data && (
          <Pagination
            totalPages={data.totalPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
