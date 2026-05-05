import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { getAllFasilitator } from "@/lib/axios/fasilitator";
import { useRouter } from "next/router";

export default function FacilitatorCards() {
  const router = useRouter();
  const [dataFasilitator, setDataFasilitator] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(100);
  const [sortBy] = useState("created_at|asc");

  const fetchData = useCallback(async () => {
    try {
      const res = await getAllFasilitator(page, limit, "", sortBy);
      if (res.status === 200) {
        setDataFasilitator(res.data.data); // ambil array saja
        setPage(res.data.page);
      }
    } catch (error) {
      // //  //  console.log(error);
    }
  }, [page, limit, sortBy]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Gandakan array supaya animasi tidak "putus"
  const facilitators = [...dataFasilitator, ...dataFasilitator];

  return (
    <div className="py-7 font-poppins my-7 overflow-hidden">
      {/* Wrapper animasi */}
      <div className="relative w-full overflow-hidden">
        <div className="flex gap-6 animate-scroll">
          {facilitators
            .map((item, i) => (
              <div
                key={i}
                className="relative rounded-xl shadow hover:shadow-md transition-all overflow-hidden w-[380px] shrink-0"
              >
                <div className="relative z-0 flex justify-center p-4">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/landing/images/${item.image}`}
                    width={500}
                    height={500}
                    alt={item.name}
                    className="object-cover w-3/4 h-[300px]"
                  />
                </div>

                <div className="relative z-10 -mt-10 bg-secondary text-white rounded-b-xl px-6 pt-14 pb-5 h-full">
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
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => router.push("/tim-fasilitator")}
            className="font-semibold text-primary text-sm hover:underline flex items-center justify-center gap-2 mx-auto"
          >
            Lihat Selengkapnya →
          </button>
        </div>
      </div>

      {/* Animasi scroll */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-scroll {
          display: flex;
          width: max-content;
          animation: scroll 60s linear infinite;
          will-change: transform;
        }
      `}</style>
    </div>
  );
}
