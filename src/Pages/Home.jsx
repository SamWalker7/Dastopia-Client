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

function Home({user}) {
  return (
    <>
      <Hero user={user}/>
      {/* <BookCar /> */}
      <PlanTrip />
      <Testimonials />
      <Faq />
      <Footer />
      <h1>dftyguhijo</h1>
    </>
  );
}

export default Home;
