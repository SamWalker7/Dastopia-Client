import { Autocomplete, Button, Switch, TextField } from "@mui/material";

import { Search } from "lucide-react";
import React from "react";

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

function Availability({
  setSearchBox,
  setActiveTab,
  isDriverProvided,
  setIsDriverProvided,
  setPickUpLocation,
  setDropOffLocation,
}) {
  let { setValue, suggestions, clearSuggestions } = usePlacesAutocomplete({});

  const handleSelect = async (e, newValue) => {
    if (newValue) {
      setValue(newValue.description, false);

      try {
        const results = await getGeocode({
          address: newValue.description,
        });
        const { lat, lng } = getLatLng(results[0]);

        const data = {
          id: newValue.place_id,
          address: newValue.description,
          lat: lat,
          lng: lng,
        };

        if (e.target.id === "pickup-option-0") {
          console.log(data, "data");
          setPickUpLocation(data);
        } else {
          setDropOffLocation(data);
        }
        console.log(e.target.id, "event");
      } catch (e) {
        console.log(
          "error while fetching longitude on handle select",
          e.message
        );
      }
      clearSuggestions();
    }
  };

  const handleSearch = (e) => {
    setValue(e.target.value);
    setSearchBox(e.target.value);
  };

  const handleNext = () => {
    setActiveTab(1);
  };

  return (
    <div style={{ padding: "16px" }}>
      <div
        style={{
          width: "100%",
          marginTop: "20px",
        }}
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
            id="pickup"
            getOptionLabel={(option) => option.description}
            onChange={handleSelect}
            renderInput={(params) => (
              <TextField
                onChange={handleSearch}
                label="Select pickup location"
                name="pick"
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
        </div>
      </div>

      <div
        style={{
          width: "100%",
          marginTop: "20px",
        }}
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
                InputLabelProps={{
                  fontSize: "16px",
                }}
                onChange={handleSearch}
                label="Select dropoff location"
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
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <Switch
          checked={isDriverProvided}
          onChange={(e) => setIsDriverProvided(e.target.checked)}
        />
        <span>Would you like a driver provided to you?</span>
      </div>

      <Button
        variant="contained"
        style={{
          backgroundColor: "#00173C",
          padding: "10px 0px",
          borderRadius: "2rem",
        }}
        fullWidth
        onClick={handleNext}
      >
        Next
      </Button>
    </div>
  );
}

export default Availability;
