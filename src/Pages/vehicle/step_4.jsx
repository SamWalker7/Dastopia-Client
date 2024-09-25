import { Autocomplete, Grid, TextField } from "@mui/material";
import { Plus, Search, X } from "lucide-react";
import React, { useState } from "react";

function StepFour({
  styles,
  activeStep,
  handleBackStep,
  handleNextStep,
  handleAddFeature,
  formValues,
  handleChange,
  inputValue,
  selectedFeatures,
  handleRemoveTags,
}) {
  const features = ["GPS", "Extra Luggage", "Auto Parking", "Label"];

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
          fontSize: "57px",
          fontWeight: "700",
        }}
      >
        Car Features
      </h1>

      <div>
        <div
          style={{
            marginBottom: "4px",
          }}
        >
          <p
            style={{
              fontSize: "16px",
            }}
          >
            Please enter your car's basic information below
          </p>
        </div>
        <div
          style={{
            width: "100%",
            maxWidth: "80%",
          }}
        >
          <Autocomplete
            freeSolo
            options={features}
            onChange={handleAddFeature}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search locations"
                style={{
                  width: "100%",
                  padding: "8px",
                  fontSize: "16px",
                  marginBottom: "10px",
                }}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: <Search />,
                }}
              />
            )}
          />
        </div>
      </div>

      <div style={{ display: "flex", marginTop: "4px", gap: "10px" }}>
        {selectedFeatures.map((feature) => (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              backgroundColor: "#2260A8",
              padding: "0px 15px",
              alignItems: "center",
              borderRadius: "3rem",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", cursor: "pointer", flexWrap:"wrap" }}
              onClick={() => handleRemoveTags(feature)}
            >
              <X color="white" width={20} height={20} />
            </div>
            <p
              style={{
                fontSize: "14px",
                color: "white",
              }}
            >
              {feature}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "25px",
          marginBottom: "15px",
        }}
      >
        <p style={{ fontSize: "16px" }}>Suggestions</p>




        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          {features.map((feat) => (
            <div
              style={{
                width: "auto",
                // maxWidth: "70px",
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
                <div style={{display: "flex", alignItems: "center", cursor: "pointer"}} onClick={(e) => handleAddFeature(e, feat)}>
                  <Plus />
                </div>
                <p
                  style={{
                    fontSize: "14px",
                  }}
                >
                  {feat}
                </p>
              </div>
            </div>
          ))}
        </div>


        
      </div>

      <div>
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

export default StepFour;
