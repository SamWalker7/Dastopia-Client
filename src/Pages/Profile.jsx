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
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    profilePicture: null,
  });
  const [errors, setErrors] = useState({ email: "", phoneNumber: "" });
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [profilePicKey, setProfilePicKey] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoadingProfile(true);
      try {
        const response = await fetch(
          "https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/account/get_profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${user2?.AccessToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data?.success && data?.data?.formattedProfile) {
            const formattedProfile = data.data.formattedProfile;
            setProfile({
              firstName: formattedProfile.firstName || "",
              lastName: formattedProfile.lastName || "",
              email: formattedProfile.email || "",
              phoneNumber: formattedProfile.phoneNumber || "",
              address: formattedProfile.address || "",
              city: formattedProfile.city || "",
              profilePicture: formattedProfile.profilePicture || null,
            });
            setProfilePicKey(formattedProfile.profilePicture);
          } else {
            console.error("Failed to fetch profile data:", data);
          }
        } else {
          console.error("Failed to fetch profile:", response.status);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    if (user2?.AccessToken) {
      fetchProfile();
    }
  }, [user2?.AccessToken]);

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

  const handleUpdate = async () => {
    let hasError = false;
    const newErrors = {};
    if (!isValidEmail(profile.email)) {
      newErrors.email = "Please enter a valid email address.";
      hasError = true;
    }
    // if (!isValidPhoneNumber(profile.phoneNumber)) {
    //   newErrors.phoneNumber = "Please enter a valid 10-digit phone number.";
    //   hasError = true;
    // }
    setErrors(newErrors);
    const customer = JSON.parse(localStorage.getItem("customer"));

    const USER_ID =
      customer?.userAttributes?.find((attr) => attr.Name === "sub")?.Value ||
      ""; //the current user's ID
    if (!hasError) {
      try {
        console.log("Updating profile with data:", profilePicKey);

        const response = await fetch(
          `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/account/update_profile/${USER_ID}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${user2?.AccessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              accessToken: user2?.AccessToken,
              email: profile.email,
              given_name: profile.firstName,
              family_name: profile.lastName,
              address: profile.address,
              "custom:city": profile.city,
              "custom:profile_picture_key": profilePicKey,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data?.success) {
            alert("Profile updated successfully!");
            // Fetch updated profile and update state
            const fetchUpdatedProfile = async () => {
              try {
                const getProfileResponse = await fetch(
                  "https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/account/get_profile",
                  {
                    method: "GET",
                    headers: {
                      Authorization: `Bearer ${user2?.AccessToken}`,
                    },
                  }
                );

                if (getProfileResponse.ok) {
                  const updatedProfileData = await getProfileResponse.json();
                  if (
                    updatedProfileData?.success &&
                    updatedProfileData?.data?.formattedProfile
                  ) {
                    console.log(
                      "Updated profile data:",
                      updatedProfileData.data.formattedProfile
                    );
                    const formattedProfile =
                      updatedProfileData.data.formattedProfile;
                    // const updatedUser = {
                    //   ...user2,
                    //   userAttributes: [
                    //     { Name: "email", Value: formattedProfile.email },
                    //     {
                    //       Name: "family_name",
                    //       Value: formattedProfile.lastName,
                    //     },
                    //     {
                    //       Name: "given_name",
                    //       Value: formattedProfile.firstName,
                    //     },
                    //     {
                    //       Name: "custom:profile_pic_key",
                    //       Value: formattedProfile.profilePicture,
                    //     },
                    //     // Add other relevant attributes if needed
                    //   ],
                    // };
                    // localStorage.setItem(
                    //   "customer",
                    //   JSON.stringify(updatedUser)
                    // );
                    //setUser(updatedUser);
                    console.log("Updated user:", formattedProfile);
                    setProfile({
                      firstName: formattedProfile.firstName || "",
                      lastName: formattedProfile.lastName || "",
                      email: formattedProfile.email || "",
                      phoneNumber: formattedProfile.phoneNumber || "",
                      address: formattedProfile.address || "",
                      city: formattedProfile.city || "",
                      profilePicture: formattedProfile.profilePicture || null,
                    });
                    setProfilePicKey(formattedProfile.profilePicture);
                  } else {
                    console.error(
                      "Failed to fetch updated profile data:",
                      updatedProfileData
                    );
                  }
                } else {
                  console.error(
                    "Failed to fetch updated profile:",
                    getProfileResponse.status
                  );
                }
              } catch (error) {
                console.error("Error fetching updated profile:", error);
              }
            };
            fetchUpdatedProfile();
          } else {
            alert("Failed to update profile.");
            console.error("Failed to update profile:", data);
          }
        } else {
          alert("Failed to update profile.");
          console.error("Failed to update profile:", response.status);
        }
      } catch (error) {
        alert("Failed to update profile.");
        console.error("Error updating profile:", error);
      }
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

  if (loadingProfile) {
    return (
      <div className="py-10 bg-[#FAF9FE] md:px-20 px-6 space-y-8 md:pt-32 pt-28 flex justify-center items-center">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
        <span className="ml-2">Loading profile...</span>
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
