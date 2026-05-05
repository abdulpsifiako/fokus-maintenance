import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function StatistikNilaiChart({ data }) {
  const soalList = data.properties.data_soal?.datasoal || [];
  const jawabanList = data.properties.data_answer || {};

  // ✅ Kelompokkan soal berdasarkan submateri
  const grouped = {};

  soalList.forEach((item, index) => {
    const submateri = item.submateri?.trim() || "Umum";
    const jawabanObj = jawabanList[index];

    // Maksimal poin soal ini = nilai opsi tertinggi
    const maxPoinSoal =
      item.opsi && item.opsi.length > 0
        ? Math.max(...item.opsi.map((o) => o.poin || 0))
        : 0;

    // Poin yang diperoleh user untuk soal ini
    let poinDiperoleh = 0;
    if (jawabanObj && jawabanObj.option !== undefined) {
      poinDiperoleh = item.opsi[jawabanObj.option]?.poin ?? 0;
    }

    if (!grouped[submateri]) {
      grouped[submateri] = { poinDiperoleh: 0, maxPoin: 0, jumlahSoal: 0 };
    }

    grouped[submateri].poinDiperoleh += poinDiperoleh;
    grouped[submateri].maxPoin += maxPoinSoal; // ✅ akumulasi, bukan ambil 1 soal
    grouped[submateri].jumlahSoal += 1;
  });

  // Ubah ke array untuk chart
  const submaterList = Object.keys(grouped);
  const poinPerolehan = submaterList.map((s) => grouped[s].poinDiperoleh);
  const poinMaksimal = submaterList.map((s) => grouped[s].maxPoin);

  const chartData = {
    labels: submaterList,
    datasets: [
      {
        label: "Poin Kamu",
        data: poinPerolehan,
        backgroundColor: "#2563eb",
        borderRadius: 4,
      },
      {
        label: "Poin Maksimal",
        data: poinMaksimal,
        backgroundColor: "#f59e0b",
        borderRadius: 4,
      },
    ],
  };

  // ✅ Max sumbu X = nilai maxPoin terbesar di antara semua submateri
  const maxAxis = Math.max(...poinMaksimal, 1);

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        callbacks: {
          // Tampilkan jumlah soal di tooltip
          afterLabel: (ctx) => {
            const submateri = ctx.label;
            const jumlah = grouped[submateri]?.jumlahSoal ?? 0;
            return `Jumlah soal: ${jumlah}`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: maxAxis,
        ticks: { stepSize: 1 },
      },
    },
    barThickness: 14,
    layout: {
      padding: { bottom: 20, top: 20 },
    },
  };

  return (
    <div
      className="bg-white w-full shadow p-4 rounded-md"
      style={{ height: `${Math.max(submaterList.length * 80 + 80, 300)}px` }}
    >
      <h2 className="text-lg font-semibold text-primary mb-2">
        Statistik {data?.properties?.data_soal.title}
      </h2>
      <Bar data={chartData} options={options} />
    </div>
  );
}
