import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundImage1 from "../../images/howitworks/bgHow.png";
import Renter from "./Renter";
import Owner from "./Owner";
import Corporate from "./Corporate";
import Footer from "../../components/Footer";

const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState("Renter");
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundImage: `url(${BackgroundImage1})`,
      }}
      className=" flex flex-col overflow-hidden bg-auto  "
    >
      <div className="md:mt-40 mt-10">
        <h2 className="text-center text-xl md:my-28 md:text-9xl  font-medium text-[#00173C] mb-4">
          How It Works
        </h2>
        <div className="relative    ">
          <div className="flex justify-center  mb-4 sm:mb-6">
            <button
              onClick={() => setActiveTab("Renter")}
              className={`px-12 py-2 text-2xl ${
                activeTab === "Renter"
                  ? "text-black border-b-2 border-[#00173C]"
                  : "text-gray-500 border-b-2 border-gray-300"
              }`}
            >
              Renter
            </button>
            <button
              onClick={() => setActiveTab("Owner")}
              className={`px-12 py-2 text-2xl ${
                activeTab === "Owner"
                  ? "text-black border-b-2 border-[#00173C]"
                  : "text-gray-500 border-b-2 border-gray-300"
              }`}
            >
              Owner
            </button>
            <button
              onClick={() => setActiveTab("Corporate")}
              className={`px-12 py-2 text-2xl ${
                activeTab === "Corporate"
                  ? "text-black border-b-2 border-[#00173C]"
                  : "text-gray-500 border-b-2 border-gray-300"
              }`}
            >
              Corporate
            </button>
          </div>

          <div className="   ">
            <div>
              <div className="">
                {activeTab === "Renter" ? (
                  <div>
                    <Renter />
                  </div>
                ) : activeTab === "Owner" ? (
                  <div className="">
                    <Owner />
                  </div>
                ) : (
                  <div className="">
                    <Corporate />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HowItWorks;
