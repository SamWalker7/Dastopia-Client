import { create } from "zustand";

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

const useVehicleFormStore = create((set) => ({
  vehicleData: {
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
      const imageUrl = URL.createObjectURL(file);
      set((state) => ({
        vehicleData: {
          ...state.vehicleData,
          vehicleImageKeys: [...state.vehicleData.vehicleImageKeys, imageKey],
        },
        uploadedPhotos: {
          ...state.uploadedPhotos,
          [key]:
            key === "additional"
              ? [
                  ...state.uploadedPhotos.additional,
                  { url: imageUrl, key: imageKey },
                ]
              : { url: imageUrl, key: imageKey },
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
          [key]: { name: file.name, key: documentKey },
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
      const updatedVehicleImageKeys = state.vehicleData.vehicleImageKeys.filter(
        (k) => k !== imageKey
      );

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
        state.vehicleData.adminDocumentKeys.filter((k) => k !== documentKey);

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
      const newImageUrl = URL.createObjectURL(file);
      set((state) => {
        const updatedPhotos = { ...state.uploadedPhotos };
        const updatedVehicleImageKeys =
          state.vehicleData.vehicleImageKeys.filter((k) => k !== oldImageKey);

        if (key === "additional") {
          updatedPhotos.additional = updatedPhotos.additional.map((img) =>
            img.key === oldImageKey
              ? { url: newImageUrl, key: newImageKey }
              : img
          );
        } else {
          updatedPhotos[key] = { url: newImageUrl, key: newImageKey };
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
      set((state) => {
        const updatedDocuments = { ...state.uploadedDocuments };
        const updatedAdminDocumentKeys =
          state.vehicleData.adminDocumentKeys.filter(
            (k) => k !== oldDocumentKey
          );

        updatedDocuments[key] = { name: file.name, key: newDocumentKey };

        return {
          vehicleData: {
            ...state.vehicleData,
            adminDocumentKeys: [...updatedAdminDocumentKeys, newDocumentKey],
          },
          uploadedDocuments: updatedDocuments,
        };
      });
    } catch (error) {
      console.error("Error updating document:", error);
    }
  },
}));

export default useVehicleFormStore;
