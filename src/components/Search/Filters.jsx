import React from "react";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

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
    flexWrap: "wrap",
  },
  formControl: {
    minWidth: "120px",
    marginRight: "16px",
    marginBottom: "10px",
    marginLeft: "16px",
  },
  label: {
    fontWeight: "bold",
    marginBottom: "8px",
    display: "block",
  },
  select: {
    padding: "8px",
    paddingRight: "100px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width: "100%",
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
        <div style={styles.formControl}>
          <label style={styles.label}>Sort By</label>
          <select style={styles.select}>
            <option value="relevance">Relevance</option>
            <option value="price-low-to-high">Price: Low to High</option>
            <option value="price-high-to-low">Price: High to Low</option>
          </select>
        </div>
        <div style={styles.formControl}>
          <label style={styles.label}>Daily Price Range</label>
          <select style={styles.select}>
            <option value="any">Any</option>
            <option value="0-50">$0 - $50</option>
            <option value="51-100">$51 - $100</option>
            <option value="101-200">$101 - $200</option>
          </select>
        </div>
        <div style={styles.formControl}>
          <label style={styles.label}>Collection</label>
          <select style={styles.select}>
            <option value="any">Any</option>
            <option value="summer">Summer Collection</option>
            <option value="winter">Winter Collection</option>
          </select>
        </div>
        <div style={styles.formControl}>
          <label style={styles.label}>Vehicle Type</label>
          <select style={styles.select}>
            <option value="any">Any</option>
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="convertible">Convertible</option>
          </select>
        </div>
        <div style={styles.formControl}>
          <label style={styles.label}>Make</label>
          <select style={styles.select}>
            <option value="any">Any</option>
            <option value="toyota">Toyota</option>
            <option value="honda">Honda</option>
            <option value="ford">Ford</option>
          </select>
        </div>
      </div>
      {/* <FormGroup row style={styles.checkboxGroup}>
        <FormControlLabel control={<Checkbox />} label="Free Cancellation" />
        <FormControlLabel control={<Checkbox />} label="Instant Book" />
        <FormControlLabel control={<Checkbox />} label="Delivered to You" />
      </FormGroup> */}
    </div>
  );
};

export default Filters;
