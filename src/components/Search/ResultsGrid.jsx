import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
} from "@mui/material";

const mockResults = [
  {
    title: "Car 1",
    description: "Description for Car 1",
    carType: "Sedan",
    amount: "$50/day",
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    title: "Car 2",
    description: "Description for Car 2",
    carType: "SUV",
    amount: "$70/day",
    imageUrl: "https://via.placeholder.com/150",
  },
];

const ResultsGrid = () => {
  return (
    <Grid container spacing={3}>
      {mockResults.map((result, index) => (
        <Grid item xs={12} key={index}>
          <Card>
            <Grid container>
              <Grid item xs={4}>
                <CardMedia
                  component="img"
                  alt={result.title}
                  height={160}
                  image={result.imageUrl}
                />
              </Grid>
              <Grid item xs={8}>
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    sx={{ color: "#354148" }}
                  >
                    {result.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="textPrimary"
                    gutterBottom
                    sx={{ marginBottom: "8px" }}
                  >
                    {result.description}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                    sx={{ marginBottom: "8px" }}
                  >
                    <strong>Type:</strong> {result.carType}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ marginBottom: "8px" }}
                  >
                    <strong>Amount:</strong> {result.amount}
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
