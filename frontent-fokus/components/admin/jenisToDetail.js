function JenisToDetail({ data, onBack }) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-red-800">Detail Jenis Program</h1>
        <button onClick={onBack} className="border border-red-700 text-red-700 px-4 py-1 rounded">
          Kembali
        </button>
      </div>
      <div className="mt-6">
        <p><strong>Jenis Program:</strong> {data?.nama}</p>
      </div>
    </div>
  );
}

export default JenisToDetail;
