import { LatihanForm } from "@/components/admin/latihanForm";
import { LatihanList } from "@/components/admin/latihanList";
import AdminLayout from "@/pages/layouts/adminLayout";
import { useState } from "react";

const Latihan = () => {
  const [mode, setMode] = useState("list");
  const [selected, setSelected] = useState(null);
  return (
    <div className="space-x-4">
      {mode === "list" && (
        <LatihanList
          onEdit={(item) => {
            setMode("edit");
            setSelected(item);
          }}
          onAdd={() => {
            setMode("add");
          }}
          onView={(item) => {
            setMode("view");
            setSelected(item);
          }}
        />
      )}
      {(mode === "add" || mode === "edit" || mode === "view") && (
        <LatihanForm
          data={selected}
          setSelected={setSelected}
          mode={mode}
          onBack={() => {
            setMode("list");
            setSelected(null);
          }}
        />
      )}
    </div>
  );
};

Latihan.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Latihan;
