import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { IoFileTray, IoClose } from "react-icons/io5";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"; // Added MUI Select components
import placeholderImage from "../images/testimonials/avatar.png";
import editIcon from "../images/hero/editIcon.png";
import flag from "../images/hero/image.png";

const AccountInformation = ({
  profile,
  errors,
  handleChange,
  handleUpdate,
  user2,
  onProfilePicUploaded,
  profileImageUrl,
  isImageLoading,
  isUpdatingProfileDetails,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProfilePicFile, setSelectedProfilePicFile] = useState(null);
  const [tempImageUrl, setTempImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    if (isModalVisible) {
      setSelectedProfilePicFile(null);
      setTempImageUrl("");
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size should be less than 2MB.");
        e.target.value = null;
        return;
      }
      setSelectedProfilePicFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePicUpload = async () => {
    if (!selectedProfilePicFile || !onProfilePicUploaded) {
      console.error("No file selected or upload handler missing");
      alert("Please select a file to upload.");
      return;
    }

    setIsUploading(true);
    const userId = user2?.userAttributes?.find(
      (attr) => attr.Name === "sub"
    )?.Value;

    if (!userId) {
      console.error("User ID (sub) not found. Cannot upload profile picture.");
      alert("Error: Could not identify user. Please try logging in again.");
      setIsUploading(false);
      return;
    }

    const filename = `profile_pics/${userId}_${Date.now()}.${selectedProfilePicFile.name
      .split(".")
      .pop()}`;
    const contentType = selectedProfilePicFile.type;
    const tokenData = localStorage.getItem("customer");

    if (!tokenData) {
      console.error("Customer token not found in localStorage.");
      alert("Authentication error. Please log in again.");
      setIsUploading(false);
      return;
    }
    const token = JSON.parse(tokenData);

    try {
      const presignedResponse = await fetch(
        `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/account/get_account_presigned_url/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token.AccessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ filename, contentType }),
        }
      );

      if (!presignedResponse.ok) {
        throw new Error(
          `Failed to get upload URL. Status: ${presignedResponse.status}`
        );
      }

      const responseData = await presignedResponse.json();
      const parsedBody =
        typeof responseData.body === "string"
          ? JSON.parse(responseData.body)
          : responseData.body;

      if (!parsedBody || !parsedBody.url || !parsedBody.key) {
        throw new Error(
          "Presigned URL or key missing in response from server."
        );
      }
      const { url, key } = parsedBody;

      const uploadResponse = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": contentType },
        body: selectedProfilePicFile,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed. Status: ${uploadResponse.status}`);
      }

      onProfilePicUploaded(key);
      toggleModal();
    } catch (error) {
      console.error("Profile picture upload error:", error);
      alert(
        `Failed to upload profile picture: ${error.message}. Please try again.`
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg space-y-6 md:w-2/4 h-fit">
      <h2 className="text-xl font-semibold">Account Information</h2>
      <div className="flex flex-col items-center md:items-start md:flex-row md:space-x-8 space-y-6 md:space-y-0">
        <div className="relative group w-fit flex-shrink-0">
          {isImageLoading ? (
            <div className="w-40 h-40 rounded-full flex items-center justify-center bg-gray-100">
              <FaSpinner className="animate-spin text-3xl text-gray-400" />
            </div>
          ) : (
            <img
              src={profileImageUrl || placeholderImage}
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover border-4 border-gray-200 shadow-sm"
              onError={(e) => (e.currentTarget.src = placeholderImage)}
            />
          )}
          <button
            onClick={toggleModal}
            className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Edit profile picture"
          >
            <img src={editIcon} className="w-6 h-6" alt="Edit" />
          </button>
        </div>

        {isModalVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">
                  Update Profile Picture
                </h3>
                <button
                  onClick={toggleModal}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Close modal"
                >
                  <IoClose size={24} />
                </button>
              </div>
              <label
                htmlFor="profilePicInput"
                className="block mb-4 cursor-pointer"
              >
                <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-500 transition-colors bg-gray-50">
                  {tempImageUrl ? (
                    <img
                      src={tempImageUrl}
                      alt="Preview"
                      className="h-full w-full object-contain rounded-lg p-1"
                    />
                  ) : (
                    <>
                      <IoFileTray className="text-gray-400 text-4xl mb-2" />
                      <p className="text-gray-600 font-medium">
                        Click or drag to upload
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG, GIF up to 2MB
                      </p>
                    </>
                  )}
                </div>
                <input
                  id="profilePicInput"
                  type="file"
                  accept="image/png, image/jpeg, image/gif"
                  onChange={handleProfilePicChange}
                  className="hidden"
                />
              </label>
              <div className="text-xs text-gray-600 space-y-2 mb-6 p-3 bg-gray-50 rounded-md">
                <p className="font-semibold">Image Requirements:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Clear, well-lit (min. 400x400px recommended)</li>
                  <li>Face clearly visible, centered</li>
                  <li>Plain background preferred</li>
                  <li>Max file size: 2MB</li>
                </ul>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={toggleModal}
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProfilePicUpload}
                  type="button"
                  disabled={!tempImageUrl || isUploading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-950 rounded-md hover:bg-blue-800 disabled:opacity-60"
                >
                  {isUploading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    "Upload"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="w-full space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              label="First Name"
              variant="outlined"
              name="firstName"
              value={profile.firstName || ""}
              onChange={handleChange}
              size="small"
              fullWidth
            />
            <TextField
              label="Last Name"
              variant="outlined"
              name="lastName"
              value={profile.lastName || ""}
              onChange={handleChange}
              size="small"
              fullWidth
            />
          </div>
          <TextField
            label="Email"
            variant="outlined"
            name="email"
            type="email"
            value={profile.email || ""}
            onChange={handleChange}
            size="small"
            fullWidth
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            label="Phone Number"
            variant="outlined"
            name="phoneNumber"
            value={profile.phoneNumber || ""}
            size="small"
            fullWidth
            disabled={true}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
            InputProps={{
              startAdornment: (
                <img
                  src={flag}
                  alt="Country flag"
                  className="w-5 h-4 mr-2 opacity-70"
                />
              ),
            }}
          />
          <TextField
            label="Address"
            variant="outlined"
            name="address"
            value={profile.address || ""}
            onChange={handleChange}
            size="small"
            fullWidth
            multiline
            minRows={2}
          />
          <TextField
            label="City"
            variant="outlined"
            name="city"
            value={profile.city || ""}
            onChange={handleChange}
            size="small"
            fullWidth
          />

          {/* NEW: Added Field for ID Number */}
          <TextField
            label="Fayda / ID Number"
            variant="outlined"
            name="idNumber"
            value={profile.idNumber || ""}
            onChange={handleChange}
            size="small"
            fullWidth
          />

          {/* NEW: Added Field for User Type */}
          <FormControl fullWidth size="small">
            <InputLabel>Account Type</InputLabel>
            <Select
              label="Account Type"
              name="userType"
              value={profile.userType || ""}
              onChange={handleChange}
            >
              <MenuItem value="rent">I want to rent cars (Renter)</MenuItem>
              <MenuItem value="list">I want to list my car (Owner)</MenuItem>
              <MenuItem value="both">Both</MenuItem>
            </Select>
          </FormControl>

          <button
            onClick={handleUpdate}
            disabled={isUpdatingProfileDetails}
            type="button"
            className="w-full bg-blue-950 text-white py-2.5 rounded-md hover:bg-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center font-medium"
          >
            {isUpdatingProfileDetails ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              "Update Profile"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountInformation;
