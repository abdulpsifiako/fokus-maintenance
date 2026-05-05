import { Eye, Pencil, Trash2, Plus, Search } from "lucide-react";
import Pagination from "./paginasi";
import { useCallback, useEffect, useState } from "react";
import {
  deleteTestimoni,
  getAllTestimoni,
  updateStatusTestimoni,
} from "@/lib/axios/testimoni";
import Cookies from "js-cookie";
import { FaRegStar, FaStar } from "react-icons/fa";
import Alert from "../public/alert";
import ModalDeleteTestimoni from "./deleteTestimoni";

export default function TestimoniTable({ onAdd, onView, onEdit }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [alert, setAlert] = useState(null);
  const token = Cookies.get("token");
  const [data, setData] = useState(null);

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
  const fetchData = useCallback(async () => {
    try {
      const res = await getAllTestimoni(page, limit, search, token, sortBy);
      if (res.status == 200) {
        setAlert({
          type: "success",
          title: "Info",
          message: res.message,
        });
        setData(res.data);
        setPage(res.data.page);
      }
    } catch (error) {
      // //  //  console.log(error)
    }
  }, [page, limit, search, sortBy, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusChange = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      const res = await updateStatusTestimoni(id, { status: newStatus }, token);

      if (res.status === 200) {
        setData((prev) => ({
          ...prev,
          data: prev.data.map((item) =>
            item.id === id ? { ...item, status: newStatus } : item
          ),
        }));

        setAlert({
          type: "success",
          title: "Info",
          message: "Status testimoni berhasil diperbarui",
        });
      }
    } catch (error) {
      // //  //  console.log(error);
      setAlert({
        type: "error",
        title: "Error",
        message: "Gagal memperbarui status testimoni",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const res = await deleteTestimoni(selectedItem.id, token);
      if (res.status === 200) {
        fetchData();
        setAlert({
          type: "success",
          title: "Info",
          message: "Testimoni berhasil dihapus",
        });
        setIsModalOpen(false);
        setSelectedItem(null);
      }
    } catch (error) {
      setAlert({
        type: "error",
        title: "Error",
        message: "Gagal menghapus testimoni",
      });
    }
  };

  return (
    <div className="mt-6 px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold text-primary">Testimoni</h2>
      </div>
      <div className="flex items-center mb-3 gap-2">
        <div className="flex items-center border p-1 rounded-md border-gray-300 focus-within:ring-1 focus-within:ring-sky-500 focus-within:border-sky-500">
          <input
            type="text"
            name="search"
            value={query}
            onChange={(e) => {
              const { value } = e.target;
              setQuery(value);
            }}
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
        <button
          type="button"
          onClick={onAdd}
          className="ml-auto bg-primary p-2 rounded-md text-white"
        >
          Tambah
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-primary text-white z-10">
            <tr className="bg-primary text-white text-left">
              <th className="p-2">No.</th>
              <th className="p-2">Nama lengkap</th>
              <th className="p-2">Institusi-Profesi</th>
              {/* <th className="p-2">Rating</th> */}
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.data.map((item, idx) => (
                <tr
                  key={item.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-100"}
                >
                  <td className="p-2">{idx + 1}</td>
                  <td className="p-2">{item.properties.nama}</td>
                  <td className="p-2">{item.properties.profesi}</td>
                  {/* <td className="p-2 flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                            i < item.properties.rating
                                ? <FaStar key={i} className="text-yellow-400" />
                                : <FaRegStar key={i} className="text-gray-300" />
                            ))}
                        </td> */}
                  <td className="p-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.status}
                        onChange={() =>
                          handleStatusChange(item.id, item.status)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-primary transition"></div>
                      <div className="absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition peer-checked:translate-x-5"></div>
                    </label>
                  </td>
                  <td className="p-2 space-x-2 flex">
                    {/* <button
                            onClick={() => onView(item)}
                            className="bg-gray-200 hover:bg-gray-300 p-1.5 rounded"
                        >
                            <Eye size={14} />
                        </button> */}
                    <button
                      onClick={() => onEdit(item)}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedItem(item);
                        setIsModalOpen(true);
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded"
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
        {data && (
          <Pagination
            page={page}
            next={data.nextPage}
            prev={data.prevPage}
            totalPage={data.totalPage}
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

      <ModalDeleteTestimoni
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        nama={selectedItem?.properties?.nama}
      />
    </div>
  );
}
