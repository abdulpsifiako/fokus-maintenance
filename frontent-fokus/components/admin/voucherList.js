import { Eye, Pencil, Plus, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { deleteVoucher, getListVoucher } from "@/lib/axios/voucher";
import Alert from "../public/alert";

export function VoucherList({ setMode, setSelected, selected }) {
  const token = Cookies.get("token");
  const [alert, setAlert] = useState(false);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("created_at|desc");
  const [filter, setFilter] = useState("Semua");

  const [dataVoucher, setDataVoucher] = useState(null);

  const data = [
    {
      id: 1,
      nama: "Voucher CPNS",
      nilai: "Rp 10.000",
      tipe: "Kelas Online",
      berlaku: "01/02/2025",
    },
    {
      id: 2,
      nama: "Voucher PPPK",
      nilai: "Rp 10.000",
      tipe: "Program Utama",
      berlaku: "01/02/2025",
    },
  ];

  const filteredData = data.filter(
    (item) =>
      (filter === "Semua" || item.tipe === filter) &&
      item.nama.toLowerCase().includes(search.toLowerCase())
  );

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await getListVoucher(page, limit, search, sortBy, token);
      //  //  console.log(res)
      setDataVoucher(res.data.data);
      if (res.status == 200) {
        setAlert({
          type: "success",
          title: "Info",
          message: res.message,
        });
      }
    } catch (error) {
      // //  //  console.log(error)
    }
  }, [page, limit, search, sortBy, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const deleteData = async () => {
    try {
      const res = await deleteVoucher({ id: selected.id }, token);
      if (res.status == 200) {
        setAlert({
          type: "success",
          title: "Info",
          message: res.message,
        });
      }
      setIsDeleteOpen(false);
      fetchData();
    } catch (error) {
      // //  //  console.log(error)
    }
  };
  return (
    <div className="p-6 bg-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Voucher</h2>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
          >
            <option value="Semua">Semua</option>
            <option value="Kelas Online">Kelas Online</option>
            <option value="Program Utama">Program Utama</option>
          </select>

          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 pr-10 w-full sm:w-72 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 absolute right-3 top-3 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
              />
            </svg>
          </div>

          <button
            onClick={() => setMode("add")}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
          >
            <Plus size={16} />
            Tambah
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-red-600 text-white">
              <th className="px-4 py-3 rounded-l-lg">No.</th>
              <th className="px-4 py-3">Nama Voucher</th>
              <th className="px-4 py-3">Nilai Voucher</th>
              <th className="px-4 py-3">Tipe Program</th>
              <th className="px-4 py-3">Berlaku Sampai Tanggal</th>
              <th className="px-4 py-3 text-center rounded-r-lg">Action</th>
            </tr>
          </thead>
          <tbody>
            {dataVoucher &&
              (dataVoucher.length > 0 ? (
                dataVoucher.map((item, index) => (
                  <tr
                    key={item.id}
                    className="bg-gray-50 hover:bg-gray-100 transition rounded-lg shadow-sm"
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3">{item.nilai}</td>
                    <td className="px-4 py-3">{item.tipe}</td>
                    <td className="px-4 py-3">
                      {item.valid
                        ? new Date(item.valid).toLocaleDateString("id-ID")
                        : "-"}
                    </td>
                    <td className="px-4 py-3 flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setMode("view");
                          setSelected(item);
                        }}
                        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                      >
                        <Eye size={16} className="text-gray-700" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMode("edit");
                          setSelected(item);
                        }}
                        className="p-2 rounded-full bg-blue-200 hover:bg-blue-300 transition"
                      >
                        <Pencil size={16} className="text-blue-700" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelected(item);
                          setIsDeleteOpen(true);
                        }}
                        className="p-2 rounded-full bg-red-200 hover:bg-red-300 transition"
                      >
                        <Trash2 size={16} className="text-red-700" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center p-6 text-gray-500 italic bg-gray-50 rounded-lg"
                  >
                    Tidak ada data ditemukan
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {isDeleteOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 bg-opacity-40 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setIsDeleteOpen(false)}
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Konfirmasi Hapus
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Apakah kamu yakin ingin menghapus voucher{" "}
              <span className="font-medium text-red-600">{selected?.name}</span>{" "}
              ?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg text-sm border border-gray-300 hover:bg-gray-100 transition"
                onClick={() => setIsDeleteOpen(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700 transition"
                onClick={deleteData}
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
