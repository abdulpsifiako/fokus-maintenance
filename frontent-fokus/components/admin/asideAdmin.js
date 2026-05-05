'use client'

import { exitApp } from "@/lib/public/auth";

import Link from "next/link";
import { useState } from "react";
import Cookies from 'js-cookie';

import { persistor } from "@/lib/redux/store";
import { GiPaper, GiWantedReward } from "react-icons/gi";
import { adminMenuItems } from "../constants/adminMenu";

export default function AsideAdmin() {
  const pathname = typeof window !== "undefined" ? window.location.pathname.split('/')[4] : "";
  const [alert, setAlert] = useState(null);
  const [showMenu, setShowMenu] = useState(true);

  const [openDropdown, setOpenDropdown] = useState(null);
  const toggleDropdown = (key) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  const menuItems = adminMenuItems

  const handleExitApp = async () => {
    try {
      const token = Cookies.get("token");
      const res = await exitApp(token);

      setAlert({
        type: "success",
        title: "Info",
        message: res.message,
      });

      Cookies.remove('token', { path: '/' });
      Cookies.remove('role', { path: '/' });

      await persistor.purge();

      setTimeout(() => {
        window.location.href = "/";
      }, 60);

      setShowMenu(false);
    } catch (error) {
      console.error("Exit failed:", error);
    }
  };

  return (
    <aside className="hidden sm:block w-64 h-full overflow-y-auto shrink-0 border-r custom-scroll p-2">
      <ul>
        {menuItems.map((item, index) => (
          item.key === "logout" ? (
            <li
              key={index}
              onClick={handleExitApp}
              className="flex items-center gap-2 w-full p-2 rounded hover:bg-red-600 hover:text-white cursor-pointer"
            >
              {item.icon}
              <span>{item.label}</span>
            </li>
          ) : item.children ? (
            <div key={index} className="flex flex-col">
              <button
                onClick={() => toggleDropdown(item.key)}
                className={`flex items-center justify-between w-full p-2 rounded-md hover:bg-primary hover:text-white cursor-pointer ${openDropdown === item.key ? "" : ""}`}
              >
                <span className="flex items-center gap-2">
                  {item.icon}
                  {item.label}
                </span>
                {item.suffix}
              </button>
              {openDropdown === item.key && (
                <ul className="ml-6 mt-1 space-y-1">
                  {item.children.map((child, idx) => (
                    <Link key={idx} href={child.href}>
                      <li
                        className={`flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm hover:bg-primary ${pathname === child.key ? "bg-primary font-medium text-white hover:bg-primary" : " hover:text-white"}`}
                      >
                        {child.icon}
                        <span>{child.label}</span>
                      </li>
                    </Link>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <Link key={index} href={item.href}>
              <li
                className={`flex items-center gap-2 w-full p-2 rounded-md hover:bg-primary hover:text-white cursor-pointer ${pathname === item.key ? "bg-primary text-white" : ""}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </li>
            </Link>
          )
        ))}
      </ul>
    </aside>
  );
}
