import React from "react";

function TermsAndConditions({ handleClick }) {
  return (
    <div
      style={{
        height: "auto",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        gap: "20px",
        alignItems: "center",
        paddingTop: "150px",
      }}
    >
      <h1>Terms and Conditions</h1>
      <h2>Rental Agreement</h2>

      <div
        style={{
          height: "60vh",
          overflowY: "scroll",
        }}
      >
        <div
          style={{
            maxWidth: "500px",
            height: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              flex: "row",
              width: "100%",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h3>Section I: Definitions and Interpretations</h3>
            <div>
              <h4>1.1 Definitions</h4>
              <div>
                <p>
                  "Company": Refers to Das Topia, which provides an online
                  platform facilitating the connection between car owners who
                  wish to rent out their vehicles and individuals or entities
                  seeking to rent cars. This includes Das Topia’s subsidiaries,
                  affiliates, and representatives.
                </p>
                <p>
                  "Renter": Refers to the individual or entity who enters into
                  the Rental Agreement through the Das Topia platform to rent a
                  car from a car owner.
                </p>
                <p>
                  "Rental Car": Refers to the vehicle that is available for rent
                  through the Das Topia platform and is provided to the Renter
                  by a car owner under the terms of the Rental Agreement.
                </p>
                <p>
                  "Rental Agreement": Refers to the contract entered into
                  between the Renter and the car owner, facilitated by the Das
                  Topia platform. It outlines the terms and conditions under
                  which the Rental Car is provided.
                </p>
                <p>
                  "Rental Period": Refers to the duration for which the Rental
                  Car is rented, as specified in the Rental Agreement, including
                  any extensions agreed upon by both the Renter and the car
                  owner.
                </p>
                <p>
                  "Fees": Refers to all charges associated with the rental of
                  the Rental Car, including but not limited to rental rates,
                  taxes, and any additional costs incurred during the Rental
                  Period. These fees may be processed through the Das Topia
                  platform.
                </p>
                <p>
                  "Damage": Refers to any harm, impairment, or deterioration of
                  the Rental Car that occurs during the Rental Period.
                </p>
                <p>
                  "Force Majeure": Refers to unforeseeable circumstances beyond
                  the control of Das Topia that prevent it from fulfilling its
                  obligations under the Rental Agreement or operating the
                  platform effectively.
                </p>
                <p>
                  "Insurance Coverage": Refers to the protection provided
                  against financial loss or liability arising from damage to the
                  Rental Car or third-party property during the Rental Period.
                  Insurance coverage specifics are typically managed by the car
                  owner, with Das Topia facilitating information but not
                  providing insurance directly.
                </p>
                <p>
                  "Applicable Laws": Refers to all laws, regulations, and
                  ordinances of Ethiopia and any other relevant jurisdictions
                  that govern the rental and use of the Rental Car.
                </p>
              </div>
            </div>
          </div>

          <div
            style={{
              flex: "row",
              width: "100%",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h3>Section II: Formation of Agreement</h3>
            <div>
              <h4>2.1 Agreement Creation:</h4>
              <div>
                <p>
                  The rental agreement (hereinafter referred to as the
                  "Agreement") is formed when the renter (hereinafter referred
                  to as the "Renter") agrees to rent a vehicle listed on Das
                  Topia by the car owner (hereinafter referred to as the
                  "Owner") and both parties confirm the rental details through
                  the Das Topia platform.
                </p>
              </div>
            </div>

            <div>
              <h4>2.2 Required Information:</h4>
              <div>
                <p>
                  Renter's Obligations: The Renter must provide valid
                  identification, a valid driver's license, be at least 21 years
                  old, and provide any other documents required by Das Topia.
                </p>
                <p>
                  Owner's Obligations: The Owner must provide accurate details
                  about the vehicle, including its condition, availability, and
                  any specific rental conditions. This includes providing the
                  vehicle's insurance document.
                </p>
              </div>
            </div>

            <div>
              <h4>2.3 Rental Period:</h4>
              <div>
                <p>
                  The rental period is defined as the agreed start and end dates
                  and times specified in the Agreement. Any extension of the
                  rental period must be agreed upon by both the Owner and the
                  Renter and confirmed through the Das Topia platform.
                </p>
              </div>
            </div>

            <div>
              <h4>2.4 Rental Fees and Payment:</h4>
              <div>
                <p>
                  Determination of Fees: The rental fees are determined by the
                  Owner and agreed upon by the Rente
                </p>
                <p>
                  Payment: Payment for the rental fees must be made through the
                  Das Topia platform using the available payment methods.
                </p>
                <p>
                  Commission: Das Topia will deduct a commission fee from the
                  total rental amount as compensation for providing the platform
                  and related services. The commission rate will be specified on
                  the Das Topia platform and may vary based on the rental
                  agreement and other factors
                </p>
              </div>
            </div>
          </div>

          <div
            style={{
              flex: "row",
              width: "100%",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h3>Section III: Obligations of the Car Owner</h3>
            <div>
              <h4>3.1 Vehicle Condition</h4>
              <div>
                <p>
                  The Owner must ensure the vehicle is in good working
                  condition, clean, and free from any defects that may affect
                  its safe operation.
                </p>
                <p>
                  The Owner must provide all necessary documents, including the
                  vehicle registration, insurance papers, and a copy of the
                  latest maintenance records.
                </p>
              </div>
            </div>

            <div>
              <h4>3.2 Insurance</h4>
              <div>
                <p>
                  The Owner must ensure the vehicle has valid insurance coverage
                  that meets the minimum legal requirements in Ethiopia. The
                  insurance policy must cover third-party liability and any
                  additional coverage specified in the Agreement.
                </p>
                <p>
                  Owners must provide proof of their full insurance coverage to
                  Das Topia before their vehicle can be listed on the platform.
                  This proof will be verified to ensure compliance with the
                  insurance requirements.
                </p>
              </div>
            </div>
          </div>

          <div
            style={{
              flex: "row",
              width: "100%",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h3>Section IV: Obligations of the Renter</h3>
            <div>
              <h4>4.1 Use of Vehicle</h4>
              <div>
                <p>
                  The Renter agrees to use the vehicle in a lawful and safe
                  manner, c omplying with all traffic laws and regulations.
                </p>
                <p>
                  The Renter must not use the vehicle for any illegal
                  activities, racing, towing, or carrying hazardous materials.
                </p>
              </div>
            </div>

            <div>
              <h4>4.2 Care and Maintenance</h4>
              <div>
                <p>
                  The Renter is responsible for maintaining the vehicle in good
                  condition during the rental period, including regular checks
                  on oil, water, tire pressure, and fuel levels.
                </p>
                <p>
                  Any issues or damages must be reported to the Owner and Das
                  Topia immediately.
                </p>
              </div>
            </div>

            <div>
              <h4>4.3 Return of Vehicle</h4>
              <div>
                <p>
                  The Renter must return the vehicle at the agreed location and
                  time, in the same condition as it was at the start of the
                  rental period, except for normal wear and tear.
                </p>
                <p>
                  The Renter is responsible for any additional cleaning or
                  refueling costs if the vehicle is returned in an unacceptable
                  condition.
                </p>
              </div>
            </div>
          </div>

          <div
            style={{
              flex: "row",
              width: "100%",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h3>Section V: Termination of Agreement</h3>
            <div>
              <h4>5.1 Early Termination by Owner</h4>
              <div>
                <p>
                  The Owner has the right to terminate the Agreement early if
                  the Renter breaches any terms of the Agreement or engages in
                  illegal or unsafe activities. In such cases, the Renter must
                  return the vehicle immediately, and no refund will be
                  provided.
                </p>
              </div>
            </div>

            <div>
              <h4>5.2 Early Termination by Renter</h4>
              <div>
                <p>
                  The Renter may terminate the Agreement early if the Rental Car
                  is found to be unsafe or not in compliance with the agreed
                  terms, by notifying the Owner and Das Topia at least 24 hours
                  in advance. Refunds for early termination will be subject to
                  the cancellation policy specified at the time of booking.
                </p>
              </div>
            </div>

            <div>
              <h4>5.3 Termination by Das Topia</h4>
              <div>
                <p>
                  Das Topia may terminate the Rental Agreement immediately if
                  the Renter violates any terms of the Agreement, including but
                  not limited to non-payment, unauthorized use of the Rental
                  Car, or failure to return the Rental Car on time.
                </p>
                <p>
                  Das Topia may also terminate the Agreement if the Renter
                  breaches any contractual obligations or engages in activities
                  that may cause damage to the Rental Car or harm to others.
                </p>
                <p>
                  Termination may result in the forfeiture of any deposits or
                  advance payments made by the Renter
                </p>
              </div>
            </div>

            <div>
              <h4>5.4 Mutual Agreement</h4>
              <div>
                <p>
                  Both parties can mutually agree to terminate the Agreement
                  early, with terms and any applicable refunds negotiated and
                  agreed upon through the Das Topia platform.
                </p>
              </div>
            </div>

            <div>
              <h4>5.5 Governing Law</h4>
              <div>
                <p>
                  The Agreement shall be governed by and construed in accordance
                  with the laws of Ethiopia. Any legal actions or proceedings
                  arising from the Agreement shall be brought in the courts of
                  Ethiopia.
                </p>
              </div>
            </div>
          </div>

          <div
            style={{
              flex: "row",
              width: "100%",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h3>Section VI: Rental Car Usage</h3>
            <div>
              <h4>6.1 Permitted Use</h4>
              <div>
                <p>
                  Authorized Drivers: The vehicle may only be driven by the
                  Renter and any additional drivers approved by the Owner and
                  registered on the Das Topia platform.
                </p>
                <p>
                  All authorized drivers must possess a valid driver’s license,
                  be at least 21 years old, and meet the minimum age
                  requirements specified in the Agreement
                </p>
              </div>
            </div>

            <div>
              <h4>6.2 Usage Restrictions</h4>
              <div>
                <p>
                  The Renter agrees to use the vehicle exclusively for personal
                  or business purposes as stated in the Agreement. The vehicle
                  must not be used for commercial purposes, including but not
                  limited to ride-sharing services, delivery services, or
                  transporting passengers for a fee.
                </p>
              </div>
            </div>

            <div>
              <h4>6.3 Prohibited Uses</h4>
              <div>
                <p>
                  The Renter shall not operate the vehicle under the influence
                  of alcohol, drugs, or any other substances impairing driving
                  ability.
                </p>
                <p>
                  The renter shall not allow anyone not authorized by the
                  Agreement to drive the vehicle.
                </p>
                <p>
                  The renter shall not use the vehicle for illegal activities or
                  in violation of traffic laws and regulations.
                </p>
                <p>
                  The renter shall not drive the vehicle outside the
                  geographical area specified in the Agreement without prior
                  written consent from the Owner.
                </p>
              </div>
            </div>

            <div>
              <h4>6.4 Vehicle Maintenance and Care</h4>
              <div>
                <p>
                  Routine Checks: The Renter is responsible for performing
                  routine checks on the vehicle, including oil levels, water
                  levels, tire pressure, and fuel. The Renter must ensure that
                  the vehicle remains in good working condition throughout the
                  rental period.
                </p>
              </div>
            </div>

            <div>
              <h4>6.5 Reporting Accidents</h4>
              <div>
                <p>
                  Immediately contact the police and obtain a police report.
                </p>
                <p>
                  Notify the Owner and Das Topia within 24 hours of the
                  incident.
                </p>
                <p>
                  Provide all relevant details and documentation related to the
                  accident
                </p>
              </div>
            </div>

            <div>
              <h4>6.6 Liability for Damages</h4>
              <div>
                <p>
                  The Renter may be liable for the cost of repairs, replacement,
                  or any loss of use resulting from damages. The cost of repairs
                  or replacement will be deducted from the security deposit or
                  charged to the Renter as per the Agreement.
                </p>
              </div>
            </div>

            <div>
              <h4>6.6 Vehicle Security</h4>
              <div>
                <p>
                  Theft or Loss: In case of theft or loss of the vehicle, the
                  Renter must report the incident to the police and Das Topia
                  immediately. The Renter must also cooperate with the
                  investigation and provide any necessary documentation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          style={{
            padding: "10px 15px 10px 15px",
            border: "none",
            borderRadius: "5px",
            backgroundColor: "#2a43cf",
            color: "white",
          }}
          onClick={handleClick}
        >
          Agree and Proceed
        </button>
      </div>
    </div>
  );
}

export default TermsAndConditions;
