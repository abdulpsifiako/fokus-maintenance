import { useState } from "react";
import Alert from "../public/alert";
import { createVoucher, updateVoucher } from "@/lib/axios/voucher";
import Cookies from "js-cookie";

export default function TambahVoucherForm({ onCancel, mode, data }) {
  const token = Cookies.get("token");
  const [alert, setAlert] = useState(false);
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0]; // yyyy-mm-dd
  };
  const [form, setForm] = useState({
    nama: data?.name || "",
    nilai: data?.nilai || "",
    tipe: data?.tipe || "",
    tanggal: data?.valid ? formatDate(data.valid) : formatDate(new Date()),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (onSave) onSave(form);
  // };

  const handleSubmit = async () => {
    try {
      let res;

      if (mode == "edit") {
        res = await updateVoucher({ ...form, id: data?.id }, token);
      } else {
        res = await createVoucher(form, token);
      }
      if (res.status == 200) {
        setAlert({
          type: "success",
          title: "",
          message: res.message,
        });
      }
      setTimeout(() => {
        onCancel();
      }, 3000);
    } catch (error) {
      // //  //  console.log(error)
    }
  };
  return (
    <div className="p-6 bg-white">
      {/* Title & Breadcrumb */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-red-800">Tambah Voucher</h2>
        <p className="text-sm text-gray-500">
          Voucher / <span className="text-red-600 font-medium">Tambah</span>
        </p>
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition"
          >
            Batal
          </button>
          {mode === "view" ? (
            ""
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition"
            >
              Simpan
            </button>
          )}
        </div>
      </div>

      {/* Form */}
      <form className="space-y-4">
        {/* Nama Voucher */}
        <div className="max-w-xs">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Voucher
          </label>
          <input
            type="text"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            placeholder="Masukkan Nama Voucher"
            className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
        </div>

        {/* Nilai Voucher */}
        <div className="max-w-xs">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nilai Voucher
          </label>
          <input
            type="number"
            name="nilai"
            value={form.nilai}
            onChange={handleChange}
            placeholder="Masukkan Nilai Voucher"
            className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
        </div>

        {/* Tipe Program */}
        <div className="max-w-xs">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipe Program
          </label>
          <select
            name="tipe"
            value={form.tipe}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
          >
            <option value="">Pilih Tipe Program</option>
            <option value="kelas-online">Kelas Online</option>
            <option value="program-utama">Program Utama</option>
            <option value="try-out">Try Out</option>
          </select>
        </div>

        {/* Berlaku Sampai Tanggal */}
        <div className="max-w-xs">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Berlaku Sampai Tanggal
          </label>
          <input
            type="date"
            name="tanggal"
            value={form.tanggal}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
        </div>

        {/* Buttons */}
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
