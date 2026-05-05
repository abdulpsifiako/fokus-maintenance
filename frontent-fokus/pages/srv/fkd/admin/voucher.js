import { useState } from "react";
import AdminLayout from "@/pages/layouts/adminLayout";
import { VoucherList } from "@/components/admin/voucherList";
import TambahVoucherForm from "@/components/admin/voucherForm";

function VoucherTable() {
  const [mode, setMode] = useState("list");
  const [selected, setSelected] = useState(null);
  //  //  console.log(selected)
  return (
    <>
      {mode == "list" && (
        <VoucherList
          setMode={setMode}
          setSelected={(item) => {
            setSelected(item);
          }}
          selected={selected}
        />
      )}
      {(mode == "add" || mode == "edit" || mode == "view") && (
        <TambahVoucherForm
          onCancel={() => {
            setMode("list");
            setSelected(null);
          }}
          mode={mode}
          data={selected}
        />
      )}
    </>
  );
}
VoucherTable.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default VoucherTable;
