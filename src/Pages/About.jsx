import Footer from "../components/Footer";
import HeroPages from "../components/HeroPages";
import PlanTrip from "../components/PlanTrip";
import AboutMain from "../images/about/about-main.webp";
import Box1 from "../images/about/icon1.png";
import Box3 from "../images/about/icon2.png";
import Box2 from "../images/about/icon3.png";

function About() {
  return (
    <>
      <section className="about-page" style={{paddingTop: "100px"}}>
       
        <div className="container">
          <div className="about-main">
            <img
              className="about-main__img"
              src={AboutMain}
              alt="car-renting"
            />
            <div className="about-main__text">
              <h3>About Company</h3>
              <h2>Explore the World with Our P2P Car Rental Service</h2>
              <p>
                Discover the freedom of traveling on your terms. Our
                peer-to-peer car rental platform connects you with a variety of
                vehicles wherever your journey takes you.
              </p>

              <div className="about-main__text__icons">
                <div
                  className="about-main__text__icons__box"
                  style={{ marginTop: "10px" }}
                >
                  <img src={Box1} alt="car-icon" />
                  <span>
                    <p>Car Type Varieties</p>
                  </span>
                </div>
                <div
                  className="about-main__text__icons__box"
                  style={{
                    textAlign: "center",
                  }}
                >
                  <img
                    src={Box2}
                    alt="car-icon"
                    style={{
                      width: "50px",
                      margin: "0 auto",
                    }}
                  />
                  <span>
                    <p>24/7 Customer Support</p>
                  </span>
                </div>
                <div
                  className="about-main__text__icons__box"
                  style={{
                    textAlign: "center",
                  }}
                >
                  <img
                    src={Box3}
                    alt="car-icon"
                    className="last-fk"
                    style={{
                      width: "60px",
                      margin: "0 auto",
                    }}
                  />
                  <span>
                    <p>Full Insurance Coverage</p>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <PlanTrip />
        </div>
      </section>
      <div className="book-banner">
        <div className="book-banner__overlay"></div>
        <div className="container">
          <div className="text-content">
            <h2>Book a car by getting in touch with us</h2>
            <span>
              <i className="fa-solid fa-phone"></i>
              <h3>(251) 946-888444</h3>
            </span>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default About;
