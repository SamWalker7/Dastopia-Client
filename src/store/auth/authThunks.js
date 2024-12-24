// src/redux/thunks/authThunks.js

import { loginRequest, loginSuccess, loginFailure } from "./authActions";

export const login = (phone_number, password) => async (dispatch) => {
  dispatch(loginRequest());

  try {
    const response = await fetch(
      `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/auth/signin`,
      {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ phone_number, password }),
      }
    );

    const json = await response.json();

    if (response.ok) {
      // Save user data to localStorage
      localStorage.setItem("customer", JSON.stringify(json.body));
      alert("You have successfully logged in");
      dispatch(loginSuccess(json.body));
      console.log(json);
    } else {
      dispatch(loginFailure(json.body.message || "Login failed"));
    }
  } catch (error) {
    dispatch(loginFailure("Network error"));
  }
};
