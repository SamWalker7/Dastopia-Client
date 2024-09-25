import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import BASE_URL from "../../api/baseUrl";

const initialState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : {},
  loading: false,
  error: null,
  isAuthenticated: localStorage.getItem("token") ? true : false,
};

export const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      console.log("data", data);
      const response = await axios.post(`${BASE_URL}/auth/signin`, data);
      return response.data;
    } catch (e) {
      // console.log(e, "error")
      return rejectWithValue(e.response.data.body || e.response.message);
    }
  }
);

const register = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signout: (state, action) => {
      state.isAuthenticated = false;
      state.user = {};
    },
    clearError: (state, action) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;

        let flattenUserData = {};
        action.payload.body.userAttributes.forEach((user) => {
          flattenUserData[user.Name] = user.Value;
        });

        const responseData = {
          email_verified: flattenUserData["email_verified"],
          email: flattenUserData["email"],
          firstName: flattenUserData["given_name"],
          lastName: flattenUserData["family_name"],
          phoneNumber: flattenUserData["phone_number"],
          refreshToken: action.payload.body.RefreshToken,
          accessToken: action.payload.body.AccessToken,
          accExp: action.payload.body.ExpiresIn,
          userId: flattenUserData["sub"],
        };

        localStorage.setItem("token", responseData.accessToken);
        localStorage.setItem("accExp", responseData.accExp);
        localStorage.setItem("refreshToken", responseData.refreshToken);
        localStorage.setItem("user", JSON.stringify(responseData));

        console.log("fulfilled", action);
        state.user = responseData;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { signout, clearError } = authSlice.actions;
export default authSlice.reducer;
