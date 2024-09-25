import { ForwardToInbox } from "@mui/icons-material";
import { Box, Button, Grid, IconButton, Snackbar } from "@mui/material";
import { PlusSquare } from "lucide-react";
import CloseIcon from "@mui/icons-material/Close";

import React, { useState } from "react";

function StepTwo({
  activeStep,
  styles,
  handleBackStep,
  handleNextStep,
  handleImagesChange,
  images,
}) {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [error, setError] = useState(null);

  const handleSnakbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleNext = () => {
    if (!images.front) {
      setError("Front image is required");
      setOpenSnackbar(true);
      return;
    }

    if (!images.back) {
      setError("Back image is required");
      setOpenSnackbar(true);
      return;
    }
    if (!images.left) {
      setError("Left image is required");
      setOpenSnackbar(true);
      return;
    }

    if (!images.right) {
      setError("Right image is required");
      setOpenSnackbar(true);
      return;
    }

    if (!images.fontInterior) {
      setError("Front interior image is required");
      setOpenSnackbar(true);
      return;
    }

    if (!images.backInterior) {
      setError("Back interior image is required");
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
          Upload Photos
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "25px",
            alignItems: "start",
            justifyContent: "start",
            marginBottom: "10px",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              border: "1px dashed black",
              padding: "10px",
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
                {images.front ? (
                  <img
                    src={URL.createObjectURL(images.front)}
                    style={{
                      width: "20px",
                      height: "20px",
                      objectFit: "cover",
                    }}
                    alt="front img"
                  />
                ) : (
                  <ForwardToInbox style={styles.icon} />
                )}
              </div>
              <div style={styles.fileInputContainer}>
                <label style={styles.label} htmlFor="front">
                  Front of the car
                </label>
                <input
                  type="file"
                  id="front"
                  name="front"
                  onChange={(e) => handleImagesChange(e)}
                  style={styles.fileInput}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              border: "1px dashed black",
              padding: "10px",
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
                {images.back ? (
                  <img
                    src={URL.createObjectURL(images.back)}
                    style={{
                      width: "20px",
                      height: "20px",
                      objectFit: "cover",
                    }}
                    alt="back img"
                  />
                ) : (
                  <ForwardToInbox style={styles.icon} />
                )}
              </div>
              <div style={styles.fileInputContainer}>
                <label style={styles.label} htmlFor="back">
                  Back of the car
                </label>
                <input
                  type="file"
                  id="back"
                  name="back"
                  onChange={(e) => handleImagesChange(e)}
                  style={styles.fileInput}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              border: "1px dashed black",
              padding: "10px",
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
                {images.left ? (
                  <img
                    src={URL.createObjectURL(images.left)}
                    style={{
                      width: "20px",
                      height: "20px",
                      objectFit: "cover",
                    }}
                    alt="left img"
                  />
                ) : (
                  <ForwardToInbox style={styles.icon} />
                )}
              </div>
              <div style={styles.fileInputContainer}>
                <label style={styles.label} htmlFor="left">
                  Left side of the car
                </label>
                <input
                  name="left"
                  type="file"
                  id="left"
                  onChange={(e) => handleImagesChange(e)}
                  style={styles.fileInput}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              border: "1px dashed black",
              padding: "10px",
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
                {images.right ? (
                  <img
                    src={URL.createObjectURL(images.right)}
                    style={{
                      width: "20px",
                      height: "20px",
                      objectFit: "cover",
                    }}
                    alt="right img"
                  />
                ) : (
                  <ForwardToInbox style={styles.icon} />
                )}
              </div>
              <div style={styles.fileInputContainer}>
                <label style={styles.label} htmlFor="right">
                  Right side of the car
                </label>
                <input
                  type="file"
                  id="right"
                  name="right"
                  onChange={(e) => handleImagesChange(e)}
                  style={styles.fileInput}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              border: "1px dashed black",
              padding: "10px",
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
                {images.fontInterior ? (
                  <img
                    src={URL.createObjectURL(images.fontInterior)}
                    style={{
                      width: "20px",
                      height: "20px",
                      objectFit: "cover",
                    }}
                    alt="fontInterior img"
                  />
                ) : (
                  <ForwardToInbox style={styles.icon} />
                )}
              </div>
              <div style={styles.fileInputContainer}>
                <label style={styles.label} htmlFor="fontInterior">
                  Front interior of the car
                </label>
                <input
                  type="file"
                  id="fontInterior"
                  name="fontInterior"
                  onChange={(e) => handleImagesChange(e)}
                  style={styles.fileInput}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              border: "1px dashed black",
              padding: "10px",
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
                {images.backInterior ? (
                  <img
                    src={URL.createObjectURL(images.backInterior)}
                    style={{
                      width: "20px",
                      height: "20px",
                      objectFit: "cover",
                    }}
                    alt="backInterior img"
                  />
                ) : (
                  <ForwardToInbox style={styles.icon} />
                )}
              </div>
              <div style={styles.fileInputContainer}>
                <label style={styles.label} htmlFor="backInterior">
                  Back interior of the car
                </label>
                <input
                  type="file"
                  id="backInterior"
                  name="backInterior"
                  onChange={(e) => handleImagesChange(e)}
                  style={styles.fileInput}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              width: "100%",
              padding: "15px",
            }}
          >
            <div>
              <PlusSquare width={30} height={30} />
            </div>
            <div>
              <div style={styles.fileInputContainer}>
                <label style={styles.label} htmlFor="additional">
                  Additional images
                </label>
                <input
                  type="file"
                  id="additional"
                  name="additional"
                  style={styles.fileInput}
                  onChange={(e) => handleImagesChange(e)}
                  multiple
                />
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

export default StepTwo;
