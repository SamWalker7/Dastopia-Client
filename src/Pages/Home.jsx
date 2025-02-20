import Hero from "../components/Hero";
import BookCar from "../components/BookCar";
import PlanTrip from "../components/PlanTrip";
import PickCar from "../components/PickCar";
import Banner from "../components/Banner";
import ChooseUs from "../components/ChooseUs";
import Testimonials from "../components/Testimonials";
import Faq from "../components/Faq";
import Download from "../components/Download";
import Footer from "../components/Footer";
import { useEffect } from "react";
import { useSelector } from "react-redux";

function Home({ user }) {
  const user1 = useSelector((state) => state.auth.user);

  useEffect(() => {
    console.log("User from Redux:", user1); // Check if Redux has the user
  }, [user1]);
  return (
    <>
      <Hero user={user} />
      {/* <BookCar /> */}
      <PlanTrip />
      <Testimonials />
      <Faq />
      <Footer />
    </>
  );
}

export default Home;
