import Image from "next/image";

export default function BannerProgramUtama() {
  return (
    <section className="w-full font-poppins">
      <Image
        src="/bannerPro.png"
        alt="Banner Program Utama FokusEdu"
        width={1920}
        height={600} // ✅ sesuaikan dengan tinggi asli file bannerPro.png
        priority
        className="w-full h-auto"
        sizes="100vw"
      />
    </section>
  );
}
