import { useCallback, useEffect, useRef, useState } from "react";
import Banner from "../components/user/banner";
import FacilitatorCards from "../components/user/fasilitator";
import IgFeeds from "../components/user/idfeed";
import Info from "../components/user/info";
import PaketCardGrid from "../components/user/packagesList";
import FokusEduBanner from "../components/user/quick";
import TestFeed from "../components/user/testFeed";
import { getDetail } from "@/lib/axios/users";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import FloatingWA from "@/components/floatingWa";
import ModalInfo from "@/components/user/modalInfo";
import { getLatestInfo } from "@/lib/axios/landing";

const SESSION_KEY = "modal_info_closed"; // key untuk sessionStorage

export default function Home() {
  const infoRef = useRef(null);
  const paketRef = useRef(null);

  // ✅ State modal
  const [infoData, setInfoData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const token = Cookies.get("token");
  const router = useRouter();

  const scrollToInfo = () => {
    const el = infoRef.current;
    if (!el) return;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - 80,
      behavior: "smooth",
    });
  };

  const scrollToPaket = () => {
    const el = paketRef.current;
    if (!el) return;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - 80,
      behavior: "smooth",
    });
  };

  const cekDataDiri = useCallback(async () => {
    try {
      const dataDetail = await getDetail(token);
      const keysToCheck = [
        "kota_kab",
        "name",
        "no_wa",
        "tingkat_pend",
        "provisi",
      ];
      const hasNullValues = keysToCheck.some((key) => dataDetail[key] === "");
      if (hasNullValues) router.push("/auth/data-diri");
    } catch (error) {}
  }, [router, token]);

  const fetchInfo = useCallback(async () => {
    const sudahDitutup = sessionStorage.getItem(SESSION_KEY);
    if (sudahDitutup) return;

    try {
      const res = await getLatestInfo();
      // Hanya tampilkan jika ada data dan ada judul
      if (res?.data?.judul) {
        setInfoData(res.data);
        setShowModal(true);
      }
    } catch (error) {
      // Jika error / tidak ada data, modal tidak muncul
    }
  }, []);

  useEffect(() => {
    cekDataDiri();
    fetchInfo(); // ✅ fetch saat halaman dibuka
  }, [cekDataDiri, fetchInfo]);

  // ✅ Tutup modal + simpan ke sessionStorage
  const handleCloseModal = () => {
    setShowModal(false);
    sessionStorage.setItem(SESSION_KEY, "true");
  };

  return (
    <div className="landing-page font-poppins">
      <div className="">
        <Banner onExploreClick={scrollToInfo} onPaketClick={scrollToPaket} />
      </div>
      <IgFeeds />
      <div ref={infoRef}>
        <Info />
      </div>
      <TestFeed />
      <h2
        className="text-2xl sm:text-3xl lg:text-4xl text-gray-800
        text-center font-bold font-poppins mb-8 px-7"
      >
        Kenalan dengan Para Fasilitator Terbaik
      </h2>
      <FacilitatorCards />
      <div ref={paketRef}>
        <PaketCardGrid />
      </div>
      <FokusEduBanner />
      <FloatingWA />

      {/* ✅ Modal pengumuman — muncul hanya jika ada data & belum ditutup */}
      {showModal && <ModalInfo info={infoData} onClose={handleCloseModal} />}
    </div>
  );
}
