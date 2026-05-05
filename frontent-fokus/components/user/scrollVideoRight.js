import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function ScrollVideoRight({data, onSelectVideo}) {
  const scrollRef = useRef(null);

 const mapped = data?.flatMap(item =>
    item.properties.video.map(video => ({
      deskripsi:video.deskripsi,
      title: video.name,
      thumbnail: video.thumbnail,
      pengajar: video.data_pengajar?.[0]?.name || "",
      kategori: video.kategori,
      videoUrl: video.video,
      foto_pengajar: video.data_pengajar?.[0]?.foto || "",
      jobdesk:video.data_pengajar?.[0]?.jobdesk||""
    }))
  );

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo =
        direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="mt-6 w-full">
      {/* Header dengan judul dan tombol kanan */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-sm">Video Lainnya</h3>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-8 h-8 border border-black rounded-full flex items-center justify-center"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-8 h-8 border border-black rounded-full flex items-center justify-center"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Video scrollable list */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto space-x-4 scroll-smooth scrollbar-hide"
      >
        {mapped?.map((video, index) => (
          <div
            key={index}
            className="min-w-[250px] max-w-[250px] bg-white border border-gray-300 rounded-md shadow-sm shrink-0 my-3 cursor-pointer"
            onClick={()=>onSelectVideo(video)}
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/landing/images/${video.thumbnail}`}
              alt={video.title}
              width={500}
              height={500}
              className="w-full h-[140px] object-contain rounded-t-md"
            />
            <div className="p-2 text-xs font-medium">{video.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
