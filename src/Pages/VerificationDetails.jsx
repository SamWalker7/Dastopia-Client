import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import {
  FaSpinner,
  FaCheck,
  FaRedo,
  FaExclamationTriangle,
} from "react-icons/fa";
import { getDownloadUrl } from "../api"; // Assuming getDownloadUrl is in the parent directory

const VerificationDetails = ({ user2, setUser }) => {
  const webcamRef = useRef(null);
  const [images, setImages] = useState({
    selfie: null,
    frontDriver: null,
    backDriver: null,
  });
  const [verificationKeys, setVerificationKeys] = useState({
    selfie:
      user2?.userAttributes?.find((attr) => attr.Name === "custom:selfie_key")
        ?.Value || null,
    frontDriver:
      user2?.userAttributes?.find(
        (attr) => attr.Name === "custom:frontDriver_key"
      )?.Value || null,
    backDriver:
      user2?.userAttributes?.find(
        (attr) => attr.Name === "custom:backDriver_key"
      )?.Value || null,
  });
  const [imageUrls, setImageUrls] = useState({
    selfie: null,
    frontDriver: null,
    backDriver: null,
  });
  const [loading, setLoading] = useState({
    selfie: false,
    frontDriver: false,
    backDriver: false,
  });
  const [uploading, setUploading] = useState({
    selfie: false,
    frontDriver: false,
    backDriver: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loadingError, setLoadingError] = useState({
    selfie: null,
    frontDriver: null,
    backDriver: null,
  });

  const fetchImageUrl = async (type) => {
    const key = verificationKeys[type];
    if (!key) return null;
    setLoading((prev) => ({ ...prev, [type]: true }));
    setLoadingError((prev) => ({ ...prev, [type]: null }));
    try {
      console.log(`Workspaceing URL for ${type}:`, key);
      const path = await getDownloadUrl(key);
      return path?.body || null;
    } catch (error) {
      console.error(`Error fetching ${type} URL:`, error);
      setLoadingError((prev) => ({ ...prev, [type]: "Failed to load image." }));
      return null;
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const refreshAllImageUrls = async () => {
    const newUrls = {};
    await Promise.all(
      ["selfie", "frontDriver", "backDriver"].map(async (type) => {
        const url = await fetchImageUrl(type);
        if (url) {
          newUrls[type] = url;
        } else {
          newUrls[type] = null;
        }
      })
    );
    setImageUrls(newUrls);
  };

  useEffect(() => {
    refreshAllImageUrls();
  }, [verificationKeys]);

  const updateVerificationKeys = async (newKeys) => {
    const updatedAttributes = [
      ...user2.userAttributes.filter(
        (attr) =>
          ![
            "custom:selfie_key",
            "custom:front_driver_key",
            "custom:back_driver_key",
          ].includes(attr.Name)
      ),
      ...Object.entries(newKeys)
        .filter(([_, value]) => value !== null)
        .map(([type, value]) => ({
          Name: `custom:${type}_key`,
          Value: value,
        })),
    ];

    const updatedUser = {
      ...user2,
      userAttributes: updatedAttributes,
    };

    localStorage.setItem("customer", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setVerificationKeys(newKeys);
  };

  const captureSelfie = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImages((prev) => ({ ...prev, selfie: imageSrc }));
    }
  };

  const handleFileChange = (type) => async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImages((prev) => ({ ...prev, [type]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const retakeImage = (type) => {
    setImages((prev) => ({ ...prev, [type]: null }));
  };

  const uploadFile = async (type) => {
    const userId = user2?.userAttributes?.find(
      (attr) => attr.Name === "sub"
    )?.Value;
    if (!userId) return;

    setUploading((prev) => ({ ...prev, [type]: true }));

    try {
      let file;
      if (type === "selfie") {
        const blob = await fetch(images[type]).then((r) => r.blob());
        file = new File([blob], `selfie-${Date.now()}.jpeg`, {
          type: "image/jpeg",
        });
      } else {
        file = await fetch(images[type]).then((r) => r.blob());
        file = new File([file], `${type}-${Date.now()}.jpeg`, {
          type: "image/jpeg",
        });
      }

      const token = JSON.parse(localStorage.getItem("customer"));
      const response = await fetch(
        `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/account/get_account_presigned_url/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.AccessToken}`,
          },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
            fileType: type,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to get upload URL");
      const responseData = await response.json();
      const { url, key } = responseData.body;

      const uploadResponse = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadResponse.ok) throw new Error("Upload failed");

      await updateVerificationKeys({
        ...verificationKeys,
        [type]: key,
      });

      // Refresh the URL immediately after upload
      const freshUrl = await getDownloadUrl(key);
      console.log("Fresh URL for", type, ":", freshUrl);
      setImageUrls((prev) => ({ ...prev, [type]: freshUrl }));
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      throw error;
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const submitAllDocuments = async () => {
    try {
      const uploadPromises = [];
      const types = ["selfie", "frontDriver", "backDriver"];

      for (const type of types) {
        if (images[type] && !verificationKeys[type]) {
          uploadPromises.push(uploadFile(type));
        }
      }

      await Promise.all(uploadPromises);

      const updatedAttributes = [
        ...user2.userAttributes.filter(
          (attr) => attr.Name !== "custom:verification_submitted"
        ),
        { Name: "custom:verification_submitted", Value: "true" },
      ];

      const updatedUser = {
        ...user2,
        userAttributes: updatedAttributes,
      };

      localStorage.setItem("customer", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSubmitted(true);
      alert("Verification documents submitted successfully!");
    } catch (error) {
      console.error("Error submitting documents:", error);
      alert(`Submission failed: ${error.message}`);
    }
  };

  const allDocumentsReady = ["selfie", "frontDriver", "backDriver"].every(
    (type) => verificationKeys[type]
  );

  const renderImage = (type) => {
    if (loading[type]) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <FaSpinner className="animate-spin text-2xl text-gray-400" />
        </div>
      );
    }

    if (loadingError[type]) {
      return (
        <div className="w-full h-full flex items-center justify-center text-red-500">
          <FaExclamationTriangle className="mr-2" />
          {loadingError[type]}
        </div>
      );
    }

    if (imageUrls[type]) {
      return (
        <img
          src={imageUrls[type]}
          alt={
            type === "selfie"
              ? "Saved Selfie"
              : `${type === "frontDriver" ? "Front" : "Back"} License`
          }
          className={`w-full h-full ${
            type === "selfie" ? "object-cover" : "object-contain"
          }`}
        />
      );
    }

    if (images[type]) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <span className="text-gray-500">Upload image.</span>
        </div>
      );
    }

    return type === "selfie" ? (
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="w-full h-full object-cover"
        videoConstraints={{ facingMode: "user" }}
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        No image selected
      </div>
    );
  };

  return (
    <div className="p-6 bg-white md:w-1/3 flex flex-col shadow-lg rounded-lg space-y-6">
      <h2 className="text-lg font-semibold">Verification Details</h2>

      <div className="space-y-2">
        <h3 className="text-md font-medium">Live Selfie</h3>
        <div className="relative w-full h-48 border rounded-md overflow-hidden bg-gray-100">
          {renderImage("selfie")}
        </div>
        <div className="flex space-x-2">
          {/* "Capture Selfie" button is always visible in the selfie section */}
          <button
            onClick={captureSelfie}
            className="bg-blue-950 text-white rounded-md px-4 py-2 text-sm"
          >
            Capture Selfie
          </button>
          {images.selfie && (
            <>
              {verificationKeys.selfie ? (
                <div className="flex items-center text-green-600">
                  <FaCheck className="mr-1" />
                  <span>Uploaded</span>
                </div>
              ) : (
                <button
                  onClick={() => uploadFile("selfie")}
                  disabled={uploading.selfie}
                  className="bg-blue-950 text-white rounded-md px-4 py-2 text-sm flex items-center"
                >
                  {uploading.selfie ? (
                    <FaSpinner className="animate-spin mr-2" />
                  ) : null}
                  {uploading.selfie ? "Uploading..." : "Upload Selfie"}
                </button>
              )}
              <button
                onClick={() => retakeImage("selfie")}
                className="bg-gray-200 text-gray-800 rounded-md px-4 py-2 text-sm flex items-center"
              >
                <FaRedo className="mr-1" />
                Retake
              </button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-md font-medium">Driver's License</h3>

        {["frontDriver", "backDriver"].map((type) => (
          <div key={type} className="space-y-2">
            <label className="block text-sm font-medium">
              {type === "frontDriver" ? "Front" : "Back"}
            </label>
            <div className="relative w-full h-32 border rounded-md overflow-hidden bg-gray-100">
              {renderImage(type)}
            </div>
            <div className="flex space-x-2">
              {!images[type] ? (
                <>
                  <input
                    type="file"
                    id={type}
                    accept="image/*"
                    onChange={handleFileChange(type)}
                    className="hidden"
                  />
                  <label
                    htmlFor={type}
                    className="bg-blue-950 text-white rounded-md px-4 py-2 text-sm cursor-pointer"
                  >
                    Select {type === "frontDriver" ? "Front" : "Back"}
                  </label>
                </>
              ) : (
                <>
                  {verificationKeys[type] ? (
                    <div className="flex items-center text-green-600">
                      <FaCheck className="mr-1" />
                      <span>Uploaded</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => uploadFile(type)}
                      disabled={uploading[type]}
                      className="bg-blue-950 text-white rounded-md px-4 py-2 text-sm flex items-center"
                    >
                      {uploading[type] ? (
                        <FaSpinner className="animate-spin mr-2" />
                      ) : null}
                      {uploading[type] ? "Uploading..." : "Upload"}
                    </button>
                  )}
                  <button
                    onClick={() => retakeImage(type)}
                    className="bg-gray-200 text-gray-800 rounded-md px-4 py-2 text-sm flex items-center"
                  >
                    <FaRedo className="mr-1" />
                    Replace
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={submitAllDocuments}
        disabled={!allDocumentsReady || submitted}
        className={`mt-4 py-2 px-4 rounded-md text-white ${
          allDocumentsReady && !submitted
            ? "bg-green-600 hover:bg-green-700"
            : "bg-gray-400 cursor-not-allowed"
        } flex items-center justify-center`}
      >
        {submitted ? (
          <>
            <FaCheck className="mr-2" />
            Submitted
          </>
        ) : (
          "Submit Verification"
        )}
      </button>

      {!allDocumentsReady && !submitted && (
        <p className="text-sm text-red-500">
          Please upload all required documents before submitting
        </p>
      )}
    </div>
  );
};

export default VerificationDetails;
