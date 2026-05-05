import { useEffect, useState } from "react";
import AuthLayout from "../layouts/authLayout";
import OtpInput from "@/components/user/otp";
import { cekOTP, updatePIN } from "@/lib/axios/users";
import { useRouter } from "next/router";
import Cookies from 'js-cookie'
import Alert from "@/components/public/alert";
import { useSelector } from "react-redux";
import { IoIosArrowBack } from "react-icons/io";
import { sentMailForgotPassword } from "@/lib/public/auth";

const Otp = () => {
  const [alert, setAlert] = useState(null);
  const router = useRouter();
  const { token, email } = router.query;
  
  const [otpCode, setOtpCode] = useState("");
  const [resendCount, setResendCount] = useState(0);
  const [timer, setTimer] = useState(0);

  const handleOtpChange = (value) => {
    setOtpCode(value);
  };

  const handleResend = async() => {
    if (resendCount < 2) {
      setResendCount(prev => prev + 1);
      setTimer(180); 
      const res = await sentMailForgotPassword({email:email})
      setAlert({
        type: "success",
        title: "Info",
        message: res.message,
      })
      return
    }else{
      setAlert({
        type: "info",
        title: "Info",
        message: "Anda akan diarahkan kembali ke halaman Lupa kata sandi untuk mengirim OTP",
      })
      router.push('/auth/lupa-password')
      return
    }
  };

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (sec) => {
    const minutes = String(Math.floor(sec / 60)).padStart(2, '0');
    const seconds = String(sec % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleSubmit = async () => {
    try {
      const res = await cekOTP({otp:otpCode, token:token})
      setAlert({
        type: "success",
            title: "Info",
            message: res.message,
      })
      if(res.status== 200){
       setTimeout(() => {
         router.push({
          pathname:'/auth/ganti-password',
          query:{
            email:email,
            otp:otpCode,
            token:token
          }
        })
       }, 3000);
      }else{
        return
      }
    } catch (error) {
      const res = error?.response?.data;
      if (res?.error) {
        setAlert({
          type: "info",
          title: "Info",
          message: res.error.map(err => err.msg).join(', '),
        });
      } else {
        setAlert({
          type: "info",
          title: "Info",
          message: res.message,
        });
      }
    }
  };
  useEffect(() => {
    if (!router.isReady) return;
    if (!token || !email) {
      router.replace("/auth/lupa-password");
    }
  }, [router.isReady, token, email, router]);

  if (!router.isReady || !token || !email) {
    return <p className="text-center w-full">Memuat...</p>;
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
              <h1 className=" text-2xl font-semibold text-primary ">Verifikasi Jode OTP</h1>
              <p className="text-justify leading-normal text-sm">Masukkan kode dari email yang kami kirim ke user@gmail.com</p>
          </div>
          <div>
          </div>
            <OtpInput onChange={handleOtpChange} />
            {resendCount < 2 ? (
              <button
                onClick={handleResend}
                disabled={timer > 0}
                className={`text-xs ${
                  timer > 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'cursor-pointer'
                }`}
              >
                {timer > 0 ? `Kirim ulang dalam ${formatTime(timer)}` : 'Kirim ulang OTP'}
              </button>
          ) : null}
        </div>

        <button disabled={otpCode.length<6} type="button" onClick={handleSubmit} className={`w-full text-white hover:opacity-80 p-2 rounded-md hover:cursor-pointer mt-4 ${otpCode.length<6 ?'cursor-not-allowed bg-gray-400':'cursor-pointer bg-primary'}`}>
          Kirim
        </button>
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

Otp.getLayout = function getLayout(page) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default Otp;
