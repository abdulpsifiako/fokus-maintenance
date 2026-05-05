import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Pagination({ totalPages = 5, setCurrentPage, currentPage}) {

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      {/* Tombol Kiri */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
      >
        <FiChevronLeft className="w-5 h-5" />
      </button>

      {/* Nomor Halaman */}
      {[...Array(totalPages)].map((_, i) => {
        const page = i + 1;
        return (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`w-8 h-8 rounded-full text-sm font-medium border ${
              currentPage === page
                ? 'bg-primary text-white border-primary'
                : 'text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* Tombol Kanan */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
      >
        <FiChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
