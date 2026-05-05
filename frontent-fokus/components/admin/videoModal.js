import { getListProgramUtamaVideo } from "@/lib/axios/programUtama";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function VideoModal({
  mode,
  data,
  onClose,
  handleVideo,
  programUtama,
  programId,
}) {
  const token = Cookies.get("token");
  const [dataPengajar, setDataPengajar] = useState(programUtama);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const [form, setForm] = useState({
    name: data?.name || "",
    status: data?.status || true,
    kategori: data?.kategori || "",
    video: data?.video || null,
    thumbnail: data?.thumbnail || null,
    pengajar: data?.pengajar || "",
    data_pengajar: data?.data_pengajar || [],
    deskripsi: data?.deskripsi || "",
  });

  const handleStatus = (e) => {
    const { name, checked } = e.target;
    setForm((prev) => {
      return {
        ...prev,
        [name]: checked,
      };
    });
  };
  const handleFiles = (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);

    setForm((prev) => ({
      ...prev,
      video: selectedFile,
    }));

    setPreview(selectedFile);
  };

  const handleThumbnail = (selectedFile) => {
    if (!selectedFile) return;
    setThumbnailFile(selectedFile);
    setForm((prev) => ({ ...prev, thumbnail: selectedFile }));
    setThumbnailPreview(selectedFile);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "pengajar") {
      const selectedPengajar = dataPengajar.properties?.pengajar?.filter(
        (item) => {
          return item.foto === value;
        }
      );
      setForm((prev) => ({ ...prev, data_pengajar: selectedPengajar }));
    }
  };

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
  const fetchFiturVideoProgramUtama = useCallback(async () => {
    try {
      const response = await getListProgramUtamaVideo(token);
      const pengajar = response.data.filter(
        (item) => item.id === Number(programId)
      );
      setDataPengajar(pengajar[0]);
    } catch (error) {
      // //  //  console.log(error)
    }
  }, [programId, token]);
  useEffect(() => {
    if (mode === "edit") {
      setThumbnailPreview(data.thumbnail);
      setPreview(data.video);
    }
    fetchFiturVideoProgramUtama();
  }, [mode, data, fetchFiturVideoProgramUtama]);
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">Upload Video</h2>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          <input
            placeholder="Masukan Sub Materi"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="border border-gray-400 p-2 rounded focus:outline-red-500 w-full"
          />
          <textarea
            placeholder="Deskripsi"
            name="deskripsi"
            rows={10}
            value={form.deskripsi}
            onChange={handleChange}
            className="border border-gray-400 p-2 rounded focus:outline-red-500 w-full"
          />
          <select
            name="kategori"
            value={form.kategori}
            onChange={handleChange}
            className="border border-gray-400 p-2 rounded focus:outline-red-500 w-full"
          >
            <option value="">-- Kategori Video --</option>
            <option value="Gratis">Gratis</option>
            <option value="Berbayar">Berbayar</option>
          </select>
          <select
            name="pengajar"
            value={form.pengajar}
            onChange={handleChange}
            className="border border-gray-400 p-2 rounded focus:outline-red-500 w-full"
          >
            <option value="">-- Pilih Pengajar --</option>
            {dataPengajar &&
              dataPengajar.properties?.pengajar?.map((item, index) => (
                <option key={index} value={item.foto}>
                  {item.name}
                </option>
              ))}
          </select>
          <div className="flex gap-2">
            <h1>Status</h1>
            <label className="relative inline-flex items-center cursor-pointer my-auto">
              <input
                type="checkbox"
                name="status"
                checked={form.status}
                className="sr-only peer"
                onChange={handleStatus}
              />
              <div className="w-11 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-primary transition"></div>
              <div className="absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition peer-checked:translate-x-5"></div>
            </label>
          </div>
          <div className="w-full border-2 border-gray-300 border-dashed rounded-lg p-4 text-center relative">
            {!thumbnailPreview ? (
              <>
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => handleThumbnail(e.target.files[0])}
                />
                <Image
                  width={48}
                  height={48}
                  className="mx-auto h-12 w-12 opacity-70"
                  src="https://www.svgrepo.com/show/522152/image-picture.svg"
                  alt="Upload Thumbnail"
                />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  <span>Drag and drop</span>
                  <span className="text-indigo-600"> or browse </span>
                  <span>to upload image</span>
                </h3>
                <p className="mt-2 text-xs text-gray-500">
                  Upload Thumbnail (PNG, JPG) up to 5MB
                </p>
              </>
            ) : (
              <div className="relative">
                <Image
                  src={
                    thumbnailPreview instanceof File
                      ? URL.createObjectURL(thumbnailPreview)
                      : `${process.env.NEXT_PUBLIC_API_URL}/landing/images/${thumbnailPreview}`
                  }
                  width={400}
                  height={200}
                  alt="Thumbnail Preview"
                  className="mx-auto max-h-40 object-cover rounded"
                />
                <label className="text-xs text-indigo-600 cursor-pointer block mt-2">
                  Ganti Thumbnail
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleThumbnail(e.target.files[0])}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Custom Upload Drag & Drop */}
          <div
            className="w-full relative border-2 border-gray-300 border-dashed rounded-lg p-6 text-center"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {!preview ? (
              <>
                <input
                  type="file"
                  accept="video/*"
                  className="absolute inset-0 w-full h-full opacity-0 z-50 cursor-pointer"
                  onChange={(e) => handleFiles(e.target.files[0])}
                />
                <Image
                  width={48}
                  height={48}
                  className="mx-auto h-12 w-12 opacity-70"
                  src="https://www.svgrepo.com/show/522461/video.svg"
                  alt="Upload Video"
                />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  <span>Drag and drop</span>
                  <span className="text-indigo-600"> or browse </span>
                  <span>to upload video</span>
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  MP4, MKV, AVI up to 200MB
                </p>
              </>
            ) : (
              <div className="relative">
                <video
                  src={
                    preview instanceof File
                      ? URL.createObjectURL(preview)
                      : `${process.env.NEXT_PUBLIC_API_URL}/landing/video/${preview}`
                  }
                  controls
                  className="mx-auto max-h-56 w-full rounded"
                />
                <p className="mt-2 text-xs text-gray-500">{file?.name}</p>

                {/* Tombol ganti file */}
                <label className="text-xs text-indigo-600 cursor-pointer">
                  Ganti Video
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files[0])}
                  />
                </label>
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
          <button
            type="button"
            onClick={() => {
              handleVideo(form);
            }}
            className="bg-primary text-white px-4 py-2 rounded"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
