import Image from "next/image";

export default function BannerKelasOnline() {
  return (
    <section className="w-full font-poppins">
      <Image
        src="/bannerKelas.png"
        alt="Banner Kelas Online FokusEdu"
        width={1920}
        height={600} // ✅ sesuaikan dengan tinggi asli file bannerKelas.png
        priority
        className="w-full h-auto"
        sizes="100vw"
      />
    </section>
  );
}
