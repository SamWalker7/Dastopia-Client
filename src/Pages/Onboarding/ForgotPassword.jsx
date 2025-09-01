import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import flag from "../../images/hero/image.png";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close"; // For the close button

const ForgotPassword = () => {
  // This state will now only hold the 9 digits of the phone number
  const [mobileNumber, setMobileNumber] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mobileNumber || errors.phone_number) return;

    // Construct the full phone number with the prefix before sending
    const fullPhoneNumber = `+251${mobileNumber}`;

    try {
      const response = await fetch(
        "https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/auth/forget_password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone_number: fullPhoneNumber }),
        }
      );

      if (!response.ok) {
        console.error("Failed to send OTP", response);
        // You might want to set an error state here to show the user
        return;
      }
      console.log(response);

      // Pass the full phone number to the reset password page
      navigate("/resetpassword", { state: { phone_number: fullPhoneNumber } });
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  // New handler to control the input for the 9-digit number
  const handlePhoneInputChange = (e) => {
    const value = e.target.value;
    // Allow only numeric input and limit to 9 characters
    if (/^\d*$/.test(value) && value.length <= 9) {
      setMobileNumber(value);
    }
  };

  useEffect(() => {
    const validatePhoneNumber = () => {
      let validationErrors = {};
      // Updated regex to validate the 9-digit part of the number
      const phoneRegex = /^(9|7)\d{8}$/;

      if (!mobileNumber) {
        validationErrors.phone_number = "Phone number is required";
      } else if (!phoneRegex.test(mobileNumber)) {
        validationErrors.phone_number =
          "Number must be 9 digits and start with 9 or 7.";
      }

      setErrors(validationErrors);
    };

    validatePhoneNumber();
  }, [mobileNumber]);

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="w-full max-w-xl mx-auto p-10 rounded-lg shadow-lg bg-[#FAF9FE] relative scale-75">
        <div className="flex w-full justify-between items-center ">
          <h1 className="text-3xl font-bold my-8">Forgot Password</h1>
          <Link to="/" className="relative -mt-40">
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
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 mb-4">
            <div className="relative inline-block my-3 text-lg w-full">
              <label
                className="absolute -top-2 left-3 text-base bg-white px-1 text-gray-500"
                htmlFor="phone_number"
              >
                Phone Number
              </label>
              <div className="border border-gray-400 items-center rounded-md flex bg-white focus-within:outline focus-within:outline-1 focus-within:outline-blue-400">
                <img
                  src={flag}
                  className="w-12 h-8 rounded-xl ml-4"
                  alt="Flag"
                />
                <span className="px-2 text-gray-500">+251</span>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  value={mobileNumber}
                  onChange={handlePhoneInputChange}
                  className="flex-grow w-full p-3 py-4 bg-transparent text-gray-500 rounded-r-md focus:outline-none"
                  placeholder="912 345 678"
                  maxLength="9"
                />
              </div>
              {errors.phone_number && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone_number}
                </p>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={Object.keys(errors).length > 0}
            className={`w-full text-white text-lg rounded-full py-3 transition ${
              !errors.phone_number && mobileNumber
                ? "bg-[#00113D] hover:bg-blue-900"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export { ForgotPassword };

// No changes are needed for the Resetpassword component. It remains the same.
const Resetpassword = () => {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const phone_number = location.state?.phone_number;
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(phone_number);

    try {
      const resetResponse = await fetch(
        "https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/auth/reset_password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone_number: phone_number,
            otp: otp,
            new_password: password,
          }),
        }
      );

      if (!resetResponse.ok) {
        alert("Failed to reset password");
        return;
      }

      localStorage.setItem("passwordReset", "true");
      navigate("/login");
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="w-full max-w-xl mx-auto p-10 rounded-lg shadow-lg bg-[#FAF9FE] relative scale-75">
        <div className="flex w-full justify-between items-center ">
          <h1 className="text-3xl font-bold my-8">Reset Password</h1>

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
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 mb-6">
            <div className="relative inline-block text-lg w-full">
              <label
                className="absolute -top-2 left-3 text-base bg-white px-1 text-gray-500"
                htmlFor="otp"
              >
                OTP
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 py-4 border border-gray-400 rounded-md focus:outline focus:outline-1 focus:outline-blue-400"
                placeholder="Enter OTP"
              />
            </div>
            <TextField
              label="New Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              className="w-full"
            />
          </div>
          <button
            type="submit"
            className="w-full text-white text-lg rounded-full py-3 transition bg-[#00113D] hover:bg-blue-900"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export { Resetpassword };
export default ForgotPassword;
