import Image from "next/image";
import AuthLayout from "../layouts/authLayout";
import { useState } from "react";
import { VscAccount } from "react-icons/vsc";
import { SlArrowRight } from "react-icons/sl";
import { FaPlusCircle } from "react-icons/fa";

function Akun() {
  return (
    <>
      <div className="flex flex-row h-screen font-poppins">
        <div className="flex-1 flex flex-col justify-center items-center mx-auto space-y-4">
          <div className="flex justify-center flex-col items-center mx-auto">
            <Image
              src="/logo.png"
              width={200}
              height={100}
              alt="fokusedu logo"
            />
            <h1 className="font-semibold text-sm text-center">Masuk</h1>
          </div>
          <div className="p-2 min-w-[300px] max-w-sm border-b border-b-gray-400 shadow flex flex-row gap-3 justify-between items-center">
            <div className="flex justify-center items-center gap-2">
              <VscAccount size={30} />
              <div>
                <h1>abdul@email.com</h1>
                <p className="text-xs">Login dengan email/username</p>
              </div>
            </div>
            <SlArrowRight className="ml-4" size={30} />
          </div>
          <div className="p-2 min-w-[300px] max-w-sm border-b border-b-gray-400 shadow flex flex-row gap-3 justify-between items-center">
            <div className="flex justify-center items-center gap-2">
              <FaPlusCircle size={30} />
              <div>
                <h1>Gunakan akun lain</h1>
              </div>
            </div>
            <SlArrowRight className="ml-4" size={30} />
          </div>
          <p className="text-xs">
            Belum punya akun?{" "}
            <span className="text-primary opacity-80">Buat Akun</span>
          </p>
        </div>
        <div className="flex-1 hidden sm:flex sm:justify-center items-center m-auto">
          <Image
            className="sm:w-72 lg:w-96 xl:w-8/12"
            src="/banner.png"
            alt="banner fokusedu"
            width={1000}
            height={1000}
          />
        </div>
      </div>
    </>
  );
}

Akun.getLayout = function getLayout(page) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default Akun;
