import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { getRankingTO } from "@/lib/axios/programUtama";
import { useRouter } from "next/router";
import NamaProvinsi from "@/components/admin/namaProvinsi";
import NamaKabupaten from "@/components/admin/namaKabupaten";
import Link from "next/link";

export default function RaporKamuTO() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const token = Cookies.get("token");
  const searchParams = useSearchParams();
  const jenis = searchParams.get("jenis");
  const title = searchParams.get("title");
  const id = searchParams.get("id");

  const [dataRapor, setDataRapor] = useState(null);

  //  //  console.log(dataRapor)

  const fetchDataAnswer = useCallback(async () => {
    try {
      const res = await getRankingTO({ jenis, title, id }, token);
      setDataRapor(res.data);
    } catch (error) {
      // //  //  console.log(error);
    }
  }, [jenis, token, title, id]);

  useEffect(() => {
    fetchDataAnswer();
  }, [fetchDataAnswer]);

  const dataLatihan = useSelector((state) => state.tryout.dataLatihan);
  const userRank = dataRapor?.userRank || null;

  return (
    <div className="p-6 font-poppins space-y-6">
      {/* Breadcrumb */}
      <header className="flex space-x-2 text-xs text-gray-500 mt-4">
        <Link href={`/tryout`}>
          <p>Tryout</p>
        </Link>
        <span>›</span>
        <Link href={`/detail-to/summary?id=${id}`}>
          <p>{dataLatihan?.title}</p>
        </Link>
        <span>›</span>
        <p className="font-semibold text-gray-800">Peringkat</p>
      </header>

      {/* 🔹 Rangkuman Hasil */}
      <div className="space-y-3 p-3 sm:p-10">
        <h3 className="text-md font-semibold text-primary">
          Hasil Peringkat Latihan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard label="Total Peserta" value={dataRapor?.totalPeserta} />
          <SummaryCard
            label="Peserta Lulus"
            value={dataRapor?.jumlahLulus}
            color="blue"
          />
          <SummaryCard
            label="Peserta Tidak Lulus"
            value={dataRapor?.jumlahTidakLulus}
            color="red"
          />
        </div>

        {userRank && (
          <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-3 rounded-md text-center font-medium">
            Anda berada di peringkat{" "}
            <span className="font-bold">{userRank.rank}</span> dari total{" "}
            <span className="font-bold">{dataRapor?.totalPeserta}</span> peserta
          </div>
        )}
      </div>

      {/* 🔹 Table Ranking */}
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200 my-4">
        <table className="w-full text-sm text-center">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-3 px-2 font-medium">Rangking.</th>
              <th className="py-3 px-2 font-medium">Nama</th>
              <th className="py-3 px-2 font-medium">Provinsi</th>
              <th className="py-3 px-2 font-medium">Kota/Kabupaten</th>
              <th className="py-3 px-2 font-medium">Nilai</th>
              <th className="py-3 px-2 font-medium">Keterangan</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {dataRapor?.topRank?.map((d, i) => (
              <tr
                key={i}
                className={`transition-colors ${
                  i % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-50`}
              >
                <td className="p-3">{d.rank}</td>
                <td>{d.properties.detail_user.name}</td>
                <td>
                  {d.properties.detail_user.provinsi ? (
                    <NamaProvinsi id={d.properties.detail_user.provinsi} />
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  {d.properties.detail_user.kota_kab ? (
                    <NamaKabupaten
                      idProv={d.properties.detail_user.provinsi}
                      idKabKota={d.properties.detail_user.kota_kab}
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="font-semibold">{d.total_skor}</td>
                <td
                  className={`font-medium ${
                    d.properties.data_soal.keterangan === "Lulus"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {d.properties.data_soal.keterangan}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, color }) {
  const colorClass =
    color === "blue"
      ? "text-blue-600"
      : color === "red"
        ? "text-red-600"
        : "text-gray-800";

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow p-10 text-center">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
    </div>
  );
}
