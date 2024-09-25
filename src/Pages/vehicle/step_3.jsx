import { ForwardToInbox } from "@mui/icons-material";
import { Box, Button, Grid, IconButton, Snackbar } from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

function StepThree({
  activeStep,
  handleBackStep,
  handleNextStep,
  styles,
  handleFilesChange,
  documents,
}) {
  const [error, setError] = useState();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const handleSnakbarClose = () => {
    setOpenSnackbar(false);
  };
  const handleNext = () => {
    if (!documents.libre) {
      setError("Car Libre  is required");
      setOpenSnackbar(true);
      return;
    }
    if (!documents.license) {
      setError("License Document  is required");
      setOpenSnackbar(true);
      return;
    }

    if (!documents.insurance) {
      setError("Insurance Document  is required");
      setOpenSnackbar(true);
      return;
    }

    if (!documents.driverLicense) {
      setError("Driver License Document  is required");
      setOpenSnackbar(true);
      return;
    }

    if (!documents.plateNumber) {
      setError("Plate Number Document  is required");
      setOpenSnackbar(true);
      return;
    }

    handleNextStep();
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
          }}
        >
          Upload Documents
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "15px",
            alignItems: "start",
            justifyContent: "start",
            marginBottom: "10px",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
            }}
          >
            <div style={{ width: "30%" }}>
              <p
                style={{
                  fontSize: "14px",
                  width: "100%",
                }}
              >
                Libre Document
              </p>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                border: "1px dashed black",
                padding: "10px",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "2px",
                  width: "100%",
                }}
              >
                <div style={styles.iconContainer}>
                  <ForwardToInbox style={styles.icon} />
                </div>
                <div style={styles.fileInputContainer}>
                  <label style={styles.label} htmlFor="libre">
                    {!documents.libre ? (
                      <p>
                        <span style={{ color: "#005FAD" }}>Click here </span> to
                        upload or drop files here
                      </p>
                    ) : (
                      <p>{documents.libre?.name}</p>
                    )}
                  </label>
                  <input
                    type="file"
                    name="libre"
                    id="libre"
                    onClick={(e) => handleFilesChange(e)}
                    style={styles.fileInput}
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
            }}
          >
            <div style={{ width: "30%" }}>
              <p
                style={{
                  fontSize: "14px",
                  width: "100%",
                }}
              >
                License Document
              </p>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                border: "1px dashed black",
                padding: "10px",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "2px",
                  width: "100%",
                }}
              >
                <div style={styles.iconContainer}>
                  <ForwardToInbox style={styles.icon} />
                </div>
                <div style={styles.fileInputContainer}>
                  <label style={styles.label} htmlFor="license">
                    {!documents.license ? (
                      <p>
                        <span style={{ color: "#005FAD" }}>Click here </span> to
                        upload or drop files here
                      </p>
                    ) : (
                      <p>{documents.license?.name}</p>
                    )}
                  </label>
                  <input
                    type="file"
                    id="license"
                    name="license"
                    style={styles.fileInput}
                    onClick={(e) => handleFilesChange(e)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
            }}
          >
            <div style={{ width: "30%" }}>
              <p
                style={{
                  fontSize: "14px",
                  width: "100%",
                }}
              >
                Insurance Document
              </p>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                border: "1px dashed black",
                padding: "10px",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "2px",
                  width: "100%",
                }}
              >
                <div style={styles.iconContainer}>
                  <ForwardToInbox style={styles.icon} />
                </div>
                <div style={styles.fileInputContainer}>
                  <label style={styles.label} htmlFor="insurance">
                    {!documents.insurance ? (
                      <p>
                        <span style={{ color: "#005FAD" }}>Click here </span> to
                        upload or drop files here
                      </p>
                    ) : (
                      <p>{documents.insurance?.name}</p>
                    )}
                  </label>
                  <input
                    type="file"
                    id="insurance"
                    name="insurance"
                    onClick={(e) => handleFilesChange(e)}
                    style={styles.fileInput}
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
            }}
          >
            <div style={{ width: "30%" }}>
              <p
                style={{
                  fontSize: "14px",
                  width: "100%",
                }}
              >
                Driver License Document
              </p>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                border: "1px dashed black",
                padding: "10px",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "2px",
                  width: "100%",
                }}
              >
                <div style={styles.iconContainer}>
                  <ForwardToInbox style={styles.icon} />
                </div>
                <div style={styles.fileInputContainer}>
                  <label style={styles.label} htmlFor="driverLicense">
                    {!documents.driverLicense ? (
                      <p>
                        <span style={{ color: "#005FAD" }}>Click here </span> to
                        upload or drop files here
                      </p>
                    ) : (
                      <p>{documents.driverLicense?.name}</p>
                    )}
                  </label>
                  <input
                    type="file"
                    name="driverLicense"
                    id="driverLicense"
                    onClick={(e) => handleFilesChange(e)}
                    style={styles.fileInput}
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
            }}
          >
            <div style={{ width: "30%" }}>
              <p
                style={{
                  fontSize: "14px",
                  width: "100%",
                }}
              >
                Plate Number Document
              </p>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                border: "1px dashed black",
                padding: "10px",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "2px",
                  width: "100%",
                }}
              >
                <div style={styles.iconContainer}>
                  <ForwardToInbox style={styles.icon} />
                </div>
                <div style={styles.fileInputContainer}>
                  <label style={styles.label} htmlFor="plateNumber">
                    {!documents.plateNumber ? (
                      <p>
                        <span style={{ color: "#005FAD" }}>Click here </span> to
                        upload or drop files here
                      </p>
                    ) : (
                      <p>{documents.plateNumber?.name}</p>
                    )}
                  </label>
                  <input
                    type="file"
                    name="plateNumber"
                    id="plateNumber"
                    onClick={(e) => handleFilesChange(e)}
                    style={styles.fileInput}
                  />
                </div>
              </div>
            </div>
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

export default StepThree;
