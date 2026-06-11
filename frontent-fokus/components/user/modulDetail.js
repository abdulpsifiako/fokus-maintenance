import { useEffect, useMemo, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { BsCheckCircleFill } from "react-icons/bs";
import { FaRegCirclePlay } from "react-icons/fa6";
import {
  getLatihanByIdDetail,
  getVideoByIdDetail,
} from "@/lib/axios/programUtama";
import { FaCheckCircle, FaLock, FaPencilAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addSoal } from "@/lib/redux/store/soalSlice";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { X } from "lucide-react";
import { addTransaksiProgramUtama } from "@/lib/redux/store/transaksi";
import LoadingModal from "../public/loadingModal";
import {
  createSnapTransaksi,
  createTransaksiFreeProgram,
} from "@/lib/axios/transaksi";
import PaymentModal from "./paymentModal";
import Alert from "../public/alert";
import { setExpanded } from "@/lib/redux/store/tab";

export default function ModulDetail({
  harga,
  durasi,
  data,
  loading,
  onSelectVideo,
  userHasPurchased,
  setOtherVideo,
  historyLatihan,
  historyVideo,
  activeTab,
  setActiveTab,
  handleNewBeliAkses,
}) {
  const [alert, setAlert] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [paymentData, setPaymentData] = useState("");
  const [loadingPage, setLoading] = useState(false);
  const dataUser = useSelector((state) => state.user.detail);
  const token = Cookies.get("token");
  const router = useRouter();
  const dispatch = useDispatch();
  const fitur =
    data?.properties?.fitur.sort((a, b) => {
      return b.localeCompare(a);
    }) || [];
  // const [expanded, setExpanded] = useState(null);

  const expanded = useSelector((state) => state.tab.expanded);

  const [video, setVideo] = useState(null);
  const [latihan, setLatihan] = useState(null);
  const id = data?.id;

  useEffect(() => {
    const fetchData = async () => {
      if (!id || fitur.length === 0) return;

      if (fitur.includes("video")) {
        const resVideo = await getVideoByIdDetail(id).catch((err) => {
          if (err?.response?.status === 404) {
            return null; // dianggap normal
          }
          throw err; // error lain tetap dilempar
        });

        if (resVideo) {
          setVideo(resVideo.data.sort((a, b) => a.v_id - b.v_id));
          setOtherVideo(resVideo.data);
        }
      }

      if (fitur.includes("latihan")) {
        const resLatihan = await getLatihanByIdDetail(id).catch((err) => {
          if (err?.response?.status === 404) {
            return null;
          }
          throw err;
        });

        if (resLatihan) {
          setLatihan(resLatihan.data);
        }
      }
    };

    fetchData();
  }, [fitur, id]);

  // transform sebelum render
  const modules = useMemo(
    () =>
      video?.map((v) => ({
        id: v?.v_id,
        title: v?.properties.materi,
        program_id: v?.properties.program_id,
        items: v?.properties.video.map((vid) => {
          const isComplete = historyVideo?.some(
            (o) => o.submateri === vid.name,
          );

          return {
            title: vid.name,
            thumbnail: vid.thumbnail,
            pengajar: vid.data_pengajar?.[0]?.name || "-",
            jobdesk: vid.data_pengajar?.[0]?.jobdesk || "-",
            kategori: vid.kategori,
            deskripsi: vid.deskripsi,
            videoUrl: vid.video,
            foto_pengajar: vid.pengajar || "pengajar.png",
            link_modul: vid.link_modul || "",
            complete: isComplete,
          };
        }),
      })) || [],
    [video, historyVideo],
  );

  const latihanData = useMemo(
    () =>
      latihan?.map((modul) => ({
        id: modul?.id,
        title: modul?.latihan_data?.materi,
        program_id: modul?.latihan_data?.program_id,
        items:
          modul?.latihan_data?.latihan?.map((lat) => {
            const maxPoin = lat.datasoal.reduce((total, soal) => {
              const maxSoal = Math.max(
                0,
                ...(soal.opsi?.map((opt) => opt.poin || 0) || [0]),
              );
              return total + maxSoal;
            }, 0);

            const isComplete = historyLatihan?.some(
              (o) =>
                o.submateri === lat.submateri_name &&
                o.materi === modul?.latihan_data?.materi,
            );

            return {
              id: modul?.id,
              program_utama: modul?.latihan_data?.program_utama,
              title: lat.submateri_name,
              questions: lat.jumlahsoal,
              completed: isComplete,
              kategori: lat.kategori,
              waktu: lat.waktu,
              jenis_program: data?.properties?.jenis,
              maxPoin,
              minPoin: lat.minPoin,
              datasoal: lat.datasoal.map((soal) => ({
                pertanyaan: soal.pertanyaan,
                opsi: soal.opsi,
                pembahasan: soal.pembahasan,
                kunci: soal.kunci,
                submateri: soal.submateri,
              })),
            };
          }) || [],
      })),
    [latihan, historyLatihan],
  );

  // if (!activeTab && fitur.length > 0) {
  //   setActiveTab(fitur[0]);
  // }

  useEffect(() => {
    if (!activeTab && fitur.length > 0) {
      setActiveTab(fitur[0]);
    }
  }, [fitur, activeTab]);

  useEffect(() => {
    if (modules.length > 0) {
      onSelectVideo(modules[0]?.items[0]);
    }
  }, [modules, onSelectVideo]);

  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = async (item, moduleName, program_id) => {
    try {
      setLoading(true);
      if (item.kategori === "Gratis" || userHasPurchased) {
        dispatch(
          addSoal({
            ...item,
            module_name: moduleName,
            program_id,
            jenis: "Program Utama",
          }),
        );

        router.push(`/summary-latihan?id=${program_id}`);
      } else {
        setShowModal(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBeliAkses = async () => {
    setLoading(true); // tampilkan modal loading
    await new Promise((resolve) => setTimeout(resolve, 2000));
    if (!token) {
      router.push("/auth/login");
      return;
    }
    if (harga == 0) {
      try {
        const res = await createTransaksiFreeProgram(
          {
            data_transaksi: {
              user_id: dataUser.id,
              jenis: "Program Utama",
              program_id: data.id,
              status: "CREATED",
              program_name: data.properties.name,
              bulan: Number(durasi),
              harga: harga,
              harga_akhir: 0,
            },
          },
          token,
        );

        router.push("/pembelian");
      } catch (error) {
        //  //  console.log(error);
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
          token,
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
        setLoading(false);
        setAlert({
          type: "error",
          title: "Info",
          message: "Gagal membuat transaksi",
        });
        return;
      }
    }
    // dispatch(
    //   addTransaksiProgramUtama({
    //     user_id: dataUser.id,
    //     jenis: "Program Utama",
    //     program_id: data.id,
    //     status: "CREATED",
    //     program_name: data.properties.name,
    //     bulan: Number(durasi),
    //     harga: finalPrice,
    //     harga_akhir: 0,
    //   })
    // );

    // router.push("/paket");
  };

  const [totalModules, setTotalModules] = useState(0);
  const [completedModules, setCompletedModules] = useState(0);
  useEffect(() => {
    if (video || latihanData) {
      // 🔹 Flatten semua item video
      const videoItems = modules.flatMap((m) => m.items || []);

      // 🔹 Flatten semua item latihan
      const latihanItems = (latihanData || []).flatMap((m) => m.items || []);

      // 🔹 Hitung total semua item (video + latihan)
      const total = videoItems.length + latihanItems.length;

      // 🔹 Hitung yang sudah complete dari video & latihan
      const completedVideos = videoItems.filter((i) => i.complete).length;
      const completedLatihan = latihanItems.filter((i) => i.completed).length;

      // 🔹 Total complete dari keduanya
      const completed = completedVideos + completedLatihan;

      // 🔹 Simpan ke state
      setTotalModules(total);
      setCompletedModules(completed);
    }
  }, [modules, latihanData, video]);

  //  //  console.log("INI LATIHAN", latihan);
  //  //  console.log("INI history", historyLatihan);
  //  //  console.log("INI LATUHAN DATA", latihanData);

  return (
    <div className="bg-white shadow-md rounded-md p-4 space-y-4 h-full font-poppins text-gray-700">
      {/* Header */}
      <div>
        <p className="text-sm font-semibold text-gray-800">
          {loading ? "loading..." : data?.properties?.name}
        </p>

        {token && (
          <>
            <div className="bg-gray-200 h-2 w-full rounded-full mt-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{
                  width: `${totalModules === 0 ? 0 : (completedModules / totalModules) * 100}%`,
                }}
              />
            </div>

            <p className="text-xs mt-1 text-gray-500">
              {completedModules} dari {totalModules} selesai (
              {totalModules === 0
                ? "0%"
                : `${((completedModules / totalModules) * 100).toFixed(2)}%`}
              )
            </p>
          </>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center justify-between text-sm font-medium border-b pb-2">
        <div className="flex space-x-4">
          {fitur.map((f) => (
            <button
              key={f}
              onClick={() => setActiveTab(f)}
              className={`pb-1 capitalize ${
                activeTab === f ? "border-b-2 border-primary" : "text-gray-400"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        {/* <span className="ml-auto text-red-500 text-xs font-bold">(8h 30m)</span> */}
      </div>

      {/* Tab Content */}
      {activeTab === "video" && (
        <div className="space-y-2">
          {modules.length > 0 ? (
            modules.map((module, idx) => (
              <div key={idx} className="border rounded-md">
                <button
                  onClick={() => dispatch(setExpanded(idx))}
                  className="w-full flex justify-between items-center px-4 py-2 text-sm font-semibold text-gray-800"
                >
                  {module.title}
                  {expanded === idx ? <FiChevronUp /> : <FiChevronDown />}
                </button>

                {expanded === idx && module.items.length > 0 && (
                  <ul className="px-4 pb-2 space-y-2 text-sm">
                    {module.items.map((item, subIdx) => {
                      const isExpired =
                        userHasPurchased.isPurchase &&
                        new Date() < new Date(userHasPurchased.valid);
                      // //  //  console.log(userHasPurchased.isPurchase)
                      // //  //  console.log(new Date() > new Date(userHasPurchased.valid))
                      return (
                        <li
                          key={subIdx}
                          className="flex justify-between items-center p-1.5 rounded hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            onSelectVideo(item);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            {item.complete ? (
                              <FaCheckCircle className="text-green-500 text-xs" />
                            ) : item.kategori === "Gratis" ? (
                              <FaRegCirclePlay className="text-red-500 text-xs" />
                            ) : isExpired ? (
                              <FaRegCirclePlay className="text-red-500 text-xs" />
                            ) : (
                              <FaLock className="text-gray-500 text-xs" />
                            )}
                            <span>{item.title}</span>
                          </div>
                          <span className="text-gray-600 text-xs">
                            {item.duration}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              Video saat ini belum tersedia
            </p>
          )}
        </div>
      )}

      {activeTab === "latihan" && (
        <div className="space-y-2">
          {latihanData ? (
            latihanData.map((module, idx) => (
              <div key={idx} className="border rounded-md">
                <button
                  onClick={() => dispatch(setExpanded(idx))}
                  className="w-full flex justify-between items-center text-start px-4 py-2 font-semibold text-sm"
                >
                  {module.title}
                  {expanded === idx ? <FiChevronUp /> : <FiChevronDown />}
                </button>

                {expanded === idx && module.items.length > 0 && (
                  <ul className="px-4 pb-2 space-y-2 text-sm">
                    {module.items.map((item, subIdx) => {
                      const isExpired =
                        userHasPurchased.isPurchase &&
                        new Date() < new Date(userHasPurchased.valid);
                      return (
                        <li
                          key={subIdx}
                          className="flex justify-between items-center hover:cursor-pointer hover:bg-gray-100 p-1 rounded"
                          onClick={async () => {
                            // setLoading(true);
                            setSelectedItem({
                              ...item,
                              module_name: module.title,
                              program_id: module.program_id,
                              jenis: "Program Utama",
                            });

                            try {
                              await Promise.all([
                                (async () => {
                                  if (
                                    userHasPurchased.isPurchase &&
                                    item.kategori === "Berbayar"
                                  ) {
                                    handleItemClick(
                                      item,
                                      module.title,
                                      module.program_id,
                                    );
                                  } else if (item.kategori === "Gratis") {
                                    handleItemClick(
                                      item,
                                      module.title,
                                      module.program_id,
                                    );
                                  } else {
                                    setLoading(false);
                                    setShowModal(true);
                                  }
                                })(),
                                new Promise((resolve) =>
                                  setTimeout(resolve, 2000),
                                ),
                              ]);
                            } catch (error) {
                              // //  //  console.log(error);
                            } finally {
                              setLoading(false); // sembunyikan modal setelah semua selesai
                            }
                          }}
                        >
                          <div className="flex items-center gap-2">
                            {item.completed ? (
                              <BsCheckCircleFill className="text-green-500 text-xs" />
                            ) : item.kategori === "Gratis" ? (
                              <FaPencilAlt className="text-primary text-xs" />
                            ) : isExpired ? (
                              <FaPencilAlt className="text-primary text-xs" />
                            ) : (
                              <FaLock className="text-gray-500 text-xs" />
                            )}
                            <span className="text-sm text-gray-700">
                              {item.title}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {item.questions} soal
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              Latihan saat ini belum tersedia
            </p>
          )}
        </div>
      )}

      {!activeTab && (
        <p className="text-sm text-gray-500 text-center py-4">
          Latihan / video saat ini belum tersedia, silakan gabung grup terlebih
          dahulu
        </p>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-300/60 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
            <div className="flex justify-between">
              <h2 className="text-sm font-semibold text-gray-800">Latihan</h2>
              <X onClick={() => setShowModal(false)} size={20} />
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Untuk mencoba materi
              <span className="text-primary font-semibold">
                {" "}
                {selectedItem?.module_name} - {selectedItem?.title}
              </span>{" "}
              kamu diharuskan {token ? "" : "login dahulu atau"} membeli akses.
            </p>

            <div className="flex justify-end gap-3">
              {token ? (
                ""
              ) : (
                <button
                  onClick={() => {
                    setShowModal(false);
                    window.location.href = "/auth/login";
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded border border-primary text-primary"
                >
                  Login
                </button>
              )}
              <button
                onClick={() => {
                  setShowModal(false);
                  handleNewBeliAkses();
                }}
                className="px-4 py-2 text-xs font-semibold rounded bg-primary text-white"
              >
                Beli Akses
              </button>
            </div>
          </div>
        </div>
      )}
      <LoadingModal show={loadingPage} />
      {/* <PaymentModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        paymentData={paymentData}
      /> */}
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
