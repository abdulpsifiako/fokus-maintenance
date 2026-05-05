export function EditTestimoniForm({ onCancel, testimoni }) {
  return (
    <div className="mt-6 px-4">
      <h2 className="text-base font-semibold text-primary mb-3">Edit Testimoni</h2>

      <div className="space-y-3 max-w-md">
        <div>
          <label className="block text-sm">Nama Lengkap</label>
          <input type="text" className="w-full border px-3 py-2 rounded" defaultValue={testimoni?.name} />
        </div>
        <div>
          <label className="block text-sm">Institusi/Profesi</label>
          <input type="text" className="w-full border px-3 py-2 rounded" defaultValue={testimoni?.profesi} />
        </div>
        <div>
          <label className="block text-sm">Deskripsi Testimoni</label>
          <textarea className="w-full border px-3 py-2 rounded" rows={4} defaultValue={testimoni?.deskripsi}></textarea>
        </div>
        <div>
          <label className="block text-sm">Banner</label>
          <input type="file" className="w-full border px-3 py-2 rounded" />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <button onClick={onCancel} className="border border-red-600 text-red-600 px-4 py-1 rounded">Batal</button>
        <button className="bg-primary text-white px-4 py-1 rounded">Setujui</button>
        <button className="bg-red-600 text-white px-4 py-1 rounded">Tidak Setujui</button>
      </div>
    </div>
  );
}