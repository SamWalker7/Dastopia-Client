import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import BASE_URL from "../../api/baseUrl";


const initialState = {
  listings: [],
  loading: false,
  error: null,
};

export const fetchListing = createAsyncThunk(
  "listing/fetchListing",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${BASE_URL}/vehicle/owner_car`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("response", response);
      return response.data;
    } catch (e) {
      console.log("response error", e);
      return rejectWithValue(e.response.data.body || e.message);
    }
  }
);

export const createVehicle = createAsyncThunk(
  "listing/createVehicle",
  async (data, { rejectWithValue }) => {
    
    try {
      const token = localStorage.getItem("token");
      console.log(token, "extracted token");
      await axios.post(`${BASE_URL}/vehicle/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (e) {
      console.log("error while creating", e);
      return rejectWithValue(e.response.body || e.message);
    }
  }
);

const listingSlice = createSlice({
  name: "listing",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createVehicle.pending, (state) => {
        state.loading = true;
      })
      .addCase(createVehicle.fulfilled, (state, action) => {
        state.loading = true;

        state.listings.push(action.payload);
      })
      .addCase(createVehicle.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchListing.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchListing.fulfilled, (state, action) => {
        state.loading = false;
        // console.log(action, "action")
        state.listings = action.payload.body.Items;
      })
      .addCase(fetchListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default listingSlice.reducer;
