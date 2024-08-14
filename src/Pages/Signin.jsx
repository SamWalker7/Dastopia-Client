import React, { useRef, useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  OutlinedInput,
  Tabs,
  Tab,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { signin } from "../api/auth";

function SignIn() {
  const navigate = useNavigate();
  const [pwdError, setPwdError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [phone, setPhone] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const passwordRef = useRef(null);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePwdChange = (e) => {
    setPwd(e.target.value);
  };

  const validate = () => {
    const errors = {};
    // if (value == 0 && !formData.email) {
    //   errors.email = "Email is required";
    //   // emailRef.current.focus();
    // } else if (value == 0 && !/\S+@\S+\.\S+/.test(formData.email)) {
    //   errors.email = "Email address is invalid";
    //   // emailRef.current.focus();
    // }
    if (!formData.password) {
      errors.password = "Password is required";
      console.log("password error")
    }

    // if(value == 1 && !pwd){
    //   setPwdError("Password is Required")
    // }


    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validate();
    if (Object.keys(formErrors).length === 0) {
      try {

        const signinOption = phone;
        const signinPassword = formData.password
        
        const response = await signin(signinOption, signinPassword);
        const responseData = {
          email_verified: response.idToken.payload.email_verified,
          email: response.idToken.payload.email,
          firstName: response.idToken.payload.given_name,
          lastName: response.idToken.payload.family_name,
          phoneNumber: response.idToken.payload.phone_number,
          refreshToken: response.refreshToken.token,
          accessToken: response.accessToken.jwtToken,
          accExp: response.accessToken.payload.exp,
          userId: response.accessToken.payload.username,
        };

        localStorage.setItem("token", responseData.accessToken);
        localStorage.setItem("accExp", responseData.accExp);
        localStorage.setItem("refreshToken", responseData.refreshToken);
        localStorage.setItem("user", JSON.stringify(responseData));
        navigate("/");
        navigate("/");
      } catch (err) {
        setError(err.message);
      }
    } else {
      setErrors(formErrors);
    }
  };

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  const [value, setValue] = useState(0);


  return (
    <div
      style={{
        paddingTop: "200px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* <Box sx={{ borderBottom: 1, borderColor: "divider", maxWidth: "500px" }}>
        <Tabs
          value={value}
          onChange={handleChangeTab}
          aria-label="basic tabs example"
        >
          <Tab
            label="Signin with email"
            sx={{ fontSize: "15px" }}
            id="simple-tab-0"
            aria-controls="simple-tabpanel-0"
          />
          <Tab
            label="Signin with phone"
            sx={{ fontSize: "15px" }}
            id="simple-tab-1"
            aria-controls="simple-tabpanel-1"
          />
        </Tabs>
      </Box> */}
      <Container component="main" maxWidth="xs">
        {error && (
          <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
        )}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 8,
            backgroundColor: "white",
            boxShadow: "0",
            borderRadius: "5px",
            py: 3,
            px: 3,
            border: "1px solid gray",
          }}
        >
          <Typography component="h1" variant="h3">
            Sign In
          </Typography>
          <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit}>
            {/* {value === 0 ? ( */}
              
                {/* <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  inputRef={emailRef}
                  InputProps={{
                    sx: {
                      fontSize: "1.5rem",
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      fontSize: "1.5rem",
                    },
                  }}
                  helperText={errors.email}
                  error={!!errors.email}
                /> */}

                {/* <OutlinedInput
                  margin="normal"
                  required
                  fullWidth
                  id="outlined-adornment-password"
                  name="password"
                  autoComplete="Password"
                  value={formData.password}
                  onChange={handleChange}
                  inputRef={passwordRef}
                  type={showPassword ? "text" : "password"}
                  sx={{
                    fontSize: "15px",
                  }}
                  InputProps={{
                    sx: {
                      fontSize: "20",
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      fontSize: "1.5rem",
                    },
                  }}
                  helperText={errors.password}
                  error={!!errors.password}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                /> */}
              
            {/* ) : ( */}
              
                <PhoneInput
                  country={"et"}
                  value={phone}
                  onChange={(value) => setPhone(value)}
                  inputRef={phoneRef}
                  placeholder="+251965667890"
                  inputStyle={{
                    width: "100%",
                    height: "60px",
                  }}
                />

                <OutlinedInput
                  margin="normal"
                  required
                  fullWidth
                  id="outlined-adornment-password"
                  name="password"
                  autoComplete="Password"
                  value={formData.password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  sx={{
                    fontSize: "15px",
                    marginTop: "15px",
                  }}
                  InputProps={{
                    sx: {
                      fontSize: "20",
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      fontSize: "1.5rem",
                    },
                  }}
                  helperText={errors.password}
                  error={!!errors.password}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              
            {/* )} */}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1, fontSize: 15 }}
            >
              Sign In
            </Button>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <p style={{ fontSize: "15px" }}> Dont have an account yet ? </p>
            <a
              href="/signup"
              style={{
                textDecoration: "none",
                color: "#2a43cf",
                fontSize: "13px",
              }}
            >
              Signup here
            </a>
          </div>
        </Box>
      </Box>
    </Container>
    </div>
  );
}

export default SignIn;
