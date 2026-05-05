import { useRouter } from "next/router";
import Cookies from "js-cookie";

export default function NotFound404() {
  const router = useRouter();
  const role = Cookies.get("role");
  const prevUrl = Cookies.get("prevUrl");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 px-4">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-xl mb-2">Halaman tidak ditemukan</p>
      <button
        onClick={() => {
          role === "admin" ? router.push(prevUrl) : router.push("/");
        }}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Kembali ke halaman sebelumnya
      </button>
    </div>
  );
}

NotFound404.getLayout = function getLayout(page) {
  return page; // tidak pakai layout apapun
};
