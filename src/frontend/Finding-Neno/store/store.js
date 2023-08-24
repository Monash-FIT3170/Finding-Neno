import { createStore } from "redux";
import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user'
import apiReducer from './api'
import petReducer from './pet'

export default configureStore({
    reducer: {
        api: apiReducer,
        user: userReducer,
        pet: petReducer,
    }
});
