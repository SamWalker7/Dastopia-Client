import BackgroundImage from "../images/hero/OBJECTS1.png";
import BackgroundImage1 from "../images/hero/OBJECTS.png";
import Person from "../images/hero/person.png";
import Afordable from "../images/plan/Funding.png";
import Selection from "../images/plan/Choice.png";
import Community from "../images/plan/Community.png";
import ComingSoon from "../images/plan/ComingSoon.png";
import { Link } from "react-router-dom";
function PlanTrip() {
  const googlePlayBadgeUrl =
    "https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png";
  const googlePlayLink =
    "https://play.google.com/store/apps/details?id=org.dastechnologies.app";

  return (
    <>
      <div
        className="relative h-fit md:pb-20 md:px-96 flex items-center justify-center"
        style={{
          backgroundImage: `url(${BackgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay for background darkening */}
        <div className="absolute inset-0 bg-[#00173C] opacity-95"></div>
        {/* Content */}
        <div className="relative z-10 md:text-center  text-white p-8">
          <h1 className="text-2xl  md:text-5xl text-[#FBBC05] font-normal mt-8 mb-8">
            Explore Cars
          </h1>
          <p className="text-sm md:text-lg mb-8">
            Find the perfect car for your next trip. Choose from a wide
            selection of vehicles—whether you need something economical,
            luxurious, or spacious for the family.
          </p>
          <Link
            to="/search"
            className=" bg-white text-md cursor-pointer text-black rounded-full px-12 py-2   "
          >
            See all available cars
          </Link>
        </div>
      </div>

      <div
        className="relative h-fit  flex md:flex-row-reverse flex-col items-center justify-center"
        style={{
          backgroundImage: `url(${BackgroundImage1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Content */}
        <div className="relative md:pb-20 md:pr-40 z-10 text-start  text-[#00173C] p-8">
          <h1 className="text-2xl  md:text-5xl  font-semibold mt-8 mb-8">
            List Your Car
          </h1>
          <p className="text-sm md:text-lg mb-8">
            Earn money by renting out your car. Join our trusted network and
            make the most out of your vehicle when you're not using it.
          </p>
          <Link
            to="/addcar"
            className=" bg-[#00173C] text-sm cursor-pointer font-normal text-white rounded-full px-12 py-2 mt-4  "
          >
            List Your Car
          </Link>
        </div>
        <div className="w-fit md:pl-12 items-center justify-center flex">
          {" "}
          <div
            className="relative h-[450px] w-[400px] flex items-center justify-center"
            style={{
              backgroundImage: `url(${Person})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {" "}
          </div>
        </div>
      </div>
      <div
        className="relative flex flex-col h-fit md:pb-20 md:px-72  items-center justify-center"
        style={{
          backgroundImage: `url(${BackgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay for background darkening */}
        <div className="absolute inset-0 bg-[#00173C] opacity-95"></div>{" "}
        <h1 className="text-2xl relative md:text-5xl text-[#FBBC05] font-semibold mt-16 mb-8">
          Why Rent With Us?
        </h1>
        {/* Content */}
        <div className="relative z-10 text-center flex md:flex-row flex-col items-center  justify-between w-full md:px-2 space-y-6  text-white p-8">
          <div className="items-center flex flex-col justify-center md:mt-4">
            <div>
              <img className="w-20 h-20" src={Afordable} alt="" />
            </div>
            <div className="text-gray-300 text-xl font-medium my-6">
              Affordable Rates
            </div>
          </div>
          <div className="items-center flex flex-col justify-center">
            <div>
              <img className="w-20 h-20" src={Selection} alt="" />
            </div>
            <div className="text-gray-300 text-xl font-medium my-6">
              Web Selection
            </div>
          </div>
          <div className="items-center flex flex-col justify-center">
            <div>
              <img className="w-20 h-20" src={Community} alt="" />
            </div>
            <div className="text-gray-300 text-xl font-medium my-6">
              Trusted Community
            </div>
          </div>
        </div>
      </div>
      {/* Coming Soon */}
      <div className="relative bg-white h-fit md:p-10 p-4 md:px-20 md:flex items-center justify-center">
        <div className="relative md:pb-20 md:pr-72 z-10 text-start  text-[#00173C] p-8">
          <h1 className="text-2xl  md:text-6xl  font-semibold md:pr-10  my-4 md:mb-8">
            Our Mobile App Is Here
          </h1>
          <p className="text-sm md:text-lg md:mb-12">
            Book, manage, and explore cars on the go. Download our app for a
            seamless rental experience—anytime, anywhere.
          </p>
          <a
            href={googlePlayLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <img
              src={googlePlayBadgeUrl}
              alt="Get it on Google Play"
              className="h-20 hover:opacity-90 transition-opacity"
            />
          </a>
        </div>
        <div className="md:w-fit  items-center justify-center flex">
          {" "}
          <div
            className="relative h-[550px] w-[450px] mb-6 flex items-center justify-center"
            style={{
              backgroundImage: `url(${ComingSoon})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {" "}
          </div>
        </div>
      </div>
    </>
  );
}

export default PlanTrip;
