import { useCallback, useEffect, useState } from "react";
import { Eye, Edit, Trash2, X } from "lucide-react";
import {
  adminKelasOnline,
  deleteKelasOnline,
  getKelasOnline,
  updateKelasOnline,
} from "@/lib/axios/kelasOnline";
import Cookies from "js-cookie";
import Alert from "../public/alert";
import { getListJenisProgram } from "@/lib/axios/jenisProgram";
import { getListJenisKelas } from "@/lib/axios/jenisKelas";
import Pagination from "./paginasi";

export default function KelasOnlineTable({ setMode, mode, onEdit }) {
  const [alert, setAlert] = useState(null);
  const token = Cookies.get("token");
  const [search, setSearch] = useState("");
  const [jenis, setJenis] = useState("");
  const [limit, setLimit] = useState(20);

  const [dataKelas, setDataKelas] = useState(null);
  const [page, setPage] = useState(1);
  const [programUtama, setProgramUtama] = useState(null);

  // Modal Delete
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const toggleStatus = async (item) => {
    setDataKelas((prev) => ({
      ...prev,
      data: prev.data.map((row) => {
        return row.id == item.id
          ? {
              ...row,
              properties: { ...row.properties, status: !row.properties.status },
            }
          : row;
      }),
    }));
    try {
      const payload = { ...item.properties, status: !item.properties.status };
      const res = await updateKelasOnline(
        item.id,
        {
          ...payload,
        },
        token
      );
      // console.log(res);
    } catch (error) {
      // console.log(error);
    }
  };

  const fetchJenisProgram = useCallback(async () => {
    try {
      const response = await getListJenisKelas();
      const data = response.data.filter((item) => item.is_active == true);
      setProgramUtama(data);
    } catch (error) {}
  }, []);

  useEffect(() => {
    fetchJenisProgram();
  }, [fetchJenisProgram, mode]);

  const fetchKelasOnline = useCallback(async () => {
    try {
      const res = await adminKelasOnline(
        page,
        limit,
        search,
        null,
        jenis,
        token
      );
      setDataKelas(res.data);
      if (res.status == 200) {
        setAlert({
          type: "success",
          title: "Info",
          message: res.message,
        });
      }
    } catch (error) {
      // //  //  console.log(error);
    }
  }, [page, search, jenis, limit, token]);

  useEffect(() => {
    fetchKelasOnline();
  }, [fetchKelasOnline, mode]);

  // 🗑️ Fungsi konfirmasi delete
  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  // 🧹 Fungsi delete (panggil API delete)
  const handleConfirmDelete = async () => {
    try {
      const res = await deleteKelasOnline(selectedItem.id, token);
      setShowDeleteModal(false);
      setAlert({
        type: "success",
        title: "Berhasil",
        message: `Kelas "${selectedItem.properties.judul}" berhasil dihapus.`,
      });

      // Refresh data
      fetchKelasOnline();
    } catch (error) {
      // //  //  console.log(error);
      setAlert({
        type: "error",
        title: "Gagal",
        message: "Terjadi kesalahan saat menghapus data.",
      });
    }
  };
  return (
    <div className="p-4 md:p-8 w-full font-poppins">
      <h1 className="text-xl font-semibold text-primary">Kelas Online</h1>

      {/* Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3 my-5">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-3">
          <div className="flex flex-col gap-2">
            <h1 className="font-semibold text-gray-700 text-xs">
              Kelas Online
            </h1>
            <select
              value={jenis}
              onChange={(e) => setJenis(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500"
            >
              <option value="">Semua</option>
              {programUtama &&
                programUtama?.map((item, i) => (
                  <option key={i} value={item.name}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="border border-gray-300 rounded-lg px-3 py-2 w-full md:w-64 focus:ring-2 focus:ring-red-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          type="button"
          onClick={() => setMode("form")}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Tambah
        </button>
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-red-700 text-white">
            <tr>
              <th className="p-3">No.</th>
              <th className="p-3">Judul</th>
              <th className="p-3">Jenis Program</th>
              <th className="p-3">Tanggal Mulai</th>
              <th className="p-3">Tanggal Berakhir</th>
              <th className="p-3">Total Jadwal</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {dataKelas &&
              dataKelas.data.map((item, index) => (
                <tr
                  key={item.id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100 transition`}
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{item.properties.judul}</td>
                  <td className="p-3">{item.properties.program_utama}</td>
                  <td className="p-3">{item.properties.tanggalMulai}</td>
                  <td className="p-3">{item.properties.tanggalBerakhir}</td>
                  <td className="p-3 text-center">
                    {item.properties.jadwal.length}
                  </td>
                  <td className="p-3">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={item.properties.status}
                        onChange={() => toggleStatus(item)}
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600 relative"></div>
                    </label>
                  </td>
                  <td className="p-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(item)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {dataKelas && dataKelas.data.length === 0 && (
          <div className="text-center py-6 text-gray-600">Tidak ada data</div>
        )}
      </div>

      <div className="flex justify-center items-center mt-4 text-xs mb-10">
        {dataKelas && (
          <Pagination
            page={page}
            next={dataKelas.nextPage}
            prev={dataKelas.prevPage}
            totalPage={dataKelas.totalPage}
            setPage={setPage}
          />
        )}
      </div>

      {/* 🔔 Alert */}
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* 🗑️ Modal Delete */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowDeleteModal(false)}
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Hapus Kelas
            </h2>
            <p className="text-gray-600 mb-6">
              Apakah kamu yakin ingin menghapus{" "}
              <strong>{selectedItem?.properties?.judul}</strong>?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
