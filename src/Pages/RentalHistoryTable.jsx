import React from "react";
import { HiMiniArrowsUpDown } from "react-icons/hi2";

const RentalHistoryTable = ({
  sortedRentals,
  handleSort,
  sortConfig,
  statusColors,
}) => {
  console.log("Rental History Table", sortedRentals, handleSort, sortConfig);
  return (
    <div className=" bg-white w-full shadow-lg rounded-lg">
      <div className=" p-6 rounded-lg ">
        <h2 className="text-lg font-semibold pl-2 my-8">Rental History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-x-0 border-t-0 border-gray-100 rounded-lg">
            <thead>
              <tr className="bg-gray-50 font-semibold">
                <th
                  className="px-6 text-left font-semibold py-4 text-gray-600 cursor-pointer"
                  onClick={() => handleSort("startDate")}
                >
                  Rent start date
                  <HiMiniArrowsUpDown className="inline ml-1" />
                </th>
                <th
                  className="px-6 text-left font-semibold py-4 text-gray-600 cursor-pointer"
                  onClick={() => handleSort("endDate")}
                >
                  Rent end date
                  <HiMiniArrowsUpDown className="inline ml-1" />
                </th>
                <th
                  className="px-6 text-left font-semibold py-4 text-gray-600 cursor-pointer"
                  onClick={() => handleSort("carName")}
                >
                  Car Name
                  <HiMiniArrowsUpDown className="inline ml-1" />
                </th>
                <th className="px-6 text-left font-semibold py-4 text-gray-600">
                  Car Owner
                </th>
                <th className="px-6 text-left font-semibold py-4 text-gray-600">
                  Phone Number
                </th>
                <th className="px-6 text-left font-semibold py-4 text-gray-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(sortedRentals) && sortedRentals.length > 0 ? (
                sortedRentals.map((rental, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="px-6 text-gray-700">{rental.startDate}</td>
                    <td className="px-6 text-gray-700">{rental.endDate}</td>
                    <td className="px-6 text-gray-700">{rental.carName}</td>
                    <td className="px-6 text-gray-700">{rental.carOwner}</td>
                    <td className="px-6 text-gray-700">{rental.phone}</td>
                    <td className="p-8">
                      <span
                        className={`px-3 py-2 rounded-xl font-semibold text-xs ${
                          statusColors[rental.approvedStatus]
                        }`}
                      >
                        {rental.approvedStatus}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-4 text-center text-gray-500">
                    No history available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RentalHistoryTable;
