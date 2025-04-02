import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import {
  FaSpinner,
  FaCheck,
  FaRedo,
  FaExclamationTriangle,
} from "react-icons/fa";
import { getDownloadUrl } from "../api";

const VerificationDetails = ({ setUser }) => {
  const webcamRef = useRef(null);
  const [hasWebcamAccess, setHasWebcamAccess] = useState(false);
  const [images, setImages] = useState({
    selfie_key: null,
    idFrontImage: null,
    idBackImage: null,
  });
  const [verificationKeys, setVerificationKeys] = useState({
    selfie_key: null,
    idFrontImage: null,
    idBackImage: null,
  });
  const [imageUrls, setImageUrls] = useState({
    selfie_key: null,
    idFrontImage: null,
    idBackImage: null,
  });
  const [loading, setLoading] = useState({
    selfie_key: false,
    idFrontImage: false,
    idBackImage: false,
  });
  const [uploading, setUploading] = useState({
    selfie_key: false,
    idFrontImage: false,
    idBackImage: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loadingError, setLoadingError] = useState({
    selfie_key: null,
    idFrontImage: null,
    idBackImage: null,
  });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [updatingKeys, setUpdatingKeys] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [veriSubmittedBackend, setVeriSubmittedBackend] = useState(false);

  const token = JSON.parse(localStorage.getItem("customer"));
  const customer = JSON.parse(localStorage.getItem("customer"));
  const USER_ID =
    customer?.userAttributes?.find((attr) => attr.Name === "sub")?.Value || "";

  useEffect(() => {
    const fetchProfile = async () => {
      setLoadingProfile(true);
      try {
        const response = await fetch(
          "https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/account/get_profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token?.AccessToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data?.success && data?.data?.formattedProfile) {
            const formattedProfile = data.data.formattedProfile;
            setVerificationKeys({
              selfie_key: formattedProfile.selfie_key,
              idFrontImage: formattedProfile.idFrontImage,
              idBackImage: formattedProfile.idBackImage,
            });
            setVeriSubmittedBackend(
              formattedProfile.veri_submitted === true ||
                formattedProfile.veri_submitted === "true"
            );
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    if (token?.AccessToken) fetchProfile();
  }, [token?.AccessToken]);

  const fetchImageUrl = async (type) => {
    const key = verificationKeys[type];
    if (!key) return null;
    setLoading((prev) => ({ ...prev, [type]: true }));
    setLoadingError((prev) => ({ ...prev, [type]: null }));
    try {
      const path = await getDownloadUrl(key);
      return path?.body || null;
    } catch (error) {
      setLoadingError((prev) => ({ ...prev, [type]: "Failed to load image." }));
      return null;
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  useEffect(() => {
    const refreshUrls = async () => {
      const newUrls = {};
      for (const type of ["selfie_key", "idFrontImage", "idBackImage"]) {
        newUrls[type] = await fetchImageUrl(type);
      }
      setImageUrls(newUrls);
    };
    refreshUrls();
  }, [verificationKeys]);

  const updateVerificationKeys = async (newKeys) => {
    setVerificationKeys(newKeys);

    if (!USER_ID) return;

    setUpdatingKeys(true);

    try {
      const attributeMap = {
        selfie_key: "selfie_key",
        idFrontImage: "custom:id_front_key",
        idBackImage: "custom:id_back_key",
      };

      const updatedAttributes = Object.entries(newKeys)
        .filter(([_, value]) => value !== null)
        .reduce((acc, [type, value]) => {
          acc[attributeMap[type] || `custom:${type}`] = value;
          return acc;
        }, {}); // Creating an object instead of an array

      console.log("Updated attributes:", updatedAttributes);

      // Send each key-value pair separately
      for (const [key, value] of Object.entries(updatedAttributes)) {
        const response = await fetch(
          `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/account/update_profile/${USER_ID}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token?.AccessToken}`,
            },
            body: JSON.stringify({ [key]: value }), // Send only one key-value pair at a time
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`Update failed for ${key}:`, errorData);
          throw new Error(`Failed to update verification key: ${key}`);
        }

        const responseData = await response.json();
        if (responseData?.data?.formattedProfile) {
          setUser(responseData.data.formattedProfile);
        }
      }
    } catch (error) {
      console.error("Update error:", error);
      alert(`Update failed: ${error.message}`);
    } finally {
      setUpdatingKeys(false);
    }
  };

  const captureSelfie = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setImages((prev) => ({ ...prev, selfie_key: imageSrc }));
        setVerificationKeys((prev) => ({ ...prev, selfie_key: null }));
      }
    }
  };

  const handleFileChange = (type) => async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setVerificationKeys((prev) => ({ ...prev, [type]: null }));
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
    if (!USER_ID || !images[type]) return;
    setUploading((prev) => ({ ...prev, [type]: true }));
    try {
      const timestamp = Date.now();
      const filename = `${USER_ID}_${type}_${timestamp}.jpeg`;
      const blob = await fetch(images[type]).then((r) => r.blob());
      const file = new File([blob], filename, { type: "image/jpeg" });
      const uploadResponse = await fetch(
        `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/account/get_account_presigned_url/${USER_ID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token?.AccessToken}`,
          },
          body: JSON.stringify({
            filename: filename,
            contentType: file.type,
            fileType: type,
          }),
        }
      );
      if (!uploadResponse.ok) throw new Error("Failed to get upload URL");
      const { url, key } = await uploadResponse
        .json()
        .then((data) => data.body);
      const putResponse = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!putResponse.ok) throw new Error("Upload failed");
      const freshUrl = await getDownloadUrl(key);
      await updateVerificationKeys({ ...verificationKeys, [type]: key });
      setImageUrls((prev) => ({
        ...prev,
        [type]: `${freshUrl}?t=${Date.now()}`,
      }));
      setImages((prev) => ({ ...prev, [type]: null }));
    } catch (error) {
      setVerificationKeys((prev) => ({ ...prev, [type]: null }));
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const submitAllDocuments = async () => {
    setSubmitting(true);
    try {
      await Promise.all(
        ["selfie_key", "idFrontImage", "idBackImage"].map((type) =>
          images[type] ? uploadFile(type) : Promise.resolve()
        )
      );
      const response = await fetch(
        `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/account/update_profile/${USER_ID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token?.AccessToken}`,
          },
          body: JSON.stringify({ veri_submitted: "true" }),
        }
      );
      if (!response.ok) throw new Error("Submission failed");
      const responseData = await response.json();
      if (responseData?.data?.formattedProfile) {
        setUser(responseData.data.formattedProfile);
        setVeriSubmittedBackend(true);
      }
      setSubmitted(true);
    } catch (error) {
      alert(`Submission failed: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const allDocumentsReady = Object.values(verificationKeys).every(Boolean);

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
    if (images[type]) {
      return (
        <img
          src={images[type]}
          alt="Preview"
          className={`w-full h-full ${
            type === "selfie_key" ? "object-cover" : "object-contain"
          }`}
        />
      );
    }
    if (imageUrls[type]) {
      return (
        <img
          src={imageUrls[type]}
          alt="Uploaded"
          className={`w-full h-full ${
            type === "selfie_key" ? "object-cover" : "object-contain"
          }`}
        />
      );
    }
    return type === "selfie_key" ? (
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="w-full h-full object-cover"
        videoConstraints={{
          facingMode: "user",
          width: 1280,
          height: 720,
        }}
        onUserMedia={() => setHasWebcamAccess(true)}
        onUserMediaError={() => setHasWebcamAccess(false)}
        forceScreenshotSourceSize={true}
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        No image selected
      </div>
    );
  };

  if (loadingProfile) {
    return (
      <div className="p-6 bg-white md:w-1/3 flex flex-col shadow-lg rounded-lg space-y-6 items-center justify-center">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
        <span className="ml-2">Loading verification details...</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white md:w-1/3 flex flex-col shadow-lg rounded-lg space-y-6">
      {veriSubmittedBackend ? (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Account Verified!</strong>
        </div>
      ) : (
        <div
          className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Account not verified.</strong>
          <span className="block sm:inline">
            {" "}
            Please submit verification details to verify your account.
          </span>
        </div>
      )}

      <h2 className="text-lg font-semibold">Verification Details</h2>

      <div className="space-y-2">
        <h3 className="text-md font-medium">Live Selfie</h3>
        <div className="relative w-full h-48 border rounded-md overflow-hidden bg-gray-100">
          {renderImage("selfie_key")}
          {!hasWebcamAccess && (
            <div className="absolute inset-0 bg-red-100/90 flex items-center justify-center p-4 text-center">
              <FaExclamationTriangle className="text-red-500 mr-2" />
              Camera access required
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          {!veriSubmittedBackend && (
            <button
              onClick={captureSelfie}
              className="bg-blue-950 text-white rounded-md px-4 py-2 text-sm"
            >
              Capture Selfie
            </button>
          )}
          {images.selfie_key && !verificationKeys.selfie_key && (
            <button
              onClick={() => uploadFile("selfie_key")}
              disabled={uploading.selfie_key}
              className="bg-blue-950 text-white rounded-md px-4 py-2 text-sm flex items-center"
            >
              {uploading.selfie_key && (
                <FaSpinner className="animate-spin mr-2" />
              )}
              {uploading.selfie_key ? "Uploading..." : "Upload Selfie"}
            </button>
          )}
          {verificationKeys.selfie_key && (
            <div className="flex items-center text-green-600">
              <FaCheck className="mr-1" />
              <span>Uploaded</span>
            </div>
          )}
          {images.selfie_key && (
            <button
              onClick={() => retakeImage("selfie_key")}
              className="bg-gray-200 text-gray-800 rounded-md px-4 py-2 text-sm flex items-center"
            >
              <FaRedo className="mr-1" />
              Retake
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-md font-medium">Driver's License</h3>
        {["idFrontImage", "idBackImage"].map((type) => (
          <div key={type} className="space-y-2">
            <label className="block text-sm font-medium">
              {type === "idFrontImage" ? "Front" : "Back"}
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
                    disabled={veriSubmittedBackend}
                    onChange={handleFileChange(type)}
                    className="hidden"
                  />
                  <label
                    htmlFor={type}
                    className={
                      veriSubmittedBackend
                        ? " bg-gray-300 text-white rounded-md px-4 py-2 text-sm"
                        : "bg-blue-950 text-white rounded-md px-4 py-2 text-sm cursor-pointer"
                    }
                  >
                    {" "}
                    Select {type === "idFrontImage" ? "Front" : "Back"}
                  </label>
                </>
              ) : (
                <>
                  {!verificationKeys[type] && (
                    <button
                      onClick={() => uploadFile(type)}
                      disabled={uploading[type]}
                      className="bg-blue-950 text-white rounded-md px-4 py-2 text-sm flex items-center"
                    >
                      {uploading[type] && (
                        <FaSpinner className="animate-spin mr-2" />
                      )}
                      {uploading[type] ? "Uploading..." : "Upload"}
                    </button>
                  )}
                  {verificationKeys[type] && (
                    <div className="flex items-center text-green-600">
                      <FaCheck className="mr-1" />
                      <span>Uploaded</span>
                    </div>
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
        disabled={
          !allDocumentsReady || submitted || submitting || veriSubmittedBackend
        }
        className={`mt-4 py-2 px-4 rounded-md text-white ${
          allDocumentsReady && !submitted && !veriSubmittedBackend
            ? "bg-green-600 hover:bg-green-700"
            : "bg-gray-400 cursor-not-allowed"
        } flex items-center justify-center`}
      >
        {veriSubmittedBackend || submitted ? (
          <>
            <FaCheck className="mr-2" />
            Submitted
          </>
        ) : submitting ? (
          <>
            <FaSpinner className="animate-spin mr-2" />
            Submitting...
          </>
        ) : (
          "Submit Verification"
        )}
      </button>

      {!allDocumentsReady && !submitted && !veriSubmittedBackend && (
        <p className="text-sm text-red-500">
          Please upload all required documents before submitting
        </p>
      )}
    </div>
  );
};

export default VerificationDetails;
