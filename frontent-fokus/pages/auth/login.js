import Image from "next/image";
import AuthLayout from "../layouts/authLayout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Eye, EyeClosed } from "lucide-react";
import { konfirmasiEmail, login } from "@/lib/public/auth";
import Alert from "@/components/public/alert";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { detailUser } from "@/lib/redux/store/userSlice";
import { getDetail } from "@/lib/axios/users";
import Carousel from "@/components/public/caroseul";

function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
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
    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // validateField(name, value); // validasi langsung saat mengetik
  };

  const isFormValid =
    Object.values(errors).every((v) => !v) &&
    Object.values(form).every((v) => v !== "");

  useEffect(() => {
    if (!router.isReady) return;

    const { email, token } = router.query;
    if (email && token)
      konfirmasiEmail({
        email: email,
        token: token,
      })
        .then((response) => {
          setAlert({
            type: "success",
            title: "Akun",
            message: response.message,
          });
        })
        .catch((error) => {
          const res = error.response.data;
          if (res.status == 404) {
            setAlert({
              type: "info",
              title: "Info aktifasi",
              message: res.message,
            });
          } else if (res.status == 500) {
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
        });
    if (email) {
      setForm((prev) => ({ ...prev, email }));
    }
  }, [router.isReady, router.query]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await login(form);
      Cookies.set("token", res.data[0].token, { expires: 0.5, path: "/" });
      Cookies.set("role", res.data[0].role, { expires: 0.5, path: "/" });

      // Fetch user detail setelah login
      const userDetail = await getDetail(res.data[0].token);
      dispatch(detailUser(userDetail)); // simpan ke Redux

      setAlert({
        type: "success",
        title: "Akun",
        message: res.message,
      });

      const role = res.data[0].role;
      const user = res.data[0];
      if (role === "users") {
        const keysToCheck = [
          "kota_kab",
          "name",
          "no_wa",
          "pin",
          "username",
          "tingkat_pend",
          "provisi",
        ];
        const hasNullValues = keysToCheck.some((key) => user[key] === null);
        if (hasNullValues) {
          router.push("/auth/data-diri");
        } else {
          router.push("/");
        }
      } else if (role === "admin") {
        router.push("/srv/fkd/admin/dashboard");
      } else {
        setAlert({
          type: "error",
          title: "Error",
          message: "Tidak ada halaman yang dituju",
        });
      }
    } catch (error) {
      const res = error.response?.data;
      if (res?.status === 401) {
        setAlert({
          type: "info",
          title: "",
          message: res.message,
        });
      } else if (res?.status === 404) {
        setAlert({
          type: "info",
          title: "Info",
          message: res.message,
        });
      } else {
        setAlert({
          type: "error",
          title: "",
          message: error.message,
        });
      }
    } finally {
      setTimeout(() => {
        setAlert(null);
      }, 5000);
      setForm({ email: "", password: "" });
      setLoading(false);
    }
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
                height={1000}
                alt="fokusedu logo"
              />
            </Link>
            <h1 className="font-semibold text-sm text-center">
              Masuk Menggunakan Email
            </h1>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="max-w-lg space-y-4 p-4 w-9/12"
          >
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
                type="submit"
                className={`px-4 py-3 rounded text-white w-full cursor-pointer ${loading ? "cursor-not-allowed opacity-65" : ""}
                                    bg-primary`}
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
                    <h1>Loading</h1>
                  </div>
                ) : (
                  "Masuk"
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
            Belum punya akun?
            <Link href="/auth/daftar">
              <span className="text-primary opacity-80 hover:text-blue-500">
                {" "}
                Daftar
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

Login.getLayout = function getLayout(page) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default Login;
