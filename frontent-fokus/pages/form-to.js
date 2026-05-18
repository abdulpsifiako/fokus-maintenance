import { useState, useEffect } from "react";
import Image from "next/image";
import TransaksiDiprosesModal from "@/components/user/modalTunggu";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { freeTryout } from "@/lib/axios/tryout";
import Cookies from "js-cookie";
import Link from "next/link";

export default function FormUploadGratis() {
  const token = Cookies.get("token");
  const router = useRouter();
  const datTransaksi = useSelector((state) => state.transaksi.program_utama);
  const dataLatihanTO = useSelector((state) => state.tryout.dataLatihan);
  const [files, setFiles] = useState({
    follow: null,
    komentar: null,
    repost: null,
  });

  const [modalTunggu, setModalTunggu] = useState(false);

  const [previews, setPreviews] = useState({
    follow: null,
    komentar: null,
    repost: null,
  });

  // 🧩 handle input change
  const handleChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [field]: file }));

      // buat object URL untuk preview
      const objectUrl = URL.createObjectURL(file);
      setPreviews((prev) => ({ ...prev, [field]: objectUrl }));
    }
  };

  useEffect(() => {
    return () => {
      Object.values(previews).forEach((url) => url && URL.revokeObjectURL(url));
    };
  }, [previews]);

  useEffect(() => {
    if (!datTransaksi) {
      router.push("/program-utama");
    }
  }, [router, datTransaksi]);

  if (!datTransaksi) {
    return null;
  }

  const handleKirim = () => {
    // Cek apakah semua file preview sudah terisi
    const allFilled = Object.values(previews).every((val) => val !== null);

    if (!allFilled) {
      alert("Harap unggah semua bukti terlebih dahulu!");
      return;
    }

    // Jika semua sudah diisi, baru tampilkan modal
    setModalTunggu(true);
  };

  const handleFreeTryout = async () => {
    try {
      const res = await freeTryout({ data_transaksi: datTransaksi }, token);
      if (res.status == 200) {
        router.push("/pembelian");
      }
    } catch (error) {
      // //  //  console.log(error)
    }
  };

  return (
    <div className="p-7 font-poppins my-7">
      <p className="text-red-700 font-semibold mb-3">Try Out Gratis</p>

      <p className="font-semibold text-sm mb-2">Persyaratan</p>
      <ul className="list-disc list-inside text-sm mb-5 text-gray-700">
        <li>
          Ikuti akun Instagram{" "}
          <Link
            href="https://www.instagram.com/fokusedu/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-medium hover:underline"
          >
            @fokusedu
          </Link>{" "}
          &{" "}
          <Link
            href="https://www.instagram.com/fokusedu.academy/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-medium hover:underline"
          >
            @fokusedu.academy
          </Link>
        </li>
        <li>
          Komentar dan tag 5 teman kamu di{" "}
          <a
            href={`${dataLatihanTO.link}`}
            target="_blank"
            className="text-blue-600 underline"
          >
            Postingan ini
          </a>
        </li>
        <li>Repost ke story instagram kamu postingan ini dan mention kami</li>
      </ul>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Form Upload */}
        <div className="space-y-5">
          <p className="font-semibold text-sm">Unggah Bukti Persyaratan</p>

          {/* Upload 1 */}
          <UploadBox
            label="• Follow akun instagram @fokusedu & @fokusedu.academy"
            field="follow"
            file={files.follow}
            preview={previews.follow}
            onChange={handleChange}
          />

          {/* Upload 2 */}
          <UploadBox
            label={
              <>
                • Tulis Komentar dan tag 5 teman di{" "}
                <a href="#" className="text-blue-600 underline">
                  postingan ini
                </a>
              </>
            }
            field="komentar"
            file={files.komentar}
            preview={previews.komentar}
            onChange={handleChange}
          />

          {/* Upload 3 */}
          <UploadBox
            label={
              <>
                • Repost ke story instagram kamu{" "}
                <a href="#" className="text-blue-600 underline">
                  postingan ini
                </a>{" "}
                dan mention kami
              </>
            }
            field="repost"
            file={files.repost}
            preview={previews.repost}
            onChange={handleChange}
          />

          <button
            type="button"
            onClick={handleKirim}
            className="bg-red-700 hover:bg-red-800 text-white w-full py-2 rounded text-sm mt-2"
          >
            Kirim
          </button>
        </div>

        {/* Gambar Ilustrasi */}
        <div className="flex justify-center items-center">
          <Image
            src="/uto.png"
            alt="Ilustrasi"
            width={5000}
            height={5000}
            className="object-cover w-72"
          />
        </div>
      </div>
      {modalTunggu && (
        <TransaksiDiprosesModal
          onClose={() => {
            setModalTunggu(false);
            handleFreeTryout();
          }}
        />
      )}
    </div>
  );
}

// 🔸 Komponen kecil untuk tiap upload box
const UploadBox = ({ label, field, file, preview, onChange }) => {
  return (
    <div>
      <p className="text-sm mb-2">{label}</p>

      <label className="border rounded-md h-40 flex flex-col items-center justify-center text-gray-500 text-xs gap-2 cursor-pointer hover:bg-gray-50 relative overflow-hidden">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onChange(e, field)}
          className="hidden"
        />

        {preview ? (
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            <Image
              src={preview}
              alt="Preview"
              width={300}
              height={300}
              className="object-cover"
            />
            <p className="absolute bottom-1 right-2 text-[10px] text-green-600 bg-white/70 px-1 rounded">
              File dipilih
            </p>
          </div>
        ) : (
          <>
            <span className="text-red-400 text-2xl">📷</span>
            Upload Image
          </>
        )}
      </label>
    </div>
  );
};
