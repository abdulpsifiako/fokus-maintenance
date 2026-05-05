import { useRouter } from "next/router";
import { useEffect } from "react";

export default function ResultSummaryTO({ dataSoal, skor }) {
  const router = useRouter();
  useEffect(() => {
    if (!dataSoal) {
      router.push("/");
    }
  }, [router, dataSoal]);

  if (!dataSoal || !dataSoal.datasoal) {
    return null;
  }

  // 🔹 Hitung total poin maksimal dari semua opsi tertinggi tiap soal
  const maxPoin = dataSoal.datasoal.reduce((total, soal) => {
    if (!soal.opsi || soal.opsi.length === 0) return total;
    const poinTertinggi = Math.max(...soal.opsi.map((o) => o.poin || 0));
    return total + (isFinite(poinTertinggi) ? poinTertinggi : 0);
  }, 0);

  // 🔹 Hitung passing grade unik per submateri, lalu total per materi
  const grouped = {};

  dataSoal.datasoal.forEach((soal) => {
    const { nama_materi, sub_materi, passing_grade } = soal;
    if (!grouped[nama_materi]) grouped[nama_materi] = {};

    // hanya tambahkan jika submateri belum ada (unik)
    if (!grouped[nama_materi][sub_materi]) {
      grouped[nama_materi][sub_materi] = Number(passing_grade) || 0;
    }
  });

  // 🔹 Bentuk array passing per materi
  const passingPerMateri = Object.entries(grouped).map(([materi, subs]) => ({
    nama_materi: materi,
    passing_grade: Object.values(subs).reduce((a, b) => a + b, 0),
  }));

  // 🔹 Total minimal poin lulus
  const minPoin = passingPerMateri.reduce(
    (total, m) => total + m.passing_grade,
    0
  );

  const isLulus = Number(skor) >= Number(minPoin);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex-1">
        <h2 className="text-lg font-semibold mb-1">
          Terima Kasih atas Partisipasi Anda
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Berikut adalah hasil yang telah Anda kerjakan
        </p>

        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span>Tryout</span>
            <span>{dataSoal.title}</span>
          </div>

          <div className="flex justify-between">
            <span>Skor Anda</span>
            <span>
              <span className="text-red-600 font-bold">{skor}</span> / {maxPoin}
            </span>
          </div>

          <hr className="my-2" />

          <div className="flex justify-between font-semibold">
            <span>Total Poin Maksimal</span>
            <span>{maxPoin || 0}</span>
          </div>

          <div className="flex justify-between font-semibold">
            <span>Minimal Poin Lulus</span>
            <span>{minPoin}</span>
          </div>

          <div className="flex justify-between font-semibold">
            <span>Keterangan</span>
            <span
              className={`${
                isLulus ? "text-green-500" : "text-primary"
              } font-bold`}
            >
              {isLulus ? "Lulus" : "Tidak Lulus"}
            </span>
          </div>

          <hr className="my-2" />

          <div className="h-full">
            <h3 className="font-semibold text-sm mb-1">Detail Materi:</h3>
            <ul className="text-xs space-y-1">
              {passingPerMateri.map((m, i) => (
                <li
                  key={i}
                  className="flex justify-between border-b border-gray-100 pb-1"
                >
                  <span>{m.nama_materi}</span>
                  <span className="text-gray-700">{m.passing_grade}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button
          onClick={() => {
            router.push({
              pathname: "/detail-to/pembahasan",
              query: {
                program_id: dataSoal.program_id,
                jenis: dataSoal.jenis,
                title: dataSoal.title,
              },
            });
          }}
          className="mt-6 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded text-sm font-semibold"
        >
          Lihat Selengkapnya
        </button>
      </div>
    </div>
  );
}
