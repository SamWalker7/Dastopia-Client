import * as React from "react";

import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";

import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import Check from "@mui/icons-material/Check";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import VideoLabelIcon from "@mui/icons-material/VideoLabel";
import { v4 as uuidv4 } from "uuid";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import {
  Autocomplete,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Box,
  Modal,
  Snackbar,
  Button,
  IconButton,
} from "@mui/material";

import "./style.css";

import { Search, X, LocateFixed, CheckCheck } from "lucide-react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { API_KEY } from "../../components/GoogleMaps";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

import StepOne from "./step_1";
import StepTwo from "./step_2";
import StepThree from "./step_3";
import StepFour from "./step_4";
import StepFive from "./step_5";
import StepSix from "./step_6";
import StepSeven from "./step_7";
import { resizeImage } from "../../utils/helpers";
import axios from "axios";
import BASE_URL from "../../api/baseUrl";
import { useDispatch } from "react-redux";
import { createVehicle } from "../../store/slices/listingSlice";
import { useNavigate } from "react-router-dom";

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-80% + 0px)",
    right: "calc(80% + 0px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#00173C",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#00173C",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
    ...theme.applyStyles("dark", {
      borderColor: theme.palette.grey[800],
    }),
  },
}));

const QontoStepIconRoot = styled("div")(({ theme }) => ({
  color: "#eaeaf0",
  display: "flex",
  height: 22,
  alignItems: "center",
  "& .QontoStepIcon-completedIcon": {
    color: "#784af4",
    zIndex: 1,
    fontSize: 18,
  },
  "& .QontoStepIcon-circle": {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
  ...theme.applyStyles("dark", {
    color: theme.palette.grey[700],
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        color: "#784af4",
      },
    },
  ],
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
};

const ColorlibStepIconRoot = styled("div")(({ theme }) => ({
  backgroundColor: "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.grey[700],
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        backgroundImage:
          "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
        boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
      },
    },
    {
      props: ({ ownerState }) => ownerState.completed,
      style: {
        backgroundImage:
          "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
      },
    },
  ],
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <SettingsIcon />,
    2: <GroupAddIcon />,
    3: <VideoLabelIcon />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   *
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   *
   * @default false
   */
  completed: PropTypes.bool,

  icon: PropTypes.node,
};

const steps = [1, 2, 3, 4, 5, 6, 7];

const styles = {
  formContainer: {
    width: "100%",
    padding: "20px",
    backgroundColor: "#f7f7f7",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    maxWidth: "900px",
    margin: "0 auto",
  },
  textField: {
    marginBottom: "16px",
    fontSize: "12px",
  },
  selectField: {
    marginBottom: "16px",
  },
  buttonContainer: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "end",
    marginTop: "20px",
    // border: "1px solid black",
  },
  uploadButton: {
    backgroundColor: "#001f3f",
    color: "#ffffff",
    borderRadius: "50px",
    padding: "10px 30px",
    fontSize: "1rem",
    textTransform: "none",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  container: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "10px",
    width: "400px",
  },
  iconContainer: {
    flex: "0 0 90px",
    backgroundColor: "#F2F4F7",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
    borderRadius: "8px",
  },
  icon: {
    fontSize: "24px",
    color: "#aaa",
  },
  fileInputContainer: {
    display: "flex",
    alignItems: "center",
    paddingLeft: "5px",
    position: "relative",
    width: "100%",
  },
  numberBadge: {
    position: "absolute",
    left: "-12px",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "#ff4081",
    color: "#fff",
    fontSize: "10px",
    borderRadius: "50%",
    padding: "4px",
    zIndex: "1",
  },
  label: {
    fontSize: "12px",
    color: "#333",
    marginRight: "10px",
    width: "100%",
  },
  fileInput: {
    display: "none",
  },

  c_container: {
    // padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  stepText: {
    marginBottom: "10px",
    color: "#777",
  },
  title: {
    fontWeight: "bold",
    marginBottom: "20px",
  },
  gridContainer: {
    display: "flex",
    flexDirection: "row",
  },
  card: {
    maxWidth: "100%",
    borderRadius: "2rem",
  },
  image: {
    borderRadius: "2rem",
    obectFit: "cover",
  },

  in_image: {
    borderRadius: "10px",
    obectFit: "cover",
  },
  in_card: {
    maxWidth: "100%",
    borderRadius: "10px",
  },
  content: {
    paddingLeft: "20px",
  },
  carTitle: {
    marginBottom: "10px",
    fontWeight: "bold",
    fontSize: "28px",
  },
  features: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  specTitle: {
    fontWeight: "bold",
    marginBottom: "10px",
    fontSize: "24px",
  },
  specs: {
    marginBottom: "20px",
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
  },
  spec: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "5px",
    flexDirection: "column",
  },
  featuresTitle: {
    fontWeight: "bold",
    marginBottom: "10px",
    fontSize: "24px",
  },
  featureChips: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
};

export default function CarDetails() {
  const [activeStep, setActiveStep] = React.useState(1);
  const [formValues, setFormValues] = React.useState({
    carType: "",
    transmissionType: "",
    manufacturingDate: "",
    fuelType: "",
    totalMileage: "",
    carMake: "",
    carModel: "",
    periodDuration: "",
    car_features: [],
    radius: 0,
    locationType: "",
    color: "",
    doors: "",
    price: 0,
    seats: "",
  });

  const [map, setMap] = React.useState(null);
  const [searchBox, setSearchBox] = React.useState(null);
  const [currentLocation, setCurrentLocation] = React.useState(null);
  const [carPictures, setCarPictures] = React.useState([]);
  const [images, setImages] = React.useState({
    front: null,
    back: null,
    left: null,
    right: null,
    fontInterior: null,
    backInterior: null,
    additional: [],
  });
  const [inputValue, setInputValue] = React.useState("");

  const [documents, setDocuments] = React.useState({
    plateNumber: null,
    driverLicense: null,
    libre: null,
    license: null,
    insurance: null,
  });

  const [selectedFeatures, setSelectedFeatures] = React.useState([]);
  const [selectedLocation, setSelectedLocation] = React.useState(null);

  const [pickup, setPickup] = React.useState([]);
  const [dropoff, setDropoff] = React.useState([]);

  const [availabilityDate, setAvailabilityDate] = React.useState("");
  const [instantBooking, setInstantBooking] = React.useState(false);
  const center = {
    lat: 8.99150046103335,
    lng: 38.773171909982715,
  };

  let { setValue, suggestions, clearSuggestions } = usePlacesAutocomplete({});

 
  const dispatch = useDispatch();

  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const [markerPosition, setMarkerPosition] = React.useState(center);
  const libraries = ["places"];

  const handleSearch = (e) => {
    setValue(e.target.value);
    setSearchBox(e.target.value);
  };
  const handleSnakbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleChangeInput = (e) => {
    setInputValue(e.target.value);
  };

  const [open, setOpen] = React.useState(false);
  const [error, setErrors] = React.useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const submitLocation = () => {
    if (!formValues.locationType) {
      setErrors("Please select location type");
      setOpenSnackbar(true);
      return;
    }

    if (formValues.locationType === "Pickup") {
      setPickup([...pickup, selectedLocation]);
      setSelectedLocation(null);
    } else {
      setDropoff([...dropoff, selectedLocation]);
    }
    handleClose();
  };
  const handleAddFeature = (e, value) => {
    console.log(value, "value");

    if (value && !selectedFeatures.includes(value)) {
      setSelectedFeatures([...selectedFeatures, value]);
    }
  };

  const handleRemoveTags = (itemName) => {
    setSelectedFeatures((prevItems) =>
      prevItems.filter((item) => item !== itemName)
    );
  };

  const handleChange = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  };
  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    const processedImages = [];
    for (const file of files) {
      const resizedImage = await resizeImage(file);
      processedImages.push(resizedImage);
    }
    setCarPictures(processedImages);
  };

  const handleImagesChange = async (e) => {
    const file = e.target.files[0];
    const name = e.target.name;

    const resizedImage = await resizeImage(file);

    if (file) {
      setImages((prevState) => ({
        ...prevState,
        [name]: resizedImage,
      }));
    }
  };

  const handleFilesChange = async (e) => {
    const file = e.target.files[0];
    const name = e.target.name;

    // const resizedImage = await resizeImage(file);

    if (file) {
      setDocuments((prevState) => ({
        ...prevState,
        [name]: file,
      }));
    }
  };

  const handleSwitchChange = (e) => {
    setInstantBooking(e.target.checked);
  };

  const handleNextStep = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBackStep = () => {
    setActiveStep((prev) => prev - 1);
  };

  const sideContent = [
    "Provide details about your car to get started",
    "Please Upload Clear Pictures of the  car’. Make sure you have at least 4 images that covers all corners.",
    "Make sure to upload all documents necessary to validate that you have ownership of the rented car.",
    "Make sure to upload all documents necessary to validate that you have ownership of the rented car.",
    "Make sure to upload all documents necessary to validate that you have ownership of the rented car ",
    "Make sure to upload all documents necessary to validate that you have ownership of the rented car ",
  ];

  const action = (
    <div
      style={{
        paddig: "140px",
      }}
    >
      <Button color="secondary" size="small" onClick={handleSnakbarClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleSnakbarClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </div>
  );

  const handleSelect = async (e, newValue) => {
    if (newValue) {
      setValue(newValue.description, false);

      try {
        const results = await getGeocode({
          address: newValue.description,
        });
        const { lat, lng } = await getLatLng(results[0]);

        const data = {
          id: newValue.place_id,
          address: newValue.description,
          lat: lat,
          lng: lng,
        };

        setSelectedLocation(data);
        setMarkerPosition({ lat, lng });
      } catch (e) {
        console.log(
          "error while fetching longitude on handle select",
          e.message
        );
      }
      clearSuggestions();
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(position, "position");

          setCurrentLocation({ lat: latitude, lng: longitude });
          setMarkerPosition({ lat: latitude, lng: longitude });
          console.log(
            `User's current location: Latitude: ${latitude}, Longitude: ${longitude}`
          );
        },
        (error) => {
          console.error("Error getting user location: ", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleMapClick = (event) => {
    const { latLng } = event;
    const lat = latLng.lat();
    const lng = latLng.lng();
    setMarkerPosition({ lat, lng });
    console.log(`Latitude: ${lat}, Longitude: ${lng}`);
  };

  const handleRemove = (id, ltype) => {
    if (ltype === "pickup") {
      setPickup((prevLocations) =>
        prevLocations.filter((location) => location.id !== id)
      );
    } else {
      if (ltype === "dropoff") {
        setDropoff((prevLocations) =>
          prevLocations.filter((location) => location.id !== id)
        );
      }
    }
  };

  console.log(suggestions, "suggestion");

  const uploadToS3Admin = async (documentType, image, id) => {
    try {
      const extension = image.name.split(".").pop().toLowerCase();
      if (!extension) {
        throw new Error("Invalid file extension");
      }

      const data = {
        contentType: `image/${extension}`,
        filename: `${documentType}`,
      };

      const res = await axios.post(
        `${BASE_URL}/vehicle/get_admin_presigned_url/${id}`,
        data
      );
      console.log("admin->response", res);

      const { url, key } = res.data.body;

      const response = await axios.put(url, image);

      return { key, url };
    } catch (error) {
      console.error(`Failed to upload admin document ${documentType}: `, error);
      throw error;
    }
  };

  const uploadImageToS3 = async (image, index, id) => {
    try {
      const extension = image.name.split(".").pop().toLowerCase();

      if (!extension) {
        throw new Error("Invalid file extension");
      }

      const data = {
        filename: `image-${index}`,
        contentType: `image/${extension}`,
      };

      const res = await axios.post(
        `${BASE_URL}/vehicle/get_presigned_url/${id}`,
        data
      );
      const { url, key } = res.data.body;
      await axios.put(url, image);
      return { key, url };
    } catch (error) {
      console.error(`Failed to upload image ${index}:`, error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    const uuid = uuidv4();
    console.log("inside submit");
    const imageKeys = [];
    const adminKeys = [];

    const alldocuments = {
      front: images.front,
      back: images.back,
      left: images.left,
      right: images.right,
      platenumber: documents.plateNumber,
      driverLicense: documents.driverLicense,
      insurance: documents.insurance,
      interiorFront: images.interiorFront,
      interiorBack: images.interiorBack,
    };
    for (const [documentType, image] of Object.entries(alldocuments)) {
      if (image) {
        try {
          console.log(image, documentType, "hereeeeeeeeee");
          const { key, url } = await uploadToS3Admin(documentType, image, uuid);
          adminKeys.push({ key, url });
        } catch (error) {
          console.log(`Error uploading ${documentType}: ${error.message}`);
        }
      }
    }

    for (const [index, image] of carPictures.entries()) {
      try {
        const { key, url } = await uploadImageToS3(image, index, uuid);
        imageKeys.push({ key, url });
      } catch (error) {
        console.log(
          `Error uploading image at index ${index}: ${error.message}`
        );
      }
    }

    const vehicleData = {
      city: formValues.city || "Addis Ababa",
      category: formValues.carType,
      make: formValues.make,
      model: formValues.model,
      year: formValues.manufacturingDate,
      vehichleNumber: formValues.vehicleNumber || "0",
      doors: formValues.doors,
      fuelType: formValues.fuelType,
      seats: formValues.seats,
      color: formValues.color,
      id: uuid,
      transmission: formValues.transmissionType,
      modelSpecification: formValues.modelSpecification || "none",
      vehicleImageKeys: imageKeys,
      adminDocumentKeys: adminKeys,
      // price: formValues.price,
      location:
        pickup.length > 0 ? [pickup[0].lat || 0, pickup[0].lng || 0] : [0, 0],
    };

    try {
      console.log(vehicleData, "vehicle data");

      dispatch(createVehicle(vehicleData));
      setSuccess(true);
    } catch (e) {
      console.log(e, "error");
    }
  };

  const [success, setSuccess] = React.useState(false);
  const navigate = useNavigate();

  const handleContinue = () => {
    setSuccess(false);
    navigate("/");
  };

  return (
    <>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            position: "relative",
            maxWidth: "40vw",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "10px",
              position: "absolute",
              top: "10%",
              left: "60%",
              width: "100%",
              height: "fit-content",
            }}
          >
            <div
              onClick={handleClose}
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "flex-end",
                padding: "10px",
              }}
            >
              <X />
            </div>
            <div
              style={{
                paddingBottom: "40px",
                paddingLeft: "30px",
                paddingRight: "40px",
              }}
            >
              <h1
                style={{
                  fontSize: "22px",
                }}
              >
                Set location
              </h1>
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                }}
              >
                <FormControl fullWidth>
                  <InputLabel
                    id="radius"
                    sx={{
                      fontSize: "16px",
                    }}
                  >
                    Radius
                  </InputLabel>
                  <Select
                    labelId="radius"
                    id="radius"
                    value={formValues.locationType}
                    label="Radius"
                    onChange={handleChange}
                  >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={30}>30</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel
                    id="location-type"
                    sx={{
                      fontSize: "16px",
                    }}
                  >
                    Location Type
                  </InputLabel>
                  <Select
                    labelId="location-type"
                    id="location-type"
                    value={formValues.locationType}
                    label="Location Type"
                    name="locationType"
                    onChange={handleChange}
                  >
                    <MenuItem value={"Pickup"}>Pickup</MenuItem>
                    <MenuItem value={"Dropoff"}>Dropoff</MenuItem>
                  </Select>
                </FormControl>
              </div>


              

              <div
                style={{
                  width: "100%",
                  marginTop: "20px",
                }}
              >
                <LoadScript
                  style={{ width: "100%" }}
                  googleMapsApiKey={API_KEY}
                  libraries={libraries}
                >
                  <div
                    style={{
                      width: "100%",
                    }}
                  >
                    <Autocomplete
                      freeSolo
                      options={suggestions?.data.map((suggestion) => ({
                        id: suggestion.place_id,
                        description: suggestion.description,
                      }))}
                      getOptionLabel={(option) => option.description}
                      onChange={handleSelect}
                      renderInput={(params) => (
                        <TextField
                          onChange={handleSearch}
                          {...params}
                          placeholder="Search locations"
                          style={{
                            width: "100%",
                            padding: "8px",
                            fontSize: "16px",
                            marginBottom: "10px",
                          }}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: <Search />,
                          }}
                        />
                      )}
                    />
                    <GoogleMap
                      mapContainerStyle={containerStyle}
                      center={markerPosition}
                      zoom={15}
                      onLoad={setMap}
                      onClick={handleMapClick}
                    >
                      <Marker position={markerPosition} />
                    </GoogleMap>
                  </div>
                </LoadScript>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  width: "100%",
                  marginTop: "10px",
                  padding: "10px 0px",
                }}
              >
                <button
                  style={{
                    width: "60%",
                    border: "1px solid black",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "2rem",
                    backgroundColor: "#fff",
                  }}
                >
                  Pin on map
                </button>

                <button
                  style={{
                    width: "40%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "10px 0px",
                    backgroundColor: "#00173C",
                    borderRadius: "2rem",
                    gap: "10px",
                  }}
                  onClick={getUserLocation}
                >
                  <LocateFixed color="#fff" />
                  <p
                    style={{
                      color: "#fff",
                      fontSize: "14px",
                    }}
                  >
                    My location
                  </p>
                </button>
              </div>

              <div
                style={{
                  width: "100%",
                }}
              >
                <button
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "10px 0px",
                    backgroundColor: "#00173C",
                    borderRadius: "2rem",
                    gap: "10px",
                  }}
                  onClick={submitLocation}
                >
                  <p
                    style={{
                      color: "#fff",
                      fontSize: "14px",
                    }}
                  >
                    Set location
                  </p>
                </button>
              </div>
            </div>
          </div>
        </Box>
      </Modal>

      <Modal open={success} onClick={() => setSuccess(false)}>
        <Box
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            position: "relative",
            maxWidth: "40vw",
          }}
        >
          <div
            style={{
              backgroundColor: "#EDF0FF",
              borderRadius: "10px",
              position: "absolute",
              top: "30%",
              left: "60%",
              width: "100%",
              height: "fit-content",
            }}
          >
            <div
              style={{
                paddingTop: "40px",
                paddingBottom: "40px",
                paddingLeft: "30px",
                paddingRight: "40px",
              }}
            >
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <p
                    style={{
                      fontSize: "28px",
                    }}
                  >
                    Listing Submitted
                  </p>
                  <p
                    style={{
                      fontSize: "16px",
                    }}
                  >
                    Your Listing has been submitted. Our sales team will contact
                    you about your lisitng
                  </p>
                </div>
              </div>

              <button
                href="/"
                style={{
                  textDecoration: "none",
                  marginTop: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  padding: "10px 0px",
                  background: "#fff",
                  border: "1px solid black",
                  borderRadius: "2rem",
                  color: "black",
                }}
                onClick={handleContinue}
              >
                <p>Continue</p>
              </button>
            </div>
          </div>
        </Box>
      </Modal>
      <div
        style={{
          paddingTop: "140px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            gap: "33px",
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              borderRadius: "18px",
              padding: "7rem",
              boxShadow: "0px 4px 30px 0px rgba(221, 224, 255, 0.54)",
            }}
          >
            <div
              style={{
                width: "100%",
              }}
            >
              <Stack sx={{ width: "100%" }} spacing={4}>
                <Stepper
                  alternativeLabel
                  activeStep={activeStep}
                  connector={<QontoConnector />}
                >
                  {steps.map((label) => (
                    <Step key={label}></Step>
                  ))}
                </Stepper>
              </Stack>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "20px",
                paddingLeft: "50px",

                width: "100%",
              }}
            >
              {activeStep === 1 ? (
                <StepOne
                  formValues={formValues}
                  activeStep={activeStep}
                  styles={styles}
                  handleChange={handleChange}
                  handleNextStep={handleNextStep}
                  handleFileChange={handleFileChange}
                  carPictures={carPictures}
                />
              ) : null}

              {activeStep === 2 ? (
                <StepTwo
                  activeStep={activeStep}
                  styles={styles}
                  handleBackStep={handleBackStep}
                  handleNextStep={handleNextStep}
                  handleImagesChange={handleImagesChange}
                  images={images}
                />
              ) : null}

              {activeStep === 3 ? (
                <StepThree
                  activeStep={activeStep}
                  handleBackStep={handleBackStep}
                  handleNextStep={handleNextStep}
                  styles={styles}
                  handleFilesChange={handleFilesChange}
                  documents={documents}
                />
              ) : null}

              {activeStep === 4 ? (
                <StepFour
                  activeStep={activeStep}
                  styles={styles}
                  handleBackStep={handleBackStep}
                  handleNextStep={handleNextStep}
                  handleAddFeature={handleAddFeature}
                  handleChange={handleChangeInput}
                  formValues={formValues}
                  inputValue={inputValue}
                  selectedFeatures={selectedFeatures}
                  handleRemoveTags={handleRemoveTags}
                />
              ) : null}

              {activeStep === 5 ? (
                <StepFive
                  activeStep={activeStep}
                  handleBackStep={handleBackStep}
                  formValues={formValues}
                  handleChange={handleChange}
                  handleNextStep={handleNextStep}
                  styles={styles}
                  setAvailabilityDate={setAvailabilityDate}
                  availabilityDate={availabilityDate}
                  handleSwitchChange={handleSwitchChange}
                  instantBooking={instantBooking}
                />
              ) : null}

              {activeStep === 6 ? (
                <StepSix
                  activeStep={activeStep}
                  handleOpen={handleOpen}
                  handleBackStep={handleBackStep}
                  handleNextStep={handleNextStep}
                  pickup={pickup}
                  dropoff={dropoff}
                  handleRemove={handleRemove}
                />
              ) : null}

              {activeStep === 7 ? (
                <StepSeven
                  activeStep={activeStep}
                  styles={styles}
                  handleBackStep={handleBackStep}
                  handleNextStep={handleNextStep}
                  formValues={formValues}
                  selectedFeatures={selectedFeatures}
                  handleSubmit={handleSubmit}
                />
              ) : null}
            </div>
          </div>

          {activeStep !== 7 ? (
            <div
              style={{
                width: "40%",
                paddingTop: "2rem",
                backgroundColor: "#D8E2FF",
                maxHeight: "200px",
                paddingLeft: "16px",
                fontSize: "16px",
                borderRadius: "4px",
              }}
            >
              <p>{sideContent[activeStep - 1]}</p>
            </div>
          ) : (
            <div
              style={{
                width: "40%",
                paddingTop: "2rem",

                maxHeight: "200px",
                paddingLeft: "16px",
                fontSize: "16px",
                borderRadius: "4px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <div
                style={{
                  boxShadow: "0px 4px 30px 0px rgba(221, 224, 255, 0.54)",
                  padding: "25px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  borderRadius: "5px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  <p>Booking</p>
                  <Chip
                    sx={{
                      backgroundColor: "#fff",
                      fontSize: "16px",
                      border: "1px solid black",
                      borderRadius: "5px",
                    }}
                    label={instantBooking ? "Instant" : "Not instant"}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  <p>Notice period for rent</p>
                  <Chip
                    sx={{
                      backgroundColor: "#fff",
                      fontSize: "16px",
                      border: "1px solid black",
                      borderRadius: "5px",
                    }}
                    label={formValues.periodDuration}
                  />
                </div>
              </div>

              <div
                style={{
                  boxShadow: "0px 4px 30px 0px rgba(221, 224, 255, 0.54)",
                  padding: "25px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  borderRadius: "5px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexDirection: "column",
                  }}
                >
                  <p
                    style={{
                      fontWeight: "700",
                    }}
                  >
                    Pickup locations
                  </p>
                  <div
                    style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
                  >
                    {pickup.map((pick) => (
                      <Chip
                        sx={{
                          backgroundColor: "#fff",
                          fontSize: "16px",
                          border: "1px solid black",
                          borderRadius: "5px",
                        }}
                        label={pick.address}
                      />
                    ))}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexDirection: "column",
                  }}
                >
                  <p
                    style={{
                      fontWeight: "700",
                    }}
                  >
                    Dropoff locations
                  </p>
                  <div
                    style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
                  >
                    {dropoff.map((drop) => (
                      <Chip
                        sx={{
                          backgroundColor: "#fff",
                          fontSize: "16px",
                          border: "1px solid black",
                          borderRadius: "5px",
                        }}
                        label={drop.address}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div
                style={{
                  boxShadow: "0px 4px 30px 0px rgba(221, 224, 255, 0.54)",
                  padding: "25px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  borderRadius: "5px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <div>
                    <p>Available Rental Date</p>
                  </div>
                  {/* <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                   
                    {availabilityDate[0]} - {availabilityDate[1]}
                  </div> */}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Box sx={{ width: 500 }}>
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={openSnackbar}
          autoHideDuration={2000}
          onClose={handleSnakbarClose}
          message={error}
          action={action}
          key={"bottom" + "right"}
          height={500}
        />
      </Box>
    </>
  );
}
