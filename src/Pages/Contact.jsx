import Footer from "../components/Footer";
import HeroPages from "../components/HeroPages";

function Contact() {
  return (
    <>
      <section className="contact-page" style={{ paddingTop: "100px" }}>
        <div className="container">
          <div className="contact-div">
            <div className="contact-div__text">
              <h2>Need additional information?</h2>
              <p>
                Need assistance? We're here to help. Contact us for any
                questions about our vehicles, rental policies, or booking
                process. Our team is dedicated to ensuring a smooth and
                enjoyable rental experience. Reach out today!
              </p>
              <a href="/">
                <i className="fa-solid fa-phone"></i>&nbsp; +251946888444
              </a>
              <a href="/">
                <i className="fa-solid fa-envelope"></i>&nbsp; carrental@xyz.com
              </a>
              <a href="/">
                <i className="fa-solid fa-location-dot"></i>&nbsp; Bengaluru,
                Karnatka
              </a>
            </div>
            <div className="contact-div__form">
              <form>
                <label>
                  First Name <b>*</b>
                </label>
                <input type="text" placeholder='E.g: "John"'></input>

                <label>
                  Last Name <b>*</b>
                </label>
                <input type="text" placeholder='E.g: "Doe"'></input>

                <label>
                  Phone Number <b>*</b>
                </label>
                <input type="number" placeholder='E.g: "+123456789"'></input>

                <label>Company Name (Optional)</label>
                <input
                  type="text"
                  placeholder='E.g: "Das Technologies"'
                ></input>

                <label>Job Role (Optional)</label>
                <input type="text" placeholder='E.g: "CEO"'></input>

                <label>
                  Email <b>*</b>
                </label>
                <input type="email" placeholder="youremail@example.com"></input>

                <label>
                  Tell us about it <b>*</b>
                </label>
                <textarea placeholder="Write Here.."></textarea>

                <button type="submit">
                  <i className="fa-solid fa-envelope-open-text"></i>&nbsp; Send
                  Message
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="book-banner">
          <div className="book-banner__overlay"></div>
          <div className="container">
            <div className="text-content">
              <h2>Book a car by getting in touch with us</h2>
              <span>
                <i className="fa-solid fa-phone"></i>
                <h3>+251946888444</h3>
              </span>
            </div>
          </div>
        </div>
        <Footer />
      </section>
    </>
  );
}

export default Contact;
