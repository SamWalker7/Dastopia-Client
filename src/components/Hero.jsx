import { Link } from "react-router-dom";
import BackgroundImage from "../images/hero/Hero.png";
import HeroCar from "../images/hero/main-car.png";
import { useEffect, useState } from "react";
import BookCar from "./BookCar";

function Hero({ isHome = false }) {
  return (
    <div
      className="relativ w-[100vw] md:w-full min-h-screen md:pb-20 pb-10 md:px-20 flex md:items-end items-center  justify-start"
      style={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay for background darkening */}
      <div className="absolute inset-0 bg-black opacity-20"></div>
      {/* Content */}
      <div className="relative z-10 text-start w-full md:items-start justify-center items-center flex flex-col text-white p-8">
        <h1 className="text-6xl md:w-full w-[80vw]  lg:text-[120px] text-[#FBBC05] font-semibold mb-4">
          DasGuzo
        </h1>
        <p className="text-md md:text-lg mb-12 md:w-full w-[80vw]">
          Choose from a wide range of vehicles at affordable rates. Rent from
          trusted local car owners
        </p>
        <BookCar />
      </div>
    </div>
  );
}

export default Hero;
