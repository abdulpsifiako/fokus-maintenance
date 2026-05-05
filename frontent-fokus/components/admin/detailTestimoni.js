import { getImageUserData, updateStatusTestimoni } from "@/lib/axios/testimoni";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import Cookies from "js-cookie";
import Alert from "../public/alert";

export function DetailTestimoni({ testimoni, onCancel }) {
  //  //  console.log(testimoni)

  const [alert, setAlert] = useState(null);
  const token = Cookies.get("token");
  const [image, setImage] = useState(false);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await updateStatusTestimoni(
        { id: id, status: status },
        token
      );
      if (res.status == 200) {
        setAlert({
          type: "success",
          title: "Info",
          message: res.message,
        });
        onCancel();
      }
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
  useEffect(() => {
    (async () => {
      const res = await getImageUserData(testimoni.properties.id);
      if (res.status === 200) {
        setImage(res.data);
      } else {
        setImage(false);
      }
    })();
  }, [testimoni.properties.id]);
  return (
    <div className="mt-6 px-4">
      <h2 className="text-lg font-semibold text-primary mb-5 pb-2">
        Detail Approval Testimoni
      </h2>
      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-8">
        <button
          onClick={onCancel}
          className="border border-red-500 text-red-500 px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition"
        >
          Kembali
        </button>
      </div>

      <div className="space-y-4 max-w-md">
        {/* Nama */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Nama Lengkap
          </label>
          <input
            type="text"
            disabled
            className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            value={testimoni.properties.name}
            readOnly
          />
        </div>

        {/* Institusi */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Institusi / Profesi
          </label>
          <input
            type="text"
            disabled
            className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            value={testimoni.properties.institusi}
            readOnly
          />
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Deskripsi Testimoni
          </label>
          <textarea
            className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            rows={4}
            value={testimoni.properties.testimoni}
            readOnly
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Rating Pengguna
          </label>
          <div className="flex">
            {[...Array(5)].map((_, i) =>
              i < testimoni.properties.rating ? (
                <FaStar key={i} className="text-yellow-400" />
              ) : (
                <FaRegStar key={i} className="text-gray-300" />
              )
            )}
          </div>
        </div>

        {/* Banner / Image Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Image Profile
          </label>
          {image ? (
            <div className="relative w-full h-48 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/landing/images/${image}`}
                alt="Banner"
                fill
                className="object-cover object-center"
              />
            </div>
          ) : (
            <div className="relative w-full h-48 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <Image
                src="/9720011.jpg"
                alt="Banner"
                fill
                className="object-cover object-center"
              />
            </div>
          )}
        </div>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => handleUpdateStatus(testimoni.id, true)}
            className="bg-green-500 text-white px-4 py-1 rounded"
          >
            Setujui
          </button>
          <button
            type="button"
            onClick={() => handleUpdateStatus(testimoni.id, false)}
            className="bg-red-600 text-white px-4 py-1 rounded"
          >
            Tolak
          </button>
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
