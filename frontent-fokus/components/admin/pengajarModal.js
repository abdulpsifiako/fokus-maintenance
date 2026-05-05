import Image from "next/image";
import { useEffect, useState } from "react";

export default function PengajarModal({mode, data, onClose ,handlePengajar }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    name:data?.name || "",
    jobdesk:data?.jobdesk || "",
    deskripsi:data?.deskripsi || "",
    foto:null
  })

  const handleFiles = (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);

    setForm(prev => ({
      ...prev,
      foto: selectedFile
    }))

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      setForm(prev => ({
        ...prev,
        foto: selectedFile,
      }))
    };
    reader.readAsDataURL(selectedFile);
  };
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("border-indigo-600");
    const droppedFile = e.dataTransfer.files[0];
    handleFiles(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("border-indigo-600");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-indigo-600");
  };
  useEffect(() => {
    if (mode === "edit" && data?.foto) {
      setPreview(`${process.env.NEXT_PUBLIC_API_URL}/landing/images/${data.foto}`);
      setForm(prev => ({ ...prev, foto: data.foto }));
    }
  }, [mode, data]);
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">Pengajar</h2>

        <div className="space-y-3">
          <input
            placeholder="Nama Pengajar"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="border border-gray-400 p-2 rounded focus:outline-red-500 w-full"
          />
          <input
            name="jobdesk"
            value={form.jobdesk}
            onChange={handleChange}
            placeholder="Jobdesk"
            className="border border-gray-400 p-2 rounded focus:outline-red-500 w-full"
          />
          <textarea
            placeholder="Masukkan Deskripsi"
            name="deskripsi"
            value={form.deskripsi}
            onChange={handleChange}
            className="border border-gray-400 p-2 rounded focus:outline-red-500 w-full"
            rows={3}
          ></textarea>

          {/* Custom Upload Drag & Drop */}
          <div
            className="w-full relative border-2 border-gray-300 border-dashed rounded-lg p-6 text-center"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 z-50 cursor-pointer"
              onChange={(e) => handleFiles(e.target.files[0])}
            />

            {!preview ? (
              // Tampilan default upload
              <>
                <Image
                  width={48}
                  height={48}
                  className="mx-auto h-12 w-12"
                  src="/upload-icon.svg"
                  alt="Upload"
                />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  <span>Drag and drop</span>
                  <span className="text-indigo-600"> or browse </span>
                  <span>to upload</span>
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG up to 5MB
                </p>
              </>
            ) : (
              // Jika sudah ada file → tampilkan preview
              <div className="relative">
                <Image
                  width={400}
                  height={400}
                  src={preview}
                  alt="Preview"
                  className="mx-auto max-h-48 object-cover rounded"
                />
                <p className="mt-2 text-xs text-gray-500">{file?.name}</p>
                <p className="text-xs text-indigo-600">Klik gambar untuk ganti file</p>
              </div>
            )}
          </div>

        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="border border-primary text-primary px-4 py-2 rounded hover:bg-gray-100"
          >
            Batal
          </button>
          <button type="button" onClick={()=>{handlePengajar(form)}} className="bg-primary text-white px-4 py-2 rounded">
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
