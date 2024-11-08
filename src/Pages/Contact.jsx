import React from "react";
import BackgroundImage from "../images/testimonials/OBJECTS2.png";
import image from "../images/image.png";

import BackgroundImage1 from "../images/howitworks/bgHow.png";
import Footer from "../components/Footer";

const ContactForm = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${BackgroundImage1})`,
      }}
      className=" flex flex-col overflow-hidden bg-auto  "
    >
      <h2 className="text-center text-xl md:my-28 md:mt-52 md:text-9xl  font-medium text-[#00173C] mb-4">
        Contact Us
      </h2>
      <div className="flex justify-center items-center w-full h-screen bg-white">
        <div className="flex flex-wrap gap-20 bg-white rounded-xl shadow-lg shadow-gray-300 w-full mx-20">
          {/* Left Panel */}
          <div
            className="w-full relative bg-cover bg-center md:w-1/3 p-8 rounded-l-xl"
            style={{ backgroundImage: `url(${BackgroundImage})` }}
          >
            {/* Overlay for background darkening */}
            <div className="absolute inset-0 bg-[#FABD05]  opacity-95"></div>

            <h2 className="relative text-5xl font-bold text-[#00113D] mb-4">
              Contact Information
            </h2>
            <p className="relative text-lg text-[#00113D] mb-8">
              Say something to start a live chat!
            </p>
            <div className="w-full flex justify-center items-center">
              {/* Placeholder for car image */}
              <div
                style={{ backgroundImage: `url(${image})` }}
                className="relative w-[300px] h-[300px]  bg-contain bg-center bg-no-repeat"
              >
                {/* Add your car image */}
              </div>
            </div>
            {/* Contact Details */}
            <div className=" relative space-y-4 text-lg text-[#00113D]">
              <p className="flex items-center gap-2">
                <i className="fas fa-phone-alt"></i> +1012 3456 789
              </p>
              <p className="flex items-center gap-2">
                <i className="fas fa-envelope"></i> demo@gmail.com
              </p>
              <p className="flex items-center gap-2">
                <i className="fas fa-map-marker-alt"></i> 132 Dartmouth Street
                Boston, Massachusetts 02156 United States
              </p>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full md:w-1/2 p-8">
            <form className="space-y-6">
              <div className="relative inline-block my-3 text-lg  w-full">
                <label
                  htmlFor="first-name"
                  className="absolute -top-2 left-3 text-base bg-white px-1 text-gray-500"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="first-name"
                  className="mt-1 block w-full px-4 py-4 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 "
                  placeholder="Enter your first name"
                />
              </div>

              <div className="relative inline-block my-3 text-lg  w-full">
                <label
                  htmlFor="last-name"
                  className="absolute -top-2 left-3 text-base bg-white px-1 text-gray-500"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="last-name"
                  className="mt-1 block w-full px-4 py-4 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 "
                  placeholder="Enter your last name"
                />
              </div>

              <div className="relative inline-block my-3 text-lg  w-full">
                <label
                  htmlFor="email"
                  className="absolute -top-2 left-3 text-base bg-white px-1 text-gray-500"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full px-4 py-4 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 "
                  placeholder="Enter your email address"
                />
              </div>

              <div className="relative inline-block my-3 text-lg  w-full">
                <label
                  htmlFor="message"
                  className="absolute -top-2 left-3 text-base bg-white px-1 text-gray-500"
                >
                  Message/comments
                </label>
                <textarea
                  id="message"
                  className="mt-1 block w-full px-4  py-4 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 "
                  placeholder="Enter total distance in kilometers"
                  rows="4"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#00113D] text-white rounded-full text-lg hover:bg-[#000a29]"
              >
                Send A Message
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
