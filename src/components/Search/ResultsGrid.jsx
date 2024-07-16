import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import VehicleImageSlider from "../../components/shared/VehcileImageSlider";

const ResultsGrid = ({ vehicles }) => {
  return (
    <Grid
      container
      spacing={3}
      style={{
        overflowY: "scroll",
        maxHeight: "410px",
        marginTop: "2px",
      }}
    >
      {vehicles.map((vehicle) => (
        <Grid item xs={12} key={vehicle.id}>
          <Card
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              height: { xs: "400px", md: "200px" },
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              border: "1px solid gray",
              marginRight: "50px",
            }}
          >
            <Grid container>
              <Grid item xs={12} md={4}>
                <div>
                  {Array.isArray(vehicle.images) &&
                  vehicle.images.length > 0 ? (
                    <VehicleImageSlider images={vehicle.images} />
                  ) : (
                    <CardMedia
                      component="img"
                      alt={vehicle.name}
                      height="auto"
                      image={vehicle.imageUrl}
                      style={{ maxHeight: "100%", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300";
                      }}
                    />
                  )}
                </div>
              </Grid>
              <Grid item xs={12} md={4}>
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
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
              <Grid item xs={12} md={4}>
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
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
                  </div>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ alignSelf: "flex-end" }}
                  >
                    View Details
                  </Button>
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
