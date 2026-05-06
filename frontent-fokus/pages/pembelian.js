import {
  createSnapTransaksiPembelian,
  getTransaksi,
} from "@/lib/axios/transaksi";
import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import Alert from "@/components/public/alert";
import { Link } from "lucide-react";
import Image from "next/image";
import { useSelector } from "react-redux";
import LoadingModal from "@/components/public/loadingModal";
import { useRouter } from "next/router";

const getVANumber = (item) => {
  const res = item.bank_response;
  if (!res) return "-";

  if (res.payment_type === "bank_transfer") {
    if (res.bank === "permata") return res.permata_va_number;
    if (res.va_numbers?.length) return res.va_numbers[0].va_number;
  }

  if (res.payment_type === "echannel") {
    return `Bill Key: ${res.bill_key} | Biller Code: ${res.biller_code}`;
  }

  return "-";
};

const getPaymentLabel = (item) => {
  if (!item.metode) return "-";
  return item.metode.replace("_", " ").toUpperCase();
};

export default function RiwayatPembelian() {
  const router = useRouter();
  const [alert, setAlert] = useState(null);
  const user = useSelector((state) => state.user.detail);

  const [loadingPage, setLoadingPage] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const token = Cookies.get("token");
  const TABS = ["Program Utama", "Tryout", "Kelas Online"];
  const [activeTab, setActiveTab] = useState("Program Utama");
  const [statusFilter, setStatusFilter] = useState("");
  const [dataTransaksi, setDataTransaksi] = useState(null);

  const statusLabel = {
    success: {
      text: "Aktif",
      strip: "bg-green-500",
      badge: "bg-green-100 text-green-700",
    },
    pending: {
      text: "Belum Aktif",
      strip: "bg-yellow-400",
      badge: "bg-yellow-100 text-yellow-800",
    },
    expired: {
      text: "Tidak Aktif",
      strip: "bg-red-500",
      badge: "bg-red-100 text-red-700",
    },
  };

  const fetchTransaksi = useCallback(async () => {
    try {
      const result = await getTransaksi(statusFilter, activeTab, token);
      if (result.status == "200") {
        setAlert({
          type: "success",
          title: "Info",
          message: result.message,
        });
        setDataTransaksi(result.data);
      }
    } catch (error) {
      // //  //  console.log(error)
    }
  }, [statusFilter, activeTab, token]);

  const handlePembayaranSnap = async (item) => {
    setLoadingPage(true);
    try {
      const res = await createSnapTransaksiPembelian(
        {
          data_transaksi: {
            order_id: item.id,
            harga_akhir: Number(item.properties?.harga_akhir),
          },
          detail: user,
        },
        token,
      );
      if (res.status == 200) {
        window.location.href = res.data.redirect_url;
      } else {
        setLoadingPage(false);
        setAlert({
          type: "error",
          title: "Info",
          message: "Gagal membuat transaksi",
        });
        return;
      }
    } catch (error) {
      setLoadingPage(false);
      setAlert({
        type: "error",
        title: "Info",
        message: "Gagal membuat transaksi",
      });
      return;
    } finally {
      setLoadingPage(false);
      return;
    }
  };

  useEffect(() => {
    fetchTransaksi();
  }, [fetchTransaksi]);

  //  //  console.log(dataTransaksi);

  return (
    <div className="p-7 sm:px-4 font-poppins my-7">
      <h2 className="text-center font-bold text-lg mb-4 text-red-700">
        Riwayat Pembelian
      </h2>

      {/* Tabs */}
      <div className="flex text-sm">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-center py-2 border-b-2 transition-all ${
              activeTab === tab
                ? "border-red-700 text-red-700 font-semibold"
                : "border-gray-200 text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filter */}
      <div className="flex justify-end mt-4 mb-2">
        <select
          className="border rounded-md text-sm px-3 py-1"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status Pembayaran</option>
          <option value="pending">Pending</option>
          <option value="success">Sukses</option>
          <option value="failed">Gagal</option>
        </select>
      </div>

      <div className="space-y-4 my-2">
        {!dataTransaksi || dataTransaksi.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
            <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              🧾
            </div>

            <p className="text-sm font-medium text-gray-700">
              Belum ada transaksi &quot;{activeTab}&quot;
            </p>

            <p className="text-xs text-gray-500 mt-1 max-w-sm">
              Transaksi yang kamu lakukan akan muncul di halaman ini setelah
              melakukan pembelian.
            </p>

            <button
              onClick={() =>
                router.push(
                  `${activeTab === "Program Utama" ? "/program-utama" : activeTab === "Tryout" ? "/tryout" : "/kelas-online"}`,
                )
              }
              className="mt-4 px-4 py-2 text-xs font-semibold rounded-md bg-primary text-white hover:bg-primary/90 transition"
            >
              Menuju {activeTab}
            </button>
          </div>
        ) : (
          dataTransaksi?.map((item, idx) => {
            const status = statusLabel[item.status] || statusLabel["pending"];

            return (
              <div
                key={idx}
                className="relative bg-white rounded-md shadow flex overflow-hidden"
              >
                {/* Strip */}
                <div className={`${status.strip} w-2`} />

                <div className="flex-1 p-4">
                  {/* Badge */}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${status.badge}`}
                    >
                      {status.text}
                    </span>
                  </div>

                  {/* Judul */}
                  <h3 className="font-semibold">
                    {item.jenis} |{" "}
                    {activeTab === "Program Utama"
                      ? item.properties?.program_name
                      : activeTab === "Tryout"
                        ? item.properties?.properties?.judul ||
                          item.properties?.program_name ||
                          "Free Tryout"
                        : activeTab === "Kelas Online"
                          ? item.properties?.properties?.judul ||
                            item.properties?.program_name
                          : "-"}
                  </h3>

                  <p className="text-sm text-gray-600">
                    Tanggal Pembelian:{" "}
                    {new Date(item.created_at).toLocaleString("id-ID", {
                      timeZone: "Asia/Jakarta",
                    })}
                  </p>

                  {item.valid_until && (
                    <p className="text-sm text-gray-600">
                      Aktif sampai:{" "}
                      {new Date(item.valid_until).toLocaleString("id-ID", {
                        timeZone: "Asia/Jakarta",
                      })}
                    </p>
                  )}

                  <p className="text-sm text-gray-600 mb-3">
                    Nomor Pembelian: {item.id}
                  </p>

                  {/* ==== JIKA SUDAH ADA NOTIFIKASI ==== */}
                  {item.bank_response ? (
                    <div className="flex flex-col space-y-2 sm:flex-row justify-between border-t-gray-300 border border-transparent py-2 text-sm text-gray-700">
                      <div>
                        Total Pembayaran:
                        <span className="font-semibold block">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(item.bank_response.gross_amount)}
                        </span>
                      </div>

                      <div>
                        Metode Pembayaran:
                        <span className="font-semibold block">
                          {getPaymentLabel(item)}{" "}
                          {item.bank && `- ${item.bank.toUpperCase()}`}
                        </span>
                      </div>

                      {/* QRIS */}
                      {item.bank_response.payment_type === "qris" && (
                        // <button
                        //   onClick={() => setShowQR(item.id)}
                        //   className="px-3 py-1 bg-primary text-white rounded w-fit"
                        // >
                        //   Tampilkan QR
                        // </button>
                        <div>
                          Kode Pembayaran:
                          <span
                            className="font-mono block cursor-pointer hover:text-red-600"
                            onClick={() =>
                              navigator.clipboard.writeText(getVANumber(item))
                            }
                          >
                            {getVANumber(item)}
                          </span>
                        </div>
                      )}

                      {/* VA / Mandiri */}
                      {item.bank_response.payment_type !== "qris" && (
                        <div>
                          Kode Pembayaran:
                          <span
                            className="font-mono block cursor-pointer hover:text-red-600"
                            onClick={() =>
                              navigator.clipboard.writeText(getVANumber(item))
                            }
                          >
                            {getVANumber(item)}
                          </span>
                        </div>
                      )}

                      <div>
                        Status Pembayaran:
                        {item.status === "success" && (
                          <span className="text-green-700 font-semibold">
                            Pembayaran Berhasil ✅
                          </span>
                        )}
                        {item.status === "pending" && (
                          <span className="text-yellow-700 font-semibold">
                            Menunggu Pembayaran
                          </span>
                        )}
                        {item.status === "failed" && (
                          <span className="text-red-700 font-semibold">
                            Pembayaran Gagal
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handlePembayaranSnap(item)}
                      className="py-1 px-3 rounded-md bg-primary text-white text-xs"
                    >
                      Bayar Sekarang
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

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
