import { Pencil, Search, Trash } from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import { getAllPengalaman, updatePengalamanStatus } from "@/lib/axios/landing";
import Cookies from "js-cookie";

export default function PengalamanTable({ onAdd, onEdit, onDelete }) {
  const token = Cookies.get("token");
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");

  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    totalPage: 1,
    nextPage: false,
    prevPage: false,
  });

  // ✅ Bungkus fetchData dengan useCallback agar stabil
  const fetchData = useCallback(async () => {
    try {
      const result = await getAllPengalaman({
        page,
        limit: 10,
        search: query,
      });

      setData(result.data);
      setPagination({
        totalPage: result.totalPage,
        nextPage: result.nextPage,
        prevPage: result.prevPage,
      });
    } catch (error) {
      console.error("ERROR FETCH PENGALAMAN:", error);
    }
  }, [page, query]); // hanya tergantung ini

  // ✅ Fetch ketika page berubah
  useEffect(() => {
    fetchData();
  }, [page, fetchData]);

  // ✅ Fetch ketika query berubah (debounce 400ms)
  useEffect(() => {
    const delay = setTimeout(() => fetchData(), 400);
    return () => clearTimeout(delay);
  }, [query, fetchData]);

  // ✅ Fetch ketika refresh di-toggle (update status)
  useEffect(() => {
    fetchData();
  }, [refresh, fetchData]);

  const handleStatusChange = async (id, current) => {
    try {
      await updatePengalamanStatus(id, !current, token);
      setRefresh((prev) => !prev); // trigger fetch ulang
    } catch (error) {
      console.error("STATUS ERROR", error);
    }
  };

  return (
    <div className="p-7 font-poppins">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold text-primary">
          Landing Pengalaman
        </h2>
      </div>

      {/* Search + Add */}
      <div className="flex items-center mb-3 gap-2">
        <div
          className="flex items-center border p-1 rounded-md border-gray-300 
          focus-within:ring-1 focus-within:ring-sky-500 focus-within:border-sky-500"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search.."
            className="text-xs text-gray-800 p-2 rounded-lg w-full max-w-xs 
            placeholder:text-xs placeholder:px-2 focus:outline-none"
          />
          <Search size={17} color="gray" />
        </div>

        <button
          type="button"
          onClick={() => onAdd()}
          className="ml-auto bg-primary p-2 rounded-md text-white"
        >
          Tambah
        </button>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <div className="overflow-y-auto border border-gray-200 rounded-lg max-h-[450px]">
          <table className="w-full">
            <thead className="bg-primary text-white sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left w-[60px]">No.</th>
                <th className="px-4 py-3 text-left">Judul</th>
                <th className="px-4 py-3 text-left">Deskripsi</th>
                <th className="px-4 py-3 text-left">Link</th>
                <th className="px-4 py-3 text-left w-[120px]">Status</th>
                <th className="px-4 py-3 text-left w-[120px]">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {item.judul}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs">
                      <p className="line-clamp-3">{item.deskripsi}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs">
                      <p className="line-clamp-3">{item.link || ""}</p>
                    </td>

                    {/* Switch */}
                    <td className="px-4 py-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.is_active}
                          onChange={() =>
                            handleStatusChange(item.id, item.is_active)
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-5 bg-gray-300 rounded-full peer peer-checked:bg-primary transition"></div>
                        <div className="absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition peer-checked:translate-x-5"></div>
                      </label>
                    </td>

                    <td className="flex gap-2 p-3">
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="p-1 border-gray-400 border rounded-md hover:opacity-80"
                      >
                        <Pencil color="gray" size={20} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(item)}
                        className="p-1 bg-primary rounded-md hover:opacity-80"
                      >
                        <Trash color="white" size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-5 text-gray-500"
                  >
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-3 my-4">
        <button
          disabled={!pagination.prevPage}
          onClick={() => setPage((p) => p - 1)}
          className={`px-3 py-1 rounded border ${
            pagination.prevPage
              ? "bg-white"
              : "bg-gray-200 cursor-not-allowed"
          }`}
        >
          Prev
        </button>

        <span className="px-3 py-1">
          {page} / {pagination.totalPage}
        </span>

        <button
          disabled={!pagination.nextPage}
          onClick={() => setPage((p) => p + 1)}
          className={`px-3 py-1 rounded border ${
            pagination.nextPage
              ? "bg-white"
              : "bg-gray-200 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
