import { useState } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import KelasOnlineTable from "@/components/admin/tableKelasOnline";
import TambahKelasOnline from "@/components/admin/formKelasOnline";
import AdminLayout from "@/pages/layouts/adminLayout";

function KelasOnline() {
  const [mode, setmode] = useState("table");
  const [selectedItem, setSelectedItem] = useState(null);
  return (
    <>
      {mode === "table" && (
        <KelasOnlineTable
          setMode={setmode}
          onEdit={(item) => {
            setSelectedItem(item);
            setmode("edit");
          }}
        />
      )}
      {(mode === "form" || mode === "edit") && (
        <TambahKelasOnline
          setMode={setmode}
          mode={mode}
          data={selectedItem}
          onCancel={() => {
            setmode("table");
            setSelectedItem(null);
          }}
        />
      )}
    </>
  );
}
KelasOnline.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default KelasOnline;
