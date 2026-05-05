import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import { FaTiktok, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-primary font-poppins mt-16">
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* GRID UTAMA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12">
          {/* IMAGE */}
          <div className="sm:col-span-2 lg:col-span-2 flex sm:justify-start">
            <Image
              src="/footerBg.png"
              alt="FokusEdu"
              width={1000}
              height={500}
              sizes="(max-width:640px) 80vw, (max-width:1024px) 50vw, 40vw"
              className="w-full max-w-xs sm:max-w-md lg:max-w-full h-auto object-contain"
              priority
            />
          </div>

          {/* LAYANAN PELANGGAN */}
          <div className="flex sm:justify-start">
            <div className="w-fit">
              <h2 className="font-semibold text-gray-900 mb-4 sm:text-left">
                Layanan Pelanggan
              </h2>

              <ul className="space-y-3 text-sm text-gray-700">
                <li>
                  <a
                    href="https://instagram.com/fokusedu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-primary w-fit"
                  >
                    <FaInstagram className="text-primary" />
                    @fokusedu
                  </a>
                </li>

                <li>
                  <a
                    href="https://www.instagram.com/fokusedu.academy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-primary w-fit"
                  >
                    <FaInstagram className="text-primary" />
                    @fokusedu.academy
                  </a>
                </li>

                <li>
                  <a
                    href="mailto:adm.fokusedu@gmail.com"
                    className="flex items-center gap-2 hover:text-primary w-fit"
                  >
                    <MdOutlineMail className="text-primary" />
                    adm.fokusedu@gmail.com
                  </a>
                </li>

                <li>
                  <a
                    href="https://wa.me/6285183026569"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-primary w-fit"
                  >
                    <FaWhatsapp className="text-primary" />
                    +62 851-8302-6569
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* TENTANG & PETUNJUK */}
          <div className="flex sm:justify-start">
            <div className="grid sm:grid-cols-2 gap-12 text-sm w-fit">
              {/* Tentang */}
              <div className="min-w-[150px]">
                <h2 className="font-semibold text-gray-900 mb-4">Tentang</h2>
                <ul className="space-y-3 text-gray-700">
                  <li>
                    <Link href="/kenali-kami" className="hover:text-primary">
                      Kenali Kami
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/tim-fasilitator"
                      className="hover:text-primary"
                    >
                      Tim Fasilitator
                    </Link>
                  </li>
                  <li>
                    <Link href="/testimoni" className="hover:text-primary">
                      Testimoni
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Petunjuk */}
              <div className="w-fit">
                <h2 className="font-semibold text-gray-900 mb-4">Petunjuk</h2>
                <ul className="space-y-3 text-gray-700">
                  <li>
                    <Link
                      href="/syarat-ketentuan"
                      className="hover:text-primary"
                    >
                      Syarat & Kebijakan
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/kebijakan-privasi"
                      className="hover:text-primary"
                    >
                      Kebijakan Privasi
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* FOOTER BAWAH */}
      <div className="relative border-t border-gray-200 py-4 flex items-center">
        {/* TEXT TENGAH */}
        <p className="text-xs text-gray-500 mx-auto flex items-center">
          © {new Date().getFullYear()}
          <span className="font-semibold text-primary ml-1">FokusEdu</span>. All
          rights reserved.
        </p>

        {/* SOCIAL ICONS */}
        <div
          className="
      flex items-center gap-1
      absolute right-4
      sm:static sm:ml-0 p-2
    "
        >
          <a
            href="https://instagram.com/fokusedu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-primary transition-colors"
          >
            <FaInstagram size={22} />
          </a>

          <a
            href="https://www.tiktok.com/@fokusedu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-primary transition-colors"
          >
            <FaTiktok size={22} />
          </a>

          <a
            href="https://www.youtube.com/@fokusedu.official"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-primary transition-colors"
          >
            <FaYoutube size={22} />
          </a>
        </div>
      </div>
    </footer>
  );
}
