import { useCallback, useEffect, useState } from "react";
import { Clock, Paperclip, X } from "lucide-react";
import MateriSoalTable from "./tryoutMaterial";
import { getListJenisProgram } from "@/lib/axios/jenisProgram";
import Image from "next/image";
import Cookies from "js-cookie";
import Alert from "../public/alert";
import { createTryOut, updateTryOut } from "@/lib/axios/tryout";
import { uploadFile } from "@/lib/axios/landing";
import { getListJenisTo } from "@/lib/axios/jenisTo";

export default function TryOutForm({ mode, onBack, data }) {
  const token = Cookies.get("token");
  const [alert, setAlert] = useState(null);
  const [jenis, setJenisProgram] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  const [form, setForm] = useState({
    judul: data?.properties?.judul ?? "",
    deskripsi: data?.properties?.deskripsi ?? "",
    waktu: data?.properties?.waktu ?? "",
    link: data?.properties?.link ?? "",
    jenis: data?.properties?.jenis ?? "",
    gambar: data?.properties?.gambar ?? "",
    fitur: data?.properties?.fitur ?? [],
    status: data?.properties?.status ?? false,
    materi: data?.properties?.materi ?? [],

    startGratis: data?.properties?.startGratis ?? "",
    endGratis: data?.properties?.endGratis ?? "",
    startPremium: data?.properties?.startPremium ?? "",
    endPremium: data?.properties?.endPremium ?? "",
    pemMulai: data?.properties?.pemMulai ?? "",
    pemSelesai: data?.properties?.pemSelesai ?? "",
    aktiUntil: data?.properties?.aktiUntil ?? "",
    hargaPremium: data?.properties?.hargaPremium ?? "",
    op_pembahasan: data?.properties?.op_pembahasan ?? "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        fitur: checked
          ? [...prev.fitur, value]
          : prev.fitur.filter((f) => f !== value),
      }));
    } else if (type === "file") {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else if (type === "checkbox-toggle") {
      setForm((prev) => ({ ...prev, status: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleSubmit = async () => {
    try {
      if (
        form.judul === "" ||
        form.deskripsi === "" ||
        form.waktu === "" ||
        form.jenis === "" ||
        form.start === "" ||
        form.end === "" ||
        form.fitur === ""
      ) {
        setAlert({
          type: "error",
          title: "Info",
          message: "Nama dan Jobdesk tidak boleh kosong",
        });
        return;
      }

      if (form.fitur.includes("Gratis")) {
        if (!form.startGratis || !form.endGratis) {
          setAlert({
            type: "error",
            title: "Info",
            message: "Tanggal mulai dan selesai Gratis wajib diisi",
          });
          return;
        }
      }

      if (form.fitur.includes("Premium")) {
        // if (!form.startPremium || !form.endPremium || !form.hargaPremium) {
        if (!form.hargaPremium) {
          setAlert({
            type: "error",
            title: "Info",
            message: "Harga Premium wajib diisi",
          });
          return;
        }
      }

      let imageUrl = data?.properties.gambar || null;

      // kalau ada foto baru
      if (photoFile) {
        const formData = new FormData();
        formData.append("file", photoFile);
        const res = await uploadFile(formData, token);

        if (res.status === 200) {
          imageUrl = res.data[0].fileUrl;
        } else {
          setAlert({
            type: "error",
            title: "Info",
            message: "Gagal mengunggah gambar",
          });
          return;
        }
      }

      const payload = { ...form, gambar: imageUrl };

      let response;
      if (mode === "form-edit") {
        response = await updateTryOut(data.id, payload, token);
      } else {
        response = await createTryOut(payload, token);
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
      // //  //  console.log(error)
      const res = error.response?.data;
      setAlert({
        type: "error",
        title: "Info",
        message: res?.message || error.message,
      });
    }
  };

  const fetchJenisProgram = useCallback(async () => {
    try {
      const response = await getListJenisTo();
      const data = response.data.filter((item) => {
        return item.is_active == true;
      });
      setJenisProgram(data);
    } catch (error) {
      setAlert({
        type: "error",
        title: "Error",
        message: error.message || "Failed to fetch data",
      });
    }
  }, []);

  useEffect(() => {
    fetchJenisProgram();
  }, [fetchJenisProgram]);

  const [preview, setPreview] = useState(null);

  const handleChangePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ Batasi ukuran file (2 MB)
    if (file.size > 5 * 1024 * 1024) {
      setAlert({
        type: "error",
        title: "Error",
        message: "Maksimal 5MB",
      });
      return;
    }

    // ✅ Tampilkan preview gambar
    // const reader = new FileReader();
    // reader.onload = (event) => {
    //   setPreview(event.target.result);
    // };
    // reader.readAsDataURL(file);
    setPreview(URL.createObjectURL(file));
    setPhotoFile(file);
  };

  const handleRemove = () => {
    setPreview(null);
  };
  useEffect(() => {
    if (mode === "form-edit") {
      setPreview(
        `${process.env.NEXT_PUBLIC_API_URL}/landing/images/${data?.properties.gambar}`,
      );
    }
  }, [mode, data]);

  return (
    <div className="">
      <h2 className="text-2xl font-bold text-red-700 mb-2">
        {mode == "form" ? "Tambah" : "Edit"} Try Out
      </h2>
      {/* <p className="text-gray-600">
        Try Out <span className="text-red-600 font-semibold">/ Tambah</span>
      </p> */}
      <div className="col-span-2 flex justify-end gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 border border-red-700 text-red-700 rounded-md hover:bg-red-50"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-2 bg-red-700 text-white rounded-md hover:bg-red-800"
        >
          Simpan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* KIRI */}
        <div className="space-y-5">
          <div>
            <label className="block font-semibold mb-1">Nama Tryout</label>
            <input
              type="text"
              name="judul"
              value={form.judul}
              placeholder="Masukkan nama"
              className="w-full border border-red-300 rounded-md p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Deskripsi</label>
            <textarea
              name="deskripsi"
              value={form.deskripsi}
              placeholder="Masukkan Deskripsi"
              className="w-full border border-red-300 rounded-md p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
              onChange={handleChange}
              rows={14}
            />
          </div>

          <div className="mb-10">
            <label className="block font-semibold mb-2">
              Fitur Program Utama
            </label>

            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value="Gratis"
                  checked={form.fitur.includes("Gratis")}
                  onChange={handleChange}
                />
                Gratis
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value="Premium"
                  checked={form.fitur.includes("Premium")}
                  onChange={handleChange}
                />
                Premium
              </label>
            </div>

            {/* ✅ Jika Gratis dipilih */}
            {form.fitur.includes("Gratis") && (
              <div className="mt-4 space-y-3 border-t pt-3">
                <h4 className="font-semibold text-gray-700">Periode Gratis</h4>
                <div>
                  <label className="block mb-1 font-medium">
                    Tanggal Mulai
                  </label>
                  <input
                    name="startGratis"
                    type="date"
                    value={form.startGratis}
                    onChange={handleChange}
                    className="w-full border border-red-300 rounded-md p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">
                    Tanggal Selesai
                  </label>
                  <input
                    name="endGratis"
                    type="date"
                    value={form.endGratis}
                    onChange={handleChange}
                    className="w-full border border-red-300 rounded-md p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* ✅ Jika Premium dipilih */}
            {form.fitur.includes("Premium") && (
              <div className="mt-4 space-y-3 border-t pt-3">
                <h4 className="font-semibold text-gray-700">Periode Premium</h4>
                <div>
                  <label className="block mb-1 font-medium">
                    Tanggal Mulai
                  </label>
                  <input
                    name="startPremium"
                    type="date"
                    value={form.startPremium}
                    onChange={handleChange}
                    className="w-full border border-red-300 rounded-md p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">
                    Tanggal Selesai
                  </label>
                  <input
                    name="endPremium"
                    type="date"
                    value={form.endPremium}
                    onChange={handleChange}
                    className="w-full border border-red-300 rounded-md p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">
                    Harga Premium
                  </label>
                  <input
                    name="hargaPremium"
                    type="number"
                    placeholder="Masukkan harga"
                    value={form.hargaPremium}
                    onChange={handleChange}
                    className="w-full border border-red-300 rounded-md p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div className="mt-4 space-y-3 border-t pt-3">
              <h4 className="font-semibold text-gray-700">Periode Pembelian</h4>
              <div>
                <label className="block mb-1 font-medium">Tanggal Mulai</label>
                <input
                  name="pemMulai"
                  type="date"
                  value={form.pemMulai}
                  onChange={handleChange}
                  className="w-full border border-red-300 rounded-md p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">
                  Tanggal Selesai
                </label>
                <input
                  name="pemSelesai"
                  type="date"
                  value={form.pemSelesai}
                  onChange={handleChange}
                  className="w-full border border-red-300 rounded-md p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
        {/* KANAN */}
        <div className="space-y-5">
          <div>
            <label className="block font-semibold mb-1">Waktu Pengerjaan</label>
            <div className="relative">
              <input
                name="waktu"
                value={form.waktu}
                onChange={handleChange}
                className="w-full border border-red-300 rounded-md p-2 pr-10 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">Link post IG</label>
            <div className="relative">
              <input
                name="link"
                value={form.link}
                onChange={handleChange}
                className="w-full border border-red-300 rounded-md p-2 pr-10 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-semibold mb-1">Gambar</label>

            <div className="relative">
              <input
                type="file"
                name="gambar"
                accept="image/*"
                className="w-full border border-red-300 rounded-md p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                onChange={handleChangePhoto}
              />
              <Paperclip className="absolute right-3 top-2.5 text-gray-500" />
            </div>

            <p className="text-sm text-gray-500 mt-1">
              Max file 5MB • Ukuran foto 300x300 pixel
            </p>

            {/* ✅ Preview Gambar */}
            {preview && (
              <div className="relative mt-3">
                <Image
                  src={preview}
                  alt="Preview"
                  width={300}
                  height={300}
                  className="object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  title="Hapus gambar"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block font-semibold mb-1">Jenis Program</label>
            <select
              name="jenis"
              value={form.jenis}
              onChange={handleChange}
              className="border border-gray-400 p-2 rounded focus:outline-red-500 w-full"
            >
              <option value="">Semua</option>
              {jenis && jenis.length > 0 ? (
                jenis.map((item, index) => (
                  <option key={index} value={item.value || item.name}>
                    {item.name}
                  </option>
                ))
              ) : (
                <option value="">Semua</option>
              )}
            </select>
          </div>

          <div className="space-y-3">
            <h1>Status</h1>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.status}
                onChange={() => {
                  setForm((prev) => ({ ...prev, status: !prev.status }));
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-primary transition"></div>
              <div className="absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition peer-checked:translate-x-5"></div>
            </label>
          </div>
          <div>
            <label className="block mb-1 font-medium">Pembahasan dibuka</label>
            <input
              name="op_pembahasan"
              type="date"
              value={form.op_pembahasan}
              onChange={handleChange}
              className="w-full border border-red-300 rounded-md p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Try Out Aktif</label>
            <input
              name="aktiUntil"
              type="date"
              value={form.aktiUntil}
              onChange={handleChange}
              className="w-full border border-red-300 rounded-md p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
      <div className="mb-10">
        <MateriSoalTable form={form} setForm={setForm} />
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
}
