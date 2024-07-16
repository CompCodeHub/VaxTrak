import { createSlice } from "@reduxjs/toolkit";

// Get admin info from local storage if available
const initialState = {
  adminInfo: null,
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    setAdminInfo: (state, action) => {
      // Set admin info in state as well as local storage
      state.adminInfo = action.payload;
      //localStorage.setItem("adminInfo", JSON.stringify(action.payload));
    },
    logoutAdmin: (state) => {
      // clear admin info from state and local storage
      state.adminInfo = null;
      //localStorage.removeItem("adminInfo");
    },
  },
});

export const { setAdminInfo, logoutAdmin } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
