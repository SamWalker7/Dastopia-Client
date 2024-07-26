import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Grid,
  Typography,
  FormControl,
} from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchVehicles } from "../store/slices/vehicleSlice";

const Booking = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    pickupDate: "",
    dropOffDate: "",
    carMake: "",
    carModel: "",
    transmission: "",
    year: "",
  });
  const [errors, setErrors] = useState({});
  const location = useLocation();
  const [selected, setSelected] = useState({});
  const [vehiclesData, setVehiclesData] = useState([]);

  const vehicles = useSelector((state) => state.vehicle.vehicles);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadData = async () => {
      const response = await dispatch(fetchVehicles());
      if (fetchVehicles.fulfilled.match(response)) {
        const vehicles = response.payload;
      }
    };
    if (vehicles.length < 1) {
      loadData();
    }
  }, [dispatch, vehicles.length]);

  useEffect(() => {
    vehicles.forEach((v) => {
      if (v.id === id) {
        setSelected(v);
        setFormData({
          ...formData,
          carMake: v.make,
          carModel: v.model,
          transmission: v.transmission,
          year: v.year,
        });
      }
    });
  }, [vehicles, id]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const pickupTime = queryParams.get("pickUpTime");
    const dropOffTime = queryParams.get("dropOffTime");

    if (pickupTime) {
      setFormData((prevData) => ({ ...prevData, pickupDate: pickupTime }));
    }
    if (dropOffTime) {
      setFormData((prevData) => ({ ...prevData, dropOffDate: dropOffTime }));
    }
  }, [location.search]);

  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    if (!formData.firstName) {
      tempErrors.firstName = "First name is required";
      isValid = false;
    }
    if (!formData.lastName) {
      tempErrors.lastName = "Last name is required";
      isValid = false;
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Valid email is required";
      isValid = false;
    }
    if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber)) {
      tempErrors.phoneNumber = "Valid phone number is required";
      isValid = false;
    }
    if (!formData.pickupDate) {
      tempErrors.pickupDate = "Pickup date is required";
      isValid = false;
    }
    if (!formData.dropOffDate) {
      tempErrors.dropOffDate = "Drop off date is required";
      isValid = false;
    }
    if (!formData.carMake) {
      tempErrors.carMake = "Car make is required";
      isValid = false;
    }
    if (!formData.carModel) {
      tempErrors.carModel = "Car model is required";
      isValid = false;
    }
    if (!formData.transmission) {
      tempErrors.transmission = "Transmission type is required";
      isValid = false;
    }
    if (!formData.year) {
      tempErrors.year = "Year of manufacturing is required";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      window.location.href = "/booking-confirmation";
    }
  };

  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
  const pickupDate = formData.pickupDate || today;

  return (
    <Container style={{ paddingTop: 220 }}>
      {selected ? (
        <>
          <Typography variant="h4" gutterBottom>
            Booking Page
          </Typography>
          <form onSubmit={handleSubmit} style={{ paddingTop: "2rem" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  style={{ marginBottom: 16 }}
                  required
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  style={{ marginBottom: 16 }}
                  required
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  style={{ marginBottom: 16 }}
                  required
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber}
                  style={{ marginBottom: 16 }}
                  required
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Pickup Date"
                  name="pickupDate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: today }}
                  value={formData.pickupDate}
                  onChange={handleChange}
                  error={!!errors.pickupDate}
                  helperText={errors.pickupDate}
                  style={{ marginBottom: 16 }}
                  required
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Drop Off Date"
                  name="dropOffDate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: pickupDate }}
                  value={formData.dropOffDate}
                  onChange={handleChange}
                  error={!!errors.dropOffDate}
                  helperText={errors.dropOffDate}
                  style={{ marginBottom: 16 }}
                  required
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Car Make"
                  name="carMake"
                  value={formData.carMake}
                  onChange={handleChange}
                  error={!!errors.carMake}
                  helperText={errors.carMake}
                  style={{ marginBottom: 16 }}
                  required
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Car Model"
                  name="carModel"
                  value={formData.carModel}
                  onChange={handleChange}
                  error={!!errors.carModel}
                  helperText={errors.carModel}
                  style={{ marginBottom: 16 }}
                  required
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth style={{ marginBottom: 16 }}>
                  <TextField
                    label="Transmission"
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleChange}
                    error={!!errors.transmission}
                    required
                    autoFocus
                    disabled
                  />
                </FormControl>
                {errors.transmission && (
                  <Typography color="error">{errors.transmission}</Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth style={{ marginBottom: 16 }}>
                  <TextField
                    label="Year of Manufacturing"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    error={!!errors.year}
                    required
                    autoFocus
                    disabled
                  />
                </FormControl>
                {errors.year && (
                  <Typography color="error">{errors.year}</Typography>
                )}
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ py: 1, px: 5, fontSize: 12 }}
                  onClick={handleSubmit}
                >
                  Book Now
                </Button>
              </Grid>
            </Grid>
          </form>
        </>
      ) : (
        <Typography variant="h4" gutterBottom>
          Loading
        </Typography>
      )}
    </Container>
  );
};

export default Booking;
