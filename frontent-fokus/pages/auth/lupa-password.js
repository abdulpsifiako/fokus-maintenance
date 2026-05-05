import { useState } from "react";
import AuthLayout from "../layouts/authLayout"
import { IoIosArrowBack } from "react-icons/io";
import { sentMailForgotPassword } from "@/lib/public/auth";
import { useRouter } from "next/router";
import Alert from "@/components/public/alert";

const LupaKataSandi = () => {
  const [alert, setAlert] = useState(null)
  const router = useRouter()
  const [form, setForm] = useState({
    email:""
  })

  const handleChangeForm =(e)=>{
    const {name, value} = e.target
    setForm({...form, [name]:value})
  }
  const handleSubmitForm =async()=>{
    if(!form.email){
      setAlert({
        type: "info",
        title: "Info",
        message: "Email wajib diisi",
      })
      return
    }
    try {
      const res = await sentMailForgotPassword(form)
      setAlert({
        type: "success",
        title: "Update",
        message: res.message,
      })
      if(res.status== 200){
        setTimeout(() => {
          router.push({
          pathname: '/auth/otp',
          query: {
            token: res.data[0].token,
            email: res.data[0].email
          }
        })
        }, 3000);
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
  return (
    <div className="h-screen w-screen flex justify-center items-center font-poppins">
      <div className="w-full max-w-sm p-6 justify-between flex flex-col min-h-8/12">
        <div className="space-y-4">
            {/* <header className="flex flex-row items-center space-x-2">
                <IoIosArrowBack size={20} />
                <h1 className="">Kembali</h1>
            </header> */}
            <div>
                <h1 className=" text-2xl font-semibold text-primary ">Lupa Kata Sandi</h1>
                <p className="text-justify leading-normal text-sm">Masukkan email yang terdaftar, lalu ikuti petunjuk untuk mengatur ulang password baru melalui email yang dikirimkan.</p>
            </div>
            <form className="max-w-sm mx-auto ">
                <label className="block">
                    <span className="block text-sm font-medium">Email</span>
                    <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChangeForm}
                    required
                    className="peer p-2 text-sm mt-1 block w-full rounded-md border border-gray-300 shadow-sm 
                            focus:border-blue-500 focus:ring focus:ring-blue-400 focus:outline-none focus:ring-opacity-50
                            invalid:border-primary invalid:text-primary"
                    placeholder="you@example.com"
                    />

                    <p className="mt-1 text-xs text-primary invisible peer-invalid:visible">
                    Harap masukan alamat email yang valid
                    </p>
                </label>
            </form>
        </div>
        <button type="button" onClick={handleSubmitForm} className="w-full bg-primary text-white hover:opacity-80 p-2 rounded-md hover:cursor-pointer">Kirim Email</button>
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
