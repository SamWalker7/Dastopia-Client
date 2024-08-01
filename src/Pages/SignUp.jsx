import React, { useState } from "react";
import { Button, TextField, Typography, Container, Box } from "@mui/material";
import { useDispatch } from "react-redux";

import { signup } from "../api/auth";
import { useNavigate } from "react-router-dom";

const SignUp = () => {

  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First Name is required";
    if (!formData.lastName) newErrors.lastName = "Last Name is required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid Email is required";
    if (!formData.phoneNumber || !/^\d+$/.test(formData.phoneNumber))
      newErrors.phoneNumber = "Valid Phone Number is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords must match";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    console.log("Form submitted successfully", formData);

    try{
      const d = await signup(formData.email, formData.firstName, formData.lastName, formData.phoneNumber, formData.password);
      console.log("resolved data", d);
    }catch(e){
      console.log(e, "returned error");
    }

    const email = formData.email;
    
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    navigate(`/confirmaccount/${email}`)

  };

  return (
    <Container component="main" maxWidth="xs" style={{ paddingTop: 120 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 8,
          backgroundColor: "white",
          boxShadow: "0px",
          borderRadius: "5px",
          border: "1px solid gray",
          py: 3,
          px: 1,
        }}
      >
        <Typography component="h1" variant="h3">
          Sign Up
        </Typography>
        <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="fn"
            label="First Name"
            name="firstName"
            autoComplete="fname"
            autoFocus
            value={formData.firstName}
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
            error={!!errors.firstName}
            helperText={errors.firstName}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="ln"
            label="Last Name"
            name="lastName"
            autoComplete="lname"
            value={formData.lastName}
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
            error={!!errors.lastName}
            helperText={errors.lastName}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
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
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="phoneNumber"
            label="Phone Number"
            name="phoneNumber"
            autoComplete="tel"
            value={formData.phoneNumber}
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
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
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
            error={!!errors.password}
            helperText={errors.password}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={formData.confirmPassword}
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
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1, fontSize: 15 }}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;
