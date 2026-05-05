import { useState } from "react";
import { useSelector } from "react-redux";
import RatingStars from "@/components/user/rating";
import { createTestimoni } from "@/lib/axios/testimoni";
import Cookies from "js-cookie";
import Alert from "@/components/public/alert";

export default function TestimoniPage() {
  const [alert, setAlert] = useState(null);
  const detail = useSelector((state) => state.user.detail);
  const token = Cookies.get("token");
  const [form, setform] = useState({
    name: detail && detail.name,
    institusi: "",
    testimoni: "",
    rating: 5,
  });
  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setform({ ...form, [name]: value });
  };
  const handleRatingChange = (value) => {
    setform({ ...form, rating: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createTestimoni({ ...form, id: detail.id }, token);
      if (res.status == 200) {
        setAlert({
          type: "success",
          title: "Info",
          message: res.message,
        });
      }
      setform({
        name: detail && detail.name,
        institusi: "",
        testimoni: "",
        rating: 5,
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
    }
  };
  //  //  console.log(form);
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-blue-100 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full border border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Kirim Testimoni Anda
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama
            </label>
            <input
              type="text"
              name="name"
              disabled
              value={form.name}
              onChange={handleChangeForm}
              className="mt-1 w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all"
              placeholder="Masukkan nama Anda"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Institusi/Tempat Kerja/Kampus/Sekolah
            </label>
            <input
              type="text"
              name="institusi"
              value={form.institusi}
              onChange={handleChangeForm}
              className="mt-1 w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all"
              placeholder="Masukkan nama Anda"
              required
            />
          </div>

          {/* Testimoni */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Testimoni
            </label>
            <textarea
              name="testimoni"
              value={form.testimoni}
              onChange={handleChangeForm}
              className="mt-1 w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all"
              placeholder="Tuliskan testimoni Anda..."
              rows={4}
              required
            />
          </div>

          {/* Rating */}
          <RatingStars rating={form.rating} setRating={handleRatingChange} />

          {/* Tombol */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-primary text-white p-3 rounded-md font-medium hover:opacity-90 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 transition-all shadow-sm hover:shadow-md"
          >
            Kirim Testimoni
          </button>
        </form>
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
