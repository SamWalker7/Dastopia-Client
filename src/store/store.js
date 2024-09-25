import { configureStore } from "@reduxjs/toolkit";

import vehicleReducer from "./slices/vehicleSlice";
import bookingReducer from "./slices/bookingRequestSlice";
import authReducer from "./slices/authSlice";
import listingReducer from "./slices/listingSlice"

const store = configureStore({
  reducer: {
    vehicle: vehicleReducer,
    booking: bookingReducer,
    auth: authReducer,
    listing: listingReducer
  },
});

export default store;
