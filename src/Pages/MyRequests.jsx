import { Message } from "@mui/icons-material";
import { Avatar, Box, Step, StepLabel, Stepper } from "@mui/material";
import { Fuel, LifeBuoy, Mail, Map, Phone, User } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookingRequests } from "../store/slices/bookingRequestSlice";

function MyRequests() {
  const [activeStep, setActiveStep] = React.useState(3);

 

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  return (
    <div
      style={{
        paddingTop: "120px",
        paddingLeft: "50px",
        paddingRight: "50px",
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
            padding: "25px",
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
                borderRadius: "10px",
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
                    cursor: "pointer",
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
            height: "auto",
            padding: "25px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              width: "100%",
            }}
          >
            <h1
              style={{
                fontSize: "32px",
                fontWeight: "700",
                lineHeight: "40px",
              }}
            >
              Booking Details
            </h1>
            <div
              style={{
                display: "flex",
                gap: "20px",
                width: "100%",
                padding: "16px",
                backgroundColor: "#FFFFFF",
              }}
            >
              <div
                style={{
                  width: "100%",
                  boxShadow: "0px 4px 30px 0px rgba(221, 224, 255, 0.54)",
                  padding: "16px",
                }}
              >
                <h2
                  style={{
                    fontSize: "22px",
                    fontWeight: "700",
                    lineHeight: "28px",
                    color: "#000",
                  }}
                >
                  Request Summary
                </h2>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "24px",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: "700",
                          letterSpacing: "0.25px",
                          lineHeight: "20px",
                        }}
                      >
                        Request status
                      </p>
                      <p
                        style={{
                          fontSize: "14px",
                          fonrWeight: "400",
                          letterSpacing: "0.25px",
                          lineHeight: "20px",
                        }}
                      >
                        Pending
                      </p>
                    </div>

                    <div>
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: "700",
                        }}
                      >
                        Request Date and Time
                      </p>
                      <p
                        style={{
                          fontSize: "14px",
                          fonrWeight: "400",
                        }}
                      >
                        Jun 12, 2024 3:00AM
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: "#D2E4FF",
                      padding: "6px 16px 6px 16px",
                      borderRadius: "",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    Booking Pending
                  </div>
                </div>
                <div
                  style={{
                    marginTop: "32px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      letterSpacing: "0.25px",
                      lineHeight: "20px",
                    }}
                  >
                    Car Details
                  </p>

                  <div
                    style={{
                      display: "flex",
                      gap: "24px",
                      marginTop: "16px",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: "700",
                          letterSpacing: "0.25px",
                          lineHeight: "20px",
                        }}
                      >
                        Car brand
                      </p>
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: "400",
                          letterSpacing: "0.25px",
                          lineHeight: "20px",
                        }}
                      >
                        Tesla EV
                      </p>
                    </div>

                    <div>
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: "700",
                          letterSpacing: "0.25px",
                          lineHeight: "20px",
                        }}
                      >
                        Car Model
                      </p>
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: "400",
                          letterSpacing: "0.25px",
                          lineHeight: "20px",
                        }}
                      >
                        Car Brand
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      marginTop: "24px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "700",
                        letterSpacing: "0.25px",
                        lineHeight: "20px",
                      }}
                    >
                      Pictures
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "400",
                        letterSpacing: "0.25px",
                        lineHeight: "20px",
                        textDecorationLine: "underline",
                      }}
                    >
                      View Pictures
                    </p>
                  </div>
                </div>
              </div>

              <div
                style={{
                  width: "100%",
                  boxShadow: "0px 4px 30px 0px rgba(221, 224, 255, 0.54)",
                  padding: "16px",
                }}
              >
                <p
                  style={{
                    fontSize: "22px",
                    fontWeight: "700",
                    lineHeight: "28px",
                    color: "#000",
                  }}
                >
                  Rental Details
                </p>
                <div>
                  <Box sx={{ maxWidth: 400 }}>
                    <Stepper orientation="vertical">
                      <Step
                        key="1"
                        sx={{
                          "& .MuiStepIcon-root": {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "gray", // All step icons will have this color
                            border: "none",
                            borderRadius: "50%",
                          },
                          "& .MuiStepIcon-text": {
                            display: "none", // Hide the step number inside the circle
                          },
                          "& .MuiStepLabel-root": {
                            color: "#000000", // All step labels will have this color
                            fontWeight: "normal",
                            "&.Mui-active": {
                              color: "#000", // Active step label color
                            },
                            "&.Mui-completed": {
                              color: "#000", // Completed step label color
                            },
                            "&.Mui-disabled": {
                              color: "#000", // Inactive step label color
                            },
                          },
                        }}
                      >
                        <StepLabel>
                          <div>
                            <p
                              style={{
                                fontSize: "16px",
                                fontWeight: "400",
                                letterSpacing: "0.25px",
                                lineHeight: "20px",
                              }}
                            >
                              Sunday, Jun 30 10:00AM
                            </p>
                            <p
                              style={{
                                fontSize: "14px",
                                fontWeight: "700",
                                color: "#5E5E61",
                              }}
                            >
                              Bole International Airport
                            </p>
                            <p
                              style={{
                                fontSize: "12px",
                                fontWeight: "400",
                                letterSpacing: "0.25px",
                                lineHeight: "20px",
                                color: "#16366D",
                                textDecorationLine: "underline",
                              }}
                            >
                              View pickup detail instruction
                            </p>
                          </div>
                        </StepLabel>
                      </Step>

                      <Step
                        key="1"
                        sx={{
                          "& .MuiStepIcon-root": {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "gray", // All step icons will have this color
                            border: "none",
                            borderRadius: "50%",
                          },
                          "& .MuiStepIcon-text": {
                            display: "none", // Hide the step number inside the circle
                          },
                          "& .MuiStepLabel-root": {
                            color: "#000000", // All step labels will have this color
                            fontWeight: "normal",
                            "&.Mui-active": {
                              color: "#000", // Active step label color
                            },
                            "&.Mui-completed": {
                              color: "#000", // Completed step label color
                            },
                            "&.Mui-disabled": {
                              color: "#000", // Inactive step label color
                            },
                          },
                        }}
                      >
                        <StepLabel>
                          <div>
                            <p
                              style={{
                                fontSize: "16px",
                                fontWeight: "400",
                                letterSpacing: "0.25px",
                                lineHeight: "20px",
                              }}
                            >
                              Sunday, Jun 30 8:00PM
                            </p>
                            <p
                              style={{
                                fontSize: "14px",
                                fontWeight: "700",
                                color: "#5E5E61",
                              }}
                            >
                              Bole International Airport
                            </p>
                            <p
                              style={{
                                fontSize: "12px",
                                fontWeight: "400",
                                letterSpacing: "0.25px",
                                lineHeight: "20px",
                                color: "#16366D",
                                textDecorationLine: "underline",
                              }}
                            >
                              View pickup detail instruction
                            </p>
                          </div>
                        </StepLabel>
                      </Step>
                    </Stepper>
                  </Box>
                </div>

                <div
                  style={{
                    marginTop: "26px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      letterSpacing: "0.25px",
                      lineHeight: "20px",
                      color: "#000",
                    }}
                  >
                    Driver Request
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "400",
                      letterSpacing: "0.25px",
                      lineHeight: "20px",
                      color: "#000",
                    }}
                  >
                    Yes
                  </p>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "20px",
                marginTop: "20px",
                boxShadow: "0px 4px 30px 0px rgba(221, 224, 255, 0.54)",
                padding: "25px",
              }}
            >
              <div
                style={{
                  maxWidth: "180px",
                  maxHheight: "180px",
                }}
              >
                <Avatar
                  sx={{
                    width: "180px",
                    height: "180px",
                  }}
                  alt="Remy Sharp"
                  src="/static/images/avatar/1.jpg"
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <p
                  style={{
                    fontSize: "22px",
                    fontWeight: "700",
                    letterSpacing: "0.25px",
                    lineHeight: "20px",
                    color: "#000",
                  }}
                >
                  Rentee Details
                </p>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "30px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                      }}
                    >
                      <User />
                      <p
                        style={{
                          fontSize: "16px",
                          fontWeight: "400",
                          letterSpacing: "0.25px",
                          lineHeight: "20px",
                          color: "#000",
                        }}
                      >
                        Steven Gerard
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                      }}
                    >
                      <Phone />
                      <p
                        style={{
                          fontSize: "16px",
                          fontWeight: "400",
                          letterSpacing: "0.25px",
                          lineHeight: "20px",
                          color: "#000",
                        }}
                      >
                        +2519 66748642
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "30px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                      }}
                    >
                      <Mail />
                      <p
                        style={{
                          fontSize: "16px",
                          fontWeight: "400",
                          letterSpacing: "0.25px",
                          lineHeight: "20px",
                          color: "#000",
                        }}
                      >
                        JhondoE@gmail.com
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                      }}
                    >
                      <Map />
                      <p
                        style={{
                          fontSize: "16px",
                          fontWeight: "400",
                          letterSpacing: "0.25px",
                          lineHeight: "20px",
                          color: "#000",
                        }}
                      >
                        Addis Ababa, Ethiopia
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "5px",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "20px 66px 20px 66px",
                    // height: "20px",
                    border: "1px solid #747781",
                    borderRadius: "100px",
                  }}
                >
                  <Message />
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      letterSpacing: "0.25px",
                      lineHeight: "20px",
                      color: "#000",
                    }}
                  >
                    Chat with Owner
                  </p>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "16px",
                marginTop: "10px",
              }}
            >
              <button
                style={{
                  width: "100%",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  backgroundColor: "#FFDAD6",
                  border: "1px solid #410002",
                  borderRadius: "50rem",
                  cursor: "pointer",
                }}
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyRequests;
