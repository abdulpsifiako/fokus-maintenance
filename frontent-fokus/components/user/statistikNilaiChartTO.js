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

export default function StatistikNilaiChartTO({ data, maxValue }) {
  const soalList = data?.properties?.data_soal?.datasoal || [];
  const jawabanList = data?.properties?.data_answer || {};

  const poinPerMateri = {};
  const poinPerSubmateri = {};

  soalList.forEach((soal, index) => {
    const { nama_materi, sub_materi, passing_grade, opsi } = soal;
    const jawaban = jawabanList[index];

    // --- Pastikan ada entri awal ---
    if (!poinPerMateri[nama_materi]) {
      poinPerMateri[nama_materi] = {
        poinDiperoleh: 0,
        maxPoin: 0,
        passing: parseInt(passing_grade) || 0,
      };
    }
    if (!poinPerSubmateri[sub_materi]) {
      poinPerSubmateri[sub_materi] = {
        poinDiperoleh: 0,
        maxPoin: 0,
        passing: parseInt(passing_grade) || 0,
      };
    }

    // --- Hitung poin maksimal per soal ---
    const maxPoinSoal =
      opsi && opsi.length > 0 ? Math.max(...opsi.map((o) => o.poin || 0)) : 0; // ✅ kalau kosong, kasih 0

    poinPerMateri[nama_materi].maxPoin += maxPoinSoal;
    poinPerSubmateri[sub_materi].maxPoin += maxPoinSoal;

    // --- Jika user menjawab ---
    if (
      jawaban &&
      jawaban.option !== undefined &&
      opsi &&
      opsi[jawaban.option]
    ) {
      const poinDiperoleh = opsi[jawaban.option]?.poin ?? 0;
      poinPerMateri[nama_materi].poinDiperoleh += poinDiperoleh;
      poinPerSubmateri[sub_materi].poinDiperoleh += poinDiperoleh;
    }
  });

  // 🔹 Convert jadi array agar bisa dipakai di chart
  const hasilMateri = Object.keys(poinPerMateri).map((nama) => ({
    nama,
    ...poinPerMateri[nama],
  }));

  const hasilSubmateri = Object.keys(poinPerSubmateri).map((nama) => ({
    nama,
    ...poinPerSubmateri[nama],
  }));

  // 🔹 Dataset Chart (Materi)
  const chartDataMateri = {
    labels: hasilMateri.map((i) => i.nama),
    datasets: [
      {
        label: "Poin Didapat",
        data: hasilMateri.map((i) => i.poinDiperoleh),
        backgroundColor: "#2563eb",
      },
      {
        label: "Poin Maksimal",
        data: hasilMateri.map((i) => i.maxPoin),
        backgroundColor: "#f59e0b",
      },
      {
        label: "Passing Grade",
        data: hasilMateri.map((i) => i.passing),
        backgroundColor: "#22c55e",
      },
    ],
  };

  // 🔹 Dataset Chart (Submateri)
  const chartDataSubmateri = {
    labels: hasilSubmateri.map((i) => i.nama),
    datasets: [
      {
        label: "Poin Didapat",
        data: hasilSubmateri.map((i) => i.poinDiperoleh),
        backgroundColor: "#2563eb",
      },
      {
        label: "Poin Maksimal",
        data: hasilSubmateri.map((i) => i.maxPoin),
        backgroundColor: "#22c55e",
      },
    ],
  };

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
    },
    scales: {
      x: {
        beginAtZero: true,
        suggestedMax:
          maxValue ||
          Math.max(
            ...hasilMateri.map((i) => i.maxPoin),
            ...hasilSubmateri.map((i) => i.maxPoin),
          ) + 30,
        ticks: { stepSize: 5 },
      },
    },
    barThickness: 10,
    layout: {
      padding: { top: 30, bottom: 30 },
    },
  };

  // Hitung tinggi dinamis — per item sekitar 40px + padding
  const heightSubmateri = Math.max(400, hasilSubmateri.length * 45 + 80);
  const heightMateri = Math.max(400, hasilMateri.length * 45 + 80);

  return (
    <div className="bg-white w-full shadow p-2 rounded-md space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-primary mb-2">
          Statistik Berdasarkan Sub Materi
        </h2>
        {/* ✅ tinggi dinamis */}
        <div style={{ height: heightSubmateri }}>
          <Bar data={chartDataSubmateri} options={options} />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-primary mb-2">
          Statistik Berdasarkan Materi
        </h2>
        {/* ✅ tinggi dinamis */}
        <div style={{ height: heightMateri }}>
          <Bar data={chartDataMateri} options={options} />
        </div>
      </div>
    </div>
  );
}
