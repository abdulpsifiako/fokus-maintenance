import Image from "next/image";

export default function FasilitatorDetail({ data, onBack }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-md  max-w-4xl">
      {/* Header */}
      <h2 className="text-xl font-bold text-red-700 border-b pb-3 mb-6">
        Detail Fasilitator
      </h2>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Foto */}
        <div className="flex flex-col items-center">
          <div className="relative w-56 h-56 rounded-lg border overflow-hidden shadow-sm">
            {data.image ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/landing/images/${data.image}`}
                alt={data.name}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                Tidak ada foto
              </div>
            )}
          </div>
          <p className="mt-3 text-sm text-gray-600 font-medium">
            Foto Fasilitator
          </p>
        </div>

        {/* Informasi */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Nama Fasilitator
            </label>
            <input
              value={data.name || "-"}
              readOnly
              className="border w-full rounded px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Jobdesk
            </label>
            <input
              value={data.jobdesk || "-"}
              readOnly
              className="border w-full rounded px-3 py-2 bg-gray-100"
            />
          </div>

          {/* Properties / Prestasi */}
          {data.properties?.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Prestasi / Keahlian
              </label>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 bg-gray-50 p-3 rounded">
                {data.properties.map((item, idx) => (
                  <li key={idx}>{item.replace(/(^"|"$)/g, "")}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end space-x-3 mt-8">
        <button
          onClick={onBack}
          className="border px-5 py-2 rounded-lg text-red-700 hover:bg-gray-100 transition"
        >
          Kembali
        </button>
      </div>
    </div>
  );
}
