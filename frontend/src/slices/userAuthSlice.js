import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null,
};

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    logoutUser: (state) => {
      state.userInfo = null;
    },
  },
});

export const { setUserInfo, logoutUser } = userAuthSlice.actions;
export default userAuthSlice.reducer;
