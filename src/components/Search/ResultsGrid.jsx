import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Pagination,
} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";

const ResultsGrid = ({ vehicles, pickUpTime, DropOffTime }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastVehicle = currentPage * itemsPerPage;
  const indexOfFirstVehicle = indexOfLastVehicle - itemsPerPage;
  const currentVehicles = vehicles.slice(
    indexOfFirstVehicle,
    indexOfLastVehicle
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    const urls = vehicles.map((vehicle) => {
      if (Array.isArray(vehicle.images) && vehicle.images.length > 0) {
        return vehicle.images[0]; // Get the first image URL
      } else {
        return null;
      }
    });
    setImageUrls(urls);
    setLoadingStates({});
  }, [vehicles]);

  const handleImageLoad = (index) => {
    setLoadingStates((prev) => ({ ...prev, [index]: false }));
  };

  const handleImageError = (index) => {
    setLoadingStates((prev) => ({ ...prev, [index]: false }));
  };

  return (
    <>
      <Grid
        container
        spacing={3}
        sx={{
          overflowY: "scroll",
          maxHeight: "410px",
          marginTop: "2px",
          width: "95%",
          scrollbarWidth: "none", // For Firefox
          "&::-webkit-scrollbar": {
            display: "none", // For Chrome, Safari, and Opera
          },
        }}
      >
        {currentVehicles.map((vehicle, index) => (
          <Grid
            item
            xs={12}
            key={vehicle.id}
            sx={{
              marginLeft: { xs: "20px", md: "10px" },
              marginRight: { xs: "0px", md: "20px" },
            }}
          >
            <Card
              sx={{
                display: "flex",
                flexDirection: { xs: "row", md: "row" },
                height: "100%",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                border: "1px solid gray",
              }}
            >
              <Grid container>
                <Grid item xs={12} md={4}>
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    {loadingStates[indexOfFirstVehicle + index] !== false ? (
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={200}
                        style={{ marginBottom: "1px" }}
                        animation="wave"
                        sx={{
                          borderRadius: "8px",
                        }}
                      />
                    ) : null}
                    <CardMedia
                      component="img"
                      image={imageUrls[indexOfFirstVehicle + index] || ""}
                      alt={`Vehicle Image ${index}`}
                      style={{
                        maxHeight: "100%",
                        objectFit: "cover",
                        opacity:
                          loadingStates[indexOfFirstVehicle + index] !== false
                            ? 0
                            : 1,
                        transition: "opacity 0.5s ease-in-out",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        borderTopLeftRadius: "8px",
                        borderBottomLeftRadius: "8px",
                      }}
                      onLoad={() =>
                        handleImageLoad(indexOfFirstVehicle + index)
                      }
                      onError={() =>
                        handleImageError(indexOfFirstVehicle + index)
                      }
                    />
                  </div>
                </Grid>
                <Grid item xs={6} md={4}>
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "100%", // Ensures content stretches to full height
                    }}
                  >
                    <div>
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="div"
                        sx={{
                          color: "#354148",
                          fontWeight: 600,
                          marginBottom: "8px",
                        }}
                      >
                        <strong>Make: </strong>
                        {vehicle.make ? vehicle.make : "Unknown"}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ marginBottom: "8px" }}
                      >
                        <strong>Transmission:</strong>{" "}
                        {vehicle.transmission
                          ? vehicle.transmission
                          : "Unknown"}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ marginBottom: "8px" }}
                      >
                        <strong>Color:</strong>{" "}
                        {vehicle.color ? vehicle.color : "Unknown"}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ marginBottom: "8px" }}
                      >
                        <strong>Seats:</strong>{" "}
                        {vehicle.seats ? vehicle.seats : "Unknown"}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ marginBottom: "8px" }}
                      >
                        <strong>Doors:</strong>{" "}
                        {vehicle.doors ? vehicle.doors : "Unknown"}
                      </Typography>
                    </div>
                  </CardContent>
                </Grid>
                <Grid item xs={6} md={4}>
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "100%",
                    }}
                  >
                    <div>
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="div"
                        sx={{
                          color: "#354148",
                          fontWeight: 600,
                          marginBottom: "8px",
                        }}
                      >
                        <strong>Model: </strong>
                        {vehicle.model ? vehicle.model : "Unknown"}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        gutterBottom
                        sx={{ marginBottom: "8px" }}
                      >
                        <strong>Category: </strong>
                        {vehicle.category ? vehicle.category : "Unknown"}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ marginBottom: "8px" }}
                      >
                        <strong>City:</strong>{" "}
                        {vehicle.city ? vehicle.city : "Unknown"}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ marginBottom: "8px" }}
                      >
                        <strong>Model Specification:</strong>{" "}
                        {vehicle.modelSpecification
                          ? vehicle.modelSpecification
                          : "Unknown"}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ marginBottom: "8px" }}
                      >
                        <strong>Created Time:</strong>{" "}
                        {vehicle.createdAt ? vehicle.createdAt : "Unknown"}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ alignSelf: "flex-end" }}
                        onClick={() => {
                          window.location.href = `/Details/${vehicle.id}?pickUpTime=${pickUpTime}&dropOffTime=${DropOffTime}`;
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Pagination
        count={Math.ceil(vehicles.length / itemsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        sx={{ marginTop: "16px", justifyContent: "center", display: "flex" }}
      />
    </>
  );
};

export default ResultsGrid;
