import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

function Payment({
  //   handlePlanChange,
  //   selectedPlan,
  planOption,
  handlePlanOptionChange,
  dailyFee,
  rentalDays,
  dropOffTime,
  pickupTime,

  insurancefee,
  contract_fee,
  registration_fee,
  handleSubmitBooking,
  setTotal,
}) {
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const [selectedOption, setSelectedOption] = useState({
    basic: "",
    premium: "",
    premiumPlus: "",
  });

  const value = new Date(dropOffTime) - new Date(pickupTime);
  const differenceInDays = value / (1000 * 3600 * 24);
  const total = dailyFee * differenceInDays + dailyFee * differenceInDays * 0.1;

  useEffect(() => {
    setTotal(total);
  }, []);

  const handlePlanChange = (event) => {
    setSelectedPlan(event.target.value);
  };

  const handleSelectChange = (event, planType) => {
    setSelectedOption({
      ...selectedOption,
      [planType]: event.target.value,
    });
  };
  return (
    <div style={{ padding: "16px" }}>
      <div
        style={{
          padding: "16px",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Insurance Payment
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          You will need to pay in advance for the car insurance.
        </Typography>

        <Box style={{ width: "100%" }}>
          <FormControl
            style={{
              width: "100%",
            }}
            component="fieldset"
          >
            <RadioGroup
              name="insurance-plan"
              value={selectedPlan}
              onChange={handlePlanChange}
              style={{
                width: "100%",
              }}
            >
              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  marginBottom: "10px",
                  padding: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <FormControlLabel
                  value="basic"
                  control={<Radio />}
                  label={
                    <Typography variant="body1">
                      Basic Insurance Plan
                    </Typography>
                  }
                />
                <Select
                  value={selectedOption.basic}
                  onChange={(event) => handleSelectChange(event, "basic")}
                  displayEmpty
                  variant="standard"
                  style={{
                    width: "100%",
                    border: "none",
                    background: "transparent",
                  }}
                  disableUnderline
                >
                  <MenuItem value="option1">Option 1</MenuItem>
                  <MenuItem value="option2">Option 2</MenuItem>
                  <MenuItem value="option3">Option 3</MenuItem>
                </Select>
              </div>

              <Box
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  marginBottom: "10px",
                  padding: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <FormControlLabel
                  value="premium"
                  control={<Radio />}
                  label={<Typography variant="body1">Premium Plan</Typography>}
                />
                <Select
                  value={selectedOption.premium}
                  onChange={(event) => handleSelectChange(event, "premium")}
                  displayEmpty
                  variant="standard"
                  style={{
                    width: "100px",
                    border: "none",
                    background: "transparent",
                  }}
                  disableUnderline
                >
                  <MenuItem value="option1">Option 1</MenuItem>
                  <MenuItem value="option2">Option 2</MenuItem>
                  <MenuItem value="option3">Option 3</MenuItem>
                </Select>
              </Box>

              {/* Premium Plus Plan */}
              <Box
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  padding: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <FormControlLabel
                  value="premiumPlus"
                  control={<Radio />}
                  label={
                    <Typography variant="body1">Premium Plus Plan</Typography>
                  }
                />
                <Select
                  value={selectedOption.premiumPlus}
                  onChange={(event) => handleSelectChange(event, "premiumPlus")}
                  displayEmpty
                  variant="standard"
                  style={{
                    width: "100px",
                    border: "none",
                    background: "transparent",
                  }}
                  disableUnderline
                >
                  <MenuItem value="option1">Option 1</MenuItem>
                  <MenuItem value="option2">Option 2</MenuItem>
                  <MenuItem value="option3">Option 3</MenuItem>
                </Select>
              </Box>
            </RadioGroup>
          </FormControl>
        </Box>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
          }}
        >
          <p
            style={{
              fontSize: "14px",
            }}
          >
            Daily Fee:{" "}
          </p>

          <p
            style={{
              fontSize: "14px",
            }}
          >
            {dailyFee} birr
          </p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <p
            style={{
              fontSize: "14px",
            }}
          >
            Rental Days:{" "}
          </p>{" "}
          <p
            style={{
              fontSize: "14px",
            }}
          >
            {differenceInDays} days
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <p
            style={{
              fontSize: "14px",
            }}
          >
            Tax:{" "}
          </p>{" "}
          <p
            style={{
              fontSize: "14px",
            }}
          >
            13%({differenceInDays * dailyFee * 0.1} ETB)
          </p>
        </div>

        <Divider style={{ margin: "16px 0" }} />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "14px",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              fontWeight: "700",
            }}
          >
            Total Cost:
          </p>

          <p
            style={{
              fontSize: "14px",
            }}
          >
            {total} ETB
          </p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "14px",
          }}
        >
          <p
            style={{
              fontSize: "14px",
            }}
          >
            Basic Insurance Plan
          </p>

          <p
            style={{
              fontSize: "14px",
            }}
          >
            1000 ETB
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "14px",
          }}
        >
          <p
            style={{
              fontSize: "14px",
            }}
          >
            Legal contract fee
          </p>

          <p
            style={{
              fontSize: "14px",
            }}
          >
            1000 ETB
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <p
            style={{
              fontSize: "14px",
            }}
          >
            Registration fee
          </p>

          <p
            style={{
              fontSize: "14px",
            }}
          >
            1200 ETB
          </p>
        </div>

        <Divider />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "14px",
            marginBottom: "15px",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              fontWeight: "800",
            }}
          >
            Total Cost:
          </p>

          <p
            style={{
              fontSize: "14px",
            }}
          >
            {total + 1000 + 1000 + 1200} ETB
          </p>
        </div>

        <Button
          style={{
            backgroundColor: "#00173C",
            padding: "10px 0px",
            borderRadius: "2rem",
            width: "100%",
            color: "#fff",
            fontSize: "14px",
            maringTop: "20px",
          }}
          onClick={handleSubmitBooking}
        >
          Book
        </Button>
      </div>
    </div>
  );
}

export default Payment;
