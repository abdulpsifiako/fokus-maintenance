import { useEffect, useState } from "react";
import HeaderSoalLatihan from "../components/user/headerSoalLatihan";
import ContentQuiz from "../components/user/contentQuiz";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

export default function LatihanSoal() {
  const router = useRouter();
  const dataSoal = useSelector((state) => state.soal.soal);
  const [isTimeout, setIsTimeout] = useState(false);

  const [showEndModal, setShowEndModal] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!dataSoal) {
      router.push("/");
    }
  }, [dataSoal, router]);

  if (!dataSoal) {
    return null;
  }

  return (
    <div className="p-7 font-poppins my-7">
      <HeaderSoalLatihan
        setShowEndModal={setShowEndModal}
        dataSoal={dataSoal}
        setIsTimeOut={setIsTimeout}
        currentIndex={currentIndex}
      />
      <ContentQuiz
        dataSoal={dataSoal}
        setShowEndModal={setShowEndModal}
        showEndModal={showEndModal}
        isTimeOut={isTimeout}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    </div>
  );
}
