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
        InputProps={{
          style: { fontSize: "16px" },
        }}
        InputLabelProps={{
          style: { fontSize: "16px" },
          shrink: true,
        }}
        style={{
          marginRight: "30px",
          width: "20%",
        }}
      />
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
      <Button
        variant="contained"
        color="primary"
        style={{
          padding: "13px",
          width: "20%",
          fontSize: "13px",
        }}
      >
        Search
      </Button>
    </div>
  );
};

export default SearchBar;
