import { createStore } from "redux";

const initialState = {
    IP: process.env.IP,
    PORT: process.env.PORT,
    userId: undefined,
    accessToken: undefined,
};

function handleState(state = initialState, action) {
    switch (action.type) {
        case "LOGIN":
            return {
                ... state,
                accessToken: action.accessToken,
                userId: action.userId,
            };

        case "CONNECT_TO_SERVER":
                return {
                    ... state,
                    IP: action.IP,
                    PORT: action.PORT,
                }
               
        case "SELECT_PET":
            return{
                ...state,
                pet: action.pet,
            }

        default:
            return state;
    }
}

const store = createStore(handleState);

export default store;