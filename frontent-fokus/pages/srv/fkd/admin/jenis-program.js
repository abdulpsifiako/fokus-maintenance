import { useState } from "react";
import AdminLayout from "@/pages/layouts/adminLayout";
import JenisProgramTable from "@/components/admin/jenisProgramTable";
import JenisProgramForm from "@/components/admin/jenisProgramForm";
import JenisProgramDetail from "@/components/admin/jenisProgramDetail";

function JenisProgram() {
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
        <JenisProgramTable onAdd={handleAdd} onEdit={handleEdit} onDetail={handleDetail} />
      )}
      {mode === "add" && <JenisProgramForm mode="add" onBack={handleBack} />}
      {mode === "edit" && (
        <JenisProgramForm mode="edit" data={selectedData} onBack={handleBack} />
      )}
      {mode === "detail" && (
        <JenisProgramDetail data={selectedData} onBack={handleBack} />
      )}
    </>
  );
}

JenisProgram.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default JenisProgram;
