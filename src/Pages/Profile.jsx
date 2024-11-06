import image from "../images/testimonials/avatar.png";
import edit from "../images/hero/editIcon.png";
import { HiEllipsisVertical } from "react-icons/hi2";
import { HiMiniArrowsUpDown } from "react-icons/hi2";
import React, { useState } from "react";
import flag from "../images/hero/image.png";
import { MdOutlinePerson } from "react-icons/md";
import { MdOutlinePersonOff } from "react-icons/md";
import { IoFileTray } from "react-icons/io5";

const Profile = () => {
  const [rentals, setRentals] = useState([
    {
      startDate: "23/3/2022",
      endDate: "24/3/2022",
      carName: "Bekele Mamo",
      carOwner: "Bekele Mamo",
      phone: "+251 93432124",
      status: "Completed",
    },
    {
      startDate: "24/3/2022",
      endDate: "23/3/2022",
      carName: "Addis Ababa",
      carOwner: "Bekele Mamo",
      phone: "+251 93432124",
      status: "Active",
    },
    {
      startDate: "25/3/2022",
      endDate: "22/3/2022",
      carName: "Zeina Haile",
      carOwner: "Bekele Mamo",
      phone: "+251 93432124",
      status: "Canceled",
    },
    {
      startDate: "26/3/2022",
      endDate: "NA",
      carName: "Teddy Worku",
      carOwner: "Bekele Mamo",
      phone: "+251 93432124",
      status: "Completed",
    },
    {
      startDate: "27/3/2022",
      endDate: "21/3/2022",
      carName: "Biruk Tadesse",
      carOwner: "Bekele Mamo",
      phone: "+251 93432124",
      status: "Completed",
    },
  ]);

  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@example.com",
    phoneNumber: "+251971235045",
    location: "Addis Ababa",
  });

  // Validation error state
  const [errors, setErrors] = useState({
    email: "",
    phoneNumber: "",
  });

  // Handler for input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));

    // Clear the error message as the user types
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate phone number format
  const isValidPhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\d{10}$/; // Adjust this regex for different formats
    return phoneRegex.test(phoneNumber);
  };

  // Handler for updating profile
  const handleUpdate = () => {
    // Validate email and phone number
    let hasError = false;
    const newErrors = {};

    if (!isValidEmail(profile.email)) {
      newErrors.email = "Please enter a valid email address.";
      hasError = true;
    }

    if (!isValidPhoneNumber(profile.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number.";
      hasError = true;
    }

    setErrors(newErrors);

    // Only update if there are no validation errors
    if (!hasError) {
      alert("Profile updated!");
      console.log("Updated profile:", profile);
      // You could send the updated profile to an API here.
    }
  };

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const statusColors = {
    Completed: "bg-blue-950 text-white",
    Active: "bg-green-100 text-green-700",
    Canceled: "bg-red-100 text-red-600",
  };

  const sortedRentals = [...rentals].sort((a, b) => {
    if (sortConfig.key) {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Convert dates to Date objects for comparison if sorting by date
      if (sortConfig.key === "startDate" || sortConfig.key === "endDate") {
        aValue =
          aValue === "NA"
            ? null
            : new Date(aValue.split("/").reverse().join("/"));
        bValue =
          bValue === "NA"
            ? null
            : new Date(bValue.split("/").reverse().join("/"));
      }

      if (aValue === bValue) return 0;

      if (sortConfig.direction === "ascending") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    }
    return 0;
  });

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  // Toggle popup visibility
  const togglePopup = () => setIsPopupVisible(!isPopupVisible);

  // Handle click for "Logout" and "Delete Account"
  const handleLogout = () => {
    setIsPopupVisible(false);
    // Add your logout logic here
    console.log("Logged out");
  };
  const handleDeleteAccountClick = () => {
    setIsPopupVisible(false);
    setIsModalVisible(true); // Show the confirmation modal
  };

  const handleConfirmDelete = () => {
    setIsModalVisible(false);
    // Add your delete account logic here
    console.log("Account deleted");
  };

  const handleCancelDelete = () => {
    setIsModalVisible(false);
  };

  const [isModalVisible1, setIsModalVisible1] = useState(false);
  const [profilePic, setProfilePic] = useState(image);

  // Toggle the modal visibility
  const toggleModal = () => setIsModalVisible1(!isModalVisible1);

  // Handle profile picture change
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePic(reader.result); // Update profile picture with the uploaded file
        setIsModalVisible1(false); // Close the modal after updating
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="py-10 bg-[#FAF9FE] px-32 space-y-8 md:pt-40 flex flex-col">
      <div className="flex space-x-8">
        {/* Account Information */}
        <div className="p-10 bg-white w-full justify-between flex shadow-lg rounded-lg">
          {/* Profile Pic and Account info */}
          <div className="flex space-y-4 justify-center mr-16 items-center flex-col">
            <span className="text-2xl mb-4 font-semibold">
              Account Information{" "}
            </span>
            <div className="flex items-end">
              <img
                src={profilePic}
                className="w-52 h-52 rounded-full text-white md:mb-4 md:mr-6"
              />
              <button
                onClick={toggleModal}
                className="flex items-center justify-center mb-8 -ml-16 rounded-full"
              >
                <img src={edit} className="w-12 h-12" />
              </button>
            </div>
            {/* Modal for Image Selection */}
            {isModalVisible1 && (
              <>
                {/* Overlay Background */}
                <div className="fixed inset-0 bg-black opacity-50 z-20"></div>

                {/* Modal Content */}
                <div className="fixed inset-0 flex items-center justify-center z-30">
                  <div className=" bg-gray-100">
                    <div className="bg-white p-8 rounded-lg shadow-lg md:w-[450px]">
                      {/* Title */}
                      <h2 className="text-xl font-medium text-gray-800 mb-4">
                        Upload a picture of your clear face
                      </h2>

                      {/* Upload Box */}
                      <label className=" w-full h-48 border-2 border-dashed border-gray-300 rounded-lg relative flex justify-center items-center cursor-pointer hover:border-gray-500">
                        <div className="flex flex-col items-center">
                          {/* Upload icon */}
                          <IoFileTray />
                          <p className="text-gray-400 mt-2">Click to upload</p>
                        </div>

                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePicChange}
                          className="hidden"
                        />
                      </label>

                      {/* Instructions */}
                      <ul className="text-left text-lg text-gray-600 mt-4 space-y-3">
                        <li>
                          <span className="font-semibold">1. Quality:</span> Use
                          a clear, well-lit image, at least 400x400 pixels.
                        </li>
                        <li>
                          <span className="font-semibold">2. Face Focus:</span>{" "}
                          Show your face clearly, taking up most of the frame.
                        </li>
                        <li>
                          <span className="font-semibold">
                            3. Simple Background:
                          </span>{" "}
                          Use a plain, uncluttered background.
                        </li>
                        <li>
                          <span className="font-semibold">
                            4. Dress Appropriately:
                          </span>{" "}
                          Wear clothes that match the platform's vibe.
                        </li>
                        <li>
                          <span className="font-semibold">
                            5. Proper Framing:
                          </span>{" "}
                          Center your face, with some space above your head.
                        </li>
                        <li>
                          <span className="font-semibold">6. File Specs:</span>{" "}
                          Use JPEG/PNG, under 2MB.
                        </li>
                      </ul>

                      {/* Upload Button */}
                      <button className="mt-6 w-full bg-blue-950 text-white rounded-full py-3 text-lg">
                        Upload
                      </button>
                      <div className="flex justify-end mt-4">
                        <button
                          onClick={toggleModal}
                          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col">
            <div className="relative inline-block my-3 text-lg w-[350px]">
              {/* Label inside box */}
              <label className="absolute -top-2 left-3 text-base bg-white px-1 text-gray-500">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                className="flex border border-gray-400 justify-between w-full p-3 py-4 bg-white text-gray-500 rounded-md focus:outline focus:outline-1 focus:outline-blue-400"
              />
            </div>
            <div className="relative inline-block my-3 text-lg w-full">
              {/* Label inside box */}
              <label className="absolute -top-2 left-3 text-base bg-white px-1 text-gray-500">
                Email
              </label>
              <input
                type="text"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="flex border border-gray-400 justify-between w-full p-3 py-4 bg-white text-gray-500 rounded-md focus:outline focus:outline-1 focus:outline-blue-400"
              />{" "}
              {errors.email && (
                <p className="text-red-500 mb-4">{errors.email}</p>
              )}
            </div>
            <div className="relative inline-block my-3 text-lg w-full">
              {/* Label inside box */}
              <label className="absolute -top-2 left-3 text-base bg-white px-1 text-gray-500">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleChange}
                className="flex border border-gray-400 justify-between w-full p-3 py-4 bg-white text-gray-500 rounded-md focus:outline focus:outline-1 focus:outline-blue-400"
              />
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="relative inline-block my-3 text-lg w-[350px]">
              {/* Label inside box */}
              <label className="absolute -top-2 left-3 text-base bg-white px-1 text-gray-500">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                className="flex border border-gray-400 justify-between w-full p-3 py-4 bg-white text-gray-500 rounded-md focus:outline focus:outline-1 focus:outline-blue-400"
              />
            </div>
            <div className="relative inline-block my-3 text-lg w-full">
              {/* Label inside box */}
              <label className="absolute -top-2 left-3 text-base bg-white px-1 text-gray-500">
                Phone Number
              </label>
              <div className="border border-gray-400 items-center rounded-md flex bg-white">
                <img src={flag} className="w-12 h-8 rounded-xl ml-4" />
                <input
                  type="text"
                  name="phoneNumber"
                  value={profile.phoneNumber}
                  onChange={handleChange}
                  className="flex justify-between w-full p-3 py-4 bg-white text-gray-500 rounded-md focus:outline focus:outline-1 focus:outline-blue-400"
                />
              </div>{" "}
              {errors.phoneNumber && (
                <p className="text-red-500 mb-4">{errors.phoneNumber}</p>
              )}
            </div>
            <button
              onClick={handleUpdate}
              className=" bg-blue-950 text-base flex items-center justify-center w-fit text-white rounded-full px-8  my-2  py-4"
            >
              Update
            </button>
          </div>
          {/* 3 Dots */}
          <div className="relative">
            {/* Ellipsis button */}
            <div className="flex flex-col cursor-pointer" onClick={togglePopup}>
              <HiEllipsisVertical size={28} />
            </div>

            {/* Popup menu */}
            {isPopupVisible && (
              <div className="absolute top-10 text-xl right-0 bg-white shadow-md rounded-md py-2 w-72 z-10">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full  text-left px-4 py-4 hover:bg-gray-100"
                >
                  <MdOutlinePerson size={20} className="mx-4" /> Logout
                </button>
                <button
                  onClick={handleDeleteAccountClick}
                  className="flex w-full items-center text-left  px-4 py-4 hover:bg-gray-100 text-red-600"
                >
                  <MdOutlinePersonOff size={20} className="mx-4" />
                  Delete Account
                </button>
              </div>
            )}
            {/* Confirmation Modal */}
            {isModalVisible && (
              <>
                {/* Overlay background */}
                <div className="fixed inset-0 bg-black opacity-50 z-20"></div>

                {/* Modal content */}
                <div className="fixed inset-0 flex items-center justify-center z-30">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-[300px]">
                    <h2 className="text-3xl  mb-4">Are You Sure ?</h2>
                    <p className="text-gray-600 text-lg my-10">
                      Deleting your account will erase all information
                      associated with the account.
                    </p>
                    <div className="flex justify-end space-x-8">
                      <button
                        onClick={handleCancelDelete}
                        className=" bg-blue-950 text-base flex items-center justify-center w-fit text-white rounded-full px-8  my-2  py-4"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmDelete}
                        className=" bg-red-100 text-base flex items-center justify-center w-fit text-red-600 hover:bg-red-600 hover:text-white  rounded-full px-8  my-2  py-4"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Payment Details */}
        <div className="p-10 bg-white w-1/3 flex flex-col  shadow-lg rounded-lg">
          <div className=" text-xl font-semibold mb-8">Payment Details</div>
          <div className="grid grid-cols-1 sm:grid-cols-2  p-4 gap-4 ">
            <div className="flex items-center">
              Full Name{" "}
              <span className="mx-2 bg-blue-100 rounded-md p-2 ">
                {profile.firstName} {profile.lastName}
              </span>
            </div>
            <div className="flex items-center">
              Phone Number{" "}
              <span className="mx-2 bg-blue-100 rounded-md p-2 ">
                {profile.phoneNumber}
              </span>
            </div>
            <div className="flex items-center">
              Location{" "}
              <span className="mx-2 bg-blue-100 rounded-md p-2 ">
                {profile.location}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className=" bg-white w-full  shadow-lg rounded-lg">
        <div className="  p-6  rounded-lg ">
          <h2 className="text-2xl font-semibold pl-2  my-8">Rental History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-x-0 border-t-0 border-gray-100 rounded-lg">
              <thead>
                <tr className="bg-gray-50 font-semibold">
                  <th
                    className="px-6 text-left text-xl font-semibold py-4 text-gray-600"
                    onClick={() => handleSort("startDate")}
                  >
                    Rent start date{" "}
                    <HiMiniArrowsUpDown className="inline ml-1 cursor-pointer" />
                  </th>
                  <th
                    className="px-6 text-left text-xl font-semibold py-4 text-gray-600"
                    onClick={() => handleSort("endDate")}
                  >
                    Rent end date{" "}
                    <HiMiniArrowsUpDown className="inline ml-1 cursor-pointer" />
                  </th>
                  <th
                    className="px-6 text-left text-xl font-semibold py-4 text-gray-600"
                    onClick={() => handleSort("carName")}
                  >
                    Car Name{" "}
                    <HiMiniArrowsUpDown className="inline ml-1 cursor-pointer" />
                  </th>
                  <th className="px-6 text-left text-xl font-semibold py-4 text-gray-600">
                    Car Owner
                  </th>
                  <th className="px-6 text-left text-xl font-semibold py-4 text-gray-600">
                    Phone Number
                  </th>
                  <th className="px-6 text-left text-xl font-semibold py-4 text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedRentals.map((rental, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="px-6 py-4 text-lg text-gray-700">
                      {rental.startDate}
                    </td>
                    <td className="px-6 py-4 text-lg text-gray-700">
                      {rental.endDate}
                    </td>
                    <td className="px-6 py-4 text-lg text-gray-700">
                      {rental.carName}
                    </td>
                    <td className="px-6 py-4 text-lg text-gray-700">
                      {rental.carOwner}
                    </td>
                    <td className="px-6 py-4 text-lg text-gray-700">
                      {rental.phone}
                    </td>
                    <td className="p-8">
                      <span
                        className={`px-3 py-2 rounded-xl text-base  ${
                          statusColors[rental.status]
                        }`}
                      >
                        {rental.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
