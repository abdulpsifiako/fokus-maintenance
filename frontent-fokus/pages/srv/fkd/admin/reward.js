import { useEffect, useState, useCallback } from "react";
import { Search, Eye } from "lucide-react";
import AdminLayout from "@/pages/layouts/adminLayout";
import Cookies from "js-cookie";
import { getListPengajuan, updateStatusPengajuan } from "@/lib/axios/voucher";

function ReferralReward() {
  const token = Cookies.get("token");

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [search, setSearch] = useState("");
  const [sortBy] = useState("created_at|DESC");

  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // ✅ load data
  const fetchData = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);

      const res = await getListPengajuan(page, limit, search, sortBy, token);

      if (res.success) {
        setData(res.data.data);
        setTotalPage(res.data.totalPage);
      }
    } catch (error) {
      // //  //  console.log(error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, sortBy, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ✅ change status
  const handleChangeStatus = async (id, newStatus) => {
    try {
      await updateStatusPengajuan(id, newStatus, token);
      fetchData(); // refresh table
    } catch (error) {
      // //  //  console.log(error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Referral Reward</h2>

      {/* Search */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 flex-grow md:flex-grow-0">
          <Search size={18} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className="outline-none w-full"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse overflow-hidden">
          <thead>
            <tr className="bg-red-700 text-white text-left">
              <th className="px-4 py-2">No.</th>
              <th className="px-4 py-2">Nama</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Kode Referral</th>
              <th className="px-4 py-2">Jumlah Referral</th>
              <th className="px-4 py-2">Jumlah Diajukan</th>
              <th className="px-4 py-2">Jumlah Sisa</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Tanggal</th>
              {/* <th className="px-4 py-2">Aksi</th> */}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="text-center py-6 text-gray-600">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-6 text-gray-600">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              data.map((item, idx) => (
                <tr
                  key={item.id}
                  className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-4 py-2">{idx + 1 + (page - 1) * limit}</td>
                  <td className="px-4 py-2">{item.nama}</td>
                  <td className="px-4 py-2">{item.email}</td>
                  <td className="px-4 py-2">{item.kode}</td>
                  <td className="px-4 py-2">{item.jumlah_total}</td>
                  <td className="px-4 py-2">{item.jumlah_pengajuan}</td>
                  <td className="px-4 py-2">{item.sisa}</td>

                  {/* ✅ Dropdown Status */}
                  <td className="px-4 py-2">
                    <select
                      value={item.status}
                      onChange={(e) =>
                        handleChangeStatus(item.id, e.target.value)
                      }
                      className="border border-gray-300 px-2 py-1 rounded-md text-xs"
                    >
                      <option value="Di Ajukan">Di Ajukan</option>
                      <option value="Sudah Diterima">Sudah Diterima</option>
                      <option value="Ditolak">Ditolak</option>
                    </select>
                  </td>

                  <td className="px-4 py-2">
                    {new Date(item.created_at).toLocaleString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  {/* Action */}
                  {/* <td className="px-4 py-2 text-center">
                    <button className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                      <Eye size={16} />
                    </button>
                  </td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-3 pt-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className={`px-3 py-1 rounded-lg text-sm ${
            page <= 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          Prev
        </button>

        <span className="text-sm font-medium text-gray-700">
          Page {page} / {totalPage}
        </span>

        <button
          disabled={page >= totalPage}
          onClick={() => setPage(page + 1)}
          className={`px-3 py-1 rounded-lg text-sm ${
            page >= totalPage
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

ReferralReward.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default ReferralReward;
