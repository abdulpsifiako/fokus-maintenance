import { useState } from 'react';
import ModalSimpan from '../user/modalSimpan';
import Alert from '../public/alert';
import { getAvailableUsername } from '@/lib/axios/users';
import Cookies from 'js-cookie'
import { updateUser } from '@/lib/axios/managementUser';
export default function EditUserManagement({ onCancel, data, fetchData}) {
  const [buttonDisable, setButtonDisable] = useState(false)
  const [alert, setAlert] = useState(null);
  const token = Cookies.get("token")
  const [changePassword, setChangePassword] = useState(false)
  const [cekUsername, setCekUserName] =useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [formData, setFormData] = useState({
    name: data.name,
    username: data.username,
    password: '',
    confirmPassword: '',
    created_at:new Date(Date.now())
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({...formData, [name]:value});
  };

  const handleSubmit = async() => {
    setButtonDisable(true)
    if(!cekUsername && data.username.length <1){
      setAlert({
        type: "info",
            title: "Info",
            message: "Username harus terisi dan cek bisa digunakan.",
      })
      return;
    }
    let updateData;
    if(!changePassword){
      const {password, confirmPassword, ...destrucData} = formData
      updateData= {...destrucData, id:data.id}
    }else{
      updateData={...formData, id:data.id}
    }

    try {
        const res = await updateUser(updateData, token)
        setAlert({
          type: "info",
              title: "Info",
              message: res.message,
        })
        setTimeout(() => {
          fetchData()
          onCancel()
        }, 3000);
      } catch (error) {
        const res = error.response.data
        if(res.status==403){
            setAlert({
                type: "info",
                title: "Info",
                message: res.message,
            });
        }else{
          setAlert({
            type: "info",
                title: "Info",
                message: error.message,
          })
        }
        return
      }
      setButtonDisable(false)
      return
  };
  const handleCekUserName =async()=>{
    try {
      const res = await getAvailableUsername(formData.username, token)
      setCekUserName(true)
      setAlert({
        type: "info",
            title: "Info",
            message: res.message,
      })
      return
    } catch (error) {
      const res = error.response.data
      if(res.status==403){
          setAlert({
              type: "info",
              title: "Info",
              message: res.message,
          });
      }else{
        setAlert({
          type: "info",
              title: "Info",
              message: error.message,
        })
      }
      return
    }
  }
  return (
    <form className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-primary">Edit User Management</h2>
          <p className="text-sm text-gray-500">User Management / <span className="text-primary font-medium">Edit</span></p>
        </div>
        <div className="space-x-2">
          <button type="button" onClick={onCancel} className="focus:outline-none focus:ring-1 focus:ring-primary border border-gray-400 focus:border-0 text-primary px-4 py-2 rounded-md text-sm">Batal</button>
          <button type="button" onClick={()=>{ setOpenModal(true)}} className="bg-primary text-white px-4 py-2 rounded-md text-sm">Simpan</button>
        </div>
      </div>

      <div className="space-y-4 max-w-sm">
        <div>
          <label className="block text-sm mb-1">Nama</label>
          <input name="name" value={formData.name} onChange={handleChange} className="w-full p-2 rounded focus:outline-none  border border-gray-400 focus:border-primary" />
        </div>

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input disabled name="email" value={data.email} className="w-full p-2 rounded focus:outline-none border border-gray-400 focus:border-primary text-gray-400" />
        </div>

        <span className="text-sm font-semibold">Ubah Kata Sandi</span>
        <div className="flex items-center gap-3">
          {/* Toggle Switch */}
          <button
            type='button'
            onClick={() => setChangePassword(!changePassword)}
            className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-200 
              ${changePassword ? 'bg-red-800' : 'bg-gray-300'}`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 
                ${changePassword ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">(Tidak/Ya)</span>
          </div>
        </div>

        {
          changePassword ? (
            <>
              <div>
                <label className="block text-sm mb-1">Kata Sandi Baru</label>
                <input name="password" value={formData.password} onChange={handleChange} className="w-full p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary border border-gray-400 focus:border-0" />
              </div>

              <div>
                <label className="block text-sm mb-1">Konfirmasi Kata Sandi Baru</label>
                <input name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary border border-gray-400 focus:border-0" />
                {formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-600 mt-1">*Pastikan kata sandi yang Anda masukkan sudah sesuai.</p>
                )}
              </div>
            </>
          ):(
            <></>
          )
        }

        <div>
          <label className="block text-sm mb-1">Username</label>
          <div className='flex'>
            <input name="username" disabled={data.username !== "" ? true:false} value={formData.username} onChange={handleChange} className={`w-full p-2 rounded focus:outline-none  border border-gray-400 border-r-0 rounded-r-none focus:border-primary ${data.username !== "" ?"text-gray-400":""}`} />
            <button disabled={data.username !== "" ? true:false} type="button" onClick={handleCekUserName} className={`p-2 text-xs rounded-sm bg-primary text-white rounded-l-none cursor-pointer ${data.username !== "" ?"bg-primary cursor-pointer":"bg-gray-400 cursor-not-allowed"}`}>Cek</button>
          </div>
        </div>
      </div>
      {
        openModal &&(
          <ModalSimpan open={setOpenModal} setOpenModal={setOpenModal} handlesubmit={handleSubmit} buttonDisable={buttonDisable}/>
        )
      }
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
    </form>
  );
}
