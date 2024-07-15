import React from "react";
import { TextField, Button } from "@mui/material";

const SearchBar = () => {
  return (
    <div className="my-4 flex items-center space-x-4">
      <TextField
        label="Location"
        variant="outlined"
        style={{
          marginRight: "30px",
        }}
      />
      <TextField
        label="Start Date"
        type="date"
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        style={{
          marginRight: "30px",
        }}
      />
      <TextField
        label="End Date"
        type="date"
        variant="outlined"
        InputLabelProps={{ shrink: true }}
      />
      <Button
        variant="contained"
        color="primary"
        style={{
          marginTop: "10px",
          marginLeft: "20px",
        }}
      >
        Search
      </Button>
    </div>
  );
};

export default SearchBar;
