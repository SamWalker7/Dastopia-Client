import React from "react"; // Corrected import statement
import BackgroundImage from "../../images/howitworks/renterBg.png";
import Search from "../../images/howitworks/Search.png";
import Drive from "../../images/howitworks/Drive.png";
import Book from "../../images/howitworks/Book.png";
import Return from "../../images/howitworks/Return.png";

const Renter = () => {
  const data = [
    {
      Icon: Search,
      title: "1. Search",
      description:
        "Browse our diverse selection of vehicles to find the perfect match for your needs.",
    },
    {
      Icon: Book,
      title: "2. Book",
      description: "Reserve your vehicle with our easy-to-use booking system.",
    },
    {
      Icon: Drive,
      title: "3. Drive",
      description: "Pick up your car and enjoy your journey with confidence.",
    },
    {
      Icon: Return,
      title: "4. Return",
      description:
        "Simply return the car to the owner after your rental period ends.",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center mb-12 md:mb-20">
      {/* Introductory Text */}
      <p className="w-full px-6 text-center text-gray-700 text-sm sm:text-base md:text-lg lg:text-xl md:w-2/3 lg:w-1/2 my-8 md:my-12 lg:my-16">
        At DASGUZO, we believe that renting a car should be as easy as getting a
        ride. We’re not just another car rental service—we’re a community-driven
        platform that connects car owners with those in need of a vehicle.
        Whether you’re planning a weekend getaway or need a reliable ride for a
        business trip, DASGUZO offers a seamless, affordable, and trustworthy
        solution for all your car rental needs.
      </p>

      {/* Grid for How It Works Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 lg:gap-10 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 pb-10 w-full">
        {data.map(
          (
            item,
            index // Added index for key, though item.title is likely unique
          ) => (
            <div key={item.title || index} className="w-full">
              {" "}
              {/* Ensure each item has a unique key */}
              <div
                style={{
                  backgroundImage: `url(${BackgroundImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                className="bg-[#00173C] rounded-2xl shadow-lg h-full flex flex-col" // Added shadow and h-full for consistent height if descriptions vary
              >
                <div className="text-white p-6 md:p-8 flex-grow">
                  {" "}
                  {/* Added flex-grow */}
                  <img
                    className="w-20 h-20 sm:w-24 sm:h-24 mb-4 md:mb-6"
                    src={item.Icon}
                    alt={`${item.title} icon`}
                  />
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-2 sm:mb-3">
                    {item.title}
                  </h1>
                  <p className="text-sm sm:text-base text-gray-300 md:text-gray-400">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Renter;
