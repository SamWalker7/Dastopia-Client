import React from "react";

const ConfirmationModal = ({ isVisible, onCancel, onConfirm }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 bg-black opacity-50 z-20"></div>
      <div className="fixed inset-0 flex items-center justify-center z-30">
        <div className="bg-white p-6 rounded-lg shadow-lg w-[340px]">
          <h2 className="text-xl mb-4">Are You Sure ?</h2>
          <p className="text-gray-600 text-base my-10">
            Deleting your account will erase all information associated with the
            account.
          </p>
          <div className="flex gap-4">
            <button
              onClick={onCancel}
              className=" bg-blue-950 text-sm flex items-center justify-center w-fit text-white rounded-full px-8 my-2 py-2"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className=" bg-red-100 text-sm flex items-center justify-center w-fit text-red-600 hover:bg-red-600 hover:text-white rounded-full px-8 my-2 py-2"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModal;
