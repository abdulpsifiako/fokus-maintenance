import { getAllTestimoniUser } from "@/lib/axios/testimoni";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export default function TestFeed() {
    const router = useRouter()
    const [data, setData] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sortBy, setSortBy] = useState("created_at|desc");

    const fetchTestimonials = useCallback(async () => {
      try {
        const res = await getAllTestimoniUser(page, limit, search, sortBy);
        setData(res.data)
        setPage(res.data.page);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    }, [page, limit, search, sortBy]);

    useEffect(() => {
      fetchTestimonials();
    }, [fetchTestimonials]);
    
  return (
    <section className="font-poppins py-12 px-6 sm:px-10 bg-linier-to-b from-gray-50 to-white overflow-hidden">
      {/* Judul */}
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
          Kata Mereka tentang <span className="text-primary">FokusEdu</span>
        </h2>
        <p className="text-gray-600 text-sm sm:text-base mt-3 max-w-2xl mx-auto">
          Cerita nyata dari mereka yang telah berhasil mencapai impian bersama FokusEdu.
        </p>
      </div>

      {/* Wrapper animasi */}
      <div className="relative w-full overflow-hidden">
        <div className="flex gap-6 animate-scroll px-2">
          {
            data && (
              data.data.map((item, i) => (
                <div
                  key={i}
                  className="group bg-white border border-gray-100 rounded-2xl p-6 w-[290px] sm:w-[330px] shrink-0 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4 border-b border-primary/20 pb-3">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/landing/images/${item.properties.photo}`}
                      width={50}
                      height={50}
                      alt={item.properties.nama}
                      className="rounded-full object-cover h-12 w-12 border border-primary/40"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 truncate w-48 block">{item.properties.nama}</h4>
                      <p className="text-xs text-gray-500 leading-snug">{item.properties.profesi}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed text-justify italic line-clamp-6 hover:line-clamp-none transition-all duration-100 ease-in-out">
                    “{item.properties.deskripsi}”
                  </p>
                </div>
              ))
            )
          }
        </div>
      </div>

      {/* Tombol */}
      <div className="text-center mt-8">
        <button type="button" onClick={()=> router.push('/testimoni')} className="font-semibold text-sm text-primary hover:underline flex items-center justify-center gap-1 mx-auto">
          Lihat Selengkapnya →
        </button>
      </div>

      {/* Style untuk animasi scroll */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          display: flex;
          width: max-content;
          animation: scroll 70s linear infinite;
          will-change: transform;
        }

        @media (max-width: 640px) {
          .animate-scroll {
            animation-duration: 100s;
          }
        }
      `}</style>
    </section>
  );
}
