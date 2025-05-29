import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { IoFileTray } from "react-icons/io5";
import LibraryAddOutlined from "@mui/icons-material/LibraryAddOutlined";
// import { useNavigate } from "react-router-dom"; // navigate is not used, remove import
import useVehicleFormStore from "../../store/useVehicleFormStore";

const Step2 = ({ nextStep, prevStep }) => {
  // const navigate = useNavigate(); // Remove if not navigating imperatively here
  const {
    vehicleData, // Keep if needed later, though not used in current render/logic
    uploadedPhotos,
    uploadedDocuments,
    uploadVehicleImage,
    uploadAdminDocument,
    deleteVehicleImage,
    deleteAdminDocument,
    updateVehicleImage,
    updateAdminDocument,
  } = useVehicleFormStore();

  // Local state for UI rendering (Keep these as they seem linked to your UI logic)
  const [localUploadedPhotos, setLocalUploadedPhotos] =
    useState(uploadedPhotos);
  const [localUploadedDocuments, setLocalUploadedDocuments] =
    useState(uploadedDocuments);

  // Sync local state with central state
  useEffect(() => {
    setLocalUploadedPhotos(uploadedPhotos);
  }, [uploadedPhotos]);

  useEffect(() => {
    setLocalUploadedDocuments(uploadedDocuments);
  }, [uploadedDocuments]);

  // --- Validation Logic ---
  // Define required keys
  const requiredPhotoKeys = [
    "front",
    "back",
    "left",
    "right",
    "Front Interior",
    "Back Interior",
  ];
  const requiredDocumentKeys = ["libre", "license", "insurance"];

  // Check if all required files are uploaded
  const isFormValid = React.useMemo(() => {
    // Check required photos: ensure each required key exists and has a base64 preview
    const allRequiredPhotosUploaded = requiredPhotoKeys.every(
      (key) => uploadedPhotos[key]?.base64 // Check if the object exists AND has the base64 property
    );

    // Check required documents: ensure each required key exists and has a name (or base64 if storing that)
    const allRequiredDocumentsUploaded = requiredDocumentKeys.every(
      (key) => uploadedDocuments[key]?.name // Check if the object exists AND has the name property
      // Or if you store base64 for docs too: uploadedDocuments[key]?.base64
    );

    // Form is valid only if BOTH all required photos and all required documents are uploaded
    return allRequiredPhotosUploaded && allRequiredDocumentsUploaded;
  }, [uploadedPhotos, uploadedDocuments]); // Recalculate when uploadedPhotos or uploadedDocuments change

  // Handle image upload
  const handlePhotoUpload = async (e, key) => {
    const files = Array.from(e.target.files);
    // If key is one of the single upload keys, ensure only one file is processed
    const filesToProcess =
      requiredPhotoKeys.includes(key) && files.length > 0 ? [files[0]] : files;

    if (filesToProcess.length === 0) return;

    for (const file of filesToProcess) {
      await uploadVehicleImage(file, key);
    }
    // Clear the input value so uploading the same file again triggers onChange
    e.target.value = null;
  };

  // Handle document upload
  const handleDocumentUpload = async (e, key) => {
    const file = e.target.files[0];
    if (file) {
      await uploadAdminDocument(file, key);
    }
    // Clear the input value
    e.target.value = null;
  };

  // Handle image deletion
  const handleDeletePhoto = (key, imageKey) => {
    // Prevent deletion of required photos if it would make the form invalid?
    // Or just allow deletion and disable the button? Let's allow deletion.
    deleteVehicleImage(key, imageKey);
  };

  // Handle document deletion
  const handleDeleteDocument = (key, documentKey) => {
    // Allow deletion
    deleteAdminDocument(key, documentKey);
  };

  // Handle image edit (same as upload, just replacing)
  const handleEditPhoto = async (e, key, oldImageKey) => {
    const file = e.target.files[0];
    if (file) {
      await updateVehicleImage(file, key, oldImageKey);
    }
    // Clear the input value
    e.target.value = null;
  };

  // Handle document edit (same as upload, just replacing)
  const handleEditDocument = async (e, key, oldDocumentKey) => {
    const file = e.target.files[0];
    if (file) {
      await updateAdminDocument(file, key, oldDocumentKey);
    }
    // Clear the input value
    e.target.value = null;
  };

  // Render image preview using base64 data
  const renderImagePreview = (base64, alt) => {
    return (
      <img
        src={base64}
        alt={alt}
        className="h-full w-full object-cover rounded-lg"
      />
    );
  };

  // Handler for the continue button - only proceeds if form is valid
  const handleContinueClick = () => {
    if (isFormValid) {
      nextStep();
      // console.log("Step 2 Validated. Proceeding.");
    } else {
      console.log("Step 2 is not valid. Please upload all required files.");
      // Optional: Provide user feedback here (e.g., highlight missing fields)
    }
  };

  return (
    <div className="flex gap-10 bg-[#F8F8FF]">
      <div className="mx-auto p-8 md:w-2/3 w-full bg-white rounded-2xl shadow-sm">
        {/* Progress Bar */}
        <div className="flex items-center justify-center">
          <div className="w-2/5 border-b-4 border-[#00113D] mr-2"></div>
          <div className="w-3/5 border-b-4 border-blue-200"></div>
        </div>

        {/* Heading */}
        <div className="flex justify-between w-full">
          <div className="flex flex-col w-1/2 items-start">
            <p className="text-xl text-gray-800 my-4 font-medium text-center mb-4">
              Steps 2 of 5
            </p>
          </div>
        </div>

        {/* Photos Section */}
        <div className="mb-10">
          <h2 className="text-3xl font-semibold my-8">Upload Photos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {requiredPhotoKeys.map(
              (
                key // Map over requiredPhotoKeys
              ) => (
                <div
                  key={key}
                  // Add conditional border color for required fields when missing
                  className={`relative border-2 border-dashed rounded-lg h-16 md:h-32 group
                           ${
                             localUploadedPhotos[key]?.base64
                               ? "border-gray-300 bg-white"
                               : " bg-gray-50"
                           }
                          `}
                >
                  {localUploadedPhotos[key]?.base64 ? (
                    <>
                      {renderImagePreview(localUploadedPhotos[key].base64, key)}
                      {/* Overlay with Edit/Delete */}
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                        <label className="cursor-pointer mx-2">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleEditPhoto(
                                e,
                                key,
                                localUploadedPhotos[key].key
                              )
                            }
                          />
                          {/* Edit Icon (optional, based on comment) */}
                          {/* <FaEdit className="text-white text-xl hover:text-blue-300" /> */}
                        </label>
                        <FaTrash
                          className="text-white text-xl cursor-pointer mx-2 hover:text-red-500"
                          onClick={() =>
                            handleDeletePhoto(key, localUploadedPhotos[key].key)
                          }
                        />
                      </div>
                    </>
                  ) : (
                    <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePhotoUpload(e, key)}
                      />
                      <div className="text-gray-500 text-base">
                        <div className="flex items-center justify-center">
                          <div className="bg-gray-200 py-2 mx-2 rounded-lg px-4">
                            <IoFileTray size={14} />
                          </div>
                          <p
                            className={`text-sm ${
                              localUploadedPhotos[key]?.base64
                                ? "text-gray-400"
                                : ""
                            }`}
                          >
                            {key} <span className="text-red-500">*</span>
                          </p>
                        </div>
                      </div>
                    </label>
                  )}
                </div>
              )
            )}

            {/* Additional Images - This section remains optional */}
            <div className="relative rounded-lg h-16 md:h-32 flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 bg-gray-50">
              {" "}
              {/* Added border/bg for consistency */}
              <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  multiple
                  onChange={(e) => handlePhotoUpload(e, "additional")}
                />
                <div className="text-gray-500 text-xl">
                  <span className="flex items-center justify-center text-sm">
                    <LibraryAddOutlined
                      style={{ fontSize: 20 }}
                      className="mr-2"
                    />
                    Additional Images (Optional)
                  </span>
                </div>
              </label>
            </div>

            {/* Display Additional Images */}
            {localUploadedPhotos.additional &&
              localUploadedPhotos.additional.map((img, idx) => (
                <div
                  key={img.key || idx} // Use img.key if available, fallback to idx
                  className="relative border-2 border-dashed border-gray-300 rounded-lg h-40 group"
                >
                  {renderImagePreview(img.base64, `additional-${idx}`)}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                    <label className="cursor-pointer mx-2">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleEditPhoto(e, "additional", img.key)
                        }
                      />
                    </label>
                    <FaTrash
                      className="text-white text-xl cursor-pointer mx-2 hover:text-red-500"
                      onClick={() => handleDeletePhoto("additional", img.key)}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Documents Section */}
        <div className="md:mb-0 mb-8">
          <h2 className="text-3xl font-semibold mb-8 mt-16">
            Upload Documents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requiredDocumentKeys.map(
              (
                key // Map over requiredDocumentKeys
              ) => (
                <div
                  key={key}
                  className="flex md:flex-row flex-col justify-center items-center w-full"
                >
                  <div
                    className={`text-gray-700 w-full md:w-72 mb-4 md:mb-0 mx-4 md:text-base text-lg font-medium capitalize ${
                      localUploadedDocuments[key]?.name ? "" : ""
                    }`}
                  >
                    {key} Document <span className="text-red-500">*</span>{" "}
                    {/* Added asterisk */}
                  </div>
                  <div
                    className={`relative border-2 border-dashed p-4 rounded-lg flex items-center justify-center cursor-pointer group w-full
                             ${
                               localUploadedDocuments[key]?.name
                                 ? "border-gray-300 bg-white"
                                 : " bg-gray-50"
                             }
                            `}
                    // Click handler only triggers file input if document is NOT uploaded
                    onClick={() =>
                      !localUploadedDocuments[key]?.name && // Only trigger if no document is uploaded for this key
                      document.getElementById(`upload-${key}-doc`).click()
                    }
                  >
                    {/* Input hidden, triggered by div click */}
                    <input
                      id={`upload-${key}-doc`}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => handleDocumentUpload(e, key)}
                      // No `required` prop here, we handle validation manually
                    />
                    {localUploadedDocuments[key]?.name ? (
                      <>
                        <div className="text-blue-500 underline truncate">
                          {" "}
                          {/* Added truncate */}
                          {localUploadedDocuments[key].name}
                        </div>
                        {/* Overlay with Edit/Delete */}
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                          <label className="cursor-pointer mx-2">
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              className="hidden"
                              onChange={(e) =>
                                handleEditDocument(
                                  e,
                                  key,
                                  localUploadedDocuments[key].key
                                )
                              }
                            />
                            {/* Edit Icon (optional) */}
                            {/* <FaEdit className="text-white text-xl hover:text-blue-300" /> */}
                          </label>
                          <FaTrash
                            className="text-white text-xl cursor-pointer mx-2 hover:text-red-500"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent triggering the parent div's click
                              handleDeleteDocument(
                                key,
                                localUploadedDocuments[key].key
                              );
                            }}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-500 flex items-center justify-center text-sm">
                        <div className="bg-gray-200 py-2 mx-2 rounded-lg px-4">
                          <IoFileTray size={14} />
                        </div>
                        <span className="text-blue-500 underline mr-2">
                          Click here
                        </span>
                        to upload
                      </div>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="w-full justify-between items-end gap-4 flex-col md:flex-row flex">
          <button
            onClick={prevStep}
            className="md:w-fit w-full text-black text-base rounded-full px-16 py-2 md:my-16 transition bg-white border hover:bg-blue-200"
            // The Back button is never disabled
          >
            Back
          </button>
          <button
            onClick={handleContinueClick} // Use the validation handler
            className={`
              md:w-fit w-full text-white text-base rounded-full px-16 py-2 md:my-16
              transition
              ${
                isFormValid
                  ? "bg-[#00113D] hover:bg-blue-900 cursor-pointer" // Enabled styles
                  : "bg-gray-400 cursor-not-allowed opacity-70" // Disabled styles
              }
            `}
            disabled={!isFormValid} // Disable the button based on validation
          >
            Continue
          </button>
        </div>
      </div>
      <div className="p-8 w-1/4 hidden md:flex font-light bg-blue-200 py-10 h-fit">
        Please upload clear pictures of the car. Make sure you have at least 6
        images covering all corners. Also, upload the required vehicle
        documents.
      </div>
    </div>
  );
};

export default Step2;
