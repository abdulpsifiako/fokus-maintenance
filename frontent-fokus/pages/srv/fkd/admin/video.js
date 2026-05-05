import ProgramUtamaVideoForm from "@/components/admin/videoForm";
import ProgramUtamaVideoList from "@/components/admin/videoList";
import AdminLayout from "@/pages/layouts/adminLayout";
import { useState } from "react";

function InfoProgram() {
    const [mode, setMode] = useState("list") 
    const [selectedProgram, setSelectedProgram] = useState(null)
  return (
    <div className="p-6 space-y-6">
      {mode === "list" && (
        <ProgramUtamaVideoList 
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
        <ProgramUtamaVideoForm 
          mode={"add"}
          program={selectedProgram}
          onBack={() => setMode("list")}
        />
      )}
      {mode === "edit" && (
        <ProgramUtamaVideoForm 
          mode={"edit"}
          program={selectedProgram}
          onBack={() => setMode("list")}
        />
      )}
      {mode === "view" && (
        <ProgramUtamaVideoForm 
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