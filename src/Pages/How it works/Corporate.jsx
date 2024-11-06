import corporate from "../../images/howitworks/corporate.png";
const Corporate = () => {
  return (
    <div className="flex h-fit mt-28 items-center">
      <div className="w-fit pl-32 items-center  justify-center flex">
        {" "}
        <div
          className="relative h-[450px] w-[400px] flex items-center justify-center"
          style={{
            backgroundImage: `url(${corporate})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {" "}
        </div>
      </div>
      {/* Content */}
      <div className="  md:pb-20 md:pr-72  text-start  text-[#00173C] p-20">
        <h1 className="text-4xl  md:text-7xl  font-semibold mt-8 mb-8">
          Tailored Car Rental Solutions for Your Business
        </h1>
        <p className="text-lg md:text-2xl mb-12">
          Whether you need vehicles for a business trip, corporate event, or
          long-term use, DASGUZO offers flexible car rental solutions for
          companies. To get started, simply contact our customer support team.
          We’re here to understand your specific needs and provide the best
          options for your business.
        </p>
        <button className=" bg-[#00173C] text-xl font-normal text-white rounded-full px-12 py-4 mt-4  ">
          Contact Us
        </button>
      </div>
    </div>
  );
};

export default Corporate;
