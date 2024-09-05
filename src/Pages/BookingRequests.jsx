import { Fuel, LifeBuoy, User } from "lucide-react";
import React from "react";

function BookingRequests() {
  return (
    <div
      style={{
        paddingTop: "120px",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <div
          style={{
            boxShadow: "0px 4px 30px 0px rgba(221, 224, 255, 0.54)",
            width: "60%",
            height: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            backgroundColor: "#FFF", 
            padding: "25px"
          }}
        >
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "700",
              lineHeight: "40px",
              marginBottom: "20px",
            }}
          >
            Booking Approval
          </h1>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "12px",
                boxShadow: "0px 4px 30px 0px rgba(222, 222, 222, 0.54)",
                maxWidth: "100%",
                height: "auto",
                paddingTop: "10px",
                paddingBottom: "10px",
                borderRadius: "10px"
              }}
            >
              <div
                style={{
                  maxWidth: "700px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  style={{ width: "100%" }}
                  src="https://imgd.aeplcdn.com/370x208/n/cw/ec/139651/curvv-exterior-right-front-three-quarter.jpeg?isig=0&q=80"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  width: "100%",
                  padding: "0px 20px",
                }}
              >
                <h3
                  style={{
                    fontSize: "22px",
                    fontWeight: "700",
                  }}
                >
                  All New Rush
                </h3>
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: "500",
                    lineHeight: "24px" /* 150% */,
                    letterSpacing: "0.15px",
                    color: "#90A3BF",
                  }}
                >
                  SUV
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "2px",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Fuel width={"16"} height={"16"} />
                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: "500",
                        lineHeight: "24px" /* 150% */,
                        letterSpacing: "0.15px",
                        color: "#919093",
                      }}
                    >
                      Benzene
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "2px",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <LifeBuoy width={"16"} height={"16"} />
                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: "500",
                        lineHeight: "24px" /* 150% */,
                        letterSpacing: "0.15px",
                        color: "#919093",
                      }}
                    >
                      Manual
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "2px",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <User width={"16"} height={"16"} />
                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: "500",
                        lineHeight: "24px" /* 150% */,
                        letterSpacing: "0.15px",
                        color: "#919093",
                      }}
                    >
                      People
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#1A202C",
                      }}
                    >
                      Daily rent
                    </p>
                    <p
                      style={{
                        fontSize: "22px",
                        fontWeight: "700",
                        color: "#1A202C",
                      }}
                    >
                      190 ETB
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      width: "100px",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "8px",
                      border: "1px solid  #747781",
                      background: "#00173C",
                      color: "white",
                    }}
                  >
                    Active
                  </div>
                </div>

                <button
                  style={{
                    border: "none",
                    width: "100%",
                    marginTop: "12px",
                    alignSelf: "stretch",
                    backgroundColor: "#00173C",
                    color: "white",
                    paddingTop: "20px",
                    paddingBottom: "20px",
                    borderRadius: "20px",
                    cursor: "pointer"
                  }}
                >
                  See Details
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            boxShadow: "0px 4px 30px 0px rgba(221, 224, 255, 0.54)",
            width: "100%",
            height: "700px",
          }}
        ></div>
      </div>
    </div>
  );
}

export default BookingRequests;
