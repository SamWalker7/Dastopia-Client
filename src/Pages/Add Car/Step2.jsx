import Dropdown from "../../components/Search/Dropdown";
import makesData from "../../api/makes.json";
import modelsData from "../../api/models.json";
import { Button } from "@mui/material";
import React, { useState } from "react";
import { FaCar } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import { IoFileTray } from "react-icons/io5";
import { FaEdit, FaTrash } from "react-icons/fa";
import LibraryAddOutlined from "@mui/icons-material/LibraryAddOutlined";
import Footer from "../../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
const Step2 = () => {
  const [uploadedPhotos, setUploadedPhotos] = useState({
    front: null,
    back: null,
    left: null,
    right: null,
    interior: null,
    additional: [],
  });

  const location = useLocation();
  const navigate = useNavigate();
  const { millage,seats,manufacturedYear,fuelType,carType,transmissionType } = location.state || {};

  const [uploadedDocuments, setUploadedDocuments] = useState({
    libre: null,
    license: null,
    insurance: null,
  });
  console.log("the file is ",uploadedPhotos)
  console.log("the file is 2  ",uploadedDocuments)
  const handlePhotoUpload = (e, key) => {
    const files = Array.from(e.target.files);
    console.log("the file is ",files[0])
    if (files.length === 0) return;

    setUploadedPhotos((prev) => {
      if (key === "additional") {
        return {
          ...prev,
          additional: [
            ...prev.additional,
            ...files.map((file) => URL.createObjectURL(file)),
          ],
        };
      } else {
        return {
          ...prev,
          [key]: URL.createObjectURL(files[0]),
        };
      }
    });
  };

  const handleDocumentUpload = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedDocuments((prev) => ({ ...prev, [key]: file.name }));
    }
  };

  const handleDeletePhoto = (key, index = null) => {
    setUploadedPhotos((prev) => {
      if (key === "additional") {
        const newAdditional = [...prev.additional];
        newAdditional.splice(index, 1);
        return { ...prev, additional: newAdditional };
      }
      return { ...prev, [key]: null };
    });
  };

  const handleDeleteDocument = (key) => {
    setUploadedDocuments((prev) => ({ ...prev, [key]: null }));
  };
  const handleNext=()=>{
    navigate("/Step3",{state:{millage,seats,manufacturedYear,fuelType,carType,transmissionType,uploadedPhotos,uploadedDocuments}});
  }

  return (
    <div className="flex gap-10 bg-[#F8F8FF] md:p-40">
      <div className="mx-auto p-16 w-full bg-white rounded-2xl shadow-sm">
        <div>
          {/* Step Indicator and other unchanged code remains the same */}
          {/* Step Indicator */}
          <div className="flex items-center justify-center">
            <div className="w-2/5 border-b-4 border-[#00113D] mr-2"></div>
            <div className="w-3/5 border-b-4 border-blue-200"></div>
          </div>
          <div className="flex justify-between w-full">
            <div className="flex flex-col w-1/2 items-start">
              <p className="text-2xl text-gray-800 my-4 font-medium text-center mb-4">
                Steps 2 of 5
              </p>
            </div>
          </div>
          {/* Upload Photos */}
          <div className="mb-10">
            <h2 className="text-4xl font-semibold my-8">Upload Photos</h2>
            <div className="grid grid-cols-3 gap-6">
              {/* Photo Upload Slots */}
              {["front", "back", "left", "right", "interior"].map(
                (key, index) => (
                  <div
                    key={index}
                    className="relative border-2 border-dashed border-gray-300 rounded-lg h-40 group"
                  >
                    {uploadedPhotos[key] ? (
                      <>
                        <img
                          src={uploadedPhotos[key]}
                          alt={key}
                          className="h-full w-full object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                          <label className="cursor-pointer mx-2">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handlePhotoUpload(e, key)}
                            />
                            <FaEdit className="text-white text-xl hover:text-blue-300" />
                          </label>
                          <FaTrash
                            className="text-white text-xl cursor-pointer mx-2 hover:text-red-500"
                            onClick={() => handleDeletePhoto(key)}
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
                              {key.charAt(0).toUpperCase() + key.slice(1)} of
                              the car
                            </p>
                          </div>
                        </div>
                      </label>
                    )}
                  </div>
                )
              )}

              {/* Additional Images Slot */}
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
                        className="mr-2"
                        style={{ fontSize: 20 }}
                      />
                      Additional Images
                    </span>
                  </div>
                </label>
              </div>

              {/* Display Additional Images */}
              {uploadedPhotos.additional.map((src, idx) => (
                <div
                  key={idx}
                  className="relative border-2 border-dashed border-gray-300 rounded-lg h-40 group"
                >
                  <img
                    src={src}
                    alt={`additional-${idx}`}
                    className="h-full w-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                    <label className="cursor-pointer mx-2">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const files = Array.from(e.target.files);
                          if (files.length > 0) {
                            setUploadedPhotos((prev) => {
                              const newAdditional = [...prev.additional];
                              newAdditional[idx] = URL.createObjectURL(
                                files[0]
                              );
                              return { ...prev, additional: newAdditional };
                            });
                          }
                        }}
                      />
                      <FaEdit className="text-white text-xl hover:text-blue-300" />
                    </label>
                    <FaTrash
                      className="text-white text-xl cursor-pointer mx-2 hover:text-red-500"
                      onClick={() => handleDeletePhoto("additional", idx)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upload Documents */}
          <div className="mb-10">
            <h2 className="text-4xl font-semibold my-16">Upload Documents</h2>
            <div className="grid grid-cols-2 gap-6">
              {["libre", "license", "insurance"].map((key, index) => (
                <div
                  className="flex justify-center items-center w-full"
                  key={index}
                >
                  <div className="text-gray-700 w-72 mx-4 text-lg font-medium capitalize">
                    {key} Document
                  </div>
                  <div
                    className="relative border-2 border-dashed p-4 border-gray-300 rounded-lg flex items-center justify-center cursor-pointer group w-full"
                    onClick={() =>
                      !uploadedDocuments[key] &&
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
                    {uploadedDocuments[key] ? (
                      <>
                        <div className="text-blue-500 underline">
                          {uploadedDocuments[key]}
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                          <label
                            className="cursor-pointer mx-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              className="hidden"
                              onChange={(e) => handleDocumentUpload(e, key)}
                            />
                            <FaEdit className="text-white text-xl hover:text-blue-300" />
                          </label>
                          <FaTrash
                            className="text-white text-xl cursor-pointer mx-2 hover:text-red-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteDocument(key);
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
                        to upload or drop files here
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Buttons section remains the same */}
          {/* Buttons */}
          <div className="w-full justify-between items-end flex">
            <Link
              to="/addcar"
              className="min-w-2xl text-black text-xl rounded-full px-32 py-4 my-16 font-normal transition bg-white border hover:bg-blue-200"
            >
              Back
            </Link>
            <Link
              to="/Step3"
              className="min-w-2xl text-white text-xl rounded-full px-32 py-4 my-16 font-normal transition bg-[#00113D] hover:bg-blue-900"
            >
              Continue
            </Link>
          </div>
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
