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

const Login = ({ onClose }) => {
  // Added onClose prop for modal closing
  const [phoneNumberInput, setPhoneNumberInput] = useState(""); // Stores only the 9/7xxxxxxx part
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

  const fullPhoneNumber = `+251${phoneNumberInput}`; // Construct full phone number

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
    if (!phoneNumberInput) {
      validationErrors.phone_number = "Phone number is required";
    } else if (!/^(9|7)\d{8}$/.test(phoneNumberInput)) {
      validationErrors.phone_number =
        "Invalid phone number. It should start with 9 or 7 and be 9 digits long after +251.";
    }

    if (!password) {
      validationErrors.password = "Password is required";
    }
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      // Use the constructed fullPhoneNumber for dispatch
      const resultAction = await dispatch(login(fullPhoneNumber, password));
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

  // Real-time validation for the phone number input part
  useEffect(() => {
    const validatePhoneNumberInput = () => {
      let validationErrors = { ...errors };
      const phoneRegex = /^(9|7)\d{0,8}$/; // Allows incomplete input for real-time feedback
      const completePhoneRegex = /^(9|7)\d{8}$/;

      if (!phoneNumberInput && errors.phone_number_touched) {
        // Show required only if touched and empty
        validationErrors.phone_number = "Phone number is required";
      } else if (phoneNumberInput && !phoneRegex.test(phoneNumberInput)) {
        validationErrors.phone_number =
          "Invalid input. Must start with 9 or 7 and contain only digits.";
      } else if (
        phoneNumberInput &&
        !completePhoneRegex.test(phoneNumberInput) &&
        phoneNumberInput.length === 9
      ) {
        // If it's 9 digits but still doesn't match the complete pattern (e.g. starts with 8)
        validationErrors.phone_number = "Number must start with 9 or 7.";
      } else {
        delete validationErrors.phone_number;
      }
      setErrors(validationErrors);
    };

    if (errors.phone_number_touched || phoneNumberInput) {
      // Validate if touched or has input
      validatePhoneNumberInput();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phoneNumberInput]);

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

  const handlePhoneNumberInputChange = (e) => {
    const input = e.target.value.replace(/\D/g, ""); // Remove non-digits
    if (input.length <= 9) {
      // Max 9 digits after +251
      setPhoneNumberInput(input);
    }
  };

  const handlePhoneBlur = () => {
    setErrors((prev) => ({ ...prev, phone_number_touched: true }));
    // Trigger validation explicitly on blur to catch required error if empty
    if (!phoneNumberInput) {
      setErrors((prev) => ({
        ...prev,
        phone_number: "Phone number is required",
      }));
    } else if (!/^(9|7)\d{8}$/.test(phoneNumberInput)) {
      setErrors((prev) => ({
        ...prev,
        phone_number:
          "Invalid phone number. It should be 9 digits starting with 9 or 7.",
      }));
    }
  };
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
              <label
                className="absolute -top-2.5 left-3 text-xs bg-[#FAF9FE] px-1 text-gray-600" // Adjusted for better label float
                htmlFor="phone_number_input"
              >
                Phone Number
              </label>
              <div className="flex items-center border border-gray-400 rounded-md bg-white focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500">
                <img
                  src={flag}
                  className="w-8 h-6 ml-3 rounded" // Adjusted flag size
                  alt="Flag"
                />
                <span className="px-2 text-gray-700 text-base">+251</span>
                <input
                  type="tel" // Use type="tel" for phone numbers
                  id="phone_number_input"
                  name="phone_number_input"
                  value={phoneNumberInput}
                  onChange={handlePhoneNumberInputChange}
                  onBlur={handlePhoneBlur}
                  className="flex-grow p-3 bg-transparent text-gray-800 rounded-r-md focus:outline-none text-base placeholder-gray-400"
                  placeholder="912345678"
                  maxLength="9" // Max 9 digits
                  autoComplete="tel-national"
                />
              </div>
              {errors.phone_number && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone_number}
                </p>
              )}
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
              !phoneNumberInput || // Ensure input part is filled
              !password ||
              !/^(9|7)\d{8}$/.test(phoneNumberInput) // Also validate format before enabling
            }
            className={`w-full text-white text-base font-medium rounded-full py-3 transition duration-150 ease-in-out ${
              !errors.phone_number &&
              !errors.password &&
              /^(9|7)\d{8}$/.test(phoneNumberInput) &&
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
