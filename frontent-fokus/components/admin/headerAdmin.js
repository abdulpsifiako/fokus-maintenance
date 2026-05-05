import dynamic from "next/dynamic";
import { Menu, User } from "lucide-react";
import Image from "next/image";
const Clock = dynamic(() => import("./clock"), { ssr: false });

export default function HeaderAdmin() {
  return (
    <>
      <div className="hidden sm:flex px-4 fixed w-full max-w-[1440px] mx-auto bg-white h-20 border-b-2 border-primary top-0">
        <div className="w-full flex justify-between items-center">
          <Image
            className="w-36"
            src="../../../logo.png"
            height={50}
            width={50}
            alt="fokusedu"
          />
          <Clock />
          <div className="flex items-center space-x-3">
            <div className="bg-primary rounded-full p-1.5">
              <User color="white" size={30} />
            </div>
            <p className="text-xs">Admin</p>
          </div>
        </div>
      </div>
    </>
  );
}
