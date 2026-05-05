import { useEffect, useState } from "react";
import Image from "next/image";

export default function PengalamanForm({ onCancel, selected, onSave, buttonDisable }) {
  const [form, setForm] = useState({
    judul: "",
    deskripsi: "",
    imageUrl: "",
    link:"",
  });

  const [preview, setPreview] = useState(null); // preview file baru
  const [file, setFile] = useState(null);       // file image baru

  // === LOAD DATA SAAT EDIT ===
  useEffect(() => {
    if (selected) {
      setForm({
        judul: selected.judul || "",
        deskripsi: selected.deskripsi || "",
        imageUrl: selected.imageUrl || "",
        link:selected.link||""
      });

      // jika ada gambar lama → previewkan URL API
      if (selected.imageUrl) {
        setPreview(
          `${process.env.NEXT_PUBLIC_API_URL}/landing/images/${selected.imageUrl}`
        );
      }
    }
  }, [selected]);

  // === HANDLE INPUT ===
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // === HANDLE FILE UPLOAD + PREVIEW ===
  const handleFile = (e) => {
    const fileData = e.target.files[0];
    setFile(fileData);

    if (fileData) {
      const urlPreview = URL.createObjectURL(fileData);
      setPreview(urlPreview);
    }
  };

  // === SIMPAN ===
  const handleSubmit = () => {
    onSave({
      ...form,
      file, // kirim file jika ada → parent yg upload
    });
  };

  return (
    <div className="w-full bg-white p-6 rounded-xl font-poppins">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-primary">
          {selected ? "Edit Pengalaman" : "Tambah Pengalaman"}
        </h2>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
          >
            Batal
          </button>

          <button
            type="button"
            disabled={buttonDisable}
            onClick={handleSubmit}
            className="px-5 py-2 rounded-md bg-primary text-white hover:opacity-90 transition"
          >
            Simpan
          </button>
        </div>
      </div>

      {/* FORM */}
      <form className="space-y-6">
        {/* JUDUL */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <label className="w-32 text-sm font-semibold text-gray-700">
            Judul
          </label>
          <input
            type="text"
            name="judul"
            value={form.judul}
            onChange={handleChange}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="Masukkan Judul"
          />
        </div>

        {/* DESKRIPSI */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <label className="w-32 text-sm font-semibold text-gray-700">
            Deskripsi
          </label>
          <textarea
            rows={4}
            name="deskripsi"
            value={form.deskripsi}
            onChange={handleChange}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="Masukkan Deskripsi"
          ></textarea>
        </div>

        {/* GAMBAR */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <label className="w-32 text-sm font-semibold text-gray-700">
            Gambar
          </label>

          <div className="flex flex-col gap-3 flex-1">
            <input
              type="file"
              onChange={handleFile}
              className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-primary focus:outline-none"
            />

            {/* PREVIEW GAMBAR */}
            {preview && (
              <div className="relative w-40 h-40 rounded-md overflow-hidden border">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <label className="w-32 text-sm font-semibold text-gray-700">
            Link
          </label>
          <input
            type="text"
            name="link"
            value={form.link}
            onChange={handleChange}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="Masukkan Link"
          />
        </div>
      </form>
    </div>
  );
}
