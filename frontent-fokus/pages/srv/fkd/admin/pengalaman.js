import PengalamanForm from "@/components/admin/pengalamanForm";
import PengalamanTable from "@/components/admin/pengalamanTable";
import { addPengalamanPost, deletePengalaman, updatePengalaman, uploadFile } from "@/lib/axios/landing";
import AdminLayout from "@/pages/layouts/adminLayout";
import Cookies from 'js-cookie'
import { useRouter } from "next/router";
import { useState } from "react";

function Pengalaman(){
    const [buttonDisable, setButtonDisable] = useState(false)
    const token = Cookies.get("token")
    const [mode, setMode] = useState('table')
    const [selected, setSelected] = useState(null)

    const router = useRouter();
    const handleSave = async (data) => {
        setButtonDisable(true)
        let imageUrl = data.imageUrl;

        // jika ada file baru → upload
        if (data.file) {
            const formData = new FormData();
            formData.append("file", data.file);

            const res = await uploadFile(formData, token);

            if (res.status !== 200) {
            alert("Upload gagal");
            return;
            }

            imageUrl = res.data[0].fileUrl;
        }

        const payload = {
            judul: data.judul,
            deskripsi: data.deskripsi,
            imageUrl: imageUrl,
            link:data.link
        };
        if(payload.judul==""|| payload.link==''|| payload.deskripsi=="" || payload.imageUrl==''){
            alert("Judul, Deskripsi, Gambar, Link harus diisi")
            setButtonDisable(false)
            return
        }

        if (selected) {
            await updatePengalaman(selected.id, payload, token);
        } else {
            await addPengalamanPost(payload, token);
        }

        setMode("table");
        setButtonDisable(false)
    };
    const handleDelete = async (item) => {
        if (!confirm(`Hapus pengalaman: ${item.judul}?`)) return;
        
        try {
            const res = await deletePengalaman(item.id, token);

            if (res.success) {
                alert("Berhasil menghapus");
                router.reload(); // reload data
            } else {
                alert("Gagal menghapus");
            }
        } catch (error) {
            console.error("DELETE ERROR", error);
            alert("Terjadi kesalahan server");
        }
    };

    return (
        <>
            {
                mode === 'table' && (
                    <PengalamanTable onAdd={()=> setMode('form')} onEdit={(item)=> {setMode('edit')
                        setSelected(item)
                    }} 
                    onDelete={handleDelete}
                    />
                )
            }
            {
                (mode === "form" || mode === "edit") && (
                    <PengalamanForm
                    onCancel={() => {
                        setSelected(null)
                        setMode("table")
                    }}
                    selected={selected}
                    onSave={handleSave}
                    buttonDisable={buttonDisable}
                />

                )
            }

        </>
    )
}

Pengalaman.getLayout = function getLayout(page){
    return<AdminLayout>{page}</AdminLayout>
}

export default Pengalaman;