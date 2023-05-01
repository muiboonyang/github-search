import {createSlice} from "@reduxjs/toolkit";

const loadingSlice = createSlice({
    name: "loading",
    initialState: {
        isLoading: false,
    },
    reducers: {
        loadingStatus: (state) => {
            state.isLoading = !state.isLoading;
        },
    },
});

// Exports the redux actions
export const {loadingStatus} = loadingSlice.actions;

// Exports the reducer
export default loadingSlice.reducer;
