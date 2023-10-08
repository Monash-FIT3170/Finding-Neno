import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    API_URL: process.env.API_URL,
}

export const apiSlice = createSlice({
    name: "api",
    initialState,
    reducers: {
        updateConnection: (state, {payload}) => {
            state.API_URL = payload.API_URL;
        },
    },
});

export const { updateConnection } = apiSlice.actions;

export default apiSlice.reducer;