import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import imageCompression from "browser-image-compression";

// Helper function to compress images
const compressImage = async (file) => {
  const options = {
    maxSizeMB: 0.5, // Maximum size in MB
    maxWidthOrHeight: 1024, // Maximum width or height
    useWebWorker: true, // Use a web worker for better performance
  };
  return await imageCompression(file, options);
};

// Helper function to convert file to base64 (Used for image previews)
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Define the initial state of the vehicle data form
const initialVehicleData = {
  // --- NEW: Service Type & Driver Pricing Fields ---
  serviceType: "self-drive", // Defaults to "self-drive" for existing vehicles
  driverPrice: "", // Daily price for driver, string to support empty input
  driverMaxHours: 8, // Default max hours for driver
  driverHours: "8:00 AM - 6:00 PM", // Default working hours string
  driverWorkingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"], // Default working days

  // --- Existing Fields ---
  advanceNoticePeriod: "",
  unavailableDates: [], // Store array of ISO date strings for unavailable dates
  carFeatures: [],
  instantBooking: false,
  price: "", // Already a string
  city: "",
  category: "",
  make: "",
  otherMake: "",
  model: "",
  year: "",
  vehicleNumber: "",
  doors: "",
  fuelType: "",
  seats: "",
  color: "",
  transmission: "",
  modelSpecification: "",
  isPostedByOwner: "", // MODIFIED: Start as empty to force a choice
  representativeFirstName: "",
  representativeLastName: "",
  representativePhone: "",
  representativeEmail: "",
  vehicleImageKeys: [],
  adminDocumentKeys: [],
  powerOfAttorney: null, // NEW: Added for representative uploads
  id: "",
  location: [],
  mileage: "",
  pickUp: [],
  dropOff: [],
  plateRegion: "",
  insuranceReference: "", // --- NEW: Added for Bolo reference number ---
};

// Define the initial state for uploaded photos (temporary previews)
const initialUploadedPhotos = {
  front: null,
  back: null,
  left: null,
  right: null,
  "Front Interior": null,
  "Back Interior": null,
  additional: [],
};

// Define the initial state for uploaded documents (temporary previews)
const initialUploadedDocuments = {
  libre: null,
  license: null,
  insurance: null,
};

const generateUniqueId = () => {
  return `vehicle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const useVehicleFormStore = create(
  persist(
    (set, get) => ({
      vehicleData: { ...initialVehicleData, id: generateUniqueId() },
      uploadedPhotos: { ...initialUploadedPhotos },
      uploadedDocuments: { ...initialUploadedDocuments },
      uploadedPowerOfAttorney: null, // NEW: State for Power of Attorney UI preview

      // --- Token Refresh Logic --- (UNCHANGED)
      refreshAccessToken: async () => {
        const storedUser = localStorage.getItem("customer");
        const user = storedUser ? JSON.parse(storedUser) : null;
        const refreshToken = user?.RefreshToken;

        if (!refreshToken) {
          console.error("No refresh token available.");
          throw new Error("Refresh token is missing");
        }

        try {
          const refreshResponse = await fetch(
            "https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/auth/update_refresh_token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ refreshToken: refreshToken }),
            }
          );

          if (!refreshResponse.ok) {
            console.error(
              "Failed to refresh access token:",
              refreshResponse.status,
              await refreshResponse.text()
            );
            localStorage.removeItem("customer");
            throw new Error("Failed to refresh access token");
          }

          const refreshedTokens = await refreshResponse.json();
          const updatedUser = { ...user, ...refreshedTokens };
          localStorage.setItem("customer", JSON.stringify(updatedUser));
          return refreshedTokens.accessToken;
        } catch (error) {
          console.error("Error during token refresh:", error);
          throw error;
        }
      },
      // --- Other functions (uploadImageForEditing, apiCallWithRetry, etc.) are unchanged ---
      uploadImageForEditing: async (vehicleId, file) => {
        try {
          if (!vehicleId) {
            throw new Error("Vehicle ID is required for image upload.");
          }

          // Get all necessary helper functions from the store's instance
          const {
            getPresignedUrl,
            uploadToPreSignedUrl,
            compressImage,
            fileToBase64,
          } = get();

          // 1. Get Presigned URL for the new file
          const preSignedData = await getPresignedUrl(
            vehicleId,
            file.name,
            file.type,
            "getPresignedUrl"
          );
          const newImageS3Key = preSignedData.key;

          // 2. Compress and Upload the new file
          const compressedFile = await compressImage(file);
          await uploadToPreSignedUrl(
            preSignedData.url,
            compressedFile,
            file.type
          );

          // 3. Get base64 for instant preview, just like in Step2.js
          const base64 = await fileToBase64(compressedFile);

          // 4. Return all necessary info to the calling component
          return { success: true, newKey: newImageS3Key, base64: base64 };
        } catch (error) {
          console.error("Error in uploadImageForEditing:", error);
          // Re-throw the error so the component can catch it
          throw error;
        }
      },
      // Function to make API calls with automatic token refresh (UNCHANGED)
      apiCallWithRetry: async (url, options, retryCount = 0) => {
        const storedUser = localStorage.getItem("customer");
        const user = storedUser ? JSON.parse(storedUser) : null;
        let accessToken = user?.AccessToken;

        if (!accessToken) {
          throw new Error(
            "Access token is missing. User might not be logged in."
          );
        }

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          ...options.headers,
        };

        try {
          const response = await fetch(url, { ...options, headers });

          if (response.status === 401 || response.status === 403) {
            if (retryCount < 1) {
              const newAccessToken = await get().refreshAccessToken();
              if (newAccessToken) {
                return get().apiCallWithRetry(url, options, retryCount + 1);
              }
            }
            throw new Error("Unauthorized or token expired and refresh failed");
          }

          if (!response.ok) {
            const errorText = await response.text();
            console.error(
              "API Error:",
              response.status,
              errorText,
              `URL: ${url}`,
              `Options: ${JSON.stringify(options)}`
            );
            throw new Error(
              `HTTP error! status: ${response.status}, message: ${errorText}`
            );
          }

          return await response.json();
        } catch (error) {
          console.error(
            "API call failed:",
            error,
            `URL: ${url}`,
            `Options: ${JSON.stringify(options)}`
          );
          throw error;
        }
      },

      // Action to update vehicle data (UNCHANGED)
      updateVehicleData: (newData) => {
        set((state) => ({
          vehicleData: { ...state.vehicleData, ...newData },
        }));
      },

      // --- All file upload/delete/update actions remain unchanged ---
      getPresignedUrl: async (vehicleId, filename, contentType, operation) => {
        const url =
          "https://xo55y7ogyj.execute-api.us-east-1.amazonaws.com/prod/add_vehicle";

        const options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operation,
            vehicleId,
            filename,
            contentType,
          }),
        };

        try {
          const data = await get().apiCallWithRetry(url, options);
          console.log("Presigned URL data:", data);
          if (!data || !data.body || !data.body.url || !data.body.key) {
            throw new Error("Invalid presigned URL response structure");
          }
          return { url: data.body.url, key: data.body.key };
        } catch (error) {
          console.error("Error fetching presigned URL:", error);
          throw error;
        }
      },

      uploadToPreSignedUrl: async (preSignedUrl, file, contentType) => {
        try {
          const response = await fetch(preSignedUrl, {
            method: "PUT",
            headers: { "Content-Type": contentType },
            body: file,
          });
          if (!response.ok) {
            const errorText = await response.text();
            console.error(
              "Error uploading file to presigned URL:",
              response.status,
              errorText
            );
            throw new Error(
              `File upload failed: ${response.status} ${errorText}`
            );
          }
          console.log("Upload successful to presigned URL.");
          return true;
        } catch (error) {
          console.error("Error uploading to presigned URL:", error);
          throw error;
        }
      },

      uploadVehicleImage: async (file, key) => {
        try {
          const vehicleId = get().vehicleData.id;
          if (!vehicleId) {
            throw new Error("Vehicle ID is not set. Cannot upload image.");
          }

          const filename = file.name;
          const contentType = file.type;

          const preSignedData = await get().getPresignedUrl(
            vehicleId,
            filename,
            contentType,
            "getPresignedUrl"
          );
          const preSignedUrl = preSignedData.url;
          const imageS3Key = preSignedData.key;

          const compressedFile = await compressImage(file);

          await get().uploadToPreSignedUrl(
            preSignedUrl,
            compressedFile,
            contentType
          );

          const base64 = await fileToBase64(compressedFile);

          set((state) => ({
            vehicleData: {
              ...state.vehicleData,
              vehicleImageKeys: [
                ...state.vehicleData.vehicleImageKeys,
                { key: imageS3Key },
              ],
            },
            uploadedPhotos: {
              ...state.uploadedPhotos,
              [key]:
                key === "additional"
                  ? [
                      ...state.uploadedPhotos.additional,
                      { base64: base64, key: imageS3Key },
                    ]
                  : { base64: base64, key: imageS3Key },
            },
          }));
        } catch (error) {
          console.error("Error uploading vehicle image:", error);
          throw error;
        }
      },

      uploadAdminDocument: async (file, key) => {
        try {
          const vehicleId = get().vehicleData.id;
          if (!vehicleId) {
            throw new Error("Vehicle ID is not set. Cannot upload document.");
          }

          const filename = file.name;
          const contentType = file.type;

          const preSignedData = await get().getPresignedUrl(
            vehicleId,
            filename,
            contentType,
            "getPresignedUrl"
          );
          const preSignedUrl = preSignedData.url;
          const documentS3Key = preSignedData.key;

          await get().uploadToPreSignedUrl(preSignedUrl, file, contentType);

          set((state) => ({
            vehicleData: {
              ...state.vehicleData,
              adminDocumentKeys: [
                ...state.vehicleData.adminDocumentKeys,
                { key: documentS3Key },
              ],
            },
            uploadedDocuments: {
              ...state.uploadedDocuments,
              [key]: { name: file.name, size: file.size, key: documentS3Key },
            },
          }));
        } catch (error) {
          console.error("Error uploading admin document:", error);
          throw error;
        }
      },

      deleteVehicleImage: (key, imageS3Key) => {
        set((state) => {
          const updatedPhotos = { ...state.uploadedPhotos };
          const updatedVehicleImageKeys =
            state.vehicleData.vehicleImageKeys.filter(
              (k) => k.key !== imageS3Key
            );

          if (key === "additional") {
            updatedPhotos.additional = updatedPhotos.additional.filter(
              (img) => img.key !== imageS3Key
            );
          } else {
            if (updatedPhotos[key]?.key === imageS3Key) {
              updatedPhotos[key] = null;
            }
          }

          return {
            vehicleData: {
              ...state.vehicleData,
              vehicleImageKeys: updatedVehicleImageKeys,
            },
            uploadedPhotos: updatedPhotos,
          };
        });
      },

      deleteAdminDocument: (key, documentS3Key) => {
        set((state) => {
          const updatedDocuments = { ...state.uploadedDocuments };
          const updatedAdminDocumentKeys =
            state.vehicleData.adminDocumentKeys.filter(
              (k) => k.key !== documentS3Key
            );

          if (updatedDocuments[key]?.key === documentS3Key) {
            updatedDocuments[key] = null;
          }

          return {
            vehicleData: {
              ...state.vehicleData,
              adminDocumentKeys: updatedAdminDocumentKeys,
            },
            uploadedDocuments: updatedDocuments,
          };
        });
      },

      updateVehicleImage: async (file, key, oldImageS3Key) => {
        try {
          const vehicleId = get().vehicleData.id;
          if (!vehicleId)
            throw new Error("Vehicle ID is not set. Cannot update image.");

          const filename = file.name;
          const contentType = file.type;

          const preSignedData = await get().getPresignedUrl(
            vehicleId,
            filename,
            contentType,
            "getPresignedUrl"
          );
          const preSignedUrl = preSignedData.url;
          const newImageS3Key = preSignedData.key;

          const compressedFile = await compressImage(file);

          await get().uploadToPreSignedUrl(
            preSignedUrl,
            compressedFile,
            contentType
          );

          const base64 = await fileToBase64(compressedFile);

          set((state) => {
            const updatedPhotos = { ...state.uploadedPhotos };
            const updatedVehicleImageKeys =
              state.vehicleData.vehicleImageKeys.filter(
                (k) => k.key !== oldImageS3Key
              );

            if (key === "additional") {
              updatedPhotos.additional = updatedPhotos.additional.map((img) =>
                img.key === oldImageS3Key
                  ? { base64: base64, key: newImageS3Key }
                  : img
              );
            } else {
              updatedPhotos[key] = { base64: base64, key: newImageS3Key };
            }

            return {
              vehicleData: {
                ...state.vehicleData,
                vehicleImageKeys: [
                  ...updatedVehicleImageKeys,
                  { key: newImageS3Key },
                ],
              },
              uploadedPhotos: updatedPhotos,
            };
          });
        } catch (error) {
          console.error("Error updating vehicle image:", error);
          throw error;
        }
      },

      updateAdminDocument: async (file, key, oldDocumentS3Key) => {
        try {
          const vehicleId = get().vehicleData.id;
          if (!vehicleId)
            throw new Error("Vehicle ID is not set. Cannot update document.");

          const filename = file.name;
          const contentType = file.type;

          const preSignedData = await get().getPresignedUrl(
            vehicleId,
            filename,
            contentType,
            "getPresignedUrl"
          );
          const preSignedUrl = preSignedData.url;
          const newDocumentS3Key = preSignedData.key;

          await get().uploadToPreSignedUrl(preSignedUrl, file, contentType);

          set((state) => {
            const updatedDocuments = { ...state.uploadedDocuments };
            const updatedAdminDocumentKeys =
              state.vehicleData.adminDocumentKeys.filter(
                (k) => k.key !== oldDocumentS3Key
              );

            updatedDocuments[key] = {
              name: file.name,
              size: file.size,
              key: newDocumentS3Key,
            };

            return {
              vehicleData: {
                ...state.vehicleData,
                adminDocumentKeys: [
                  ...updatedAdminDocumentKeys,
                  { key: newDocumentS3Key },
                ],
              },
              uploadedDocuments: updatedDocuments,
            };
          });
        } catch (error) {
          console.error("Error updating admin document:", error);
          throw error;
        }
      },

      uploadPowerOfAttorney: async (file) => {
        try {
          const vehicleId = get().vehicleData.id;
          if (!vehicleId) throw new Error("Vehicle ID is not set.");

          const preSignedData = await get().getPresignedUrl(
            vehicleId,
            file.name,
            file.type,
            "getPresignedUrl"
          );

          await get().uploadToPreSignedUrl(preSignedData.url, file, file.type);

          const poaObject = {
            key: preSignedData.key,
            url: preSignedData.url.split("?")[0],
            fileName: file.name,
            fileSize: file.size,
            uploadedAt: new Date().toISOString(),
          };

          set({
            vehicleData: {
              ...get().vehicleData,
              powerOfAttorney: poaObject,
            },
            uploadedPowerOfAttorney: {
              name: file.name,
              key: preSignedData.key,
            },
          });
        } catch (error) {
          console.error("Error uploading Power of Attorney:", error);
          throw error;
        }
      },

      deletePowerOfAttorney: () => {
        set({
          vehicleData: {
            ...get().vehicleData,
            powerOfAttorney: null,
          },
          uploadedPowerOfAttorney: null,
        });
      },

      updatePowerOfAttorney: async (file) => {
        await get().uploadPowerOfAttorney(file);
      },

      submitVehicleListing: async () => {
        const vehicleData = get().vehicleData;

        // Location transformation (UNCHANGED)
        const transformedPickUp = Array.isArray(vehicleData.pickUp)
          ? vehicleData.pickUp.map((loc) => [
              loc.position.lat,
              loc.position.lng,
            ])
          : [];
        const transformedDropOff = Array.isArray(vehicleData.dropOff)
          ? vehicleData.dropOff.map((loc) => [
              loc.position.lat,
              loc.position.lng,
            ])
          : [];

        // Prepare incoming data for the API request
        const incomingData = {
          // Existing data fields
          city: vehicleData.city || "string",
          category: vehicleData.category || "string",
          make: vehicleData.make || "string",
          mileage: vehicleData.mileage || "string",
          unavailableDates: vehicleData.unavailableDates || [],
          carFeatures: vehicleData.carFeatures || [],
          advanceNoticePeriod: vehicleData.advanceNoticePeriod || "string",
          instantBooking: vehicleData.instantBooking || false,
          price:
            typeof vehicleData.price === "number"
              ? String(vehicleData.price)
              : vehicleData.price || "string",
          pickUp: transformedPickUp,
          dropOff: transformedDropOff,
          otherMake: vehicleData.otherMake || "string",
          model: vehicleData.model || "string",
          year: vehicleData.year || "string",
          vehicleNumber: vehicleData.vehicleNumber || "string",
          doors: vehicleData.doors || "string",
          fuelType: vehicleData.fuelType || "string",
          seats: vehicleData.seats || "string",
          color: vehicleData.color || "string",
          id: vehicleData.id || "string",
          transmission: vehicleData.transmission || "string",
          modelSpecification: vehicleData.modelSpecification || "string",
          isPostedByOwner: vehicleData.isPostedByOwner || "false",
          representativeFirstName: vehicleData.representativeFirstName,
          representativeLastName: vehicleData.representativeLastName,
          representativePhone: vehicleData.representativePhone,
          representativeEmail: vehicleData.representativeEmail,
          powerOfAttorney: vehicleData.powerOfAttorney,
          vehicleImageKeys: vehicleData.vehicleImageKeys || [],
          adminDocumentKeys: vehicleData.adminDocumentKeys || [],
          location:
            Array.isArray(vehicleData.location) &&
            vehicleData.location.length > 0
              ? vehicleData.location
              : [0, 0],
          plateRegion: vehicleData.plateRegion || "",
          insuranceReference: vehicleData.insuranceReference || "", // --- NEW: Added field ---

          // --- Service type and driver fields ---
          serviceType: vehicleData.serviceType,
          driverPrice: vehicleData.driverPrice
            ? parseInt(vehicleData.driverPrice, 10)
            : null,
          driverMaxHours: vehicleData.driverMaxHours
            ? parseInt(vehicleData.driverMaxHours, 10)
            : null,
          driverHours: vehicleData.driverHours,
          driverWorkingDays: vehicleData.driverWorkingDays,
        };

        // Conditionally clear representative data if owner is posting (UNCHANGED)
        if (incomingData.isPostedByOwner === "true") {
          incomingData.representativeFirstName = "";
          incomingData.representativeLastName = "";
          incomingData.representativePhone = "";
          incomingData.representativeEmail = "";
          incomingData.powerOfAttorney = null;
        }

        if (incomingData.serviceType === "self-drive") {
          incomingData.driverPrice = null;
          incomingData.driverMaxHours = null;
          incomingData.driverHours = "";
          incomingData.driverWorkingDays = [];
        }

        console.log("Submitting vehicle data:", incomingData);

        try {
          const responseData = await get().apiCallWithRetry(
            "https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/vehicle",
            {
              method: "POST",
              body: JSON.stringify(incomingData),
            }
          );

          console.log("Vehicle listing submitted successfully:", responseData);

          return responseData;
        } catch (error) {
          console.error("Failed to submit vehicle listing:", error);
          throw error;
        }
      },

      resetStore: () => {
        set({
          vehicleData: { ...initialVehicleData, id: generateUniqueId() },
          uploadedPhotos: { ...initialUploadedPhotos },
          uploadedDocuments: { ...initialUploadedDocuments },
          uploadedPowerOfAttorney: null,
        });
      },
    }),
    {
      name: "vehicle-form-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        vehicleData: state.vehicleData,
        uploadedPhotos: state.uploadedPhotos,
        uploadedDocuments: state.uploadedDocuments,
        uploadedPowerOfAttorney: state.uploadedPowerOfAttorney,
      }),
    }
  )
);

export default useVehicleFormStore;
