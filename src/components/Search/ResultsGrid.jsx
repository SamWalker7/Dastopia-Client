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
        maxHeight: "auto",
        marginTop: "10px",
      }}
    >
      {vehicles.map((vehicle) => (
        <Grid item xs={12} key={vehicle.id}>
          <Card>
            <Grid container>
              <Grid item xs={4}>
                {Array.isArray(vehicle.images) && vehicle.images.length > 0 ? (
                  <VehicleImageSlider images={vehicle.images} />
                ) : (
                  <CardMedia
                    component="img"
                    alt={vehicle.name}
                    height="100%"
                    image={vehicle.imageUrl}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300";
                    }}
                  />
                )}
              </Grid>
              <Grid item xs={8}>
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    sx={{ color: "#354148" }}
                  >
                    {vehicle.make} {vehicle.model}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="textPrimary"
                    gutterBottom
                    sx={{ marginBottom: "8px" }}
                  >
                    {vehicle.description}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                    sx={{ marginBottom: "8px" }}
                  >
                    <strong>Transmission:</strong> {vehicle.transmission}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ marginBottom: "8px" }}
                  >
                    <strong>Color:</strong> {vehicle.color}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ marginBottom: "8px" }}
                  >
                    <strong>Seats:</strong> {vehicle.seats}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ marginBottom: "8px" }}
                  >
                    <strong>Doors:</strong> {vehicle.doors}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ marginBottom: "8px" }}
                  >
                    <strong>City:</strong> {vehicle.city}
                  </Typography>
                  <Button variant="contained" color="primary">
                    Save
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
