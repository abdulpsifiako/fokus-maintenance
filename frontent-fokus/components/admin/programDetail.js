import { FiCheckCircle, FiXCircle } from "react-icons/fi";

export default function ProgramDetail({ data, onBack }) {
  if (!data) return null;

  const form = data.properties;

  const hitungHargaAkhir = () => {
    const harga = parseFloat(form.harga) || 0;
    const diskon = parseFloat(form.diskon_value) || 0;

    if (!form.diskon_aktif) return harga;
    if (form.diskon_tipe === "nominal") {
      return Math.max(harga - diskon, 0);
    } else if (form.diskon_tipe === "persen") {
      return Math.max(harga - harga * (diskon / 100), 0);
    }
    return harga;
  };

  return (
    <div className="p-6 font-poppins">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-red-700">
          Detail Paket Program
        </h2>
        <button
          type="button"
          onClick={onBack}
          className="border border-red-700 text-red-700 px-4 py-2 rounded hover:bg-red-50"
        >
          Kembali
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Nama Paket */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Nama Paket</label>
          <p className="p-2 border border-gray-300 rounded bg-gray-50">
            {form.name}
          </p>
        </div>

        {/* Harga */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Harga</label>
          <p className="p-2 border border-gray-300 rounded bg-gray-50">
            Rp {parseFloat(form.harga || 0).toLocaleString()}
          </p>
        </div>

        {/* Durasi Paket */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Durasi Paket</label>
          <p className="p-2 border border-gray-300 rounded bg-gray-50">
            {form.durasi} Bulan
          </p>
        </div>

        {/* Link Group */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Link Grup</label>
          <a
            href={form.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {form.link}
          </a>
        </div>

        {/* Diskon */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
          <label className="font-medium text-gray-700">Diskon</label>
          <div className="flex items-center gap-2">
            {form.diskon_aktif ? (
              <FiCheckCircle className="text-green-600" />
            ) : (
              <FiXCircle className="text-red-600" />
            )}
            <span>
              {form.diskon_aktif
                ? `Aktif (${form.diskon_tipe}: ${form.diskon_value})`
                : "Tidak Aktif"}
            </span>
          </div>
          {form.diskon_aktif && (
            <p className="text-sm text-gray-700">
              Harga Akhir:{" "}
              <span className="font-bold">
                Rp {hitungHargaAkhir().toLocaleString()}
              </span>
            </p>
          )}
        </div>

        {/* Deskripsi */}
        <div className="col-span-1 md:col-span-2">
          <label className="mb-2 font-medium text-gray-700">
            Deskripsi Paket Program
          </label>
          <ul className="list-disc ml-5 text-gray-700 space-y-1">
            {form.deskripsi?.map((desc, idx) => (
              <li key={idx}>{desc}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
