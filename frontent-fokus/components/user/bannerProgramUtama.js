import Image from "next/image";

export default function BannerProgramUtama() {
  return (
    <section className="w-screen font-poppins">
      <div
        className="relative w-screen
        aspect-[4/3]
        sm:aspect-[16/7]
        md:aspect-[16/5]
        lg:aspect-[16/4]
        xl:aspect-[16/3]"
      >
        <Image
          src="/bannerPro.png"
          alt="Banner Program Utama FokusEdu"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>
    </section>
  );
}
