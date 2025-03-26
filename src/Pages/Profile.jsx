import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AccountInformation from "./AccountInformation";
import VerificationDetails from "./VerificationDetails";
import RentalHistoryTable from "./RentalHistoryTable";
import ConfirmationModal from "./ConfirmationModal";
import ProfileMenu from "./ProfileMenu";
import { getDownloadUrl } from "../api";
import { FaSpinner } from "react-icons/fa";

const Profile = ({ user2, setUser }) => {
  const [rentals, setRentals] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    firstName:
      user2?.userAttributes?.find((attr) => attr.Name === "given_name")
        ?.Value || "",
    lastName:
      user2?.userAttributes?.find((attr) => attr.Name === "family_name")
        ?.Value || "",
    email:
      user2?.userAttributes?.find((attr) => attr.Name === "email")?.Value || "",
    phoneNumber:
      user2?.userAttributes?.find((attr) => attr.Name === "phone_number")
        ?.Value || "",
    location: "Addis Ababa",
  });
  const [errors, setErrors] = useState({ email: "", phoneNumber: "" });
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [profilePicKey, setProfilePicKey] = useState(
    user2?.userAttributes?.find(
      (attr) => attr.Name === "custom:profile_pic_key"
    )?.Value || null
  );
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    const fetchProfileImage = async () => {
      setIsImageLoading(true);
      try {
        if (profilePicKey) {
          const response = await getDownloadUrl(profilePicKey);
          setProfileImageUrl(
            response?.body || "https://via.placeholder.com/150"
          );
        } else {
          setProfileImageUrl("https://via.placeholder.com/150");
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
        setProfileImageUrl("https://via.placeholder.com/150");
      } finally {
        setIsImageLoading(false);
      }
    };

    fetchProfileImage();
  }, [profilePicKey]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhoneNumber = (phoneNumber) => /^\d{10}$/.test(phoneNumber);

  const handleUpdate = () => {
    let hasError = false;
    const newErrors = {};
    if (!isValidEmail(profile.email)) {
      newErrors.email = "Please enter a valid email address.";
      hasError = true;
    }
    if (!isValidPhoneNumber(profile.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number.";
      hasError = true;
    }
    setErrors(newErrors);
    if (!hasError) {
      alert("Profile updated!");
      console.log("Updated profile:", profile);
    }
  };

  const statusColors = {
    Completed: "bg-blue-950 text-white",
    Active: "bg-green-100 text-green-700",
    Canceled: "bg-red-100 text-red-600",
  };

  const sortedRentals = [...rentals].sort((a, b) => {
    if (sortConfig.key) {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      if (sortConfig.key === "startDate" || sortConfig.key === "endDate") {
        aValue =
          aValue === "NA"
            ? null
            : new Date(aValue.split("/").reverse().join("/"));
        bValue =
          bValue === "NA"
            ? null
            : new Date(bValue.split("/").reverse().join("/"));
      }
      if (aValue === bValue) return 0;
      return sortConfig.direction === "ascending"
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
        ? 1
        : -1;
    }
    return 0;
  });

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleLogout = async () => {
    localStorage.removeItem("customer");
    setUser(null);
    window.dispatchEvent(new Event("storage"));
    window.location.href = "/";
  };

  const handleDeleteAccountClick = () => {
    setIsModalVisible(true);
  };

  const handleConfirmDelete = () => {
    setIsModalVisible(false);
    console.log("Account deleted");
  };

  const handleCancelDelete = () => {
    setIsModalVisible(false);
  };

  const handleProfilePicUploadedFromChild = (newKey) => {
    setProfilePicKey(newKey);
    const updatedUser = {
      ...user2,
      userAttributes: [
        ...user2.userAttributes.filter(
          (attr) => attr.Name !== "custom:profile_pic_key"
        ),
        { Name: "custom:profile_pic_key", Value: newKey },
      ],
    };
    localStorage.setItem("customer", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  useEffect(() => {
    const fetchRentalHistory = async () => {
      const token = JSON.parse(localStorage.getItem("customer"));
      if (token) {
        try {
          const response = await fetch(
            "https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/booking/get_all_rentee_booking",
            {
              headers: { Authorization: `Bearer ${token.AccessToken}` },
            }
          );
          if (response.ok) {
            const data = await response.json();
            if (data && data.body && Array.isArray(data.body)) {
              setRentals(data.body);
            } else {
              console.error("API response body is not a valid array:", data);
              setRentals([]);
            }
          } else if (response.status === 401) {
            console.error("Unauthorized access to rental history");
            setRentals([]);
          } else {
            console.error("Failed to fetch rental history:", response.status);
            setRentals([]);
          }
        } catch (error) {
          console.error("Error fetching rental history:", error);
          setRentals([]);
        }
      } else {
        console.warn("No customer token found, cannot fetch rental history.");
        setRentals([]);
      }
    };
    fetchRentalHistory();
  }, []);

  if (!Array.isArray(rentals)) {
    console.error("Rentals is not an array:", rentals);
    return (
      <div className="py-10 bg-[#FAF9FE] md:px-20 px-6 space-y-8 md:pt-32 pt-28 flex flex-col">
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <p className="text-red-500 font-semibold">
            Error: Could not load rental history. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 bg-[#FAF9FE] md:px-20 px-6 space-y-8 md:pt-32 pt-28 flex flex-col">
      <div className="md:flex space-y-4 md:gap-8">
        <AccountInformation
          profile={profile}
          setProfile={setProfile}
          errors={errors}
          handleChange={handleChange}
          handleUpdate={handleUpdate}
          user2={user2}
          onProfilePicUploaded={handleProfilePicUploadedFromChild}
          profileImageUrl={profileImageUrl}
          isImageLoading={isImageLoading}
        />
        <VerificationDetails
          user2={user2}
          setUser={setUser} // Add this line
        />{" "}
        <ProfileMenu
          onLogout={handleLogout}
          onDeleteAccount={handleDeleteAccountClick}
        />
      </div>
      <RentalHistoryTable
        sortedRentals={sortedRentals}
        handleSort={handleSort}
        sortConfig={sortConfig}
        statusColors={statusColors}
      />
      <ConfirmationModal
        isVisible={isModalVisible}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Profile;
