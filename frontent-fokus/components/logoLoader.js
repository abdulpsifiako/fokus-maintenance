import Image from "next/image";

export default function LogoLoader() {
  return (
    <div className="logo-loader-overlay">
      <div className="logo-loader-inner">
        {/* Ganti src dengan logo kamu, misal: /logo.svg */}
        <div className="logo-loader-ring">
          <Image
            src="/logofk.png"
            alt="Loading..."
            width={64}
            height={64}
            priority
            className="logo-loader-img"
          />
        </div>

        <p className="logo-loader-text">Memuat...</p>
      </div>
    </div>
  );
}
