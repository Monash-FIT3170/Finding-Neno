import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: null,
    name: '',
    image_url: '',
    animal: '',
    breed: '',
    description: '',
    owner_id: null,
}

export const petSlice = createSlice({
    name: "pet",
    initialState,
    reducers: {
        selectPet: (state, {payload}) => {
            state.id = payload.id;
            state.name = payload.name;
            state.image_url = payload.image_url;
            state.animal = payload.animal;
            state.breed = payload.breed;
            state.description = payload.description;
            state.owner_id = payload.owner_id;
        }
    }
});

export const { selectPet } = petSlice.actions;

export default petSlice.reducer;