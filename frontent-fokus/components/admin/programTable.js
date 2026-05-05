import { deleteProgram, getProgram, updateProgram } from "@/lib/axios/program";
import { Eye, Trash2, Plus, Pencil, Search, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Alert from "../public/alert";
import Cookies from "js-cookie";
import Pagination from "./paginasi";

export default function ProgramTable({ onAdd, onEdit, onDetail }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const [alert, setAlert] = useState(null);
  const [dataProgram, setDataProgram] = useState(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("created_at|desc");

  const handleLimitChange = (e) => {
    const { value } = e.target;
    setLimit(Number(value));
  };
  const handleSortBy = (params) => {
    setSortBy(params);
    setOpen(false);
  };

  const toggleStatus = async (data) => {
    setDataProgram((prev) => ({
      ...prev,
      data: prev.data.map((item) =>
        item.id === data.id ? { ...item, is_active: !item.is_active } : item
      ),
    }));

    try {
      const response = await updateProgram(
        data.id,
        { ...data, is_active: !data.is_active },
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
          item.id === data.id ? { ...item, is_active: data.is_active } : item
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
      const res = await getProgram(page, limit, search, sortBy);
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

  const handleDeleteProgram = async (id) => {
    try {
      const res = await deleteProgram(id, Cookies.get("token"));
      if (res.status == 200) {
        setAlert({
          type: "success",
          title: "Info",
          message: res.message,
        });
      }
      await fetchData();
    } catch (error) {
      // //  //  console.log(error)
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-red-700">Paket Program Utama</h1>
      </div>
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
        <button
          onClick={onAdd}
          className="bg-red-700 text-white p-2 rounded-md flex items-center gap-1"
        >
          <Plus size={16} /> Tambah
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded overflow-hidden shadow-sm min-w-[600px]">
          <thead className="bg-red-700 text-white text-sm">
            <tr>
              <th className="px-4 py-2 text-left">No.</th>
              <th className="px-4 py-2 text-left">Nama Paket</th>
              <th className="px-4 py-2 text-left">Durasi Paket</th>
              <th className="px-4 py-2 text-left">Harga</th>
              <th className="px-4 py-2 text-left">Diskon</th>
              <th className="px-4 py-2 text-center">Status</th>
              <th className="px-4 py-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dataProgram &&
              dataProgram.data.map((program, index) => (
                <tr
                  key={program.id}
                  className={index % 2 === 1 ? "bg-gray-100" : "bg-white"}
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{program.properties.name}</td>
                  <td className="px-4 py-2">
                    {program.properties.durasi} Bulan
                  </td>
                  <td className="px-4 py-2">Rp. {program.properties.harga}</td>
                  <td className="px-4 py-2">
                    {program.properties.diskon_aktif ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={program.is_active}
                        onChange={() => toggleStatus(program)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-primary transition"></div>
                      <div className="absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition peer-checked:translate-x-5"></div>
                    </label>
                  </td>
                  <td className="px-4 py-2 text-center flex justify-center gap-2">
                    <button
                      onClick={() => onDetail(program)}
                      className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onEdit(program)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setShowDeleteModal(true);
                        setSelectedProgram(program);
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {showDeleteModal && selectedProgram && (
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
              <span className="font-semibold">
                {selectedProgram.properties.name}
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
                  handleDeleteProgram(selectedProgram.id);
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
      <div className="flex justify-center items-center mt-4 text-xs">
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
