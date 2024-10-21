import BackgroundImage from "../images/hero/OBJECTS1.png";
import BackgroundImage1 from "../images/hero/OBJECTS.png";
import Person from "../images/hero/person.png";
import Afordable from "../images/plan/Funding.png";
import Selection from "../images/plan/Choice.png";
import Community from "../images/plan/Community.png";

function PlanTrip() {
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
        <div className="absolute inset-0 bg-[#00173C] opacity-90"></div>
        {/* Content */}
        <div className="relative z-10 text-center  text-white p-8">
          <h1 className="text-4xl  md:text-7xl text-[#FBBC05] font-normal mt-8 mb-8">
            Explore Cars
          </h1>
          <p className="text-lg md:text-2xl mb-12">
            Lorem ipsum dolor sit amet consectetur. Vitae condimentum leo
            convallis nisi tincidunt. Sapien dignissim mattis congue eget elit a
            imperdiet. Eu non turpis facilisis hendrerit velit massa tincidunt
            id. Sed at quis.
          </p>
          <button className=" bg-white text-2xl text-black rounded-full px-32 py-4 mt-4  ">
            See all available cars
          </button>
        </div>
      </div>

      <div
        className="relative h-fit  flex items-center justify-center"
        style={{
          backgroundImage: `url(${BackgroundImage1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-fit pl-32 items-center justify-center flex">
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
        {/* Content */}
        <div className="relative md:pb-20 md:pr-72 z-10 text-start  text-[#00173C] p-8">
          <h1 className="text-4xl  md:text-7xl  font-semibold mt-8 mb-8">
            List Your Car
          </h1>
          <p className="text-lg md:text-2xl mb-12">
            Lorem ipsum dolor sit amet consectetur. Vitae condimentum leo
            convallis nisi tincidunt. Sapien dignissim mattis congue eget elit a
            imperdiet. Eu non turpis facilisis hendrerit velit massa tincidunt
            id. Sed at quis.
          </p>
          <button className=" bg-[#00173C] text-xl font-normal text-white rounded-full px-12 py-4 mt-4  ">
            List My Car
          </button>
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
        <div className="absolute inset-0 bg-[#00173C] opacity-90"></div>{" "}
        <h1 className="text-4xl relative md:text-7xl text-[#FBBC05] font-normal mt-16 mb-8">
          Why Rent With Us?
        </h1>
        {/* Content */}
        <div className="relative z-10 text-center flex justify-between w-full px-52  text-white p-8">
          <div className="items-center flex flex-col justify-center">
            <div>
              <img className="w-24 h-24" src={Afordable} alt="" />
            </div>
            <div className="text-gray-300 text-xl font-normal my-6">
              Affordable Rates
            </div>
          </div>
          <div className="items-center flex flex-col justify-center">
            <div>
              <img className="w-24 h-24" src={Selection} alt="" />
            </div>
            <div className="text-gray-300 text-xl font-normal my-6">
              Web Selection
            </div>
          </div>
          <div className="items-center flex flex-col justify-center">
            <div>
              <img className="w-24 h-24" src={Community} alt="" />
            </div>
            <div className="text-gray-300 text-xl font-normal my-6">
              Trusted Community
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PlanTrip;
