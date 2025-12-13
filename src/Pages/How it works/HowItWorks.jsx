import React, { useState } from "react";
import BackgroundImage1 from "../../images/howitworks/bgHow.png";
import Renter from "./Renter";
import Owner from "./Owner";
import Corporate from "./Corporate";
import Footer from "../../components/Footer";
import ReferralSteps from "./ReferralSteps";

const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState("Renter");

  return (
    <div
      style={{
        backgroundImage: `url(${BackgroundImage1})`,
      }}
      className=" flex flex-col overflow-hidden bg-auto  "
    >
      <div className="md:mt-40 mt-32">
        <h2 className="text-center text-4xl md:my-16 md:text-8xl  font-medium text-[#00173C] mb-4">
          How It Works
        </h2>
        <div className="relative    ">
          <div className="flex justify-center mb-4 sm:mb-6 flex-wrap">
            <button
              onClick={() => setActiveTab("Renter")}
              className={`md:px-12 px-4 py-2 text-2xl ${activeTab === "Renter"
                ? "text-black border-b-2 border-[#00173C]"
                : "text-gray-500 border-b-2 border-gray-300"
                }`}
            >
              Renter
            </button>

            <button
              onClick={() => setActiveTab("Owner")}
              className={`md:px-12 px-4 py-2 text-2xl ${activeTab === "Owner"
                ? "text-black border-b-2 border-[#00173C]"
                : "text-gray-500 border-b-2 border-gray-300"
                }`}
            >
              Owner
            </button>

            <button
              onClick={() => setActiveTab("Corporate")}
              className={`md:px-12 px-4 py-2 text-2xl ${activeTab === "Corporate"
                ? "text-black border-b-2 border-[#00173C]"
                : "text-gray-500 border-b-2 border-gray-300"
                }`}
            >
              Corporate
            </button>

            <button
              onClick={() => setActiveTab("Referral")}
              className={`md:px-12 px-4 py-2 text-2xl ${activeTab === "Referral"
                ? "text-black border-b-2 border-[#00173C]"
                : "text-gray-500 border-b-2 border-gray-300"
                }`}
            >
              Referral
            </button>
          </div>


          <div className="   ">
            <div>
              {activeTab === "Renter" && <Renter />}
              {activeTab === "Owner" && <Owner />}
              {activeTab === "Corporate" && <Corporate />}
              {activeTab === "Referral" && <ReferralSteps />}
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HowItWorks;
