import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import {
  getCountMyLatihan,
  getCountProgramUtama,
  getRapor,
} from "@/lib/axios/programUtama";
import { useRouter } from "next/router";

export default function RaporKamu() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const token = Cookies.get("token");
  const searchParams = useSearchParams();
  const jenis = searchParams.get("jenis");
  const title = searchParams.get("title");
  const module_name = searchParams.get("module_name");

  const [dataRapor, setDataRapor] = useState(null);
  const [countLatihanKu, setCountLatihanku] = useState(null);
  const [countLatihan, setCountLatihan] = useState(null);

  const fetchDataAnswer = useCallback(async () => {
    try {
      const res = await getRapor(
        { jenis: jenis, title: title, module_name: module_name },
        token,
      );
      setDataRapor(res.data);
      console.log(res.data);
    } catch (error) {
      // //  //  console.log(error);
    }
  }, [jenis, token, title, module_name]);

  const fetchCountLatihan = useCallback(async () => {
    try {
      const res = await getCountProgramUtama(token);
      const resL = await getCountMyLatihan(token);
      setCountLatihan(res.data);
      setCountLatihanku(resL.data);
    } catch (error) {
      // //  //  console.log(error)
    }
  }, [token]);

  useEffect(() => {
    fetchCountLatihan();
  }, [fetchCountLatihan]);

  useEffect(() => {
    fetchDataAnswer();
  }, [fetchDataAnswer]);

  const dataLatihan = useSelector((state) => state.soal.soal);

  return (
    <div className="px-7 font-poppins mt-5">
      {/* Breadcrumb */}
      <header className="flex space-x-2 text-xs text-gray-500 mt-1">
        <p>Program Utama</p>
        <span>›</span>
        <p>{dataLatihan.program_utama}</p>
        <span>›</span>
        <p>{dataLatihan.title}</p>
        <span>›</span>
        <p className="font-semibold text-gray-800">Rapor</p>
      </header>

      {/* Title */}
      <h2 className="text-xl font-bold text-primary my-5">Rapor Kamu</h2>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-2">
        <SummaryCard label="Total Latihan" value={countLatihan?.totalLatihan} />
        <SummaryCard
          label="Total Soal Latihan"
          value={countLatihan?.totalSemuaSoal}
        />
        <SummaryCard
          label="Latihan Yang Dikerjakan"
          value={countLatihanKu?.total}
        />
      </div>

      {/* Search */}
      {/* <div className="flex items-center gap-2 max-w-sm">
        <div className="flex w-full border border-gray-300 rounded-lg overflow-hidden shadow-sm">
          <input
            type="text"
            placeholder="Cari latihan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 text-sm w-full outline-none"
          />
          <button className="bg-blue-600 text-white px-3 flex items-center justify-center hover:bg-blue-700 transition">
            <Search size={16} />
          </button>
        </div>
      </div> */}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200 mb-3">
        <table className="w-full text-sm text-center">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-3 px-2 font-medium">No.</th>
              <th className="py-3 px-2 font-medium">Nama Program</th>
              <th className="py-3 px-2 font-medium">Nama Latihan</th>
              <th className="py-3 px-2 font-medium">Total Skor</th>
              <th className="py-3 px-2 font-medium">Keterangan</th>
              <th className="py-3 px-2 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {dataRapor &&
              dataRapor.map((d, i) => (
                <tr
                  key={i}
                  className={`transition-colors ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50`}
                >
                  <td className="p-3">{i + 1}</td>
                  <td>{d.properties.data_soal.program_utama}</td>
                  <td>{d.properties.data_soal.title}</td>
                  <td className="font-semibold">{d.total_skor}</td>
                  <td
                    className={`font-medium ${
                      d.total_skor > d.properties.data_soal.minPoin
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {d.total_skor > d.properties.data_soal.minPoin
                      ? "Lulus"
                      : "Tidak Lulus"}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() =>
                        router.push(
                          `pembahasan?id=${d.id}&program_id=${d.program_id}`,
                        )
                      }
                      className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white py-1 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Lihat Detail
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {/* <div className="flex justify-end items-center gap-2 mt-4">
        <button className="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100">&lt;</button>
        <button className="px-3 py-1 rounded-md bg-blue-600 text-white">1</button>
        <button className="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100">2</button>
        <button className="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100">&gt;</button>
      </div> */}
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow p-5 text-center">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
}
