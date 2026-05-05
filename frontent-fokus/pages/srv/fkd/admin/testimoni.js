import { DetailTestimoni } from "@/components/admin/detailTestimoni";
import { EditTestimoniForm } from "@/components/admin/editTestimoni";
import TambahTestimoniForm from "@/components/admin/tambahTestimoni";
import TestimoniTable from "@/components/admin/testimoniTable";
import AdminLayout from "@/pages/layouts/adminLayout";
import { useState } from "react";

function TestimoniAdmin() {
  const [mode, setMode] = useState('table');
  const [selectedData, setSelectedData] = useState(null);
  
  return (
    <>
      {mode === 'table' && (
        <TestimoniTable
          onAdd={() => setMode('add')}
          onView={(data) => {
            setSelectedData(data);
            setMode('view');
          }}
          onEdit={(data) => {
            setSelectedData(data);
            setMode('edit');
          }}
        />
      )}

      {(mode === 'add' || mode === 'view' || mode === 'edit') && <TambahTestimoniForm mode={mode} data={selectedData} onCancel={() => {
        setSelectedData(null)
        setMode('table')
        }} />}

      {/* {mode === 'view' && <DetailTestimoni testimoni={selectedData} onCancel={() => setMode('table')} />} */}

      {/* {mode === 'edit' && <EditTestimoniForm data={selectedData} onCancel={() => setMode('table')} />} */}
    </>
  );
}

TestimoniAdmin.getLayout = function getLayout(page){
    return<AdminLayout>{page}</AdminLayout>
}

export default TestimoniAdmin;