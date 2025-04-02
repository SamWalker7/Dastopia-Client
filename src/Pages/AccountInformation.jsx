import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { IoFileTray } from "react-icons/io5";
import { TextField } from "@mui/material";
import placeholderImage from "../images/testimonials/avatar.png";
import editIcon from "../images/hero/editIcon.png";
import flag from "../images/hero/image.png";
import { getDownloadUrl } from "../api";

const AccountInformation = ({
  profile,
  setProfile,
  errors,
  handleChange,
  handleUpdate,
  user2,
  onProfilePicUploaded,
  profileImageUrl,
  isImageLoading,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProfilePicFile, setSelectedProfilePicFile] = useState(null);
  const [tempImageUrl, setTempImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const toggleModal = () => setIsModalVisible(!isModalVisible);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size should be less than 2MB");
        return;
      }
      setSelectedProfilePicFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setTempImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePicUpload = async () => {
    if (!selectedProfilePicFile || !onProfilePicUploaded) {
      console.error("No file selected or upload handler missing");
      return;
    }

    setIsUploading(true);
    const userId = user2?.userAttributes?.find(
      (attr) => attr.Name === "sub"
    )?.Value;
    const filename = `profile_pics/${userId}_${Date.now()}.${selectedProfilePicFile.name
      .split(".")
      .pop()}`;
    const contentType = selectedProfilePicFile.type;
    const token = JSON.parse(localStorage.getItem("customer"));
    try {
      // Step 1: Get presigned URL for upload
      const presignedResponse = await fetch(
        `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/account/get_account_presigned_url/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token.AccessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filename: filename,
            contentType: contentType,
          }),
        }
      );

      if (!presignedResponse.ok) throw new Error("Failed to get upload URL");
      const responseData = await presignedResponse.json();
      console.log("Full API response:", responseData);
      const { url, key } = await responseData.body;

      // Step 2: Upload to S3
      const uploadResponse = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": contentType,
        },
        body: selectedProfilePicFile,
      });

      if (!uploadResponse.ok) throw new Error("Upload failed");

      // Step 3: Update user profile with new key
      onProfilePicUploaded(key);
      setIsModalVisible(false);
    } catch (error) {
      console.error("Profile picture upload error:", error);
      alert("Failed to upload profile picture. Please try again.");
    } finally {
      setIsUploading(false);
      setSelectedProfilePicFile(null);
      setTempImageUrl("");
    }
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg space-y-6 md:w-2/4 h-fit">
      <h2 className="text-xl font-semibold">Account Information</h2>

      <div className="flex flex-col md:flex-row items-center space-y-4">
        {/* Profile Picture Section */}
        <div className="relative group w-fit mr-8">
          {isImageLoading ? (
            <div className="w-32 h-32 rounded-full flex items-center justify-center bg-gray-100">
              <FaSpinner className="animate-spin text-2xl text-gray-400" />
            </div>
          ) : (
            <img
              src={profileImageUrl || placeholderImage}
              alt="Profile"
              className="w-56 h-40 rounded-full object-cover border-4 border-gray-100"
            />
          )}
          <button
            onClick={toggleModal}
            className="absolute bottom-4 -right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-100 transition-all"
          >
            <img src={editIcon} className="w-8 h-8" alt="Edit" />
          </button>
        </div>

        {/* Profile Picture Upload Modal */}
        {isModalVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setIsModalVisible(false)}
            />
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
              <h3 className="text-lg font-medium mb-4">
                Update Profile Picture
              </h3>

              <label className="block mb-4">
                <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
                  {tempImageUrl ? (
                    <img
                      src={tempImageUrl}
                      alt="Preview"
                      className="h-full w-full object-contain rounded-lg"
                    />
                  ) : (
                    <>
                      <IoFileTray className="text-gray-400 text-3xl mb-2" />
                      <p className="text-gray-500">Click to upload image</p>
                      <p className="text-xs text-gray-400 mt-1">
                        JPEG/PNG, max 2MB
                      </p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  className="hidden"
                />
              </label>

              <div className="text-xs text-gray-600 space-y-2 mb-4">
                <p>
                  <span className="font-semibold">Requirements:</span>
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Clear, well-lit image (min 400×400px)</li>
                  <li>Face should be clearly visible</li>
                  <li>Plain background recommended</li>
                  <li>File size under 2MB</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsModalVisible(false)}
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProfilePicUpload}
                  disabled={!tempImageUrl || isUploading}
                  className="px-4 py-2 text-sm text-white bg-blue-950 rounded-md hover:bg-blue-900 disabled:opacity-50 flex items-center"
                >
                  {isUploading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      ...
                    </>
                  ) : (
                    "Select"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Form Fields */}
        <div className="w-full space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="First Name"
              variant="outlined"
              name="firstName"
              value={profile.firstName}
              onChange={handleChange}
              size="small"
              fullWidth
            />
            <TextField
              label="Last Name"
              variant="outlined"
              name="lastName"
              value={profile.lastName}
              onChange={handleChange}
              size="small"
              fullWidth
            />
          </div>

          <TextField
            label="Email"
            variant="outlined"
            name="email"
            value={profile.email}
            onChange={handleChange}
            size="small"
            fullWidth
            error={!!errors.email}
            helperText={errors.email}
          />

          <div className="relative">
            <label className="absolute -top-2 left-2 text-xs bg-gray-200 px-1 text-gray-500">
              Phone Number
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-0 py-0 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <img src={flag} alt="Flag" className="w-5 h-4 mr-2 ml-3" />
              <input
                type="tel"
                name="phoneNumber"
                value={profile.phoneNumber}
                onChange={handleChange}
                className="flex-1 outline-none text-sm pr-3 py-2"
                placeholder="Enter phone number"
                disabled={true}
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
            )}
          </div>

          {/* <TextField
            label="Location"
            variant="outlined"
            name="address" // Changed from 'location' to 'address' to match the API
            value={profile.address} // Changed from profile.location to profile.address
            onChange={handleChange}
            size="small"
            fullWidth
          /> */}
          {/* <TextField
            label="City"
            variant="outlined"
            name="city"
            value={profile.city}
            onChange={handleChange}
            size="small"
            fullWidth
          /> */}

          <button
            onClick={handleUpdate}
            className="w-full bg-blue-950 text-white py-2 rounded-md hover:bg-blue-900 transition-colors"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountInformation;
