import {
  AirlineSeatReclineExtra,
  LocalGasStation,
  WbIridescent,
} from "@mui/icons-material";
import {
  CardMedia,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Fuel, LifeBuoy, Tag, User } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchListing } from "../../store/slices/listingSlice";

const steps = [
  {
    label: "Select campaign settings",
    description: `For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.`,
  },
  {
    label: "Create an ad group",
    description:
      "An ad group contains one or more ads which target a shared set of keywords.",
  },
  {
    label: "Create an ad",
    description: `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`,
  },
];

function MyListing() {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleViewDetails = (index) => {
    console.log(index , "index")
    setActiveStep(index);
  };

  const dispatch = useDispatch();

  const myListing = useSelector((state) => state.listing.listings);

  console.log(myListing, "mylisting")
  useEffect(() => {
    dispatch(fetchListing());
  }, []);

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
            My Listing
          </h1>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              gap: "15px"
            }}
          >
            {myListing.map((listing, index) => (
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
                    {listing.make} {listing.model}
                  </h3>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      lineHeight: "24px",
                      letterSpacing: "0.15px",
                      color: "#90A3BF",
                    }}
                  >
                    {listing.category}
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
                          lineHeight: "24px" ,
                          letterSpacing: "0.15px",
                          color: "#919093",
                        }}
                      >
                        {listing.fuelType}
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
                          lineHeight: "24px",
                          letterSpacing: "0.15px",
                          color: "#919093",
                        }}
                      >
                        {listing.transmission}
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
                        {listing.seats} People
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
                    onClick={() => handleViewDetails(index)}
                  >
                    See Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {myListing.length > 0 ? (
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
                Listing Details
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
                <div>
                  <CardMedia
                    component={"img"}
                    height={440}
                    image="https://imgd.aeplcdn.com/370x208/n/cw/ec/139651/curvv-exterior-right-front-three-quarter.jpeg?isig=0&q=80"
                  />
                </div>
                <div
                  stle={{
                    width: "100%",
                    border: "1px solid red",
                  }}
                ></div>
              </div>

              <div>
                <div
                  style={{
                    width: "30%",
                  }}
                >
                  <FormControl fullWidth>
                    <InputLabel
                      sx={{
                        fontSize: "12px",
                      }}
                    >
                      Status
                    </InputLabel>
                    <Select name="seats" label="Select type">
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                <div style={{ marginTop: "10px" }}>
                  <h1 style={{ fontSize: "28px" }}>
                    {" "}
                    {myListing[activeStep].model} {myListing[activeStep].make}
                  </h1>

                  <div
                    style={{
                      display: "flex",
                      gap: "30px",
                      flexWrap: "wrap",
                    }}
                  >
                    <Chip
                      sx={{
                        backgroundColor: "#D8E2FF",
                        fontSize: "16px",
                        fontWeight: "500",
                        borderRadius: "5px",
                        padding: "4px",
                      }}
                      icon={<Tag size={16} />}
                      label={`${1800} $`}
                    />

                    <Chip
                      sx={{
                        backgroundColor: "#fff",
                        fontSize: "16px",
                        fontWeight: "500",
                      }}
                      icon={<LocalGasStation style={{ fontSize: "16px" }} />}
                      label={"Gasoline"}
                    />

                    <Chip
                      sx={{
                        backgroundColor: "#fff",
                        fontSize: "16px",
                        fontWeight: "500",
                      }}
                      icon={
                        <AirlineSeatReclineExtra style={{ fontSize: "16px" }} />
                      }
                      label={`${4} Seats`}
                    />

                    <Chip
                      sx={{
                        backgroundColor: "#fff",
                        fontSize: "16px",
                        fontWeight: "500",
                      }}
                      icon={<WbIridescent style={{ fontSize: "16px" }} />}
                      label="Manual"
                    />
                  </div>
                </div>

                <div style={{ marginTop: "20px" }}>
                  <h1 style={{ fontSize: "24px" }}>Car Specification</h1>
                  <div
                    style={{
                      display: "flex",
                      gap: "94px",
                      marginTop: "16px",
                      width: "100%",
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
                        Car Make
                      </p>
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: "400",
                          letterSpacing: "0.25px",
                          lineHeight: "20px",
                        }}
                      >
                        {myListing[activeStep].make}
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
                        {myListing[activeStep].model}
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
                        Year
                      </p>
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: "400",
                          letterSpacing: "0.25px",
                          lineHeight: "20px",
                        }}
                      >
                        {myListing[activeStep].manufaturingDate}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h1 style={{ fontSize: "24px" }}>Features</h1>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "auto",
                        // maxWidth: "70px",
                        border: "1px solid #747781",
                        borderRadius: "8px",
                        padding: "0px 10px",
                        //   marginTop: "12px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                          gap: "2px",
                          width: "100%",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "14px",
                          }}
                        >
                          {"GPS"}
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        width: "auto",
                        // maxWidth: "70px",
                        border: "1px solid #747781",
                        borderRadius: "8px",
                        padding: "0px 10px",
                        //   marginTop: "12px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                          gap: "2px",
                          width: "100%",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "14px",
                          }}
                        >
                          {"4WD"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default MyListing;
