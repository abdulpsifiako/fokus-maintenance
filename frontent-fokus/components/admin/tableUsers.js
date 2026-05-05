import { ChevronLeft, ChevronRight, Eye, Search } from "lucide-react";
import dayjs from "dayjs";
import Pagination from "./paginasi";
import { useCallback, useEffect, useState } from "react";
import { getAllUser } from "@/lib/axios/dashboard";
import Cookies from "js-cookie";
import ModalDetail from "./modalDetail";

export default function TableUser() {
  const [openModal, setOpenModal] = useState(false);
  const token = Cookies.get("token");
  const [dataUser, setDataUser] = useState(null);
  const [detailuser, setDetailUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
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
      const res = await getAllUser(page, limit, search, token, sortBy);
      if (res.status == 200) {
        setDataUser(res.data);
        setPage(res.data.page);
      }
    } catch (error) {
      // //  //  console.log(error)
    }
  }, [page, limit, search, sortBy, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="overflow-x-auto mt-10 custom-scroll p-1">
      <h2 className="text-lg font-semibold mb-3">Data User Terdaftar</h2>

      <div className="flex items-center mb-3 gap-2">
        <div className="flex items-center border p-1 rounded-md border-gray-300 focus-within:ring-1 focus-within:ring-sky-500 focus-within:border-sky-500">
          <input
            type="text"
            name="search"
            value={search}
            onChange={(e) => {
              const { value } = e.target;
              setSearch(value);
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
          onClick={fetchData}
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

      <div className="rounded overflow-hidden">
        <div className="overflow-y-auto max-h-[400px] custom-scroll">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 bg-primary text-white z-10">
              <tr>
                <th className="p-2 text-left">No.</th>
                <th className="p-2 text-left">Nama</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Nomor Telepon</th>
                <th className="p-2 text-left">Tanggal Daftar</th>
                <th className="p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {dataUser &&
                (dataUser.data.length > 0 ? (
                  <>
                    {dataUser.data.map((item, index) => {
                      return (
                        <tr
                          key={index + 1}
                          className={
                            index % 2 === 0
                              ? "bg-white cursor-pointer"
                              : "bg-gray-200 cursor-pointer"
                          }
                        >
                          <td className="p-3 text-shadow-stone-500">
                            {index + 1}
                          </td>
                          <td className="p-3 text-shadow-stone-500">
                            {item.name}
                          </td>
                          <td className="p-3 text-shadow-stone-500">
                            {item.email}
                          </td>
                          <td className="p-3 text-shadow-stone-500">
                            {item.no_wa}
                          </td>
                          <td className="p-3 text-shadow-stone-500">
                            {dayjs(item.created_at).format(
                              "DD MMMM YYYY, HH:mm"
                            ) + " WIB"}
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                setOpenModal(true);
                                setDetailUser(item);
                              }}
                              className="bg-gray-200 hover:bg-gray-300 text-xs p-1.5 rounded cursor-pointer"
                            >
                              <Eye size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </>
                ) : (
                  <>
                    <tr>
                      <td colSpan={6} className="text-center">
                        Belum ada data
                      </td>
                    </tr>
                  </>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center items-center mt-4 text-xs">
        {dataUser && (
          <Pagination
            page={page}
            next={dataUser.nextPage}
            prev={dataUser.prevPage}
            totalPage={dataUser.totalPage}
            setPage={setPage}
          />
        )}
      </div>
      {openModal && (
        <ModalDetail
          open={setOpenModal}
          setOpenModal={setOpenModal}
          data={detailuser}
        />
      )}
    </div>
  );
}
