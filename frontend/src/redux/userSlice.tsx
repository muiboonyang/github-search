import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    name: "",
    email: "",
  },
  reducers: {
    login: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
    logout: (state) => {
      state.name = "";
      state.email = "";
    },
    update: (state, action) => {
      state.name = action.payload;
    },
  },
});

// Exports the redux actions
export const { login, logout, update } = userSlice.actions;

// Exports the reducer
export default userSlice.reducer;
