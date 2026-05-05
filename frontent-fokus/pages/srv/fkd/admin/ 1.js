import AdminLayout from "@/pages/layouts/adminLayout";
import { useState } from "react";


function TransaksiProgramUtama() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Semua");
  const [jenis, setJenis] = useState("Semua");

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
          <option value="Semua">Semua Status</option>
          <option value="Aktif">Aktif</option>
          <option value="Belum Aktif">Belum Aktif</option>
        </select>
        <input
          type="date"
          defaultValue={new Date().toISOString().split("T")[0]}
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
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <tr
                  key={item.id}
                  className="bg-gray-50 hover:bg-gray-100 transition rounded-lg shadow-sm"
                >
                  <td className="px-4 py-3 font-medium text-gray-700">{item.faktur}</td>
                  <td className="px-4 py-3">{item.nama}</td>
                  <td className="px-4 py-3">{item.tanggal}</td>
                  <td className="px-4 py-3">{item.paket}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === "Aktif"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold">{item.harga}</td>
                  <td className="px-4 py-3">{item.kode}</td>
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
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
TransaksiProgramUtama.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default TransaksiProgramUtama;
