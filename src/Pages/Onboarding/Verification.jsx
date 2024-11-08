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

  const handleChange = (e) => {
    setPhoneNumber(e.target.value);
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
        <form>
          <div className="flex gap-4 mb-4">
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
                  name="phoneNumber"
                  value={phoneNumber}
                  onChange={handleChange}
                  className="flex w-full p-3 py-4 bg-white text-gray-500 rounded-md focus:outline focus:outline-1 focus:outline-blue-400"
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-red-500 mb-4">{errors.phoneNumber}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Link
            to="/OTP"
            className={`min-w-2xl text-white text-lg rounded-full px-32 py-3 transition ${
              !errors.phoneNumber
                ? "bg-[#00113D] hover:bg-blue-900"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Send Verification Code
          </Link>
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
