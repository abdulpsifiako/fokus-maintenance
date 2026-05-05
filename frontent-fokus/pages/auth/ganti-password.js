import { useEffect, useState } from "react";
import AuthLayout from "../layouts/authLayout"
import { IoIosArrowBack } from "react-icons/io";
import { sentMailForgotPassword, updatePassword } from "@/lib/public/auth";
import { useRouter } from "next/router";
import Alert from "@/components/public/alert";
import { Eye, EyeClosed } from "lucide-react";

const LupaKataSandi = () => {
  const [alert, setAlert] = useState(null)
  const router = useRouter()
  const{token, otp, email} = router.query
  const [form, setForm] = useState({
    password:"",
    confirmPassword:""
  })
  const [eye, setEye] = useState(false)
  const [eye2, setEye2] = useState(false)

  const [errors, setErrors] = useState({});

  const validateField = (name, value,fields) => {
      let message = "";
      if (name === "email" && !/\S+@\S+\.\S+/.test(value)) {
      message = "Email tidak valid";
      }
      if (name === "password") {
          const hasMinLength = value.length >= 8;
          const hasUpperCase = /[A-Z]/.test(value);
          const hasNumber = /[0-9]/.test(value);
          const hasSymbol = /[^A-Za-z0-9]/.test(value);

          if (!hasMinLength || !hasUpperCase || !hasNumber || !hasSymbol) {
          message =
              "Password harus minimal 8 karakter, mengandung huruf kapital, angka, dan simbol";
          } 
      }
      if (name === "confirmPassword") {
          const hasMinLength = value.length >= 8;
          const hasUpperCase = /[A-Z]/.test(value);
          const hasNumber = /[0-9]/.test(value);
          const hasSymbol = /[^A-Za-z0-9]/.test(value);

          if (!hasMinLength || !hasUpperCase || !hasNumber || !hasSymbol) {
          message =
              "Password harus minimal 8 karakter, mengandung huruf kapital, angka, dan simbol";
          }else if (value !== fields.password) {
            message = "Konfirmasi password tidak sama dengan password";
          }
      }

      setErrors((prev) => ({ ...prev, [name]: message }));
  };
  const handleChangeForm =(e)=>{
    const {name, value} = e.target
    const updatedForm = ({ ...form, [name]: value });
    setForm(updatedForm);
    validateField(name, value, updatedForm);
  }


  const isFormValid = Object.values(errors).every((v) => !v) && Object.values(form).every((v) => v !== "");

  const handleSubmitForm =async()=>{
    try {
      const res = await updatePassword({...form, token:token})
      setAlert({
        type: "success",
        title: "Info",
        message: res.message,
      })
      if(res.status== 200){
        setTimeout(() => {
          router.push({
          pathname: '/auth/login',
        })
        }, 4000);
      }else{
        return
      }
    } catch (error) {
      const res = error.response.data
      if(res.status==404){
        setAlert({
          type: "info",
              title: "Info",
              message: res.message,
        })
      }else{
        setAlert({
          type: "info",
          title: "Info",
          message: res.message,
        })
      }
      return
    }
  }
  useEffect(() => {
      if (!router.isReady) return;
      if (!token || !email ||!otp) {
        router.replace("/auth/lupa-password");
      }
    }, [router.isReady, token, email, otp, router]);
  
    if (!router.isReady || !token || !email ||!otp) {
      return <p className="text-center w-full">Memuat...</p>;
    }
  return (
    <div className="h-screen w-screen flex justify-center items-center font-poppins">
      <div className="w-full max-w-sm p-6 justify-between flex flex-col min-h-8/12">
        <div className="space-y-4">
            <div>
                <h1 className=" text-2xl font-semibold text-primary ">Ganti Kata Sandi</h1>
                <p className="text-justify leading-normal text-sm">Masukkan kata sandi baru anda dan lakukan konfirmasi untuk mengatur ulang kata sandi</p>
            </div>
            <form className="max-w-sm mx-auto ">
                <label className="block">
                    <span className="block text-sm font-medium">Password</span>
                    <div className={`w-full flex items-center rounded border px-1 
                      ${errors.password ? 
                          "border-pink-500 focus-within:ring-pink-500" : 
                          "border-gray-300 focus-within:ring-sky-500"
                      } focus-within:ring-2`}>
                      
                      <input
                          type={`${eye ? "text":"password"}`}
                          name="password"
                          value={form.password}
                          onChange={handleChangeForm}
                          className={`w-full text-xs p-3 bg-white rounded focus:outline-none border-none`}
                      />
                      {eye ? 
                      (<>
                          <EyeClosed onClick={()=>setEye(!eye)} className="cursor-pointer"/>
                      </>)
                      :
                      (<>
                          <Eye onClick={()=>setEye(!eye)} className="cursor-pointer"/>
                      </>)}
                  </div>
                  {errors.password && (
                  <p className="text-sm text-pink-600 mt-1">{errors.password}</p>
                  )}
                </label>
                <label className="block mt-2">
                    <span className="block text-sm font-medium">Konfirmasi Password</span>
                    <div className={`w-full flex items-center rounded border px-1 
                        ${errors.confirmPassword ? 
                            "border-pink-500 focus-within:ring-pink-500" : 
                            "border-gray-300 focus-within:ring-sky-500"
                        } focus-within:ring-2`}>
                        
                        <input
                            type={`${eye2 ? "text":"password"}`}
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChangeForm}
                            className={`w-full text-xs p-3 bg-white rounded focus:outline-none border-none`}
                        />
                        {eye2 ? 
                        (<>
                            <EyeClosed onClick={()=>setEye2(!eye2)} className="cursor-pointer"/>
                        </>)
                        :
                        (<>
                            <Eye onClick={()=>setEye2(!eye2)} className="cursor-pointer"/>
                        </>)}
                    </div>
                    {errors.confirmPassword && (
                    <p className="text-sm text-pink-600 mt-1">{errors.confirmPassword}</p>
                    )}
                </label>
            </form>
        </div>
        <button type="button" onClick={handleSubmitForm} className="w-full mt-4 bg-primary text-white hover:opacity-80 p-2 rounded-md hover:cursor-pointer">Kirim Email</button>
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

LupaKataSandi.getLayout = function getLayout(page) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default LupaKataSandi;
