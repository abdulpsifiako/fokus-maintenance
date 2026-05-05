import { Eye, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Alert from "../public/alert";
import {
  deleteProgramUtama,
  deleteVideoProgramUtama,
  getVideoProgramUtama,
  updateVideoProgramUtama,
} from "@/lib/axios/programUtama";
import Cookies from "js-cookie";
import Pagination from "./paginasi";

export default function ProgramUtamaVideoList({ onTambah, onEdit, onView }) {
  const [alert, setAlert] = useState(null);
  const [dataProgram, setDataProgram] = useState(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("created_at|asc");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [programUtama, setprogramUtama] = useState(null);
  const handleLimitChange = (e) => {
    const { value } = e.target;
    setLimit(Number(value));
  };
  const handleSortBy = (params) => {
    setSortBy(params);
    setOpen(false);
  };
  const toggleStatus = async (data) => {
    //  //  console.log(data)
    setDataProgram((prev) => ({
      ...prev,
      data: prev.data.map((item) =>
        item.id === data.id
          ? {
              ...item,
              properties: {
                ...item.properties,
                status: !item.properties.status,
              },
            }
          : item
      ),
    }));

    try {
      const response = await updateVideoProgramUtama(
        data.id,
        {
          ...data,
          properties: {
            ...data.properties,
            status: !data.properties.status,
          },
        },
        Cookies.get("token")
      );

      setAlert({
        type: "success",
        title: "Info",
        message: response.message || "Status berhasil diperbarui",
      });
    } catch (error) {
      setDataProgram((prev) => ({
        ...prev,
        data: prev.data.map((item) =>
          item.id === data.id
            ? {
                ...item,
                properties: {
                  ...item.properties,
                  status: !item.properties.status,
                },
              }
            : item
        ),
      }));

      setAlert({
        type: "error",
        title: "Error",
        message:
          error.response?.data?.message ||
          error.message ||
          "Gagal update status",
      });
    }
  };
  const fetchData = useCallback(async () => {
    try {
      const res = await getVideoProgramUtama(
        page,
        limit,
        search,
        sortBy,
        Cookies.get("token")
      );
      if (res.status == 200) {
        setAlert({
          type: "success",
          title: "Info",
          message: res.message,
        });
        setDataProgram(res.data);
        setPage(res.data.page);
      }
    } catch (error) {
      // //  //  console.log(error)
    }
  }, [page, limit, search, sortBy]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteProgramUtama = async (id) => {
    try {
      const res = await deleteVideoProgramUtama(id, Cookies.get("token"));
      if (res.status == 200) {
        setAlert({
          type: "success",
          title: "Info",
          message: res.message,
        });
      }
      await fetchData();
    } catch (error) {
      //  console.log(error)
    }
  };

  return (
    <div className="space-y-4 font-poppins">
      <h1 className="text-lg font-semibold text-primary">
        Video Program Utama
      </h1>
      <div className="flex justify-between items-center">
        <div className="flex justify-between items-center my-auto mb-3 gap-2">
          <div className="flex items-center my-auto gap-2">
            <div className="flex items-center border p-1 rounded-md border-gray-300 focus-within:ring-1 focus-within:ring-sky-500 focus-within:border-sky-500">
              <input
                type="text"
                name="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search.."
                className="text-xs text-gray-800 p-2 rounded-lg w-full max-w-xs placeholder:text-xs placeholder:px-2 focus:outline-none"
              />
              <Search size={17} color="gray" />
            </div>
            <div className="relative inline-block text-left">
              {/* Icon Button */}
              <button
                onClick={() => setOpen(!open)}
                className="p-2 border border-gray-400 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-0"
              >
                {/* Filter Icon (3 garis horizontal) */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-black"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M6 12h12M8 18h8"
                  />
                </svg>
              </button>

              {/* Dropdown Content */}
              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                  <button
                    type="button"
                    onClick={() => handleSortBy("name|asc")}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Sort A-Z
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSortBy("name|desc")}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Sort Z-A
                  </button>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setSearch(query);
                fetchData();
              }}
              className="p-2.5 bg-primary text-xs text-white rounded-md"
            >
              Cari
            </button>
            <span className="flex items-center my-auto">
              <p className="hidden lg:block">Jumlah data: </p>
              <select
                value={limit}
                onChange={handleLimitChange}
                className="border border-gray-400 rounded p-1 ml-1"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
            </span>
          </div>
        </div>
        <button
          onClick={onTambah}
          className="bg-red-700 text-white p-2 rounded-md flex items-center gap-1"
        >
          <Plus size={16} /> Tambah
        </button>
      </div>

      <div className="rounded overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-primary text-white text-left">
            <tr>
              <th className="p-2 text-center">No</th>
              <th className="p-2">Materi</th>
              <th className="p-2">Paket Program Utama</th>
              <th className="p-2">Total Video</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {dataProgram &&
              dataProgram.data.map((d, i) => (
                <tr
                  key={d.id}
                  className={`${i % 2 === 1 ? "bg-gray-200" : "bg-white"}`}
                >
                  <td className="p-2 text-center">{i + 1}</td>
                  <td className="p-2">{d.properties.materi}</td>
                  <td className="p-2">{d.properties.program_name}</td>
                  <td className="p-2">{d.properties.video.length} Video</td>
                  <td className="px-4 py-3 text-start">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={d.properties.status}
                        onChange={() => toggleStatus(d)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-primary transition"></div>
                      <div className="absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition peer-checked:translate-x-5"></div>
                    </label>
                  </td>
                  <td className="p-2 flex gap-2 justify-start">
                    <button
                      onClick={() => onView(d)}
                      className="p-1 rounded bg-gray-700 text-white"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onEdit(d)}
                      className="p-1 rounded bg-primary text-white"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setprogramUtama(d);
                        setShowDeleteModal(true);
                      }}
                      className="p-1 rounded bg-red-600 text-white"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {showDeleteModal && programUtama && (
        <div className="fixed inset-0 bg-gray-300/60 backdrop-blur-md bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-red-700">
                Hapus Program Utama
              </h3>
              <button onClick={() => setShowDeleteModal(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Apakah kamu yakin ingin menghapus materi{" "}
              <span className="font-semibold">
                {programUtama.properties?.materi}
              </span>
              ? Tindakan ini tidak bisa dibatalkan.
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
                  handleDeleteProgramUtama(programUtama.id);
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
      <div className="flex justify-center items-center mt-4 text-xs mb-10">
        {dataProgram && (
          <Pagination
            page={page}
            next={dataProgram.nextPage}
            prev={dataProgram.prevPage}
            totalPage={dataProgram.totalPage}
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
    </div>
  );
}
