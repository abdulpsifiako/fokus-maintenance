import { IoMenuSharp } from "react-icons/io5";
import { GiSandsOfTime } from "react-icons/gi";
import DetailSummary from "../components/user/detailSummary";
import ModalKerjakan from "../components/user/modalKerjakan";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import { getTransaksiPembelian } from "@/lib/axios/transaksi";
import Cookies from "js-cookie";
import { getRapor } from "@/lib/axios/programUtama";

const SummaryLatihan = () => {
  const token = Cookies.get("token");
  const router = useRouter();
  const searchParams = useSearchParams();
  const programId = searchParams.get("id");

  const [dataRapor, setDataRapor] = useState(null);

  const [userHasPurchased, setUserHasPurchased] = useState(false);
  const dataLatihan = useSelector((state) => state.soal.soal);

  const fetchDataAnswer = useCallback(async () => {
    try {
      const res = await getRapor(
        {
          jenis: "Program Utama",
          title: dataLatihan.title,
          module_name: dataLatihan.module_name,
        },
        token
      );
      setDataRapor(res.data);
    } catch (error) {
      // //  //  console.log(error);
    }
  }, [dataLatihan?.title, token, dataLatihan?.module_name]);

  const getTransaksiProgram = useCallback(async () => {
    try {
      const res = await getTransaksiPembelian(
        programId,
        token,
        "Program Utama"
      );
      setUserHasPurchased(res.data);
    } catch (error) {
      // //  //  console.log(error)
    }
  }, [programId, token]);

  // useEffect(() => {
  //   if(!dataLatihan){
  //     router.push('/');
  //   }
  //     getTransaksiProgram()
  //     fetchDataAnswer();
  // }, [getTransaksiProgram, fetchDataAnswer,dataLatihan, router])

  useEffect(() => {
    if (!dataLatihan) {
      router.replace("/");
      return;
    }
  }, [dataLatihan, router]);

  useEffect(() => {
    if (!programId || !token) return;
    getTransaksiProgram();
  }, [programId, token, getTransaksiProgram]);

  useEffect(() => {
    if (!dataLatihan?.title || !token) return;
    fetchDataAnswer();
  }, [dataLatihan?.title, token, fetchDataAnswer]);

  if (!dataLatihan) {
    return null;
  }

  //  //  console.log("INI RAPOR", dataRapor);
  //  //  console.log("INI data latihan", dataLatihan);
  return (
    <div className="px-7 font-poppins mt-5">
      <header className="flex space-x-2 text-xs">
        <p>Program Utama</p>
        <span>›</span>
        <p>{dataLatihan.module_name}</p>
        <span>›</span>
        <p className="font-semibold">{dataLatihan.title}</p>
      </header>
      <div className="my-2 w-full">
        <h1 className="text-dark-primary font-semibold">{dataLatihan.title}</h1>
        <div className="text-[10px]">
          <p className="gap-1 flex items-center">
            <span>
              <IoMenuSharp />
            </span>{" "}
            {dataLatihan.datasoal.length} Soal
          </p>
          <p className="gap-1 flex items-center">
            <span>
              <GiSandsOfTime />
            </span>{" "}
            {dataLatihan.waktu} Menit Waktu Pengerjaan
          </p>
        </div>
        <ModalKerjakan dataRapor={dataRapor} />
      </div>
      <DetailSummary
        dataRapor={dataRapor}
        programId={programId}
        dataLatihan={dataLatihan}
        userHasPurchased={userHasPurchased}
      />
    </div>
  );
};

export default SummaryLatihan;
