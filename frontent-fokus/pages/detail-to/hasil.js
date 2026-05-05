import Image from "next/image";
import { useSelector } from "react-redux";
import ResultSummaryTO from "@/components/user/resultSummaryTO";
import { useRouter } from "next/router";
import { useEffect } from "react";

function HasilTO() {
  const dataSoal = useSelector((state) => state.tryout.dataLatihan);
  const skor = useSelector((state) => state.soal.total_skor);

  return (
    <div className="p-7 font-poppins my-7">
      <div className="flex flex-col sm:flex-row">
        <div className="flex-1 flex flex-col justify-center items-center mx-auto">
          <ResultSummaryTO dataSoal={dataSoal} skor={skor} />
        </div>
        <div className="sm:flex items-center m-auto">
          <Image
            className="sm:w-72 lg:w-96 xl:w-8/12"
            src="/dum.png"
            alt="banner fokusedu"
            width={1000}
            height={1000}
          />
        </div>
      </div>
    </div>
  );
}

export default HasilTO;
