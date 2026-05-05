import AdminLayout from "@/pages/layouts/adminLayout";
import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getAllTransaksi } from "@/lib/axios/transaksi";
import Pagination from "@/components/admin/paginasi";

function TransaksiProgramUtamaK() {
  const token = Cookies.get("token");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [jenis, setJenis] = useState("Kelas Online");
  const [dataTransaksi, setDataTransaksi] = useState(null);

  const [query, setQuery] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const data = [
    {
      id: 1,
      faktur: "INV/20250612/FPSK/1272569",
      nama: "Anisa",
      tanggal: "01/02/2025",
      paket: "CPNS",
      status: "Aktif",
      harga: "Rp 20.000",
      kode: "Anisa-01",
    },
    {
      id: 2,
      faktur: "INV/20250610/FPSK/1760715",
      nama: "Abdul",
      tanggal: "01/02/2025",
      paket: "CPNS",
      status: "Belum Aktif",
      harga: "Rp 20.000",
      kode: "Abdul-01",
    },
  ];

  const filtered = data.filter(
    (item) =>
      (status === "Semua" || item.status === status) &&
      (jenis === "Semua" || item.paket === jenis) &&
      (item.nama.toLowerCase().includes(search.toLowerCase()) ||
        item.faktur.toLowerCase().includes(search.toLowerCase()) ||
        item.kode.toLowerCase().includes(search.toLowerCase()))
  );
  const fetchData = useCallback(async () => {
    try {
      const res = await getAllTransaksi(
        page,
        limit,
        search,
        token,
        jenis,
        tanggal,
        status
      );
      //  //  console.log(res)
      setDataTransaksi(res.data);
    } catch (error) {
      // //  //  console.log(error)
    }
  }, [page, limit, tanggal, status, jenis, token, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <div className="p-6 bg-white">
      {/* Header */}
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Transaksi Program Utama
      </h2>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Cari data..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
        >
          <option value="">Semua Status</option>
          <option value="success">Sukses</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <input
          type="date"
          defaultValue={new Date().toISOString().split("T")[0]}
          onChange={(e) => setTanggal(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-red-600 text-white">
              <th className="px-4 py-3 rounded-l-lg">Faktur</th>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Tanggal Pembelian</th>
              <th className="px-4 py-3">Paket Program Utama</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Harga</th>
              <th className="px-4 py-3 rounded-r-lg">Kode Referral</th>
            </tr>
          </thead>
          <tbody>
            {dataTransaksi &&
              (dataTransaksi.data.length > 0 ? (
                dataTransaksi.data.map((item) => (
                  <tr
                    key={item.id}
                    className="bg-gray-50 hover:bg-gray-100 transition rounded-lg shadow-sm"
                  >
                    <td className="px-4 py-3 font-medium text-gray-700">
                      {item.id}
                    </td>
                    <td className="px-4 py-3">{item.data_user.name}</td>
                    <td className="px-4 py-3">
                      {new Date(item.created_at).toISOString().split("T")[0]}
                    </td>
                    <td className="px-4 py-3">
                      {item.properties.kelas_data?.properties.judul}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === "Aktif"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      Rp{" "}
                      {(item?.properties?.harga_akhir ?? 0).toLocaleString(
                        "id-ID"
                      )}
                    </td>
                    <td className="px-4 py-3">{item.properties.voucherCode}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center p-6 text-gray-500 italic bg-gray-50 rounded-lg"
                  >
                    Tidak ada data transaksi ditemukan
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center items-center mt-4 text-xs mb-10">
        {dataTransaksi && (
          <Pagination
            page={page}
            next={dataTransaksi.nextPage}
            prev={dataTransaksi.prevPage}
            totalPage={dataTransaksi.totalPage}
            setPage={setPage}
          />
        )}
      </div>
    </div>
  );
}
TransaksiProgramUtamaK.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default TransaksiProgramUtamaK;
