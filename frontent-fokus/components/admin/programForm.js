import { useCallback, useEffect, useState } from "react";
import { FiTrash } from "react-icons/fi";
import Alert from "../public/alert";
import Cookies from "js-cookie";
import { createProgram, updateProgram } from "@/lib/axios/program";
import {
  getListProgramUtamaVideo,
  getProgramUtamaAdmin,
} from "@/lib/axios/programUtama";
import { getListJenisProgram } from "@/lib/axios/jenisProgram";

export default function ProgramForm({ mode, data, onBack }) {
  const token = Cookies.get("token");

  const [alert, setAlert] = useState(null);

  const [programUtama, setProgramUtama] = useState(null);
  const [jenis, setJenisProgram] = useState(null);

  const [form, setForm] = useState({
    name: data?.properties?.name || "",
    durasi: data?.properties?.durasi || "",
    link: data?.properties?.link || "",
    harga: data?.properties?.harga || "",
    diskon_aktif: data?.properties?.diskon_aktif || false,
    diskon_tipe: data?.properties?.diskon_tipe || "nominal",
    diskon_value: data?.properties?.diskon_value || "",
    deskripsi: data?.properties?.deskripsi || [{ title: "", sub: "" }],
    program_id: data?.properties?.program_id || "",
    jenis: data?.properties.jenis || "",
  });

  //  //  console.log("INI FORM", form)

  const fetchFiturVideoProgramUtama = useCallback(async () => {
    try {
      const response = await getListProgramUtamaVideo(token);
      setProgramUtama(response.data);
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
  }, [token]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleToggleDiskon = () => {
    setForm({ ...form, diskon_aktif: !form.diskon_aktif });
  };

  const handleDeskripsiChange = (index, field, value) => {
    const newDesc = [...form.deskripsi];
    newDesc[index] = {
      ...newDesc[index],
      [field]: value,
    };
    setForm({ ...form, deskripsi: newDesc });
  };

  const handleAddDeskripsi = () => {
    if (form.deskripsi.length < 5) {
      setForm({
        ...form,
        deskripsi: [...form.deskripsi, { title: "", sub: "" }],
      });
    }
  };

  const handleRemoveDeskripsi = (index) => {
    const newDesc = form.deskripsi.filter((_, i) => i !== index);
    setForm({ ...form, deskripsi: newDesc });
  };

  const hitungHargaAkhir = () => {
    const harga = parseFloat(form.harga) || 0;
    const diskon = parseFloat(form.diskon_value) || 0;

    if (!form.diskon_aktif) return harga;

    if (form.diskon_tipe === "nominal") {
      return Math.max(harga - diskon, 0);
    } else if (form.diskon_tipe === "persen") {
      return Math.max(harga - harga * (diskon / 100), 0);
    }
    return harga;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        !form.durasi ||
        !form.harga ||
        !form.link ||
        form.deskripsi.length === 0 ||
        !form.harga
      ) {
        setAlert({
          type: "error",
          title: "Info",
          message: "Form tidak boleh kosong",
        });
        return;
      }
      let payload;
      let response;
      if (mode === "edit") {
        payload = { properties: form, is_active: data.is_active };
        response = await updateProgram(data.id, payload, token);
      } else {
        payload = { properties: form };
        response = await createProgram(payload, token);
      }

      if (response.status === 200 || response.status === 201) {
        setAlert({
          type: "success",
          title: "Info",
          message: response.message || "Data berhasil disimpan",
        });
        setTimeout(() => {
          setAlert(null);
          onBack();
        }, 2000);
      }
    } catch (error) {
      // //  //  console.log(error);
      const res = error.response?.data;
      setAlert({
        type: "error",
        title: "Info",
        message: res?.message || error.message,
      });
    }
  };
  useEffect(() => {
    fetchFiturVideoProgramUtama();
    fetchJenisProgram();
  }, [fetchFiturVideoProgramUtama, fetchJenisProgram]);
  //  console.log(form);
  return (
    <div className="p-6 font-poppins">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-red-700">
          {mode === "add"
            ? "Tambah Paket Program Utama"
            : "Edit Paket Program Utama"}
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onBack}
            className="border border-red-700 text-red-700 px-4 py-2 rounded hover:bg-red-50"
          >
            Kembali
          </button>
          <button
            type="submit"
            form="programForm"
            className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
          >
            Simpan
          </button>
        </div>
      </div>

      <form
        id="programForm"
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
      >
        {/* Nama Paket */}
        {/* <div className="flex flex-col w-full">
          <label className="mb-1 font-medium text-gray-700">Nama Paket</label>
          <input
            name="name"
            type="text"
            placeholder="Masukkan Nama Paket"
            value={form.name}
            onChange={handleChange}
            className="border border-gray-400 p-2 rounded focus:outline-red-500 w-full"
          />
        </div> */}

        {/* Harga */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Harga</label>
          <input
            name="harga"
            type="number"
            placeholder="Masukkan Harga Paket"
            value={form.harga}
            onChange={handleChange}
            className="border border-gray-400 p-2 rounded focus:outline-red-500 w-full"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">
            Paket Program Utama
          </label>
          <select
            name="program_id"
            value={form.program_id}
            onChange={(e) => {
              handleChange(e);
              const selectedOption = e.target.selectedOptions[0];
              setForm((prev) => ({
                ...prev,
                name: selectedOption.dataset.name,
              }));
            }}
            disabled={mode === "view"}
            className="border border-gray-400 p-2 rounded focus:outline-red-500 w-full"
          >
            <option value="">Pilih Program Utama</option>
            {programUtama && programUtama.length > 0 ? (
              programUtama.map((item, index) => (
                <option
                  data-name={item.properties?.name}
                  key={index}
                  value={item.id}
                >
                  {item.properties?.name}
                </option>
              ))
            ) : (
              <option value="">Pilih Program Utama</option>
            )}
          </select>
        </div>
        {/* <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">
            Jenis Program
          </label>
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
        </div> */}
        {/* Durasi Paket */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Durasi Paket</label>
          <select
            name="durasi"
            value={form.durasi}
            onChange={handleChange}
            className="border border-gray-400 p-2 rounded focus:outline-red-500 w-full"
          >
            <option value="">Pilih Durasi</option>
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

        {/* Link Group */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Link Grup</label>
          <input
            name="link"
            type="text"
            placeholder="Masukkan Link Grup Belajar"
            value={form.link}
            onChange={handleChange}
            className="border border-gray-400 p-2 rounded focus:outline-red-500 w-full"
          />
        </div>

        {/* Diskon */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <label className="font-medium text-gray-700">Diskon</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.diskon_aktif}
                onChange={handleToggleDiskon}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-primary transition"></div>
              <div className="absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition peer-checked:translate-x-5"></div>
            </label>
          </div>

          {form.diskon_aktif && (
            <div className="flex flex-col gap-3">
              {/* Radio tipe diskon */}
              <div className="flex gap-4">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="diskon_tipe"
                    value="nominal"
                    checked={form.diskon_tipe === "nominal"}
                    onChange={handleChange}
                  />
                  Nominal
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="diskon_tipe"
                    value="persen"
                    checked={form.diskon_tipe === "persen"}
                    onChange={handleChange}
                  />
                  Persen
                </label>
              </div>

              {/* Input sesuai tipe */}
              {form.diskon_tipe === "nominal" && (
                <input
                  type="number"
                  name="diskon_value"
                  placeholder="Masukkan Diskon (Rp)"
                  value={form.diskon_value}
                  onChange={handleChange}
                  className="border border-gray-400 p-2 rounded focus:outline-red-500 w-full"
                />
              )}
              {form.diskon_tipe === "persen" && (
                <input
                  type="number"
                  name="diskon_value"
                  placeholder="Masukkan Diskon (%)"
                  value={form.diskon_value}
                  onChange={handleChange}
                  className="border border-gray-400 p-2 rounded focus:outline-red-500 w-full"
                />
              )}

              {/* Harga akhir */}
              <p className="text-sm text-gray-700">
                Harga Akhir:{" "}
                <span className="font-bold">
                  Rp {hitungHargaAkhir().toLocaleString()}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Deskripsi */}
        <div className="col-span-1 md:col-span-2">
          <label className="mb-2 font-medium text-gray-700">
            Deskripsi Paket Program Utama
          </label>
          {form.deskripsi.map((desc, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <div className="space-y-2 w-full">
                <input
                  type="text"
                  placeholder="Masukan judul deskripsi"
                  value={desc.title}
                  onChange={(e) =>
                    handleDeskripsiChange(idx, "title", e.target.value)
                  }
                  className="border border-gray-400 p-2 rounded w-full focus:outline-red-600"
                />
                <input
                  type="text"
                  placeholder="Masukkan subjudul"
                  value={desc.sub}
                  onChange={(e) =>
                    handleDeskripsiChange(idx, "sub", e.target.value)
                  }
                  className="border border-gray-400 p-2 rounded w-full focus:outline-red-600"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveDeskripsi(idx)}
                className="p-2 text-red-600 hover:text-red-800"
              >
                <FiTrash />
              </button>
            </div>
          ))}
          {form.deskripsi.length < 5 && (
            <button
              type="button"
              onClick={handleAddDeskripsi}
              className="mt-2 bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
            >
              Tambah Deskripsi
            </button>
          )}
          <p className="text-xs text-gray-500 mt-1">Max penambahan 5</p>
        </div>
      </form>
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
}
