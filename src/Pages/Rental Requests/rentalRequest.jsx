import { FaRegCircle } from "react-icons/fa";
import image from "../../images/testimonials/avatar.png";
import {
  IoChatboxOutline,
  IoLocationOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { MdOutlineLocalPhone, MdOutlineMail } from "react-icons/md";
import { useState } from "react";

const RentalRequests = () => {
  const handleConfirmBooking = () => {
    setIsModalVisible(false);
    // Add your Booking account logic here
    console.log("Account Bookingd");
  };

  const handleCancelBooking = () => {
    setIsModalVisible(false);
  };
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [approved, setApproved] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="flex justify-center md:pt-40 p-8 bg-[#F8F8FF] min-h-screen">
      {/* Left Panel - Rental Requests */}
      <div className="w-1/4 bg-white p-6 rounded-xl shadow-md space-y-4">
        <h2 className="text-3xl font-bold text-[#00113D]">Rental Requests</h2>

        {/* Rental Request Card */}
        {[
          {
            expiresIn: "24 Hours",
            status: "Booking Pending",
            bgColor: "bg-[#E9F1FE]",
            textColor: "text-[#4478EB]",
            borderColor: "border-[#4478EB]",
          },
          {
            expiresIn: "1 Hour",
            status: "Booking Expired",
            bgColor: "bg-[#FDEAEA]",
            textColor: "text-[#EB4444]",
            borderColor: "border-[#EB4444]",
          },
          {
            expiresIn: "24 Hours",
            status: "Booking Pending",
            bgColor: "bg-[#E9F1FE]",
            textColor: "text-[#4478EB]",
            borderColor: "border-[#4478EB]",
          },
        ].map((request, index) => (
          <div
            key={index}
            className={`p-4  space-y-8 rounded-lg shadow-blue-100 shadow-md`}
          >
            <div
              className={`p-4 flex justify-between items-center mb-3 border border-dashed ${request.borderColor} rounded-lg  ${request.bgColor} `}
            >
              <span className="font-semibold text-xl text-[#000000]">
                Expires in
              </span>
              <span
                className={`px-4 py-2 text-sm font-medium rounded-full text-white bg-[#00173C] ${
                  request.expiresIn === "1 Hour"
                    ? "bg-[#410002]"
                    : "bg-[#00173C]"
                }`}
              >
                {request.expiresIn}
              </span>
            </div>

            <div className="grid grid-cols-3 text-lg text-gray-500 w-[400px] gap-4 mt-4">
              <div className="flex items-center w-full gap-3 mb-2">
                <img
                  src={image}
                  alt="Renter Profile"
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <span className="font-medium text-black">Rentee Name</span>
                  <p className="">Steven Owen</p>
                </div>
              </div>

              <div className="ml-16">
                <span className="font-medium text-black"> Rent Duration</span>
                <p className="">12 Days</p>
              </div>
            </div>
            <div className="text-lg mb-4 space-y-2 w-full text-gray-500">
              <div className="grid grid-cols-3 gap-4 w-full mt-4">
                <div className="pl-4">
                  <span className="font-medium text-black">Car Brand</span>
                  <p className="">Toyota</p>
                </div>
                <div className="ml-24 w-full">
                  <span className="font-medium text-black">Car Model</span>
                  <p className="">Camry</p>
                </div>
              </div>
            </div>
            <div className="text-lg mb-4 space-y-2 w-full text-gray-500">
              <div className="grid grid-cols-3 gap-4 w-full mt-4">
                <div className="pl-4">
                  <span className="font-medium text-black">Total Payment</span>
                  <p className="font-medium text-black">26,000 birr</p>
                </div>
                <div className="ml-24 w-full">
                  <div
                    className={`w-44 flex justify-center items-center py-2 px-4 text-base rounded-xl ${request.bgColor}  ${request.textColor}  `}
                  >
                    {request.status}
                  </div>
                </div>
              </div>
            </div>

            <button className="mt-3 w-full py-3 rounded-full bg-[#00113D] text-white ">
              View Details
            </button>
          </div>
        ))}
      </div>
      <div className=" w-2/3  px-10  flex   space-y-6 flex-col">
        {/* Right Panel - Request Summary */}
        <div className="flex gap-10  ">
          {/* Request Summary */}
          <section className="w-1/2 bg-white p-6   rounded-xl shadow-md  ">
            <h2 className="text-2xl font-semibold text-[#00113D] mb-8">
              Request Summary
            </h2>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-medium text-lg text-[#00113D]">
                  Request Status
                </p>
                <p className="text-lg text-[#5A5A5A]">Pending</p>
              </div>
              <div>
                <p className="font-medium text-lg text-[#00113D] ">
                  Request Date and Time
                </p>
                <p className="text-lg text-[#5A5A5A]">June 12, 2024 3:00AM</p>
              </div>
              <div
                className={`w-44 flex justify-center items-center py-2 px-4 text-base rounded-xl bg-[#E9F1FE] text-[#4478EB]
            `}
              >
                {" "}
                Booking Pending
              </div>
            </div>
            <h2 className="text-2xl mt-16 mb-4 font-semibold text-[#00113D] ">
              Car Details
            </h2>
            <div className="text-lg  space-y-2 w-full text-gray-500">
              <div className="grid grid-cols-2 gap-4 w-3/5 mt-4">
                <div className="">
                  <span className="font-medium text-black">Car Brand</span>
                  <p className="">Toyota</p>
                </div>
                <div className=" w-full">
                  <span className="font-medium text-black">Car Model</span>
                  <p className="">Camry</p>
                </div>
                <div className=" w-full">
                  <span className="font-medium text-black">Pictures</span>
                  <p className=" underline cursor-pointer ">View Pictures</p>
                </div>
              </div>
            </div>
          </section>

          {/* Rental Details */}
          <section className="w-1/2 bg-white p-6   rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-[#00113D] mb-8">
              Rental Details
            </h2>
            <div className="flex flex-col  text-lg text-[#5A5A5A]">
              <div className="flex items-start gap-2">
                <div>
                  <p className="flex items-center ">
                    {" "}
                    <FaRegCircle className="text-gray-400" />{" "}
                    <span className="px-4">Sunday, Jun 30 - 10:00 AM</span>
                  </p>
                  <div className="ml-2 px-6 border-l pb-12 border-gray-300">
                    {" "}
                    <p className="font-semibold">Bole International Airport</p>
                    <a href="#" className="text-blue-800 underline">
                      View Pick-up detail instructions
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div>
                  <p className="flex items-center">
                    {" "}
                    <FaRegCircle className="text-gray-400" />{" "}
                    <span className="px-4">Sunday, Jun 30 - 10:00 AM</span>
                  </p>
                  <div className="ml-2 px-6  pb-8 ">
                    {" "}
                    <p className="font-semibold">Bole International Airport</p>
                    <a href="#" className="text-blue-800 underline">
                      View Pick-up detail instructions
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-lg">
              <span className="font-medium text-black"> Driver request</span>
              <p className="text-gray-500">Yes</p>
            </div>
          </section>
        </div>
        <div>
          {/* Rentee Details */}
          <section className="h-fit bg-white p-6 space-y-6   rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-[#00113D] mb-8">
              Rentee Details
            </h2>
            <div className=" items-center flex gap-8">
              <img
                src={image}
                alt="Renter Profile"
                className="w-40 h-40 rounded-full"
              />
              <div className="grid gap-4 grid-cols-2">
                <h3 className="flex gap-4 text-lg  text-[#5A5A5A]">
                  <IoPersonOutline size={18} /> Steven Gerard
                </h3>
                <div className="flex items-center gap-4 text-lg text-[#5A5A5A] mt-1">
                  <MdOutlineLocalPhone size={18} />
                  <p>+251 9243212</p>
                </div>
                <div className="flex items-center gap-4 text-lg text-[#5A5A5A] mt-1">
                  <MdOutlineMail size={18} />
                  <p>jandoe@gmail.com</p>
                </div>
                <div className="flex items-center gap-4 text-lg text-[#5A5A5A] mt-1">
                  <IoLocationOutline size={18} />
                  <p>Addis Ababa, Ethiopia</p>
                </div>
                <button className="flex items-center gap-2 mt-4 px-16 py-3 text-base  border rounded-full border-[#00113D] text-[#00113D] bg-white">
                  <IoChatboxOutline size={16} />
                  Chat With Renter
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button className="flex-1 py-4 rounded-full bg-[#FDEAEA] text-red-700 border border-red-700">
                Reject Request
              </button>
              <button
                className="flex-1 py-4 rounded-full bg-[#00113D] text-white"
                onClick={() => setApproved(true)}
              >
                Approve Request
              </button>
              {approved && (
                <div>
                  {" "}
                  {/* Overlay background */}
                  <div className="fixed inset-0 bg-black opacity-50 z-20"></div>
                  {/* Modal content */}
                  <div className=" fixed inset-0 flex self-center  justify-center z-30 flex-col items-start p-6 gap-4 w-1/2 h-fit  mx-auto bg-white rounded-lg shadow-md">
                    {/* Header */}
                    <div className="flex items-center w-full mb-4">
                      <button
                        onClick={() => setApproved(false)}
                        className="text-lg font-semibold text-black mr-2"
                      >
                        {"←"}
                      </button>
                      <h2 className="text-lg font-semibold text-black">
                        Booking Details
                      </h2>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-black">
                      Terms and Conditions
                    </h1>
                    <h2 className="text-xl font-semibold text-black">
                      Renting a Car
                    </h2>
                    <p className="text-base text-gray-600">
                      Please read and accept the terms and conditions before
                      confirming your booking.
                    </p>

                    {/* Terms Content */}
                    <div className="text-base text-black leading-relaxed">
                      <h3 className="font-semibold text-black mb-2">
                        General Terms
                      </h3>
                      <ol className="list-decimal pl-6 text-gray-700">
                        <li>
                          Eligibility: You must be at least 21 years old and
                          hold a valid driver's license.
                        </li>
                        <li>
                          Rental Period: The rental period is defined in the
                          booking confirmation. Early returns will not be
                          refunded.
                        </li>
                        <li>
                          Usage: The vehicle is to be used for personal use only
                          and not for commercial purposes.
                        </li>
                        <li>
                          Responsibility: You are responsible for the vehicle
                          and any damage that occurs during the rental period.
                          Report any issues immediately.
                        </li>
                      </ol>

                      <h3 className="font-semibold text-black mt-4 mb-2">
                        Payment Terms
                      </h3>
                      <ol className="list-decimal pl-6 text-gray-700">
                        <li>
                          Charges: The rental fee includes the daily rate, any
                          additional mileage charges, and applicable taxes.
                        </li>
                        <li>
                          Security Deposit: A security deposit will be held on
                          your credit card and refunded upon safe return of the
                          vehicle.
                        </li>
                        <li>
                          Payment Method: Payments are processed via our
                          integrated payment gateway. No cash payments are
                          accepted.
                        </li>
                      </ol>

                      <h3 className="font-semibold text-black mt-4 mb-2">
                        Insurance and Liability
                      </h3>
                      <ol className="list-decimal pl-6 text-gray-700">
                        <li>
                          Insurance: Basic insurance coverage is included in
                          your rental fee. Additional insurance options are
                          available.
                        </li>
                        <li>
                          Accidents: In the event of an accident, contact local
                          authorities and inform the car owner immediately.
                        </li>
                        <li>
                          Damages: Any damages not covered by insurance will be
                          deducted from the security deposit. Excessive damage
                          may incur additional charges.
                        </li>
                      </ol>
                    </div>

                    {/* Checkbox */}
                    <div className="flex items-center mt-4">
                      <input
                        type="checkbox"
                        id="acceptTerms"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        className="w-5 h-5 mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="acceptTerms"
                        className="text-base font-medium text-black"
                      >
                        I accept the terms and conditions
                      </label>
                    </div>

                    {/* Approve Button */}
                    <button
                      onClick={() => setApproved(false)}
                      className={`w-full py-3 mt-4 text-white  text-lg rounded-full ${
                        isChecked
                          ? "bg-blue-950 hover:bg-blue-900"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                      disabled={!isChecked}
                    >
                      Approve Booking
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RentalRequests;
