import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { IoFileTray } from "react-icons/io5";
import LibraryAddOutlined from "@mui/icons-material/LibraryAddOutlined";
import { useNavigate } from "react-router-dom";
import useVehicleFormStore from "../../store/useVehicleFormStore";

const Step2 = ({ nextStep, prevStep }) => {
  const navigate = useNavigate();
  const {
    vehicleData,
    uploadedPhotos,
    uploadedDocuments,
    uploadVehicleImage,
    uploadAdminDocument,
    deleteVehicleImage,
    deleteAdminDocument,
    updateVehicleImage,
    updateAdminDocument,
  } = useVehicleFormStore();

  // Local state for UI rendering
  const [localUploadedPhotos, setLocalUploadedPhotos] =
    useState(uploadedPhotos);
  const [localUploadedDocuments, setLocalUploadedDocuments] =
    useState(uploadedDocuments);

  // Sync local state with central state
  useEffect(() => {
    setLocalUploadedPhotos(uploadedPhotos);
    setLocalUploadedDocuments(uploadedDocuments);
  }, [uploadedPhotos, uploadedDocuments]);

  // Handle image upload
  const handlePhotoUpload = async (e, key) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    for (const file of files) {
      await uploadVehicleImage(file, key);
    }
  };

  // Handle document upload
  const handleDocumentUpload = async (e, key) => {
    const file = e.target.files[0];
    if (file) {
      await uploadAdminDocument(file, key);
    }
  };

  // Handle image deletion
  const handleDeletePhoto = (key, imageKey) => {
    deleteVehicleImage(key, imageKey);
  };

  // Handle document deletion
  const handleDeleteDocument = (key, documentKey) => {
    deleteAdminDocument(key, documentKey);
  };

  // Handle image edit
  const handleEditPhoto = async (e, key, oldImageKey) => {
    const file = e.target.files[0];
    if (file) {
      await updateVehicleImage(file, key, oldImageKey);
    }
  };

  // Handle document edit
  const handleEditDocument = async (e, key, oldDocumentKey) => {
    const file = e.target.files[0];
    if (file) {
      await updateAdminDocument(file, key, oldDocumentKey);
    }
  };

  // Proceed to next step
  const handleNext = () => {
    console.log("Final vehicle data:", vehicleData);
  };

  return (
    <div className="flex gap-10 bg-[#F8F8FF] md:p-40">
      <div className="mx-auto p-16 w-full bg-white rounded-2xl shadow-sm">
        {/* Photos Section */}
        <div className="mb-10">
          <h2 className="text-4xl font-semibold my-8">Upload Photos</h2>
          <div className="grid grid-cols-3 gap-6">
            {["front", "back", "left", "right", "interior"].map((key) => (
              <div
                key={key}
                className="relative border-2 border-dashed border-gray-300 rounded-lg h-40 group"
              >
                {localUploadedPhotos[key]?.url ? (
                  <>
                    <img
                      src={localUploadedPhotos[key].url}
                      alt={key}
                      className="h-full w-full object-cover rounded-lg"
                    />
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
                        <FaEdit className="text-white text-xl hover:text-blue-300" />
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
                          <IoFileTray size={16} />
                        </div>
                        <p className="text-gray-400 mt-2">
                          {key.charAt(0).toUpperCase() + key.slice(1)} of the
                          car
                        </p>
                      </div>
                    </div>
                  </label>
                )}
              </div>
            ))}

            {/* Additional Images */}
            <div className="relative rounded-lg h-40 flex items-center justify-center cursor-pointer">
              <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  multiple
                  onChange={(e) => handlePhotoUpload(e, "additional")}
                />
                <div className="text-gray-500 text-xl">
                  <span className="flex items-center justify-center">
                    <LibraryAddOutlined
                      style={{ fontSize: 20 }}
                      className="mr-2"
                    />
                    Additional Images
                  </span>
                </div>
              </label>
            </div>

            {localUploadedPhotos.additional.map((img, idx) => (
              <div
                key={idx}
                className="relative border-2 border-dashed border-gray-300 rounded-lg h-40 group"
              >
                <img
                  src={img.url}
                  alt={`additional-${idx}`}
                  className="h-full w-full object-cover rounded-lg"
                />
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
                    <FaEdit className="text-white text-xl hover:text-blue-300" />
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
        <div className="mb-10">
          <h2 className="text-4xl font-semibold my-16">Upload Documents</h2>
          <div className="grid grid-cols-2 gap-6">
            {["libre", "license", "insurance"].map((key) => (
              <div
                key={key}
                className="flex justify-center items-center w-full"
              >
                <div className="text-gray-700 w-72 mx-4 text-lg font-medium capitalize">
                  {key} Document
                </div>
                <div
                  className="relative border-2 border-dashed p-4 border-gray-300 rounded-lg flex items-center justify-center cursor-pointer group w-full"
                  onClick={() =>
                    !localUploadedDocuments[key] &&
                    document.getElementById(`upload-${key}-doc`).click()
                  }
                >
                  <input
                    id={`upload-${key}-doc`}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => handleDocumentUpload(e, key)}
                  />
                  {localUploadedDocuments[key]?.name ? (
                    <>
                      <div className="text-blue-500 underline">
                        {localUploadedDocuments[key].name}
                      </div>
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
                          <FaEdit className="text-white text-xl hover:text-blue-300" />
                        </label>
                        <FaTrash
                          className="text-white text-xl cursor-pointer mx-2 hover:text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDocument(
                              key,
                              localUploadedDocuments[key].key
                            );
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-500 flex items-center justify-center text-base">
                      <div className="bg-gray-200 py-2 mx-2 rounded-lg px-4">
                        <IoFileTray size={16} />
                      </div>
                      <span className="text-blue-500 underline mr-2">
                        Click here
                      </span>
                      to upload
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="w-full justify-between items-end flex">
          <button
            onClick={prevStep}
            className="min-w-2xl text-black text-xl rounded-full px-32 py-4 my-16 font-normal transition bg-white border hover:bg-blue-200"
          >
            Back
          </button>
          <button
            onClick={nextStep}
            className="min-w-2xl text-white text-xl rounded-full px-32 py-4 my-16 font-normal transition bg-[#00113D] hover:bg-blue-900"
          >
            Continue
          </button>
        </div>
      </div>
      <div className="p-8 w-1/4 bg-blue-200 py-10 h-fit">
        Please upload clear pictures of the car. Make sure you have at least 4
        images covering all corners.
      </div>
    </div>
  );
};

export default Step2;
