import React from "react";
import money from "../../images/howitworks/Owner/Money.png";
import approve from "../../images/howitworks/Owner/approve.png";
import keys from "../../images/howitworks/Owner/keys.png";
import list from "../../images/howitworks/Owner/list.png";
import moneyIcon from "../../images/howitworks/Owner/moneyIcon.png";
import approveIcon from "../../images/howitworks/Owner/approveIcon.png";
import keysIcon from "../../images/howitworks/Owner/keyIcon.png";
import listIcon from "../../images/howitworks/Owner/listIcon.png";
import ratingIcon from "../../images/howitworks/Owner/ratingIcon.png";
import one from "../../images/howitworks/Owner/1.png";
import two from "../../images/howitworks/Owner/2.png";
import three from "../../images/howitworks/Owner/3.png";
import four from "../../images/howitworks/Owner/4.png";
const Owner = () => {
  return (
    <div className="justify-center w-screen  text-xl  items-center  flex flex-col ">
      <p className="p-8 w-2/3  text-center  md:my-16 text-xl text-gray-800">
        At DASGUZO, we believe that renting a car should be as easy as getting a
        ride. We’re not just another car rental service—we’re a community-driven
        platform that connects car owners with those in need of a vehicle.
        Whether you’re planning a weekend getaway or need a reliable ride for a
        business trip, DASGUZO offers a seamless, affordable, and trustworthy
        solution for all your car rental needs.
      </p>

      <div className="flex text-gray-800 px-16 w-full py-20 bg-[#F6BA07]">
        <div className="flex p-8 md:w-[1100px] justify-center  flex-col ">
          <img src={listIcon} className="w-28 h-12" alt="" />
          <h1 className="text-7xl text-[#00173C] font-semibold my-4">
            List Your Car
          </h1>
          <p className="text-lg">Turn Your Car into Extra Income</p>
        </div>
        <div className=" flex p-8 space-y-8 flex-col">
          <img src={list} className="md:w-[600px] " alt="" />
          <p className="w-4/6 px-4">
            Listing your car on DASGUZO is simple and straightforward. Start by
            creating an account and filling out your vehicle’s details,
            including make, model, year, and any special features. Upload some
            photos to showcase your car, set your availability, and choose your
            rental price. You’re in full control!
          </p>
        </div>
      </div>

      <div className="flex text-gray-200 px-16 w-full  bg-[#00173C]">
        <div className="flex p-8 md:w-[1100px] justify-center py-20  flex-col ">
          <img src={approveIcon} className="w-28 h-28" alt="" />
          <h1 className="text-7xl  text-white font-semibold my-4">
            Approve Bookings
          </h1>
          <p className="text-lg">Turn Your Car into Extra Income</p>
        </div>
        <div className=" flex pl-24 space-y-8 py-20 flex-col">
          <img src={approve} className="md:w-[500px]" alt="" />
          <p className="w-5/6 px-4">
            When someone is interested in renting your car, you’ll receive a
            booking request. Review the details, including the renter’s profile
            and the rental period. You can approve or decline the request based
            on your preferences. If approved, you’ll arrange a pick-up time and
            location that works for both you and the renter.
          </p>
        </div>
        <div className="-mt-1 w-52 h-52">
          <img src={one} alt="" />
        </div>
      </div>

      <div className="flex text-gray-800 px-16 w-full  bg-[#AEC6FF]">
        <div className="flex p-8 md:w-[1100px] justify-center py-20  flex-col ">
          <img src={keysIcon} className="w-28 h-28" alt="" />
          <h1 className="text-7xl  text-[#00173C] font-semibold my-4">
            Hand Over the Keys
          </h1>
          <p className="text-lg">“Meet, Greet, and Hand Over Your Car”</p>
        </div>
        <div className=" flex pl-4 space-y-8 py-20 flex-col">
          <img src={keys} className="md:w-[500px]" alt="" />
          <p className="w-5/6 px-4">
            Meet the renter at the agreed location, do a quick walk-around of
            the vehicle together, and confirm the rental details. Once you’re
            both satisfied, hand over the keys, and they’re on their way. Your
            car is now earning you money while it’s being used by someone who
            needs it.
          </p>
        </div>
        <div className="-mt-1 w-52 h-52">
          <img src={two} alt="" />
        </div>
      </div>

      <div className="flex text-gray-800 px-16 w-full  bg-[#D5E3FF]">
        <div className="flex p-8 md:w-[850px] justify-center py-20  flex-col ">
          <img src={moneyIcon} className="w-28 h-28" alt="" />
          <h1 className="text-7xl  text-[#00173C] font-semibold my-4">
            Earn Money
          </h1>
          <p className="text-lg">“Get Paid, Hassle-Free”</p>
        </div>
        <div className=" flex  space-y-12 py-20 flex-col">
          <div className="flex items-center">
            <img src={money} className="md:w-20" alt="" />
            <span className="px-4 pt-4 font-medium text-2xl">
              Recieve Advance <br />
              Payment into your account
            </span>
          </div>
          <p className="w-5/6 ">
            After the rental period ends, the renter will return the car to you.
            DASGUZO handles all payment transactions securely, and you’ll
            receive your earnings directly into your account. It’s that simple!
          </p>
        </div>
        <div className="-mt-1 w-52 h-52">
          <img src={three} alt="" />
        </div>
      </div>

      <div className="flex text-gray-800 px-16 w-full  bg-white">
        <div className="flex p-8 md:w-[900px] justify-center py-20  flex-col ">
          <img src={ratingIcon} className="w-28 h-28" alt="" />
          <h1 className="text-7xl  text-[#00173C] font-semibold my-4">
            Review and Repeat
          </h1>
          <p className="text-lg">“Build Your Reputation, Earn More”</p>
        </div>
        <div className=" flex pl-12 justify-center py-20 flex-col">
          <p className="w-5/6 px-4">
            After each rental, both you and the renter can leave reviews.
            Building a strong reputation with positive reviews can help attract
            more renters in the future. Keep your calendar updated and continue
            to earn whenever your car is available.
          </p>
        </div>
        <div className="-mt-1 w-52 h-52">
          <img src={four} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Owner;
