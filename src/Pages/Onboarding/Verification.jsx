import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import flag from "../../images/hero/image.png"; // Ensure this path is correct
import { useLocation } from "react-router-dom";
import {
  IconButton,
  TextField,
  InputAdornment,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // For the close button

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { firstName, lastName } = location.state || {};

  const prefix = "+251"; // Define prefix at component scope

  const [phone_number, setphone_number] = useState(prefix); // Initialize with prefix
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password
  const [user_type, setUserType] = useState("rent"); // State for user role
  const [errors, setErrors] = useState({});

  // Phone number validation useEffect
  useEffect(() => {
    const validatePhoneNumber = () => {
      let phoneError = undefined;
      const phoneRegex = /^\+251(9|7)\d{8}$/;

      if (phone_number === prefix) {
        phoneError = "Phone number is required (e.g., +251912345678)";
      } else if (!phoneRegex.test(phone_number)) {
        phoneError =
          "Invalid format. Use +251 followed by 9 or 7 and 8 digits (e.g., +251912345678).";
      }

      setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        if (phoneError) {
          updatedErrors.phone_number = phoneError;
        } else if (updatedErrors.hasOwnProperty("phone_number")) {
          delete updatedErrors.phone_number;
        }
        return updatedErrors;
      });
    };

    validatePhoneNumber();
  }, [phone_number]);

  // Handle change for phone number input
  const handlePhoneNumberChange = (e) => {
    const maxSuffixLength = 9;
    let inputValue = e.target.value;
    let newPhoneNumber;

    if (inputValue.startsWith(prefix)) {
      const suffix = inputValue.substring(prefix.length);
      let numericSuffix = suffix.replace(/[^0-9]/g, "");
      if (numericSuffix.length > maxSuffixLength) {
        numericSuffix = numericSuffix.substring(0, maxSuffixLength);
      }
      newPhoneNumber = prefix + numericSuffix;
    } else if (
      inputValue === "+" ||
      inputValue === "+2" ||
      inputValue === "+25"
    ) {
      newPhoneNumber = prefix;
    } else {
      let numericInput = inputValue.replace(/[^0-9]/g, "");
      if (numericInput.length > maxSuffixLength) {
        numericInput = numericInput.substring(0, maxSuffixLength);
      }
      newPhoneNumber = prefix + numericInput;
    }
    setphone_number(newPhoneNumber);
  };

  // Email validation (optional)
  useEffect(() => {
    const validateEmail = () => {
      let emailError = undefined;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRegex.test(email)) {
        emailError = "Invalid email format.";
      }
      setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        if (emailError) {
          updatedErrors.email = emailError;
        } else if (updatedErrors.hasOwnProperty("email")) {
          delete updatedErrors.email;
        }
        return updatedErrors;
      });
    };
    validateEmail();
  }, [email]);

  // Password confirmation validation
  useEffect(() => {
    const validatePasswords = () => {
      let passwordError = undefined;
      if (password && confirmPassword && password !== confirmPassword) {
        passwordError = "Passwords do not match.";
      }
      setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        if (passwordError) {
          updatedErrors.confirmPassword = passwordError;
        } else if (updatedErrors.hasOwnProperty("confirmPassword")) {
          delete updatedErrors.confirmPassword;
        }
        return updatedErrors;
      });
    };
    validatePasswords();
  }, [password, confirmPassword]);

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitDisabled) {
      console.log("Form submission blocked by client-side validation.");
      let currentErrors = { ...errors };
      if (!password) currentErrors.password = "Password is required.";
      if (!confirmPassword)
        currentErrors.confirmPassword = "Please confirm your password.";
      if (phone_number === prefix)
        currentErrors.phone_number = "Phone number is required.";
      if (!user_type) currentErrors.user_type = "Please select a role.";
      setErrors(currentErrors);
      return;
    }

    try {
      const requestBody = {
        first_name: firstName,
        last_name: lastName,
        phone_number,
        password,
        user_type, // Add user_type to the request
      };

      if (email) {
        requestBody.email = email;
      }

      const response = await fetch(
        `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/auth/signup`,
        {
          headers: { "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        navigate("/OTP", { state: { phone_number } });
        console.log("ok");
      } else {
        const json = await response.json();
        if (
          json.body &&
          typeof json.body.message === "object" &&
          json.body.message !== null
        ) {
          setErrors((prevErrors) => ({ ...prevErrors, ...json.body.message }));
        } else if (json.body && typeof json.body.message === "string") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            general: json.body.message,
          }));
          console.log("API Error (string): ", json.body.message);
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            general: "An unknown error occurred.",
          }));
          console.log("API Error: Unexpected response structure", json);
        }
      }
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        general: "Sign up failed. Please try again.",
      }));
      console.error("Signup fetch error:", error);
    }
  };

  // Determine if the submit button should be disabled
  const isSubmitDisabled =
    !!errors.phone_number ||
    !!errors.email ||
    !!errors.confirmPassword || // Check for password mismatch error
    !password || // Password is empty
    !confirmPassword || // Confirm password is empty
    phone_number === prefix || // Phone number is just the prefix
    !user_type; // user_type must be selected

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-xl mx-auto p-10 rounded-lg shadow-lg bg-[#FAF9FE]">
        <div className="flex w-full justify-between items-center ">
          <h1 className="text-4xl font-bold my-8">Account Verification</h1>
          <Link to="/" className="relative -mt-40">
            {" "}
            <IconButton
              aria-label="close login modal"
              sx={{
                position: "absolute",
                top: "12px",
                right: "0px",
                color: "text.secondary",
              }}
            >
              <CloseIcon />
            </IconButton>
          </Link>
        </div>
        {/* Progress Bar */}
        <div className="flex items-center justify-center">
          <div className="w-1/2 border-b-4 border-blue-200"></div>
          <div className="w-1/2 border-b-4 border-blue-200"></div>
        </div>
        <div className="flex justify-between w-full">
          <div className="flex flex-col w-1/2 items-start">
            <span className="text-sm font-semibold text-white bg-gray-500 rounded-full flex justify-center items-center w-6 h-6 mt-2">
              1
            </span>
            <p className="text-sm text-gray-400 font-medium text-center mb-4">
              Basic Information
            </p>
          </div>
          <div className="flex flex-col w-1/2 items-end">
            <span className="text-sm font-semibold text-white bg-sky-950 rounded-full flex justify-center items-center w-6 h-6 mt-2">
              2
            </span>
            <p className="text-sm text-gray-800 font-medium text-center mb-4">
              Mobile OTP
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col mb-4">
            {/* Role Selection */}
            <FormControl component="fieldset" className="my-3">
              <FormLabel component="legend">You are here to:</FormLabel>
              <RadioGroup
                row
                aria-label="user_type"
                name="user_type"
                value={user_type}
                onChange={(e) => setUserType(e.target.value)}
              >
                <FormControlLabel
                  value="rent"
                  control={<Radio />}
                  label="Rent a Car"
                />
                <FormControlLabel
                  value="list"
                  control={<Radio />}
                  label="List a Car"
                />
                <FormControlLabel
                  value="both"
                  control={<Radio />}
                  label="Both"
                />
              </RadioGroup>
            </FormControl>

            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              margin="normal"
              name="phone_number"
              value={phone_number}
              onChange={handlePhoneNumberChange}
              error={!!errors.phone_number}
              helperText={errors.phone_number}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <img src={flag} className="w-8 h-6 rounded-md" alt="Flag" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Email (Optional)"
              variant="outlined"
              fullWidth
              margin="normal"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
            />
            <TextField
              label="Confirm Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
          </div>

          {errors.general && (
            <p className="text-red-500 text-sm mb-4 text-center">
              {errors.general}
            </p>
          )}

          <button
            type="submit"
            className={`w-full text-white text-lg rounded-full py-3 transition ${
              isSubmitDisabled
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#00113D] hover:bg-blue-900"
            }`}
            disabled={isSubmitDisabled}
          >
            Send Verification Code
          </button>
        </form>

        <p className="text-center text-gray-500 text-xs mt-6">
          By creating an account or signing up you agree to our{" "}
          <Link to="/terms" className="text-blue-600 underline">
            Terms and Conditions
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
