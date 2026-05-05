import {
  deleteLatihanProgramUtama,
  getListLatihanProgramUtama,
  getListProgramUtamaLatihan,
  updateLatihanProgram,
} from "@/lib/axios/programUtama";
import { Eye, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import Alert from "../public/alert";
import Pagination from "./paginasi";

export const LatihanList = ({ onView, onEdit, onAdd }) => {
  const [alert, setAlert] = useState(null);
  const token = Cookies.get("token");
  const [infoProgram, setInfoProgram] = useState(null);
  const [tableLatihan, setTableLatihan] = useState(null);
  const [programId, setProgramId] = useState("");
  const [programName, setProgramName] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [data, setData] = useState(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [programUtama, setProgramUtama] = useState("");

  const toggleStatus = async (data) => {
    //  //  console.log(data)
    setTableLatihan((prev) => ({
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
      const response = await updateLatihanProgram(
        data.id,
        {
          ...data.properties,
          status: !data.properties.status,
        },
        token
      );

      setAlert({
        type: "success",
        title: "Info",
        message: response.message || "Status berhasil diperbarui",
      });
    } catch (error) {
      setTableLatihan((prev) => ({
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

  const getProgramUtamaLatihan = useCallback(async () => {
    try {
      const res = await getListProgramUtamaLatihan(token);
      setInfoProgram(res.data);
    } catch (error) {
      // //  //  console.log(error)
    }
  }, [token]);

  const getListLatihan = useCallback(async () => {
    try {
      const res = await getListLatihanProgramUtama(
        page,
        20,
        search,
        null,
        token,
        programName
      );
      setTableLatihan(res.data);
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
  }, [page, search, programName, token]);

  useEffect(() => {
    getListLatihan();
  }, [getListLatihan]);

  useEffect(() => {
    getProgramUtamaLatihan();
  }, [getProgramUtamaLatihan]);

  const handleDeleteLatihanProgramUtama = async (id) => {
    try {
      const res = await deleteLatihanProgramUtama(id, Cookies.get("token"));
      if (res.status == 200) {
        setAlert({
          type: "success",
          title: "Info",
          message: res.message,
        });
      }
      await getListLatihan();
    } catch (error) {
      // //  //  console.log(error)
    }
  };
  //  console.log(tableLatihan);
  return (
    <div className="">
      <header className="m-2 space-y-2">
        <h1 className="text-xl font-semibold text-primary">Latihan</h1>
        <div className="flex gap-2 items-end">
          <div className="flex flex-col">
            <label>Program Utama</label>
            <select
              value={programId}
              onChange={(e) => {
                setProgramId(e.target.value);
                setProgramName(
                  e.target.selectedOptions[0].text == "Semua"
                    ? ""
                    : e.target.selectedOptions[0].text
                );
              }}
              className="max-w-36 text-xs border border-gray-400 p-2 rounded-md"
            >
              <option value="">Semua</option>
              {infoProgram &&
                infoProgram.map((item, index) => (
                  <option key={index} value={item.program_id}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex border border-gray-400 rounded-md p-2 focus-within:border-primary">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-xs outline-0"
              placeholder="Search"
            />
            <Search size={19} className="text-gray-400" />
          </div>
        </div>
      </header>
      <button
        type="button"
        onClick={onAdd}
        className="flex items-center my-auto p-2 bg-primary text-white rounded-md justify-end ml-auto text-xs"
      >
        <Plus size={15} />
        Tambah
      </button>
      <div className="rounded-t-md overflow-hidden overflow-x-auto my-2">
        <table className="w-full text-sm">
          <thead className="bg-primary text-white text-left">
            <tr>
              <th className="p-2 text-left">No</th>
              <th className="p-2 text-left">Materi</th>
              <th className="p-2 text-left">Paket Program Utama</th>
              <th className="p-2 text-left">Total Sub Materi</th>
              <th className="p-2 text-left">Total Soal Sub Materi</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {tableLatihan &&
              (tableLatihan.data.length > 0 ? (
                tableLatihan.data.map((item, idx) => (
                  <tr key={idx} className="even:bg-gray-300">
                    <td className="p-2">{idx + 1}</td>
                    <td className="p-2">{item.properties?.materi}</td>
                    <td className="p-2">{item.properties?.program_utama}</td>
                    <td className="p-2">{item.properties?.latihan.length}</td>
                    <td className="p-2">
                      {item.properties?.latihan?.reduce(
                        (total, lat) => total + (lat.datasoal?.length || 0),
                        0
                      )}
                    </td>
                    <td className="p-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          checked={item.properties?.status}
                          onChange={() => toggleStatus(item)}
                          type="checkbox"
                          className="sr-only peer"
                        />
                        <div className="w-11 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-primary transition"></div>
                        <div className="absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition peer-checked:translate-x-5"></div>
                      </label>
                    </td>
                    <td className="space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          onView(item);
                        }}
                        className="p-1 rounded bg-gray-700 text-white"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onEdit(item);
                        }}
                        className="p-1 rounded bg-primary text-white"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setData(item);
                          setShowDeleteModal(true);
                        }}
                        className="p-1 rounded bg-red-600 text-white"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center p-2">
                    Belum ada data
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {showDeleteModal && data && (
        <div className="fixed inset-0 bg-gray-300/60 backdrop-blur-md bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-red-700">Hapus latihan</h3>
              <button onClick={() => setShowDeleteModal(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Apakah kamu yakin ingin menghapus{" "}
              <span className="font-semibold">{data.properties?.materi}</span>?
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
                  handleDeleteLatihanProgramUtama(data.id);
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
        {tableLatihan && (
          <Pagination
            page={page}
            next={tableLatihan.nextPage}
            prev={tableLatihan.prevPage}
            totalPage={tableLatihan.totalPage}
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
};
