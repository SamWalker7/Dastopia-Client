import "../src/dist/styles.css";
import About from "./Pages/About Us/About";
import Home from "./Pages/Home";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
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
import SignIn from "./Pages/Signin";
import SignUp from "./Pages/SignUp";
import { useEffect } from "react";
import AWS from "aws-sdk";
import OTPInput from "./Pages/OTP";
import NotFound from "./components/404";
import BookingDetails from "./Pages/BookingDetails";
import TermsAndConditions from "./Pages/TermsAndConditions";
import BookingRequests from "./Pages/BookingRequests";
import MyRequest from "./Pages/MyRequests";
import HowItWorks from "./Pages/How it works/HowItWorks";
import Profile from "./Pages/Profile";
import MyListing from "./Pages/MyListing/MyListing";
import RentalRequests from "./Pages/Rental Requests/rentalRequest";
import MyRequests from "./Pages/My Request/myRequest";
import ActivBooking from "./Pages/My Bookings/ActiveBooking";
import SignupForm from "./Pages/Onboarding/SignUp";
import Login from "./Pages/Onboarding/Login";
import Verification from "./Pages/Onboarding/Verification";
import OTP from "./Pages/Onboarding/OTP";
import ChatApp from "./Pages/chat";
import AddCar from "./Pages/Add Car/AddCar";
import Step2 from "./Pages/Add Car/Step2";
import Step3 from "./Pages/Add Car/Step3";
import Step4 from "./Pages/Add Car/Step4";
import Details2 from "./Pages/Details/Details2";
import Step5 from "./Pages/Add Car/Step5";
import { useState } from "react";

AWS.config.region = "us-east-1";

function App() {
const [user,setUser]=useState(null)
 useEffect(()=>{
const user=localStorage.getItem("customer");
const user2=JSON.parse(user)
console.log("the user iss ",user2.userAttributes)
if (user2) {
  setUser(user2);
}
  
},[])

  return (
    <>
    {console.log("THe use r is ",user)}
      <Navbar user2={user}/>
      <Routes>
        <Route index path="/" element={<Home user={user}/>} />
        <Route path="addcar" element={<AddCar />} />
        <Route path="step2" element={<Step2 />} />
        <Route path="step3" element={<Step3 />} />
        <Route path="step4" element={<Step4 />} />
        <Route path="step5" element={<Step5 />} />

        <Route path="profile" element={<Profile />} />
        <Route path="booking" element={<ActivBooking />} />
        <Route path="chat" element={<ChatApp />} />
        <Route path="about" element={<About />} />
        <Route path="howitworks" element={<HowItWorks />} />
        <Route path="mylisting" element={<MyListing />} />
        <Route path="mylisting" element={<MyListing />} />
        <Route path="myrequest" element={<MyRequests />} />
        <Route path="rentalrequest" element={<RentalRequests />} />
        <Route path="testimonials" element={<TestimonialsPage />} />
        <Route path="team" element={<Team />} />
        <Route path="contact" element={<Contact />} />
        <Route path="/details" element={<Details />} />
        <Route path="/details2" element={<Details2 />} />
        <Route path="search" element={<Search />} />
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />
        <Route path="login" element={<Login />} />
        <Route path="verification" element={<Verification />} />
        <Route path="otp" element={<OTP />} />

        <Route path="signup" element={<SignupForm />} />
        <Route path="/confirmaccount/:email" element={<OTPInput />} />
        <Route path="/booking_details/:id" element={<BookingDetails />} />
        <Route path="/booking_requests" element={<BookingRequests />} />
        <Route path="/my_requests" element={<MyRequest />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
