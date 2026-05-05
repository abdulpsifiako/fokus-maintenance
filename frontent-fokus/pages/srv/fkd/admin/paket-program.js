import ProgramDetail from "@/components/admin/programDetail";
import ProgramForm from "@/components/admin/programForm";
import ProgramTable from "@/components/admin/programTable";
import AdminLayout from "@/pages/layouts/adminLayout";
import { useState } from "react";

function Program() {
  const [mode, setMode] = useState("table"); // 'table' | 'add' | 'edit' | 'detail'
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
    setMode("table");
    setSelectedData(null);
  };

  return (
    <>
      {mode === "table" && (
        <ProgramTable onAdd={handleAdd} onEdit={handleEdit} onDetail={handleDetail} />
      )}
      {mode === "add" && (
        <ProgramForm mode="add" onBack={handleBack} />
      )}
      {mode === "edit" && (
        <ProgramForm mode="edit" data={selectedData} onBack={handleBack} />
      )}
      {mode === "detail" && (
        <ProgramDetail data={selectedData} onBack={handleBack} />
      )}
    </>
  );
}

Program.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Program;
