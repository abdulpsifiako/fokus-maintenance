import { getPengalamanPost } from "@/lib/axios/landing";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Info() {
  const [pengalaman, setPengalaman] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await getPengalamanPost();
        setPengalaman(response.data || []);
      } catch (error) {
        console.error("ERROR DURING FETCH PENGALAMAN POSTS", error);
      }
    })();
  }, []);

  const Card = ({ imageUrl, judul, deskripsi, link }) => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden w-full min-h-[380px] flex flex-col">
      {/* IMAGE */}
      <div className="relative w-full aspect-2/1">
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/landing/images/${imageUrl}`}
          alt={judul}
          fill
          className="object-contain"
          sizes="(max-width: 640px) 100vw, 50vw"
        />
      </div>

      {/* CONTENT + BUTTON */}
      <div className="flex flex-col justify-between flex-1">
        <div className="p-4">
          <h2 className="font-semibold text-base text-gray-800 line-clamp-2">
            {judul}
          </h2>
          <p className="text-gray-600 text-sm mt-2 line-clamp-6 text-justify">
            {deskripsi}
          </p>
        </div>

        <div className="p-4">
          <button
            className="bg-primary text-white p-2 text-xs rounded-md"
            type="button"
            onClick={() => window.open(link, "_blank")}
          >
            Selengkapnya
          </button>
        </div>
      </div>
    </div>
  );

  // --- Grid dibagi 2 section sesuai screenshot ---
  const topCards = pengalaman.slice(0, 2);
  const bottomCards = pengalaman.slice(2, 4);

  return (
    <section className="font-poppins px-4 sm:px-6 py-5 bg-gray-50">
      <div className="w-[80%] mx-auto">
        {/* SECTION 1 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">
            Temukan Pengalaman Belajar Bermakna
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            Belajar lebih efektif dengan metode interaktif dan materi
            profesional.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-14">
          {topCards.map((card, idx) => (
            <Card key={idx} {...card} />
          ))}
        </div>

        {/* SECTION 2 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">
            Belajar Efektif dengan Fitur Gratis dan Pendukung
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            Fitur tambahan yang membantu kamu belajar lebih fokus dan terarah.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {bottomCards.map((card, idx) => (
            <Card key={idx} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
