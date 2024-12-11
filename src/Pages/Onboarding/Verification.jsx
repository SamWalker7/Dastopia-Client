import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import flag from "../../images/hero/image.png";
import { useLocation } from "react-router-dom";
const Login = () => {
  const [phone_number, setphone_number] = useState("");
  const [errors, setErrors] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const { firstName, lastName } = location.state || {};
  console.log("first_name", firstName);
  console.log("last_name", lastName);
  useEffect(() => {
    const validatephone_number = () => {
      let validationErrors = { ...errors };
      const phoneRegex = /^\+251(9|7)\d{9}$/; // +251 followed by 9 or 7, and then 8 digits

      if (!phone_number) {
        validationErrors.phone_number = "Phone number is required";
      } else if (!phoneRegex.test(phone_number)) {
        validationErrors.phone_number =
          "Invalid phone number. It should start with +2519 or +2517 and be 12 digits long.";
      } else {
        delete validationErrors.phone_number;
      }

      setErrors(validationErrors);
    };

    validatephone_number();
  }, [phone_number, errors]);

  const handleChange = (e) => {
    setphone_number(e.target.value);
  };

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const [password, setpassword] = useState("");
  const [email, setEmail] = useState("");
  //handle Submit
  const handleSubmit = async () => {
    const response = await fetch(
      `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/auth/signup`,
      {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({
          first_name: firstName,
          last_name,
          password,
          email,
        }),
      }
    );
    if (response.ok) {
      navigate("/OTP");
    }
    if (!response.ok) {
      const json = await response.json();
      setErrors(json.message);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-xl mx-auto p-10 rounded-lg shadow-lg bg-[#FAF9FE]">
        <h1 className="text-5xl font-bold my-8">Account Verification</h1>

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
          <div className="flex flex-col  mb-4">
            <div className="relative inline-block my-3 text-lg w-full">
              <label className="absolute -top-2 left-3 text-base bg-white px-1 text-gray-500">
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
                  name="phone_number"
                  value={phone_number}
                  onChange={handleChange}
                  className="flex w-full p-3 py-4 bg-white text-gray-500 rounded-md focus:outline focus:outline-1 focus:outline-blue-400"
                />
              </div>
              {errors.phone_number && (
                <p className="text-red-500 mb-4">{errors.phone_number}</p>
              )}
            </div>
            <div className="relative inline-block my-3 text-lg w-full">
              {/* Label inside box */}
              <label className="absolute -top-2 left-3 text-base bg-white px-1 text-gray-500">
                Email
              </label>
              <input
                type="text"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email"
                className="flex border border-gray-400 justify-between w-full p-3 py-4 bg-white text-gray-500 rounded-md focus:outline focus:outline-1 focus:outline-blue-400"
              />{" "}
              {errors.email && (
                <p className="text-red-500 mb-4">{errors.email}</p>
              )}
            </div>
            <div className="relative inline-block my-3 text-lg w-full">
              {/* Label inside box */}
              <label className="absolute -top-2 left-3 text-base bg-white px-1 text-gray-500">
                Password
              </label>
              <input
                type="text"
                name="password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                placeholder="Enter Your Password"
                className="flex border border-gray-400 justify-between w-full p-3 py-4 bg-white text-gray-500 rounded-md focus:outline focus:outline-1 focus:outline-blue-400"
              />{" "}
            </div>
          </div>

          {/* Submit Button */}
          <button
            className={`min-w-2xl text-white text-lg rounded-full px-32 py-3 transition ${
              !errors.phone_number
                ? "bg-[#00113D] hover:bg-blue-900"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Send Verification Code
          </button>
        </form>

        {/* Terms Text */}
        <p className="text-center text-gray-500 text-xs mt-6">
          By creating an account or signing up you agree to our{" "}
          <a href="/terms" className="text-blue-600 underline">
            Terms and Conditions
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
