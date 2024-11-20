import react from "react";
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
    <div className=" justify-center mb-20 items-center  flex flex-col ">
      {" "}
      <p className="p-8 w-2/3  text-center  md:my-16 text-xl text-gray-800">
        At DASGUZO, we believe that renting a car should be as easy as getting a
        ride. We’re not just another car rental service—we’re a community-driven
        platform that connects car owners with those in need of a vehicle.
        Whether you’re planning a weekend getaway or need a reliable ride for a
        business trip, DASGUZO offers a seamless, affordable, and trustworthy
        solution for all your car rental needs.
      </p>
      <div className=" grid grid-cols-1 sm:grid-cols-2  pb-10 gap-4 md:px-40 sm:gap-10">
        {data.map((m) => (
          <div className="md:w-[500px] ">
            <div
              style={{
                backgroundImage: `url(${BackgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className=" bg-[#00173C] rounded-2xl "
            >
              {/* Content */}
              <div className="  text-white p-8">
                <img className="w-24 h-24 mb-8" src={m.Icon} alt="" />
                <h1 className="text-xl md:text-4xl mb-2 ">{m.title}</h1>
                <p className="text-lg text-gray-400">{m.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>{" "}
    </div>
  );
};

export default Renter;
