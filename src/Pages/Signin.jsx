import React, { useState } from "react";
import { Button, TextField, Typography, Container, Box } from "@mui/material";

function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length === 0) {
      // Handle form submission
      console.log("Form submitted successfully", formData);
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <Container component="main" maxWidth="xs" style={{ paddingTop: 150 }}>
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
