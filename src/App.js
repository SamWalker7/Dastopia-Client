import "../src/dist/styles.css";
import About from "./Pages/About";
import Home from "./Pages/Home";
import Navbar from "../src/components/Navbar";
import { Route, Routes } from "react-router-dom";
import Models from "./Pages/Models";
import TestimonialsPage from "./Pages/TestimonialsPage";
import Team from "./Pages/Team";
import Contact from "./Pages/Contact";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Search from "./Pages/Search";
import Details from "./Pages/Details";
import Booking from "./Pages/Booking";
import BookingConfirmation from "./Pages/BookingConfirmation";
import SignIn from "./Pages/Signin";
import SignUp from "./Pages/SignUp";
import AWS from 'aws-sdk';
import OTPInput from "./Pages/OTP";
import NotFound from "./components/404";
import BookingDetails from "./Pages/BookingDetails";
import TermsAndConditions from "./Pages/TermsAndConditions";

AWS.config.region = 'us-east-1';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="models" element={<Models />} />
        <Route path="testimonials" element={<TestimonialsPage />} />
        <Route path="team" element={<Team />} />
        <Route path="contact" element={<Contact />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="search" element={<Search />} />
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="/confirmaccount/:email" element={<OTPInput />} />
        <Route path="/booking_details/:id" element={<BookingDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
