import { useState } from "react";
import AdminLayout from "@/pages/layouts/adminLayout";
import JenisToTable from "@/components/admin/jenisToTable";
import JenisToForm from "@/components/admin/jenisToForm";
import JenisToDetail from "@/components/admin/jenisToDetail";

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
        <JenisToTable onAdd={handleAdd} onEdit={handleEdit} onDetail={handleDetail} />
      )}
      {mode === "add" && <JenisToForm mode="add" onBack={handleBack} />}
      {mode === "edit" && (
        <JenisToForm mode="edit" data={selectedData} onBack={handleBack} />
      )}
      {mode === "detail" && (
        <JenisToDetail data={selectedData} onBack={handleBack} />
      )}
    </>
  );
}

JenisKelas.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default JenisKelas;
