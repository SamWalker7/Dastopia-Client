import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import { Info } from "lucide-react";
import { getOneVehicle, initializePayment } from "../api";
import TermsAndConditions from "./TermsAndConditions";

const BookingDetails = () => {
  const id = sessionStorage.getItem("car_id");
  const pickupTime = sessionStorage.getItem("pickup_time");
  const dropOffTime = sessionStorage.getItem("dropoff_time");
  const first_name = sessionStorage.getItem("first_name");
  const last_name = sessionStorage.getItem("last_name");
  const phoneNumber = sessionStorage.getItem("phone_number");
  const email = sessionStorage.getItem("email");
  const amount = sessionStorage.getItem("price");
  const [details, setDetails] = useState(null);
  const [isTerms, setTerms] = useState(false);
  const navigate = useNavigate();

  const value = new Date(dropOffTime) - new Date(pickupTime);
  const differenceInDays = value / (1000 * 3600 * 24);

  const handleClick = async () => {
    // navigate("/");
    const data = {
      firstName: first_name,
      lastName: last_name,
      dropOffDate: dropOffTime,
      pickupDate: pickupTime,
      phoneNumber: phoneNumber,
      carMake: details.carMake,
      transmission: details.transmission,
      year: details.year,
      carModel: details.model,
      email: email,
    };

    const response = await initializePayment({
      ...data,
      amount: (amount * differenceInDays) + (amount * differenceInDays * 0.13),
    });

    window.location.href = response.checkout_url;
  };

  const fetchVehicle = async () => {
    const response = await getOneVehicle(id);
    setDetails(response.body);
  };

  useEffect(() => {
    fetchVehicle();
  }, [id]);
  return (
    <>
      {!isTerms ? (
        <>
          <Container maxWidth="md" style={styles.container}>
            <Paper elevation={3} style={styles.paper}>
              <Grid
                container
                justifyContent="center"
                style={styles.iconContainer}
              >
                <Info style={styles.icon} />
              </Grid>
              <Typography variant="h4" gutterBottom style={styles.header}>
                Booking
              </Typography>

              <Typography variant="h6" style={styles.bodyText}>
                Your can view the booking info here
              </Typography>
              <Divider style={styles.divider} />

              {details !== null ? (
                <Grid item xs={12} sm={6} style={styles.rightColumn}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      style={styles.columnHeader}
                    >
                      Car Details & Price
                    </Typography>

                    <>
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
                    </>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",

                        alignItems: "start",
                        gap: "2px",
                      }}
                    >
                      <Typography
                        variant="body1"
                        style={{
                          fontSize: "16px",
                          marginTop: "40px",
                        }}
                      >
                        <strong>Price: </strong> {amount}{" "}
                        <strong>ETB/day</strong>
                      </Typography>
                      <Typography
                        variant="body1"
                        style={{
                          fontSize: "16px",
                          marginTop: "2px",
                          // borderBottom: "1px solid black",
                        }}
                      >
                        <strong>Days: </strong> {differenceInDays} day
                      </Typography>
                      <Typography
                        variant="body1"
                        style={{
                          fontSize: "16px",
                        }}
                      >
                        <strong>Price: </strong> 10%
                      </Typography>
                      <div
                        style={{
                          border: "1px solid black",
                          maxWidth: "300px",
                          width: "100%",
                        }}
                      ></div>
                      <Typography
                        variant="body1"
                        style={{
                          fontSize: "16px",
                          marginTop: "2px",
                        }}
                      >
                        <strong>Total: </strong>{" "}
                        {differenceInDays * amount +
                          amount * differenceInDays * 0.1}{" "}
                        <strong>ETB</strong>
                      </Typography>
                    </div>
                  </div>
                </Grid>
              ) : (
                <></>
              )}

              <Divider style={styles.divider} />
              <Button
                variant="contained"
                color="primary"
                style={styles.button}
                onClick={() => setTerms(true)}
              >
                Checkout
              </Button>
            </Paper>
          </Container>
        </>
      ) : (
        <>
          <TermsAndConditions handleClick={handleClick} />{" "}
        </>
      )}
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
    color: "blue",
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
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
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
    cursor: "pointer",
  },
};

export default BookingDetails;
