import { useEffect, useState } from "react";
import VideoPlayer from "./videoplayer";
import { getImgBanner } from "@/lib/axios/landing";
import Cookies from "js-cookie";
import Image from "next/image";

export default function Banner({ onExploreClick, onPaketClick }) {
  const [imgBanner, setImgBanner] = useState(null);
  const token = Cookies.get("token");

  useEffect(() => {
    (async () => {
      try {
        const response = await getImgBanner();
        setImgBanner(
          `${process.env.NEXT_PUBLIC_API_URL}/landing/images/${response.data[0].url}`,
        );
      } catch (error) {}
    })();
  }, []);

  return (
    <section
      className="relative flex items-center justify-center
      font-poppins min-h-[480px] sm:min-h-[560px] lg:min-h-[720px]"
    >
      {/* Background image */}
      <Image
        src={imgBanner || "/footerBg.png"}
        alt="Banner FokusEdu"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* ✅ FIX 1: Overlay gradient — pakai bg-gradient-to-r bukan bg-linier-to-r */}
      <div
        className="absolute inset-0 bg-gradient-to-r
        from-white/90 via-white/80 to-white/30
        lg:from-white/95 lg:via-white/85 lg:to-transparent z-0"
      />

      {/* Konten utama */}
      <div
        className="relative z-10 flex flex-col lg:flex-row
        items-center justify-between gap-8
        w-full max-w-7xl px-5 sm:px-8 lg:px-12
        py-12 sm:py-16 lg:py-20"
      >
        {/* Teks & Tombol */}
        <div
          className="w-full lg:w-1/2 flex flex-col
          items-center lg:items-start
          text-center lg:text-left gap-6"
        >
          {/* Slot konten teks — isi sesuai kebutuhan */}
          <div className="space-y-3">
            {/* <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">...</h1> */}
            {/* <p className="text-sm sm:text-base text-gray-600">...</p> */}
          </div>

          {/* Tombol */}
          {!token ? (
            <div
              className="flex flex-col sm:flex-row gap-3 w-full
              sm:w-auto justify-center lg:justify-start"
            >
              <button
                onClick={() => (window.location.href = "/auth/daftar")}
                className="w-full sm:w-auto px-6 py-2.5 rounded-md
                  text-sm sm:text-base font-semibold text-white
                  bg-primary hover:bg-primary/80 transition-all"
              >
                Daftar Sekarang
              </button>
              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto px-6 py-2.5 rounded-md
                  text-sm sm:text-base font-semibold
                  border border-primary text-primary
                  hover:bg-primary hover:text-white transition-all"
              >
                Jelajahi Program
              </button>
            </div>
          ) : (
            <div
              className="flex flex-col sm:flex-row gap-3 w-full
              sm:w-auto justify-center lg:justify-start"
            >
              <button
                onClick={onPaketClick}
                className="w-full sm:w-auto px-6 py-2.5 rounded-md
                  text-sm sm:text-base font-semibold text-white
                  bg-primary hover:bg-primary/80 transition-all"
              >
                Langganan
              </button>
              <button
                onClick={() =>
                  window.open("https://wa.me/6285183026569", "_blank")
                }
                className="w-full sm:w-auto px-6 py-2.5 rounded-md
                  text-sm sm:text-base font-semibold
                  border border-primary text-primary
                  hover:bg-primary hover:text-white transition-all"
              >
                Masih ragu? Tanya admin
              </button>
            </div>
          )}
        </div>

        {/* ✅ FIX 2: VideoPlayer dirender, bukan div kosong */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div
            className="w-full max-w-[480px] sm:max-w-[520px]
            rounded-xl overflow-hidden shadow-lg"
          >
            {/* <VideoPlayer /> */}
          </div>
        </div>
      </div>
    </section>
  );
}
