"use client";
import { useCallback, useEffect, useState } from "react";
import PengajarModal from "./pengajarModal";
import { Eye, Pen, Trash } from "lucide-react";
import { getListJenisProgram } from "@/lib/axios/jenisProgram";
import Alert from "../public/alert";
import Image from "next/image";
import {
  createProgramUtama,
  updateProgramUtama,
} from "@/lib/axios/programUtama";
import { uploadFile } from "@/lib/axios/landing";
import Cookies from "js-cookie";

export default function ProgramUtamaForm({ program, onBack, mode }) {
  const token = Cookies.get("token");
  const [alert, setAlert] = useState(null);
  const [pengajarMode, setPengajarMode] = useState("add");
  const [openModal, setOpenModal] = useState(false);
  const [jenis, setJenisProgram] = useState(null);
  const [pengajar, selectedPengajar] = useState(null);

  const [form, setForm] = useState({
    name: program?.properties?.name || "",
    harga: program?.properties?.harga || 0,
    durasi: program?.properties?.durasi || 1,
    jenis: program?.properties?.jenis || "",
    deskripsi: program?.properties?.deskripsi || "",
    fitur: program?.properties?.fitur || [],
    status: program?.properties?.status || false,
    pengajar: program?.properties?.pengajar || [],
    banner: program?.properties?.banner || null,
    link: program?.properties?.link || "",
  });

  const handlePengajar = (data) => {
    if (pengajarMode === "edit" && pengajar) {
      // replace data pengajar lama
      setForm((prev) => ({
        ...prev,
        pengajar: prev.pengajar.map((p) =>
          p.name === pengajar.name ? data : p
        ),
      }));
    } else {
      // tambah pengajar baru
      setForm((prev) => ({
        ...prev,
        pengajar: [...prev.pengajar, data],
      }));
    }
    setOpenModal(false);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const handleChangeFitur = (e) => {
    const { value, checked } = e.target;

    setForm((prev) => {
      if (checked) {
        // tambahkan value ke array
        return { ...prev, fitur: [...prev.fitur, value] };
      } else {
        // hapus value dari array
        return { ...prev, fitur: prev.fitur.filter((item) => item !== value) };
      }
    });
  };
  const handleBanner = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        banner: file,
      }));
    };
    reader.readAsDataURL(file);
  };

  const fetchJenisProgram = useCallback(async () => {
    try {
      const response = await getListJenisProgram();
      const data = response.data.filter((item) => {
        return item.is_active == true;
      });
      setJenisProgram(data);
      setAlert({
        type: "success",
        title: "Info",
        message: response.message || "Failed to fetch data",
      });
    } catch (error) {
      setAlert({
        type: "error",
        title: "Error",
        message: error.message || "Failed to fetch data",
      });
    }
  }, []);

  const handleDeletePengajar = (name) => {
    setForm((prev) => ({
      ...prev,
      pengajar: prev.pengajar.filter((p) => p.name !== name),
    }));
  };

  const handleSubmit = async () => {
    try {
      let response;
      let bannerUrl = null;
      if (form.banner && form.banner instanceof File) {
        const formData = new FormData();
        formData.append("file", form.banner);
        const uploadRes = await uploadFile(formData, token);

        bannerUrl = uploadRes.data[0].fileUrl;
      } else {
        bannerUrl = form.banner;
      }

      // 2. Upload foto pengajar (map semua pengajar)
      const pengajarWithUrl = await Promise.all(
        form.pengajar.map(async (p) => {
          if (p.foto && p.foto instanceof File) {
            const formData = new FormData();
            formData.append("file", p.foto);
            const uploadRes = await uploadFile(formData, token);
            return { ...p, foto: uploadRes.data[0].fileUrl };
          }
          return { ...p, foto: p.foto }; // kalau sudah URL, biarkan
        })
      );

      const payload = {
        ...form,
        banner: bannerUrl,
        pengajar: pengajarWithUrl,
      };

      if (mode == "edit") {
        response = await updateProgramUtama(
          program.id,
          { properties: payload },
          token
        );
      } else {
        response = await createProgramUtama({ properties: payload }, token);
      }
      if (response.status == 200) {
        setAlert({
          type: "success",
          title: "Info",
          message: "Data submitted successfully",
        });
        setTimeout(() => {
          onBack();
        }, 2000);
      }
    } catch (error) {
      setAlert({
        type: "error",
        title: "Error",
        message: error.message || "Failed to submit data",
      });
    }
  };

  useEffect(() => {
    fetchJenisProgram();
  }, [fetchJenisProgram]);

  //  //  console.log(form);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center my-auto">
        <h1 className="text-lg font-semibold text-primary">
          {mode == "add" ? "Tambah" : mode == "view" ? "" : "Edit"} Info Program
          Utama
        </h1>
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="border border-primary p-2 rounded"
          >
            Kembali
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className={`${mode === "view" ? "hidden" : "bg-primary text-white p-2 rounded"}`}
          >
            Simpan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="w-full">
          <label className="text-sm">Paket Program Utama</label>
          <input
            name="name"
            type="text"
            value={form.name}
            disabled={mode === "view"}
            onChange={handleChange}
            placeholder="Nama Program"
            className="border border-gray-400 p-2 rounded focus:outline-red-500 w-full"
          />
        </div>
        <div className="w-full">
          <label className="text-sm">Link Belajar</label>
          <input
            name="link"
            type="text"
            value={form.link}
            disabled={mode === "view"}
            onChange={handleChange}
            placeholder="Masukan link group"
            className="border border-gray-400 p-2 rounded focus:outline-red-500 w-full"
          />
        </div>
        <div className="w-full">
          <label className="text-sm">Harga</label>
          <input
            name="harga"
            type="text"
            value={form.harga}
            disabled={mode === "view"}
            onChange={handleChange}
            placeholder="Masukan Harga"
            className="border border-gray-400 p-2 rounded focus:outline-red-500 w-full"
          />
        </div>
        <div className="w-full">
          <label className="text-sm">Durasi Paket</label>
          <select
            name="durasi"
            value={form.durasi}
            onChange={handleChange}
            className="border border-gray-400 p-2 rounded focus:outline-red-500 w-full"
          >
            <option value="1">1 Bulan</option>
            <option value="2">2 Bulan</option>
            <option value="3">3 Bulan</option>
            <option value="4">4 Bulan</option>
            <option value="5">5 Bulan</option>
            <option value="6">6 Bulan</option>
            <option value="7">7 Bulan</option>
            <option value="8">8 Bulan</option>
            <option value="9">9 Bulan</option>
            <option value="10">10 Bulan</option>
            <option value="11">11 Bulan</option>
            <option value="12">12 Bulan</option>
          </select>
        </div>
        <div className="w-full">
          <label className="text-sm">Jenis Program</label>
          <select
            name="jenis"
            value={form.jenis}
            onChange={handleChange}
            disabled={mode === "view"}
            className="border border-gray-400 p-2 rounded focus:outline-red-500 w-full"
          >
            <option value="">Pilih Jenis</option>
            {jenis && jenis.length > 0 ? (
              jenis.map((item, index) => (
                <option key={index} value={item.value || item.name}>
                  {item.name}
                </option>
              ))
            ) : (
              <option value="">Pilih Jenis</option>
            )}
          </select>
        </div>

        <div className="">
          <h1 className="text-sm">Status</h1>
          <label className="relative inline-flex items-center cursor-pointer my-2">
            <input
              type="checkbox"
              checked={form.status}
              disabled={mode === "view"}
              name="status"
              onChange={(e) => {
                const { name, checked } = e.target;
                setForm((prev) => ({
                  ...prev,
                  [name]: checked,
                }));
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-primary transition"></div>
            <div className="absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition peer-checked:translate-x-5"></div>
          </label>
        </div>

        <div className="">
          <label className="text-sm">Deskripsi</label>
          <textarea
            disabled={mode === "view"}
            value={form.deskripsi}
            name="deskripsi"
            onChange={handleChange}
            className="border border-gray-400 p-2 rounded focus:outline-red-500 w-full text-sm"
            rows={18}
          ></textarea>
        </div>

        <div className="">
          <label className="text-sm">Banner</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleBanner(e.target.files[0])}
            className={`${mode === "view" ? "hidden" : "border border-gray-400 p-2 rounded w-full"}`}
          />

          {form.banner && (
            <div className="mt-2">
              <Image
                width={1000}
                height={1000}
                src={
                  form.banner instanceof File
                    ? URL.createObjectURL(form.banner)
                    : `${process.env.NEXT_PUBLIC_API_URL}/landing/images/${form.banner}`
                }
                alt="Banner Preview"
                className="h-72 w-72 rounded border"
              />
              <p className="text-xs text-gray-500 mt-1">{form.banner?.name}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-6">
        <div>
          <label className="text-sm">Fitur Program Utama</label>
          <div className="flex flex-col">
            <label>
              <input
                type="checkbox"
                value="video"
                disabled={mode === "view"}
                checked={form.fitur.includes("video")}
                onChange={handleChangeFitur}
                className="accent-primary"
              />{" "}
              Video
            </label>

            <label>
              <input
                type="checkbox"
                value="latihan"
                disabled={mode === "view"}
                checked={form.fitur.includes("latihan")}
                onChange={handleChangeFitur}
                className="accent-primary"
              />{" "}
              Latihan
            </label>
          </div>
        </div>
      </div>

      {/* Tabel Pengajar */}
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold">Pengajar</h2>
          <button
            onClick={() => {
              selectedPengajar(null);
              setPengajarMode("add");
              setOpenModal(true);
            }}
            className={`${mode === "view" ? "hidden" : "bg-primary text-white px-3 py-1 rounded"}`}
          >
            Tambah Pengajar
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full mt-2 text-sm rounded-t-md overflow-hidden">
            <thead className="bg-primary text-white text-left">
              <tr>
                <th className="p-2 text-center">No</th>
                <th className="p-2">Pengajar</th>
                <th className="p-2">Jobdesk</th>
                <th className="p-2">Deskripsi</th>
                <th className="p-2">Foto</th>
                <th className={`${mode === "view" ? "hidden" : "p-2"}`}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {form.pengajar && form.pengajar.length > 0 ? (
                form.pengajar.map((item, index) => (
                  <tr key={index} className=" even:bg-gray-300">
                    <td className="p-2 text-center">{index + 1}</td>
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.jobdesk}</td>
                    <td className="p-2 max-w-xs">{item.deskripsi}</td>
                    <td className="p-2">
                      {item.foto ? (
                        <Image
                          width={48}
                          height={48}
                          src={
                            item.foto instanceof File
                              ? URL.createObjectURL(item.foto)
                              : `${process.env.NEXT_PUBLIC_API_URL}/landing/images/${item.foto}`
                          }
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td
                      className={`${mode === "view" ? "hidden" : "p-2 flex gap-2"}`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          selectedPengajar(item);
                          setPengajarMode("edit");
                          setOpenModal(true);
                        }}
                        className="bg-yellow-500 text-white p-1 rounded"
                      >
                        <Pen size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePengajar(item.name)}
                        className="bg-red-500 text-white p-1 rounded"
                      >
                        <Trash size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-2 text-center">
                    Belum ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      {openModal && (
        <PengajarModal
          mode={pengajarMode}
          data={pengajar}
          handlePengajar={handlePengajar}
          onClose={() => setOpenModal(false)}
        />
      )}
    </div>
  );
}
