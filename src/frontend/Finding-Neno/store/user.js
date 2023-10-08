import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
    USER_ID: undefined,
    ACCESS_TOKEN: undefined,
    LOGGED_IN: undefined
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, { payload }) => {
            state.USER_ID = payload.USER_ID;
            state.ACCESS_TOKEN = payload.ACCESS_TOKEN;
            state.LOGGED_IN = true;
            AsyncStorage.setItem("USER_ID", payload.USER_ID)
            AsyncStorage.setItem("ACCESS_TOKEN", payload.ACCESS_TOKEN)
        },
        logout: (state) => {
            state.USER_ID = undefined;
            state.ACCESS_TOKEN = undefined;
            state.LOGGED_IN = false;
            AsyncStorage.setItem("USER_ID", "")
            AsyncStorage.setItem("ACCESS_TOKEN", "")
        }
    },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;