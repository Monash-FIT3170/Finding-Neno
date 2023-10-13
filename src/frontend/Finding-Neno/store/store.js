import { createStore } from "redux";
import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user'
import apiReducer from './api'
import petReducer from './pet'
import deviceReducer from "./device";

export default configureStore({
    reducer: {
        api: apiReducer,
        user: userReducer,
        pet: petReducer,
        device: deviceReducer,
    }
});
