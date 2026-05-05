import {
  deleteJenisProgram,
  getListJenisProgram,
  updateJenisProgram,
} from "@/lib/axios/jenisProgram";
import { Eye, Edit, Trash2, Plus, X } from "lucide-react";
import { use, useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import Alert from "../public/alert";
import {
  deleteJenisKelas,
  getListJenisKelas,
  updateJenisKelas,
} from "@/lib/axios/jenisKelas";
import {
  deleteJenisTo,
  getListJenisTo,
  updateJenisTo,
} from "@/lib/axios/jenisTo";

function JenisToTable({ onAdd, onEdit, onDetail }) {
  const [datajenisProgram, setJenisProgram] = useState([]);
  const [alert, setAlert] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedJenis, setSelectedJenis] = useState(null);

  const toggleStatus = async (data) => {
    setJenisProgram((prev) =>
      prev.map((item) =>
        item.id === data.id ? { ...item, is_active: !item.is_active } : item
      )
    );
    try {
      const response = await updateJenisTo(
        data.id,
        { ...data, is_active: !data.is_active },
        Cookies.get("token")
      );
      setAlert({
        type: "success",
        title: "Info",
        message: response.message || "Failed to fetch data",
      });
    } catch (error) {
      setAlert({
        type: "error",
        title: "Error",
        message: error.message || "Failed to fetch data",
      });
    }
  };

  const fetchJenisProgram = useCallback(async () => {
    try {
      const response = await getListJenisTo();
      setJenisProgram(response.data.reverse());
      setAlert({
        type: "success",
        title: "Info",
        message: response.message || "Failed to fetch data",
      });
    } catch (error) {
      setAlert({
        type: "error",
        title: "Error",
        message: error.message || "Failed to fetch data",
      });
    }
  }, []);
  const handleDeleteJenis = async (params) => {
    try {
      const response = await deleteJenisTo(params, Cookies.get("token"));
      setAlert({
        type: "success",
        title: "Info",
        message: response.message || "Failed to fetch data",
      });
      await fetchJenisProgram();
    } catch (error) {
      setAlert({
        type: "error",
        title: "Error",
        message: error.message || "Failed to fetch data",
      });
    }
  };
  useEffect(() => {
    fetchJenisProgram();
  }, [fetchJenisProgram]);

  return (
    <div className="p-4 bg-white rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">Jenis Program</h1>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg shadow-sm transition"
        >
          <Plus size={18} />
          Tambah
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-4 py-3 text-left">No.</th>
              <th className="px-4 py-3 text-left">Jenis Program</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {datajenisProgram.length > 0 ? (
              datajenisProgram.map((item, i) => (
                <tr key={item.id} className={i % 2 ? "bg-gray-50" : "bg-white"}>
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.is_active}
                        onChange={() => toggleStatus(item)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-primary transition"></div>
                      <div className="absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition peer-checked:translate-x-5"></div>
                    </label>
                  </td>
                  <td className="px-4 py-3 flex justify-start gap-2">
                    <button
                      onClick={() => onDetail(item)}
                      className="p-1 rounded bg-gray-600 hover:bg-gray-700 text-white transition"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onEdit(item)}
                      className="p-1 rounded bg-blue-900 hover:bg-blue-950 text-white transition"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedJenis(item);
                        setShowDeleteModal(true);
                      }}
                      className="p-1 rounded bg-red-600 hover:bg-red-700 text-white transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className=" text-center">
                  Tidak ada data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showDeleteModal && selectedJenis && (
        <div className="fixed inset-0 bg-gray-300/60 backdrop-blur-md bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-red-700">
                Hapus Fasilitator
              </h3>
              <button onClick={() => setShowDeleteModal(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Apakah kamu yakin ingin menghapus{" "}
              <span className="font-semibold">{selectedJenis.name}</span>?
              Tindakan ini tidak bisa dibatalkan.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  handleDeleteJenis(selectedJenis.id);
                  setShowDeleteModal(false);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
}

export default JenisToTable;
