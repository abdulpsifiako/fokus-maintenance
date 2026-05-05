import TryOutForm from "@/components/admin/tryoutForm"
import TryoutTable from "@/components/admin/tryoutTable"
import { Plus } from "lucide-react"
import { useState } from "react"

const { default: AdminLayout } = require("@/pages/layouts/adminLayout")

const Tryout=()=>{
    const [mode, setMode] = useState('list')
    const [selectedTryout, setSelectedTryou] =useState(null)
    
    return (
        <div className="px-4 mt-6 font-poppins">
            {
                mode === 'list' && (
                    <TryoutTable onEdit={(data)=>{
                        setSelectedTryou(data)
                        setMode('form-edit')
                    }} setMode={setMode}/>
                )
            }
            {
                (mode === 'form' || mode === 'form-edit') && (
                   <TryOutForm
                    mode={mode}
                    data={selectedTryout}
                    onBack={()=>{
                        setSelectedTryou(null)
                        setMode('list')
                    }}
                   />
                )
            }
        </div>
    )

}

Tryout.getLayout = function getLayout(page){
    return <AdminLayout>{page}</AdminLayout>
}

export default Tryout;