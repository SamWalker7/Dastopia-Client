import { create } from "zustand";
import { persist } from "zustand/middleware"; // Import the persist middleware

// Helper function to generate a unique key
const generateUniqueKey = (file, context) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  return `mock-key-${context}-${file.name}-${timestamp}-${randomString}`;
};

// Simulating an image/document upload function
const uploadFile = async (file, context) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateUniqueKey(file, context));
    }, 1000);
  });
};

// Helper function to convert a file to a base64 string
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const useVehicleFormStore = create(
  persist(
    (set) => ({
      vehicleData: {
        advanceNoticePeriod: "",
        calendar: "",
        carFeatures: [],
        instantBooking: false, // Updated to boolean
        price: "",
        city: "",
        category: "",
        make: "",
        otherMake: "",
        model: "",
        year: "",
        vehichleNumber: "",
        doors: "",
        fuelType: "",
        seats: "",
        color: "",
        transmission: "",
        modelSpecification: "",
        isPostedByOwner: "",
        representativeFirstName: "",
        representativeLastName: "",
        representativePhone: "",
        representativeEmail: "",
        vehicleImageKeys: [],
        adminDocumentKeys: [],
        id: "",
        location: [], // Already an array
        mileage: "", // Added
        pickUpLocation: "", // Added
        dropOffLocation: "", // Added
      },
      uploadedPhotos: {
        front: null,
        back: null,
        left: null,
        right: null,
        interior: null,
        additional: [],
      },
      uploadedDocuments: {
        libre: null,
        license: null,
        insurance: null,
      },

      // Update general vehicle data
      updateVehicleData: (newData) => {
        set((state) => ({
          vehicleData: { ...state.vehicleData, ...newData },
        }));
      },

      // Upload a new vehicle image
      uploadVehicleImage: async (file, key) => {
        try {
          const imageKey = await uploadFile(file, `image-${key}`);
          const imageBase64 = await fileToBase64(file); // Convert file to base64
          set((state) => ({
            vehicleData: {
              ...state.vehicleData,
              vehicleImageKeys: [
                ...state.vehicleData.vehicleImageKeys,
                imageKey,
              ],
            },
            uploadedPhotos: {
              ...state.uploadedPhotos,
              [key]:
                key === "additional"
                  ? [
                      ...state.uploadedPhotos.additional,
                      { url: imageBase64, key: imageKey }, // Store base64 URL
                    ]
                  : { url: imageBase64, key: imageKey }, // Store base64 URL
            },
          }));
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      },

      // Upload a new admin document
      uploadAdminDocument: async (file, key) => {
        try {
          const documentKey = await uploadFile(file, `doc-${key}`);
          const documentBase64 = await fileToBase64(file); // Convert file to base64
          set((state) => ({
            vehicleData: {
              ...state.vehicleData,
              adminDocumentKeys: [
                ...state.vehicleData.adminDocumentKeys,
                documentKey,
              ],
            },
            uploadedDocuments: {
              ...state.uploadedDocuments,
              [key]: { name: file.name, key: documentKey, url: documentBase64 }, // Store base64 URL
            },
          }));
        } catch (error) {
          console.error("Error uploading document:", error);
        }
      },

      // Delete a specific vehicle image
      deleteVehicleImage: (key, imageKey) => {
        set((state) => {
          const updatedPhotos = { ...state.uploadedPhotos };
          const updatedVehicleImageKeys =
            state.vehicleData.vehicleImageKeys.filter((k) => k !== imageKey);

          if (key === "additional") {
            updatedPhotos.additional = updatedPhotos.additional.filter(
              (img) => img.key !== imageKey
            );
          } else {
            updatedPhotos[key] = null;
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

      // Delete a specific admin document
      deleteAdminDocument: (key, documentKey) => {
        set((state) => {
          const updatedDocuments = { ...state.uploadedDocuments };
          const updatedAdminDocumentKeys =
            state.vehicleData.adminDocumentKeys.filter(
              (k) => k !== documentKey
            );

          updatedDocuments[key] = null;

          return {
            vehicleData: {
              ...state.vehicleData,
              adminDocumentKeys: updatedAdminDocumentKeys,
            },
            uploadedDocuments: updatedDocuments,
          };
        });
      },

      // Update a specific vehicle image
      updateVehicleImage: async (file, key, oldImageKey) => {
        try {
          const newImageKey = await uploadFile(file, `image-${key}`);
          const newImageBase64 = await fileToBase64(file); // Convert file to base64
          set((state) => {
            const updatedPhotos = { ...state.uploadedPhotos };
            const updatedVehicleImageKeys =
              state.vehicleData.vehicleImageKeys.filter(
                (k) => k !== oldImageKey
              );

            if (key === "additional") {
              updatedPhotos.additional = updatedPhotos.additional.map((img) =>
                img.key === oldImageKey
                  ? { url: newImageBase64, key: newImageKey } // Store base64 URL
                  : img
              );
            } else {
              updatedPhotos[key] = { url: newImageBase64, key: newImageKey }; // Store base64 URL
            }

            return {
              vehicleData: {
                ...state.vehicleData,
                vehicleImageKeys: [...updatedVehicleImageKeys, newImageKey],
              },
              uploadedPhotos: updatedPhotos,
            };
          });
        } catch (error) {
          console.error("Error updating image:", error);
        }
      },

      // Update a specific admin document
      updateAdminDocument: async (file, key, oldDocumentKey) => {
        try {
          const newDocumentKey = await uploadFile(file, `doc-${key}`);
          const newDocumentBase64 = await fileToBase64(file); // Convert file to base64
          set((state) => {
            const updatedDocuments = { ...state.uploadedDocuments };
            const updatedAdminDocumentKeys =
              state.vehicleData.adminDocumentKeys.filter(
                (k) => k !== oldDocumentKey
              );

            updatedDocuments[key] = {
              name: file.name,
              key: newDocumentKey,
              url: newDocumentBase64,
            }; // Store base64 URL

            return {
              vehicleData: {
                ...state.vehicleData,
                adminDocumentKeys: [
                  ...updatedAdminDocumentKeys,
                  newDocumentKey,
                ],
              },
              uploadedDocuments: updatedDocuments,
            };
          });
        } catch (error) {
          console.error("Error updating document:", error);
        }
      },
    }),
    {
      name: "vehicle-form-store", // Unique name for the storage key
      getStorage: () => localStorage, // Use localStorage (or sessionStorage)
    }
  )
);

export default useVehicleFormStore;
