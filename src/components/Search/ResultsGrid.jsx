import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Skeleton,
} from "@mui/material";

const ResultsGrid = ({ vehicles }) => {
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    const urls = vehicles.map((vehicle) => {
      if (Array.isArray(vehicle.images) && vehicle.images.length > 0) {
        return vehicle.images[0]; // Get the first image URL
      } else {
        return "https://via.placeholder.com/300"; // Placeholder image URL if no image is available
      }
    });
    setImageUrls(urls);
  }, [vehicles]);

  return (
    <Grid
      container
      spacing={3}
      style={{
        overflowY: "scroll",
        maxHeight: "410px",
        marginTop: "2px",
        width: "95%",
      }}
    >
      {vehicles.map((vehicle, index) => (
        <Grid item xs={12} key={vehicle.id}>
          <Card
            sx={{
              display: "flex",
              flexDirection: { xs: "row", md: "row" },
              height: "100%", // Ensures each card takes full height of its container
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              border: "1px solid gray",
              marginBottom: "20px", // Adds spacing between cards
            }}
          >
            <Grid container>
              <Grid item xs={12} md={4}>
                <div>
                  {imageUrls[index] ? (
                    <CardMedia
                      component="img"
                      height="auto"
                      image={imageUrls[index]}
                      alt={`Vehicle Image ${index}`}
                      style={{ maxHeight: "100%", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300";
                      }}
                      onLoad={(e) => {
                        e.target.style.opacity = 1;
                      }}
                      sx={{
                        opacity: 0,
                        transition: "opacity 0.5s ease-in-out",
                        borderRadius: "8px",
                      }}
                    />
                  ) : (
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height="auto"
                      style={{ marginBottom: "8px" }}
                      animation="wave"
                      sx={{
                        borderRadius: "8px",
                      }}
                    />
                  )}
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
                      {vehicle.transmission ? vehicle.transmission : "Unknown"}
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
  );
};

export default ResultsGrid;
