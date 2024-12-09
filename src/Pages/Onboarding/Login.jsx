import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import flag from "../../images/hero/image.png";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const validatePhoneNumber = () => {
      let validationErrors = { ...errors };
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneNumber) {
        validationErrors.phoneNumber = "Phone number is required";
      } else if (!phoneRegex.test(phoneNumber)) {
        validationErrors.phoneNumber = "Invalid phone number";
      } else {
        delete validationErrors.phoneNumber;
      }
      setErrors(validationErrors);
    };

    validatePhoneNumber();
  }, [phoneNumber, errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!errors.phoneNumber) {
      alert("Account created!");
      // Account creation logic here
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      setPhoneNumber(value);
    }
  };

  const [password, setpassword] = useState("");
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="w-full max-w-xl mx-auto p-10 rounded-lg shadow-lg bg-[#FAF9FE] relative">
        <h1 className="text-5xl font-bold my-8">Login</h1>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 mb-4">
            <div className="relative inline-block my-3 text-lg w-full">
              {/* Label inside box */}
              <label
                className="absolute -top-2 left-3 text-base bg-white px-1 text-gray-500"
                htmlFor="phoneNumber"
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
                  id="phoneNumber"
                  name="phoneNumber"
                  value={phoneNumber}
                  onChange={handleChange}
                  className="flex justify-between w-full p-3 py-4 bg-white text-gray-500 rounded-md focus:outline focus:outline-1 focus:outline-blue-400"
                  placeholder="Enter your phone number"
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-red-500 mb-4">{errors.phoneNumber}</p>
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
                onChange={handleChange}
                placeholder="Enter Your Password"
                className="flex border border-gray-400 justify-between w-full p-3 py-4 bg-white text-gray-500 rounded-md focus:outline focus:outline-1 focus:outline-blue-400"
              />{" "}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={errors.phoneNumber}
            className={`w-full text-white text-lg rounded-full py-3 transition ${
              !errors.phoneNumber
                ? "bg-[#00113D] hover:bg-blue-900"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Login
          </button>

          {/* Signup Link */}
          <p className="text-center mt-4 text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 underline">
              Create Account
            </Link>
          </p>

          {/* Google Signup */}
          <div className="mt-6 flex items-center justify-center border-t border-gray-300 pt-4">
            <button
              type="button"
              className="flex items-center justify-center w-full border rounded-full py-3 hover:bg-gray-100 transition"
            >
              <img
                src="https://icon2.cleanpng.com/20240216/gkb/transparent-google-logo-iconic-google-logo-with-blue-green-and-1710875585209.webp"
                alt="Google Logo"
                className="w-6 h-6 mr-2"
              />
              Continue with Google
            </button>
          </div>
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
