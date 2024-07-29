import { configureStore } from "@reduxjs/toolkit";

import vehicleReducer from "./slices/vehicleSlice"
import authReducer from "./slices/authSlice"

const store = configureStore({
    reducer : {
        vehicle: vehicleReducer,
        auth: authReducer
    }
});

export default store