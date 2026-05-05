import { useCallback, useEffect, useState } from "react";
import { Calendar, Clock, Paperclip, Trash2, Edit, X, Eye } from "lucide-react";
import { getListJenisProgram } from "@/lib/axios/jenisProgram";
import { uploadFile } from "@/lib/axios/landing";
import Cookies from "js-cookie";
import Alert from "../public/alert";
import { createKelasOnline, updateKelasOnline } from "@/lib/axios/kelasOnline";
import Image from "next/image";
import { getListJenisKelas } from "@/lib/axios/jenisKelas";

export default function TambahKelasOnline({ mode, setMode, data, onCancel }) {
  const token = Cookies.get("token");
  const [alert, setAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tentangList, setTentangList] = useState(
    data?.properties.tentang_paket || []
  );
  const [tentangInput, setTentangInput] = useState("");
  const [pengajarList, setPengajarList] = useState(
    data?.properties.pengajar || []
  );
  const [pengajar, setPengajar] = useState({
    nama: "",
    jobdesk: "",
    gambar: "",
  });

  const [form, setForm] = useState({
    judul: data?.properties.judul || "",
    deskripsi: data?.properties.deskripsi || "",
    program_utama: data?.properties.program_utama || "",
    harga: data?.properties.harga || "",
    diskon: data?.properties.diskon || false,
    valueDiskon: data?.properties.valueDiskon || "",
    status: data?.properties.status || false,
    tanggalMulai: data?.properties.tanggalMulai || "",
    tanggalBerakhir: data?.properties.tanggalBerakhir || "",
    durasi: data?.properties.durasi || "",
    gambar: data?.properties.gambar || "",
    total_video: data?.properties.total_video || "",
    total_materi: data?.properties.total_materi || "",
    link_group: data?.properties.link_group || "",
    tentang_paket: data?.properties.tentang_paket || [],
    pengajar: data?.properties.pengajar || [],
    jadwal: data?.properties.jadwal || [],
  });

  const [previewGambar, setPreviewGambar] = useState(
    data?.properties.gambar || null
  );
  const [previewPengajar, setPreviewPengajar] = useState(null);

  const handleFileGambar = (e) => {
    setForm((prev) => ({ ...prev, gambar: e.target.files[0] }));
  };

  // Tambah Tentang Paket
  const handleAddTentang = () => {
    if (!tentangInput.trim()) return;
    const updated = [...tentangList, tentangInput];
    setTentangList(updated);
    setForm((prev) => ({ ...prev, tentang_paket: updated }));
    setTentangInput("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, gambar: file });
      setPreviewGambar(URL.createObjectURL(file));
    }
  };

  const handlePengajarFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPengajar({ ...pengajar, gambar: file });
      // setPreviewPengajar(URL.createObjectURL(file));
    }
  };
  // Tambah Jadwal (dari modal)
  const handleAddJadwal = (jadwalBaru) => {
    setForm((prev) => ({
      ...prev,
      jadwal: [...prev.jadwal, jadwalBaru],
    }));
  };

  const handleAddPengajar = () => {
    if (!pengajar.nama || !pengajar.jobdesk) return;

    const updated = [...pengajarList, pengajar];
    setPengajarList(updated);

    // ✅ Sinkronkan dengan form
    setForm((prev) => ({ ...prev, pengajar: updated }));

    setPengajar({ nama: "", jobdesk: "", gambar: null });
    setPreviewPengajar(null);
  };

  const handleDeletePengajar = (index) => {
    const newList = pengajarList.filter((_, i) => i !== index);
    setPengajarList(newList);
    setForm((prev) => ({ ...prev, pengajar: newList }));
  };

  // ✅ Update form umum
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    if (form.diskon === false) {
      setForm((prev) => ({ ...prev, valueDiskon: "" }));
    }
  }, [form.diskon]);

  const [editIndex, setEditIndex] = useState(null);
  const [viewData, setViewData] = useState(null);

  const handleDeleteJadwal = (index) => {
    const updated = form.jadwal.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, jadwal: updated }));
  };

  const handleEditJadwal = (index) => {
    setEditIndex(index);
    setShowModal(true);
  };

  const handleViewJadwal = (data) => {
    setViewData(data);
  };
  const handleDeleteTentang = (index) => {
    const updated = tentangList.filter((_, i) => i !== index);
    setTentangList(updated);
    setForm((prev) => ({ ...prev, tentang_paket: updated }));
  };

  const [jenis, setJenisProgram] = useState([]);

  const fetchJenisProgram = useCallback(async () => {
    try {
      const response = await getListJenisKelas();
      const data = response.data.filter((item) => {
        return item.is_active == true;
      });
      setJenisProgram(data);
    } catch (error) {}
  }, []);

  useEffect(() => {
    fetchJenisProgram();
  }, [fetchJenisProgram]);

  const handleSubmitData = async () => {
    try {
      if (
        form.judul === "" ||
        form.deskripsi === "" ||
        form.program_utama === "" ||
        form.harga === "" ||
        form.tanggalMulai === "" ||
        form.tanggalBerakhir === "" ||
        form.durasi === "" ||
        form.gambar === "" ||
        form.total_video === "" ||
        form.total_materi === "" ||
        form.link_group === "" ||
        form.tentang_paket.length === 0 ||
        form.pengajar.length === 0 ||
        form.jadwal.length === 0
      ) {
        setAlert({
          type: "error",
          title: "Info",
          message: "Form tidak boleh kosong",
        });
        return;
      }
      let gambarUrl = form.gambar;
      if (form.gambar instanceof File) {
        const formData = new FormData();
        formData.append("file", form.gambar);
        const result = await uploadFile(formData, token);
        gambarUrl = result.data[0].fileUrl;
      }

      // 2️⃣ Upload gambar pengajar satu per satu
      const pengajarWithUrls = await Promise.all(
        form.pengajar.map(async (p) => {
          if (p.gambar instanceof File) {
            const formData = new FormData();
            formData.append("file", p.gambar);
            const result = await uploadFile(formData, token);
            return { ...p, gambar: result.data[0].fileUrl };
          }
          return p; // kalau sudah URL, langsung pakai
        })
      );

      // 3️⃣ Buat payload final
      const payload = {
        ...form,
        gambar: gambarUrl,
        pengajar: pengajarWithUrls,
      };

      let response;
      if (mode === "edit") {
        response = await updateKelasOnline(data.id, payload, token);
      } else {
        response = await createKelasOnline(payload, token);
      }

      if (response.status === 200 || response.status === 201) {
        setAlert({
          type: "success",
          title: "Info",
          message: response.message || "Data berhasil disimpan",
        });
        setTimeout(() => {
          setAlert(null);
          setMode("table");
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
  //  //  console.log(form);
  return (
    <div className="p-6 bg-gray-50 rounded-3xl shadow-sm mb-14">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 border-b border-gray-200 pb-5">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            {mode == "edit" ? "Edit" : "Tambah"} Kelas Online
          </h2>
          <p className="text-sm text-gray-500">
            Kelola detail kelas online dan jadwal pelatihan.
          </p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <button
            type="button"
            onClick={() => onCancel()}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmitData}
            className="px-4 py-2 bg-rose-500 text-white rounded-xl shadow hover:bg-rose-600 transition-all"
          >
            Simpan
          </button>
        </div>
      </div>

      {/* Grid Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Kiri */}
        <div className="space-y-5">
          <Input
            label="Judul"
            name="judul"
            placeholder="Masukkan Judul"
            value={form.judul}
            onChange={handleChange}
          />
          <Input
            label="Deskripsi"
            name="deskripsi"
            placeholder="Masukkan Deskripsi"
            value={form.deskripsi}
            onChange={handleChange}
          />
          <Select
            label="Program Utama"
            name="program_utama"
            options={
              jenis?.map((item) => ({
                label: item.name,
                value: item.name,
              })) || []
            }
            value={form.program_utama}
            onChange={handleChange}
          />

          <Input
            label="Harga"
            name="harga"
            placeholder="Masukkan Harga"
            value={form.harga}
            onChange={handleChange}
          />

          {/* Toggle Diskon */}
          <Toggle
            label="Diskon"
            value={form.diskon}
            onChange={(val) => setForm({ ...form, diskon: val })}
          />
          {form.diskon && (
            <Input
              label="Nominal Diskon (%)"
              name="valueDiskon"
              type="number"
              placeholder="Masukkan nominal diskon"
              value={form.valueDiskon}
              onChange={handleChange}
            />
          )}

          {/* Toggle Status */}
          <Toggle
            label="Status Aktif"
            value={form.status}
            onChange={(val) => setForm({ ...form, status: val })}
          />
        </div>

        {/* Kanan */}
        <div className="space-y-5">
          <Input
            label="Tanggal Mulai"
            name="tanggalMulai"
            type="date"
            value={form.tanggalMulai}
            onChange={handleChange}
          />
          <Input
            label="Tanggal Mulai"
            name="tanggalBerakhir"
            type="date"
            value={form.tanggalBerakhir}
            onChange={handleChange}
          />
          <Select
            label="Durasi Rekaman"
            name="durasi"
            options={["30 Menit", "60 Menit", "90 Menit"]}
            value={form.durasi}
            onChange={handleChange}
          />
          <FileInput label="Gambar Kelas" onChange={handleFileChange} />
          {form.gambar && (
            <div className="mt-4 flex justify-center">
              <Image
                width={300}
                height={400}
                src={
                  form.gambar instanceof File
                    ? URL.createObjectURL(form.gambar)
                    : `${process.env.NEXT_PUBLIC_API_URL}/landing/images/${form.gambar}`
                }
                alt="Preview Gambar Paket"
                className="w-40 h-40 object-cover rounded-xl border shadow-md"
              />
            </div>
          )}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Materi Kelas Online
            </h3>
            <Input
              label="Total Video"
              name="total_video"
              placeholder="Masukkan jumlah video"
              value={form.total_video}
              onChange={handleChange}
            />
            <Input
              label="Total Materi"
              name="total_materi"
              placeholder="Masukkan jumlah materi"
              value={form.total_materi}
              onChange={handleChange}
            />
            <Input
              label="Link Group"
              name="link_group"
              placeholder="Masukkan Link Group"
              value={form.link_group}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Tentang Paket */}
      <Section
        title="Tentang Paket"
        button="Tambah Tentang"
        onAdd={handleAddTentang}
      >
        <input
          type="text"
          placeholder="Masukkan fasilitas Try Out"
          value={tentangInput}
          onChange={(e) => setTentangInput(e.target.value)}
          className="w-full border border-gray-200 bg-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-400 transition"
        />
        <div className="space-y-2 mt-3">
          {tentangList.length > 0 ? (
            tentangList.map((t, i) => (
              <ListCard
                key={i}
                title={t}
                onDelete={() => handleDeleteTentang(i)}
              />
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">Belum ada data</p>
          )}
        </div>
      </Section>

      <Section
        title="Pengajar"
        button="Tambah Pengajar"
        onAdd={handleAddPengajar}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Nama Pengajar"
            placeholder="Masukkan Nama"
            value={pengajar.nama}
            onChange={(e) => setPengajar({ ...pengajar, nama: e.target.value })}
          />
          <Input
            label="Jobdesk"
            placeholder="Masukkan Jobdesk"
            value={pengajar.jobdesk}
            onChange={(e) =>
              setPengajar({ ...pengajar, jobdesk: e.target.value })
            }
          />
          <FileInput label="Foto Pengajar" onChange={handlePengajarFile} />
        </div>

        {previewPengajar && (
          <div className="mt-4 flex justify-center">
            <Image
              width={300}
              height={400}
              src={previewPengajar}
              alt="Preview Foto Pengajar"
              className="w-32 h-32 object-cover rounded-full border shadow-sm"
            />
          </div>
        )}

        {/* Table Pengajar */}
        <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200">
          {pengajarList.length > 0 ? (
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    No
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Nama
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Jobdesk
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Foto
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {pengajarList.map((p, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50 transition">
                    <td className="px-4 py-2 text-sm text-gray-600">{i + 1}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {p.nama}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {p.jobdesk}
                    </td>
                    <td className="px-4 py-2">
                      {p.gambar ? (
                        <Image
                          width={300}
                          height={400}
                          src={
                            p.gambar instanceof File
                              ? URL.createObjectURL(p.gambar)
                              : `${process.env.NEXT_PUBLIC_API_URL}/landing/images/${p.gambar}`
                          }
                          alt={p.nama}
                          className="w-12 h-12 object-cover rounded-full border"
                        />
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          Belum ada
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleDeletePengajar(i)}
                        className="text-red-500 hover:text-red-600 text-sm font-medium"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-4 text-sm text-gray-500 italic text-center">
              Belum ada data pengajar
            </p>
          )}
        </div>
      </Section>

      {/* Jadwal */}
      <Section
        title="Jadwal Kelas Online"
        button="Tambah Jadwal"
        onAdd={() => setShowModal(true)}
      >
        {form.jadwal.length === 0 ? (
          <p className="text-sm text-gray-500 italic p-3">Belum ada data</p>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white shadow-sm">
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-3 text-left">No</th>
                  <th className="p-3 text-left">Materi</th>
                  <th className="p-3 text-center">Tanggal</th>
                  <th className="p-3 text-center">Mulai</th>
                  <th className="p-3 text-center">Selesai</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {form.jadwal.map((j, i) => (
                  <tr
                    key={i}
                    className="border-t border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="p-3">{i + 1}</td>
                    <td className="p-3">{j.materi}</td>
                    <td className="p-3 text-center">{j.tanggal}</td>
                    <td className="p-3 text-center">{j.mulai}</td>
                    <td className="p-3 text-center">{j.selesai}</td>
                    <td className="p-3 flex justify-center gap-2">
                      <ActionButton
                        color="gray"
                        onClick={() => handleViewJadwal(j)}
                      >
                        <Eye className="w-4 h-4" />
                      </ActionButton>
                      <ActionButton
                        color="blue"
                        onClick={() => handleEditJadwal(i)}
                      >
                        <Edit className="w-4 h-4" />
                      </ActionButton>
                      <ActionButton
                        color="red"
                        onClick={() => handleDeleteJadwal(i)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </ActionButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {showModal && (
        <ModalJadwal
          onClose={() => {
            setShowModal(false);
            setEditIndex(null);
          }}
          onSave={(data) => {
            if (editIndex !== null) {
              const updated = [...form.jadwal];
              updated[editIndex] = data;
              setForm((prev) => ({ ...prev, jadwal: updated }));
              setEditIndex(null);
            } else {
              handleAddJadwal(data);
            }
            setShowModal(false);
          }}
          initialData={editIndex !== null ? form.jadwal[editIndex] : null}
        />
      )}

      {viewData && (
        <ModalViewJadwal data={viewData} onClose={() => setViewData(null)} />
      )}
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

/* === Komponen Reusable === */
const Section = ({ title, button, onAdd, children }) => (
  <div className="mt-10 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <button
        onClick={onAdd}
        className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition"
      >
        {button}
      </button>
    </div>
    {children}
  </div>
);

const ListCard = ({ title, subtitle, onDelete }) => (
  <div className="flex justify-between items-center bg-gray-50 border border-gray-200 px-4 py-3 rounded-lg">
    <div>
      <p className="font-medium text-gray-800">{title}</p>
      {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
    </div>
    {onDelete && (
      <button
        onClick={onDelete}
        className="text-rose-500 hover:text-rose-600 transition flex items-center gap-1"
      >
        <Trash2 className="w-4 h-4" />
        <span className="text-sm font-medium">Hapus</span>
      </button>
    )}
  </div>
);

const ActionButton = ({ children, color, onClick }) => {
  const colors = {
    red: "bg-rose-500 hover:bg-rose-600",
    blue: "bg-sky-500 hover:bg-sky-600",
    gray: "bg-gray-500 hover:bg-gray-600",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${colors[color]} text-white p-2 rounded-lg transition`}
    >
      {children}
    </button>
  );
};

function Input({ label, placeholder, name, type = "text", ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        {...props}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-rose-400 focus:outline-none transition"
      />
    </div>
  );
}

function Select({ label, name, options = [], value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-rose-400 focus:outline-none transition"
      >
        <option value="">Pilih</option>
        {options.map((opt, i) =>
          typeof opt === "string" ? (
            <option key={i} value={opt}>
              {opt}
            </option>
          ) : (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          )
        )}
      </select>
    </div>
  );
}

function FileInput({ label, note, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-2 bg-white">
        <Paperclip className="w-4 h-4 text-gray-500" />
        <input
          type="file"
          onChange={onChange}
          className="w-full text-sm text-gray-600"
        />
      </div>
      {note && <p className="text-xs text-gray-500 mt-1">{note}</p>}
    </div>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <div
        onClick={() => onChange(!value)}
        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition ${value ? "bg-rose-500" : "bg-gray-300"}`}
      >
        <div
          className={`bg-white w-5 h-5 rounded-full shadow transform duration-300 ${value ? "translate-x-6" : ""}`}
        />
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  );
}

function ModalViewJadwal({ data, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-[95%] md:w-[500px] relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Detail Jadwal Kelas
        </h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <strong>Materi:</strong> {data.materi}
          </p>
          <p>
            <strong>Tanggal:</strong> {data.tanggal}
          </p>
          <p>
            <strong>Waktu:</strong> {data.mulai} - {data.selesai}
          </p>
          <p>
            <strong>Modul:</strong> {data.modul}
          </p>
          <p>
            <strong>Link Modul:</strong> {data.link_modul}
          </p>
          <p>
            <strong>Password Modul:</strong> {data.password_modul}
          </p>
          <p>
            <strong>Link Video:</strong> {data.link_video}
          </p>
          <p>
            <strong>Link Record:</strong> {data.link_record}
          </p>
        </div>
        <div className="flex justify-end mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalJadwal({ onClose, onSave, initialData }) {
  const [jadwal, setJadwal] = useState(
    initialData || {
      materi: "",
      tanggal: "",
      mulai: "",
      selesai: "",
      modul: "",
      link_modul: "",
      password_modul: "",
      link_video: "",
      link_record: "",
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJadwal((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!jadwal.materi || !jadwal.tanggal) return;
    onSave(jadwal);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-[95%] md:w-[500px] relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Tambah Jadwal Kelas Online
        </h3>
        <div className="space-y-3 max-h-[70vh] overflow-y-auto">
          <Input
            label="Materi"
            name="materi"
            placeholder="Masukkan Materi"
            value={jadwal.materi}
            onChange={handleChange}
          />
          <Input
            label="Tanggal"
            name="tanggal"
            type="date"
            value={jadwal.tanggal}
            onChange={handleChange}
          />
          <Input
            label="Waktu Mulai"
            name="mulai"
            type="time"
            value={jadwal.mulai}
            onChange={handleChange}
          />
          <Input
            label="Waktu Selesai"
            name="selesai"
            type="time"
            value={jadwal.selesai}
            onChange={handleChange}
          />
          <Input
            label="Modul"
            name="modul"
            placeholder="Masukkan Modul"
            value={jadwal.modul}
            onChange={handleChange}
          />
          <Input
            label="Link Modul"
            name="link_modul"
            placeholder="Masukkan Link"
            value={jadwal.link_modul}
            onChange={handleChange}
          />
          <Input
            label="Password Modul"
            name="password_modul"
            placeholder="Masukkan Password"
            value={jadwal.password_modul}
            onChange={handleChange}
          />
          <Input
            label="Link Video"
            name="link_video"
            placeholder="Masukkan Link Video"
            value={jadwal.link_video}
            onChange={handleChange}
          />
          <Input
            label="Link Record"
            name="link_record"
            placeholder="Masukkan Link Record"
            value={jadwal.link_record}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
