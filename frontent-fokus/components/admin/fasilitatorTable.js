import { Eye, Pencil, Trash2, Plus, Search, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Pagination from "./paginasi";
import Alert from "../public/alert";
import {
  deleteFasilitator,
  getAllFasilitator,
  updateStatusFasilitator,
} from "@/lib/axios/fasilitator";
import Image from "next/image";

export default function FasilitatorTable({ onAdd, onEdit, onDetail, token }) {
  const [alert, setAlert] = useState(null);
  const [dataFasilitator, setDataFasilitator] = useState(null);

  const [open, setOpen] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFasilitator, setSelectedFasilitator] = useState(null);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("created_at|asc");
  const handleLimitChange = (e) => {
    const { value } = e.target;
    setLimit(Number(value));
  };
  const handleSortBy = (params) => {
    setSortBy(params);
    setOpen(false);
  };

  const toggleStatus = async (data) => {
    // setDataFasilitator((prev) =>
    //   prev.map((item) =>
    //     item.id === data.id ? { ...item, is_active: !item.is_active } : item
    //   )
    // );
    setDataFasilitator((prev) => ({
      ...prev,
      data: prev.data.map((row) =>
        row.id === data.id ? { ...row, is_active: !data.is_active } : row
      ),
    }));
    try {
      const response = await updateStatusFasilitator(
        data.id,
        { ...data, is_active: !data.is_active },
        token
      );
      setAlert({
        type: "success",
        title: "Info",
        message: response.message || "Failed to fetch data",
      });
    } catch (error) {
      // //  //  console.log(error)
      setAlert({
        type: "error",
        title: "Error",
        message: error.message || "Failed to fetch data",
      });
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const res = await getAllFasilitator(page, limit, search, sortBy);
      if (res.status == 200) {
        setAlert({
          type: "success",
          title: "Info",
          message: res.message,
        });
        setDataFasilitator(res.data);
        // setPage(res.data.page)
      }
    } catch (error) {
      // //  //  console.log(error)
    }
  }, [page, limit, search, sortBy]);

  const hadleDeleteFasilitator = async (id) => {
    try {
      const res = await deleteFasilitator(id, token);
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

  //  //  console.log(dataFasilitator)
  return (
    <div className="px-4 mt-6">
      <h2 className="text-lg font-bold text-red-700 mb-4">Fasilitator</h2>

      <div className="flex justify-between items-center my-auto">
        <div className="flex items-center mb-3 gap-2">
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
          <span>
            Show data:{" "}
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

      <div className="w-full overflow-x-auto">
        <table className="min-w-max w-full text-sm border-collapse">
          <thead className="bg-red-700 text-white">
            <tr>
              <th className="p-2 text-left">No.</th>
              <th className="p-2 text-left">Photo</th>
              <th className="p-2 text-left">Nama lengkap</th>
              <th className="p-2 text-left">Jobdesk</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {dataFasilitator &&
              dataFasilitator.data.map((item, i) => (
                <tr key={item.id} className={i % 2 ? "bg-gray-50" : "bg-white"}>
                  <td className="p-2">{i + 1}</td>
                  <td className="p-2">
                    {item.image ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}/landing/images/${item.image}`}
                        alt="Banner"
                        width={100}
                        height={100}
                        className="w-10 h-10 rounded-full border object-cover object-center"
                      />
                    ) : (
                      <Image
                        src="/9720011.jpg"
                        alt="Banner"
                        width={100}
                        height={100}
                        className="w-10 h-10 rounded-full border object-cover object-center"
                      />
                    )}
                  </td>
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.jobdesk}</td>
                  <td className="p-2">
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
                  <td className="p-2 space-x-1">
                    <button
                      onClick={() => onDetail(item)}
                      className="bg-gray-700 text-white p-1 rounded"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => onEdit(item)}
                      className="bg-blue-600 text-white p-1 rounded"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFasilitator(item);
                        setShowDeleteModal(true);
                      }}
                      className="bg-red-600 text-white p-1 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center mt-4 text-xs">
        {dataFasilitator && (
          <Pagination
            page={page}
            next={dataFasilitator.nextPage}
            prev={dataFasilitator.prevPage}
            totalPage={dataFasilitator.totalPage}
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
      {showDeleteModal && selectedFasilitator && (
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
              <span className="font-semibold">{selectedFasilitator.name}</span>?
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
                  hadleDeleteFasilitator(selectedFasilitator.id);
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
    </div>
  );
}
