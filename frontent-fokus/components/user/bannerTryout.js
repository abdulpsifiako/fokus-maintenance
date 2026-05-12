import Image from "next/image";

export default function BannerTryout() {
  return (
    <section className="w-full font-poppins">
      <Image
        src="/bannerTo.png"
        alt="Banner Tryout FokusEdu"
        width={1920}
        height={600} // ✅ sesuaikan dengan tinggi asli file bannerTo.png
        priority
        className="w-full h-auto"
        sizes="100vw"
      />
    </section>
  );
}
