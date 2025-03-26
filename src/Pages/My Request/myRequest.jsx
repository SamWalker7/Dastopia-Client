import { FaRegCircle } from "react-icons/fa";
import image from "../../images/testimonials/avatar.png";
import {
  IoChatboxOutline,
  IoLocationOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { MdOutlineLocalPhone, MdOutlineMail } from "react-icons/md";
import { useState } from "react";

const MyRequests = () => {
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

  return (
    <div className="flex justify-center md:pt-40 p-8 bg-[#F8F8FF] min-h-screen">
      {/* Left Panel - Rental Requests */}
      <div className="w-1/4 bg-white p-6 rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-bold text-[#00113D]">My Requests</h2>

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
            expiresIn: "24 Hours",
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
            <div className="text-sm mb-4 space-y-2 w-full text-gray-500">
              <div className="grid grid-cols-2 gap-4 w-full mt-4">
                <div className="pl-4">
                  <span className="font-medium text-black">Car Brand</span>
                  <p className="">Toyota</p>
                </div>
                <div className=" w-full">
                  <span className="font-medium text-black">Car Model</span>
                  <p className="">Camry</p>
                </div>{" "}
                <div className="pl-4">
                  <span className="font-medium text-black">
                    Rental Request Date
                  </span>
                  <p className="">August 4, 2024</p>
                </div>
                <div className=" w-full">
                  <span className="font-medium text-black">Rent Duration</span>
                  <p className="">12 Days</p>
                </div>
              </div>
            </div>
            <div className="text-sm mb-4 space-y-2 w-full text-gray-500">
              <div className="grid grid-cols-3 gap-4 w-full mt-4">
                <div className="pl-4">
                  <span className="font-medium text-black">Status</span>
                  <div
                    className={`w-44 flex justify-center items-center py-2 px-4 text-sm rounded-xl bg-[#E9F1FE] text-[#4478EB] my-2  `}
                  >
                    Waiting Approval
                  </div>
                </div>
              </div>
            </div>

            <button className="mt-3 w-full py-2 text-sm rounded-full bg-[#00113D] text-white ">
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
            <h2 className="text-sm font-semibold text-[#00113D] mb-8">
              Request Summary
            </h2>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-medium text-sm text-[#00113D]">
                  Request Status
                </p>
                <p className="text-sm text-[#5A5A5A]">Pending</p>
              </div>
              <div>
                <p className="font-medium text-sm text-[#00113D] ">
                  Request Date and Time
                </p>
                <p className="text-sm text-[#5A5A5A]">June 12, 2024 3:00AM</p>
              </div>
              <div
                className={`w-44 flex justify-center items-center py-2 px-4 text-sm rounded-xl bg-[#E9F1FE] text-[#4478EB]
            `}
              >
                {" "}
                Waiting Approval
              </div>
            </div>
            <h2 className="text-sm mt-16 mb-4 font-semibold text-[#00113D] ">
              Car Details
            </h2>
            <div className="text-sm  space-y-2 w-full text-gray-500">
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
            <h2 className="text-sm font-semibold text-[#00113D] mb-8">
              Rental Details
            </h2>
            <div className="flex flex-col  text-sm text-[#5A5A5A]">
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
            <div className="mt-4 text-sm">
              <span className="font-medium text-black"> Driver request</span>
              <p className="text-gray-500">Yes</p>
            </div>
          </section>
        </div>
        <div>
          {/* Rentee Details */}
          <section className="h-fit bg-white p-6 space-y-6   rounded-xl shadow-md">
            <h2 className="text-sm font-semibold text-[#00113D] mb-8">
              Rentee Details
            </h2>
            <div className=" items-center flex gap-8">
              <img
                src={image}
                alt="Renter Profile"
                className="w-40 h-40 rounded-full"
              />
              <div className="grid gap-4 grid-cols-2">
                <h3 className="flex gap-4 text-sm  text-[#5A5A5A]">
                  <IoPersonOutline size={18} /> Steven Gerard
                </h3>
                <div className="flex items-center gap-4 text-sm text-[#5A5A5A] mt-1">
                  <MdOutlineLocalPhone size={18} />
                  <p>+251 9243212</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-[#5A5A5A] mt-1">
                  <MdOutlineMail size={18} />
                  <p>jandoe@gmail.com</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-[#5A5A5A] mt-1">
                  <IoLocationOutline size={18} />
                  <p>Addis Ababa, Ethiopia</p>
                </div>
                <button className="flex items-center gap-2 mt-4 px-16 py-1 text-base  border rounded-full border-[#00113D] text-[#00113D] bg-white">
                  <IoChatboxOutline size={16} />
                  Chat With Renter
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <>
                <button
                  onClick={() => setIsModalVisible(true)}
                  className="flex-1 py-1 rounded-full bg-[#FDEAEA] text-red-700 border border-red-700"
                >
                  Cancel Booking
                </button>

                {/* Modal rendering, displayed based on `isModalVisible` */}
                {isModalVisible && (
                  <>
                    {/* Overlay background */}
                    <div className="fixed inset-0 bg-black opacity-50 z-20"></div>

                    {/* Modal content */}
                    <div className="fixed inset-0 flex items-center justify-center z-30">
                      <div className="bg-white p-6 rounded-lg shadow-lg w-[300px]">
                        <h2 className="text-xl mb-4">
                          Are you sure you want to cancel this Booking request?
                        </h2>
                        <p className="text-gray-600 text-sm my-10">
                          Cancelling a request will cause you to reenter the
                          request from the start.
                        </p>
                        <div className="flex justify-between space-x-8">
                          <button
                            onClick={() => {
                              handleCancelBooking(); // Perform cancel booking action
                              setIsModalVisible(false); // Close modal
                            }}
                            className="bg-blue-950 text-sm flex items-center justify-center w-fit text-white rounded-full px-8 my-2 py-1"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              setApproved(false); // Reset approval state
                              setIsModalVisible(false); // Close modal
                            }}
                            className="bg-red-100 text-sm flex items-center justify-center w-fit text-red-600 hover:bg-red-600 hover:text-white rounded-full px-8 my-2 py-1"
                          >
                            Cancel Booking
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MyRequests;
