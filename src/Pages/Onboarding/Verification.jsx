import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  IconButton,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // For the close button
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import PhoneMuiInput from "./PhoneMuiInput";
import { isValidPhoneNumber } from "react-phone-number-input";


const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { firstName, lastName, referralCode } = location.state || {};


  const [prefix, setPrefix] = useState("");
  const [country, setCountry] = useState();
  const [phone_number, setphone_number] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [refferal, setRefferal] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password
  const [user_type, setUserType] = useState("rent"); // State for user role
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const detectCountry = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();

        if (data?.country_code) {
          setCountry(data.country_code);
          setPrefix(data.country_calling_code);
        } else {
          setCountry("ET");
        }
      } catch (err) {
        console.error("Geo detect failed", err);
        setCountry("ET");
      }
    };

    detectCountry();
  }, []);

  useEffect(() => {
    if (referralCode) setRefferal(refferal);
  }, [refferal])

  // Phone number validation useEffect
  useEffect(() => {
    let phoneError;

    if (!phone_number) {
      phoneError = "Phone number is required";
    } else if (!isValidPhoneNumber(phone_number)) {
      phoneError = "Invalid phone number";
    }

    setErrors((prev) => {
      const updated = { ...prev };
      if (phoneError) updated.phone_number = phoneError;
      else delete updated.phone_number;
      return updated;
    });
  }, [phone_number]);


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
        user_type,
      };

      if (email) {
        requestBody.email = email;
      }

      if (refferal && refferal.trim() !== "") {
        requestBody.referral_code = refferal.trim();
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
    phone_number === prefix || 
    !user_type; // user_type must be selected

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-xl mx-auto p-10 rounded-lg shadow-lg bg-[#FAF9FE]
                max-h-[90vh] overflow-y-auto overscroll-contain">

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

            <PhoneInput
              international
              defaultCountry={country}
              value={phone_number}
              onChange={setphone_number}
              onCountryChange={setCountry}
              countrySelectProps={{ unicodeFlags: true }}
              inputComponent={PhoneMuiInput}
              label="Phone Number"
              error={!!errors.phone_number}
              helperText={errors.phone_number}
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

            <div className="mt-8">
              <h3 className="text-gray-700 font-semibold mb-2">Optional Details</h3>

              <div className="p-4 border rounded-xl bg-gray-50 shadow-sm">
                <TextField
                  label="Referral Code (Optional)"
                  fullWidth
                  value={refferal}
                  onChange={(e) => setRefferal(e.target.value)}
                  helperText="Leave blank if you don’t have a referral code"
                />

              </div>
            </div>


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
