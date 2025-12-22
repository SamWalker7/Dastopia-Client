import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import flag from "../../images/hero/image.png";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close"; // For the close button
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import PhoneMuiInput from "./PhoneMuiInput";
import { isValidPhoneNumber } from "react-phone-number-input";

const ForgotPassword = () => {
  // This state will now only hold the 9 digits of the phone number
  const [phone_number, setphone_number] = useState("");
  const [prefix, setPrefix] = useState("");
    const [country, setCountry] = useState();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phone_number || errors.phone_number) return;

    try {
      const response = await fetch(
        "https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/auth/forget_password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone_number: phone_number }),
        }
      );

      if (!response.ok) {
        console.error("Failed to send OTP", response);
        // You might want to set an error state here to show the user
        return;
      }
      console.log(response);

      // Pass the full phone number to the reset password page
      navigate("/resetpassword", { state: { phone_number: phone_number } });
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };


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
          <button
            type="submit"
            disabled={Object.keys(errors).length > 0}
            className={`w-full text-white text-lg rounded-full py-3 transition ${
              !errors.phone_number && phone_number
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
