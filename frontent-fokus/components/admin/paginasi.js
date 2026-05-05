import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";

export default function Pagination({page, totalPage, next, prev, setPage}) {
  return (
    <div className="flex items-center gap-2 text-sm mt-4">
      
      {/* <button disabled={prev} className={`${prev ? "text-gray-700":"text-gray-400"}`}>
        <ChevronsLeft size={18} />
      </button> */}
      <button disabled={!prev} onClick={()=>setPage(page-1)} className={`${prev ? "text-gray-700":"text-gray-400"}`}>
        <ChevronLeft size={18} />
      </button>
      <span>Halaman {page} of {totalPage}</span>
      <button disabled={!next} onClick={()=>setPage(page+1)} className={`${next ? "text-gray-700":"text-gray-400"}`}>
        <ChevronRight size={18} />
      </button>
      {/* <button disabled={next} className={`${next ? "text-gray-700":"text-gray-400"}`}>
        <ChevronsRight size={18} />
      </button> */}
    </div>
  );
}
