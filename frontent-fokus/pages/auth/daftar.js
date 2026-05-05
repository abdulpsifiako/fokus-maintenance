import Image from "next/image";
import AuthLayout from "../layouts/authLayout";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import Alert from "@/components/public/alert";
import { daftar } from "@/lib/public/auth";
import Link from "next/link";
import Carousel from "@/components/public/caroseul";

function Daftar() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState(null);

  const [eye, setEye] = useState(false);

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let message = "";
    if (name === "email" && !/\S+@\S+\.\S+/.test(value)) {
      message = "Email tidak valid";
    }
    if (name === "password") {
      const hasMinLength = value.length >= 5;
      // const hasUpperCase = /[A-Z]/.test(value);
      // const hasNumber = /[0-9]/.test(value);
      // const hasSymbol = /[^A-Za-z0-9]/.test(value);

      if (!hasMinLength) {
        message = "Password harus minimal 5 karakter";
      }
    }
    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const isFormValid =
    Object.values(errors).every((v) => !v) &&
    Object.values(form).every((v) => v !== "");

  const buatAkun = () => {
    setLoading(true);
    daftar(form)
      .then((response) => {
        setAlert({
          type: "success",
          title: "Akun",
          message: response.message,
        });
      })
      .catch((error) => {
        // //  //  console.log(error)
        const res = error.response.data;
        if (res.status == 400) {
          setAlert({
            type: "info",
            title: "Email",
            message: res.message,
          });
        } else if (res.status == 405) {
          setAlert({
            type: "info",
            title: "Form Input",
            message: "Kesalahan mengisi form pendaftaran",
          });
        } else if (res.status == 500) {
          setAlert({
            type: "error",
            title: "Buat Akun",
            message: error.message,
          });
        } else {
          setAlert({
            type: "error",
            title: "Buat Akun",
            message: error.message,
          });
        }
      })
      .finally(() => {
        setTimeout(() => {
          setAlert(null);
        }, 5000);
        setForm({
          email: "",
          password: "",
        });
        setLoading(false);
      });
  };
  return (
    <>
      <div className="flex flex-row h-screen font-poppins">
        <div className="flex-1 flex flex-col justify-center items-center mx-auto">
          <div className="flex justify-center flex-col items-center mx-auto">
            <Link href="/">
              <Image
                src="/logo.png"
                width={200}
                height={100}
                alt="fokusedu logo"
              />
            </Link>
            <h1 className="font-semibold text-sm text-center">
              Daftar Menggunakan Email
            </h1>
          </div>
          <form className="max-w-lg space-y-4 p-4 w-9/12">
            {/* Email */}
            <div>
              <label className="block font-normal text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`w-full rounded border bg-white focus:outline-none focus:ring-2 text-xs p-3 ${
                  errors.email
                    ? "border-pink-500 focus:ring-pink-500"
                    : "border-gray-300 focus:ring-sky-500"
                }`}
              />
              {errors.email && (
                <p className="text-sm text-pink-600 mt-1">{errors.email}</p>
              )}
            </div>
            {/* Password */}
            <div>
              <label className="block font-normal text-sm mb-1">
                Kata Sandi
              </label>
              <div
                className={`w-full flex items-center rounded border px-1 
                                ${
                                  errors.password
                                    ? "border-pink-500 focus-within:ring-pink-500"
                                    : "border-gray-300 focus-within:ring-sky-500"
                                } focus-within:ring-2`}
              >
                <input
                  type={`${eye ? "text" : "password"}`}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full text-xs p-3 bg-white rounded focus:outline-none border-none`}
                />
                {eye ? (
                  <>
                    <EyeClosed
                      onClick={() => setEye(!eye)}
                      className="cursor-pointer"
                    />
                  </>
                ) : (
                  <>
                    <Eye
                      onClick={() => setEye(!eye)}
                      className="cursor-pointer"
                    />
                  </>
                )}
              </div>
              {errors.password && (
                <p className="text-sm text-pink-600 mt-1">{errors.password}</p>
              )}
            </div>
            <div>
              <Link href="/auth/lupa-password">
                <p className="text-center text-xs my-2 hover:text-blue-500">
                  Lupa kata sandi?
                </p>
              </Link>
              <button
                type="button"
                onClick={buatAkun}
                disabled={!isFormValid}
                className={`px-4 py-3 rounded text-white w-full ${
                  isFormValid
                    ? `bg-primary hover:opacity-70 cursor-pointer ${loading ? "cursor-not-allowed opacity-65" : ""}`
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <div className="flex justify-center items-center space-x-3">
                    <svg
                      aria-hidden="true"
                      className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <h1>Buat Akun</h1>
                  </div>
                ) : (
                  "Buat Akun"
                )}
              </button>
            </div>
          </form>
          <p className="text-center text-xs max-w-md p-4 w-9/12">
            Dengan melanjutkan, Anda menyetujui{" "}
            <Link href="/syarat-ketentuan">
              <span className="text-primary opacity-80">
                Seluruh Syarat & Ketentuan,
              </span>
            </Link>{" "}
            serta{" "}
            <Link href="/kebijakan-privasi">
              <span className="text-primary opacity-80">Kebijakan Privasi</span>
            </Link>{" "}
            fokusedu.id
          </p>
          <p className="text-xs">
            Sudah punya akun?
            <Link href="/auth/login">
              <span className="text-primary opacity-80 hover:text-blue-500">
                {" "}
                Masuk
              </span>
            </Link>
          </p>
        </div>
        <div className="flex-1 hidden lg:flex sm:justify-center items-center m-auto ">
          <div className="p-2">
            <Carousel />
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
    </>
  );
}

Daftar.getLayout = function getLayout(page) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default Daftar;
