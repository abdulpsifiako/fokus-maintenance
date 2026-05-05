import {
  getListMateri,
  getListProgramUtamaLatihan,
} from "@/lib/axios/programUtama";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { ModalPreview } from "./modalPriview";

export const LatihanDetail = ({
  form,
  setForm,
  infoProgram,
  // setDataMateri,
  // dataMateri,
  mode,
  onBack,
  onAddLatihan,
  onEditLatihan,
  submit,
}) => {
  const token = Cookies.get("token");
  const [programId, setProgramId] = useState("");
  const [selectedData, setSelectedData] = useState(null);
  const [showPreview, setShowPriview] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  // const getListMateriProgram = useCallback(async () => {
  //   try {
  //     const res = await getListMateri(programId, token);
  //     setDataMateri(res.data);
  //   } catch (error) {
  //     // //  //  console.log(error)
  //   }
  // }, [programId, token, setDataMateri]);

  const handeleStatus = (ind) => {
    setForm((prev) => {
      const latihanList = [...prev.latihan];
      latihanList[ind] = {
        ...latihanList[ind],
        status: !latihanList[ind].status,
      };
      return { ...prev, latihan: latihanList };
    });
  };
  const handleDelete = (ind) => {
    setForm((prev) => ({
      ...prev,
      latihan: prev.latihan.filter((_, i) => i !== ind),
    }));
  };
  useEffect(() => {
    if (mode === "edit") {
      setProgramId(form.program_id);
    }
    // if (programId) {
    //   getListMateriProgram();
    // }
  }, [mode, form.program_id]);
  const cMateriId = useRef(form.materi_id);
  const cProgramId = useRef(form.program_id);
  useEffect(() => {
    if (
      cMateriId.current != form.materi_id ||
      cProgramId.current != form.program_id
    ) {
      setForm((prev) => ({ ...prev, latihan: [] }));
      cMateriId.current = form.materi_id;
      cProgramId.current = form.program_id;
    }
  }, [form.materi_id, form.program_id]);

  //  //  console.log(form);

  return (
    <>
      <header className="space-x-1">
        <h1 className="text-xl font-semibold text-primary">
          {mode === "add" ? "Tambah" : mode === "edit" ? "Edit" : "View"}{" "}
          Latihan
        </h1>
        <p className="text-xs font-light">
          Latihan/
          <span className="text-primary font-medium">
            {mode === "add" ? "Tambah" : "Edit"}
          </span>
        </p>
      </header>
      <div className="flex gap-2 justify-end ml-auto text-xs">
        <button
          onClick={onBack}
          className="py-2 px-4 border border-primary text-primary rounded-md font-semibold"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={submit}
          className={`${mode === "view" ? "hidden" : "py-2 px-4 bg-primary text-white font-semibold rounded-md"}`}
        >
          Simpan
        </button>
      </div>
      <div className="space-y-3">
        <div className="flex flex-col gap-1">
          <label>Masukan materi</label>
          {/* <select
            name="materi_id"
            value={form.materi}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                materi: e.target.selectedOptions[0].text,
              }));
              handleChange(e);
            }}
            className="text-xs border border-gray-400 p-2 rounded-md max-w-xs"
          >
            <option value="">Semua</option>
            {dataMateri &&
              dataMateri.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.materi}
                </option>
              ))}
          </select> */}
          <input
            type="text"
            name="materi"
            value={form.materi}
            onChange={(e) => setForm({ ...form, materi: e.target.value })}
            required
            placeholder="Masukkan materi"
            className="text-xs border border-gray-400 p-2 rounded-md max-w-xs"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label>Program Utama</label>
          <select
            name="program_id"
            value={form.program_id}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                program_utama: e.target.selectedOptions[0].text,
              }));
              setProgramId(e.target.value);
              handleChange(e);
            }}
            className="text-xs border border-gray-400 p-2 rounded-md max-w-xs"
          >
            <option value="">Pilih program utama</option>
            {infoProgram &&
              infoProgram.map((item, index) => (
                <option key={index} value={item.program_id}>
                  {item.name}
                </option>
              ))}
          </select>
        </div>
        <div className="">
          <label>Status</label>
          <div className="flex gap-2">
            <label className="relative inline-flex items-center cursor-pointer my-auto">
              <input
                type="checkbox"
                checked={form.status}
                onChange={(e) => {
                  const { checked } = e.target;
                  setForm((prev) => ({ ...prev, status: checked }));
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-primary transition"></div>
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-5"></div>
            </label>
            <h1 className="text-xs items-center my-auto">tidak aktif/aktif</h1>
          </div>
        </div>
        <div className="flex justify-between">
          <h1 className="text-xs font-semibold">Latihan Soal</h1>
          <button
            type="button"
            onClick={() => onAddLatihan(form.materi_id)}
            className={`${mode === "view" ? "hidden" : "bg-primary px-3 py-2 rounded-sm text-xs text-white font-semibold"}`}
          >
            Tambah Latihan
          </button>
        </div>
        <div className="rounded-t-md overflow-x-auto overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-white bg-primary">
              <tr>
                <th className="p-2 font-medium">No</th>
                <th className="p-2 font-medium">Judul</th>
                <th className="p-2 font-medium">Kategori Program</th>
                <th className="p-2 font-medium">Waktu Pengerjaan</th>
                <th className="p-2 font-medium">Total Soal</th>
                <th className="p-2 font-medium">Status</th>
                <th className="p-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {form.latihan.length > 0 ? (
                form.latihan.map((item, ind) => (
                  <tr key={ind} className="text-center even:bg-gray-300">
                    <td className="p-2">{ind + 1}</td>
                    <td className="p-2">{item.judul}</td>
                    <td className="p-2">{item.kategori}</td>
                    <td className="p-2">{item.waktu} Menit</td>
                    <td className="p-2">{item.datasoal.length}</td>
                    <td className="p-2">
                      <label className="relative inline-flex items-center cursor-pointer my-auto">
                        <input
                          type="checkbox"
                          checked={item.status}
                          onChange={() => handeleStatus(ind)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-primary transition"></div>
                        <div className="absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition peer-checked:translate-x-5"></div>
                      </label>
                    </td>
                    <td className="space-x-2">
                      {mode === "view" ? (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedData(item);
                            setShowPriview(true);
                          }}
                          className="p-1 rounded bg-gray-700 text-white"
                        >
                          <Eye size={16} />
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => onEditLatihan(item, ind)}
                            className="p-1 rounded bg-primary text-white"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(ind)}
                            className="p-1 rounded bg-red-600 text-white"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center p-2">
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {showPreview && (
          <ModalPreview
            latihan={selectedData}
            onClose={() => setShowPriview(false)}
          />
        )}
      </div>
    </>
  );
};
