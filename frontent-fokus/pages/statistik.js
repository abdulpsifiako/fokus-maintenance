import { useRouter } from "next/router";
import StatistikNilaiChart from "../components/user/statistikNilaiChart";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getPembahasan, getPembahasanById } from "@/lib/axios/programUtama";

export default function Page() {
  const token = Cookies.get("token");
  const searchParams = useSearchParams();
  const programId = searchParams.get("program_id");
  const title = searchParams.get("title");
  const jenis = searchParams.get("jenis");
  const id = searchParams.get("id");
  const module_name = searchParams.get("module_name");

  const [data, setData] = useState(null);

  const fetchDataAnswer = useCallback(async () => {
    try {
      let res;
      if (id) {
        res = await getPembahasanById({ answer_id: id }, token);
      } else {
        res = await getPembahasan(
          { program_id: programId, jenis, title, module_name },
          token,
        );
      }
      setData(res.data);
    } catch (error) {
      // //  //  console.log(error);
    }
  }, [programId, jenis, token, title, id, module_name]);

  useEffect(() => {
    fetchDataAnswer();
  }, [fetchDataAnswer]);

  if (!data)
    return (
      <p className="h-screen max-w-[1440px] flex items-center justify-center m-auto">
        Belum mengerjakan latihan
      </p>
    );
  return (
    <div className="px-7 font-poppins mt-5">
      <header className="flex space-x-2 text-xs">
        <p>Program Utama</p>
        <span>›</span>
        <p>{data?.properties?.data_soal.module_name}</p>
        <span>›</span>
        <p className="font-semibold">{data?.properties?.data_soal.title}</p>
      </header>
      <div className="my-2">
        <StatistikNilaiChart data={data} maxValue={9} />
      </div>
    </div>
  );
}
