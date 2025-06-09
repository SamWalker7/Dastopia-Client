import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import flag from "../../images/hero/image.png"; // Ensure this path is correct
import { useLocation } from "react-router-dom";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // For the close button

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { firstName, lastName } = location.state || {};

  const prefix = "+251"; // Define prefix at component scope

  const [phone_number, setphone_number] = useState(prefix); // Initialize with prefix
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [errors, setErrors] = useState({});

  // Phone number validation useEffect
  useEffect(() => {
    const validatePhoneNumber = () => {
      let phoneError = undefined;
      const phoneRegex = /^\+251(9|7)\d{8}$/;

      if (phone_number === prefix) {
        // Use component-scoped prefix for comparison
        phoneError = "Phone number is required (e.g., +251912345678)";
      } else if (!phoneRegex.test(phone_number)) {
        phoneError =
          "Invalid format. Use +251 followed by 9 or 7 and 8 digits (e.g., +251912345678).";
      }

      setErrors((prevErrors) => {
        if (prevErrors.phone_number === phoneError) {
          return prevErrors;
        }
        const updatedErrors = { ...prevErrors };
        if (phoneError) {
          updatedErrors.phone_number = phoneError;
        } else {
          if (updatedErrors.hasOwnProperty("phone_number")) {
            delete updatedErrors.phone_number;
          }
        }
        return updatedErrors;
      });
    };

    validatePhoneNumber();
  }, [phone_number, prefix]); // Added prefix to dependency array as it's used in condition

  // Handle change for phone number input
  const handlePhoneNumberChange = (e) => {
    // prefix is now available from component scope
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

  // Email validation (can be expanded or used in a similar useEffect)
  useEffect(() => {
    const validateEmail = () => {
      let emailError = undefined;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRegex.test(email)) {
        emailError = "Invalid email format.";
      }
      // To clear error if email becomes valid or empty after being invalid
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
    if (email) validateEmail(); // Validate only if email is not empty
    else {
      // Clear error if email is cleared
      setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        if (updatedErrors.hasOwnProperty("email")) {
          delete updatedErrors.email;
        }
        return updatedErrors;
      });
    }
  }, [email]);

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final check, though isSubmitDisabled should prevent this
    if (isSubmitDisabled) {
      console.log("Form submission blocked by client-side validation.");
      // Optionally update errors state if some fields are just empty without specific format errors
      let currentErrors = { ...errors };
      if (!email) currentErrors.email = "Email is required.";
      if (!password) currentErrors.password = "Password is required.";
      if (phone_number === prefix)
        currentErrors.phone_number = "Phone number is required.";
      setErrors(currentErrors);
      return;
    }

    try {
      const response = await fetch(
        `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/auth/signup`,
        {
          headers: { "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            phone_number,
            password,
            email,
          }),
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
    !!errors.email || // Consider email validation errors
    !email || // Email is empty
    !password || // Password is empty
    phone_number === prefix; // Phone number is just the prefix

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
                top: "12px", // Adjust as needed
                right: "0px", // Adjust as needed
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
            <div className="relative inline-block my-3 text-lg w-full">
              <label className="absolute -top-2 left-3 text-base bg-white px-1 text-gray-500">
                Phone Number
              </label>
              <div className="border border-gray-400 items-center rounded-md flex bg-white">
                <img
                  src={flag}
                  className="w-12 h-8 rounded-xl ml-4 object-contain"
                  alt="Flag"
                />
                <input
                  type="tel"
                  name="phone_number"
                  value={phone_number}
                  onChange={handlePhoneNumberChange}
                  className="flex w-full p-3 py-4 bg-white text-gray-500 rounded-md focus:outline focus:outline-1 focus:outline-blue-400"
                  placeholder="+251XXXXXXXXX"
                />
              </div>
              {errors.phone_number && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.phone_number}
                </p>
              )}
            </div>
            <div className="relative inline-block my-3 text-lg w-full">
              <label className="absolute -top-2 left-3 text-base bg-white px-1 text-gray-500">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email"
                className="flex border border-gray-400 justify-between w-full p-3 py-4 bg-white text-gray-500 rounded-md focus:outline focus:outline-1 focus:outline-blue-400"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>
              )}
            </div>
            <div className="relative inline-block my-3 text-lg w-full">
              <label className="absolute -top-2 left-3 text-base bg-white px-1 text-gray-500">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                placeholder="Enter Your Password"
                className="flex border border-gray-400 justify-between w-full p-3 py-4 bg-white text-gray-500 rounded-md focus:outline focus:outline-1 focus:outline-blue-400"
              />
              {errors.password && ( // Display password error if any (e.g., from server)
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.password}
                </p>
              )}
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
              isSubmitDisabled // Use the comprehensive disable check for styling
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#00113D] hover:bg-blue-900"
            }`}
            disabled={isSubmitDisabled} // Use the comprehensive disable check
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
