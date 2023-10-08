import { createSlice } from "@reduxjs/toolkit";
import {IP, PORT} from '@env'

const initialState = {
    IP: IP,
    PORT: PORT,
}

console.log("IP: ", IP);

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