import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const PaymentDetailsModal = ({
  totalPrice,
  id, // carId
  ownerId,
  dropOffTime,
  pickUpTime,
  pickUpLocation,
  dropOffLocation,
  onClose,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const customer = JSON.parse(localStorage.getItem("customer"));
  const USER_ID =
    customer?.userAttributes?.find((attr) => attr.Name === "sub")?.Value || ""; //the current user's ID

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleApproveBooking = async () => {
    try {
      console.log("ownerId before fetch:", USER_ID);
      const pickArr = [];
      pickArr.push(pickUpLocation);
      const dropArr = [];
      dropArr.push(dropOffLocation);

      // Step 1: Create the Booking (Keep as is)
      const bookingResponse = await fetch(
        "https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/booking/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${customer.AccessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ownerId: ownerId, // Assuming ownerId is defined in scope
            renteeId: USER_ID, // Assuming USER_ID is defined in scope
            carId: id, // Assuming id is defined in scope
            startDate: pickUpTime, // Assuming pickUpTime is defined in scope
            endDate: dropOffTime, // Assuming dropOffTime is defined in scope
            price: totalPrice.toString(), // Assuming totalPrice is defined in scope
            pickUp: pickArr,
            dropOff: dropArr,
          }),
        }
      );

      if (bookingResponse.ok) {
        console.log("Booking created successfully");

        // Step 2: Fetch the existing vehicle data (Keep as is)
        const vehicleResponse = await fetch(
          `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/vehicle/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${customer.AccessToken}`,
            },
          }
        );

        if (vehicleResponse.ok) {
          const vehicleData = await vehicleResponse.json();
          // Assuming the actual vehicle properties are within vehicleData.body
          const originalVehicleBody = vehicleData.body;

          // Step 3: Process the events to create updatedEvents (Keep as is)
          const events = originalVehicleBody.events; // Use events from the fetched data
          const updatedEvents = [];
          const pickUpDateObj = new Date(pickUpTime);
          const dropOffDateObj = new Date(dropOffTime);

          events.forEach((event) => {
            const eventStartDateObj = new Date(event.startDate);
            const eventEndDateObj = new Date(event.endDate);

            if (event.status === "available") {
              if (
                pickUpDateObj >= eventStartDateObj &&
                dropOffDateObj <= eventEndDateObj
              ) {
                // The booking falls entirely within this event's range.
                if (pickUpDateObj > eventStartDateObj) {
                  updatedEvents.push({
                    eventId: uuidv4(), // Assuming uuidv4 is defined in scope
                    startDate: event.startDate,
                    endDate: pickUpTime,
                    status: "available",
                    source: "manual",
                  });
                }

                updatedEvents.push({
                  eventId: uuidv4(),
                  startDate: pickUpTime,
                  endDate: dropOffTime,
                  status: "blocked",
                  source: "manual",
                });

                if (dropOffDateObj < eventEndDateObj) {
                  updatedEvents.push({
                    eventId: uuidv4(),
                    startDate: dropOffTime,
                    endDate: event.endDate,
                    status: "available",
                    source: "manual",
                  });
                }
              } else if (
                pickUpDateObj < eventEndDateObj &&
                dropOffDateObj > eventStartDateObj
              ) {
                // This section handles overlaps. Keeping the original logic provided.
                if (
                  pickUpDateObj >= eventStartDateObj &&
                  pickUpDateObj <= eventEndDateObj
                ) {
                  updatedEvents.push({
                    eventId: uuidv4(),
                    startDate: event.startDate,
                    endDate: pickUpTime,
                    status: "available",
                    source: "manual",
                  });

                  updatedEvents.push({
                    eventId: uuidv4(),
                    startDate: pickUpTime,
                    endDate: event.endDate,
                    status: "blocked",
                    source: "manual",
                  });
                } else if (
                  dropOffDateObj >= eventStartDateObj &&
                  dropOffDateObj <= eventEndDateObj
                ) {
                  updatedEvents.push({
                    eventId: uuidv4(),
                    startDate: event.startDate,
                    endDate: dropOffTime,
                    status: "blocked",
                    source: "manual",
                  });

                  updatedEvents.push({
                    eventId: uuidv4(),
                    startDate: dropOffTime,
                    endDate: event.endDate,
                    status: "available",
                    source: "manual",
                  });
                } else {
                  // If none of the above overlap conditions match, push the original event.
                  // This might happen if the booking completely covers an existing 'available' block.
                  updatedEvents.push(event);
                }
              } else {
                // Event is available but doesn't overlap with the booking period based on the checks above
                updatedEvents.push(event);
              }
            } else {
              // Event is not available (e.g., already blocked), keep it as is
              updatedEvents.push(event);
            }
          });
          // End Process Events

          // Step 4: Prepare the body for the PUT request
          // Create a new object by copying all properties from the original vehicle body
          const vehicleUpdateBody = { ...originalVehicleBody };
          // Replace the 'events' property with the newly generated updatedEvents
          vehicleUpdateBody.events = updatedEvents;
          // Ensure the ID is also included in the body payload if the API requires it there
          vehicleUpdateBody.id = id;
          console.log("vehicleUpdateBody", vehicleUpdateBody);
          // Step 5: Update the vehicle with the modified data
          // const updateVehicleResponse = await fetch(
          //   `https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v11/vehicle/${id}`,
          //   {
          //     method: "PUT",
          //     headers: {
          //       Authorization: `Bearer ${customer.AccessToken}`,
          //       "Content-Type": "application/json",
          //     },
          //     // Send the complete updated body (original data + new events)
          //     body: JSON.stringify(vehicleUpdateBody),
          //   }
          // );

          // if (updateVehicleResponse.ok) {
          //   console.log("Vehicle updated successfully with new events");
          //   onClose(); // Assuming onClose is defined in scope
          //   // Add any further actions after successful booking and update
          // } else {
          //   console.error(
          //     "Failed to update vehicle events",
          //     updateVehicleResponse
          //   );
          //   // Handle error (e.g., show an error message)
          // }
        } else {
          console.error("Failed to fetch vehicle data", vehicleResponse);
          // Handle error (e.g., show an error message)
        }
      } else {
        console.error("Failed to create booking", bookingResponse);
        // Handle error (e.g., show an error message)
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      // Handle network errors or other exceptions
    }
  };

  return (
    <div>
      {/* Overlay background */}
      <div
        className="fixed inset-0 bg-black opacity-50 z-20"
        onClick={onClose}
      ></div>
      {/* Modal content */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-start p-6 gap-4 w-11/12 md:w-2/4 lg:w-1/3 max-h-[80vh] overflow-y-auto bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="flex items-center w-full mb-4">
          <button
            onClick={onClose}
            className="text-base font-semibold text-black mr-2"
          >
            {"←"}
          </button>
          <h2 className="text-base font-semibold text-black">
            Booking Details
          </h2>
        </div>

        {/* Title */}
        <h1 className="text-base md:text-lg font-bold text-black">
          Terms and Conditions
        </h1>
        <h2 className="text-base md:text-lg font-semibold text-black">
          Renting a Car
        </h2>
        <p className="text-sm md:text-sm text-gray-600">
          Please read and accept the terms and conditions before confirming your
          booking.
        </p>

        {/* Terms Content */}
        <div className="text-sm md:text-sm text-black leading-relaxed overflow-y-auto max-h-[40vh]">
          <h3 className="font-semibold text-black mb-2">General Terms</h3>
          <ol className="list-decimal pl-6 text-gray-700">
            <li>
              Eligibility: You must be at least 21 years old and hold a valid
              driver's license.
            </li>
            <li>
              Rental Period: The rental period is defined in the booking
              confirmation. Early returns will not be refunded.
            </li>
            <li>
              Usage: The vehicle is to be used for personal use only and not for
              commercial purposes.
            </li>
            <li>
              Responsibility: You are responsible for the vehicle and any damage
              that occurs during the rental period. Report any issues
              immediately.
            </li>
          </ol>

          <h3 className="font-semibold text-black mt-4 mb-2">Payment Terms</h3>
          <ol className="list-decimal pl-6 text-gray-700">
            <li>
              Charges: The rental fee includes the daily rate, any additional
              mileage charges, and applicable taxes.
            </li>
            <li>
              Security Deposit: A security deposit will be held on your credit
              card and refunded upon safe return of the vehicle.
            </li>
            <li>
              Payment Method: Payments are processed via our integrated payment
              gateway. No cash payments are accepted.
            </li>
          </ol>

          <h3 className="font-semibold text-black mt-4 mb-2">
            Insurance and Liability
          </h3>
          <ol className="list-decimal pl-6 text-gray-700">
            <li>
              Insurance: Basic insurance coverage is included in your rental
              fee. Additional insurance options are available.
            </li>
            <li>
              Accidents: In the event of an accident, contact local authorities
              and inform the car owner immediately.
            </li>
            <li>
              Damages: Any damages not covered by insurance will be deducted
              from the security deposit. Excessive damage may incur additional
              charges.
            </li>
          </ol>
        </div>

        {/* Checkbox */}
        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="w-4 h-4 mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="acceptTerms"
            className="text-sm md:text-sm font-medium text-black"
          >
            I accept the terms and conditions
          </label>
        </div>

        {/* Approve Button */}
        <button
          onClick={handleApproveBooking}
          className={`w-full py-1 md:py-2 mt-2 text-white text-sm md:text-sm rounded-full ${
            isChecked
              ? "bg-blue-950 hover:bg-blue-900"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!isChecked}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default function PriceBreakdown({
  days,
  dailyPrice,
  totalPrice,
  id,
  ownerId,
  dropOffTime,
  pickUpTime,
  pickUpLocation,
  dropOffLocation,
}) {
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  return (
    <div className="flex items-center justify-center ">
      <div className="bg-[#0d1b3e] text-gray-300 shadow-lg p-6 rounded-2xl w-full max-w-md">
        <h1 className="text-xl md:text-2xl text-white mb-4">Price Breakdown</h1>

        <div className="space-y-3">
          <div className="flex justify-between text-xs md:text-sm">
            <span>Daily Fee</span>
            <span>{dailyPrice} birr</span>
          </div>

          <div className="flex justify-between text-xs md:text-sm">
            <span>Rental days</span>
            <span>{days} days</span>
          </div>

          <div className="flex justify-between text-xs md:text-sm">
            <span>Service Fee</span>
            <span>{ownerId} birr</span>
          </div>

          <div className="h-px bg-white/20 my-3" />

          <div className="flex justify-between text-sm font-semibold text-white">
            <span>Total cost</span>
            <span>{totalPrice} birr</span>
          </div>
        </div>

        <button
          onClick={() => setShowPaymentDetails(true)}
          className="w-full bg-white text-[#0d1b3e] font-medium py-2 text-xs md:text-sm rounded-full mt-6"
        >
          Pay Now
        </button>
      </div>

      {showPaymentDetails && (
        <PaymentDetailsModal
          totalPrice={totalPrice}
          id={id}
          ownerId={ownerId}
          dropOffTime={dropOffTime}
          pickUpTime={pickUpTime}
          pickUpLocation={pickUpLocation}
          dropOffLocation={dropOffLocation}
          onClose={() => setShowPaymentDetails(false)}
        />
      )}
    </div>
  );
}
