import Image from "next/image";

export default function BannerTryout() {
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
          src="/bannerTo.png"
          alt="Banner Tryout FokusEdu"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>
    </section>
  );
}
