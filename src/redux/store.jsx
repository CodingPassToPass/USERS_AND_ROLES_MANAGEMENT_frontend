import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Slices/userSlice.jsx";
import roleReducer from "./Slices/roleSlice.jsx";
import componentReducer from "./Slices/component.jsx"

const store = configureStore({
    reducer:{
        user: userReducer,
        role: roleReducer,
        component: componentReducer,
    }
})

export default store;
