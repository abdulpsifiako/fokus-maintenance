import { getListJenisKelas } from "@/lib/axios/jenisKelas";
import { getListJenisProgram } from "@/lib/axios/jenisProgram";
import { useCallback, useEffect, useState } from "react";

const tabs = ["Semua", "PPPK", "CPNS"];

export default function FilterTabsKelas({ filterBar }) {
  const [active, setActive] = useState("Semua");

  const [data, setData] = useState(["Semua"]);

  const fetchData = useCallback(async () => {
    try {
      const res = await getListJenisKelas({ status: true });

      const names = res.data.map((item) => item.name).reverse();
      setData(["Semua", ...names]);
    } catch (error) {
      // //  //  console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <div className="border-b border-gray-300">
      <div className="flex space-x-6">
        {data.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActive(tab);
              filterBar(tab);
            }}
            className={`relative pb-2 text-sm font-semibold transition-colors duration-200 ${
              active === tab
                ? "text-black"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab}
            {active === tab && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
