import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import flag from "../../images/hero/image.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/auth/authThunks";
const Login = () => {
  const [phone_number, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(login(phone_number, password)).then(() => {
      navigate("/");
      setTimeout(() => {
        window.location.reload();
      }, 100); // Small delay ensures navigation happens before reload
    });
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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const response = await fetch(
  //     `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/auth/signin`,
  //     {
  //       headers: { "Content-Type": "application/json" },
  //       method: "POST",
  //       body: JSON.stringify({
  //         phone_number,
  //         password,
  //       }),
  //     }
  //   );
  //   const json = await response.json();
  //   if (response.ok) {
  //     localStorage.setItem("customer", JSON.stringify(json));
  //     console.log("yes", json);
  //     alert("You have successfully logged in");
  //     navigate("/");
  //   }
  //   if (!response.ok) {
  //     console.log("no ", json.body.message);
  //   }
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone_number") {
      setPhoneNumber(value);
    }
  };

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
            <div className="relative inline-block my-3 text-lg w-full">
              {/* Label inside box */}
              <label className="absolute -top-2 left-3 text-base bg-white px-1 text-gray-500">
                Password
              </label>
              <input
                type="text"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Your Password"
                className="flex border border-gray-400 justify-between w-full p-3 py-4 bg-white text-gray-500 rounded-md focus:outline focus:outline-1 focus:outline-blue-400"
              />{" "}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={Object.keys(errors).length > 0 || loading}
            className={`w-full text-white text-lg rounded-full py-3 transition ${
              !errors.phone_number
                ? "bg-[#00113D] hover:bg-blue-900"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {" "}
            {loading ? "Logging in..." : "Login"}
          </button>
          {error && <p>{error}</p>}

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
