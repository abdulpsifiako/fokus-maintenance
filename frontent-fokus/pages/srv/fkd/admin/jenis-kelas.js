import { useState } from "react";
import AdminLayout from "@/pages/layouts/adminLayout";
import JenisProgramTable from "@/components/admin/jenisProgramTable";
import JenisProgramForm from "@/components/admin/jenisProgramForm";
import JenisProgramDetail from "@/components/admin/jenisProgramDetail";
import JenisKelasTable from "@/components/admin/jenisKelasTable";
import JenisKelasForm from "@/components/admin/jenisKelasForm";
import JenisKelasDetail from "@/components/admin/jenisKelasDetail";

function JenisKelas() {
  const [mode, setMode] = useState("table"); // table | add | edit | detail
  const [selectedData, setSelectedData] = useState(null);

  const handleAdd = () => {
    setSelectedData(null);
    setMode("add");
  };

  const handleEdit = (data) => {
    setSelectedData(data);
    setMode("edit");
  };

  const handleDetail = (data) => {
    setSelectedData(data);
    setMode("detail");
  };

  const handleBack = () => {
    setSelectedData(null);
    setMode("table");
  };

  return (
    <>
      {mode === "table" && (
        <JenisKelasTable onAdd={handleAdd} onEdit={handleEdit} onDetail={handleDetail} />
      )}
      {mode === "add" && <JenisKelasForm mode="add" onBack={handleBack} />}
      {mode === "edit" && (
        <JenisKelasForm mode="edit" data={selectedData} onBack={handleBack} />
      )}
      {mode === "detail" && (
        <JenisKelasDetail data={selectedData} onBack={handleBack} />
      )}
    </>
  );
}

JenisKelas.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default JenisKelas;
