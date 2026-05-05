import Editor from "./editor";

export const SoalItem = ({ index, latihan, setLatihan }) => {
  const soal = latihan.datasoal[index - 1];

  const handleSubmateriChange = (val) => {
    setLatihan((prev) => {
      const newData = [...prev.datasoal];
      newData[index - 1] = { ...newData[index - 1], submateri: val };
      return { ...prev, datasoal: newData };
    });
  };

  const handlePertanyaanChange = (val) => {
    setLatihan((prev) => {
      const newData = [...prev.datasoal];
      newData[index - 1] = { ...newData[index - 1], pertanyaan: val };
      return { ...prev, datasoal: newData };
    });
  };

  const handleAddOpsi = () => {
    setLatihan((prev) => {
      const newData = [...prev.datasoal];
      newData[index - 1] = {
        ...newData[index - 1],
        opsi: [...newData[index - 1].opsi, { text: "", poin: 0 }],
      };
      return { ...prev, datasoal: newData };
    });
  };

  const handleRemoveOpsi = (i) => {
    setLatihan((prev) => {
      const newData = [...prev.datasoal];
      const newOpsi = newData[index - 1].opsi.filter((_, idx) => idx !== i);
      newData[index - 1] = { ...newData[index - 1], opsi: newOpsi };
      return { ...prev, datasoal: newData };
    });
  };

  return (
    <div className="border rounded-md p-4 mb-20 mt-7 space-y-4">
      <div className="flex gap-3">
        <h2 className="font-semibold items-center my-auto">Soal {index}</h2>
        <span className="bg-gray-300 p-2 rounded-md text-xs leading-1 items-center my-auto">
          <input
            type="text"
            value={soal.submateri}
            onChange={(e) => handleSubmateriChange(e.target.value)}
            placeholder="Masukkan sub materi"
            className="bg-transparent text-xs focus:bg-white focus:border-0 focus:ring-0 focus:outline-0"
          />
        </span>
      </div>

      {/* Pertanyaan */}
      <div>
        <label className="block mb-1 font-medium">Pertanyaan</label>
        {/* ✅ FIX 1: key unik per soal agar Editor di-remount saat ganti soal */}
        <Editor
          key={`pertanyaan-soal-${index}`}
          defaultValue={soal.pertanyaan}
          onTextChange={handlePertanyaanChange}
        />
      </div>

      {/* Opsi */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="font-medium">Opsi Jawaban</label>
          <button
            type="button"
            onClick={handleAddOpsi}
            className="bg-primary text-white px-3 py-1 rounded-md text-xs"
          >
            + Tambah Opsi
          </button>
        </div>

        {soal.opsi.map((val, i) => {
          const optionLabel = String.fromCharCode(65 + i);
          return (
            // ✅ FIX 2: key unik kombinasi soal + index opsi
            <div
              key={`soal-${index}-opsi-${i}`}
              className="flex items-center gap-2"
            >
              <span className="font-medium">{optionLabel}.</span>

              <div className="flex flex-col gap-2 flex-1">
                {/* ✅ FIX 3: key Editor opsi unik per soal dan per opsi */}
                <Editor
                  key={`opsi-soal-${index}-opsi-${i}`}
                  defaultValue={val.text}
                  onTextChange={(newVal) => {
                    setLatihan((prev) => {
                      const newData = [...prev.datasoal];
                      const newOpsi = [...newData[index - 1].opsi];
                      newOpsi[i] = { ...newOpsi[i], text: newVal };
                      newData[index - 1] = {
                        ...newData[index - 1],
                        opsi: newOpsi,
                      };
                      return { ...prev, datasoal: newData };
                    });
                  }}
                />

                <input
                  type="number"
                  className="w-20 border rounded p-1 text-sm"
                  value={val.poin}
                  onChange={(e) => {
                    setLatihan((prev) => {
                      const newData = [...prev.datasoal];
                      const newOpsi = [...newData[index - 1].opsi];
                      newOpsi[i] = {
                        ...newOpsi[i],
                        poin: Number(e.target.value),
                      };
                      newData[index - 1] = {
                        ...newData[index - 1],
                        opsi: newOpsi,
                      };
                      return { ...prev, datasoal: newData };
                    });
                  }}
                />
              </div>

              <button
                type="button"
                onClick={() => handleRemoveOpsi(i)}
                className="text-red-500 text-xs ml-2"
              >
                Hapus
              </button>
            </div>
          );
        })}
      </div>

      {/* Kunci */}
      <div className="flex flex-col gap-1 max-w-sm">
        <label>Kunci</label>
        <input
          value={soal.kunci}
          onChange={(e) =>
            setLatihan((prev) => {
              const newData = [...prev.datasoal];
              newData[index - 1] = {
                ...newData[index - 1],
                kunci: e.target.value,
              };
              return { ...prev, datasoal: newData };
            })
          }
          placeholder="Kunci"
          className="rounded-md border border-gray-400 p-2 focus:outline-red-500"
        />
      </div>

      {/* Pembahasan */}
      <div>
        <label className="block mb-1 font-medium">Pembahasan</label>
        {/* ✅ FIX 4: key unik per soal untuk pembahasan */}
        <Editor
          key={`pembahasan-soal-${index}`}
          defaultValue={soal.pembahasan}
          onTextChange={(val) =>
            setLatihan((prev) => {
              const newData = [...prev.datasoal];
              newData[index - 1] = { ...newData[index - 1], pembahasan: val };
              return { ...prev, datasoal: newData };
            })
          }
        />
      </div>
    </div>
  );
};
