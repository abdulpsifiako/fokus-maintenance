import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tab: "video",
  expanded: 0, // ✅ mulai dari idx 0
};

const activeTabSlice = createSlice({
  name: "tab",
  initialState,
  reducers: {
    setTab: (state, action) => {
      state.tab = action.payload;
    },
    setExpanded: (state, action) => {
      state.expanded = action.payload;
    },
  },
});

export const { setTab, setExpanded } = activeTabSlice.actions;
export default activeTabSlice.reducer;
