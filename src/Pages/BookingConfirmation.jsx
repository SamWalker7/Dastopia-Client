import React from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const BookingConfirmation = () => {
  // Sample booking data
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
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} style={styles.leftColumn}>
            <Typography variant="h6" gutterBottom style={styles.columnHeader}>
              Personal Information
            </Typography>
            <Typography variant="body1" style={styles.detailText}>
              <strong>Booking ID:</strong> {bookingDetails.bookingId}
            </Typography>
            <Typography variant="body1" style={styles.detailText}>
              <strong>Name:</strong> {bookingDetails.name}
            </Typography>
            <Typography variant="body1" style={styles.detailText}>
              <strong>Email:</strong> {bookingDetails.email}
            </Typography>
            <Typography variant="body1" style={styles.detailText}>
              <strong>Date:</strong> {bookingDetails.date}
            </Typography>
            <Typography variant="body1" style={styles.detailText}>
              <strong>Service:</strong> {bookingDetails.service}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} style={styles.rightColumn}>
            <Typography variant="h6" gutterBottom style={styles.columnHeader}>
              Car Details & Dates
            </Typography>
            <Typography variant="body1" style={styles.detailText}>
              <strong>Car Make:</strong> {bookingDetails.carMake}
            </Typography>
            <Typography variant="body1" style={styles.detailText}>
              <strong>Car Model:</strong> {bookingDetails.carModel}
            </Typography>
            <Typography variant="body1" style={styles.detailText}>
              <strong>Transmission:</strong> {bookingDetails.transmission}
            </Typography>
            <Typography variant="body1" style={styles.detailText}>
              <strong>Year of Manufacturing:</strong> {bookingDetails.year}
            </Typography>
            <Typography variant="body1" style={styles.detailText}>
              <strong>Pickup Date:</strong> {bookingDetails.pickupDate}
            </Typography>
            <Typography variant="body1" style={styles.detailText}>
              <strong>Dropoff Date:</strong> {bookingDetails.dropoffDate}
            </Typography>
          </Grid>
        </Grid>
        <Divider style={styles.divider} />
        <Button
          variant="contained"
          color="primary"
          style={styles.button}
          onClick={() => alert("Thank you for your booking!")}
        >
          Done
        </Button>
      </Paper>
    </Container>
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
  },
  detailText: {
    marginBottom: "0.5rem",
  },
  button: {
    display: "block",
    margin: "2rem auto 0",
  },
};

export default BookingConfirmation;
