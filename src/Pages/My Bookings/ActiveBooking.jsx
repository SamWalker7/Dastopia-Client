import Footer from "../../components/Footer";
import ActiveRental from "./ActiveRental";
import { useState } from "react";
import image from "../../images/testimonials/avatar.png";
import {
  IoChatboxOutline,
  IoFileTray,
  IoLocationOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { MdOutlineLocalPhone, MdOutlineMail } from "react-icons/md";
import { FaRegCircle } from "react-icons/fa";

const ActivBooking = () => {
  const [activeTab, setActiveTab] = useState("ActiveBooking");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [approved, setApproved] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [otherComments, setOtherComments] = useState("");
  const [files, setFiles] = useState({
    front: null,
    right: null,
    left: null,
    rear: null,
    interior: null,
  });

  const conditions = [
    "Scratches",
    "Dents",
    "Broken Lights",
    "Interior damages",
    "Car Condition Report",
    "Car Condition Report",
  ];

  const handleCheckboxChange = (condition) => {
    setSelectedConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((item) => item !== condition)
        : [...prev, condition]
    );
  };

  const handleFileChange = (e, side) => {
    const file = e.target.files[0];
    setFiles((prev) => ({ ...prev, [side]: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can process form data
    console.log("Selected Conditions:", selectedConditions);
    console.log("Other Comments:", otherComments);
    console.log("Files:", files);
  };
  return (
    <div className=" flex flex-col bg-[#FAF9FE] ">
      <div className="md:mt-32 mt-20">
        <div className="relative    ">
          <div className="flex  mx-20  mb-4 sm:mb-6">
            <button
              onClick={() => setActiveTab("ActiveBooking")}
              className={`px-12 py-2 text-lg ${
                activeTab === "ActiveBooking"
                  ? "text-black border-b-2 border-[#00173C]"
                  : "text-gray-500 border-b-2 border-gray-300"
              }`}
            >
              Active Booking
            </button>
            <button
              onClick={() => setActiveTab("ActiveRental")}
              className={`px-12 py-2 text-lg ${
                activeTab === "ActiveRental"
                  ? "text-black border-b-2 border-[#00173C]"
                  : "text-gray-500 border-b-2 border-gray-300"
              }`}
            >
              Active Rental
            </button>
          </div>

          <div className="   ">
            <div>
              <div className="">
                {activeTab === "ActiveBooking" ? (
                  <div className="flex md:flex-row flex-col p-4">
                    <div className="h-fit bg-white p-8 space-y-10 md:m-8 md:ml-16 mb-8   rounded-xl shadow-md w-full md:w-1/3">
                      {/* <ActiveBooking /> */}
                      <h2 className="text-lg  mt-4 font-semibold text-[#00113D] ">
                        Car Details
                      </h2>
                      <div className="text-sm  space-y-2 w-full text-gray-500">
                        <div className="grid grid-cols-4 gap-4  mt-4">
                          <div className="">
                            <span className="font-medium text-black">
                              Car Brand
                            </span>
                            <p className="">Toyota</p>
                          </div>
                          <div className=" ">
                            <span className="font-medium text-black">
                              Car Model
                            </span>
                            <p className="">Camry</p>
                          </div>
                          <div className=" ">
                            <span className="font-medium text-black">
                              Pictures
                            </span>
                            <p className=" underline cursor-pointer ">
                              View Pictures
                            </p>
                          </div>
                          <div className=" text-sm">
                            <span className="font-medium text-black">
                              {" "}
                              Driver request
                            </span>
                            <p className="text-gray-500">Yes</p>
                          </div>
                        </div>
                      </div>

                      <div className="  flex mt-20 gap-8">
                        <div className="flex items-start">
                          <img
                            src={image}
                            alt="Renter Profile"
                            className="w-16 h-16 rounded-full"
                          />
                        </div>
                        <div className="grid pt-4 gap-4 grid-cols-1">
                          <h2 className="text-base font-semibold text-[#00113D] ">
                            Owner Details
                          </h2>
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
                        </div>
                      </div>
                      <button className="flex items-center justify-center  w-full gap-2 mt-4 py-3 text-xs  border rounded-full border-[#00113D] text-[#00113D] bg-white">
                        <IoChatboxOutline size={16} />
                        Chat With Renter
                      </button>

                      {/* Action Buttons */}
                      <div className="flex text-sm gap-4">
                        <button className="flex-1 py-3 rounded-full bg-[#FDEAEA] text-red-700 border border-red-700">
                          Cancel Booking
                        </button>
                        <button
                          className="flex-1  py-3 rounded-full bg-[#00113D] text-white"
                          onClick={() => setApproved(true)}
                        >
                          Return Car
                        </button>
                        {approved && (
                          <div>
                            {" "}
                            {/* Overlay background */}
                            <div className="fixed inset-0 bg-black opacity-50 z-20"></div>
                            {/* Modal content */}
                            <div className=" fixed inset-0 flex self-center  justify-center z-30 flex-col items-start p-6 gap-4 w-1/2 h-fit  mx-auto  rounded-lg shadow-md">
                              <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
                                <h1 className="text-lg font-semibold mb-2">
                                  Car Condition Report
                                </h1>
                                <p className="text-gray-600 mb-4">
                                  Please input any incidents or accidents that
                                  you have experienced
                                </p>

                                {/* Checkbox List */}
                                <div className="space-y-1 mb-6">
                                  {conditions.map((condition, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center"
                                    >
                                      <input
                                        type="checkbox"
                                        id={`condition-${index}`}
                                        checked={selectedConditions.includes(
                                          condition
                                        )}
                                        onChange={() =>
                                          handleCheckboxChange(condition)
                                        }
                                        className="w-5 h-5 mr-2 text-blue-600 rounded border-gray-300"
                                      />
                                      <label
                                        htmlFor={`condition-${index}`}
                                        className="text-gray-800"
                                      >
                                        {condition}
                                      </label>
                                    </div>
                                  ))}
                                </div>

                                {/* Other Comments */}
                                <input
                                  type="text"
                                  placeholder="Other"
                                  value={otherComments}
                                  onChange={(e) =>
                                    setOtherComments(e.target.value)
                                  }
                                  className="w-full p-2 mb-2 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00113D]"
                                />

                                {/* File Upload Areas */}
                                <p className="text-gray-600 mb-4">
                                  Send an attachment or a screenshot of all
                                  sides of the car
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                                  {[
                                    "front",
                                    "right",
                                    "left",
                                    "rear",
                                    "interior",
                                  ].map((side) => (
                                    <div
                                      key={side}
                                      className="border border-dashed border-gray-400 p-4 rounded-lg flex flex-col items-center"
                                    >
                                      <div className="font-semibold flex items-center  text-xs w-full justify-between text-gray-700 capitalize">
                                        <div>{side} of the car </div>
                                        <div className="flex flex-col items-center">
                                          {/* Upload icon */}

                                          <p className="bg-gray-100 px-6 py-2 rounded-lg text-gray-400 ">
                                            <IoFileTray size={16} />
                                          </p>
                                        </div>
                                      </div>
                                      <label
                                        htmlFor={`file-${side}`}
                                        className="text-blue-600 mt-2 cursor-pointer"
                                      >
                                        Click here{" "}
                                        <span className="text-gray-500">
                                          to upload or drop files here
                                        </span>
                                      </label>
                                      <input
                                        type="file"
                                        id={`file-${side}`}
                                        accept="image/*"
                                        onChange={(e) =>
                                          handleFileChange(e, side)
                                        }
                                        className="hidden"
                                      />
                                      {files[side] && (
                                        <p className="text-sm text-yellow-500 mt-1">
                                          {files[side].name}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>

                                {/* Submit Button */}
                                <button
                                  onClick={(e) => {
                                    setApproved(false);
                                    handleSubmit(e);
                                  }}
                                  className="w-full py-2 text-white bg-[#00113D] rounded-full  text-sm   hover:bg-blue-900"
                                >
                                  Submit Report
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* right side */}
                    <section className="w-fit h-fit bg-white p-6   rounded-xl shadow-md">
                      <h2 className="text-lg font-semibold text-[#00113D] mb-8">
                        Rental Summary
                      </h2>
                      <h2 className="text-base  text-[#00113D] my-2">
                        Booking Status
                      </h2>
                      <h2 className="text-sm bg-green-200 rounded-lg w-fit  text-[#00113D] px-4 py-2 mb-16">
                        Active
                      </h2>
                      <div className="flex flex-col  text-lg text-[#5A5A5A]">
                        <div className="flex items-start gap-2">
                          <div>
                            <p className="flex  items-center ">
                              {" "}
                              <FaRegCircle className=" text-gray-400" />{" "}
                            </p>
                            <div className="ml-2 px-6 flex items-center border-l h-40 pb-12 border-gray-300">
                              {" "}
                              <div className="-mt-24 bg-gray-200 text-sm p-8 flex rounded-lg">
                                <div className="font-semibold  mr-4 w-28 ">
                                  PickUp
                                </div>
                                <div className="">
                                  <p className="">Date: September 3,2024</p>
                                  <p>Time: 12:00PM</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start  gap-2">
                          <div>
                            <p className="flex  items-center ">
                              {" "}
                              <FaRegCircle className=" text-gray-400" />{" "}
                            </p>
                            <div className="ml-2 px-6 flex items-center pt-8  pb-12 border-gray-300">
                              {" "}
                              <div className="-mt-24 bg-gray-200 text-sm p-8 flex rounded-lg">
                                <div className="font-semibold mr-4 w-28">
                                  Return On
                                </div>
                                <div className="">
                                  <p className="">Date: September 3,2024</p>
                                  <p>Time: 12:00PM</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                ) : (
                  <div className="">
                    <ActiveRental />
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

export default ActivBooking;
