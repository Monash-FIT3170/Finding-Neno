import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    name: '',
    imageUrl: '',
    animal: '',
    breed: '',
    description: '',
    ownerId: null,
}

export const petSlice = createSlice({
    name: "pet",
    initialState,
    reducers: {
        selectPet: (state, {payload}) => {
            state.name = payload.name;
            state.imageUrl = payload.imageUrl;
            state.animal = payload.animal;
            state.breed = payload.breed;
            state.description = payload.description;
            state.ownerId = payload.ownerId;
        }
    }
});

export const { selectPet } = petSlice.actions;

export default petSlice.reducer;