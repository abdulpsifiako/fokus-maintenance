import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import Alert from "../public/alert";
import {
  createJenisProgram,
  updateJenisProgram,
} from "@/lib/axios/jenisProgram";

function JenisProgramForm({ mode, data, onBack }) {
  const [buttonDisable, setButtonDisable] = useState(false);
  const token = Cookies.get("token");
  const [alert, setAlert] = useState(null);
  const [form, setForm] = useState({
    name: "",
  });
  useEffect(() => {
    if (mode === "edit" && data) {
      setForm({
        name: data.name || "",
      });
    }
  }, [mode, data]);
  const handleSubmit = async () => {
    setButtonDisable(true);
    try {
      if (form.name === "") {
        setAlert({
          type: "error",
          title: "Info",
          message: "Jenis tidak boleh kosong",
        });
        setButtonDisable(false);
        return;
      }

      const payload = { ...form };

      let response;
      if (mode === "edit") {
        response = await updateJenisProgram(data.id, payload, token);
      } else {
        response = await createJenisProgram(payload, token);
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
    <div className="p-4 bg-white rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">
          {mode === "edit" ? "Edit Jenis Program" : "Tambah Jenis Program"}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-lg border border-red-700 text-red-700 hover:bg-red-50 transition"
          >
            Kembali
            {alert && (
              <Alert
                type={alert.type}
                title={alert.title}
                message={alert.message}
                onClose={() => setAlert(null)}
              />
            )}
          </button>
          <button
            disabled={buttonDisable}
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white shadow-sm transition"
          >
            Simpan
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-md">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Jenis Program
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          placeholder="Masukkan Jenis Program"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
        />
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

export default JenisProgramForm;
