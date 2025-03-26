import React, { useState } from "react";
import { HiEllipsisVertical } from "react-icons/hi2";
import { MdOutlinePerson } from "react-icons/md";
import { MdOutlinePersonOff } from "react-icons/md";

const ProfileMenu = ({ onLogout, onDeleteAccount }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const togglePopup = () => setIsPopupVisible(!isPopupVisible);

  return (
    <div className="relative">
      <div className="flex flex-col cursor-pointer" onClick={togglePopup}>
        <HiEllipsisVertical size={28} />
      </div>
      {isPopupVisible && (
        <div className="absolute top-10 text-base right-0 bg-white shadow-md rounded-md py-2 w-44 z-10">
          <button
            onClick={onLogout}
            className="flex items-center w-full text-left py-4 hover:bg-gray-100"
          >
            <MdOutlinePerson size={20} className="mx-4" /> Logout
          </button>
          <button
            onClick={onDeleteAccount}
            className="flex w-full items-center text-left py-4 hover:bg-gray-100 text-red-600"
          >
            <MdOutlinePersonOff size={20} className="mx-4" />
            Delete Account
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
