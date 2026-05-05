import Image from "next/image";

export default function BannerKelasOnline() {
  return (
    <section className="w-screen font-poppins">
      <div
        className="relative w-screen mt-2
        aspect-[4/3]
        sm:aspect-[16/7]
        md:aspect-[16/5]
        lg:aspect-[16/4]
        xl:aspect-[16/3]"
      >
        <Image
          src="/bannerKelas.png"
          alt="Banner Kelas Online FokusEdu"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>
    </section>
  );
}
