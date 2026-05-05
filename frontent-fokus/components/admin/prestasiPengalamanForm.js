import { useState } from "react";
import { Trash2, Pencil, Plus } from "lucide-react";

export default function PrestasiPengalamanForm({prestasiList, setPrestasiList}) {
  const maxFields = 5;
  const [countPrestasi, setCountPrestasi] = useState(4);

  const handleChange = (value, index) => {
    const updated = [...prestasiList];
    updated[index] = value;
    setPrestasiList(updated);
  };

  const handleAdd = () => {
    if (prestasiList.length < maxFields) {
      setPrestasiList([...prestasiList, ""]);
    }
    setCountPrestasi(prev=> prev - 1);
  };

  const handleRemove = (index) => {
    const updated = [...prestasiList];
    updated.splice(index, 1);
    setPrestasiList(updated);
    setCountPrestasi(prev=> prev + 1);
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4 max-w-sm">
        <label className="block font-semibold mb-2 items-center my-auto">Prestasi dan Pengalaman</label>
        <button
            onClick={handleAdd}
            disabled={prestasiList.length >= maxFields}
            className={`flex items-center my-auto bg-red-700 text-white p-1 rounded shadow ${prestasiList.length == maxFields ? "hidden" : ""}`}
          >
            <Plus color="white" size={16} />
            Tambah
        </button>
      </div>
        {prestasiList.map((value, index) => (
          <div key={index} className="flex items-start gap-2 mb-2">
            <textarea
              value={value}
              onChange={(e) => handleChange(e.target.value, index)}
              placeholder="Masukkan Pengalaman / prestasi Fasilitator"
              className="border border-gray-400 rounded w-sm px-3 py-2 focus:outline-none focus:ring-0 focus:border-primary focus:border-2 "
            ></textarea>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => handleRemove(index)}
                className="bg-red-600 text-white p-2 rounded"
                title="Hapus"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        <p className="text-sm text-red-600">Max. penambahan tersedia {countPrestasi}</p>
    </div>
  );
}
