import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import BASE_URL from "../../api/baseUrl";

const baseUrl =
  "https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1";

const initialState = {
  bookingRequests: [],
  loading: false,
  error: null,
};

export const fetchBookingRequests = createAsyncThunk(
  "bookingRequest/fetchBookingRequests",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${baseUrl}/booking/get_all_owner_booking`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.body;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const requestBooking = createAsyncThunk(
  "bookingRequest/requestBooking",
  async (data, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${BASE_URL}/booking`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("request booking", response);
      return response.data;
    } catch (e) {
      console.log("incoming error", e);
      return rejectWithValue(e.response.message || e.message);
    }
  }
);

const approveBooking = createAsyncThunk(
  "bookingRequest/approveBooking",
  async (_, { rejectWithValue }) => {}
);

const denyBooking = createAsyncThunk(
  "bookingRequest/denyBooking",
  async (_, { rejectWithValue }) => {}
);

const bookingSlice = createSlice({
  name: "bookingRequest",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookingRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBookingRequests.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action, "action");
        state.bookingRequests = action.payload;
      })
      .addCase(fetchBookingRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(requestBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(requestBooking.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action, "action");
      })
      .addCase(requestBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log("rejected", action);
      });
  },
});

export default bookingSlice.reducer;
