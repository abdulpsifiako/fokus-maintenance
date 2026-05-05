import ProgramUtamaForm from "@/components/admin/programInfoForm";
import ProgramUtamaList from "@/components/admin/programInfoList";
import AdminLayout from "@/pages/layouts/adminLayout";
import { useState } from "react";

function InfoProgram() {
    const [mode, setMode] = useState("list") // list | form
    const [selectedProgram, setSelectedProgram] = useState(null)
  return (
    <div className="p-6 space-y-6">
      {mode === "list" && (
        <ProgramUtamaList 
          onTambah={() => {
            setSelectedProgram(null)
            setMode("form")
          }} 
          onEdit={(program) => {
            setSelectedProgram(program)
            setMode("edit")
          }}
          onView={(program)=> {
            setSelectedProgram(program)
            setMode('view')
          }}
        />
      )}

      {mode === "form" && (
        <ProgramUtamaForm 
          mode={"add"}
          program={selectedProgram}
          onBack={() => setMode("list")}
        />
      )}
      {mode === "edit" && (
        <ProgramUtamaForm 
          mode={"edit"}
          program={selectedProgram}
          onBack={() => setMode("list")}
        />
      )}
      {mode === "view" && (
        <ProgramUtamaForm 
          mode={"view"}
          program={selectedProgram}
          onBack={() => setMode("list")}
        />
      )}
    </div>
  );
}

InfoProgram.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
}

export default InfoProgram;