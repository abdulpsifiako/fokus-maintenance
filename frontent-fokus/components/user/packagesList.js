import { getProgramLanding } from "@/lib/axios/program";
import { Check } from "lucide-react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import Alert from "../public/alert";
import LoadingModal from "../public/loadingModal";
import { createSnapTransaksi } from "@/lib/axios/transaksi";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { getProgramku, getProgramUtamaByID } from "@/lib/axios/programUtama";
import PaymentModal from "./paymentModal";
import VoucherModal from "./voucherModal";

const hitungHargaAkhir = (properties) => {
  const harga = Number(properties?.harga || 0);

  if (!properties?.diskon_aktif) {
    return {
      harga,
      harga_akhir: harga,
      potongan: 0,
    };
  }

  const diskonValue = Number(properties?.diskon_value || 0);
  let potongan = 0;

  if (properties?.diskon_tipe === "nominal") {
    potongan = diskonValue;
  }

  if (properties?.diskon_tipe === "persen") {
    potongan = Math.round((harga * diskonValue) / 100);
  }

  const hargaAkhir = Math.max(harga - potongan, 0);

  return {
    harga,
    harga_akhir: hargaAkhir,
    potongan,
  };
};

export default function PaketCardGrid() {
  const dataUser = useSelector((state) => state.user.detail);
  const token = Cookies.get("token");
  const router = useRouter();
  const [paymentData, setPaymentData] = useState("");
  const [loadingPage, setLoadingPage] = useState(false);
  const [openModalPembayaran, setOpenModalPembayaran] = useState(false);
  const [alert, setAlert] = useState(null);
  const [data, setData] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("created_at|desc");
  const [dataProgramku, setDataProgramKu] = useState(null);
  const [idGabung, setidGabung] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openVoucherModal, setOpenVoucherModal] = useState(null);
  const [price, setPrice] = useState(0);

  const fetchProgramku = useCallback(
    async (params) => {
      if (!token) {
        return;
      }
      const res = await getProgramku("Program Utama", token);
      const data = res.data.map((item) => {
        return item.id;
      });
      setDataProgramKu(data);
    },
    [token],
  );

  useEffect(() => {
    fetchProgramku();
  }, [fetchProgramku]);

  const openPaketModal = (id) => {
    setSelectedId(id);
    setidGabung(id);
    setOpenVoucherModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setSelectedId(null);
    setSelectedItem(null);
  };

  const fetchData = useCallback(async () => {
    try {
      const res = await getProgramLanding(page, limit, search, null, true);
      if (res.status === 200) {
        setData(res.data);
      }
    } catch (error) {
      // //  //  console.log(error);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatPrice = (val) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val);

  const handleDetail = async (id) => {
    try {
      const detailProgram = await getProgramUtamaByID(id);
      window.open(`/detail/${selectedId}`, "_blank");
    } catch (error) {
      setOpenModal(false);
      setAlert({
        type: "info",
        title: "Info",
        message: "Program utama/promo sudah berakhir",
      });
      return;
    }
  };

  const handleGabungSekarang = async (id, voucherData) => {
    if (!token || Object.keys(dataUser).length === 0) {
      router.push("/auth/login");
      return;
    }
    setOpenVoucherModal(false); // ✅ tutup modal dulu
    setOpenModal(false);
    setLoadingPage(true);
    try {
      const detailProgram = await getProgramUtamaByID(id);
      if (detailProgram.status == 200) {
        const { harga, harga_akhir } = hitungHargaAkhir(
          selectedItem?.properties,
        );

        // ✅ pakai harga dari voucher jika ada
        const finalHarga = voucherData?.harga_akhir ?? harga_akhir;
        const finalVoucher = voucherData?.voucherCode ?? "";
        const finalPotongan = voucherData?.potongan ?? 0;

        const res = await createSnapTransaksi(
          {
            data_transaksi: {
              user_id: dataUser.id,
              jenis: "Program Utama",
              program_id: id,
              status: "CREATED",
              program_name: detailProgram?.data?.properties.name,
              bulan: Number(selectedItem?.properties?.durasi),
              harga: harga,
              harga_akhir: finalHarga,
              voucherCode: finalVoucher,
              potongan: finalPotongan,
            },
            detail: dataUser,
          },
          token,
        );

        if (res.status == 200) {
          setPaymentData(res.data.redirect_url);
          setLoadingPage(false);
          setOpenModalPembayaran(true);
        } else {
          setLoadingPage(false);
          setAlert({
            type: "error",
            title: "Info",
            message: "Gagal membuat transaksi",
          });
        }
      }
    } catch (error) {
      setLoadingPage(false);
      setOpenModalPembayaran(false);
      setAlert({
        type: "info",
        title: "Info",
        message: "Program utama/promo sudah berakhir",
      });
    }
  };

  return (
    <div className="bg-pink-50 py-12 justify-center items-center m-auto w-full flex">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4  font-poppins max-w-4xl">
        {data &&
          data.data.map((pkg, i) => {
            const {
              name,
              harga,
              diskon_aktif,
              diskon_tipe,
              diskon_value,
              deskripsi,
              durasi,
              link,
              program_id,
            } = pkg.properties;

            // hitung harga setelah diskon
            let finalPrice = parseInt(harga);
            if (diskon_aktif && diskon_value) {
              if (diskon_tipe === "persen") {
                finalPrice =
                  finalPrice - (finalPrice * parseInt(diskon_value)) / 100;
              } else {
                finalPrice = finalPrice - parseInt(diskon_value);
              }
            }

            return (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col overflow-hidden hover:shadow-xl transition-shadow max-w-lg"
              >
                {/* Header */}
                <div className="bg-linear-to-r from-red-600 to-secondary text-xl text-white text-center py-6 font-semibold">
                  {name}
                </div>

                {/* Body */}
                <div className="p-8 flex flex-col grow">
                  <p className="text-center font-medium text-lg mb-2">
                    Paket {durasi} Bulan
                  </p>

                  {/* Harga */}
                  <div className="text-center mb-4">
                    <div className="font-bold text-3xl text-red-700">
                      {formatPrice(finalPrice)}
                    </div>
                    {diskon_aktif && (
                      <p className="text-sm text-gray-400 line-through">
                        {formatPrice(harga)}
                      </p>
                    )}
                  </div>

                  {/* Deskripsi */}
                  <ul className="space-y-3 mt-4">
                    {deskripsi.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="bg-red-700 rounded-full p-1 flex items-center justify-center mt-1">
                          <Check size={14} color="white" />
                        </div>
                        <div className="space-y-1">
                          <h1 className="font-semibold text-lg">
                            {feat.title}
                          </h1>
                          <p className="text-justify font-light">{feat.sub}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer */}
                {dataProgramku &&
                  (dataProgramku.some((item) => item === Number(program_id)) ? (
                    ""
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedItem(pkg);
                        openPaketModal(program_id);
                        setPrice(finalPrice);
                      }}
                      className="bg-secondary hover:bg-red-700 text-white text-sm font-semibold px-6 py-4 rounded-b-md shadow transition-all"
                    >
                      Pilih
                    </button>
                  ))}
              </div>
            );
          })}
      </div>
      {openModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative animate-fade-in">
            {/* Close */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold text-center mb-2">
              Pilih Paket
            </h2>
            <p className="text-sm text-gray-500 text-center mb-6">
              Lihat detail paket atau langsung bergabung
            </p>

            <div className="flex flex-col gap-3">
              {/* Detail */}
              <button
                onClick={() => handleDetail(selectedId)}
                className="w-full border border-primary text-primary py-3 rounded-md font-semibold hover:bg-primary hover:text-white transition"
              >
                Lihat Detail
              </button>

              {/* Join */}
              <button
                onClick={() => {
                  setOpenVoucherModal(true);
                  setidGabung(selectedId);
                }}
                className="w-full bg-primary text-white py-3 rounded-md font-semibold hover:bg-red-700 transition"
              >
                Gabung Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {openVoucherModal && (
        <VoucherModal
          harga={price}
          onClose={() => setOpenVoucherModal(false)}
          onLanjut={(voucherData) =>
            handleGabungSekarang(idGabung, voucherData)
          }
        />
      )}
      <PaymentModal
        open={openModalPembayaran}
        onClose={() => setOpenModalPembayaran(false)}
        paymentData={paymentData}
      />

      <LoadingModal show={loadingPage} />

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
