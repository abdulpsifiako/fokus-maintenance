import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  soal: null,
  total_skor:0
};

const soalSlice = createSlice({
  name: 'soal',
  initialState,
  reducers: {
    addSoal: (state, action) => {
      state.soal = action.payload;
    },
    addTotalSkor: (state, action)=>{
      state.total_skor = action.payload
    },
    resetTotalSkor:(state)=>{
      state.total_skor=0
    },
    resetSoal:(state)=>{
      state.soal=null
    }
  },
});

export const { addSoal, addTotalSkor, resetSoal, resetTotalSkor } = soalSlice.actions;
export default soalSlice.reducer;
