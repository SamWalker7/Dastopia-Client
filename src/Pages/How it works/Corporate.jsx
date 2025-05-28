import React from "react"; // Added React import
import corporate from "../../images/howitworks/corporate.png";
import { Link } from "react-router-dom";

const Corporate = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center w-full mt-12 md:mt-20 lg:mt-28">
      {/* Image Section */}
      <div className="w-full lg:w-5/12 flex justify-center lg:justify-start p-6 md:p-8 lg:pl-16 xl:pl-20">
        <div
          className="relative h-64 w-full max-w-sm sm:h-80 md:h-96 lg:h-[450px] lg:w-[400px] xl:w-[450px] bg-no-repeat"
          style={{
            backgroundImage: `url(${corporate})`,
            backgroundSize: "cover", // 'cover' is usually better for responsiveness
            backgroundPosition: "center",
          }}
          aria-label="Corporate team with a car" // Added aria-label for accessibility
        >
          {/* Content inside the image div, if any, would go here */}
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full lg:w-7/12 text-center lg:text-start text-[#00173C] p-6 md:p-10 lg:p-12 xl:p-16 lg:pr-16 xl:pr-20">
        <h1 className="text-2xl sm:text-3xl md:text-4xl  xl:text-6xl font-semibold mb-6 md:mb-8">
          Tailored Car Rental Solutions for Your Business
        </h1>
        <p className="text-sm md:text-base mb-8 md:mb-10 lg:mb-12">
          Whether you need vehicles for a business trip, corporate event, or
          long-term use, DASGUZO offers flexible car rental solutions for
          companies. To get started, simply contact our customer support team.
          We’re here to understand your specific needs and provide the best
          options for your business.
        </p>
        <Link
          to="/contact"
          className="bg-[#00173C] text-sm sm:text-base  font-normal text-white rounded-full px-8 sm:px-10 md:px-6 py-3 sm:py-3  hover:bg-opacity-90 transition-opacity"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
};

export default Corporate;
