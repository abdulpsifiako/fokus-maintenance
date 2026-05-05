import { getListLaporan, laporSoalUpdate } from "@/lib/axios/programUtama";
import AdminLayout from "@/pages/layouts/adminLayout";
import { Eye, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import Alert from "@/components/public/alert";
import Pagination from "@/components/admin/paginasi";

function DetailLaporSoalTable() {
  const token = Cookies.get("token");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("created_at|desc");

  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const data = [
    {
      id: 1,
      username: "Anisa",
      email: "anisa@gmail.com",
      jenis: "CPNS",
      tipe: "Latihan/Try Out",
      materi: "TWK",
    },
    {
      id: 2,
      username: "Maulana",
      email: "maul100@gmail.com",
      jenis: "SNBT",
      tipe: "Latihan/Try Out",
      materi: "TWK",
    },
    {
      id: 3,
      username: "Haris",
      email: "haris@gmail.com",
      jenis: "CPNS",
      tipe: "Latihan/Try Out",
      materi: "TWK",
    },
    {
      id: 4,
      username: "Ucup",
      email: "ucup@gmail.com",
      jenis: "CPNS",
      tipe: "Latihan/Try Out",
      materi: "TWK",
    },
  ];
  const [alert, setAlert] = useState(false);
  const [dataLaporan, setDataLaporan] = useState(null);

  const fetchDataLaporan = useCallback(async () => {
    try {
      const res = await getListLaporan(page, limit, search, sortBy, token);
      //  //  console.log(res);
      setDataLaporan(res.data);
      setPage(res.data.page);
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
    fetchDataLaporan();
  }, [fetchDataLaporan]);

  const toggleStatus = async (item) => {
    try {
      await laporSoalUpdate(item.id, { status: !item.status }, token);
      fetchDataLaporan();
    } catch (error) {
      //  //  console.log(error);
    }
  };
  return (
    <div className="p-6 bg-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Detail Lapor Soal
        </h2>
        <input
          type="text"
          placeholder="Cari data..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-3 md:mt-0 px-4 py-2 w-full md:w-72 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-400 focus:outline-none transition"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-red-600 text-white">
              <th className="px-4 py-3 rounded-l-lg">No.</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Jenis Program</th>
              <th className="px-4 py-3">Nama Program</th>
              <th className="px-4 py-3">Tipe Program</th>
              <th className="px-4 py-3">Materi</th>
              <th className="px-4 py-3">Sub Materi</th>
              <th className="px-4 py-3">Status Selesai</th>
              <th className="px-4 py-3 text-center rounded-r-lg">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dataLaporan &&
              (dataLaporan.data.length > 0 ? (
                dataLaporan.data.map((item, index) => (
                  <tr
                    key={item.id}
                    className="bg-gray-50 hover:bg-gray-100 transition rounded-lg shadow-sm"
                  >
                    <td className="px-4 py-3 font-medium text-gray-700">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3">{item.data_user.username}</td>
                    <td className="px-4 py-3">{item.data_user.email}</td>
                    <td className="px-4 py-3">
                      {item.data_soal.jenis_program}
                    </td>
                    <td className="px-4 py-3">
                      {item.data_soal.program_utama}
                    </td>
                    <td className="px-4 py-3">{item.data_soal.jenis}</td>
                    <td className="px-4 py-3">{item.data_soal.module_name}</td>
                    <td className="px-4 py-3">{item.data_soal.title}</td>
                    <td className="px-4 py-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.status}
                          onChange={() => toggleStatus(item)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-primary transition"></div>
                        <div className="absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition peer-checked:translate-x-5"></div>
                      </label>
                    </td>
                    <td className="px-4 py-3 flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelected(item);
                          setShowModal(true);
                        }}
                        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                      >
                        <Eye size={16} className="text-gray-700" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center p-6 text-gray-500 italic bg-gray-50 rounded-lg"
                  >
                    Tidak ada data ditemukan
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center items-center mt-4 text-xs mb-10">
        {dataLaporan && (
          <Pagination
            page={page}
            next={dataLaporan.nextPage}
            prev={dataLaporan.prevPage}
            totalPage={dataLaporan.totalPage}
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
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative animate-fadeIn">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Detail Laporan Soal
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <span className="font-medium">
                  Soal No {selected.data_soal.nomor_soal} :
                </span>{" "}
                {selected.laporan}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

DetailLaporSoalTable.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default DetailLaporSoalTable;
