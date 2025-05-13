import React from "react";
import { HiMiniArrowsUpDown } from "react-icons/hi2";
import {
  FaCalendarAlt,
  FaCar,
  FaMoneyBillWave,
  FaInfoCircle,
  FaIdBadge,
} from "react-icons/fa";

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    // console.error("Error formatting date:", dateString, error);
    return dateString; // Return original if formatting fails
  }
};

// Helper to format currency (basic)
// *** IMPORTANT: Customize this based on your 'amount' field and desired currency ***
const formatCurrency = (amountStr) => {
  if (amountStr === null || amountStr === undefined) return "N/A";
  const amountNum = parseFloat(amountStr);
  if (isNaN(amountNum)) return "N/A";

  // Example: Assuming amount is a whole number like "7800" representing ETB 7800.00
  // return `ETB ${amountNum.toFixed(2)}`;

  // Example: Assuming amount is like "7800" meaning 78.00 in a currency that uses cents
  // return `$${(amountNum / 100).toFixed(2)}`;

  // For now, a generic display if it's just a number string
  return `AMT ${amountNum.toLocaleString()}`; // Placeholder: "AMT 7,800"
};

const RentalHistoryTable = ({
  sortedRentals, // This prop comes directly from your original Profile.js
  handleSort,
  sortConfig,
  statusColors,
}) => {
  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? "▲" : "▼";
    }
    return <HiMiniArrowsUpDown className="inline ml-1 opacity-50" />;
  };

  return (
    <div className="bg-white w-full shadow-lg rounded-lg mt-8">
      <div className="p-4 sm:p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Rental History
        </h2>
        {Array.isArray(sortedRentals) && sortedRentals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  {/* <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("id")}
                  >
                    Booking ID {getSortIndicator("id")}
                  </th> */}
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("make")}
                  >
                    Car {getSortIndicator("make")}
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("startDate")}
                  >
                    Start Date {getSortIndicator("startDate")}
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("endDate")}
                  >
                    End Date {getSortIndicator("endDate")}
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("amount")}
                  >
                    Amount {getSortIndicator("amount")}
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("isPayed")}
                  >
                    Payment {getSortIndicator("isPayed")}
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("approvedStatus")}
                  >
                    Booking Status {getSortIndicator("approvedStatus")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedRentals.map((rental) => (
                  <tr
                    key={rental.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      <FaIdBadge className="inline mr-1 text-blue-500 opacity-70" />
                      <span title={rental.id}>
                        {rental.id ? rental.id.substring(0, 8) + "..." : "N/A"}
                      </span>
                    </td> */}
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      <FaCar className="inline mr-1 text-green-500 opacity-70" />
                      {rental.make || "N/A"} {rental.model || ""}{" "}
                      {rental.year ? `(${rental.year})` : ""}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      <FaCalendarAlt className="inline mr-1 text-purple-500 opacity-70" />
                      {formatDate(rental.startDate)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      <FaCalendarAlt className="inline mr-1 text-red-500 opacity-70" />
                      {formatDate(rental.endDate)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      <FaMoneyBillWave className="inline mr-1 text-yellow-600 opacity-70" />
                      {formatCurrency(rental.amount)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${
                            rental.isPayed === "success"
                              ? "bg-green-100 text-green-800"
                              : rental.isPayed === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800" // For failed or other statuses
                          }`}
                      >
                        {rental.isPayed
                          ? rental.isPayed.charAt(0).toUpperCase() +
                            rental.isPayed.slice(1)
                          : "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${
                            statusColors[
                              rental.approvedStatus?.toLowerCase()
                            ] || "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {rental.approvedStatus
                          ? rental.approvedStatus.charAt(0).toUpperCase() +
                            rental.approvedStatus.slice(1)
                          : "N/A"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <FaInfoCircle className="mx-auto text-4xl text-gray-400 mb-3" />
            <p className="text-gray-500">
              No rental history available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RentalHistoryTable;
