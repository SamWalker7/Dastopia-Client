import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Grid,
  Typography,
  FormControl,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchVehicles } from "../store/slices/vehicleSlice";
import { getDownloadUrl, getOneVehicle, initializePayment } from "../api";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const Booking = () => {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
 
    pickupDate: "",
    dropOffDate: "",
    carMake: "",
    carModel: "",
    transmission: "",
    year: "",
  });

  const [phone, setPhone] = useState("")

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
      }));
    }
  }, [localStorage]);
  const [errors, setErrors] = useState({});
  const location = useLocation();
  const [selected, setSelected] = useState({});
  const [vehiclesData, setVehiclesData] = useState([]);

  const vehicles = useSelector((state) => state.vehicle.vehicles);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchData = async () => {
    const response = await getOneVehicle(id);
    const data = response.body;
    let urls = [];
    setSelected({
      ...data,
      imageLoading: true,
      images: [],
    });

    for (const image of data.vehicleImageKeys) {
      const path = await getDownloadUrl(image.key);
      urls.push(path.body || "https://via.placeholder.com/300");
    }

    setSelected({
      ...data,
      imageLoading: false,
      images: urls,
    });
    setFormData({
      ...formData,
      carMake: data.make,
      carModel: data.model,
      transmission: data.transmission,
      year: data.year,
    });
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const pickupTime = queryParams.get("pickUpTime");
    const dropOffTime = queryParams.get("dropOffTime");

    console.log(pickupTime, dropOffTime, 'time')

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

  const handleSubmit = async (e) => {


    e.preventDefault();

    if (validate()) {
      try {
        const response = await initializePayment({...formData, phoneNumber: phone});

        sessionStorage.setItem("pickup_time", formData.pickupDate);
        sessionStorage.setItem("dropoff_time", formData.dropOffDate);
        sessionStorage.setItem("first_name", formData.firstName);
        sessionStorage.setItem("last_name", formData.lastName);
        sessionStorage.setItem("car_id", id);
        window.location.href = response.checkout_url;
      } catch (err) {
        console.log("err");
        setErrors(err.message);
      }
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const pickupDate = formData.pickupDate || today;

  return (
    <Container style={{ paddingTop: 220 }}>
      
      {selected ? (
        <div
          style={{
            border: "2px solid black",
            padding: "2em",
            borderRadius: "15px",
          }}
        >
          <Typography
            style={{ fontWeight: "bolder", fontSize: "35px" }}
            variant="h4"
            gutterBottom
          >
            Booking Page
          </Typography>
          <form onSubmit={handleSubmit} style={{ paddingTop: "2rem" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  sx={{ fontSize: "1.5rem" }}
                  InputProps={{
                    sx: {
                      fontSize: "1.5rem",
                    },
                  }}
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  style={{ marginBottom: 16 }}
                  InputLabelProps={{
                    sx: {
                      fontSize: "1.5rem",
                    },
                  }}
                  required
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  sx={{ fontSize: "1.5rem" }}
                  InputProps={{
                    sx: {
                      fontSize: "1.5rem",
                    },
                  }}
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  style={{ marginBottom: 16 }}
                  InputLabelProps={{
                    sx: {
                      fontSize: "1.5rem",
                    },
                  }}
                  required
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  sx={{ fontSize: "1.5rem" }}
                  InputProps={{
                    sx: {
                      fontSize: "1.5rem",
                    },
                  }}
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  style={{ marginBottom: 16 }}
                  InputLabelProps={{
                    sx: {
                      fontSize: "1.5rem",
                    },
                  }}
                  required
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
              <PhoneInput
            country={"et"}
            value={phone}
            onChange={setPhone}
            placeholder="+251965667890"
            inputStyle={{
              width: "100%",
              height: "60px",
            }}
          />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  sx={{ fontSize: "1.5rem" }}
                  InputProps={{
                    sx: {
                      fontSize: "1.5rem",
                    },
                  }}
                  fullWidth
                  label="Pickup Date"
                  name="pickupDate"
                  type="date"
                  inputProps={{ min: today }}
                  value={formData.pickupDate}
                  onChange={handleChange}
                  error={!!errors.pickupDate}
                  helperText={errors.pickupDate}
                  style={{ marginBottom: 16 }}
                  InputLabelProps={{
                    shrink: true,
                    sx: {
                      fontSize: "14px",
                    },
                  }}
                  required
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  sx={{ fontSize: "1.5rem" }}
                  InputProps={{
                    sx: {
                      fontSize: "1.5rem",
                    },
                  }}
                  fullWidth
                  label="Drop Off Date"
                  name="dropOffDate"
                  type="date"
                  inputProps={{ min: pickupDate }}
                  value={formData.dropOffDate}
                  onChange={handleChange}
                  error={!!errors.dropOffDate}
                  helperText={errors.dropOffDate}
                  style={{ marginBottom: 16 }}
                  InputLabelProps={{
                    shrink: true,
                    sx: {
                      fontSize: "14px",
                    },
                  }}
                  required
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  sx={{ fontSize: "1.5rem" }}
                  InputProps={{
                    sx: {
                      fontSize: "1.5rem",
                    },
                  }}
                  fullWidth
                  label="Car Make"
                  name="carMake"
                  value={formData.carMake}
                  onChange={handleChange}
                  error={!!errors.carMake}
                  helperText={errors.carMake}
                  style={{ marginBottom: 16 }}
                  InputLabelProps={{
                    sx: {
                      fontSize: "1.5rem",
                    },
                  }}
                  required
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  sx={{ fontSize: "1.5rem" }}
                  InputProps={{
                    sx: {
                      fontSize: "1.5rem",
                    },
                  }}
                  fullWidth
                  label="Car Model"
                  name="carModel"
                  value={formData.carModel}
                  onChange={handleChange}
                  error={!!errors.carModel}
                  helperText={errors.carModel}
                  style={{ marginBottom: 16 }}
                  InputLabelProps={{
                    sx: {
                      fontSize: "1.5rem",
                    },
                  }}
                  required
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth style={{ marginBottom: 16 }}>
                  <TextField
                    sx={{ fontSize: "1.5rem" }}
                    InputProps={{
                      sx: {
                        fontSize: "1.5rem",
                      },
                    }}
                    label="Transmission"
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleChange}
                    error={!!errors.transmission}
                    InputLabelProps={{
                      sx: {
                        fontSize: "1.5rem",
                      },
                    }}
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
                    sx={{ fontSize: "1.5rem" }}
                    InputProps={{
                      sx: {
                        fontSize: "1.5rem",
                      },
                    }}
                    label="Year of Manufacturing"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    error={!!errors.year}
                    InputLabelProps={{
                      sx: {
                        fontSize: "1.5rem",
                      },
                    }}
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
                  sx={{
                    py: 1,
                    px: 5,
                    fontSize: 12,
                    backgroundColor: "#2a43cf",
                  }}
                  onClick={handleSubmit}
                >
                  Book Now
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      ) : (
        <Typography variant="h4" gutterBottom>
          Loading
        </Typography>
      )}
    </Container>
  );
};

export default Booking;
