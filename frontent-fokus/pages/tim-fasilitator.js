import { useCallback, useEffect, useState } from "react";
import { getAllFasilitator } from "@/lib/axios/fasilitator";
import Image from "next/image";

export default function TimFasilitator() {
  const [dataFasilitator, setDataFasilitator] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(100);
  const [sortBy] = useState("created_at|desc");

  const fetchData = useCallback(async () => {
    try {
      const res = await getAllFasilitator(page, limit, "", sortBy);
      if (res.status === 200) {
        setDataFasilitator(res.data.data);
        setPage(res.data.page);
      }
    } catch (error) {
      // //  //  console.log(error);
    }
  }, [page, limit, sortBy]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <div className="px-7 mt-3 font-poppins">
        <header className="flex mx-3.5 space-x-2 text-xs">
          <p>Tentang</p>
          <span>›</span>
          <p>Tim Fasilitator</p>
        </header>
      </div>
      <div className="px-7 mt-1 font-poppins mb-3">
        {/* Title */}
        <h2 className="text-2xl lg:text-3xl text-center font-bold mb-10 text-primary">
          Kenalan dengan Para Fasilitator Terbaik
        </h2>

        {/* Grid Responsif */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-4 justify-items-center">
          {dataFasilitator
            .map((item, i) => (
              <div
                key={i}
                className="relative rounded-xl shadow hover:shadow-md transition-all overflow-hidden w-[380px] shrink-0"
              >
                <div className="relative z-0 flex justify-center p-4 hover:scale-110 transition-all duration-500">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/landing/images/${item.image}`}
                    width={500}
                    height={500}
                    alt={item.name}
                    className="object-cover w-3/4 h-[300px]"
                  />
                </div>

                <div className="relative z-10 -mt-10 bg-secondary text-white rounded-3xl px-6 pt-14 pb-5 mb-5 h-full">
                  <h4 className="font-bold text-lg text-center">{item.name}</h4>
                  <p className="text-xs text-gray-100 text-center">
                    {item.jobdesk}
                  </p>
                  <hr className="border-t border-dashed border-gray-300 my-2" />
                  <h5 className="font-semibold m-2 text-center">
                    Pengalaman & Prestasi
                  </h5>
                  <ul className="list-disc pl-4 text-sm space-y-2">
                    {item.properties?.map((prop, idx) => (
                      <li
                        key={idx}
                        className="leading-snug flex items-start gap-2"
                      >
                        <span className="text-primary bg-gray-200 rounded-full p-2 w-5 h-5 flex items-center justify-center text-xs mt-1">
                          ✔
                        </span>
                        <span className="text-justify items-center mt-auto leading-relaxed text-xs">
                          {prop}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
            .reverse()}
        </div>

        {/* Jika kosong */}
        {dataFasilitator.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            Belum ada fasilitator yang ditampilkan.
          </p>
        )}
      </div>
    </>
  );
}
