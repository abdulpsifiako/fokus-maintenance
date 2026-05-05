import { getKelasOnline } from "@/lib/axios/kelasOnline";
import { getProgram } from "@/lib/axios/program";
import { getTryout } from "@/lib/axios/tryout";
import { useCallback, useEffect, useState } from "react";
import Alert from "../public/alert";
import Cookies from "js-cookie";
import { addUserProgram } from "@/lib/public/auth";
import {
  getProgramUtama,
  getProgramUtamaAdmin,
} from "@/lib/axios/programUtama";

export default function TambahUserManagement({ setAddUser, onCancel }) {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const token = Cookies.get("token");
  const [alert, setAlert] = useState(null);
  // ====== STATE DATA MASTER ======
  const [dataProgram, setDataProgram] = useState([]);
  const [dataTryout, setDataTryout] = useState([]);
  const [dataKelas, setDataKelas] = useState([]);
  const [emailOnly, setEmailOnly] = useState(false);

  // ====== STATE FORM ======
  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
    programUtama: [],
    tryout: [],
    kelasOnline: [],
  });

  // ====== PAGINATION (untuk fetch) ======
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy] = useState("created_at|desc");

  // ====== FETCH DATA ======
  const fetchDataProgramUtama = useCallback(async () => {
    try {
      const res = await getProgramUtama(page, 100, "", sortBy, true, "");
      if (res.status === 200) setDataProgram(res.data.data || []);
    } catch (error) {
      //  //  console.log(error);
    }
  }, [page, sortBy]);

  const fetchDataTryout = useCallback(async () => {
    try {
      const res = await getTryout(page, limit, null, sortBy, null, null);
      if (res.status === 200) setDataTryout(res.data.data || []);
    } catch (error) {
      // //  //  console.log(error);
    }
  }, [page, limit, sortBy]);

  const fetchKelasOnline = useCallback(async () => {
    try {
      const res = await getKelasOnline(page, 20, null, null, null);
      if (res.status === 200) setDataKelas(res.data.data || []);
    } catch (error) {
      // //  //  console.log(error);
    }
  }, [page]);

  useEffect(() => {
    fetchDataProgramUtama();
    fetchDataTryout();
    fetchKelasOnline();
  }, [fetchDataProgramUtama, fetchDataTryout, fetchKelasOnline]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (type, id) => {
    setForm((prev) => {
      const current = prev[type] || [];
      const isSelected = current.includes(id);

      return {
        ...prev,
        [type]: isSelected ? current.filter((x) => x !== id) : [...current, id],
      };
    });
  };

  // ====== SUBMIT (contoh) ======
  const handleSubmit = async () => {
    setButtonDisabled(true);
    try {
      // ✅ Validasi sesuai mode
      if (emailOnly) {
        if (form.email.trim() === "") {
          setAlert({
            type: "info",
            title: "Info",
            message: "Email harus diisi",
          });
          setButtonDisabled(false);
          return;
        }
      } else {
        if (
          form.email.trim() === "" ||
          form.password.trim() === "" ||
          form.nama.trim() === ""
        ) {
          setAlert({
            type: "info",
            title: "Info",
            message: "Nama, Email, Password harus diisi",
          });
          setButtonDisabled(false);
          return;
        }
      }

      const res = await addUserProgram({ ...form, emailOnly }, token);
      if (res.status == 200) {
        setAlert({
          type: "success",
          title: "Info",
          message: res.message,
        });
      }
      onCancel();
    } catch (error) {
      const res = error.response.data;
      if (res.status == 404) {
        setAlert({
          type: "info",
          title: "Info",
          message: res.message,
        });
      } else {
        setAlert({
          type: "info",
          title: "Info",
          message: error.message,
        });
      }
      setButtonDisabled(false);
      return;
    }
  };
  const handleProgramToggle = (programId) => {
    setForm((prev) => {
      const exists = prev.programUtama.find((p) => p.program_id === programId);

      if (exists) {
        // remove
        return {
          ...prev,
          programUtama: prev.programUtama.filter(
            (p) => p.program_id !== programId,
          ),
        };
      }

      // add default bulan
      return {
        ...prev,
        programUtama: [
          ...prev.programUtama,
          { program_id: programId, bulan: 1 },
        ],
      };
    });
  };

  const handleBulanChange = (programId, bulan) => {
    setForm((prev) => ({
      ...prev,
      programUtama: prev.programUtama.map((p) =>
        p.program_id === programId ? { ...p, bulan: Number(bulan) } : p,
      ),
    }));
  };
  //  console.log(form);
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-primary">
            Tambah User Management
          </h2>
          <p className="text-sm text-gray-500">
            User Management /{" "}
            <span className="text-primary font-medium">Tambah</span>
          </p>

          {/* ✅ Toggle email only */}
          <label className="flex items-center gap-2 mt-2 cursor-pointer w-fit">
            <input
              type="checkbox"
              checked={emailOnly}
              onChange={(e) => setEmailOnly(e.target.checked)}
              className="w-4 h-4 accent-primary cursor-pointer"
            />
            <span className="text-sm text-gray-600">Hanya input email</span>
          </label>
        </div>

        <div className="space-x-2">
          <button
            onClick={onCancel}
            className="border border-primary text-primary px-4 py-2 rounded-md text-sm hover:bg-primary hover:text-white transition"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={buttonDisabled}
            onClick={handleSubmit}
            className="bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition"
          >
            Simpan
          </button>
        </div>
      </div>

      {/* Form Utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Kolom kiri */}
        <div className="space-y-4">
          {/* Email — selalu tampil */}
          <div>
            <label className="text-sm font-medium">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              name="email"
              type="email"
              placeholder="Masukkan Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-red-200 rounded px-4 py-2 mt-1 text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Nama & Password — hanya tampil jika emailOnly = false */}
          {!emailOnly && (
            <>
              <div>
                <label className="text-sm font-medium">
                  Nama Lengkap
                  <span className="text-xs text-gray-400 font-normal ml-1">
                    (opsional)
                  </span>
                </label>
                <input
                  name="nama"
                  type="text"
                  placeholder="Masukkan Nama Lengkap"
                  value={form.nama}
                  onChange={handleChange}
                  className="w-full border border-red-200 rounded px-4 py-2 mt-1 text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Kata Sandi
                  <span className="text-xs text-gray-400 font-normal ml-1">
                    (opsional)
                  </span>
                </label>
                <input
                  name="password"
                  type="text"
                  placeholder="Masukkan Kata Sandi"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border border-red-200 rounded px-4 py-2 mt-1 text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </>
          )}
        </div>

        {/* Kolom kanan */}
        <div>
          <p className="text-sm font-medium mb-3">Tipe Program</p>

          {/* Program Utama */}
          {/* <div className="mb-5">
            <div className="font-medium text-gray-800 mb-2">Program Utama</div>
            <div className="ml-4 space-y-2">
              {dataProgram?.map((prog) => (
                <div key={prog.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.programUtama.includes(prog.id)}
                    onChange={() =>
                      handleCheckboxChange("programUtama", prog.id)
                    }
                    className="accent-primary"
                  />
                  <label className="text-sm">{prog.properties.name}</label>
                </div>
              ))}
            </div>
          </div> */}
          <div className="mb-5">
            <div className="font-medium text-gray-800 mb-2">Program Utama</div>

            <div className="ml-4 space-y-3">
              {dataProgram?.map((prog) => {
                const selected = form.programUtama.find(
                  (p) => p.program_id === prog.id,
                );

                return (
                  <div key={prog.id} className="flex items-center gap-3">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={!!selected}
                      onChange={() => handleProgramToggle(prog.id)}
                      className="accent-primary"
                    />

                    {/* Label */}
                    <label className="text-sm flex-1">
                      {prog.properties.name}
                    </label>

                    {/* Input Bulan */}
                    {selected && (
                      <input
                        type="number"
                        min={1}
                        placeholder="Bulan"
                        value={selected.bulan}
                        onChange={(e) =>
                          handleBulanChange(prog.id, e.target.value)
                        }
                        className="
                w-20 px-2 py-1 text-sm
                border rounded
                focus:outline-primary
              "
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Try Out */}
          <div className="mb-5">
            <div className="font-medium text-gray-800 mb-2">Try Out</div>
            <div className="ml-4 space-y-2">
              {dataTryout?.map((to) => (
                <div key={to.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.tryout.includes(to.id)}
                    onChange={() => handleCheckboxChange("tryout", to.id)}
                    className="accent-primary"
                  />
                  <label className="text-sm">{to.properties.judul}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Kelas Online */}
          <div>
            <div className="font-medium text-gray-800 mb-2">Kelas Online</div>
            <div className="ml-4 space-y-2">
              {dataKelas?.map((kelas) => (
                <div key={kelas.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.kelasOnline.includes(kelas.id)}
                    onChange={() =>
                      handleCheckboxChange("kelasOnline", kelas.id)
                    }
                    className="accent-primary"
                  />
                  <label className="text-sm">{kelas.properties.judul}</label>
                </div>
              ))}
            </div>
          </div>
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
