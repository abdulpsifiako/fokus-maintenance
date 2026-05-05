"use client";
import { getKabKota } from "@/lib/axios/users";
import { useEffect, useState } from "react";

const NamaKabupaten = ({ idProv, idKabKota }) => {
  const [nama, setNama] = useState("-");

  useEffect(() => {
    const fetchNama = async () => {
      try {
        const res = await getKabKota(idProv);
        const kabKota = res.find((e) => e.id == idKabKota);
        if (kabKota) setNama(kabKota.name);
      } catch (error) {
        // //  //  console.log(error);
      }
    };

    if (idProv || idKabKota) {
      fetchNama();
    }
  }, [idProv, idKabKota]);

  return <span>{nama}</span>;
};

export default NamaKabupaten;
