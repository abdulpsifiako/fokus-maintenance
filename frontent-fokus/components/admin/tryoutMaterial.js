import { Pencil, PencilLine, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { SoalItemTO } from "./soalItemTry";

export default function MateriSoalTable({ form, setForm }) {
  const [showModal, setShowModal] = useState(false);
  const [showSoalModal, setShowSoalModal] = useState(false);

  const [dataMateri, setDataMateri] = useState({
    nama: "",
    submateri: "",
    passing: "",
    data_soal: [],
  });

  const [indexMateri, setIndexMateri] = useState(0);
  const [modeMateri, setModeMateri] = useState("add");
  const [selectMateri, setSelectMateri] = useState(null);

  // === Tambah Materi Soal ===
  const handleSubmit = () => {
    if (modeMateri === "add") {
      // Tambah Materi Baru
      setForm((prev) => ({
        ...prev,
        materi: [...prev.materi, dataMateri],
      }));
    } else if (modeMateri === "edit" && indexMateri !== null) {
      // Edit Materi
      setForm((prev) => {
        const updatedMateri = [...prev.materi];
        updatedMateri[indexMateri] = {
          ...updatedMateri[indexMateri],
          ...dataMateri, // ambil perubahan dari form
        };
        return { ...prev, materi: updatedMateri };
      });
    }

    // Reset state & tutup modal
    setDataMateri({
      nama: "",
      submateri: "",
      passing: "",
      data_soal: [],
    });
    setModeMateri("add");
    setSelectMateri(null);
    setIndexMateri(null);
    setShowModal(false);
  };


  // === Tambah Soal di Materi ===
  const handleSaveSoal = (soalBaru) => {
    setForm((prev) => {
      const updatedMateri = [...prev.materi];
      updatedMateri[indexMateri].data_soal.push(soalBaru);
      return { ...prev, materi: updatedMateri };
    });
    setShowSoalModal(false);
  };
  return (
    <div className="my-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Materi Soal</h3>
        <button
        type="button"
          onClick={() => setShowModal(true)}
          className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition"
        >
          Tambah Materi Soal
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md shadow-sm border border-gray-200">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-red-700 text-white text-left">
              <th className="p-3 font-semibold">Materi</th>
              <th className="p-3 font-semibold">Sub Materi</th>
              <th className="p-3 font-semibold">Nomor Soal</th>
              <th className="p-3 font-semibold">Passing Grade</th>
              <th className="p-3 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {form.materi.length > 0 ? (
              form.materi.map((item, index) => {
                const soalSebelumnya = form.materi
                  .slice(0, index)
                  .reduce((acc, curr) => acc + (curr.data_soal?.length || 0), 0);

                const jumlahSoal = item.data_soal?.length || 0;

                // Tentukan rentang soal
                const dari = soalSebelumnya + 1;
                const sampai = soalSebelumnya + jumlahSoal;

                return (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } border-b border-gray-200`}
                >
                  <td className="p-3">{item.nama}</td>
                  <td className="p-3">{item.submateri}</td>
                  <td className="p-3 text-left">
                     {jumlahSoal > 0 ? `${dari} - ${sampai}` : "-"}
                  </td>
                  <td className="p-3">{item.passing}</td>
                  <td className="p-3 text-center flex justify-center gap-2">
                    {/* === Tambah Soal Button === */}
                    <button
                    type="button"
                      onClick={() => {
                        setIndexMateri(index);
                        setShowSoalModal(true);
                      }}
                      className="bg-green-600 hover:bg-green-500 text-white p-2 rounded-md transition"
                      title="Tambah/Edit Soal"
                    >
                      <Plus size={16} />
                    </button>

                    {/* Edit Materi */}
                    
                    <button
                      type="button"
                      onClick={() => {
                        setIndexMateri(index);
                        setDataMateri(item); // langsung isi form edit
                        setModeMateri("edit");
                        setShowModal(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-md transition"
                      title="Edit Materi"
                    >
                      <Pencil size={16} />
                    </button>


                    {/* Hapus Materi */}
                    <button
                    type="button"
                      className="bg-red-700 hover:bg-red-800 text-white p-2 rounded-md transition"
                      title="Hapus Materi"
                      onClick={() => {
                        if (confirm(`Hapus ${item.submateri}?`)) {
                          setForm((prev) => ({
                            ...prev,
                            materi: prev.materi.filter((_, i) => i !== index),
                          }));
                        }
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              )})
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center p-4 text-gray-500 italic"
                >
                  Belum ada data materi soal.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* === Modal Tambah/Edit Materi === */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-2xl p-6 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              {modeMateri === "edit" ? "Edit Materi Soal" : "Tambah Materi Soal"}
            </h3>

            <div className="space-y-4">
              {/* Nama Materi */}
              <div className="max-w-md">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Nama Materi
                </label>
                <input
                  type="text"
                  name="nama"
                  value={dataMateri.nama}
                  onChange={(e) =>
                    setDataMateri((prev) => ({
                      ...prev,
                      nama: e.target.value,
                    }))
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="Masukkan materi"
                />
              </div>

              {/* Sub Materi */}
              <div className="max-w-md">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Nama Sub Materi
                </label>
                <input
                  type="text"
                  name="submateri"
                  value={dataMateri.submateri}
                  onChange={(e) =>
                    setDataMateri((prev) => ({
                      ...prev,
                      submateri: e.target.value,
                    }))
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="Masukkan Sub materi"
                />
              </div>

              {/* Passing Grade */}
              <div className="max-w-md">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Passing Grade
                </label>
                <input
                  type="number"
                  name="passing"
                  value={dataMateri.passing}
                  onChange={(e) =>
                    setDataMateri((prev) => ({
                      ...prev,
                      passing: e.target.value,
                    }))
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="Contoh: 65"
                />
              </div>

              {/* Tombol Aksi */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setModeMateri("add");
                    setDataMateri({
                      nama: "",
                      passing: "",
                      submateri: "",
                      data_soal: [],
                    });
                    setShowModal(false);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* === Modal Tambah Soal === */}
      {showSoalModal && (
        <SoalItemTO
          index={indexMateri}   // index materi yang ingin ditambah soalnya
          form={form}
          setForm={setForm}
          onClose={() => setShowSoalModal(false)}
        />
      )}


    </div>
  );
}
