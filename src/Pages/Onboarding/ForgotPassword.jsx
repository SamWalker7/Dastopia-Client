import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import flag from "../../images/hero/image.png";

const ForgotPassword = () => {
  const [phone_number, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phone_number || errors.phone_number) return;

    try {
      const response = await fetch("https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/auth/forget_password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "phone_number": phone_number }),
      });

      if (!response.ok) {
        console.error("Failed to send OTP",response)
        return;
      }
       console.log(response);

      navigate("/resetpassword", { state: { phone_number } });
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  useEffect(() => {
    const validatePhoneNumber = () => {
      let validationErrors = {};
      const phoneRegex = /^\+251(9|7)\d{8}$/;

      if (!phone_number) {
        validationErrors.phone_number = "Phone number is required";
      } else if (!phoneRegex.test(phone_number)) {
        validationErrors.phone_number =
          "Invalid phone number. It should start with +2519 or +2517 and be 12 digits long.";
      }

      setErrors(validationErrors);
    };

    validatePhoneNumber();
  }, [phone_number]);

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="w-full max-w-xl mx-auto p-10 rounded-lg shadow-lg bg-[#FAF9FE] relative">
        <h1 className="text-3xl font-bold my-8">Forgot Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 mb-4">
            <div className="relative inline-block my-3 text-lg w-full">
              <label
                className="absolute -top-2 left-3 text-base bg-white px-1 text-gray-500"
                htmlFor="phone_number"
              >
                Phone Number
              </label>
              <div className="border border-gray-400 items-center rounded-md flex bg-white">
                <img
                  src={flag}
                  className="w-12 h-8 rounded-xl ml-4"
                  alt="Flag"
                />
                <input
                  type="text"
                  id="phone_number"
                  name="phone_number"
                  value={phone_number}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex justify-between w-full p-3 py-4 bg-white text-gray-500 rounded-md focus:outline focus:outline-1 focus:outline-blue-400"
                  placeholder="Enter your phone number"
                />
              </div>
              {errors.phone_number && (
                <p className="text-red-500 mb-4">{errors.phone_number}</p>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={Object.keys(errors).length > 0}
            className={`w-full text-white text-lg rounded-full py-3 transition ${
              !errors.phone_number
                ? "bg-[#00113D] hover:bg-blue-900"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );
};

const Resetpassword = () => {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const phone_number = location.state?.phone_number;

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(phone_number);

    try {
      const resetResponse = await fetch("https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/auth/reset_password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "phone_number": phone_number, "otp":otp, "new_password":password }),
      });

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

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
  <div className="w-full max-w-xl mx-auto p-10 rounded-lg shadow-lg bg-[#FAF9FE] relative">
    <h1 className="text-3xl font-bold my-8">Reset Password</h1>
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4 mb-6">
        {/* OTP Input */}
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

        {/* New Password Input */}
        <div className="relative inline-block text-lg w-full">
          <label
            className="absolute -top-2 left-3 text-base bg-white px-1 text-gray-500"
            htmlFor="password"
          >
            New Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 py-4 border border-gray-400 rounded-md focus:outline focus:outline-1 focus:outline-blue-400"
            placeholder="Enter new password"
          />
        </div>
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