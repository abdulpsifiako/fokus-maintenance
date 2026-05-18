import { getKabKota, getProvinsi } from "@/lib/axios/users";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import Alert from "@/components/public/alert";
import { updateProfile, uploadFileUser } from "@/lib/axios/profile";
import { updateDetail } from "@/lib/redux/store/userSlice";
import { useRouter } from "next/router";

export default function Profil() {
  const dispatch = useDispatch();
  const [alert, setAlert] = useState(null);
  const token = Cookies.get("token");
  const router = useRouter();
  const detail = useSelector((state) => state.user.detail);
  const [provinsiList, setProvinsiList] = useState([]);
  const [kabKotaList, setKabKotaList] = useState([]);
  const pendidikanOptions = [
    { value: "SMA/SMK", label: "SMA/SMK" },
    { value: "D3", label: "D3" },
    { value: "S1", label: "S1" },
    { value: "S2", label: "S2" },
  ];

  const [form, setForm] = useState({
    email: detail?.email || "",
    name: detail?.name || "",
    username: detail?.username || "",
    tingkat_pend: detail?.tingkat_pend || "",
    provinsi: detail?.provinsi || "",
    kota_kab: detail?.kota_kab || "",
    no_wa: detail?.no_wa || "",
    instagram: detail?.instagram || "",
  });

  const [avatar, setAvatar] = useState(
    detail?.image
      ? `${process.env.NEXT_PUBLIC_API_URL}/landing/images/${detail.image}`
      : "/9720011.jpg",
  );
  const [avatarFile, setAvatarFile] = useState(null);

  // Ambil provinsi saat pertama kali render
  useEffect(() => {
    (async () => {
      try {
        const data = await getProvinsi();
        setProvinsiList(data);
      } catch (err) {
        console.error("Gagal ambil provinsi:", err);
      }
    })();
  }, []);

  // Ambil kabupaten/kota saat provinsi dipilih
  useEffect(() => {
    if (!form.provinsi) return;
    (async () => {
      try {
        const data = await getKabKota(form.provinsi);
        setKabKotaList(data);
      } catch (err) {
        console.error("Gagal ambil kab/kota:", err);
      }
    })();
  }, [form.provinsi]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
      setAvatarFile(file);
    }
  };
  const handleSubmit = async () => {
    try {
      let data;
      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);
        const res = await uploadFileUser(formData, token);
        data = { ...form, image: res.data[0].fileUrl };
      } else {
        data = form;
      }
      const res = await updateProfile(data, token);
      if (res.status == 200) {
        setAlert({
          type: "success",
          title: "Info",
          message: res.message,
        });
      }
      dispatch(updateDetail(data));
      router.push("/");
      return;
    } catch (error) {
      const res = error.response.data;
      if (res.status == 403) {
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
    }
  };
  return (
    <div className="max-w-md mx-auto py-8 px-4 bg-white rounded-lg shadow mt-6">
      <h2 className="text-center text-xl font-bold text-red-700 mb-6">
        Profil
      </h2>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-6 relative">
        <div className="relative w-24 h-24">
          <Image
            width={1000}
            height={1000}
            src={avatar}
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover"
            priority
          />
          <label className="absolute bottom-0 right-0 bg-white border border-gray-600 w-7 h-7 flex items-center justify-center rounded-full cursor-pointer shadow hover:bg-red-700 hover:text-white">
            📷
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </label>
        </div>
        <div className="text-center mt-2">
          <p className="font-semibold text-sm">{form.email}</p>
          <div className="flex gap-2 justify-center">
            <p className="text-gray-500 text-sm">{detail?.tingkat_pend}</p>
            <p className="text-gray-500 text-sm font-bold">-</p>
            <p className="text-gray-500 text-sm">{detail?.referal}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4 text-sm">
        <Input
          label="Nama Lengkap"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
        <Input
          label="Username fokusedu"
          name="username"
          value={form.username}
          onChange={handleChange}
          disabled={false}
        />

        <Select
          label="Tingkat Pendidikan"
          name="tingkat_pend"
          value={form.tingkat_pend}
          onChange={handleChange}
          options={pendidikanOptions}
        />
        <Select
          label="Provinsi"
          name="provinsi"
          value={form.provinsi}
          onChange={handleChange}
          options={provinsiList.map((prov) => ({
            value: prov.id,
            label: prov.name,
          }))}
        />

        <Select
          label="Kabupaten/Kota"
          name="kota_kab"
          value={form.kota_kab}
          onChange={handleChange}
          options={kabKotaList.map((kab) => ({
            value: kab.id,
            label: kab.name,
          }))}
        />

        <Input
          label="Nomor Whatsapp"
          name="no_wa"
          value={form.no_wa}
          onChange={handleChange}
        />
        <Input
          label="Username Instagram"
          name="instagram"
          value={form.instagram}
          onChange={handleChange}
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className="bg-red-700 text-white w-full mt-6 py-2 rounded-md font-semibold text-sm hover:bg-red-800"
      >
        Simpan
      </button>
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

const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  disabled,
}) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      disabled={disabled}
      name={name}
      value={value}
      placeholder={placeholder || `Masukkan ${label.toLowerCase()}`}
      onChange={onChange}
      className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg 
                 focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-0
                 placeholder-gray-400 shadow-sm transition duration-200"
    />
  </div>
);

const Select = ({ label, name, value, onChange, options }) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg 
                 focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-0
                 shadow-sm transition duration-200 bg-white"
    >
      <option value="">Pilih {label}</option>
      {options.map((opt, idx) => (
        <option key={idx} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);
