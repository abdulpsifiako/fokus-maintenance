import FasilitatorDetail from "@/components/admin/fasilitatorDetail";
import FasilitatorForm from "@/components/admin/fasilitatorForm";
import FasilitatorTable from "@/components/admin/fasilitatorTable";
import AdminLayout from "@/pages/layouts/adminLayout";
import Cookies from "js-cookie"
import { useState } from "react";

function Fasilitator() {
  const token = Cookies.get("token")
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
        <FasilitatorTable onAdd={handleAdd} onEdit={handleEdit} onDetail={handleDetail} token={token}/>
      )}
      {mode === "add" && (
        <FasilitatorForm mode="add" onBack={handleBack} />
      )}
      {mode === "edit" && (
        <FasilitatorForm mode="edit" data={selectedData} onBack={handleBack} />
      )}
      {mode === "detail" && (
        <FasilitatorDetail data={selectedData} onBack={handleBack} />
      )}
    </>
  );
}

Fasilitator.getLayout = function getLayout(page){
    return<AdminLayout>{page}</AdminLayout>
}

export default Fasilitator;