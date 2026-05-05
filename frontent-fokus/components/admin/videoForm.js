"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import { Eye, Pen, Trash, X } from "lucide-react"
import Alert from "../public/alert"
import { createVideoProgramUtama, getListProgramUtamaVideo, updateVideoProgramUtama, uploadFileProgramUtama } from "@/lib/axios/programUtama"
import Cookies from "js-cookie"
import VideoModal from "./videoModal"

export default function ProgramUtamaVideoForm({ program, onBack, mode }) {
  const token = Cookies.get("token")
  const [alert, setAlert] = useState(null)
  const [videoMode, setVideoMode] = useState("add");
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [openModal, setOpenModal] = useState(false)
  const [programUtama, setProgramUtama] =useState(null)
  const [video, selectedvideo] = useState(null)
  const [itemIndex, setItemIndex] = useState(0)
  const [progress, setProgress] = useState(0);
  const [uploaded, setUploaded] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [countVideo, setCountVideo] =useState(0)

  const [form, setForm] = useState({
    materi: program?.properties?.materi || "",
    program_id: program?.properties?.program_id || "",
    program_name:program?.properties?.program_name || "",
    status: program?.properties?.status || false,
    video: Array.isArray(program?.properties?.video) ? program.properties.video : [],
  })
  
  const handleVideo = (data) => {
    if (videoMode === "edit" && video) {
      setForm(prev => ({
        ...prev,
        video: prev.video.map((p, index) =>
           index === itemIndex ? data : p
        )
      }));
    } else {
      setForm(prev => ({
        ...prev,
        video: [...(prev.video || []), data]
      }));
    }
    setOpenModal(false);
  };
  const handleChange =(e)=>{
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (name === "program_id" && value) {
      const selected = programUtama.filter((item) => item.id === Number(value));
      setForm(prev=>({...prev, program_name:selected[0].properties?.name}))
      setSelectedProgram(selected[0]);
    }
  }

  const fetchFiturVideoProgramUtama =  useCallback(async () => {
    try {
      const response = await getListProgramUtamaVideo(token);
      setProgramUtama(response.data)
      setAlert({
        type: "success",
        title: "Info",
        message: response.message || "Failed to fetch data",
      });
    } catch (error) {
      setAlert({
        type: "error",
        title: "Error",
        message: error.message || "Failed to fetch data",
      });
    }
  },[token]);

  const handleDeleteVideo = (idx) => {
    setForm(prev => ({
      ...prev,
      video: prev.video.filter((p, index) => index !== idx)
    }));
  }

  const handleChangeVideoStatus = (checked, idx) => {
    setForm(prev => ({
      ...prev,
      video: prev.video.map((item, index) =>
        index === idx ? { ...item, status: checked } : item
      )
    }));
  };

  
  const handleSubmit = async () => {
    try {
      let response;
      const overSize = form.video.find(
        (v) => v.video instanceof File && v.video.size > 200 * 1024 * 1024
      );
      if (overSize) {
        setAlert({
          type: "error",
          title: "Ukuran Video Terlalu Besar",
          message: `Video "${overSize.video.name}" melebihi batas 200MB`,
        });
        return; 
      }
      // 1. Upload video & thumbnail
      const videoWithUrls = await Promise.all(
        form.video.map(async (v) => {
          let videoUrl = v.video;
          let thumbnailUrl = v.thumbnail;
          setCountVideo(prev => prev+1)

          // Upload video kalau masih File
          if (v.video && v.video instanceof File) {
            setShowUploadModal(true)
            const formData = new FormData();
            formData.append("file", v.video);
            const uploadRes = await uploadFileProgramUtama(formData, token, {
              onProgress: ({ percent, uploaded }) => {
                setProgress(percent);
                setUploaded(uploaded);
              },
            });
            videoUrl = uploadRes.data[0].fileUrl;
          }

          // Upload thumbnail kalau masih File
          if (v.thumbnail && v.thumbnail instanceof File) {
            const formData = new FormData();
            formData.append("file", v.thumbnail);
            const uploadRes = await uploadFileProgramUtama(formData, token, {
              onProgress: ({ percent, uploaded }) => {
                setProgress(percent);
                setUploaded(uploaded);
              },
            });
            thumbnailUrl = uploadRes.data[0].fileUrl;
          }

          return {
            ...v,
            video: videoUrl,
            thumbnail: thumbnailUrl,
          };
        })
      );

      // 3. Payload final
      const payload = {
        ...form,
        video: videoWithUrls,
      };

      // 4. Submit
      if (mode === "edit") {
        response = await updateVideoProgramUtama(program.id, { properties: payload }, token);
      } else {
        response = await createVideoProgramUtama({ properties: payload }, token);
      }

      if (response.status === 200) {
        setAlert({
          type: "success",
          title: "Info",
          message: "Data submitted successfully",
        });
        setShowUploadModal(false)
        setTimeout(() => {
          onBack();
          setCountVideo(0)
        }, 2000);
      }
    } catch (error) {
      setAlert({
        type: "error",
        title: "Error",
        message: error.message || "Failed to submit data",
      });
    }
  };
  useEffect(()=>{
   fetchFiturVideoProgramUtama()
  },[fetchFiturVideoProgramUtama])

  const prevProgId =useRef()

  useEffect(()=>{
    prevProgId.current = program?.properties?.program_id
    if(form.program_id && mode !== 'view' && form.program_id !== prevProgId.current){
      setForm(prev=>({...prev, video:null}))
    }
  },[form.program_id, mode,program?.properties?.program_id])
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center my-auto">
        <h1 className="text-lg font-semibold text-primary">{mode == 'add'? "Tambah":mode =='view' ?'':'Edit'} Info Program Utama</h1>
        <div className="flex gap-3">
          <button onClick={onBack} className="border border-primary p-2 rounded">Kembali</button>
          <button type="button" onClick={handleSubmit} className={`${mode === 'view' ?'hidden' :'bg-primary text-white p-2 rounded'}`}>Simpan</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="max-w-md">
          <label className="text-sm">Materi</label>
          <input
            name="materi"
            type="text"
            value={form.materi}
            disabled={mode === 'view'}
            onChange={handleChange}
            placeholder="Judul Materi"
            className="border border-gray-400 p-2 rounded focus:outline-red-500 w-full"
          />
        </div>
        <div className="max-w-md">
          <label className="text-sm">Paket Program Utama</label>
          <select 
              name="program_id"
              value={form.program_id} 
              onChange={handleChange}
              disabled={mode === 'view'}
              className="border border-gray-400 p-2 rounded focus:outline-red-500 w-full"
            >
              <option value="">-- Pilih Program Utama --</option>
              {
                programUtama && programUtama.length > 0 ? (
                  programUtama.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.properties?.name}
                    </option>
                  ))
                ) : (
                  <option value="">-- Pilih Program Utama --</option>
                )
              }
            </select>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="">
          <h1 className="text-sm">Status</h1>
          <label className="relative inline-flex items-center cursor-pointer my-2">
            <input
              type="checkbox"
              checked={form.status}
              disabled={mode === 'view'}
              name="status"
              onChange={(e) => {
                const { name, checked } = e.target;
                setForm(prev => ({
                  ...prev,
                  [name]: checked 
                }));
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-primary transition"></div>
            <div className="absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition peer-checked:translate-x-5"></div>
          </label>
        </div>
      </div>

      {/* Tabel Pengajar */}
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold">Video</h2>
          <button onClick={() => {
            selectedvideo(null);
            setVideoMode("add");
            setOpenModal(true);
          }} className={`${mode ==='view' ? 'hidden':'bg-primary text-white px-3 py-1 rounded'}`}>Tambah Video</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full mt-2 text-sm rounded-t-md overflow-hidden">
            <thead className="bg-primary text-white text-left">
              <tr>
                <th className="p-2 text-center">No</th>
                <th className="p-2">Sub Materi</th>
                <th className="p-2">Kategori</th>
                <th className="p-2">Pengajar</th>
                <th className="p-2">Status</th>
                <th className={`${mode === 'view' ? 'hidden':'p-2'}`}>Action</th>
              </tr>
            </thead>
            <tbody>
                {form.video && form.video.length > 0 ? (
                  form.video.map((item, index) => (
                    <tr key={index} className=" even:bg-gray-300">
                      <td className="p-2 text-center">{index + 1}</td>
                      <td className="p-2">{item.name}</td>
                      <td className="p-2">{item.kategori}</td>
                      <td className="p-2 max-w-xs">{item.data_pengajar[0]?.name}</td>
                      <td className="p-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="status"
                            checked={item.status}
                            className="sr-only peer"
                            onChange={(e) =>
                              handleChangeVideoStatus(e.target.checked, index)
                            }
                          />
                          <div className="w-11 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-primary transition"></div>
                          <div className="absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition peer-checked:translate-x-5"></div>
                        </label>
                      </td>
                      <td className={`${mode === 'view' ? 'hidden':'p-2 flex gap-2'}`}>
                        <button type="button" onClick={()=> {
                          setItemIndex(index)
                          selectedvideo(item)
                          setVideoMode("edit");
                          setOpenModal(true)
                        }} className="bg-yellow-500 text-white p-1 rounded"><Pen size={16} /></button>
                        <button type="button" onClick={()=>handleDeleteVideo(index)} className="bg-red-500 text-white p-1 rounded"><Trash size={16} /></button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-2 text-center">Belum ada data</td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      </div>
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-300/60 backdrop-blur-md bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-red-700">Upload video {countVideo}/{form.video.length}, harap tunggu sampai selesai dan jangan tutup halaman</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Uploaded {uploaded}
            </p>
            <p className="text-sm text-gray-600 mb-6">
              {progress} %
            </p>
          </div>
        </div>
      )}
      {alert && (
              <Alert
                  type={alert.type}
                  title={alert.title}
                  message={alert.message}
                  onClose={() => setAlert(null)}
              />
            )}
      {openModal && <VideoModal mode={videoMode} data={video} handleVideo={handleVideo} onClose={() => setOpenModal(false)} programUtama={selectedProgram} programId={form.program_id}/>}
    </div>
  )
}
