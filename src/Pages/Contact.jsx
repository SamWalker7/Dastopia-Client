import Footer from "../components/Footer";
import { useState } from "react";

function Contact() {
  const [error, setError] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();

    const firstName = event.target.elements.firstName.value;
    const lastName = event.target.elements.lastName.value;
    const phoneNumber = event.target.elements.phoneNumber.value;
    const companyName = event.target.elements.companyName.value;
    const jobRole = event.target.elements.jobRole.value;
    const email = event.target.elements.email.value;
    const message = event.target.elements.message.value;

    const subject = `Inquiry from ${firstName} ${lastName}`;
    const body = `Name: ${firstName} ${lastName}%0D%0A
                  Phone Number: ${phoneNumber}%0D%0A
                  Company Name: ${companyName}%0D%0A
                  Job Role: ${jobRole}%0D%0A
                  Email: ${email}%0D%0A
                  Message: ${message}`;

    const emailLink = `mailto:contact@dastopia.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    if (
      firstName === "" ||
      lastName === "" ||
      phoneNumber === "" ||
      email === "" ||
      message === ""
    ) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 5000);
    } else {
      window.location.href = emailLink;
    }
  };

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
              <a href={`tel:+251966748642`}>
                <i className="fa-solid fa-phone"></i>&nbsp; (251) 946-888444
              </a>
              <a href="mailto:contact@dastopia.com">
                <i className="fa-solid fa-envelope"></i>&nbsp; contact@dastopia.com
              </a>
              <p>
                <i className="fa-solid fa-location-dot"></i>&nbsp; Ethiopia,
                Addis Ababa, Bole Dani Plaza
              </p>
            </div>
            <div className="contact-div__form">
              {error && (
                <p
                  style={{
                    color: "red",
                    textAlign: "center",
                    marginBottom: "1rem",
                    fontSize: "2rem",
                  }}
                >
                  All fields marked with <b>*</b> are required!
                </p>
              )}
              <form onSubmit={handleSubmit}>
                <label>
                  First Name <b>*</b>
                </label>
                <input type="text" name="firstName" placeholder='E.g: "John"' />

                <label>
                  Last Name <b>*</b>
                </label>
                <input type="text" name="lastName" placeholder='E.g: "Doe"' />

                <label>
                  Phone Number <b>*</b>
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder='E.g: "+123456789"'
                />

                <label>Company Name (Optional)</label>
                <input
                  type="text"
                  name="companyName"
                  placeholder='E.g: "Das Technologies"'
                />

                <label>Job Role (Optional)</label>
                <input type="text" name="jobRole" placeholder='E.g: "CEO"' />

                <label>
                  Email <b>*</b>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="youremail@example.com"
                />

                <label>
                  Tell us about it <b>*</b>
                </label>
                <textarea name="message" placeholder="Write Here.."></textarea>

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
                <h3>(251) 946-888444</h3>
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
