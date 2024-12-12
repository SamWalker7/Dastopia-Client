import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignupForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (acceptedTerms) {
      navigate("/verification",{state:{firstName,lastName}});
    }
  };

  const isFormValid = firstName && lastName && acceptedTerms;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Signup Form Container */}
      <div className="w-full max-w-xl mx-auto p-10 rounded-lg shadow-lg bg-[#FAF9FE]">
        <h1 className="text-5xl font-bold my-8">Create An Account</h1>

        {/* Progress Bar */}
        <div className="flex items-center justify-center">
          <div className="w-1/2 border-b-4 border-blue-200"></div>
          <div className="w-1/2 border-b-4 border-gray-400"></div>
        </div>
        <div className="flex justify-between w-full">
          <div className="flex flex-col w-1/2 items-start">
            <span className="text-sm font-semibold text-white bg-sky-950 rounded-full w-6 h-6 flex items-center justify-center mt-2">
              1
            </span>
            <p className="text-sm text-gray-800 font-medium text-center mb-4">
              Basic Information
            </p>
          </div>
          <div className="flex flex-col w-1/2 items-end">
            <span className="text-sm font-semibold text-white bg-gray-400 rounded-full w-6 h-6 flex items-center justify-center mt-2">
              2
            </span>
            <p className="text-sm text-gray-400 font-medium text-center mb-4">
              Mobile OTP
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1 text-lg w-[350px]">
              <label className="absolute -top-2 left-3 text-base bg-white px-1 text-gray-500">
                First Name
              </label>
              <input
                type="text"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="border border-gray-400 w-full p-3 bg-white text-gray-500 rounded-md focus:outline focus:outline-1 focus:outline-blue-400"
              />
            </div>
            <div className="relative flex-1 text-lg w-[350px]">
              <label className="absolute -top-2 left-3 text-base bg-white px-1 text-gray-500">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="border border-gray-400 w-full p-3 bg-white text-gray-500 rounded-md focus:outline focus:outline-1 focus:outline-blue-400"
              />
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={() => setAcceptedTerms(!acceptedTerms)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
              required
            />
            <label className="ml-2 text-gray-700">
              I accept the terms and conditions
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full text-white text-lg rounded-full py-3 transition ${
              isFormValid
                ? "bg-[#00113D] hover:bg-blue-900"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Create An Account
          </button>

          {/* Login Link */}
          <p className="text-center mt-4 text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 underline">
              Login
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

export default SignupForm;
