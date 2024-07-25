import React from "react";
import { Button, TextField, Typography, Container, Box } from "@mui/material";

function SignIn() {
  return (
    <Container component="main" maxWidth="xs" style={{ paddingTop: 150 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 8,
        }}
      >
        <Typography component="h1" variant="h3">
          Sign In
        </Typography>
        <Box component="form" sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
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
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
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
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default SignIn;
