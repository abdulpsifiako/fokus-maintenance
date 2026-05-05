import {
  getCountPengunjung,
  getCountTransaksi,
  getCountUsers,
} from "@/lib/axios/dashboard";
import Cookies from "js-cookie";
import StatCard from "./stateCard";
import TableUser from "./tableUsers";
import {
  Book,
  Laptop,
  Layers3,
  CloudCheck,
  BarChart2,
  List,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function DashboardPage() {
  const token = Cookies.get("token");
  const [dashboard, setDashboard] = useState({
    countUser: 0,
    countPengunjung: 0,
  });
  const getDasboard = useCallback(async () => {
    try {
      const countUsers = await getCountUsers(token);
      const countPengunjung = await getCountPengunjung(token);
      const countTransaksi = await getCountTransaksi(token);
      //  //  console.log(countTransaksi)
      setDashboard({
        countUser: countUsers.count,
        countPengunjung: countPengunjung.count,
        ...countTransaksi.data,
      });

      return;
    } catch (error) {
      return;
    }
  }, [token]);

  useEffect(() => {
    getDasboard();
  }, [getDasboard]);
  return (
    <>
      <section>
        <h2 className="text-xl font-bold mb-3">Transaksi</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Book size={70} />}
            title="Program Utama"
            value={dashboard.totalProgramUtama}
          />
          <StatCard
            icon={<Laptop size={70} />}
            title="Kelas Online"
            value={dashboard.totalKelasOnline}
          />
          <StatCard
            icon={<Layers3 size={70} />}
            title="Try Out"
            value={dashboard.totalTryout}
          />
          <StatCard
            icon={<CloudCheck size={70} />}
            title="Total Transaksi Berhasil"
            value={dashboard.totalTransaksi}
          />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold mb-3">Jumlah Pengguna</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <StatCard
            icon={<BarChart2 size={70} />}
            title="Jumlah Pengguna Terdaftar"
            value={dashboard.countUser}
          />
          <StatCard
            icon={<List size={70} />}
            title="Jumlah Pengunjung Terdaftar"
            value={dashboard.countPengunjung}
          />
        </div>
      </section>

      <TableUser />
    </>
  );
}
