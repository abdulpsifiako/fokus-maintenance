import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";
import { getInstagramPosts } from "@/lib/axios/landing";

export default function IgFeeds() {
  const [instagramPosts, setInstagramPosts] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await getInstagramPosts();
        setInstagramPosts(response.data || []);
      } catch (error) {
        console.error("ERROR DURING FETCH INSTAGRAM POSTS", error);
      }
    })();
  }, []);

  return (
    <section className="font-poppins px-6 sm:px-10 py-12 bg-gray-50">
      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl font-bold text-primary text-center">
        Informasi Terbaru Kami
      </h1>

      {/* Grid Feed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-7">
        {instagramPosts.length > 0 ? (
          instagramPosts.map((post, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
            >
              {/* Gambar */}
              <div className="relative w-full aspect-square flex items-center justify-center">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/landing/images/${post.imageUrl}`}
                  alt={post.judul || "fokusedu instagram"}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Konten */}
              <div className="flex flex-col grow p-5 space-y-3 justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-2">
                    {post.judul}
                  </h2>

                  <p
                    className="
                    text-sm text-gray-600 text-justify leading-relaxed
                    line-clamp-4 
                    min-h-20
                  "
                  >
                    {post.deskripsi}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-3">
                  <Link
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button
                      type="button"
                      className="px-4 py-2 bg-primary text-white text-xs sm:text-sm rounded-md hover:opacity-80 transition"
                    >
                      Lihat Selengkapnya
                    </button>
                  </Link>
                  <FaHeart className="text-primary" size={18} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            Belum ada postingan terbaru.
          </p>
        )}
      </div>
    </section>
  );
}
