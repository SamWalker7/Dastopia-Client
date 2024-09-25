import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import makes from "./makes";
import models from "./model";
import CloseIcon from "@mui/icons-material/Close";

function StepOne({
  activeStep,
  formValues,
  styles,
  handleChange,
  handleNextStep,
  handleFileChange,
  carPictures,
 
}) {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [error, setError] = useState(null);

  const handleNext = () => {
   
    if (formValues.carType === "") {
      setError("Car type is required");
      setOpenSnackbar(true);
      return;
    }
    if (!formValues.fuelType) {
      setError("Fuel type is required");
      setOpenSnackbar(true);
      return;
    }
    if (!formValues.transmissionType) {
      setError("Transmission type is required");
      setOpenSnackbar(true);
      return;
    }
    if (!formValues.manufacturingDate) {
      setError("Manufacturing date is required");
      setOpenSnackbar(true);
      return;
    }
    if (!formValues.totalMileage) {
      setError("Total milage is required");
      setOpenSnackbar(true);
      return;
    }
    if (!formValues.make) {
      setError("Car make is required");
      setOpenSnackbar(true);
      return;
    }
    if (!formValues.model) {
      setError("Car model is required");
      setOpenSnackbar(true);
      return;
    }
    if (!formValues.color) {
      setError("Car color is required");
      setOpenSnackbar(true);
      return;
    }
    if (!formValues.doors) {
      setError("Car doors are required");
      setOpenSnackbar(true);
      return;
    }

    if (carPictures.length <= 0) {
      setError("Atleast one picture is required");
      setOpenSnackbar(true);
      return;
    }
    console.log("here", formValues.carType === "");
    
    handleNextStep();
  };

  const handleSnakbarClose = () => {
    setOpenSnackbar(false);
  };

  const action = (
    <div
      style={{
        paddig: "140px",
      }}
    >
      <Button color="secondary" size="small" onClick={handleSnakbarClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleSnakbarClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </div>
  );
  return (
    <>
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
            marginBottom: "30px",
          }}
        >
          Car detail
        </h1>

        <div>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel
                  sx={{
                    fontSize: "12px",
                  }}
                >
                  Car Type
                </InputLabel>
                <Select
                  value={formValues.carType}
                  onChange={handleChange}
                  name="carType"
                  label="Select type"
                  style={styles.selectField}
                >
                  <MenuItem value="SUV">SUV</MenuItem>
                  <MenuItem value="Sedan">Sedan</MenuItem>
                  <MenuItem value="Hatchback">Hatchback</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel
                  sx={{
                    fontSize: "12px",
                  }}
                >
                  Fuel Type
                </InputLabel>
                <Select
                  value={formValues.fuelType}
                  onChange={handleChange}
                  name="fuelType"
                  label="Fuel Type"
                  style={styles.selectField}
                >
                  <MenuItem value="Petrol">Gasoline</MenuItem>
                  <MenuItem value="Diesel">Diesel</MenuItem>
                  <MenuItem value="Electric">Hybrid</MenuItem>
                  <MenuItem value="Electric">Electric</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <div
              style={{
                display: "flex",
                width: "100%",
                paddingLeft: "15px",
                gap: "18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  gap: "10px",
                }}
              >
                <FormControl fullWidth>
                  <InputLabel
                    sx={{
                      fontSize: "12px",
                    }}
                  >
                    Transmission Type
                  </InputLabel>
                  <Select
                    value={formValues.transmissionType}
                    onChange={handleChange}
                    name="transmissionType"
                    label="Transmission Type"
                    style={styles.selectField}
                  >
                    <MenuItem value="Automatic">Automatic</MenuItem>
                    <MenuItem value="Manual">Manual</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Year"
                  type="date"
                  name="manufacturingDate"
                  value={formValues.manufacturingDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true, fontSize: "12px" }}
                  style={styles.textField}
                />
              </div>

              <div
                style={{
                  width: "100%",
                }}
              >
                <TextField
                  fullWidth
                  label="Total Mileage (Km)"
                  name="totalMileage"
                  value={formValues.totalMileage}
                  onChange={handleChange}
                  style={styles.textField}
                  InputLabelProps={{
                    fontSize: "12px",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                width: "100%",
                paddingLeft: "15px",
                gap: "18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  gap: "10px",
                }}
              >
                <FormControl fullWidth>
                  <InputLabel
                    sx={{
                      fontSize: "12px",
                    }}
                  >
                    Make
                  </InputLabel>
                  <Select
                    value={formValues.make}
                    onChange={handleChange}
                    name="make"
                    label="Make"
                    style={styles.selectField}
                  >
                    {makes.map((make) => (
                      <MenuItem key={make.make_id} value={make.make_display}>
                        {make.make_display}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel
                    sx={{
                      fontSize: "12px",
                    }}
                  >
                    Model
                  </InputLabel>
                  <Select
                    value={formValues.model}
                    onChange={handleChange}
                    name="model"
                    label="Model"
                    style={styles.selectField}
                    disabled={formValues.make ? false : true}
                  >
                    {models[formValues?.make]?.map((model) => (
                      <MenuItem key={model} value={model}>
                        {model}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div
                style={{
                  width: "100%",
                }}
              >
                <TextField
                  fullWidth
                  label="Color"
                  name="color"
                  value={formValues.color}
                  onChange={handleChange}
                  style={styles.textField}
                  InputLabelProps={{
                    fontSize: "12px",
                  }}
                />
              </div>
            </div>
            <div
              style={{
                width: "100%",
              }}
            >
              <div
                style={{
                  paddingLeft: "15px",
                  display: "flex",
                  gap:"20px"
                }}
              >
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel
                      sx={{
                        fontSize: "12px",
                      }}
                    >
                      Doors
                    </InputLabel>
                    <Select
                      value={formValues.doors}
                      onChange={handleChange}
                      name="doors"
                      label="Select type"
                      style={styles.selectField}
                    >
                      <MenuItem value="2">2</MenuItem>
                      <MenuItem value="4">4</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel
                      sx={{
                        fontSize: "12px",
                      }}
                    >
                      Seats
                    </InputLabel>
                    <Select
                      value={formValues.seats}
                      onChange={handleChange}
                      name="seats"
                      label="Select type"
                      style={styles.selectField}
                    >
                      <MenuItem value="2">2</MenuItem>
                      <MenuItem value="4">4</MenuItem>
                      <MenuItem value="8">8</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </div>
            </div>

            <div style={styles.buttonContainer}>
              <Button
                variant="contained"
                component="label"
                style={styles.uploadButton}
              >
                {carPictures.length <= 0 ? (
                  <p>Upload Pictures</p>
                ) : (
                  <p>{carPictures.length} Pictures uploaded</p>
                )}
                <input
                  onChange={handleFileChange}
                  type="file"
                  hidden
                  multiple
                />
              </Button>
            </div>

            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <button
                style={{
                  backgroundColor: "#00173C",
                  color: "white",
                  borderRadius: "2rem",
                  padding: "1rem 8rem",
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
                onClick={handleNext}
              >
                Continue
              </button>
            </div>
          </Grid>
        </div>
      </div>
      <Box sx={{ width: 500 }}>
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={openSnackbar}
          autoHideDuration={2000}
          onClose={handleSnakbarClose}
          message={error}
          action={action}
          key={"bottom" + "right"}
          height={500}
        />
      </Box>
    </>
  );
}

export default StepOne;
