import AdminLayout from "@/pages/layouts/adminLayout";

function UserDetail() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-primary">Data User</h2>
      </div>

      <form className="space-y-4">
        <FormGroup label="Nama Lengkap" value="Abdul" />
        <FormGroup label="Username Fokusedu" value="abdulabdul" />
        <FormGroup label="Email" value="abdul@gmail.com" />
        <FormGroup label="Provinsi" value="Jawa Barat" />
        <FormGroup label="Kabupaten/Kota" value="Indramayu" />
        <FormGroup label="Nomor Whatsapp" value="085316161039" />
        <FormGroup label="Username Instagram" value="abdul_23" />
        <FormGroup label="Tingkat Pendidikan" value="S1 Teknik Informatika" />
      </form>
    </div>
  );
}

function FormGroup({ label, value }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1">{label}</label>
      <input
        type="text"
        value={value}
        readOnly
        className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-sm"
      />
    </div>
  );
}

UserDetail.getLayout = function getLayout(page){
    return<AdminLayout>{page}</AdminLayout>
}

export default UserDetail;

