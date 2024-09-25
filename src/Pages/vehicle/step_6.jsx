import { Grid } from "@mui/material";
import { Plus, X } from "lucide-react";
import React from "react";

function StepSix({
  activeStep,
  handleOpen,
  handleBackStep,
  handleNextStep,
  pickup,
  dropoff,
  handleRemove,
}) {
  return (
    <div>
      <h1
        style={{
          fontSize: "28px",
          fontWeight: "400",
        }}
      >
        Steps {activeStep} of 7
      </h1>

      <h1
        style={{
          fontSize: "30px",
          fontWeight: "700",
        }}
      >
        Pick up and Drop off locations
      </h1>

      <button
        style={{
          padding: "5px",
          width: "100%",
          backgroundColor: "#FAF9FE",
          border: "1px solid #B2C8FF",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0px 4px 30px 0px rgba(221, 224, 255, 0.54)",
          borderRadius: "5px",
          gap: "10px",
          fontSize: "14px",
          marginTop: "20px",
        }}
        onClick={handleOpen}
      >
        <Plus />
        <p>Add Location</p>
      </button>

      <div
        style={{
          marginTop: "20px",
          border: "1px solid #B2C8FF",
          padding: "10px",
          borderRadius: "4px",
          width: "100%",
        }}
      >
        <h1 style={{ fontSize: "20px" }}>Pick up and Drop off locations</h1>

        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          {pickup.map((pick) => (
            <div
              key={pick.id}
              style={{
                width: "auto",
                border: "1px solid #747781",
                borderRadius: "8px",
                padding: "0px 10px",
                marginTop: "12px",
                cursor: "pointer",
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
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={() => handleRemove(pick.id, "pickup")}
                >
                  <X />
                </div>
                <p
                  style={{
                    fontSize: "14px",
                  }}
                >
                  {pick.address}
                </p>
              </div>
            </div>
          ))}

          {dropoff.map((drop) => (
            <div
              key={drop.id}
              style={{
                width: "auto",
                border: "1px solid #747781",
                borderRadius: "8px",
                padding: "0px 10px",
                marginTop: "12px",
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
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => handleRemove(drop.id, "dropoff")}
                >
                  <X />
                </div>
                <p
                  style={{
                    fontSize: "14px",
                  }}
                >
                  {drop.address}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",

          gap: "14px",
          width: "100%",
        }}
      >
        <div
          style={{
            marginTop: "20px",
            border: "1px solid #B2C8FF",
            padding: "10px",
            borderRadius: "4px",
            width: "100%",
          }}
        >
          <h1 style={{ fontSize: "20px" }}>Pick up Locations</h1>

          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            {pickup.map((pick) => (
              <div
                key={pick.id}
                style={{
                  width: "auto",
                  border: "1px solid #747781",
                  borderRadius: "8px",
                  padding: "0px 10px",
                  marginTop: "12px",
                  cursor: "pointer",
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                    onClick={() => handleRemove(pick.id, "pickup")}
                  >
                    <X />
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
                    }}
                  >
                    {pick.address}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            marginTop: "20px",
            border: "1px solid #B2C8FF",
            padding: "10px",
            borderRadius: "4px",
            width: "100%",
          }}
        >
          <h1 style={{ fontSize: "20px" }}>Drop off locations</h1>

          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            {dropoff.map((drop) => (
              <div
                key={drop.id}
                style={{
                  width: "auto",
                  border: "1px solid #747781",
                  borderRadius: "8px",
                  padding: "0px 10px",
                  marginTop: "12px",
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => handleRemove(drop.id, "dropoff")}
                  >
                    <X />
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
                    }}
                  >
                    {drop.address}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* </div> */}
      </div>

      <div
        style={{
          marginTop: "20px",
        }}
      >
        <Grid container spacing={2}>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            {activeStep > 1 ? (
              <button
                onClick={handleBackStep}
                style={{
                  border: "1px solid #00173C",
                  background: "white",
                  color: "black",
                  borderRadius: "2rem",
                  padding: "1rem 8rem",
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
              >
                Back
              </button>
            ) : null}

            <button
              style={{
                backgroundColor: "#00173C",
                color: "white",
                borderRadius: "2rem",
                padding: "1rem 8rem",
                fontSize: "1rem",
                cursor: "pointer",
              }}
              onClick={handleNextStep}
            >
              Continue
            </button>
          </div>
        </Grid>
      </div>
    </div>
  );
}

export default StepSix;
