import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  detail: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    detailUser: (state, action) => {
      state.detail = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    updateDetail:(state, action)=>{
      state.detail={...state.detail, ...action.payload}
    }
  },
});

export const { detailUser, clearUser, updateDetail } = userSlice.actions;
export default userSlice.reducer;
