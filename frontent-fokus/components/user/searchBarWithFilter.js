
import { useState } from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';

export default function SearchBarWithFilter({filterBar, search, setSearch, setFilter, filter}) {

  return (
    <div className="flex flex-col sm:flex-row sm:gap-4 max-w-md my-4">
      {/* Search Input */}
      <div className={`${filterBar ? 'w-full':'sm:w-1/2'} flex items-center border border-gray-300 rounded-md px-4 py-2 mb-2 sm:mb-0`}>
        <input
          type="text"
          placeholder="Cari..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="grow outline-none bg-transparent text-xs pr-2"
        />
        <FiSearch className="text-gray-500 text-sm" />
      </div>

      {/* Filter Select */}
      {
        filterBar ? (
          <div className="flex items-center w-full sm:w-auto border border-gray-300 rounded-md px-4 py-2 text-xs font-medium">
            <FiFilter className="text-sm mr-2" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent outline-none text-xs w-full sm:w-auto"
            >
              <option value="created_at|desc">Terakhir Rilis</option>\
              <option value="name|asc">Nama A-Z</option>
              <option value="name|desc">Nama Z-A</option>
            </select>
          </div>
        ):''
      }
    </div>
  );
}
