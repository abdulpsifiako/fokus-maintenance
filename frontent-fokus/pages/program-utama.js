import { useState, useEffect, useCallback } from "react";
import BannerBeli from "../components/user/bannerBeli";
import FilterTabs from "../components/user/filterTab";
import ProgramUtamaCard from "../components/user/programUtama";
import SearchBarWithFilter from "../components/user/searchBarWithFilter";
import BannerProgramUtama from "@/components/user/bannerProgramUtama";
import Image from "next/image";
import Cookies from "js-cookie";
import { getProgramku } from "@/lib/axios/programUtama";

export default function ProgramUtama() {
  const token = Cookies.get("token");
  const [filterBar, setFilterBar] = useState("Semua");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("created_at|desc");
  const [purchasedPrograms, setPurchasedPrograms] = useState([]);
  const [jenis, setJenis] = useState("Program Utama");
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

  return (
    <div className="landing-page font-poppins">
      <BannerProgramUtama />

      <div className="p-7 font-poppins">
        {/* SECTION: Program yang dibeli */}
        {dataProgram && dataProgram.length > 0 && (
          <section className="mb-10">
            <h2 className="text-primary text-lg sm:text-xl font-semibold mb-3">
              Program Utamaku
            </h2>

            {/* Scroll horizontal */}
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-3">
              {dataProgram.map((program) => (
                <div
                  key={program.id}
                  onClick={() =>
                    (window.location.href = `/detail/${program.id}`)
                  }
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
                      src={`${process.env.NEXT_PUBLIC_API_URL}/landing/images/${program.properties?.banner}`}
                      alt={program.properties?.name}
                      fill
                      className="object-contain p-3"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-3 flex flex-col flex-1">
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
                      {program.properties?.name}
                    </h3>

                    <p className="text-[11px] text-gray-500 mt-1 line-clamp-1">
                      {program.valid_until
                        ? `Berlaku hingga ${new Date(
                            program.valid_until,
                          ).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}`
                        : "-"}
                    </p>
                    {/* spacer supaya tinggi seragam */}
                    <div className="mt-auto" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION: Semua Program Utama */}
        <h1 className="text-primary my-3 font-semibold text-lg sm:text-xl">
          Program Utama
        </h1>
        <FilterTabs filterBar={(param) => setFilterBar(param)} />
        <SearchBarWithFilter
          setSearch={setSearch}
          search={search}
          filter={filter}
          setFilter={setFilter}
        />
        <ProgramUtamaCard
          search={search}
          filter={filter}
          filterBar={filterBar}
        />
        {/* <BannerBeli /> */}
      </div>
    </div>
  );
}
