import Image from "next/image";
import { TbUsersPlus } from "react-icons/tb";

export default function PengajarPanel({ data }) {
  return (
    <>
      {/* Header Pengajar */}
      {/* <div className="flex items-center gap-3 font-poppins">
        <div className="flex -space-x-5 py-3">
          {data.properties?.pengajar.map((img, i) => (
            <div key={i} className="relative w-11 h-11">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/landing/images/${img?.foto}`}
                alt={`avatar-${i}`}
                fill
                className="rounded-full border-2 border-white object-cover shadow"
                style={{ zIndex: 50 + i }}
              />
            </div>
          ))}
        </div>

        <p className="text-sm font-medium text-gray-700">
          {data.properties.pengajar.length > 0
            ? data.properties.pengajar.length
            : "Belum ada"}{" "}
          pengajar
        </p>
      </div> */}

      {/* Deskripsi */}
      <div className="mt-3 space-y-2 p-3">
        <h2 className="text-sm font-semibold text-gray-800">Deskripsi</h2>

        <p className="text-sm text-gray-600 leading-relaxed text-justify">
          {data.properties.deskripsi}
        </p>

        {/* CTA */}
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
    </>
  );
}
