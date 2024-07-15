import React from "react";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

const styles = {
  filterContainer: {
    padding: "16px",
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    borderRadius: "4px",
    marginBottom: "16px",
    marginTop: "20px",
  },
  filterRow: {
    display: "flex",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  formControl: {
    minWidth: "120px",
    marginRight: "16px",
    marginBottom: "10px",
  },
  label: {
    fontWeight: "bold",
    marginBottom: "8px",
  },
  checkboxGroup: {
    display: "flex",
    flexWrap: "wrap",
  },
};

const Filters = () => {
  return (
    <div style={styles.filterContainer}>
      <div style={styles.filterRow}>
        <FormControl style={styles.formControl}>
          <InputLabel style={styles.label}>Sort By</InputLabel>
          <Select
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200,
                  width: 250,
                },
              },
            }}
          >
            <MenuItem value="relevance">Relevance</MenuItem>
            <MenuItem value="price-low-to-high">Price: Low to High</MenuItem>
            <MenuItem value="price-high-to-low">Price: High to Low</MenuItem>
          </Select>
        </FormControl>
        <FormControl style={styles.formControl}>
          <InputLabel style={styles.label}>Daily Price Range</InputLabel>
          <Select
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200,
                  width: 250,
                },
              },
            }}
          >
            <MenuItem value="any">Any</MenuItem>
            <MenuItem value="0-50">$0 - $50</MenuItem>
            <MenuItem value="51-100">$51 - $100</MenuItem>
            <MenuItem value="101-200">$101 - $200</MenuItem>
          </Select>
        </FormControl>
        <FormControl style={styles.formControl}>
          <InputLabel style={styles.label}>Collection</InputLabel>
          <Select
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200,
                  width: 250,
                },
              },
            }}
          >
            <MenuItem value="any">Any</MenuItem>
            <MenuItem value="summer">Summer Collection</MenuItem>
            <MenuItem value="winter">Winter Collection</MenuItem>
          </Select>
        </FormControl>
        <FormControl style={styles.formControl}>
          <InputLabel style={styles.label}>Vehicle Type</InputLabel>
          <Select
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200,
                  width: 250,
                },
              },
            }}
          >
            <MenuItem value="any">Any</MenuItem>
            <MenuItem value="sedan">Sedan</MenuItem>
            <MenuItem value="suv">SUV</MenuItem>
            <MenuItem value="convertible">Convertible</MenuItem>
          </Select>
        </FormControl>
        <FormControl style={styles.formControl}>
          <InputLabel style={styles.label}>Make</InputLabel>
          <Select
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200,
                  width: 250,
                },
              },
            }}
          >
            <MenuItem value="any">Any</MenuItem>
            <MenuItem value="toyota">Toyota</MenuItem>
            <MenuItem value="honda">Honda</MenuItem>
            <MenuItem value="ford">Ford</MenuItem>
          </Select>
        </FormControl>
      </div>
      <FormGroup row style={styles.checkboxGroup}>
        <FormControlLabel control={<Checkbox />} label="Free Cancellation" />
        <FormControlLabel control={<Checkbox />} label="Instant Book" />
        <FormControlLabel control={<Checkbox />} label="Delivered to You" />
      </FormGroup>
    </div>
  );
};

export default Filters;
