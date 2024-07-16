import React from "react";
import { TextField, Button } from "@mui/material";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";

const SearchBar = () => {
  const ethiopianCities = [
    "Addis Ababa",
    "Dire Dawa",
    "Mekelle",
    "Gondar",
    "Bahir Dar",
    "Jimma",
    "Hawassa",
  ];

  const [selectedCity, setSelectedCity] = React.useState("");

  const handleChange = (event) => {
    setSelectedCity(event.target.value);
  };

  return (
    <div
      className="my-4 flex items-center space-x-4"
      style={{
        marginRight: "30px",
        width: "100%",
      }}
    >
      <FormControl
        variant="outlined"
        style={{ marginRight: "30px", width: "20%" }}
      >
        <InputLabel
          id="location-label"
          style={{
            fontSize: "16px",
            shrink: true,
          }}
        >
          Location
        </InputLabel>
        <Select
          labelId="location-label"
          value={selectedCity}
          onChange={handleChange}
          label="Location"
          style={{
            fontSize: "16px",
            shrink: true,
          }}
        >
          {ethiopianCities.map((city) => (
            <MenuItem
              key={city}
              value={city}
              style={{
                fontSize: "16px",
                shrink: true,
              }}
            >
              {city}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Start Date"
        type="date"
        variant="outlined"
        InputLabelProps={{
          style: { fontSize: "16px" },
          shrink: true,
        }}
        InputProps={{
          style: { fontSize: "16px" },
        }}
        style={{
          marginRight: "30px",
          width: "20%",
        }}
      />
      <TextField
        label="End Date"
        type="date"
        variant="outlined"
        InputLabelProps={{
          style: { fontSize: "16px" },
          shrink: true,
        }}
        InputProps={{
          style: { fontSize: "16px" },
        }}
        style={{
          marginRight: "30px",
          width: "20%",
        }}
      />
    </div>
  );
};

export default SearchBar;
