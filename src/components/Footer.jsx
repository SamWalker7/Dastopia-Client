function Footer() {
  return (
    <>
      <footer>
        <div className="container">
          <div className="footer-content">
            <ul className="footer-content__1">
              <li>
                <span>DAS</span>Topia
              </li>
              <li>
                We offers a big range of vehicles for all your driving needs. We
                have the perfect car to meet your needs.
              </li>
              <li>
                <a href="tel:+251946888444">
                  <i className="fa-solid fa-phone"></i> &nbsp; (251) 946-888444
                </a>
              </li>

              <li>
                <a
                  href="mailto:contact@dastopia.org"
                >
                  <i className="fa-solid fa-envelope"></i>
                  &nbsp; contact@dastopia.org
                </a>
              </li>
              <li>
                <a
                  style={{ fontSize: "14px" }}
                  target="_blank"
                  rel="noreferrer"
                  href="https://dastopia.com/"
                >
                  Design with ❤️ Dastopia
                </a>
              </li>
            </ul>

            <ul className="footer-content__2">
              <li>Company</li>
              <li>
                <a href="/about">About</a>
              </li>
              <li>
                <a href="/contact">Contact Us</a>
              </li>
              <li>
                <a href="/models">Cars</a>
              </li>
              <li>
                <a href="/team">Our Team</a>
              </li>
              <li>
                <a href="/testimonials">Testimonals</a>
              </li>
            </ul>

            <ul className="footer-content__2">
              <li>Working Hours</li>
              <li>Mon - Fri: 8:00AM - 6:00PM</li>
              <li>Sat: 9:00AM - 4:00PM</li>
              <li>Sun: Closed</li>
            </ul>

         
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
