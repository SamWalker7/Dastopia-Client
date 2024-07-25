import React from "react";
import { Button, TextField, Typography, Container, Box } from "@mui/material";

const SignUp = () => {
  return (
    <Container component="main" maxWidth="xs" style={{ paddingTop: 120 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 8,
        }}
      >
        <Typography component="h1" variant="h3">
          Sign Up
        </Typography>
        <Box component="form" sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="fn"
            label="First Name"
            name="firstName"
            autoComplete="fname"
            autoFocus
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
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="ln"
            label="Last Name"
            name="lastName"
            autoComplete="lname"
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
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
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
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="phoneNumber"
            label="Phone Number"
            name="phoneNumber"
            autoComplete="tel"
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
