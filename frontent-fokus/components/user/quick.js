import Image from "next/image";
import { useRouter } from "next/router";
import Cookies from 'js-cookie'

export default function FokusEduBanner() {
  const token = Cookies.get("token")
  const router = useRouter()
  return (
    <section className="font-poppins bg-white  p-7 sm:p-6 lg:px-20 flex flex-col md:flex-row items-center justify-between">
      
      {/* Kiri: Gambar Peta */}
      <div className="w-full md:w-2/3 flex justify-center">
        <div className="w-full aspect-3/1">
          <Image
            src="/map.png"
            // src="/indonesia.jpg"
            alt="Peta Indonesia FokusEdu"
            width={1000}
            height={1000}
            className="w-full h-full object-contain rounded-md"
            priority
          />
        </div>
      </div>

      {/* Kanan: Teks & Tombol */}
      <div className="w-full md:w-1/3 mt-6 md:mt-0 md:ml-8 text-center md:text-left">
        <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 leading-snug">
          FokusEdu telah menjangkau{" "}
          <span className="text-red-600 font-extrabold">25.000+ pengguna</span>{" "}
          di seluruh Indonesia pada tahun pertama!
        </h3>

        <p className="text-sm text-gray-700 mt-3">
          Daftar sekarang untuk mengakses{" "}
          <span className="font-semibold text-primary">video preview</span> dan{" "}
          <span className="font-bold text-primary">tryout GRATIS!</span>
        </p>
        {
          !token && (
          <button
            type="button"
            onClick={()=>router.push("/auth/daftar")}
            className="mt-5 bg-red-700 hover:bg-red-800 transition-colors duration-300 text-white font-semibold px-5 py-2.5 rounded-lg shadow-sm"
          >
            Daftar Sekarang
          </button>
          )
        }
      </div>
    </section>
  );
}
