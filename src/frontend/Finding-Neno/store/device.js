import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Dimensions, Platform } from 'react-native';

const initialState = {
    OS: Platform.OS,
    WINDOW_WIDTH: Dimensions.get('window').width,
    WINDOW_HEIGHT: Dimensions.get('window').height, 
}

console.log("OS: " + initialState.OS)

export const deviceSlice = createSlice({
    name: "device",
    initialState,
    reducers: {}
});

export default deviceSlice.reducer;