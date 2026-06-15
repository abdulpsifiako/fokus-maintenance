import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getPembahasan } from "@/lib/axios/programUtama";

export default function WaktuPengerjaanChartTO() {
  const token = Cookies.get("token");
  const searchParams = useSearchParams();
  const programId = searchParams.get("program_id");
  const jenis = searchParams.get("jenis");
  const title = searchParams.get("title");

  const [data, setData] = useState(null);

  const fetchDataAnswer = useCallback(async () => {
    try {
      const res = await getPembahasan(
        { program_id: programId, jenis: jenis, title: title },
        token,
      );
      setData(res.data);
    } catch (error) {
      // //  //  console.log(error);
    }
  }, [programId, jenis, token, title]);

  useEffect(() => {
    fetchDataAnswer();
  }, [fetchDataAnswer]);

  if (!data) return <p className="my-7 p-8">Belum mengerjakan Tryout</p>;

  const soalList = data.properties.data_soal?.datasoal || [];
  const jawabanList = data.properties.data_answer || {};

  const dataTime = soalList.map((_, index) => {
    const jawaban = jawabanList[index] || {}; // cek ada jawaban atau tidak
    return {
      soal: index + 1,
      waktu: jawaban.timeSpent ?? 0, // kalau tidak ada → default 0
    };
  });
  const total = dataTime?.reduce((acc, d) => acc + d.waktu, 0);
  const avg = (total / dataTime?.length).toFixed(1);
  return (
    <div className="p-7 font-poppins my-7">
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-red-700 font-semibold mb-4">Waktu Pengerjaan</h2>
        <div className="text-sm mb-4">
          <p>Total Waktu: {(total / 60).toFixed(1)} Menit</p>
          <p>Rata-Rata Waktu: {avg} Detik</p>
        </div>
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={dataTime}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorWaktu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="soal"
                tick={{ fontSize: 10 }}
                label={{
                  value: "Nomor Soal",
                  position: "insideBottom",
                  offset: -2,
                  fontSize: 12,
                }}
              />
              <YAxis
                label={{
                  value: "Waktu (detik)",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                  fontSize: 12,
                }}
              />
              <Tooltip
                formatter={(value) => [`${value} detik`, "Waktu Pengerjaan"]}
                labelFormatter={(label) => `Soal No. ${label}`}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="waktu"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorWaktu)"
                name="Grafik Pengerjakan Soal"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
