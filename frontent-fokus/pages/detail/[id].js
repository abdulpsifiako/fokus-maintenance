import Image from "next/image";
import VideoPlayer from "../../components/user/videoplayer";
import { TbUsersPlus } from "react-icons/tb";
import ModulDetail from "../../components/user/modulDetail";
import ScrollVideoRight from "../../components/user/scrollVideoRight";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { getHistory, getProgramUtamaByID } from "@/lib/axios/programUtama";
import { useDispatch, useSelector } from "react-redux";
import { addTransaksiProgramUtama } from "@/lib/redux/store/transaksi";
import Cookies from "js-cookie";
import {
  createSnapTransaksi,
  createTransaksiFreeProgram,
  getTransaksiPembelian,
} from "@/lib/axios/transaksi";
import PengajarPanel from "@/components/user/pengajarPanel";
import Alert from "@/components/public/alert";
import PaymentModal from "@/components/user/paymentModal";
import LoadingModal from "@/components/public/loadingModal";
import { setTab } from "@/lib/redux/store/tab";
import VoucherModal from "@/components/user/voucherModal";
import Link from "next/link";

export default function VideoFokusEdu() {
  const dataUser = useSelector((state) => state.user.detail);
  const [paymentData, setPaymentData] = useState("");
  const [loadingPage, setLoadingPage] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [alert, setAlert] = useState(null);
  const token = Cookies.get("token");
  const dispatch = useDispatch();
  const [loading, setloading] = useState(true);
  const [data, setData] = useState(null);
  const [otherVideo, setOtherVideo] = useState(null);

  const activeTab = useSelector((state) => state.tab.tab);
  const setActiveTab = (tab) => dispatch(setTab(tab));
  const [openVoucherModal, setOpenVoucherModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [userHasPurchased, setUserHasPurchased] = useState(false);
  const [historyVideo, setHistoryVideo] = useState(null);
  const [historyLatihan, setHistoryLaihan] = useState(null);

  const router = useRouter();
  const programId = router.query.id;

  const getProgramById = useCallback(async () => {
    try {
      const res = await getProgramUtamaByID(programId);
      setData(res.data);
      setloading(false);
    } catch (error) {
      // //  //  console.log(error)
    }
  }, [programId]);
  const getTransaksiProgram = useCallback(async () => {
    try {
      const res = await getTransaksiPembelian(
        programId,
        token,
        "Program Utama",
      );
      setUserHasPurchased(res.data);
    } catch (error) {
      // //  //  console.log(error)
    }
  }, [programId, token]);
  const handleHistory = useCallback(async () => {
    try {
      const resVideo = await getHistory(
        {
          jenis: "Program Utama",
          typelatihan: "Video",
          orderstatus: "success",
          id_program: programId,
        },
        token,
      );
      const resLatihan = await getHistory(
        {
          jenis: "Program Utama",
          typelatihan: "Latihan",
          orderstatus: "success",
          id_program: programId,
        },
        token,
      );
      setHistoryVideo(resVideo.data);
      setHistoryLaihan(resLatihan.data);
    } catch (error) {
      // //  //  console.log(error)
    }
  }, [token, programId]);

  useEffect(() => {
    getProgramById();
  }, [getProgramById]);

  const handleBeliAkses = async () => {
    if (!token) {
      router.push("/auth/login");
      return;
    }

    // Program gratis — langsung proses tanpa voucher
    if (data?.properties?.harga == 0) {
      setLoadingPage(true);
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
              harga: 0,
              harga_akhir: 0,
            },
          },
          token,
        );
        router.push("/pembelian");
      } catch (error) {
        setLoadingPage(false);
        setAlert({
          type: "error",
          title: "Info",
          message: "Gagal membuat transaksi",
        });
      }
      return;
    }

    // ✅ Program berbayar — tampilkan voucher modal dulu
    setOpenVoucherModal(true);
  };

  // ✅ Handler setelah user klik "Lanjut Pembayaran" di VoucherModal
  const handleLanjutPembayaran = async ({
    harga_akhir,
    voucherCode,
    potongan,
    tipe,
  }) => {
    setOpenVoucherModal(false);
    setLoadingPage(true);

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
            harga_akhir, // ✅ harga setelah potongan
            voucherCode, // ✅ kode voucher
            tipe: tipe,
          },
          detail: dataUser,
        },
        token,
      );

      if (res.status == 200) {
        setPaymentData(res.data.redirect_url);
        setLoadingPage(false);
        setOpenModal(true);
      } else {
        setLoadingPage(false);
        setAlert({
          type: "error",
          title: "Info",
          message: "Gagal membuat transaksi",
        });
      }
    } catch (error) {
      setLoadingPage(false);
      setAlert({
        type: "error",
        title: "Info",
        message: "Gagal membuat transaksi",
      });
    }
  };

  useEffect(() => {
    getProgramById();
  }, [getProgramById, programId]);
  useEffect(() => {
    getTransaksiProgram();
  }, [getTransaksiProgram, programId]);
  useEffect(() => {
    handleHistory();
  }, [handleHistory]);

  // console.log("INI Data", data);
  //  //  console.log("Ini transaksi", userHasPurchased);

  return (
    <div className="px-7 mt-4 font-poppins text-gray-700">
      <header className="flex space-x-2 text-xs text-gray-500 my-2">
        <Link href={`/program-utama`}>
          <p className="font-medium">Program Utama</p>
        </Link>
        <span>›</span>
        <p className="font-semibold text-gray-700">
          {loading ? "loading..." : data?.properties?.name}
        </p>
      </header>
      <div className="w-full h-full flex flex-col sm:flex-row gap-2">
        {/* kiri (2/3) */}
        <div className="basis-2/3 w-full rounded-xl shadow-md p-3">
          {(activeTab === "latihan" || !activeTab) && (
            <>
              {data && (
                <>
                  <div className="w-full flex justify-center">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/landing/images/${data?.properties?.banner}`}
                      alt="banner"
                      width={500}
                      height={500}
                      className="object-contain"
                    />
                  </div>

                  <PengajarPanel data={data} />
                </>
              )}
            </>
          )}
          {activeTab === "video" && (
            <>
              <div className="relative">
                {selectedVideo ? (
                  <VideoPlayer
                    videoUrl={`${selectedVideo.videoUrl} || ${process.env.NEXT_PUBLIC_API_URL}/landing/video/${selectedVideo.videoUrl}`}
                    poster={`${process.env.NEXT_PUBLIC_API_URL}/landing/images/${selectedVideo?.thumbnail}`}
                    upload={true}
                    data={selectedVideo}
                    programId={programId}
                  />
                ) : (
                  <div className="flex items-center justify-center h-64 border rounded-md">
                    <p className="text-sm text-gray-500">
                      Video akan ditampilkan disini
                    </p>
                  </div>
                )}

                {/* Overlay untuk video berbayar */}

                {/* 1. Jika belum login, SEMUA video tetap terkunci */}
                {!token && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary/55 backdrop-blur-sm z-20 gap-3">
                    <p className="text-sm font-semibold text-white">
                      Yuk Mulai Perjalanan Belajarmu
                    </p>

                    <p className="text-xs text-center text-white leading-relaxed">
                      Login dulu untuk mengakses video gratis maupun berbayar.
                    </p>

                    <button
                      type="button"
                      onClick={() => router.push("/auth/login")}
                      className="px-3 py-1.5 text-xs font-semibold bg-white text-primary rounded-lg"
                    >
                      Login
                    </button>
                  </div>
                )}

                {/* 2. Jika kategori berbayar & user belum membeli */}
                {token &&
                  selectedVideo?.kategori === "Berbayar" &&
                  !(
                    userHasPurchased.isPurchase &&
                    new Date() < new Date(userHasPurchased.valid)
                  ) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary/55 backdrop-blur-sm z-20 gap-3">
                      <p className="text-white font-semibold">
                        Yuk Mulai Perjalanan Belajarmu
                      </p>
                      <p className="text-xs text-center text-white">
                        Dapatkan akses ke video materi yang terstruktur dan
                        latihan soal berkualitas untuk hasil belajar maksimal!
                      </p>

                      <div className="flex gap-3 text-xs">
                        <button
                          onClick={handleBeliAkses}
                          className="px-2 py-1 bg-primary text-white rounded-lg shadow"
                        >
                          Beli Akses
                        </button>
                      </div>
                    </div>
                  )}
              </div>

              {selectedVideo ? (
                <div className="my-3">
                  <h1 className="text-sm font-semibold text-gray-800">
                    {selectedVideo.title}
                  </h1>

                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <button className="px-3 py-1 rounded-md text-xs font-semibold text-white bg-green-500">
                      {selectedVideo.kategori === "Berbayar"
                        ? "Membership"
                        : selectedVideo.kategori}
                    </button>

                    {/* ✅ Tombol link modul — hanya muncul jika ada link_modul */}
                    {selectedVideo.link_modul && (
                      <a
                        href={selectedVideo.link_modul}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 rounded-md text-xs font-semibold
            text-white bg-blue-500 hover:bg-blue-600 transition-all"
                      >
                        📄 Lihat Modul
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="my-2 p-3 border border-dashed rounded-md text-center">
                  <p className="text-xs text-gray-500">
                    Belum ada video tersedia untuk materi ini
                  </p>
                </div>
              )}

              {data &&
                (data.properties?.fitur?.length < 1 ? (
                  <PengajarPanel data={data} />
                ) : selectedVideo ? (
                  <div className="w-full space-y-2 text-xs">
                    <h1 className="text-sm font-semibold text-gray-800">
                      Pengajar
                    </h1>
                    <div className="w-full flex gap-3">
                      <Image
                        className="w-14 h-14 object-cover object-center bg-primary rounded-full"
                        src={`${selectedVideo.foto_pengajar === "pengajar.png" ? "/pengajar.png" : `${process.env.NEXT_PUBLIC_API_URL}/landing/images/${selectedVideo?.foto_pengajar}`}`}
                        height={100}
                        width={100}
                        alt="pengajar"
                      />
                      <div className="flex flex-col justify-center">
                        <h1 className="text-sm font-semibold text-primary">
                          {selectedVideo?.pengajar}
                        </h1>
                        <h1 className="text-xs text-gray-500">
                          {selectedVideo.jobdesk}
                        </h1>
                      </div>
                    </div>
                    <h1 className="text-sm font-semibold mt-2">Deskripsi</h1>
                    <p className="text-sm text-gray-600 leading-relaxed text-justify max-w-4xl">
                      {selectedVideo?.deskripsi}
                    </p>
                    {data.properties?.link && (
                      <a
                        href={data.properties.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-red-800 transition text-xs font-semibold text-white w-fit"
                      >
                        <TbUsersPlus size={16} />
                        Join Grup Belajar
                      </a>
                    )}
                  </div>
                ) : (
                  <PengajarPanel data={data} />
                ))}
            </>
          )}
        </div>

        {/* kanan (1/3) */}
        <div className="basis-1/3 w-full">
          <ModulDetail
            data={data}
            loading={loading}
            onSelectVideo={setSelectedVideo} // lempar handler ke child
            userHasPurchased={userHasPurchased}
            setOtherVideo={setOtherVideo}
            historyLatihan={historyLatihan}
            historyVideo={historyVideo}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            harga={data?.properties?.harga}
            durasi={data?.properties?.durasi}
            handleNewBeliAkses={handleBeliAkses}
          />
        </div>
      </div>
      {openVoucherModal && (
        <VoucherModal
          harga={data?.properties?.harga}
          onClose={() => setOpenVoucherModal(false)}
          onLanjut={handleLanjutPembayaran}
        />
      )}
      {activeTab === "video" ? (
        <ScrollVideoRight onSelectVideo={setSelectedVideo} data={otherVideo} />
      ) : (
        <></>
      )}
      <PaymentModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        paymentData={paymentData}
      />

      {/* <LoadingModal show={loadingPage} /> */}

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
