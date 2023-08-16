import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // IP: process.env.EXPO_PUBLIC_IP,
    // PORT: process.env.EXPO_PUBLIC_PORT,
    IP: "https://finding-neno-backend-e7784ead43b6.herokuapp.com",
    PORT: "5000",
}

export const apiSlice = createSlice({
    name: "api",
    initialState,
    reducers: {
        updateConnection: (state, {payload}) => {
            state.IP = payload.IP;
            state.PORT = payload.PORT;
        
        },
    },
});

export const { updateConnection } = apiSlice.actions;

export default apiSlice.reducer;