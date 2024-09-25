import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Snackbar,
  Switch,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { DateRangePicker } from "rsuite";
import CloseIcon from "@mui/icons-material/Close";

function StepFive({
  activeStep,
  handleBackStep,
  formValues,
  handleChange,
  styles,
  handleNextStep,
  setAvailabilityDate,
  availabilityDate,
  handleSwitchChange,
}) {
  const [error, setError] = useState();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleNext = () => {
    if (!formValues.periodDuration) {
      setError("Duration is required");
      setOpenSnackbar(true);
      return;
    }

    if (!availabilityDate) {
      setError("Availability date  is required");
      setOpenSnackbar(true);
      return;
    }

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
            fontSize: "30px",
            fontWeight: "700",
          }}
        >
          Availability
        </h1>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <h1 style={{ fontSize: "20px" }}>Advanced Notice Period</h1>

          <div>
            <FormControl fullWidth>
              <label style={{ fontSize: "14px" }}>
                How long in advance do you need to be notified before a trip
                starts
              </label>

              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formValues.periodDuration}
                placeholder="Set period duration"
                name="periodDuration"
                onChange={handleChange}
              >
                <MenuItem value={"1 day ahead of booking"}>
                  1 Day ahead of booking
                </MenuItem>
                <MenuItem value={"2 day ahead of booking"}>
                  2 Day ahead of booking
                </MenuItem>
                <MenuItem value={"3 day ahead of booking"}>
                  3 Day ahead of booking
                </MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            marginTop: "15px",
          }}
        >
          <h1 style={{ fontSize: "20px" }}>Set Car Availability Dates</h1>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label style={{ fontSize: "14px" }}>
              Select a date range to set your car’s available rent dates
            </label>

            <DateRangePicker
              onChange={(value) => {
                console.log(value, "value");
                setAvailabilityDate(value);
              }}
            />

            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    // checked={instantBooking}
                    onChange={handleSwitchChange}
                  />
                }
                label="Instant booking"
              />
            </FormGroup>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            marginTop: "15px",
          }}
        >
          <h1 style={{ fontSize: "20px" }}>Pricing</h1>
          <p
            style={{
              padding: "10px 6px",
              borderRadius: "4px",
              backgroundColor: "#D2E4FF",
            }}
          >
            When inputting a price please be aware there will be a price
            deduction on the price you will be inputting.
          </p>
          <div>
            <label style={{ fontSize: "14px" }}>
              Set daily price for your car
            </label>

            <TextField
              fullWidth
              name="price"
              value={formValues.price}
              onChange={handleChange}
              InputLabelProps={{ shrink: true, fontSize: "12px" }}
              style={styles.textField}
              type="number"
            />
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

export default StepFive;
