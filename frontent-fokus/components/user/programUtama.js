import Image from "next/image";
import Pagination from "./paginasi";
import { useCallback, useEffect, useState } from "react";
import { getProgramUtama } from "@/lib/axios/programUtama";
import { useRouter } from "next/router";
import LoadingModal from "../public/loadingModal";

export default function ProgramUtamaCard({ filterBar, search, filter }) {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const router = useRouter();
  const [data, setData] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await getProgramUtama(
        currentPage,
        limit,
        search,
        filter,
        null,
        filterBar === "Semua" ? "" : filterBar,
      );
      if (res.status === 200) {
        setData(res.data);
      }
    } catch (error) {
      // //  //  console.log(error);
    }
  }, [search, filter, filterBar, limit, currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="w-full font-poppins">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data &&
          data.data.map((card) => (
            <div
              key={card.id}
              onClick={async () => {
                setLoading(true);
                try {
                  await Promise.all([
                    router.push(`/detail/${card.id}`),
                    new Promise((resolve) => setTimeout(resolve, 2000)),
                  ]);
                } finally {
                  setLoading(false);
                }
              }}
              className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition hover:scale-[1.02] bg-white flex flex-col cursor-pointer"
            >
              {/* Banner */}
              <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                <Image
                  src={
                    card.properties?.banner
                      ? `${process.env.NEXT_PUBLIC_API_URL}/landing/images/${card.properties.banner}`
                      : "/images/default-banner.png"
                  }
                  alt={card.properties?.name ?? "Kelas"}
                  fill
                  sizes="(max-width: 640px) 100vw,
           (max-width: 1024px) 50vw,
           25vw"
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-4">
                <h3 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2">
                  {card.properties?.name ?? "Judul kelas"}
                </h3>

                <p className="text-sm text-gray-600 text-justify leading-relaxed line-clamp-3 mb-3">
                  {card.properties?.deskripsi ?? "Deskripsi belum tersedia"}
                </p>

                {/* Harga & Durasi */}
                <div className="mt-auto flex items-center justify-between text-sm">
                  <span className="font-semibold text-primary">
                    {card.properties?.harga
                      ? `Rp ${Number(card.properties.harga).toLocaleString("id-ID")}`
                      : "Gratis"}
                  </span>

                  <span className="text-gray-500">
                    {card.properties?.durasi
                      ? `${card.properties.durasi} Bulan`
                      : "-"}
                  </span>
                </div>
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

      {/* <LoadingModal show={loading} /> */}
    </div>
  );
}
