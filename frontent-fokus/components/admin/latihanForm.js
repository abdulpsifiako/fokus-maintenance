import { LatihanDetail } from "./latihanDetail";
import { LatihanAdd } from "./latihanAdd";
import { useCallback, useEffect, useState } from "react";
import {
  createLatihanProgram,
  getListProgramUtamaLatihan,
  updateLatihanProgram,
} from "@/lib/axios/programUtama";
import Cookies from "js-cookie";
import Alert from "../public/alert";

export const LatihanForm = ({ mode, onBack, data, setSelected }) => {
  const [alert, setAlert] = useState(null);
  const token = Cookies.get("token");
  const [activePage, setActivePage] = useState(mode);
  // const [materi, setMateri] =useState(data?.properties?.materi_id||"")
  const [infoProgram, setInfoProgram] = useState(null);
  //   const [dataMateri, setDataMateri] = useState(null);
  const [editData, setEditData] = useState(null);
  const [itemIdx, setItemidx] = useState(0);
  const [form, setForm] = useState({
    program_id: data?.properties?.program_id || "",
    program_utama: data?.properties?.program_utama || "",
    // materi_id:data?.properties?.materi_id||"",
    materi: data?.properties?.materi || "",
    status: data?.properties?.status || true,
    latihan: data?.properties?.latihan || [],
  });
  const getProgramUtamaLatihan = useCallback(async () => {
    try {
      const res = await getListProgramUtamaLatihan(token);
      setInfoProgram(res.data);
    } catch (error) {
      // //  //  console.log(error)
    }
  }, [token]);
  const createOrUpdateLatihan = async () => {
    try {
      let res;
      if (mode === "add") {
        res = await createLatihanProgram(form, token);
      } else {
        res = await updateLatihanProgram(data.id, form, token);
      }
      if (res.status == 200) {
        setAlert({
          type: "success",
          title: "Info",
          message: res.message,
        });
      }
      setTimeout(() => {
        onBack();
      }, 3000);
    } catch (error) {
      // //  //  console.log(error)
    }
  };

  useEffect(() => {
    getProgramUtamaLatihan();
  }, [getProgramUtamaLatihan]);
  return (
    <div className="lg:mx-5">
      {(activePage === "add" ||
        activePage === "edit" ||
        activePage === "view") && (
        <LatihanDetail
          //   dataMateri={dataMateri}
          //   setDataMateri={setDataMateri}
          infoProgram={infoProgram}
          form={form}
          setForm={setForm}
          onEditLatihan={(data, idx) => {
            setEditData(data);
            setItemidx(idx);
            setActivePage("onEditLatihan");
          }}
          mode={mode}
          onBack={() => {
            setSelected(null);
            onBack();
          }}
          onAddLatihan={(id) => {
            setActivePage("onAddLatihan");
            // setMateri(id)
          }}
          submit={createOrUpdateLatihan}
        />
      )}
      {(activePage === "onAddLatihan" || activePage === "onEditLatihan") && (
        <LatihanAdd
          idx={itemIdx}
          data={editData}
          setForm={setForm}
          //   materiId={materi}
          mode={activePage}
          onBack={() => {
            setEditData(null);
            setActivePage("add");
          }}
        />
      )}
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
};
