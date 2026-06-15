import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dataSoal: null,
  purchased: null,
  dataLatihan: null,
  detailKelasonline: null,
  op_pembahasan: null,
};

const tryoutSlice = createSlice({
  name: "tryout",
  initialState,
  reducers: {
    addDetailPurchased: (state, action) => {
      state.purchased = action.payload;
    },
    addDataSoalTO: (state, action) => {
      state.dataSoal = action.payload;
    },
    addDataLatihan: (state, action) => {
      state.dataLatihan = action.payload;
    },
    addKelasOnline: (state, action) => {
      state.detailKelasonline = action.payload;
    },
    resetDetailPurchased: (state, action) => {
      state.purchased = null;
    },
    addOpPembahasan: (state, action) => {
      state.op_pembahasan = action.payload;
    },
  },
});

export const {
  addDetailPurchased,
  addDataSoalTO,
  addDataLatihan,
  addKelasOnline,
  resetDetailPurchased,
  addOpPembahasan,
} = tryoutSlice.actions;
export default tryoutSlice.reducer;
