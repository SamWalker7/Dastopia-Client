import { configureStore } from "@reduxjs/toolkit";

import vehicleReducer from "./slices/vehicleSlice"

const store = configureStore({
    reducer : {
        vehicle: vehicleReducer
    }
});

export default store