import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { FaCaretRight, FaCaretDown } from "react-icons/fa";
import { LuSquareMenu } from "react-icons/lu";
import { exitApp } from "@/lib/public/auth";
import { persistor } from "@/lib/redux/store";
import Alert from "@/components/public/alert";
import useBreakpoint from "@/pages/hooks/useBreakPoint";

export default function Navigation() {
  const [alert, setAlert] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const token = Cookies.get("token");
  const detail = useSelector((state) => state.user.detail);
  const router = useRouter();
  const breakpoint = useBreakpoint();

  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);

  const isActive = (path) => router.pathname === path;

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
    setShowDropdown(false);
    setShowProfile(false);
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
    setShowProfile(false);
  };

  const toggleProfile = () => {
    setShowProfile((prev) => !prev);
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.closest(".ignore-close")) return;

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        showDropdown
      )
        setShowDropdown(false);

      if (
        profileRef.current &&
        !profileRef.current.contains(e.target) &&
        showProfile
      )
        setShowProfile(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown, showProfile]);

  useEffect(() => {
    if (["md", "lg", "xl", "2xl"].includes(breakpoint)) {
      setShowMenu(false);
      setShowDropdown(false);
      setShowProfile(false);
    }
  }, [breakpoint]);

  const handleExitApp = async () => {
    try {
      const res = await exitApp(token);
      setAlert({ type: "success", title: "Info", message: res.message });
      Cookies.remove("token", { path: "/" });
      Cookies.remove("role", { path: "/" });
      await persistor.purge();
      setTimeout(() => (window.location.href = "/"), 100);
      setShowMenu(false);
    } catch (error) {
      console.error("Exit failed:", error);
    }
  };

  return (
    <>
      {/* MOBILE NAV */}
      <div className="fixed top-4 left-4 right-4 z-50 md:hidden bg-white/35 backdrop-blur-md shadow-lg rounded-4xl border border-gray-100 px-4 py-3 flex justify-between items-center font-poppins">
        <Link href="/">
          <Image src="/LOGO.png" alt="FokusEdu" height={100} width={150} />
        </Link>
        <button onClick={toggleMenu} className="p-2 rounded hover:bg-gray-100">
          <LuSquareMenu size={24} />
        </button>
      </div>

      {/* MOBILE MENU */}
      {showMenu && (
        <div
          ref={menuRef}
          className="fixed top-20 left-4 right-4 bg-white/95 backdrop-blur-md shadow-xl rounded-2xl border border-gray-100 py-2 px-2 z-40 animate-fadeIn"
        >
          <ul className="text-center text-sm space-y-2 font-medium">
            <Link href="/program-utama" onClick={() => setShowMenu(false)}>
              <li
                className={`py-1 hover:text-primary ${
                  isActive("/program-utama") ? "text-primary font-bold" : ""
                }`}
              >
                Program Utama
              </li>
            </Link>

            <Link href="/kelas-online" onClick={() => setShowMenu(false)}>
              <li
                className={`py-1 hover:text-primary ${
                  isActive("/kelas-online") ? "text-primary font-bold" : ""
                }`}
              >
                Live Class
              </li>
            </Link>

            <Link href="/tryout" onClick={() => setShowMenu(false)}>
              <li
                className={`py-1 hover:text-primary ${
                  isActive("/tryout") ? "text-primary font-bold" : ""
                }`}
              >
                Try Out
              </li>
            </Link>

            {/* Tentang */}
            <li>
              <button
                onClick={toggleDropdown}
                className={`flex justify-center items-center gap-2 w-full py-1 ${
                  ["/kenali-kami", "/tim-fasilitator", "/testimoni"].includes(
                    router.pathname,
                  )
                    ? "text-primary font-bold"
                    : ""
                }`}
              >
                Tentang {showDropdown ? <FaCaretDown /> : <FaCaretRight />}
              </button>

              {showDropdown && (
                <div className="mt-1 space-y-1 text-gray-600">
                  {[
                    { href: "/kenali-kami", label: "Kenali Kami" },
                    { href: "/tim-fasilitator", label: "Tim Fasilitator" },
                    { href: "/testimoni", label: "Testimoni" },
                  ].map((item, i) => (
                    <Link
                      key={i}
                      href={item.href}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                        setShowDropdown(false);
                      }}
                    >
                      <div
                        className={`py-1 ignore-close hover:text-primary transition-colors duration-150 cursor-pointer ${
                          isActive(item.href) ? "text-primary font-bold" : ""
                        }`}
                      >
                        {item.label}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </li>
          </ul>

          {/* PROFILE */}
          <div className="text-sm text-center">
            {detail ? (
              <>
                <button
                  onClick={toggleProfile}
                  className="flex justify-center items-center gap-2 mx-auto"
                >
                  Akun {showProfile ? <FaCaretDown /> : <FaCaretRight />}
                </button>

                {showProfile && (
                  <div className="mt-2 space-y-1 text-gray-700">
                    {[
                      { href: "/profile", label: "Profil" },
                      { href: "/pembelian", label: "Riwayat Pembelian" },
                      { href: "/redeem-kode", label: "Referral" },
                      {
                        href: "/syarat-ketentuan",
                        label: "Syarat & Ketentuan",
                      },
                      {
                        href: "/kebijakan-privasi",
                        label: "Kebijakan Privasi",
                      },
                    ].map((item, i) => (
                      <Link
                        key={i}
                        href={item.href}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMenu(false);
                        }}
                      >
                        <div className="py-1 ignore-close">{item.label}</div>
                      </Link>
                    ))}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExitApp();
                      }}
                      className="w-full text-primary py-1 hover:underline ignore-close"
                    >
                      Keluar
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => router.push("/auth/login")}
                  className="px-4 py-1 border border-primary rounded-xl text-primary text-sm"
                >
                  Masuk
                </button>
                <button
                  onClick={() => router.push("/auth/daftar")}
                  className="px-4 py-1 bg-primary text-white rounded-xl text-sm"
                >
                  Daftar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DESKTOP NAV */}
      <div className="hidden md:flex fixed top-4 left-4 right-4 z-50">
        <div className="max-w-[1440px] mx-auto px-6 py-2 w-full flex items-center justify-between font-poppins bg-white/35 backdrop-blur-md shadow-md rounded-4xl border border-gray-100">
          <Link href="/">
            <Image
              src="/LOGO.png"
              alt="FokusEdu"
              height={150}
              width={150}
              priority
            />
          </Link>

          <ul className="flex items-center gap-6 text-sm font-semibold text-gray-700">
            <Link href="/program-utama">
              <li
                className={`hover:text-primary transition max-w-[150px] truncate ${
                  isActive("/program-utama") ? "text-primary font-bold" : ""
                }`}
              >
                Program Utama
              </li>
            </Link>

            <Link href="/kelas-online">
              <li
                className={`hover:text-primary transition max-w-[150px] truncate ${
                  isActive("/kelas-online") ? "text-primary font-bold" : ""
                }`}
              >
                Live Class
              </li>
            </Link>

            <Link href="/tryout">
              <li
                className={`hover:text-primary transition max-w-[150px] truncate ${
                  isActive("/tryout") ? "text-primary font-bold" : ""
                }`}
              >
                Try Out
              </li>
            </Link>

            {/* Tentang */}
            <li ref={dropdownRef} className="relative">
              <button
                onClick={toggleDropdown}
                className={`flex items-center gap-1 hover:text-primary transition ${
                  ["/kenali-kami", "/tim-fasilitator", "/testimoni"].includes(
                    router.pathname,
                  )
                    ? "text-primary font-bold"
                    : ""
                }`}
              >
                Tentang {showDropdown ? <FaCaretDown /> : <FaCaretRight />}
              </button>

              {showDropdown && (
                <div className="absolute top-10 left-0 w-44 bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden">
                  <ul className="text-sm text-gray-700">
                    {[
                      { href: "/kenali-kami", label: "Kenali Kami" },
                      { href: "/tim-fasilitator", label: "Tim Fasilitator" },
                      { href: "/testimoni", label: "Testimoni" },
                    ].map((item, i) => (
                      <Link
                        key={i}
                        href={item.href}
                        onClick={() => setShowDropdown(false)}
                      >
                        <li
                          className={`px-4 py-2 hover:bg-primary hover:text-white ${
                            isActive(item.href) ? "bg-primary text-white" : ""
                          }`}
                        >
                          {item.label}
                        </li>
                      </Link>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          </ul>

          {/* PROFILE */}
          <div ref={profileRef} className="relative">
            {detail ? (
              <button
                onClick={toggleProfile}
                className="flex items-center gap-2 hover:opacity-80"
              >
                <Image
                  className="w-10 h-10 rounded-full object-cover"
                  src={
                    detail?.image
                      ? `${process.env.NEXT_PUBLIC_API_URL}/landing/images/${detail.image}`
                      : "/9720011.jpg"
                  }
                  alt="Profile"
                  width={40}
                  height={40}
                />
                {showProfile ? <FaCaretDown /> : <FaCaretRight />}
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => router.push("/auth/login")}
                  className="px-4 py-1 border border-primary rounded-xl text-primary text-xs"
                >
                  Masuk
                </button>
                <button
                  onClick={() => router.push("/auth/daftar")}
                  className="px-4 py-1 bg-primary text-white rounded-xl text-xs"
                >
                  Daftar
                </button>
              </div>
            )}

            {showProfile && (
              <div className="absolute right-0 top-12 w-48 bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden animate-fadeIn">
                <ul className="text-sm text-gray-700">
                  {[
                    { href: "/profile", label: "Profil" },
                    { href: "/pembelian", label: "Riwayat Pembelian" },
                    { href: "/redeem-kode", label: "Referral" },
                    { href: "/syarat-ketentuan", label: "Syarat & Ketentuan" },
                    { href: "/kebijakan-privasi", label: "Kebijakan Privasi" },
                  ].map((item, i) => (
                    <Link
                      key={i}
                      href={item.href}
                      onClick={() => setShowProfile(false)}
                    >
                      <li className="px-4 py-2 hover:bg-primary hover:text-white">
                        {item.label}
                      </li>
                    </Link>
                  ))}

                  <button
                    type="button"
                    onClick={handleExitApp}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    Keluar
                  </button>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ALERT */}
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-in-out;
        }
      `}</style>
    </>
  );
}
