import React from "react";
import money from "../../images/howitworks/Owner/Money.png";
import approve from "../../images/howitworks/Owner/approve.png";
import keys from "../../images/howitworks/Owner/keys.png";
import list from "../../images/howitworks/Owner/list.png";
import moneyIcon from "../../images/howitworks/Owner/moneyIcon.png";
import approveIcon from "../../images/howitworks/Owner/approveIcon.png";
import keysIcon from "../../images/howitworks/Owner/keyIcon.png"; // Assuming keyIcon.png (singular)
import listIcon from "../../images/howitworks/Owner/listIcon.png";
import ratingIcon from "../../images/howitworks/Owner/ratingIcon.png";
import one from "../../images/howitworks/Owner/1.png";
import two from "../../images/howitworks/Owner/2.png";
import three from "../../images/howitworks/Owner/3.png";
import four from "../../images/howitworks/Owner/4.png";

const Owner = () => {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Introductory Paragraph */}
      <p className="px-6 md:px-8 lg:px-12 py-8 md:py-12 w-full md:w-3/4 lg:w-2/3 text-center text-base md:text-lg lg:text-xl text-gray-700">
        At DASGUZO, we believe that renting a car should be as easy as getting a
        ride. We’re not just another car rental service—we’re a community-driven
        platform that connects car owners with those in need of a vehicle.
        Whether you’re planning a weekend getaway or need a reliable ride for a
        business trip, DASGUZO offers a seamless, affordable, and trustworthy
        solution for all your car rental needs.
      </p>

      {/* Section 1: List Your Car */}
      <div className="flex flex-col lg:flex-row items-center w-full px-6 md:px-10 lg:px-16 py-12 md:py-16 lg:py-20 bg-[#F6BA07] text-gray-800">
        {/* Column 1: Text Content */}
        <div className="w-full lg:w-5/12 flex flex-col items-center lg:items-start text-center lg:text-left p-4 order-1">
          <img
            src={listIcon}
            className="w-16 h-auto md:w-20 lg:w-24 mb-4 md:mb-6"
            alt="List car icon"
          />
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#00173C] font-semibold mb-2 md:mb-3">
            List Your Car
          </h1>
          <p className="text-sm md:text-base lg:text-lg">
            Turn Your Car into Extra Income
          </p>
        </div>
        {/* Column 2: Image and Description */}
        <div className="w-full lg:w-7/12 flex flex-col items-center p-4 mt-8 lg:mt-0 order-2 lg:pl-8">
          <img
            src={list}
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mb-6 md:mb-8"
            alt="Car illustration for listing"
          />
          <p className="text-sm md:text-base w-full md:w-5/6 lg:w-full text-center lg:text-left">
            Listing your car on DASGUZO is simple and straightforward. Start by
            creating an account and filling out your vehicle’s details,
            including make, model, year, and any special features. Upload some
            photos to showcase your car, set your availability, and choose your
            rental price. You’re in full control!
          </p>
        </div>
      </div>

      {/* Section 2: Approve Bookings */}
      <div className="flex flex-col lg:flex-row items-center w-full px-6 md:px-10 lg:px-16 py-12 md:py-16 lg:py-20 bg-[#00173C] text-gray-200">
        <div className="w-full lg:w-5/12 flex flex-col items-center lg:items-start text-center lg:text-left p-4 order-1">
          <img
            src={approveIcon}
            className="w-16 h-auto md:w-20 lg:w-24 mb-4 md:mb-6"
            alt="Approve booking icon"
          />
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-semibold mb-2 md:mb-3">
            Approve Bookings
          </h1>
          <p className="text-sm md:text-base lg:text-lg">
            You’re in Control of Who Rents Your Car
          </p>
        </div>
        <div className="w-full lg:w-5/12 flex flex-col items-center p-4 mt-8 lg:mt-0 order-2 lg:pl-8">
          <img
            src={approve}
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-md mb-6 md:mb-8"
            alt="Booking approval illustration"
          />
          <p className="text-sm md:text-base w-full md:w-5/6 lg:w-full text-center lg:text-left">
            When someone is interested in renting your car, you’ll receive a
            booking request. Review the details, including the renter’s profile
            and the rental period. You can approve or decline the request based
            on your preferences. If approved, you’ll arrange a pick-up time and
            location that works for both you and the renter.
          </p>
        </div>
        <div className="w-full lg:w-2/12 hidden lg:flex justify-center items-center p-4 order-3 mt-8 lg:-mt-96">
          <img
            src={one}
            className="w-24 h-auto md:w-32 lg:w-40"
            alt="Step 1 decorative image"
          />
        </div>
      </div>

      {/* Section 3: Hand Over the Keys */}
      <div className="flex flex-col lg:flex-row items-center w-full px-6 md:px-10 lg:px-16 py-12 md:py-16 lg:py-20 bg-[#AEC6FF] text-gray-800">
        <div className="w-full lg:w-5/12 flex flex-col items-center lg:items-start text-center lg:text-left p-4 order-1">
          <img
            src={keysIcon}
            className="w-16 h-auto md:w-20 lg:w-24 mb-4 md:mb-6"
            alt="Hand over keys icon"
          />
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#00173C] font-semibold mb-2 md:mb-3">
            Hand Over the Keys
          </h1>
          <p className="text-sm md:text-base lg:text-lg">
            “Meet, Greet, and Hand Over Your Car”
          </p>
        </div>
        <div className="w-full lg:w-5/12 flex flex-col items-center p-4 mt-8 lg:mt-0 order-2 lg:pl-8">
          <img
            src={keys}
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-md mb-6 md:mb-8"
            alt="Handing over keys illustration"
          />
          <p className="text-sm md:text-base w-full md:w-5/6 lg:w-full text-center lg:text-left">
            Meet the renter at the agreed location, do a quick walk-around of
            the vehicle together, and confirm the rental details. Once you’re
            both satisfied, hand over the keys, and they’re on their way. Your
            car is now earning you money while it’s being used by someone who
            needs it.
          </p>
        </div>
        <div className="w-full lg:w-2/12 hidden lg:flex justify-center items-center p-4 order-3 mt-8 lg:-mt-80">
          <img
            src={two}
            className="w-24 h-auto md:w-32 lg:w-40"
            alt="Step 2 decorative image"
          />
        </div>
      </div>

      {/* Section 4: Earn Money */}
      <div className="flex flex-col lg:flex-row items-center w-full px-6 md:px-10 lg:px-16 py-12 md:py-16 lg:py-20 bg-[#D5E3FF] text-gray-800">
        <div className="w-full lg:w-5/12 flex flex-col items-center lg:items-start text-center lg:text-left p-4 order-1">
          <img
            src={moneyIcon}
            className="w-16 h-auto md:w-20 lg:w-24 mb-4 md:mb-6"
            alt="Earn money icon"
          />
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#00173C] font-semibold mb-2 md:mb-3">
            Earn Money
          </h1>
          <p className="text-sm md:text-base lg:text-lg">
            “Get Paid, Hassle-Free”
          </p>
        </div>
        <div className="w-full lg:w-5/12 flex flex-col justify-center items-center lg:items-start p-4 space-y-6 md:space-y-8 mt-8 lg:mt-0 order-2 lg:pl-8">
          <div className="flex flex-col sm:flex-row items-center text-center sm:text-left">
            <img
              src={money}
              className="w-12 h-auto md:w-16 lg:w-20 mb-4 sm:mb-0 sm:mr-4"
              alt="Money illustration"
            />
            <span className="font-medium text-base md:text-lg lg:text-xl">
              Receive Advance <br />
              Payment into your account
            </span>
          </div>
          <p className="text-sm md:text-base w-full md:w-5/6 lg:w-full text-center lg:text-left">
            After the rental period ends, the renter will return the car to you.
            DASGUZO handles all payment transactions securely, and you’ll
            receive your earnings directly into your account. It’s that simple!
          </p>
        </div>
        <div className="w-full lg:w-2/12 hidden lg:flex justify-center items-center p-4 order-3 mt-8 lg:-mt-80">
          <img
            src={three}
            className="w-24 h-auto md:w-32 lg:w-40"
            alt="Step 3 decorative image"
          />
        </div>
      </div>

      {/* Section 5: Review and Repeat */}
      <div className="flex flex-col lg:flex-row items-center w-full px-6 md:px-10 lg:px-16 py-12 md:py-16 lg:py-20 bg-white text-gray-800">
        <div className="w-full lg:w-5/12 flex flex-col items-center lg:items-start text-center lg:text-left p-4 order-1">
          <img
            src={ratingIcon}
            className="w-16 h-auto md:w-20 lg:w-24 mb-4 md:mb-6"
            alt="Review icon"
          />
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#00173C] font-semibold mb-2 md:mb-3">
            Review and Repeat
          </h1>
          <p className="text-sm md:text-base lg:text-lg">
            “Build Your Reputation, Earn More”
          </p>
        </div>
        <div className="w-full lg:w-5/12 flex flex-col justify-center items-center lg:items-start p-4 mt-8 lg:mt-0 order-2 lg:pl-8">
          <p className="text-sm md:text-base w-full md:w-5/6 lg:w-full text-center lg:text-left">
            After each rental, both you and the renter can leave reviews.
            Building a strong reputation with positive reviews can help attract
            more renters in the future. Keep your calendar updated and continue
            to earn whenever your car is available.
          </p>
        </div>
        <div className="w-full lg:w-2/12 hidden lg:flex justify-center items-center p-4 order-3 mt-8 lg:-mt-80">
          <img
            src={four}
            className="w-24 h-auto md:w-32 lg:w-40"
            alt="Step 4 decorative image"
          />
        </div>
      </div>
    </div>
  );
};

export default Owner;
