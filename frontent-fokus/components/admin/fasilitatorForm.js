import { Paperclip } from "lucide-react";
import PrestasiPengalamanForm from "./prestasiPengalamanForm";
import { useState, useEffect } from "react";
import Image from "next/image";
import Alert from "../public/alert";
import { uploadFile } from "@/lib/axios/landing";
import { createFasilitator, updateFasilitator } from "@/lib/axios/fasilitator";
import Cookies from "js-cookie";

export default function FasilitatorForm({ mode, data, onBack }) {
  const [buttonDisable, setButtonDisable] = useState(false);
  const token = Cookies.get("token");
  const [alert, setAlert] = useState(null);
  const [prestasiList, setPrestasiList] = useState([""]);
  const [photoPriview, setPhotoPriview] = useState(null);
  const [oldPhotoUrl, setOldPhotoUrl] = useState(null);

  const [photoFile, setPhotoFile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    jobdesk: "",
  });

  // 🔹 Isi form kalau mode edit
  useEffect(() => {
    if (mode === "edit" && data) {
      setForm({
        name: data.name || "",
        jobdesk: data.jobdesk || "",
      });
      setPrestasiList(data.properties || [""]);
      if (data?.image) {
        setOldPhotoUrl(
          `${process.env.NEXT_PUBLIC_API_URL}/landing/images/${data.image}`
        );
      }
    }
  }, [mode, data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setButtonDisable(true);
    try {
      if (form.name === "" || form.jobdesk === "") {
        setAlert({
          type: "error",
          title: "Info",
          message: "Nama dan Jobdesk tidak boleh kosong",
        });
        setButtonDisable(false);
        return;
      }

      let imageUrl = data?.image || null;

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

      const payload = { ...form, image: imageUrl, properties: prestasiList };

      let response;
      if (mode === "edit") {
        response = await updateFasilitator(data.id, payload, token);
      } else {
        response = await createFasilitator(payload, token);
      }

      if (response.status === 200 || response.status === 201) {
        setAlert({
          type: "success",
          title: "Info",
          message: response.message || "Data berhasil disimpan",
        });
        setTimeout(() => {
          setAlert(null);
          setButtonDisable(false);
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
      setButtonDisable(false);
      return;
    }
  };
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-primary mb-2">
          {mode === "edit" ? "Edit Fasilitator" : "Tambah Fasilitator"}
        </h2>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onBack}
            className="border-primary border p-1 rounded text-primary"
          >
            Kembali
          </button>
          <button
            type="button"
            disabled={buttonDisable}
            onClick={handleSubmit}
            className="bg-primary text-white p-1 rounded"
          >
            Simpan
          </button>
        </div>
      </div>

      <div className="mb-3 flex flex-col gap-2">
        <label>Nama Fasilitator</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Masukkan Nama Fasilitator"
          className="border max-w-sm border-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-0 focus:border-primary focus:border-2"
        />
      </div>

      <div className="mb-3 flex flex-col gap-2">
        <label>Jobdesk</label>
        <input
          name="jobdesk"
          value={form.jobdesk}
          onChange={handleChange}
          placeholder="Masukkan Jobdesk"
          className="border max-w-sm border-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-0 focus:border-primary focus:border-2"
        />
      </div>

      <div className="mb-3 flex flex-col gap-2 w-sm">
        <label>Unggah Photo</label>
        <div className="flex gap-3 items-center">
          <div className="items-center my-auto">
            <Paperclip />
          </div>
          <label className="border border-gray-400 px-3 py-2.5 rounded text-sm w-full cursor-pointer flex items-center gap-2">
            <span id="fileLabel">
              {/* 🔹 urutan prioritas nama file */}
              {photoFile
                ? photoFile.name // kalau user pilih file baru
                : data?.image // kalau mode edit ada file lama
                  ? "Perbaharui Foto"
                  : "Pilih file (max 5 MB)"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];

                if (file && file.size > 5 * 1024 * 1024) {
                  setAlert({
                    type: "error",
                    title: "Info",
                    message: "Gambar tidak boleh lebih dari 5MB",
                  });
                  e.target.value = "";

                  // 🔹 kalau ada gambar lama (mode edit), tampilkan lagi
                  // if (mode) {
                  //   setPhotoFile(null);
                  //   setPhotoPriview(
                  //     `${process.env.NEXT_PUBLIC_API_URL}/landing/images/${data.image}`
                  //   );
                  // } else {
                  //   // 🔹 kalau mode tambah, kosongkan preview
                  //   setPhotoFile(null);
                  //   setPhotoPriview(null);
                  // }
                } else if (file) {
                  setPhotoFile(file);
                  setPhotoPriview(URL.createObjectURL(file));
                }
              }}
            />
          </label>
        </div>

        {/* 🔹 Preview Gambar */}
        {(photoPriview || oldPhotoUrl) && (
          <div className="mt-2 relative w-full max-w-lg h-64">
            <Image
              src={photoPriview || oldPhotoUrl}
              alt="Preview Banner"
              fill
              className="rounded border object-contain"
              unoptimized
            />
          </div>
        )}
      </div>

      <PrestasiPengalamanForm
        prestasiList={prestasiList}
        setPrestasiList={setPrestasiList}
      />

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
