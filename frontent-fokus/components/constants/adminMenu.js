// src/constants/adminMenu.js

import { ChevronDown } from "lucide-react";
import { Laptop } from "lucide-react";
import {
  Book,
  BookAlert,
  BookCheck,
  BookOpen,
  BrickWallFire,
  Bubbles,
  CalendarCheck,
  DollarSign,
  Gift,
  LayoutDashboard,
  LogOut,
  Package2,
  PackageCheck,
  Proportions,
  Settings2,
  ShieldAlert,
  Ticket,
  User,
  UserRoundCog,
} from "lucide-react";

export const adminMenuItems = [
  { href: "/srv/fkd/admin/dashboard", label: "Dashboard", key:"dashboard", icon: <LayoutDashboard /> },
  { href: "/srv/fkd/admin/management-user", label: "Managemen User", key:"management-user", icon: <User /> },
  { href: "/srv/fkd/admin/landing-page", label: "Landing Page", key:"landing-page", icon: <Proportions /> },
  { href: "/srv/fkd/admin/pengalaman", label: "Pengalaman Belajar", key:"pengalaman", icon: <BookAlert /> },
  { href: "/srv/fkd/admin/testimoni", label: "Approval Testimoni", key:"testimoni", icon: <CalendarCheck /> },
  { href: "/srv/fkd/admin/fasilitator", label: "Fasilitator", key:"fasilitator", icon: <UserRoundCog /> },
  { href: "/srv/fkd/admin/jenis-program", label: "Jenis Program Utama", key:"jenis-program", icon: <Book /> },
  {
    label: "Program Utama",
    key: "program", 
    icon: <PackageCheck />, 
    suffix: <ChevronDown />,
    children: [
      { href: "/srv/fkd/admin/info-program", label: "Info", key:"info-program", icon: "" },
      { href: "/srv/fkd/admin/video", label: "Video", key:"video", icon: "" },
      { href: "/srv/fkd/admin/latihan", label: "Latihan", key:"latihan", icon: "" },
    ],
  },
  { href: "/srv/fkd/admin/paket-program", label: "Paket Program", key:"paket-program", icon: <Package2 /> },
  { href: "/srv/fkd/admin/jenis-to", label: "Jenis Try Out", key:"jenis-to", icon: <BookCheck /> },
  { href: "/srv/fkd/admin/try-out", label: "Try Out", key:"try-out", icon: <BookOpen /> },
  { href: "/srv/fkd/admin/jenis-kelas", label: "Jenis Kelas Online", key:"jenis-kelas", icon: <BookOpen /> },
  { href: "/srv/fkd/admin/kelas-online", label: "Kelas Online", key:"kelas-online", icon: <Laptop /> },
  { href: "/srv/fkd/admin/lapor-soal", label: "Detail Lapor Soal", key:"lapor-soal", icon: <ShieldAlert /> },

  {
    label: "Transaksi",
    key: "transaksi", 
    icon: <DollarSign />, 
    suffix: <ChevronDown />,
    children: [
      { href: "/srv/fkd/admin/transaksi-program", label: "Program Utama", key:"transaksi-program", icon: "" },
      { href: "/srv/fkd/admin/transaksi-online-class", label: "Kelas Online", key:"transaksi-online-class", icon: "" },
      { href: "/srv/fkd/admin/transaksi-tryout", label: "Try Out", key:"transaksi-tryout", icon: "" },
    ],
  },

  { href: "/srv/fkd/admin/voucher", label: "Voucher", key:"voucher", icon: <Ticket /> },
  { href: "/srv/fkd/admin/reward", label: "Reward", key:"reward", icon: <Gift /> },
  { href: "/srv/fkd/admin/setting", label: "Settings", key:"setting", icon: <Settings2 /> },
  { href: "/logout", label: "Keluar", key:"logout", icon: <LogOut /> },
];
