import { useEffect, useState } from "react";
import Alert from "../public/alert";
import { uploadFile } from "@/lib/axios/landing";
import { createTestimoni, updateTestimoni } from "@/lib/axios/testimoni";
import Cookies from "js-cookie";
import Image from "next/image";

export default function TambahTestimoniForm({ mode, data, onCancel }) {
  const [buttonDisable, setButtonDisable] = useState(false)
  const token = Cookies.get("token");

  const [alert, setAlert] = useState(null);
  const [form, setForm] = useState({
    nama: data?.properties.nama || "",
    profesi: data?.properties.profesi || "",
    deskripsi: data?.properties.deskripsi || "",
    photo: data?.properties.photo || "",
  });

  // 👉 jika edit, preview awal ambil dari data lama
  const [preview, setPreview] = useState(
    data?.properties.photo
      ? `${process.env.NEXT_PUBLIC_API_URL}/landing/images/${data.properties.photo}`
      : null
  );

  useEffect(() => {
    if (data?.properties.photo) {
      setPreview(`${process.env.NEXT_PUBLIC_API_URL}/landing/images/${data.properties.photo}`);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, photo: file }));
      setPreview(URL.createObjectURL(file)); // tampilkan preview baru
    }
  };

  const handleSubmitForm=async () => {
    setButtonDisable(true)
    try {
      if (form.nama === "" || form.deskripsi === "" || form.profesi === "" || form.photo === "") {
        setAlert({
          type: "error",
          title: "Info",
          message: "Form tidak boleh kosong",
        });
        return;
      }

      let imageUrl 
      if (form.photo instanceof File) {
        const formData = new FormData();
        formData.append("file", form.photo);
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
      }else{
        imageUrl=form.photo
      }

      const payload = { ...form, photo: imageUrl};

      let response;
      if (mode === "edit") {
        response = await updateTestimoni(data.id, payload, token);
      } else {
        response = await createTestimoni(payload, token)
      }
      if(response.status ==200) {
          setAlert({
          type: "success",
              title: "Info",
              message: response.message,
          })
      }
      setForm({
        nama: "",
        profesi: "",
        deskripsi: "",
        photo: "",
      })
      setButtonDisable(false)
      onCancel()
      } catch (error) {
        const res = error.response.data
        if(res.status==403){
            setAlert({
                type: "info",
                title: "Info",
                message: res.message,
            });
        }else{
            setAlert({
            type: "info",
                title: "Info",
                message: error.message,
            })
        }
        setButtonDisable(false)
        return
      }
  }


  return (
    <div className="mt-8 px-6 font-poppins mb-10">
      {/* Judul */}
      <h2 className="text-lg font-semibold text-primary mb-5">
        Tambah Testimoni
      </h2>
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onCancel}
          className="border border-red-600 text-red-600 px-5 py-2 rounded-lg text-sm hover:bg-red-50 transition"
        >
          Batal
        </button>
        <button disabled={buttonDisable} type="button" onClick={handleSubmitForm} className="bg-primary text-white px-5 py-2 rounded-lg text-sm hover:bg-primary/90 transition">
          Simpan
        </button>
      </div>

      {/* Form Input */}
      <div className="space-y-4 max-w-md bg-white rounded-2xl shadow-sm">
        {/* Nama */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Lengkap
          </label>
          <input
            type="text"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg text-sm focus:ring focus:ring-primary focus:border-primary outline-none"
            placeholder="Masukkan nama lengkap"
          />
        </div>

        {/* Institusi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Institusi / Profesi
          </label>
          <input
            type="text"
            name="profesi"
            value={form.profesi}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg text-sm focus:ring focus:ring-primary focus:border-primary outline-none"
            placeholder="Masukkan institusi atau profesi"
          />
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deskripsi Testimoni
          </label>
          <textarea
            name="deskripsi"
            value={form.deskripsi}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg text-sm focus:ring focus:ring-primary focus:border-primary outline-none resize-none"
            rows={4}
            placeholder="Tulis deskripsi testimoni..."
          ></textarea>
        </div>

        {/* Banner */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Banner
          </label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handlePhotoChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-primary file:text-white hover:file:bg-primary/80 cursor-pointer"
          />

          {preview && (
            <div className="mt-3">
              <Image
                height={500}
                width={500}
                src={preview}
                alt="Preview"
                className="w-48 h-48 object-cover rounded-lg border"
              />
            </div>
          )}

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
    </div>
  );
}
