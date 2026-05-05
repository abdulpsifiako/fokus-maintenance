 
import { useState } from 'react';

export default function ModalSimpan({open, setOpenModal, handlesubmit, buttonDisable}) {
    if (!open) return null;
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center font-poppins bg-gray-300/60 backdrop-blur-sm">
            <div className="bg-white rounded-md shadow-md max-w-sm w-full p-6 space-y-4">
            <h2 className="text-lg font-bold text-center">Yakin ingin menyimpan?</h2>
            <div className="flex justify-end gap-3 pt-2">
                <button
                disabled={buttonDisable}
                onClick={() => setOpenModal(false)}
                className="border border-red-500 text-red-600 px-4 py-1 rounded hover:bg-red-50 text-sm"
                >
                Tidak
                </button>
                <button
                onClick={() => {
                    setOpenModal(false);
                    handlesubmit()
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded text-sm"
                >
                Ya
                </button>
            </div>
            </div>
        </div>
        )}
    </>
  );
}
