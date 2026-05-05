import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { adminMenuItems } from "../constants/adminMenu";

export default function NavigasiAdmin() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [openMenuBase, setOpenMenuBase] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleMenu = () => {
    setOpenMenuBase(!openMenuBase);
  };

  const toggleDropdown = (key) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  useEffect(() => {
    const pathname = window.location.pathname;
    setActiveNav(pathname.split("/")[4]);
  }, []);

  const menuItems = adminMenuItems;

  return (
    <div className="sm:hidden">
      {/* Navbar Atas */}
      <div className="w-full max-w-[1440px] mx-auto flex justify-between p-7 z-40 items-center border-b-4 border-primary bg-white fixed top-0">
        <Image
          className="w-30"
          src="../../../logo.png"
          height={200}
          width={100}
          alt="fokusedu"
        />
        <Menu onClick={toggleMenu} size={30} />
      </div>

      {/* Menu Dropdown */}
      {openMenuBase && (
        <div className="w-full h-screen z-30 bg-white fixed overflow-y-auto top-[102px] bottom-0">
          <ul className="space-y-1 pb-24">
            {menuItems.map((item, index) =>
              item.children ? (
                <div key={index}>
                  <button
                    onClick={() => toggleDropdown(item.key)}
                    className={`flex items-center justify-between w-full gap-2 p-3 border-b border-b-primary hover:bg-primary hover:text-white ${
                      activeNav === item.key ? "bg-primary text-white" : ""
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {item.icon} {item.label}
                    </span>
                    {item.suffix}
                  </button>
                  {openDropdown === item.key && (
                    <ul className="ml-6">
                      {item.children.map((child, idx) => (
                        <Link key={idx} href={child.href}>
                          <li
                            className={`flex items-center gap-2 p-3 border-b border-b-primary hover:bg-gray-100 cursor-pointer text-sm ${
                              activeNav === child.key
                                ? "bg-gray-200 font-medium"
                                : ""
                            }`}
                          >
                            {child.icon}
                            {child.label}
                          </li>
                        </Link>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link key={index} href={item.href}>
                  <li
                    className={`flex items-center gap-2 p-3 border-b border-b-primary hover:bg-primary hover:text-white ${
                      activeNav === item.key ? "bg-primary text-white" : ""
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </li>
                </Link>
              ),
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
