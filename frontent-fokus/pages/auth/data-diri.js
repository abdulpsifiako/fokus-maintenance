import { useDispatch, useSelector } from "react-redux";
import AuthLayout from "../layouts/authLayout";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import {
  getAvailableUsername,
  getKabKota,
  getProvinsi,
  updateUserProfile,
} from "@/lib/axios/users";
import Alert from "@/components/public/alert";
import { useRouter } from "next/router";
import { updateDetail } from "@/lib/redux/store/userSlice";

const DataDiri = () => {
  const dispatch = useDispatch();
  const [alert, setAlert] = useState(null);
  const [provinsi, setProvinsi] = useState([]);
  const [kabKot, setKabKot] = useState([]);
  const dataDiri = useSelector((state) => state.user.detail);
  const router = useRouter();
  const [cekUserName, setCekUserName] = useState(false);

  const token = Cookies.get("token");
  const [form, setForm] = useState({
    namaLengkap: "",
    username: "",
    tingkatPend: "",
    prov: "",
    kabKota: "",
    noWa: "",
    instag: "",
  });
  useEffect(() => {
    if (!dataDiri) {
      router.push("/auth/login");
    }
  }, [dataDiri, router]);

  useEffect(() => {
    const fetchProvinsi = async () => {
      try {
        const res = await getProvinsi();
        return setProvinsi(res);
      } catch (err) {
        setAlert({
          type: "info",
          title: "Info",
          message: "Error saat mengunduh data Provinsi",
        });
        return;
      }
    };

    fetchProvinsi();
  }, []);

  useEffect(() => {
    if (!form.prov) return;
    const fetchKabKota = async () => {
      try {
        const res = await getKabKota(form.prov);
        return setKabKot(res);
      } catch (err) {
        setAlert({
          type: "info",
          title: "Info",
          message: "Error saat mengunduh data Kabupaten/Kota",
        });
        return;
      }
    };
    fetchKabKota();
  }, [form.prov]);

  if (!dataDiri) return null;

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  const handleCekUserName = async () => {
    try {
      const res = await getAvailableUsername(form.username, token);
      setCekUserName(true);
      setAlert({
        type: "info",
        title: "Info",
        message: res.message,
      });
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
      return;
    }
  };

  // const isFormValid = Object.values(form).every((val) => val.trim() !== "");
  const isFormValid = Object.entries(form)
    .filter(([key]) => key !== "username" && key !== "instag")
    .every(([, val]) => val.trim() !== "");
  const handleSimpan = async () => {
    try {
      const res = await updateUserProfile(form, token);
      setAlert({
        type: "success",
        title: "Update",
        message: res.message,
      });
      dispatch(
        updateDetail({
          username: form.username,
          tingkat_pend: form.tingkatPend,
          name: form.namaLengkap,
          kota_kab: form.kabKota,
          instagram: form.instag,
          no_wa: form.noWa,
          provinsi: form.prov,
        }),
      );
      if (res.status == 200) {
        router.push("/profile");
      } else {
        return;
      }
    } catch (error) {
      const res = error.response.data;

      setAlert({
        type: "info",
        title: "Info",
        message: res.error.map((err) => err.msg).join(", "),
      });
      return;
    }
  };
  return (
    <div className="h-screen w-screen flex justify-center items-center font-poppins">
      <div className="w-full max-w-sm p-6 justify-between flex flex-col max-h-[90vh] overflow-y-scroll">
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-semibold text-primary text-center">
              Lengkapi data diri
            </h1>
            <p className="text-center leading-normal text-xs my-3">
              Terdaftar menggunakan Email <strong>{dataDiri.email}</strong>
            </p>
          </div>

          <form className="space-y-4">
            {/* Nama Lengkap — WAJIB */}
            <label className="block">
              <span className="block text-sm font-medium">
                Nama Lengkap <span className="text-red-500">*</span>
              </span>
              <input
                type="text"
                name="namaLengkap"
                value={form.namaLengkap}
                onChange={handleChangeForm}
                required
                className="p-2 text-sm mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-400 focus:outline-none"
                placeholder="Masukkan nama lengkap"
              />
            </label>

            {/* Username FokusEdu — OPSIONAL */}
            <label className="block">
              <span className="block text-sm font-medium">
                Username FokusEdu
                <span className="text-xs text-gray-400 font-normal ml-1">
                  (opsional)
                </span>
              </span>
              <div className="flex gap-1">
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChangeForm}
                  className="p-2 text-sm block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-400 focus:outline-none"
                  placeholder="Masukkan username"
                />
                <button
                  // disabled={form.username !== "" ? false : true}
                  type="button"
                  onClick={handleCekUserName}
                  className={`p-2 text-xs rounded-sm text-white ${form.username !== "" ? "bg-primary cursor-pointer" : "bg-gray-400 cursor-not-allowed"}`}
                >
                  Cek
                </button>
              </div>
            </label>

            {/* Pendidikan Terakhir — WAJIB */}
            <label className="block">
              <span className="block text-sm font-medium">
                Pendidikan Terakhir <span className="text-red-500">*</span>
              </span>
              <select
                value={form.tingkatPend}
                onChange={handleChangeForm}
                name="tingkatPend"
                className="p-2 text-sm mt-1 block w-full rounded-md border border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-400 focus:outline-none"
              >
                <option value="">Pilih Pendidikan</option>
                <option value="SMA/SMK">SMA/SMK</option>
                <option value="D3">D3</option>
                <option value="S1">S1</option>
                {/* <option value="Profesi">Profesi</option> */}
                <option value="S2">S2</option>
              </select>
            </label>

            {/* Provinsi — WAJIB */}
            <label className="block">
              <span className="block text-sm font-medium">
                Provinsi <span className="text-red-500">*</span>
              </span>
              <select
                value={form.prov}
                onChange={handleChangeForm}
                name="prov"
                className="p-2 text-sm mt-1 block w-full rounded-md border border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-400 focus:outline-none"
              >
                <option value="">Pilih Provinsi</option>
                {provinsi.map((provinsi) => (
                  <option key={provinsi.id} value={provinsi.id}>
                    {provinsi.name}
                  </option>
                ))}
              </select>
            </label>

            {/* Kota/Kabupaten — WAJIB */}
            <label className="block">
              <span className="block text-sm font-medium">
                Kota/Kabupaten <span className="text-red-500">*</span>
              </span>
              <select
                name="kabKota"
                value={form.kabKota}
                onChange={handleChangeForm}
                className="p-2 text-sm mt-1 block w-full rounded-md border border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-400 focus:outline-none"
              >
                <option value="">Pilih Kota</option>
                {kabKot.map((kabKota) => (
                  <option key={kabKota.id} value={kabKota.id}>
                    {kabKota.name}
                  </option>
                ))}
              </select>
            </label>

            {/* Nomor WhatsApp — WAJIB */}
            <label className="block">
              <span className="block text-sm font-medium">
                Nomor WhatsApp <span className="text-red-500">*</span>
              </span>
              <input
                type="text"
                name="noWa"
                value={form.noWa}
                onChange={handleChangeForm}
                inputMode="numeric"
                pattern="[0-9]*"
                required
                className="p-2 text-sm mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-400 focus:outline-none"
                placeholder="08xxxxxxxxxx"
              />
            </label>

            {/* Username Instagram — OPSIONAL */}
            <label className="block">
              <span className="block text-sm font-medium">
                Username Instagram
                <span className="text-xs text-gray-400 font-normal ml-1">
                  (opsional)
                </span>
              </span>
              <input
                type="text"
                name="instag"
                value={form.instag}
                onChange={handleChangeForm}
                className="p-2 text-sm mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-400 focus:outline-none"
                placeholder="@username"
              />
            </label>
            {/* Keterangan wajib diisi */}
            <p className="text-xs text-gray-400">
              <span className="text-red-500">*</span> Wajib diisi
            </p>

            {/* Tombol Submit */}
            <button
              type="button"
              disabled={!isFormValid}
              onClick={handleSimpan}
              className={`w-full text-white hover:opacity-80 p-2 rounded-md hover:cursor-pointer ${isFormValid ? "bg-primary cursor-pointer" : "bg-gray-400 cursor-not-allowed"}`}
            >
              Simpan
            </button>
          </form>
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
};

DataDiri.getLayout = function getLayout(page) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default DataDiri;
