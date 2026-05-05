import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  program_utama: null,
  kelas_online:null
};

const transaksiSlice = createSlice({
  name: 'transaksi',
  initialState,
  reducers: {
    addTransaksiProgramUtama:(state, action)=>{
        state.program_utama= action.payload
    },
    addNewPropertiesTransaksi:(state, action)=>{
        if (!state.program_utama) {
            state.program_utama = {};
        }

        state.program_utama = {
            ...state.program_utama,
            ...action.payload, 
        };
    },
    addTransaksiKelasOnline:(state, action)=>{
        state.kelas_online= action.payload
    },
  },
});

export const { addTransaksiProgramUtama, addNewPropertiesTransaksi, addTransaksiKelasOnline } = transaksiSlice.actions;
export default transaksiSlice.reducer;
