import React, { useState, useEffect, useRef } from "react";
import audia1 from "../../images/cars-big/toyota-box.png";
import {
  FaTrash,
  FaSync,
  FaSpinner,
  FaPlus,
  FaCheckCircle,
  FaExclamationTriangle,
  // Other icons from your original file
  FaCogs,
  FaGasPump,
  FaTag,
  FaUserFriends,
} from "react-icons/fa";
import useVehicleFormStore from "../../store/useVehicleFormStore";
import { getDownloadUrl } from "../../api"; // **THE FIX: Using your provided function**
import imageCompression from "browser-image-compression";

// --- Helper functions for image processing, kept within the component file ---

const compressImage = async (file) => {
  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  };
  return imageCompression(file, options);
};

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * A robust, self-contained component for displaying and editing vehicle details.
 * It manages its own state and handles the entire image upload workflow internally.
 *
 * @param {{selectedVehicleId: string}} props - The component props.
 */
const Details = ({ selectedVehicleId }) => {
  // --- STATE MANAGEMENT ---

  // The single source of truth for all form data during editing.
  const [formData, setFormData] = useState(null);
  // The pristine, original data fetched from the server.
  const [originalVehicle, setOriginalVehicle] = useState(null);
  // A single state object for all UI flags.
  const [uiState, setUiState] = useState({
    isLoading: true,
    isEditing: false,
    isSaving: false,
    isUploading: false,
    fetchError: null,
    saveError: null,
    saveSuccess: "",
  });

  // --- HOOKS and REFS ---
  const { apiCallWithRetry } = useVehicleFormStore();
  const fileInputRef = useRef(null);
  const keyToReplaceRef = useRef(null);

  // --- DATA FETCHING ---
  useEffect(() => {
    if (!selectedVehicleId) {
      setUiState((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    const fetchDetails = async () => {
      setUiState((prev) => ({ ...prev, isLoading: true, fetchError: null }));
      try {
        const response = await apiCallWithRetry(
          `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/vehicle/${selectedVehicleId}`,
          { method: "GET" }
        );

        if (!response || !response.body) {
          throw new Error("Invalid data structure received from server.");
        }

        const fetchedData = response.body;

        // **THE FIX IS HERE: Correctly fetch download URLs using your function**
        const imagePromises = (fetchedData.vehicleImageKeys || []).map(
          async (key) => {
            try {
              // Using the imported `getDownloadUrl` function directly
              const urlResponse = await getDownloadUrl(key);
              return { s3Key: key, displayUrl: urlResponse?.body || audia1 };
            } catch (error) {
              console.error(
                `Failed to get download URL for key ${key}:`,
                error
              );
              return { s3Key: key, displayUrl: audia1 }; // Fallback on error
            }
          }
        );

        const images = await Promise.all(imagePromises);

        // **NEW**: Add status to form data, defaulting to 'active' if not provided
        const initialFormData = {
          ...fetchedData,
          images,
          status: fetchedData.status || "active",
        };

        setOriginalVehicle(initialFormData);
        setFormData(initialFormData);
      } catch (err) {
        setUiState((prev) => ({
          ...prev,
          fetchError: "Failed to fetch vehicle details.",
        }));
      } finally {
        setUiState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    fetchDetails();
    // `apiCallWithRetry` is stable, dependency is on `selectedVehicleId`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVehicleId]);

  // --- INTERNAL API HELPERS ---

  const getPresignedUrl = async (filename, contentType) => {
    const response = await apiCallWithRetry(
      "https://xo55y7ogyj.execute-api.us-east-1.amazonaws.com/prod/add_vehicle",
      {
        method: "POST",
        body: JSON.stringify({
          operation: "getPresignedUrl",
          vehicleId: selectedVehicleId,
          filename,
          contentType,
        }),
      }
    );
    if (!response?.body?.url || !response?.body?.key) {
      throw new Error("Failed to get a valid presigned URL.");
    }
    return response.body;
  };

  const uploadToS3 = async (presignedUrl, file, contentType) => {
    const response = await fetch(presignedUrl, {
      method: "PUT",
      headers: { "Content-Type": contentType },
      body: file,
    });
    if (!response.ok) {
      throw new Error("File upload to S3 failed.");
    }
  };

  // --- EVENT HANDLERS ---

  const handleStartEditing = () => {
    setUiState((prev) => ({
      ...prev,
      isEditing: true,
      saveError: null,
      saveSuccess: "",
    }));
  };

  const handleCancelEdit = () => {
    setUiState((prev) => ({ ...prev, isEditing: false }));
    // Reset form data to the pristine original version
    setFormData(originalVehicle);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleFeaturesChange = (e) => {
    const features = e.target.value
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, carFeatures: features }));
  };

  const triggerFileInput = (keyToReplace = null) => {
    keyToReplaceRef.current = keyToReplace;
    fileInputRef.current.click();
  };

  const handleFileSelected = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const oldS3Key = keyToReplaceRef.current;

    setUiState((prev) => ({ ...prev, isUploading: true, saveError: null }));

    try {
      const { url: presignedUrl, key: newS3Key } = await getPresignedUrl(
        file.name,
        file.type
      );
      const compressedFile = await compressImage(file);
      await uploadToS3(presignedUrl, compressedFile, file.type);
      const base64Preview = await fileToBase64(compressedFile);

      const newImageObject = { s3Key: newS3Key, displayUrl: base64Preview };

      setFormData((prev) => {
        const currentImages = prev.images || [];
        const updatedImages = oldS3Key
          ? currentImages.map((img) =>
              img.s3Key === oldS3Key ? newImageObject : img
            )
          : [...currentImages, newImageObject];
        return { ...prev, images: updatedImages };
      });
    } catch (error) {
      setUiState((prev) => ({
        ...prev,
        saveError: "Image upload failed. Please try again.",
      }));
    } finally {
      setUiState((prev) => ({ ...prev, isUploading: false }));
      event.target.value = null;
    }
  };

  const handleDeleteImage = (keyToDelete) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.s3Key !== keyToDelete),
    }));
  };

  const handleSaveChanges = async () => {
    setUiState((prev) => ({ ...prev, isSaving: true, saveError: null }));

    // Prepare main payload, excluding fields handled by other endpoints
    const payload = { ...formData };
    payload.vehicleImageKeys = formData.images.map((img) => img.s3Key);
    payload.vehichleNumber = formData.vehicleNumber;
    delete payload.images;
    delete payload.vehicleNumber;
    delete payload.status; // Status is handled by a separate endpoint

    try {
      // 1. Save main vehicle details
      await apiCallWithRetry(
        `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/vehicle/${selectedVehicleId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      // 2. Handle status change if necessary, using its dedicated endpoint
      if (formData.status !== originalVehicle.status) {
        const statusEndpoint =
          formData.status === "active"
            ? `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/vehicle/activate_status/${selectedVehicleId}`
            : `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/vehicle/deactivate_status/${selectedVehicleId}`;

        // This API call is a GET request as per the provided specification
        await apiCallWithRetry(statusEndpoint, { method: "GET" });
      }

      // 3. On full success, update the 'original' state and UI
      setOriginalVehicle(formData);
      setUiState((prev) => ({
        ...prev,
        isEditing: false,
        saveSuccess: "Vehicle updated successfully!",
      }));
      setTimeout(
        () => setUiState((prev) => ({ ...prev, saveSuccess: "" })),
        4000
      );
    } catch (err) {
      setUiState((prev) => ({
        ...prev,
        saveError: err.message || "An unexpected error occurred while saving.",
      }));
    } finally {
      setUiState((prev) => ({ ...prev, isSaving: false }));
    }
  };

  // --- RENDER LOGIC ---

  if (uiState.isLoading) {
    return (
      <div className="p-10 text-center">
        <FaSpinner className="animate-spin mr-2" /> Loading...
      </div>
    );
  }
  if (uiState.fetchError) {
    return (
      <div className="p-10 bg-red-100 text-red-700 rounded-md flex items-center gap-3">
        <FaExclamationTriangle /> {uiState.fetchError}
      </div>
    );
  }
  if (!formData) {
    return <div className="p-10">No vehicle data available.</div>;
  }

  const displayData = uiState.isEditing ? formData : originalVehicle;

  return (
    <div className="w-full">
      <div className="p-10 bg-white shadow-lg rounded-lg">
        {/* --- Header & Action Buttons --- */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Detail Listing</h1>
          <div className="flex space-x-2">
            {uiState.isEditing ? (
              <>
                <button
                  onClick={handleSaveChanges}
                  disabled={uiState.isSaving || uiState.isUploading}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 flex items-center gap-2"
                >
                  {uiState.isSaving ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaCheckCircle />
                  )}{" "}
                  {uiState.isSaving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={uiState.isSaving || uiState.isUploading}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 disabled:bg-gray-400"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleStartEditing}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Edit Details
              </button>
            )}
          </div>
        </div>

        {/* --- User Feedback Banners --- */}
        {uiState.saveSuccess && (
          <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4 text-sm flex items-center gap-2">
            <FaCheckCircle /> {uiState.saveSuccess}
          </div>
        )}
        {uiState.saveError && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm flex items-center gap-2">
            <FaExclamationTriangle /> {uiState.saveError}
          </div>
        )}

        {/* --- Reusable Hidden File Input --- */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileSelected}
          style={{ display: "none" }}
        />

        {/* --- Image Section --- */}
        <div className="flex lg:flex-row flex-col gap-4 w-full mb-8 relative">
          {uiState.isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md z-20">
              <FaSpinner className="animate-spin text-white text-4xl" />
            </div>
          )}

          <div className="w-full lg:w-1/2">
            <img
              src={displayData.images?.[0]?.displayUrl || audia1}
              alt="Main vehicle view"
              className="w-full h-auto object-cover rounded-md"
            />
          </div>

          <div className="w-full lg:w-1/2 grid grid-cols-2 md:grid-cols-3 gap-2 content-start">
            {displayData.images?.map((img) => (
              <div key={img.s3Key} className="relative group">
                <img
                  src={img.displayUrl}
                  alt="Thumbnail"
                  className="w-full h-24 object-cover rounded-md ring-1 ring-gray-200"
                />
                {uiState.isEditing && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity rounded-md z-10">
                    <button
                      onClick={() => triggerFileInput(img.s3Key)}
                      className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                      title="Change Image"
                    >
                      <FaSync />
                    </button>
                    <button
                      onClick={() => handleDeleteImage(img.s3Key)}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                      title="Delete Image"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
            ))}
            {uiState.isEditing && (
              <button
                onClick={() => triggerFileInput(null)}
                className="w-full h-24 border-2 border-dashed border-gray-400 rounded-md flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100"
              >
                <FaPlus size={24} />
                <span className="text-xs mt-1">Add Image</span>
              </button>
            )}
          </div>
        </div>

        {/* --- Form Fields --- */}
        <h4 className="mt-8 text-xl font-semibold">Car Specification</h4>
        <div className="grid lg:grid-cols-3 grid-cols-2 gap-4 mt-4">
          {/* ... existing fields from original code ... */}
          <div>
            <span className="text-gray-500">Make</span>
            {uiState.isEditing ? (
              <input
                type="text"
                name="make"
                value={formData.make}
                onChange={handleInputChange}
                className="font-medium p-1 border rounded w-full"
              />
            ) : (
              <p className="font-medium">{displayData.make}</p>
            )}
          </div>
          <div>
            <span className="text-gray-500">Model</span>
            {uiState.isEditing ? (
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                className="font-medium p-1 border rounded w-full"
              />
            ) : (
              <p className="font-medium">{displayData.model}</p>
            )}
          </div>
          <div>
            <span className="text-gray-500">Year</span>
            {uiState.isEditing ? (
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className="font-medium p-1 border rounded w-full"
              />
            ) : (
              <p className="font-medium">{displayData.year}</p>
            )}
          </div>
          <div>
            <span className="text-gray-500">Mileage</span>
            {uiState.isEditing ? (
              <input
                type="text"
                name="mileage"
                value={formData.mileage}
                onChange={handleInputChange}
                className="font-medium p-1 border rounded w-full"
              />
            ) : (
              <p className="font-medium">{displayData.mileage}</p>
            )}
          </div>
          <div>
            <span className="text-gray-500">Vehicle Number</span>
            {uiState.isEditing ? (
              <input
                type="text"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleInputChange}
                className="font-medium p-1 border rounded w-full"
              />
            ) : (
              <p className="font-medium">{displayData.vehicleNumber}</p>
            )}
          </div>
          <div>
            <span className="text-gray-500">Color</span>
            {uiState.isEditing ? (
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                className="font-medium p-1 border rounded w-full"
              />
            ) : (
              <p className="font-medium">{displayData.color}</p>
            )}
          </div>
          <div>
            <span className="text-gray-500">Seats</span>
            {uiState.isEditing ? (
              <input
                type="number"
                name="seats"
                value={formData.seats}
                onChange={handleInputChange}
                className="font-medium p-1 border rounded w-full"
              />
            ) : (
              <p className="font-medium">{displayData.seats}</p>
            )}
          </div>
          <div>
            <span className="text-gray-500">Fuel Type</span>
            {uiState.isEditing ? (
              <input
                type="text"
                name="fuelType"
                value={formData.fuelType}
                onChange={handleInputChange}
                className="font-medium p-1 border rounded w-full"
              />
            ) : (
              <p className="font-medium">{displayData.fuelType}</p>
            )}
          </div>
          <div>
            <span className="text-gray-500">Transmission</span>
            {uiState.isEditing ? (
              <input
                type="text"
                name="transmission"
                value={formData.transmission}
                onChange={handleInputChange}
                className="font-medium p-1 border rounded w-full"
              />
            ) : (
              <p className="font-medium">{displayData.transmission}</p>
            )}
          </div>
        </div>

        {/* --- NEW: Vehicle Status Section --- */}
        <section className="my-12">
          <h2 className="font-semibold text-lg mb-4">Vehicle Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-gray-500">Current Status</span>
              {uiState.isEditing ? (
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="font-medium p-2 border rounded w-full bg-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              ) : (
                <p
                  className={`font-medium flex items-center gap-2 capitalize ${
                    displayData.status === "active"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      displayData.status === "active"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  ></span>
                  {displayData.status}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="my-12">
          <h2 className="font-semibold text-lg mb-4">Features</h2>
          {uiState.isEditing ? (
            <textarea
              className="w-full p-2 border rounded"
              rows="3"
              placeholder="e.g., GPS, Sunroof, Bluetooth"
              value={(formData.carFeatures || []).join(", ")}
              onChange={handleFeaturesChange}
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {(displayData.carFeatures || []).map((feature, index) => (
                <span
                  key={index}
                  className="border border-gray-400 text-base px-3 py-1 rounded-xl"
                >
                  {feature}
                </span>
              ))}
            </div>
          )}
        </section>

        <section className="my-12">
          <h2 className="font-semibold text-lg mb-4">Booking & Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-gray-500">Price (Birr)</span>
              {uiState.isEditing ? (
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="font-medium p-1 border rounded w-full"
                />
              ) : (
                <p className="font-medium">{displayData.price}</p>
              )}
            </div>
            <div>
              <span className="text-gray-500">Notice Period</span>
              {uiState.isEditing ? (
                <input
                  type="text"
                  name="advanceNoticePeriod"
                  value={formData.advanceNoticePeriod}
                  onChange={handleInputChange}
                  className="font-medium p-1 border rounded w-full"
                />
              ) : (
                <p className="font-medium">{displayData.advanceNoticePeriod}</p>
              )}
            </div>
            <div className="flex items-center mt-4">
              {uiState.isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="instantBooking"
                    name="instantBooking"
                    checked={formData.instantBooking}
                    onChange={handleInputChange}
                    className="h-5 w-5"
                  />
                  <label htmlFor="instantBooking">Instant Booking</label>
                </div>
              ) : (
                <p className="font-medium">
                  {displayData.instantBooking
                    ? "Instant Booking Enabled"
                    : "Requires Approval"}
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Details;
