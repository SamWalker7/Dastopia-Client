import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import axios from "axios";
import { getOneVehicle } from "../api";
import { useNavigate } from "react-router-dom";

const BookingConfirmation = () => {
  // Sample booking data

  const id = sessionStorage.getItem("car_id");
  const pickupTime = sessionStorage.getItem("pickup_time")
  const dropOffTime = sessionStorage.getItem("dropoff_time")

  const [details, setDetails] = useState(null);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/")
    sessionStorage.clear();
  }

  const fetchVehicle = async () => {
    const response = await getOneVehicle(id);
    setDetails(response.body);
  };

  useEffect(() => {
    fetchVehicle();
  }, []);

  console.log(details, "details");
  const bookingDetails = {
    bookingId: "12345",
    name: "John Doe",
    email: "johndoe@example.com",
    date: "2024-07-26",
    service: "Car Rental",
    carMake: "Toyota",
    carModel: "Corolla",
    transmission: "Automatic",
    year: 2022,
    pickupDate: "2024-08-01",
    dropoffDate: "2024-08-10",
  };

  return (
    <>
      <Container maxWidth="md" style={styles.container}>
        <Paper elevation={3} style={styles.paper}>
          <Grid container justifyContent="center" style={styles.iconContainer}>
            <CheckCircleOutlineIcon style={styles.icon} />
          </Grid>
          <Typography variant="h4" gutterBottom style={styles.header}>
            Payment Accepted
          </Typography>
          <Typography variant="h6" gutterBottom style={styles.subHeader}>
            Thank you, {bookingDetails.name}!
          </Typography>
          <Typography variant="body1" style={styles.bodyText}>
            Your payment has been successfully processed. Below are your booking
            details:
          </Typography>
          <Divider style={styles.divider} />
          {
            details && <Grid item xs={12} sm={6} style={styles.rightColumn}>
              <Typography variant="h6" gutterBottom style={styles.columnHeader}>
                Car Details & Dates
              </Typography>
              <Typography variant="body1" style={styles.detailText}>
                <strong>Car Make:</strong> {details.make}
              </Typography>
              <Typography variant="body1" style={styles.detailText}>
                <strong>Car Model:</strong> {details.model}
              </Typography>
              <Typography variant="body1" style={styles.detailText}>
                <strong>Transmission:</strong> {details.transmission}
              </Typography>
              <Typography variant="body1" style={styles.detailText}>
                <strong>Year of Manufacturing:</strong> {details.year}
              </Typography>
              <Typography variant="body1" style={styles.detailText}>
                <strong>Pickup Date:</strong> {pickupTime}
              </Typography>
              <Typography variant="body1" style={styles.detailText}>
                <strong>Dropoff Date:</strong> {dropOffTime}
              </Typography>
            </Grid>
          }

          <Divider style={styles.divider} />
          <Button
            variant="contained"
            color="primary"
            style={styles.button}
            onClick={
              handleClick
            }
          >
            Done
          </Button>
        </Paper>
      </Container>
    </>
  );
};

const styles = {
  container: {
    paddingTop: "20rem",
    textAlign: "center",
  },
  paper: {
    padding: "2rem",
    borderRadius: "8px",
  },
  iconContainer: {
    marginBottom: "1rem",
  },
  icon: {
    fontSize: "4rem",
    color: "green",
  },
  header: {
    textAlign: "center",
    marginBottom: "1rem",
  },
  subHeader: {
    textAlign: "center",
    marginBottom: "1rem",
  },
  bodyText: {
    textAlign: "center",
    marginBottom: "1rem",
  },
  divider: {
    margin: "1rem 0",
  },
  leftColumn: {
    paddingLeft: "2rem",
  },
  rightColumn: {
    paddingLeft: "2rem",
  },
  columnHeader: {
    marginBottom: "1rem",
    fontWeight: "bold",
    fontSize: "20px",
  },
  detailText: {
    marginBottom: "0.5rem",
    fontSize: "16px",
  },
  button: {
    display: "block",
    margin: "2rem auto 0",
  },
};

export default BookingConfirmation;
