import LoadingModal from "@/components/public/loadingModal";
import { getProgram } from "@/lib/axios/program";
import { addNewPropertiesTransaksi } from "@/lib/redux/store/transaksi";
import { Check } from "lucide-react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { createTransaksiFreeProgram } from "@/lib/axios/transaksi";
export default function Paket() {
  const token = Cookies.get("token");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const datTransaksi = useSelector((state) => state.transaksi.program_utama);
  const [data, setData] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("created_at|desc");

  const fetchData = useCallback(async () => {
    try {
      const res = await getProgram(page, limit, search, null, true);
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

  useEffect(() => {
    if (!datTransaksi) {
      router.push("/program-utama");
    }
  }, [router, datTransaksi]);

  if (!datTransaksi) {
    return null;
  }

  return (
    <>
      <h1 className="font-semibold text-xl mt-8 text-center">
        Pilih Paket Belajar Sesuai Kebutuhanmu!
      </h1>
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
                            <p className="text-justify font-light">
                              {feat.sub}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer */}
                  <div className="text-center p-6">
                    <button
                      onClick={async () => {
                        try {
                          if (finalPrice === 0) {
                            // //  //  console.log("Ini final ", datTransaksi)
                            dispatch(
                              addNewPropertiesTransaksi({
                                bulan: Number(durasi),
                                harga: finalPrice,
                                harga_akhir: 0,
                              })
                            );
                            setLoading(true); // tampilkan modal loading
                            await new Promise((resolve) =>
                              setTimeout(resolve, 2000)
                            );

                            const res = await createTransaksiFreeProgram(
                              { data_transaksi: datTransaksi },
                              token
                            );

                            router.push("/pembelian");
                          } else {
                            setLoading(true); // tampilkan modal loading
                            await new Promise((resolve) =>
                              setTimeout(resolve, 2000)
                            );
                            dispatch(
                              addNewPropertiesTransaksi({
                                bulan: Number(durasi),
                                harga: finalPrice,
                              })
                            );
                            router.push("/pembayaran");
                          }
                        } catch (error) {
                          // //  //  console.log(error)
                        }
                      }}
                      className="bg-secondary hover:bg-red-700 text-white text-sm font-semibold px-6 py-3 rounded-md shadow transition-all"
                    >
                      Ambil Paket
                    </button>
                  </div>
                </div>
              );
            })}
        </div>

        <LoadingModal show={loading} />
      </div>
    </>
  );
}
