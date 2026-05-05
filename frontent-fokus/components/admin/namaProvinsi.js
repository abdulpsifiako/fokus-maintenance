"use client";
import { getProvinsi } from "@/lib/axios/users";
import { useEffect, useState } from "react";

const NamaProvinsi = ({ id }) => {
  const [nama, setNama] = useState("-");

  useEffect(() => {
    const fetchNama = async () => {
      try {
        const res = await getProvinsi();
        const prov = res.find((e) => e.id === id);
        if (prov) setNama(prov.name);
      } catch (error) {
        // //  //  console.log(error);
      }
    };

    if (id) {
      fetchNama();
    }
  }, [id]);

  return <span>{nama}</span>;
};

export default NamaProvinsi;
