import AdminLayout from "@/pages/layouts/adminLayout";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getSetting, updateSetting } from "@/lib/axios/dashboard";
import Alert from "@/components/public/alert";

function SettingsPage() {
  const [alert, setAlert] = useState(false);
  const token = Cookies.get("token");
  const [data, setData] = useState(null);

  const fetchSetting = async () => {
    try {
      const res = await getSetting(token);
      setData(res.data);
      if (res.status == 200) {
        setAlert({
          type: "success",
          title: "Info",
          message: res.message,
        });
      }
    } catch (error) {
      // //  //  console.log(error)
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    if (token) {
      fetchSetting();
    }
  }, [token]);
  const updateData = async () => {
    try {
      const res = await updateSetting(data, token);
      if (res.status == 200) {
        setAlert({
          type: "success",
          title: "Info",
          message: res.message,
        });
        fetchSetting();
      }
    } catch (error) {
      // //  //  console.log(error)
    }
  };
  return (
    <div className="p-8">
      {/* Judul */}
      <h1 className="text-xl font-bold text-red-700 ">Settings</h1>

      {/* Tombol */}
      <div className="flex justify-end gap-4 my-3">
        {/* <button className="px-4 py-2 rounded-md border border-red-600 text-red-600 hover:bg-red-50">
          Setel Ulang Settings
        </button> */}
        <button
          type="button"
          onClick={updateData}
          className="px-4 py-2 text-xs rounded-md bg-red-600 text-white hover:bg-red-700"
        >
          Simpan Settings
        </button>
      </div>

      {/* Grid Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
        {/* Kolom Kiri */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nominal Uang Referral
            </label>
            <input
              type="text"
              name="referal"
              onChange={handleChange}
              value={data?.referal}
              className="w-full border border-red-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Akun Instagram
            </label>
            <input
              type="text"
              name="instagram"
              onChange={handleChange}
              value={data?.instagram}
              className="w-full border border-red-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link Instagram
            </label>
            <input
              type="text"
              name="link_instagram"
              onChange={handleChange}
              value={data?.link_instagram}
              className="w-full border border-red-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nomor WhatsApp
            </label>
            <input
              type="text"
              name="no_wa"
              onChange={handleChange}
              value={data?.no_wa}
              className="w-full border border-red-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-red-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Kolom Kanan */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Akun Gmail
            </label>
            <input
              type="text"
              name="gmail"
              onChange={handleChange}
              value={data?.gmail}
              className="w-full border border-red-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link Tiktok
            </label>
            <input
              type="text"
              name="tiktok"
              onChange={handleChange}
              value={data?.tiktok}
              className="w-full border border-red-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link Youtube
            </label>
            <input
              type="text"
              name="youtube"
              onChange={handleChange}
              value={data?.youtube}
              className="w-full border border-red-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-red-500 focus:outline-none"
            />
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

SettingsPage.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default SettingsPage;
