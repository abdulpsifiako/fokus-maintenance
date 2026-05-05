"use client";

import { getAllTestimoniUser } from "@/lib/axios/testimoni";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Testimoni() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState("created_at|desc");
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loaderRef = useRef(null);

  // ✅ FIX 1: Simpan loading & hasMore di ref
  // supaya tidak jadi dependency yang bikin fungsi/effect berulang
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);

  // ✅ FIX 2: Tidak pakai useCallback — fetch langsung di useEffect
  // hanya bergantung pada page, search, sortBy
  useEffect(() => {
    const fetchTestimonials = async () => {
      if (loadingRef.current || !hasMoreRef.current) return;

      loadingRef.current = true;
      setLoading(true);

      try {
        const res = await getAllTestimoniUser(page, limit, search, sortBy);
        const { data, nextPage } = res.data;

        setItems((prev) => (page === 1 ? data : [...prev, ...data]));

        const more = !!(nextPage && data.length >= limit);
        hasMoreRef.current = more;
        setHasMore(more);
      } catch (err) {
        console.error(err);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [page, search, sortBy]);
  // ⚠️ sengaja tidak include limit — nilainya tidak pernah berubah

  // ✅ FIX 3: Reset ke page 1 saat search/sort berubah
  useEffect(() => {
    hasMoreRef.current = true;
    setHasMore(true);
    setItems([]);
    setPage(1);
  }, [search, sortBy]);

  // ✅ FIX 4: Observer hanya dipasang saat tidak loading & masih ada data
  useEffect(() => {
    if (loading || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loadingRef.current) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 },
    );

    const el = loaderRef.current;
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, [loading, hasMore]);

  return (
    <>
      <div className="px-7 mt-3 font-poppins">
        <header className="flex mx-3.5 space-x-2 text-xs">
          <p>Tentang</p>
          <span>›</span>
          <p>Testimoni</p>
        </header>
      </div>

      <div className="font-poppins">
        <h2 className="text-2xl lg:text-3xl text-center font-bold text-primary">
          Kata Mereka tentang FokusEdu
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-7">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src={
                    item.properties.photo
                      ? `${process.env.NEXT_PUBLIC_API_URL}/landing/images/${item.properties.photo}`
                      : "/9720011.jpg"
                  }
                  width={60}
                  height={60}
                  alt={item.name}
                  className="rounded-full object-cover h-14 w-14 border border-gray-200"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 truncate w-full block">
                    {item.properties.nama}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {item.properties.profesi}
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed text-justify italic line-clamp-6 hover:line-clamp-none transition-all duration-300">
                &quot;{item.properties.deskripsi}&quot;
              </p>
            </div>
          ))}
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="text-center py-4 text-primary font-medium">
            Memuat...
          </div>
        )}

        {/* Element untuk Observer */}
        <div ref={loaderRef} className="h-10"></div>

        {!hasMore && items.length > 0 && (
          <div className="text-center text-gray-400 py-4 text-sm">
            Semua testimoni sudah ditampilkan
          </div>
        )}

        <div className="flex justify-center p-7">
          <h1 className="p-5 bg-primary max-w-2xl text-sm text-white rounded-md shadow-md text-center">
            "Dan masih banyak lagi sobat Fokus yang telah merasakan perubahan
            nyata bersama kami. Kini giliran kamu untuk meraih mimpimu bersama
            FokusEdu."
          </h1>
        </div>
      </div>
    </>
  );
}
