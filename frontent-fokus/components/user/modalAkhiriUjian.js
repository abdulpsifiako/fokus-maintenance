import { createHistory, createJawabanUser } from "@/lib/axios/programUtama";
import { addTotalSkor } from "@/lib/redux/store/soalSlice";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import LoadingModal from "../public/loadingModal";
import { useState } from "react";

export default function ModalAkhiriUjian({
  setShowEndModal,
  dataSoal,
  answered,
  answerUser,
  isTimeOut,
}) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const token = Cookies.get("token");

  const handleHistory = async () => {
    try {
      await createHistory(
        {
          jenis: "Program Utama",
          typelatihan: "Latihan",
          orderstatus: "success",
          submateri: dataSoal?.title,
          id_program: dataSoal?.program_id,
          materi: dataSoal?.module_name,
        },
        token
      );
      if (onHistoryCreated) onHistoryCreated();
    } catch (error) {
      //  //  console.log(error);
    }
  };
  const handleSubmit = async () => {
    setLoading(true); // tampilkan loading sebelum pindah halaman
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const soal = dataSoal?.datasoal || [];

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
          data_soal: dataSoal,
          data_answer: answerUser,
          total_skor,
          jenis: dataSoal.jenis,
          program_id: dataSoal.program_id,
        },
        token
      );

      if (res.status === 200) {
        handleHistory();
        dispatch(addTotalSkor(total_skor));

        setShowEndModal(false);
        router.push("/hasil");
      }
    } catch (error) {
      // //  //  console.log(error);
    }
  };
  //  //  console.log(dataSoal);
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm font-poppins">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 sm:p-8 space-y-5 animate-fadeIn">
          {/* Judul */}
          <h2 className="text-lg sm:text-xl font-semibold text-center text-gray-800">
            Konfirmasi Penyelesaian
          </h2>

          {/* Ringkasan */}
          <div className="w-full text-sm text-gray-700">
            <div className="flex flex-col gap-4 justify-center mx-auto w-3/4">
              {[
                { label: "Total Soal", value: dataSoal?.questions || 0 },
                { label: "Terjawab", value: answered.length },
                {
                  label: "Belum Dijawab",
                  value: (dataSoal?.questions || 0) - answered.length,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center pb-2 border-b border-gray-200"
                >
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-semibold text-gray-900">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-end gap-3 pt-4">
            {!isTimeOut && (
              <button
                onClick={() => setShowEndModal(false)}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-100 transition"
              >
                Cek Kembali
              </button>
            )}
            <button
              onClick={() => {
                handleSubmit();
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
            >
              Kirim Jawaban
            </button>
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.25s ease-out;
          }
        `}</style>

        <LoadingModal show={loading} />
      </div>
    </>
  );
}
