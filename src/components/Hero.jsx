import { Link } from "react-router-dom";
import BackgroundImage from "../images/hero/Hero.png";
import HeroCar from "../images/hero/main-car.png";
import { useEffect, useState } from "react";
import BookCar from "./BookCar";

function Hero({ isHome = false }) {
  return (
    <div
      className="relative min-h-screen md:pb-20 px-20 flex items-end justify-start"
      style={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay for background darkening */}
      <div className="absolute inset-0 bg-black opacity-20"></div>
      {/* Content */}
      <div className="relative z-10 text-start  text-white p-8">
        <h1 className="text-4xl md:mb-32 md:text-[150px] text-[#FBBC05] font-semibold mb-4">
          DasGuzo
        </h1>
        <p className="text-lg md:text-2xl mb-12">
          Choose from a wide range of vehicles at affordable rates. Rent from
          trusted local car owners
        </p>
        <BookCar />
      </div>
    </div>
  );
}

export default Hero;
