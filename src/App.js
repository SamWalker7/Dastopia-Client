import "../src/dist/styles.css";
import About from "./Pages/About Us/About";
import Home from "./Pages/Home";
import Navbar from "./components/Navbar";

import Navbar1 from "./components/Navbar1";
// Import useLocation hook
import { Route, Routes, useLocation } from "react-router-dom";
import Models from "./Pages/Models";
import TestimonialsPage from "./Pages/TestimonialsPage";
import Team from "./Pages/Team";
import Contact from "./Pages/Contact";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Search from "./Pages/Search";
import Details from "./Pages/Details/Details";
import Booking from "./Pages/Booking";
import BookingConfirmation from "./Pages/BookingConfirmation";
import SignIn from "./Pages/Signin"; // Consider removing if Login is used
import SignUp from "./Pages/SignUp"; // Consider removing if SignupForm is used
import { useEffect, useState, useRef } from "react"; // Import useRef
import AWS from "aws-sdk"; // Ensure AWS SDK is configured elsewhere if still needed
import OTPInput from "./Pages/OTP"; // Likely onboarding OTP, check usage
import NotFound from "./components/404";
import BookingDetails from "./Pages/BookingDetails";
import TermsAndConditions from "./Pages/TermsAndConditions";
import BookingRequests from "./Pages/BookingRequests"; // Check if used or replaced
import MyRequest from "./Pages/MyRequests"; // Check if used or replaced by MyRequests
import HowItWorks from "./Pages/How it works/HowItWorks";
import Profile from "./Pages/Profile";
import MyListing from "./Pages/MyListing/MyListing";
import RentalRequests from "./Pages/Rental Requests/rentalRequest";
import MyRequests from "./Pages/My Request/myRequest";
import ActivBooking from "./Pages/My Bookings/ActiveBooking"; // Typo? ActiveBooking
import SignupForm from "./Pages/Onboarding/SignUp";
import Login from "./Pages/Onboarding/Login";
import ForgotPassword, {
  Resetpassword,
} from "./Pages/Onboarding/ForgotPassword";
import Verification from "./Pages/Onboarding/Verification";
import OTP from "./Pages/Onboarding/OTP"; // Onboarding OTP
import ChatApp from "./Pages/chat";
import AddCar from "./Pages/Add Car/AddCar";
import Step2 from "./Pages/Add Car/Step2";
import Step3 from "./Pages/Add Car/Step3";
import Step4 from "./Pages/Add Car/Step4";
import Details2 from "./Pages/Details/Details2";
import Step5 from "./Pages/Add Car/Step5";
// Removed unused useState import, keeping useEffect
import { useDispatch, useSelector } from "react-redux";
import { refreshToken } from "./store/auth/authThunks";
import Review from "./components/Review";

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("customer");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const dispatch = useDispatch();
  const location = useLocation(); // Get the current location object
  const isInitialMount = useRef(true); // Ref to track initial mount

  // Effect for handling token refresh interval AND initial load/refresh
  useEffect(() => {
    // --- Refresh token immediately on load/refresh ---
    if (localStorage.getItem("customer")) {
      // Only refresh if a user potentially exists
      console.log("Refreshing token on initial load/refresh...");
      dispatch(refreshToken());
    }
    // -------------------------------------------------

    // Set up the interval for periodic refresh
    const interval = setInterval(() => {
      if (localStorage.getItem("customer")) {
        // Also check here for safety
        console.log("Refreshing token via interval...");
        dispatch(refreshToken());
      }
    }, 600000); // Runs every 10 minutes

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [dispatch]); // Dependency: dispatch function

  // Effect for handling token refresh on navigation
  useEffect(() => {
    // Skip the refresh on the very *first* render,
    // because the effect above already handles the initial load.
    if (isInitialMount.current) {
      isInitialMount.current = false; // Set ref to false after first render
      return; // Don't run refresh logic on initial mount here
    }

    // Run refresh logic on subsequent renders (caused by navigation)
    if (localStorage.getItem("customer")) {
      // Check if user exists before refreshing
      console.log("Refreshing token on navigation to:", location.pathname);
      dispatch(refreshToken());
    }
  }, [location, dispatch]); // Dependencies: location object and dispatch function

  // Effect for syncing user state with localStorage changes (e.g., from other tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      console.log("LocalStorage changed, updating user state.");
      const storedUser = localStorage.getItem("customer");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    // Cleanup listener on component unmount
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []); // No dependencies needed here

  // Removed the redirect logic from useEffect, as redirects should generally
  // be handled within routing logic (e.g., using ProtectedRoute components)
  // or based on API call failures.

  return (
    <>
      {/* {console.log("Current User State: ", user)} */}
      {user ? <Navbar user2={user} setUser={setUser} /> : <Navbar1 />}

      <Routes>
        {/* Public Routes */}
        <Route index path="/" element={<Home user={user} />} />
        <Route path="about" element={<About />} />
        <Route path="howitworks" element={<HowItWorks />} />
        <Route path="testimonials" element={<TestimonialsPage />} />
        <Route path="team" element={<Team />} />
        <Route path="contact" element={<Contact />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/details2/:id" element={<Details2 />} />
        <Route path="search" element={<Search />} />
        <Route path="login" element={<Login />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<Resetpassword />} />
        <Route path="verification" element={<Verification />} />
        <Route path="otp" element={<OTP />} />
        <Route path="signup" element={<SignupForm />} />
        <Route path="/confirmaccount/:email" element={<OTPInput />} />{" "}
        {/* Needs review - separate from onboarding OTP? */}
        <Route path="/terms" element={<TermsAndConditions />} />{" "}
        {/* Added example path */}
        {/* Protected Routes (should ideally wrap these with logic checking 'user' state) */}
        {/* Example: <Route path="profile" element={user ? <Profile user2={user} setUser={setUser} /> : <Navigate to="/login" />} /> */}
        <Route path="addcar" element={<AddCar />} />
        <Route path="step2" element={<Step2 />} />
        <Route path="step3" element={<Step3 />} />
        <Route path="step4" element={<Step4 />} />
        <Route path="step5" element={<Step5 />} />
        <Route
          path="profile"
          element={<Profile user2={user} setUser={setUser} />}
        />
        <Route path="booking" element={<ActivBooking />} />{" "}
        {/* Check typo: ActiveBooking */}
        <Route path="chat" element={<ChatApp />} />
        <Route path="mylisting" element={<MyListing />} />
        <Route path="myrequest" element={<MyRequests />} />{" "}
        {/* Check usage vs MyRequest */}
        <Route path="rentalrequest" element={<RentalRequests />} />
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />
        <Route path="/booking_details/:id" element={<BookingDetails />} />
        <Route path="/booking_requests" element={<BookingRequests />} />{" "}
        {/* Check usage */}
        <Route path="/my_requests" element={<MyRequest />} />{" "}
        {/* Check usage vs MyRequests */}
        <Route path="/review" element={<Review />} />
        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
