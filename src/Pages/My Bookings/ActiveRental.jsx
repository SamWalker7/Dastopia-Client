import Footer from "../../components/Footer";
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

const ActiveRental = () => {
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
    <div className="flex gap-10 md:px-16">
      {/* Left Panel - Rental Requests */}
      <div className="w-1/4 bg-white p-6 rounded-xl shadow-md space-y-4">
        <h2 className="text-3xl font-bold text-[#00113D]">Rental Requests</h2>

        {/* Rental Request Card */}
        {[
          {
            expiresIn: "24 Hours",
            status: "Active",
            bgColor: "bg-[#E9F1FE]",
            textColor: "text-[#4478EB]",
            borderColor: "border-[#4478EB]",
          },
          {
            expiresIn: "1 Hour",
            status: "Active",
            bgColor: "bg-[#FDEAEA]",
            textColor: "text-[#EB4444]",
            borderColor: "border-[#EB4444]",
          },
          {
            expiresIn: "24 Hours",
            status: "Active",
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

      {/* rigth side */}
      <div className="flex flex-col w-full">
        {" "}
        <section className="w-full h-fit bg-white p-6   rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-[#00113D] mb-8">
            Rental Summary
          </h2>
          <h2 className="text-xl  text-[#00113D] my-2">Booking Status</h2>
          <h2 className="text-lg bg-green-200 rounded-lg w-fit  text-[#00113D] px-4 py-2 mb-16">
            Active
          </h2>
          <div className="flex flex-col w-full  text-lg text-[#5A5A5A]">
            <div className="flex items-start gap-2">
              <div>
                <p className="flex  items-center ">
                  {" "}
                  <FaRegCircle className=" text-gray-400" />{" "}
                </p>
                <div className="ml-2 px-6 flex items-center border-l h-40 pb-12 border-gray-300">
                  {" "}
                  <div className="-mt-24 bg-gray-200 w-full p-8 flex rounded-lg">
                    <div className="font-semibold mr-4 w-28 ">PickUp</div>
                    <div className="">
                      <p className="">Date: September 3,2024</p>
                      <p>Time: 12:00PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-start w-full  gap-2">
              <div>
                <p className="flex  items-center ">
                  {" "}
                  <FaRegCircle className=" text-gray-400" />{" "}
                </p>
                <div className="ml-2 px-6 flex items-center  pt-8  pb-12 border-gray-300">
                  {" "}
                  <div className="-mt-24 bg-gray-200 w-full p-8 flex rounded-lg">
                    <div className="font-semibold mr-4 w-28">Return On</div>
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
        <div className="h-fit bg-white p-8 space-y-10 my-8    rounded-xl shadow-md w-full">
          {/* <ActiveBooking /> */}
          <h2 className="text-2xl  mt-4 font-semibold text-[#00113D] ">
            Car Details
          </h2>
          <div className="text-lg  space-y-2 w-full text-gray-500">
            <div className="grid grid-cols-4 gap-4  mt-4">
              <div className="">
                <span className="font-medium text-black">Car Brand</span>
                <p className="">Toyota</p>
              </div>
              <div className=" ">
                <span className="font-medium text-black">Car Model</span>
                <p className="">Camry</p>
              </div>
              <div className=" ">
                <span className="font-medium text-black">Pictures</span>
                <p className=" underline cursor-pointer ">View Pictures</p>
              </div>
              <div className=" text-lg">
                <span className="font-medium text-black"> Driver request</span>
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
              <h2 className="text-xl font-semibold text-[#00113D] ">
                Owner Details
              </h2>
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
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button className="flex items-center justify-center  w-1/2 gap-2  py-3 text-base  border rounded-full border-[#00113D] text-[#00113D] bg-white">
              <IoChatboxOutline size={16} />
              Chat With Renter
            </button>
            <button
              className="flex-1  py-3 rounded-full bg-[#00113D] text-white"
              onClick={() => setApproved(true)}
            >
              Complete Booking
            </button>
            {approved && (
              <div>
                {" "}
                {/* Overlay background */}
                <div className="fixed inset-0 bg-black opacity-50 z-20"></div>
                {/* Modal content */}
                <div className=" fixed inset-0 flex self-center  justify-center z-30 flex-col items-start p-6 gap-4 w-1/2 h-fit  mx-auto  rounded-lg shadow-md">
                  <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
                    <h1 className="text-2xl font-semibold mb-2">
                      Car Condition Report
                    </h1>
                    <p className="text-gray-600 mb-4">
                      Please input any incidents or accidents that you have
                      experienced
                    </p>

                    {/* Checkbox List */}
                    <div className="space-y-4 mb-6">
                      {conditions.map((condition, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`condition-${index}`}
                            checked={selectedConditions.includes(condition)}
                            onChange={() => handleCheckboxChange(condition)}
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
                      onChange={(e) => setOtherComments(e.target.value)}
                      className="w-full p-3 mb-6 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00113D]"
                    />

                    {/* File Upload Areas */}
                    <p className="text-gray-600 mb-4">
                      Send an attachment or a screenshot of all sides of the car
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                      {["front", "right", "left", "rear", "interior"].map(
                        (side) => (
                          <div
                            key={side}
                            className="border border-dashed border-gray-400 p-4 rounded-lg flex flex-col items-center"
                          >
                            <div className="font-semibold flex items-center w-full justify-between text-gray-700 capitalize">
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
                              onChange={(e) => handleFileChange(e, side)}
                              className="hidden"
                            />
                            {files[side] && (
                              <p className="text-sm text-yellow-500 mt-1">
                                {files[side].name}
                              </p>
                            )}
                          </div>
                        )
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      onClick={(e) => {
                        setApproved(false);
                        handleSubmit(e);
                      }}
                      className="w-full py-3 text-white bg-[#00113D] rounded-full  text-lg hover:bg-blue-900"
                    >
                      Submit Report
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveRental;
