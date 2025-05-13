import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { IoFileTray, IoClose } from "react-icons/io5"; // Added IoClose
import { TextField } from "@mui/material";
import placeholderImage from "../images/testimonials/avatar.png";
import editIcon from "../images/hero/editIcon.png";
import flag from "../images/hero/image.png";
// getDownloadUrl is not used in this component, it's used in the parent
// import { getDownloadUrl } from "../api";

const AccountInformation = ({
  profile,
  // setProfile, // setProfile is not directly used here; updates go via handleChange and handleUpdate
  errors,
  handleChange,
  handleUpdate,
  user2,
  onProfilePicUploaded,
  profileImageUrl,
  isImageLoading,
  isUpdatingProfileDetails, // New prop for parent-driven loading state
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProfilePicFile, setSelectedProfilePicFile] = useState(null);
  const [tempImageUrl, setTempImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    if (isModalVisible) {
      // Reset when closing
      setSelectedProfilePicFile(null);
      setTempImageUrl("");
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        alert("File size should be less than 2MB.");
        e.target.value = null; // Reset file input
        return;
      }
      setSelectedProfilePicFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        // Use onloadend for safety
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

      if (!presignedResponse.ok) {
        const errorData = await presignedResponse.json().catch(() => ({})); // Try to parse error
        console.error(
          "Failed to get upload URL:",
          presignedResponse.status,
          errorData
        );
        throw new Error(
          `Failed to get upload URL. Status: ${presignedResponse.status}`
        );
      }

      const responseData = await presignedResponse.json();
      let parsedBody;
      if (typeof responseData.body === "string") {
        try {
          parsedBody = JSON.parse(responseData.body);
        } catch (e) {
          console.error(
            "Failed to parse responseData.body string:",
            e,
            responseData.body
          );
          throw new Error(
            "Invalid response format from presigned URL endpoint."
          );
        }
      } else {
        parsedBody = responseData.body;
      }

      if (!parsedBody || !parsedBody.url || !parsedBody.key) {
        console.error("Presigned URL or key missing in response:", parsedBody);
        throw new Error(
          "Presigned URL or key missing in response from server."
        );
      }
      const { url, key } = parsedBody;

      // Step 2: Upload to S3
      const uploadResponse = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": contentType,
        },
        body: selectedProfilePicFile,
      });

      if (!uploadResponse.ok) {
        console.error(
          "S3 Upload failed:",
          uploadResponse.status,
          await uploadResponse.text()
        );
        throw new Error(`Upload failed. Status: ${uploadResponse.status}`);
      }

      // Step 3: Update user profile with new key
      onProfilePicUploaded(key); // Notify parent
      toggleModal(); // Close modal on success
      // alert("Profile picture uploaded successfully!"); // Optional: Parent can handle success message
    } catch (error) {
      console.error("Profile picture upload error:", error);
      alert(
        `Failed to upload profile picture: ${error.message}. Please try again.`
      );
    } finally {
      setIsUploading(false);
      // setSelectedProfilePicFile(null); // Reset by toggleModal or if modal stays open
      // setTempImageUrl("");
    }
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg space-y-6 md:w-2/4 h-fit">
      <h2 className="text-xl font-semibold">Account Information</h2>

      <div className="flex flex-col items-center md:items-start md:flex-row md:space-x-8 space-y-6 md:space-y-0">
        {/* Profile Picture Section */}
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
              onError={(e) => (e.currentTarget.src = placeholderImage)} // Fallback for broken profileImageUrl
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

        {/* Profile Picture Upload Modal */}
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
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProfilePicUpload}
                  type="button"
                  disabled={!tempImageUrl || isUploading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-950 rounded-md hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
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

        {/* Profile Form Fields */}
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

          <div className="relative">
            <TextField
              label="Phone Number"
              variant="outlined"
              name="phoneNumber"
              value={profile.phoneNumber || ""}
              // onChange={handleChange} // Kept disabled as per original, but if editable, enable this
              size="small"
              fullWidth
              disabled={true} // Assuming phone number is not editable here or verified elsewhere
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
          </div>

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
