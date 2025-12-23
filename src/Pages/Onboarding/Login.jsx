import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import flag from "../../images/hero/image.png"; // Make sure this path is correct
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/auth/authThunks"; // Ensure this path is correct
import { IconButton, InputAdornment, TextField } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close"; // For the close button
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import PhoneMuiInput from "./PhoneMuiInput";
import { isValidPhoneNumber } from "react-phone-number-input";

const Login = ({ onClose }) => {
  // Added onClose prop for modal closing
  const [prefix, setPrefix] = useState("");
  const [country, setCountry] = useState();
  const [phone_number, setphone_number] = useState(""); // Stores only the 9/7xxxxxxx part
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated } = useSelector(
    // Removed 'error' as it's not used for displaying
    (state) => state.auth
  );

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

  useEffect(() => {
    if (isAuthenticated) {
      if (onClose) onClose(); // Close modal first
      navigate("/");
      window.location.reload(true);
    }
  }, [isAuthenticated, navigate, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    setErrors({});

    const validationErrors = {};

    if (!password) {
      validationErrors.password = "Password is required";
    }
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      // Use the constructed fullPhoneNumber for dispatch
      const resultAction = await dispatch(login(phone_number, password));
      await resultAction.unwrap();
      // Success is handled by the useEffect hook watching isAuthenticated
    } catch (rejectedValueOrSerializedError) {
      console.error("Login failed:", rejectedValueOrSerializedError);
      setLoginError("Phone number or password is incorrect. Please try again.");
    }
  };

  const handleForgotClick = (e) => {
    e.preventDefault();
    if (onClose) onClose(); // Close current modal before navigating
    navigate("/forgot");
  };



  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setPassword(value);
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (!value && prevErrors.password_touched) {
        newErrors.password = "Password is required";
      } else {
        delete newErrors.password;
      }
      return newErrors;
    });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // const handlePhoneNumberInputChange = (e) => {
  //   const input = e.target.value.replace(/\D/g, ""); // Remove non-digits
  //   if (input.length <= 9) {
  //     // Max 9 digits after +251
  //     setphone_number(input);
  //   }
  // };

  // const handlePhoneBlur = () => {
  //   setErrors((prev) => ({ ...prev, phone_number_touched: true }));
  //   // Trigger validation explicitly on blur to catch required error if empty
  //   if (!phone_number) {
  //     setErrors((prev) => ({
  //       ...prev,
  //       phone_number: "Phone number is required",
  //     }));
  //   } else if (!/^(9|7)\d{8}$/.test(phone_number)) {
  //     setErrors((prev) => ({
  //       ...prev,
  //       phone_number:
  //         "Invalid phone number. It should be 9 digits starting with 9 or 7.",
  //     }));
  //   }
  // };
  const handlePasswordBlur = () => {
    setErrors((prev) => ({ ...prev, password_touched: true }));
    if (!password) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
    }
  };

  return (
    // Modal Backdrop
    <div
      className="fixed inset-0 w-full h-full flex justify-center items-center bg-black bg-opacity-60 z-50 p-4"
      onClick={onClose} // Close modal when backdrop is clicked
    >
      {/* Modal Content */}
      <div
        className="w-full max-w-md bg-[#FAF9FE] rounded-lg shadow-xl p-6 md:p-8 relative transform transition-all scale-100" // Adjusted max-width and padding
        onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
      >
        <Link to="/">
          {" "}
          <IconButton
            aria-label="close login modal"
            sx={{
              position: "absolute",
              top: "12px", // Adjust as needed
              right: "12px", // Adjust as needed
              color: "text.secondary",
            }}
          >
            <CloseIcon />
          </IconButton>
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold my-6 text-center text-black">
          Login
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 mb-4">
            {/* Phone Number Input with Fixed Prefix */}
            <div className="relative">
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
            </div>

            {/* Password Input */}
            <div className="relative">
              <TextField
                label="Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                error={!!errors.password}
                helperText={errors.password}
                fullWidth // Use fullWidth prop from MUI
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                autoComplete="current-password"
                sx={{
                  "& .MuiOutlinedInput-root": { backgroundColor: "white" },
                }}
              />
            </div>

            <a
              href="/forgot" // This will cause full page navigation, consider using Link if /forgot is a route in your app
              onClick={handleForgotClick}
              className="flex flex-row items-end justify-end text-blue-600 hover:text-blue-800 underline text-sm"
            >
              Forgot password?
            </a>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
              {loginError}
            </div>
          )}

          <button
            type="submit"
            disabled={
              !!errors.phone_number ||
              !!errors.password || // Check if any error string exists
              loading ||
              !phone_number || // Ensure input part is filled
              !password
            }
            className={`w-full text-white text-base font-medium rounded-full py-3 transition duration-150 ease-in-out ${
              !errors.phone_number &&
              !errors.password &&
              password &&
              !loading
                ? "bg-[#00113D] hover:bg-blue-900"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center mt-6 text-sm text-gray-700">
            Don't have an account?{" "}
            <Link
              to="/signup"
              onClick={() => {
                if (onClose) onClose();
              }} // Close login modal before navigating to signup
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Create Account
            </Link>
          </p>
        </form>

        <p className="text-center text-gray-500 text-xs mt-8">
          By creating an account or signing up you agree to our{" "}
          <a
            href="/terms" // Full page navigation
            target="_blank" // Open in new tab
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Terms and Conditions
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
