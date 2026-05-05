import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import Image from "next/image";
import { BiSolidDiscount } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { addNewPropertiesTransaksi } from "@/lib/redux/store/transaksi";
import { cekVoucher, createTransaksi } from "@/lib/axios/transaksi";
import Cookies from "js-cookie";
import LoadingModal from "@/components/public/loadingModal";

export default function PilihMetodeBayar() {
  const [loading, setLoading] = useState(false);

  const [loadingPage, setLoadingPage] = useState(false);
  const token = Cookies.get("token");
  const dispatch = useDispatch();
  const router = useRouter();
  const datTransaksi = useSelector((state) => state.transaksi.program_utama);
  const user = useSelector((state) => state.user.detail);
  const [valueVoucher, setValueVoucher] = useState(0);
  const [tipe, setTipe] = useState("");
  const [voucherName, setVoucherName] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [metodeBayar, setMetodeBayar] = useState(null);
  const [modalResume, setModalResume] = useState(null);
  const handleSelect = (method) => {
    dispatch(addNewPropertiesTransaksi({ ...method }));
    setMetodeBayar(method);
    setShowModal(false);
  };

  const qrisList = [{ name: "QRIS", img: "/qris.png", admin: 540 }];

  const vaList = [
    { name: "Mandiri", img: "/mandiri.png", admin: 5400 },
    { name: "BCA", img: "/bca.png", admin: 5400 },
    { name: "BRI", img: "/bri.png", admin: 5400 },
    { name: "Permata", img: "/permata.png", admin: 5400 },
    { name: "BNI", img: "/bni.png", admin: 5400 },
    { name: "CIMB", img: "/cimb.png", admin: 5400 },
  ];

  const ewalletList = [{ name: "ShopeePay", img: "/shopee.png", admin: 1000 }];

  useEffect(() => {
    if (!datTransaksi) {
      router.push("/");
    }
  }, [router, datTransaksi]);

  if (!datTransaksi) {
    return null;
  }

  const handleProcess = async () => {
    try {
      setLoadingPage(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const res = await createTransaksi(
        { data_transaksi: datTransaksi, detail: user },
        token
      );
      router.push("/pembelian");
    } catch (error) {
      // //  //  console.log(error)
    }
  };
  const handleVoucher = async () => {
    try {
      setLoadingPage(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const res = await cekVoucher({ name: voucherName }, token);
      setLoadingPage(false);
      if (res.data.nilai > 0) {
        setTipe(res.data.tipe);
        setValueVoucher((prev) => (prev = res.data.nilai));
      }
    } catch (error) {
      // //  //  console.log(error)
    }
  };
  return (
    <div className="max-w-md mx-auto bg-white  p-5 font-poppins sm:my-30">
      <h2 className="font-bold text-md">Detail Pembelian</h2>
      <p className="text-xs">{datTransaksi.program_name}</p>
      <h3 className="text-lg font-bold mt-2">
        Rp {Number(datTransaksi?.harga).toLocaleString("id-ID")}
      </h3>
      <input
        type="text"
        onChange={(e) => {
          setVoucherName(e.target.value);
        }}
        placeholder="Referal Kode/Voucher"
        className="border border-gray-400 focus:outline-gray-400 w-full px-3 py-2 mt-3 rounded-md text-sm"
      />

      <button
        onClick={handleVoucher}
        className="w-full bg-red-700 flex items-center gap-2 justify-center text-white text-sm py-2 rounded mt-3"
      >
        Cek kode <BiSolidDiscount size={20} />
      </button>
      <div
        className="border mt-3 py-2 px-3 rounded cursor-pointer flex flex-col items-center justify-center gap-2"
        onClick={() => setShowModal(true)}
      >
        {metodeBayar ? (
          <>
            <div className="p-5">
              <Image
                src={metodeBayar.img}
                alt={metodeBayar.name}
                width={200}
                height={200}
              />
            </div>
            {/* <span className="text-sm">{metodeBayar.name}</span> */}
          </>
        ) : (
          <span className="text-sm text-gray-500">Pilih Metode Pembayaran</span>
        )}
      </div>

      <div className="text-sm mt-3">
        <div className="flex justify-between font-normal text-xs">
          <span className="">Harga</span>
          <span>{datTransaksi.harga.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between font-normal text-xs">
          <span>Admin Fee</span>
          <span>{(metodeBayar?.admin || 0).toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between font-normal text-xs">
          <span>Potongan harga</span>
          <span>{Number(valueVoucher || 0).toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Total Harga</span>
          <span>
            Rp{" "}
            {(
              Number(datTransaksi.harga) +
                Number(metodeBayar?.admin) -
                Number(valueVoucher) || 0
            ).toLocaleString("id-ID")}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={async () => {
          setLoadingPage(true);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          dispatch(
            addNewPropertiesTransaksi({
              harga_akhir:
                Number(datTransaksi.harga) +
                  Number(metodeBayar?.admin) -
                  Number(valueVoucher) || 0,
              tipe: tipe,
              voucherCode: voucherName,
            })
          );
          setModalResume(true);
          setLoadingPage(false);
        }}
        className={`${metodeBayar ? "bg-red-700" : "bg-gray-400 cursor-not-allowed"}  text-white w-full py-2 rounded text-sm mt-4 cursor-pointer`}
        disabled={metodeBayar ? false : true}
      >
        Bayar Sekarang
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex justify-center items-center z-50">
          <div
            className="bg-white rounded-lg w-full max-w-3xl p-6 relative 
                            max-h-[90vh] overflow-y-auto"
          >
            <button
              className="absolute right-3 top-3 text-gray-500 hover:text-black"
              onClick={() => setShowModal(false)}
            >
              <FaTimes />
            </button>

            <h2 className="text-lg font-bold mb-4">Pilih Metode Pembayaran</h2>

            {/* QRIS */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">QRIS</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {qrisList.map((mtd, idx) => (
                  <PaymentOption
                    key={idx}
                    method={mtd}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            </div>

            {/* Virtual Account */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Virtual Account</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {vaList.map((mtd, idx) => (
                  <PaymentOption
                    key={idx}
                    method={mtd}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            </div>

            {/* E-Wallet */}
            {/* <div>
                <h3 className="font-semibold mb-2">E-Wallet</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {ewalletList.map((mtd, idx) => (
                    <PaymentOption key={idx} method={mtd} onSelect={handleSelect} />
                  ))}
                </div>
              </div> */}
          </div>
        </div>
      )}
      {modalResume && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto shadow-lg">
            {/* Tombol Close */}
            <button
              className="absolute right-3 top-3 text-gray-500 hover:text-black"
              onClick={() => setModalResume(false)}
              disabled={loading}
            >
              <FaTimes />
            </button>

            {/* Judul */}
            <h2 className="text-lg font-bold mb-6">Ringkasan Pembelian</h2>

            {/* Isi Resume */}
            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium">Program</span>
                <span>{datTransaksi.program_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Jenis</span>
                <span>{datTransaksi.jenis}</span>
              </div>
              <div className="flex flex-col justify-between">
                <div className="text-center">
                  <span className="font-medium">Metode</span>
                </div>
                <div className="justify-center m-auto">
                  <Image
                    src={datTransaksi.img}
                    alt={datTransaksi.name}
                    width={200}
                    height={200}
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Harga</span>
                <span>
                  Rp {datTransaksi.harga_akhir.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Status</span>
                <span className="text-green-600 font-semibold">Dibuat</span>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
                onClick={() => setModalResume(false)}
                disabled={loading}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-red-500 flex items-center justify-center"
                onClick={handleProcess}
                disabled={loading}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Process"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <LoadingModal show={loadingPage} />
    </div>
  );
}

// Komponen Reusable untuk metode pembayaran
function PaymentOption({ method, onSelect }) {
  return (
    <div
      className="border p-3 rounded cursor-pointer hover:shadow-md text-center flex flex-col items-center"
      onClick={() => onSelect(method)}
    >
      <Image src={method.img} alt={method.name} width={40} height={40} />
      <p className="text-xs mt-2">{method.name}</p>
      <p className="text-[10px] text-gray-400">
        Biaya admin: Rp {method.admin}
      </p>
    </div>
  );
}
