import dayjs from "dayjs";
import NamaProvinsi from "./namaProvinsi";
import NamaKabupaten from "./namaKabupaten";

export default function ModalDetail({ open, setOpenModal, data }) {
  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center font-poppins bg-gray-300/60 backdrop-blur-sm">
      <div className="bg-white rounded-md shadow-md max-w-lg w-full p-6 space-y-4">
        <h2 className="text-lg font-bold text-center">Detail User</h2>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
          <div>
            <span className="font-semibold">Nama</span>
            <p>{data.name || "-"}</p>
          </div>
          <div>
            <span className="font-semibold">Username</span>
            <p>{data.username || "-"}</p>
          </div>
          <div>
            <span className="font-semibold">Email</span>
            <p>{data.email || "-"}</p>
          </div>
          <div>
            <span className="font-semibold">No. WhatsApp</span>
            <p>{data.no_wa || "-"}</p>
          </div>
          <div>
            <span className="font-semibold">Provinsi</span>
            <p>{data.provinsi ? <NamaProvinsi id={data.provinsi}/>: "-"}</p>
          </div>
          <div>
            <span className="font-semibold">Kabupaten/Kota</span>
            <p>{data.kota_kab ?<NamaKabupaten idProv={data.provinsi} idKabKota={data.kota_kab}/>: "-"}</p>
          </div>
          <div>
            <span className="font-semibold">Tingkat Pendidikan</span>
            <p>{data.tingkat_pend || "-"}</p>
          </div>
          <div>
            <span className="font-semibold">Instagram</span>
            <p>{data.instagram || "-"}</p>
          </div>
          <div>
            <span className="font-semibold">Status Akun</span>
            <p className={data.is_active ? "text-green-600" : "text-red-500"}>
              {data.is_active ? "Aktif" : "Tidak Aktif"}
            </p>
          </div>
          <div>
            <span className="font-semibold">Tanggal Daftar</span>
            <p>{dayjs(data.created_at).format("DD MMMM YYYY, HH:mm")} WIB</p>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={() => setOpenModal(false)}
            className="border border-red-500 text-red-600 px-4 py-1 rounded hover:bg-red-50 text-sm"
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
