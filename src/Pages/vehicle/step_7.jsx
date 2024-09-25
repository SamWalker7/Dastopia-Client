import {
  AirlineSeatReclineExtra,
  LocalGasStation,
  WbIridescent,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import { Tag } from "lucide-react";
import React from "react";

function StepSeven({
  activeStep,
  styles,
  handleBackStep,
  handleNextStep,
  formValues,
  selectedFeatures,
  handleSubmit
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
          fontSize: "57px",
          fontWeight: "700",
        }}
      >
        Summary
      </h1>

      <Box style={styles.c_container}>
        <Grid container spacing={4} style={styles.gridContainer}>
          <Grid item xs={10} sm={4}>
            <Card style={styles.card}>
              <CardMedia
                component="img"
                height="250"
                image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScOFHqTcy4k9bm1p7MgKJNRlmuaCpZDgSzTw&s"
                alt="Car Image"
                style={styles.image}
              />
            </Card>

            <div
              style={{
                display: "flex",
                maxWidth: "200px",
                gap: "5px",
                marginTop: "10px",
              }}
            >
              <Card style={styles.in_card}>
                <CardMedia
                  component="img"
                  height="50"
                  image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScOFHqTcy4k9bm1p7MgKJNRlmuaCpZDgSzTw&s"
                  alt="Car Image"
                  style={styles.in_image}
                />
              </Card>
              <Card style={styles.in_card}>
                <CardMedia
                  component="img"
                  height="50"
                  image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScOFHqTcy4k9bm1p7MgKJNRlmuaCpZDgSzTw&s"
                  alt="Car Image"
                  style={styles.in_image}
                />
              </Card>
              <Card style={styles.in_card}>
                <CardMedia
                  component="img"
                  height="50"
                  image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScOFHqTcy4k9bm1p7MgKJNRlmuaCpZDgSzTw&s"
                  alt="Car Image"
                  style={styles.in_image}
                />
              </Card>
            </div>
          </Grid>

          <Grid item xs={12} sm={6}>
            <CardContent style={styles.content}>
              <Typography variant="h6" style={styles.carTitle}>
                {formValues.make} {formValues.model}
              </Typography>

              <Box style={styles.features}>
                <Chip
                  sx={{
                    backgroundColor: "#D8E2FF",
                    fontSize: "16px",
                    fontWeight: "500",
                    borderRadius: "5px",
                    padding: "4px",
                  }}
                  icon={<Tag size={16} />}
                  label={`${formValues?.price} $`}
                />
                <Chip
                  sx={{
                    backgroundColor: "#fff",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                  icon={<LocalGasStation style={{ fontSize: "16px" }} />}
                  label={formValues?.fuelType}
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
                  label={`${formValues.seats} Seats`}
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
              </Box>

              <Typography variant="body1" style={styles.specTitle}>
                Car Specification
              </Typography>
              <Box style={styles.specs}>
                <Box style={styles.spec}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "16px",
                      fontWeight: "700",
                    }}
                  >
                    Car Brand
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "16px",
                      fontWeight: "500",
                    }}
                  >
                    {formValues.make}
                  </Typography>
                </Box>
                <Box style={styles.spec}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "16px",
                      fontWeight: "700",
                    }}
                  >
                    Car Model
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "16px",
                      fontWeight: "500",
                    }}
                  >
                    {formValues.make}
                  </Typography>
                </Box>
                <Box style={styles.spec}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "16px",
                      fontWeight: "700",
                    }}
                  >
                    Manufacture Date
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "16px",
                      fontWeight: "500",
                    }}
                  >
                    {formValues.manufacturingDate}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body1" style={styles.featuresTitle}>
                Features
              </Typography>
              <Box style={styles.featureChips}>
                {selectedFeatures.map((feat) => (
                  <Chip
                    sx={{
                      backgroundColor: "#fff",
                      fontSize: "16px",
                      border: "1px solid black",
                      borderRadius: "5px",
                    }}
                    label={feat}
                  />
                ))}
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </Box>

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
                  cursor: "pointer",
                }}
              >
                Back
              </button>
            ) : null}

            {activeStep !== 7 ? (
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
            ) : null}

            {activeStep === 7 ? (
              <button
                style={{
                  backgroundColor: "#00173C",
                  color: "white",
                  borderRadius: "2rem",
                  padding: "1rem 8rem",
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
                onClick={handleSubmit}
              >
                Submit
              </button>
            ) : null}
          </div>
        </Grid>
      </div>
    </div>
  );
}

export default StepSeven;
