import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    USER_ID: undefined,
    ACCESS_TOKEN: undefined,
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, {payload}) => {
            state.USER_ID = payload.USER_ID;
            state.ACCESS_TOKEN = payload.ACCESS_TOKEN;
        
        },
        logout: (state) => {
            state.USER_ID = undefined;
            state.ACCESS_TOKEN = undefined;
        }
    },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;