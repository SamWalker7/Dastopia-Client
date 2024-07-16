import React from "react";
import { TextField, Button } from "@mui/material";

const SearchBar = () => {
  return (
    <div
      className="my-4 flex items-center space-x-4"
      style={{
        marginRight: "30px",
        width: "100%",
      }}
    >
      <TextField
        label="Location"
        variant="outlined"
        style={{
          marginRight: "30px",
          width: "20%",
        }}
      />
      <TextField
        label="Start Date"
        type="date"
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        style={{
          marginRight: "30px",
          width: "20%",
        }}
      />
      <TextField
        label="End Date"
        type="date"
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        style={{
          marginRight: "30px",
          width: "20%",
        }}
      />
      <Button
        variant="contained"
        color="primary"
        style={{
          padding: "13px",
          width: "20%",
          fontSize: "12px",
        }}
      >
        Search
      </Button>
    </div>
  );
};

export default SearchBar;
