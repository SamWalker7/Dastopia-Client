import React, { useEffect, useState } from "react";
import { Button, TextField, Typography, Container, Box } from "@mui/material";
import { useDispatch } from "react-redux";

import { getCurrentUser, signin } from "../api/auth";
import { useNavigate } from "react-router-dom";

function SignIn() {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null)

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email address is invalid";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length === 0) {
      try {
         const response = await signin(formData.email, formData.password)
          const responseData = {
            email_verified: response.idToken.payload.email_verified,
            email: response.idToken.payload.email,
            firstName: response.idToken.payload.given_name,
            lastName: response.idToken.payload.family_name,
            phoneNumber: response.idToken.payload.phone_number,
            refreshToken: response.refreshToken.token,
            accessToken: response.accessToken.jwtToken,
            accExp: response.accessToken.payload.exp,
            userId: response.accessToken.payload.username,
          };

          localStorage.setItem("token", responseData.accessToken);
          localStorage.setItem("accExp", responseData.accExp);
          localStorage.setItem("refreshToken", responseData.refreshToken);
          localStorage.setItem("user", JSON.stringify(responseData));
          navigate("/")
      
      } catch (err) {
        console.log("here")
        setError(err.message)
      }
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <Container component="main" maxWidth="xs" style={{ paddingTop: 150 }}>
      {error && (
            <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
          )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 8,
          backgroundColor: "white",
          boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "5px",
          py: 3,
          px: 1,
        }}
      >
        <Typography component="h1" variant="h3">
          Sign In
        </Typography>
        <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            InputProps={{
              sx: {
                fontSize: "1.5rem",
              },
            }}
            InputLabelProps={{
              sx: {
                fontSize: "1.5rem",
              },
            }}
            helperText={errors.email}
            error={!!errors.email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            InputProps={{
              sx: {
                fontSize: "1.5rem",
              },
            }}
            InputLabelProps={{
              sx: {
                fontSize: "1.5rem",
              },
            }}
            helperText={errors.password}
            error={!!errors.password}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1, fontSize: 15 }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default SignIn;
