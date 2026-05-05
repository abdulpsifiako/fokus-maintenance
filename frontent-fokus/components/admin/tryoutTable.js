import { getListJenisProgram } from "@/lib/axios/jenisProgram";
import { Eye, FileDown, Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Alert from "../public/alert";
import {
  adminTryout,
  deleteTryOut,
  downloadNilaiTryoutXLSX,
  getTryout,
  updateTryOut,
} from "@/lib/axios/tryout";
import Cookies from "js-cookie";
import { getListJenisTo } from "@/lib/axios/jenisTo";
import Pagination from "./paginasi";

export default function TryoutTable({ setMode, onEdit }) {
  const token = Cookies.get("token");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [jenisLatihan, setJenisLatihan] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("created_at|desc");
  const [dataTryout, setDataTryout] = useState(null);

  const [alert, setAlert] = useState(null);
  const [jenis, setJenisProgram] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  const handleDownloadNilai = async (item) => {
    if (downloadingId) return;
    setDownloadingId(item.id);

    try {
      const response = await downloadNilaiTryoutXLSX(item.id, token);

      const disposition = response.headers["content-disposition"];
      let filename = `Nilai_Tryout_${item.id}.xlsx`;
      if (disposition) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match) filename = match[1];
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      if (error.response?.data instanceof Blob) {
        const text = await error.response.data.text();
        const json = JSON.parse(text);
        setAlert({ type: "info", title: "Info", message: json.message });
      } else {
        setAlert({
          type: "error",
          title: "Error",
          message: "Gagal mengunduh file",
        });
      }
    } finally {
      setDownloadingId(null);
    }
  };
  const toggleStatus = async (item) => {
    setDataTryout((prev) => ({
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
      const res = await updateTryOut(
        item.id,
        {
          ...payload,
        },
        token,
      );
      // console.log(res);
    } catch (error) {
      // console.log(error);
    }
  };

  const fetchJenisProgram = useCallback(async () => {
    try {
      const response = await getListJenisTo();
      const data = response.data.filter((item) => {
        return item.is_active == true;
      });
      setJenisProgram(data);
    } catch (error) {
      setAlert({
        type: "error",
        title: "Error",
        message: error.message || "Failed to fetch data",
      });
    }
  }, []);
  const fetchData = useCallback(async () => {
    try {
      const res = await adminTryout(
        page,
        limit,
        search,
        sortBy,
        status,
        jenisLatihan,
        token,
      );
      if (res.status == 200) {
        setAlert({
          type: "success",
          title: "Info",
          message: res.message,
        });
        setDataTryout(res.data);
        setPage(res.data.page);
      }
    } catch (error) {
      // //  //  console.log(error)
    }
  }, [page, limit, search, sortBy, jenisLatihan, status, token]);
  useEffect(() => {
    fetchJenisProgram();
  }, [fetchJenisProgram]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedItem) return;
    try {
      setIsDeleting(true);
      const res = await deleteTryOut(selectedItem.id, token);
      if (res.status === 200 || res.status === 201) {
        setAlert({
          type: "success",
          title: "Sukses",
          message: "Try Out berhasil dihapus",
        });
        setShowDeleteModal(false);
        fetchData(); // refresh tabel
      }
    } catch (error) {
      // //  //  console.log(error);
      setAlert({
        type: "error",
        title: "Gagal",
        message: error.response?.data?.message || "Gagal menghapus data",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  // console.log(dataTryout);
  return (
    <>
      <header className="">
        <h1 className="text-xl font-semibold text-primary">Try Out</h1>
        <div className="flex gap-2">
          <div className="space-y-1">
            <h1 className="text-xs">Jenis Program</h1>
            <select
              value={jenisLatihan}
              onChange={(e) => setJenisLatihan(e.target.value)}
              className="border border-gray-400 p-2 rounded focus:outline-red-500 w-full"
            >
              <option value="">Semua</option>
              {jenis && jenis.length > 0 ? (
                jenis.map((item, index) => (
                  <option key={index} value={item.value || item.name}>
                    {item.name}
                  </option>
                ))
              ) : (
                <option value="">Semua</option>
              )}
            </select>
          </div>
          <div className="mt-auto">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mt-3 md:mt-0 px-4 py-2.5 w-full md:w-72 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-400 focus:outline-none transition"
              placeholder="Cari nama"
            />
          </div>
        </div>
      </header>
      <div className="w-full flex justify-end my-3">
        <button
          type="button"
          onClick={() => setMode("form")}
          className="bg-primary rounded-md text-white flex items-center my-auto p-2"
        >
          <span>
            <Plus />
          </span>
          Tambah
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left ">
          <thead>
            <tr className="bg-red-600 text-white">
              <th className="px-4 py-3">No</th>
              <th className="px-4 py-3">Judul</th>
              <th className="px-4 py-3">Jenis Program</th>
              <th className="px-4 py-3">Total Materi</th>
              <th className="px-4 py-3">Total Soal</th>
              <th className="px-4 py-3">Waktu Pengerjaan</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dataTryout &&
              (dataTryout.data.length > 0 ? (
                dataTryout.data.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="bg-gray-50 hover:bg-gray-100 transition rounded-lg shadow-sm"
                  >
                    <td className="px-4 py-3 font-medium text-gray-700">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3">{item.properties.judul}</td>
                    <td className="px-4 py-3">{item.properties.jenis}</td>
                    <td className="px-4 py-3">
                      {item.properties.materi.length}
                    </td>
                    <td className="px-4 py-3">
                      {item.properties.materi.reduce(
                        (total, m) => total + (m.data_soal?.length || 0),
                        0,
                      )}{" "}
                      Soal
                    </td>
                    <td className="px-4 py-3">{item.properties.waktu} Menit</td>
                    <td className="p-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.properties.status}
                          className="sr-only peer"
                          onChange={() => toggleStatus(item)}
                        />
                        <div className="w-11 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-primary transition"></div>
                        <div className="absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition peer-checked:translate-x-5"></div>
                      </label>
                    </td>
                    <td className="space-x-2">
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="p-1 rounded bg-primary text-white"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadNilai(item)}
                        disabled={downloadingId === item.id}
                        title="Download Nilai"
                        className={`p-1 rounded text-white transition-all
        ${
          downloadingId === item.id
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
                      >
                        {downloadingId === item.id ? (
                          <div
                            className="w-4 h-4 border-2 border-white/30
          border-t-white rounded-full animate-spin"
                          />
                        ) : (
                          <FileDown size={16} />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(item)}
                        className="p-1 rounded bg-red-600 text-white hover:bg-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center p-6 text-gray-500 italic bg-gray-50 rounded-lg"
                  >
                    Try Out masih kosong
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <div className="flex justify-center items-center mt-4 text-xs mb-10">
          {dataTryout && (
            <Pagination
              page={page}
              next={dataTryout.nextPage}
              prev={dataTryout.prevPage}
              totalPage={dataTryout.totalPage}
              setPage={setPage}
            />
          )}
        </div>
        {alert && (
          <Alert
            type={alert.type}
            title={alert.title}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}
        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-80">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Hapus Try Out?
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Apakah kamu yakin ingin menghapus{" "}
                <span className="font-medium text-red-600">
                  {selectedItem?.properties?.judul}
                </span>
                ?<br />
                Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-60"
                >
                  {isDeleting ? "Menghapus..." : "Ya, Hapus"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
