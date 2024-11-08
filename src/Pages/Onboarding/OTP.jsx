import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  XCircleIcon,
} from "lucide-react/dist/cjs/lucide-react";

const OTP = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isOtpCorrect, setIsOtpCorrect] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputsRef = useRef([]);

  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, ""); // Allow only numeric values
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < otp.length - 1 && value) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[index] !== "") {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputsRef.current[index - 1].focus();
      }
    }
  };

  const handleFocus = (index) => {
    inputsRef.current[index].select();
  };

  const handleSubmit = () => {
    if (otp.includes("")) {
      setIsOtpCorrect(false);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      if (otp.join("") === "123456") {
        setIsOtpCorrect(true);
      } else {
        setIsOtpCorrect(false);
        setOtp(new Array(6).fill("")); // Clear the input fields
        inputsRef.current[0].focus(); // Focus on the first input
      }
      setIsLoading(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-full max-w-xl mt-40 mx-auto p-10 rounded-lg shadow-lg bg-[#FAF9FE]">
        <h1 className="text-5xl font-bold my-8">Account Verification</h1>

        {/* Progress Bar */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-1/2 border-b-4 border-blue-200"></div>
          <div className="w-1/2 border-b-4 border-blue-200"></div>
        </div>

        <div className="flex justify-between w-full mb-4">
          <div className="flex flex-col items-start w-1/2">
            <span className="text-sm flex font-semibold text-white bg-gray-500 rounded-full justify-center items-center w-6 h-6">
              1
            </span>
            <p className="text-sm text-gray-400 font-medium">
              Basic Information
            </p>
          </div>
          <div className="flex flex-col items-end w-1/2">
            <span className="text-sm flex font-semibold text-white bg-sky-950 rounded-full justify-center items-center w-6 h-6">
              2
            </span>
            <p className="text-sm text-gray-800 font-medium">Mobile OTP</p>
          </div>
        </div>

        {/* OTP Input Form */}
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex justify-center gap-4 mb-8">
            {otp.map((_, index) => (
              <motion.input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                maxLength="1"
                value={otp[index]}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={() => handleFocus(index)}
                disabled={isOtpCorrect}
                className="w-16 h-16 border-2 border-gray-300 rounded-lg text-center text-lg font-semibold focus:outline-none focus:ring-1 focus:ring-[#FB913C] transition duration-150"
                initial={{ scale: 1 }}
                whileFocus={{ scale: 1.1 }}
                whileHover={{ scale: 1.05 }}
              />
            ))}
          </div>

          {/* Success & Error Messages */}
          {isOtpCorrect === true && (
            <motion.div
              className="flex items-center p-2 mb-4 bg-green-100 border border-green-500 rounded-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-green-700 text-sm">
                OTP Verified Successfully!
              </span>
            </motion.div>
          )}

          {isOtpCorrect === false && (
            <motion.div
              className="flex items-center p-2 mb-4 bg-red-100 border border-red-500 rounded-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700 text-sm">
                Invalid OTP. Please try again.
              </span>
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isOtpCorrect || otp.includes("") || isLoading}
            className={`w-full text-white text-lg rounded-full py-3 transition ${
              isOtpCorrect
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#00113D] hover:bg-blue-900"
            }`}
          >
            {isLoading ? (
              <motion.div
                className="flex justify-center items-center"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{
                  loop: Infinity,
                  ease: "linear",
                  duration: 1,
                }}
              >
                <svg
                  className="w-5 h-5 text-white animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
              </motion.div>
            ) : (
              "Submit"
            )}
          </button>
        </form>

        {/* Terms and Conditions */}
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

export default OTP;
