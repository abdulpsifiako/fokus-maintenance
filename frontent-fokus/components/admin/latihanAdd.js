import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SoalItem } from "./soalItem";
import { getListSubMateri } from "@/lib/axios/programUtama";
import Cookies from "js-cookie";
import { ModalPreview } from "./modalPriview";

export const LatihanAdd = ({ mode, onBack, materiId, setForm, data, idx }) => {
  const token = Cookies.get("token");
  const defaultMateriId = useRef(materiId);
  // const [inputValue, setInputValue] = useState("");
  const [subMateri, setSubMateri] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [number, setNumber] = useState(1);
  // const [jumlahSoal, setJumlahSoal] = useState(1);
  const scrollRef = useRef(null);
  const [latihan, setLatihan] = useState({
    judul: data?.judul || "",
    waktu: data?.waktu || 0,
    minPoin: data?.minPoin || 0,
    jumlahsoal: data?.jumlahsoal || 1,
    kategori: data?.kategori || "",
    status: data?.status || true,
    datasoal: data?.datasoal || [
      {
        pertanyaan: "",
        opsi: [],
        kunci: "",
        pembahasan: "",
        submateri: "",
      },
    ],
  });

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -100, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 100, behavior: "smooth" });
  };
  const getSubMateriProgram = useCallback(async () => {
    try {
      const res = await getListSubMateri(defaultMateriId.current, token);
      setSubMateri(res.data);
    } catch (error) {
      // //  //  console.log(error)
    }
  }, [token]);
  useEffect(() => {
    if (materiId) {
      getSubMateriProgram();
    }
  }, [materiId, getSubMateriProgram]);
  console.log(latihan);
  return (
    <>
      <header className="space-x-1">
        <h1 className="text-xl font-semibold text-primary">
          {mode === "onAddLatihan" ? "Tambah" : "Edit"} Latihan Soal
        </h1>
        <p className="text-xs font-light">
          Latihan/
          <span className="text-primary font-medium">
            {mode === "onAddLatihan" ? "Tambah" : "Edit"} Soal
          </span>
        </p>
      </header>
      <div className="flex gap-2 justify-end ml-auto text-xs">
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className="py-2 px-4 border border-yellow-500 text-yellow-600 rounded-md font-semibold"
        >
          Preview
        </button>
        <button
          onClick={onBack}
          className="py-2 px-4 border border-primary text-primary rounded-md font-semibold"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={() => {
            setForm((prev) => {
              let latihanList = [...(prev.latihan || [])];

              if (mode === "onAddLatihan") {
                latihanList.push(latihan);
              } else if (mode === "onEditLatihan") {
                if (idx !== -1) {
                  latihanList[idx] = latihan;
                } else {
                  latihanList.push(latihan);
                }
              }

              return { ...prev, latihan: latihanList };
            });
            onBack();
          }}
          className="py-2 px-4 bg-primary text-white font-semibold rounded-md"
        >
          Simpan
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <div className="flex flex-col gap-1 max-w-sm">
          <label>Judul Latihan</label>
          <input
            type="text"
            value={latihan.judul}
            onChange={(e) =>
              setLatihan((prev) => ({ ...prev, judul: e.target.value }))
            }
            placeholder="Masukkan judul latihan"
            className="rounded-md border border-gray-400 p-2 focus:outline-red-500 w-full"
          />
        </div>
        {/* <div className="flex flex-col gap-1 max-w-sm">
                    <label>Sub Materi</label>
                    <input
                        type="text"
                        value={latihan.submateri_name}
                        onChange={(e)=>
                            setLatihan(prev => ({ ...prev, submateri_name: e.target.value }))
                        }
                        placeholder="Masukkan nama sub materi"
                        className="rounded-md border border-gray-400 p-2 focus:outline-red-500 w-full"
                    />
                </div> */}

        <div className="flex flex-col gap-1 max-w-sm">
          <label>Kategori</label>
          <select
            value={latihan.kategori}
            onChange={(e) => {
              setLatihan((prev) => ({ ...prev, kategori: e.target.value }));
            }}
            className="border border-gray-400 p-2 rounded focus:outline-red-500 w-full"
          >
            <option value="">-- Kategori Video --</option>
            <option value="Gratis">Gratis</option>
            <option value="Berbayar">Berbayar</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 max-w-sm">
          <label>Waktu pengerjaan</label>
          <input
            type="number"
            value={latihan.waktu}
            onChange={(e) =>
              setLatihan((prev) => ({ ...prev, waktu: e.target.value }))
            }
            placeholder="masukan waktu"
            className="rounded-md border border-gray-400 p-2 focus:outline-red-500 w-full"
          />
        </div>
        <div className="flex flex-col gap-1 max-w-sm">
          <label>Minimal Poin Lulus</label>
          <input
            type="number"
            value={latihan.minPoin}
            onChange={(e) =>
              setLatihan((prev) => ({ ...prev, minPoin: e.target.value }))
            }
            defaultValue={0}
            min={0}
            className="rounded-md border border-gray-400 p-2 focus:outline-red-500 w-full"
          />
        </div>
        <div className="flex flex-col gap-1 max-w-sm">
          <label>Jumlah Soal</label>
          <div className="flex gap-2">
            <input
              value={latihan.jumlahsoal}
              disabled
              placeholder="Jumlah soal"
              className="rounded-md border border-gray-400 p-2 focus:outline-red-500 w-full"
            />
            <button
              type="button"
              onClick={() => {
                setLatihan((prev) => ({
                  ...prev,
                  jumlahsoal: prev.jumlahsoal + 1,
                  datasoal: [
                    ...(prev.datasoal || []),
                    {
                      pertanyaan: "",
                      opsi: [],
                      kunci: "",
                      pembahasan: "",
                      submateri: "",
                    },
                  ],
                }));
              }}
              className="p-1 text-white bg-primary w-10 h-10 rounded-md"
            >
              <span className="items-center justify-center mx-auto my-auto flex">
                <Plus />
              </span>
            </button>
          </div>

          {/* tombol sesuai jumlahSoal */}
          {latihan.jumlahsoal > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={scrollLeft}
                className="p-2 bg-gray-200 rounded-md hover:bg-primary hover:text-white"
              >
                <ChevronLeft />
              </button>

              <div
                ref={scrollRef}
                className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth w-[250px]"
              >
                {Array.from({ length: latihan.jumlahsoal }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setNumber(index + 1)}
                    className={`p-2 w-10 h-10 bg-gray-200 rounded-md hover:bg-primary  shrink-0 ${number == index + 1 ? "bg-primary text-white hover:text-black hover:bg-white hover:border hover:border-primary" : " hover:text-white"} cursor-pointer`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={scrollRight}
                className="p-2 bg-gray-200 rounded-md hover:bg-primary hover:text-white"
              >
                <ChevronRight />
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-col items-start my-auto p-2">
          <div className="flex flex-col gap-1 max-w-sm">
            <label>Status</label>
          </div>
          <div className="flex gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={latihan.status}
                className="sr-only peer"
                onChange={() => {
                  setLatihan((prev) => ({ ...prev, status: !prev.status }));
                }}
              />
              <div className="w-11 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-primary transition"></div>
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-5"></div>
            </label>
            <label>Tidak aktif/aktif</label>
          </div>
        </div>
      </div>
      {latihan.jumlahsoal > 0 && (
        <SoalItem index={number} latihan={latihan} setLatihan={setLatihan} />
      )}
      {showPreview && (
        <ModalPreview latihan={latihan} onClose={() => setShowPreview(false)} />
      )}
    </>
  );
};
