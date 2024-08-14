import React, { useState } from "react";
import { Button, TextField, Typography, Container, Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import { signup } from "../api/auth";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [uuid, setUuid] = useState("");

  const generateUUID = () => {
    const newUUID = uuidv4();
    return newUUID;
  };

  const [phone, setPhone] = useState("");

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
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords must match";
    return newErrors;
  };

  const validatePasswordInput = (password) => {
    console.log("password", password);
    const errors = [];

    if (!/(?=.*[0-9])/.test(password)) {
      errors.push("Should contain at least 1 number");
    }
    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      errors.push("Should contain at least 1 special character");
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("Should contain at least 1 uppercase letter");
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("Should contain at least 1 lowercase letter");
    }
    if (password.length < 8) {
      errors.push("Password minimum length: 8 characters");
    }

    if (password !== formData.confirmPassword) {
      errors.push("passwords must match");
    }

    console.log("inside validation", errors);
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    const err = validatePasswordInput(formData.password);

    if (Object.keys(validationErrors).length > 0) {
      console.log(validationErrors, "validation errors");
      setErrors(validationErrors);
      return;
    } else if (err.length > 0) {
      const passerr = {
        password: err[0],
      };
      setErrors(passerr);
      return;
    }

    console.log("Form submitted successfully", formData);

    try {
      const id = generateUUID();
      console.log("resolved data", id);
      const d = await signup(
        // id,
        formData.email,
        formData.firstName,
        formData.lastName,
        phone,
        formData.password
      );

      

      const phone_number = phone;

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
      });

      setPhone("");
      setErrors({});
      setPhone("");
      navigate(`/confirmaccount/${phone_number}`);
    } catch (e) {
      console.log(e, "returned error");
    }
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

          <PhoneInput
            country={"et"}
            value={phone}
            onChange={setPhone}
            placeholder="+251965667890"
            inputStyle={{
              width: "100%",
              height: "60px",
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

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p style={{ fontSize: "15px" }}> Already have an account ? </p>
          <a
            href="/signin"
            style={{
              textDecoration: "none",
              color: "#2a43cf",
              fontSize: "13px",
            }}
          >
            Signin here
          </a>
        </div>
      </Box>
    </Container>
  );
};

export default SignUp;
