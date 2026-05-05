import { BarChart2, Award, BookOpen, Clock } from "lucide-react";
import React, { useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import LoadingModal from "../public/loadingModal";
import { useState } from "react";
import { Lock } from "lucide-react";
import { getProgramUtamaByID } from "@/lib/axios/programUtama";
import {
  createSnapTransaksi,
  createTransaksiFreeProgram,
} from "@/lib/axios/transaksi";
import Cookies from "js-cookie";
import PaymentModal from "./paymentModal";
import Alert from "../public/alert";
import { useSelector } from "react-redux";

export default function DetailSummary({
  dataLatihan,
  userHasPurchased,
  programId,
  dataRapor,
}) {
  const dataUser = useSelector((state) => state.user.detail);
  const router = useRouter();
  const token = Cookies.get("token");

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [paymentData, setPaymentData] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleNavigation = async (url) => {
    try {
      setLoading(true); // tampilkan loading sebelum pindah halaman
      await new Promise((resolve) => setTimeout(resolve, 500)); // efek delay kecil agar terasa smooth
      router.push(url);
    } finally {
      setLoading(false);
    }
  };
  const getProgramById = useCallback(async () => {
    try {
      const res = await getProgramUtamaByID(programId);
      setData(res.data);
    } catch (error) {
      //  //  console.log(error)
    }
  }, [programId]);

  useEffect(() => {
    getProgramById();
  }, [getProgramById, programId]);

  const dataRaporPertama = dataRapor?.[0];
  const total = dataRaporPertama?.total_skor ?? 0;
  const percent = (total / dataLatihan.maxPoin) * 100;
  const handleBeliAkses = async () => {
    setLoading(true);
    if (!token) {
      router.push("/auth/login");
      return;
    }
    // dispatch(
    //   addTransaksiProgramUtama({
    //     user_id: dataUser.id,
    //     jenis: "Program Utama",
    //     program_id: data.id,
    //     status: "CREATED",
    //     program_name: data.properties.name,
    //   })
    // );
    // router.push("/paket");
    if (data?.properties?.harga == 0) {
      try {
        await createTransaksiFreeProgram(
          {
            data_transaksi: {
              user_id: dataUser.id,
              jenis: "Program Utama",
              program_id: data.id,
              status: "CREATED",
              program_name: data.properties.name,
              bulan: Number(data?.properties?.durasi),
              harga: data?.properties?.harga,
              harga_akhir: 0,
            },
          },
          token
        );

        router.push("/pembelian");
      } catch (error) {
        setLoading(false);
        setAlert({
          type: "error",
          title: "Info",
          message: "Gagal membuat transaksi",
        });
        return;
      }
    } else {
      try {
        const res = await createSnapTransaksi(
          {
            data_transaksi: {
              user_id: dataUser.id,
              jenis: "Program Utama",
              program_id: data.id,
              status: "CREATED",
              program_name: data.properties.name,
              bulan: Number(data?.properties?.durasi),
              harga: data?.properties?.harga,
              harga_akhir: Number(data?.properties?.harga),
            },
            detail: dataUser,
          },
          token
        );
        if (res.status == 200) {
          setPaymentData(res.data.redirect_url);
          setLoading(false);
          setOpenModal(true);
        } else {
          setLoading(false);
          setAlert({
            type: "error",
            title: "Info",
            message: "Gagal membuat transaksi",
          });
          return;
        }
      } catch (error) {
        //  console.log(error);
        setLoading(false);
        setAlert({
          type: "error",
          title: "Info",
          message: "Gagal membuat transaksi",
        });
        return;
      }
    }
  };
  //  console.log(data);

  return (
    <div className="space-y-6 bg-white">
      {/* Menu atas */}
      <div className="relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CardMenu
            icon={<BarChart2 />}
            label="Statistik Nilai"
            onclick={() => {
              if (!userHasPurchased) return;
              handleNavigation(
                `statistik?program_id=${programId}&jenis=Program Utama&title=${dataLatihan.title}&module_name=${dataLatihan.module_name}`
              );
            }}
            color="bg-white shadow-md"
            textColor="text-blue-600"
            border="border-gray-200"
          />

          <CardMenu
            icon={<Award />}
            label="Rapor"
            onclick={() => {
              if (!userHasPurchased) return;
              handleNavigation(
                `rapor?jenis=Program Utama&title=${dataLatihan.title}&module_name=${dataLatihan.module_name}`
              );
            }}
            color="bg-white shadow-md"
            textColor="text-yellow-600"
            border="border-gray-200"
          />

          <CardMenu
            icon={<BookOpen />}
            label="Pembahasan"
            onclick={() => {
              if (!userHasPurchased) return;
              handleNavigation(
                `pembahasan?program_id=${programId}&jenis=Program Utama&title=${dataLatihan.title}&module_name=${dataLatihan.module_name}`
              );
            }}
            color="bg-white shadow-md"
            textColor="text-green-600"
            border="border-gray-200"
          />

          <CardMenu
            icon={<Clock />}
            label="Waktu Pengerjaan"
            onclick={() => {
              if (!userHasPurchased) return;
              handleNavigation(
                `waktu-pengerjaan?program_id=${programId}&jenis=Program Utama&title=${dataLatihan.title}&module_name=${dataLatihan.module_name}`
              );
            }}
            color="bg-white shadow-md"
            textColor="text-pink-600"
            border="border-gray-200"
          />
        </div>
        {!userHasPurchased && (
          <div className="absolute inset-0 z-10 rounded-xl bg-gray-900/40 flex items-center justify-center">
            <div className="text-center px-3 sm:px-5 max-w-[90%]">
              {/* ICON */}
              <div className="flex justify-center mb-3 sm:mb-4">
                <Lock
                  className="
            text-white/90
            w-[clamp(28px,6vw,56px)]
            h-[clamp(28px,6vw,56px)]
          "
                />
              </div>

              {/* TITLE */}
              <p
                className="
          text-white font-semibold
          text-[clamp(12px,2.5vw,18px)]
        "
              >
                Fitur ini dikunci
              </p>

              {/* DESCRIPTION */}
              <p
                className="
          text-white/80 mt-1
          text-[clamp(10px,2vw,14px)]
          leading-snug
        "
              >
                Upgrade ke premium untuk menikmati semua fitur
              </p>

              {/* CTA */}
              <button
                onClick={handleBeliAkses}
                className="
          mt-3 sm:mt-4
          px-[clamp(12px,3vw,24px)]
          py-[clamp(6px,1.5vw,10px)]
          bg-orange-500 hover:bg-orange-600
          text-white font-semibold
          text-[clamp(10px,2vw,14px)]
          rounded-md
          shadow-md
          transition
        "
              >
                Upgrade Sekarang
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Panel Nilai */}
      <div className="border border-gray-400 rounded-md p-6 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Donut Chart */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-[clamp(96px,25vw,140px)] h-[clamp(96px,25vw,140px)]">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                {/* Background */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                {/* Progress */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="3"
                  strokeDasharray={`${percent}, 100`}
                  strokeLinecap="round"
                />
              </svg>

              {/* Score */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-bold text-[clamp(18px,4vw,26px)] text-gray-800">
                  {total}
                </span>
                <span className="text-[clamp(10px,2vw,13px)] text-gray-500">
                  Poin
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <span className="w-2.5 h-2.5 bg-orange-400 rounded-full"></span>
              Poin Terakhir
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <NilaiCard
              label={dataLatihan.title}
              value={dataLatihan.maxPoin}
              grade={Number(dataLatihan.minPoin)}
            />
          </div>
        </div>
      </div>
      <LoadingModal show={loading} />
      <PaymentModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        paymentData={paymentData}
      />

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
}

// Komponen Menu Atas
function CardMenu({ icon, label, color, textColor, border, onclick }) {
  return (
    <div
      onClick={onclick}
      className={`
        p-[clamp(10px,2vw,16px)]
        border aspect-square rounded-xl
        flex flex-col items-center justify-center
        gap-[clamp(6px,1.5vw,10px)]
        transition
        ${color} ${border} ${textColor}
      `}
    >
      {/* ICON */}
      <div
        className="
          flex items-center justify-center
          w-[clamp(28px,6vw,48px)]
          h-[clamp(28px,6vw,48px)]
        "
      >
        {React.cloneElement(icon, {
          className: "w-full h-full",
          strokeWidth: 1.8,
        })}
      </div>

      {/* LABEL */}
      <span
        className="
          font-semibold text-center leading-tight
          text-[clamp(10px,2.3vw,14px)]
        "
      >
        {label}
      </span>
    </div>
  );
}

// Komponen Kartu Nilai
function NilaiCard({ label, value, grade }) {
  return (
    <div
      className="
        aspect-square
        w-full
        max-w-[220px]
        mx-auto
        rounded-xl
        border border-orange-200
        bg-linear-to-br from-orange-50 to-white
        shadow-sm
        flex flex-col
        items-center
        justify-center
        text-center
        p-4
      "
    >
      {/* LABEL */}
      <p className="text-[clamp(11px,2vw,14px)] text-gray-500 font-medium mb-1">
        {/* {label} */}
        Maksimal Poin
      </p>

      {/* VALUE */}
      <div className="flex items-end gap-1">
        <span className="text-[clamp(26px,6vw,36px)] font-bold text-orange-600">
          {value}
        </span>
        <span className="text-[clamp(10px,2vw,14px)] text-gray-400 mb-1">
          poin
        </span>
      </div>

      {/* PASSING GRADE */}
      <div className="mt-2 text-[clamp(10px,2vw,13px)] text-gray-600">
        Passing Grade
        <span className="block font-semibold text-gray-800">{grade}</span>
      </div>
    </div>
  );
}
