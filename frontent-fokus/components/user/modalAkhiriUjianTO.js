import { createHistory, createJawabanUser } from "@/lib/axios/programUtama";
import { addTotalSkor } from "@/lib/redux/store/soalSlice";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

export default function ModalAkhiriUjianTO({
  setShowEndModal,
  dataSoal,
  answered,
  answerUser,
  isTimeOut,
}) {
  const dispatch = useDispatch();
  const router = useRouter();

  const token = Cookies.get("token");

  const handleSubmit = async () => {
    const soal = dataSoal?.datasoal || [];
    const passingPerMateri = Object.values(
      dataSoal.datasoal.reduce((acc, soal) => {
        const materi = soal.nama_materi;
        if (!acc[materi]) {
          acc[materi] = {
            nama_materi: materi,
            passing_grade: Number(soal.passing_grade) || 0,
          };
        }
        return acc;
      }, {})
    );

    const minPoin = passingPerMateri.reduce(
      (total, m) => total + m.passing_grade,
      0
    );

    const total_skor = soal.reduce((total, item, idx) => {
      const soalIndex = idx.toString();
      const jawaban = answerUser[soalIndex]; // bisa undefined

      if (!jawaban) {
        return total; // skip kalau gak ada jawaban
      }

      const jawabanIndex = jawaban.option;
      const opsiDipilih = item.opsi[jawabanIndex];

      return total + (opsiDipilih?.poin || 0);
    }, 0);

    try {
      const res = await createJawabanUser(
        {
          data_soal: {
            ...dataSoal,
            keterangan: total_skor >= minPoin ? "Lulus" : "Tidak Lulus",
          },
          data_answer: answerUser,
          total_skor,
          jenis: dataSoal.jenis,
          program_id: dataSoal.program_id,
        },
        token
      );

      if (res.status === 200) {
        dispatch(addTotalSkor(total_skor));
        router.push("/detail-to/hasil");
      }
    } catch (error) {
      // //  //  console.log(error);
    }
  };
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center font-poppins bg-gray-300/60 backdrop-blur-sm">
        <div className="bg-white rounded-md shadow-md max-w-md w-full p-6 space-y-4">
          <h2 className="text-lg font-bold text-center">Konfirmasi Selesai</h2>
          <div className="w-full text-sm ">
            <div className="flex flex-col gap-3 justify-center mx-auto w-3/4">
              <div className="flex border-b border-b-gray-500 justify-between">
                <h1>Total Soal</h1>
                <h1>{dataSoal?.questions || 0}</h1>
              </div>
              <div className="flex border-b border-b-gray-500 justify-between">
                <h1>Terjawab</h1>
                <h1>{answered.length}</h1>
              </div>
              <div className="flex border-b border-b-gray-500 justify-between">
                <h1>Belum Dijawab</h1>
                <h1>{dataSoal?.questions - answered.length || 0}</h1>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            {!isTimeOut && ( // tombol ini hanya muncul kalau BUKAN timeout
              <button
                onClick={() => setShowEndModal(false)}
                className="border border-red-500 text-red-600 px-4 py-1 rounded hover:bg-red-50 text-sm"
              >
                Cek Kembali
              </button>
            )}
            <button
              onClick={() => {
                handleSubmit();
                setShowEndModal(false);
              }}
              className="bg-blue-600 hover:opacity-70 text-white px-4 py-1 rounded text-sm"
            >
              Kirim Jawaban
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
