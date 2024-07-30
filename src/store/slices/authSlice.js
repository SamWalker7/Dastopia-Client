import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false,
    user: null,
    loading: false,
    error: null
}


