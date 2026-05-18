import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getPembahasan, getPembahasanById } from "@/lib/axios/programUtama";
import StatistikNilaiChartTO from "@/components/user/statistikNilaiChartTO";

export default function PageTO() {
  const token = Cookies.get("token");
  const searchParams = useSearchParams();
  const programId = searchParams.get("program_id");
  const title = searchParams.get("title");
  const jenis = searchParams.get("jenis");
  const id = searchParams.get("id");

  const [data, setData] = useState(null);

  const fetchDataAnswer = useCallback(async () => {
    try {
      let res;
      if (id) {
        res = await getPembahasanById({ answer_id: id }, token);
      } else {
        res = await getPembahasan(
          { program_id: programId, jenis, title },
          token,
        );
      }
      setData(res.data);
    } catch (error) {
      // //  //  console.log(error);
    }
  }, [programId, jenis, token, title, id]);

  useEffect(() => {
    fetchDataAnswer();
  }, [fetchDataAnswer]);

  if (!data) return <p className="p-7 my-7">Belum mengerjakan latihan</p>;
  return (
    <div className="p-7 font-poppins my-7">
      <header className="flex space-x-2 text-xs">
        <p>Tryout</p>
        <span>›</span>
        <p>{data?.properties?.data_soal.module_name}</p>
      </header>
      <div className="my-2">
        <StatistikNilaiChartTO data={data} maxValue={9} />
      </div>
    </div>
  );
}
