import { useEffect, useState } from "react";
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
    <section className="relative w-full font-poppins">
      {/* ✅ Pakai next/image dengan width & height asli — tidak ada yang terpotong */}
      <div className="relative w-full">
        <Image
          src={imgBanner || "/footerBg.png"}
          alt="Banner FokusEdu"
          width={1920}
          height={600} // ✅ sesuaikan dengan tinggi asli gambar banner kamu
          priority
          className="w-full h-auto object-contain"
          sizes="100vw"
        />

        {/* Tombol — pojok bawah kiri, hidden di mobile */}
        <div
          className="absolute bottom-4 left-4 sm:bottom-24 sm:left-24
          z-10 hidden sm:flex flex-row gap-3"
        >
          {!token ? (
            <>
              <button
                onClick={() => (window.location.href = "/auth/daftar")}
                className="px-6 py-2.5 rounded-md text-sm font-semibold
                  text-white bg-primary hover:bg-primary/80 transition-all
                  shadow-md"
              >
                Daftar Sekarang
              </button>
              <button
                onClick={onExploreClick}
                className="px-6 py-2.5 rounded-md text-sm font-semibold
                  border border-primary text-primary bg-white/80
                  hover:bg-primary hover:text-white transition-all shadow-md"
              >
                Jelajahi Program
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onPaketClick}
                className="px-6 py-2.5 rounded-md text-sm font-semibold
                  text-white bg-primary hover:bg-primary/80 transition-all
                  shadow-md"
              >
                Langganan
              </button>
              <button
                onClick={() =>
                  window.open("https://wa.me/6285183026569", "_blank")
                }
                className="px-6 py-2.5 rounded-md text-sm font-semibold
                  border border-primary text-primary bg-white/80
                  hover:bg-primary hover:text-white transition-all shadow-md"
              >
                Masih ragu? Tanya admin
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
