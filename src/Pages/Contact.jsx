import React, { useState } from "react"; // Import useState
import BackgroundImage from "../images/testimonials/OBJECTS2.png";
import image from "../images/image.png";

import BackgroundImage1 from "../images/howitworks/bgHow.png";
import Footer from "../components/Footer";

// You can add react-icons for a better UI
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const ContactForm = () => {
  // --- START: STATE MANAGEMENT ---
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null); // Can be 'success' or 'error'

  // Your unique access key from Web3Forms
  const accessKey = "YOUR_ACCESS_KEY_HERE"; // <--- IMPORTANT: REPLACE THIS

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsSubmitting(true);
    setSubmissionResult(null);

    const payload = {
      ...formData,
      access_key: accessKey,
      subject: `New Contact Form Submission from ${formData.firstName}`, // Optional: Customize email subject
    };

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setSubmissionResult("success");
        // Clear the form on successful submission
        setFormData({ firstName: "", lastName: "", email: "", message: "" });
      } else {
        console.error("Submission failed:", result);
        setSubmissionResult("error");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setSubmissionResult("error");
    } finally {
      setIsSubmitting(false);
    }
  };
  // --- END: STATE MANAGEMENT ---

  return (
    <div
      style={{
        backgroundImage: `url(${BackgroundImage1})`,
      }}
      className=" flex flex-col overflow-hidden bg-auto "
    >
      <h2 className="text-center text-xl my-28 mt-52 md:text-9xl font-medium text-[#00173C] mb-4">
        Contact Us
      </h2>
      <div className="flex justify-center mt-10 mb-80 items-center w-full">
        <div className="flex flex-wrap gap-20 bg-white rounded-xl shadow-lg shadow-gray-300 w-full mx-4 md:mx-20">
          {/* Left Panel */}
          <div
            className="w-full relative bg-cover bg-center md:w-1/3 p-8 rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
            style={{ backgroundImage: `url(${BackgroundImage})` }}
          >
            {/* Overlay for background darkening */}
            <div className="absolute inset-0 bg-[#FABD05] opacity-95 rounded-t-xl md:rounded-l-xl md:rounded-tr-none"></div>

            <div className="relative z-10">
              <h2 className="text-5xl font-bold text-[#00113D] mb-4">
                Contact Us
              </h2>
              <p className="text-lg text-[#00113D] mb-8">
                Say something to start a chat!
              </p>
              <div className="w-full flex justify-center items-center">
                <div
                  style={{ backgroundImage: `url(${image})` }}
                  className="relative w-[300px] h-[300px] bg-contain bg-center bg-no-repeat"
                ></div>
              </div>
              <div className="space-y-4 text-lg text-[#00113D]">
                <p className="flex items-center gap-3">
                  <FaPhoneAlt /> +251946888444
                </p>
                <p className="flex items-center gap-3">
                  <FaEnvelope /> contact@dastechnologies.org
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full md:w-1/2 p-8">
            {/* Use the new handleSubmit function */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative inline-block my-3 text-lg w-full">
                <label
                  htmlFor="firstName"
                  className="absolute -top-2 left-3 text-base bg-white px-1 text-gray-500"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName" // Changed from first-name to match state
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required // Good practice to add validation
                  className="mt-1 block w-full px-4 py-4 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your first name"
                />
              </div>

              <div className="relative inline-block my-3 text-lg w-full">
                <label
                  htmlFor="lastName"
                  className="absolute -top-2 left-3 text-base bg-white px-1 text-gray-500"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName" // Changed from last-name to match state
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-4 py-4 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your last name"
                />
              </div>

              <div className="relative inline-block my-3 text-lg w-full">
                <label
                  htmlFor="email"
                  className="absolute -top-2 left-3 text-base bg-white px-1 text-gray-500"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-4 py-4 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email address"
                />
              </div>

              <div className="relative inline-block my-3 text-lg w-full">
                <label
                  htmlFor="message"
                  className="absolute -top-2 left-3 text-base bg-white px-1 text-gray-500"
                >
                  Message/comments
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-4 py-4 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter message"
                  rows="4"
                ></textarea>
              </div>

              {/* --- Submission Status Messages --- */}
              {submissionResult === "success" && (
                <div className="text-green-600 bg-green-100 p-3 rounded-md text-center">
                  Message sent successfully! We'll get back to you soon.
                </div>
              )}
              {submissionResult === "error" && (
                <div className="text-red-600 bg-red-100 p-3 rounded-md text-center">
                  Something went wrong. Please try again.
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting} // Disable button while sending
                className="w-full py-3 bg-[#00113D] text-white rounded-full text-lg hover:bg-[#000a29] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactForm;
