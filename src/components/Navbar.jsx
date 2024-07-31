import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "../images/logo/logo192.png";
import { useState } from "react";
import Img2 from "../images/user/person.png";
import { signout } from "../api/auth";

function Navbar() {
  const [nav, setNav] = useState(false);
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = async () => {
    await signout();
    localStorage.removeItem("user");
    localStorage.removeItem("accToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("accExp")
    navigate("/")
    openNav();
  }

  const openNav = () => {
    setNav(!nav);
  };

  return (
    <>
      <nav>
        {/* mobile */}
        <div
          className={`mobile-navbar ${nav ? "open-nav" : ""}`}
          style={{ display: "block !important" }}
        >
          <div onClick={openNav} className="mobile-navbar__close">
            <i className="fa-solid fa-xmark"></i>
          </div>
          <ul className="mobile-navbar__links">
            <li>
              <NavLink onClick={openNav} to="/">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink onClick={openNav} to="/about">
                About
              </NavLink>
            </li>
            <li>
              <NavLink onClick={openNav} to="/models">
                Vehicles
              </NavLink>
            </li>
            <li>
              <NavLink onClick={openNav} to="/testimonials">
                Testimonials
              </NavLink>
            </li>
            <li>
              <NavLink onClick={openNav} to="/team">
                Our Team
              </NavLink>
            </li>
            <li>
              <NavLink onClick={openNav} to="/contact">
                Contact
              </NavLink>
            </li>

            {!user && (
              <li>
                <NavLink onClick={openNav} className="navbar__buttons__sign-in" to="/signin">
                  Sign In
                </NavLink>
              </li>
            )}
            {!user && (
              <li>
                <NavLink onClick={openNav}  className="navbar__buttons__register" to="/signup">
                  Register
                </NavLink>
              </li>
            )}

            {user && (
              <li onClick={handleLogout}>
                <div className="navbar__buttons__sign-in">Sign out</div>
              </li>
            )}
          </ul>
        </div>

        {/* desktop */}

        <div className="navbar">
          <div className="navbar__img">
            <Link to="/" onClick={() => window.scrollTo(0, 0)}>
              <img src={Logo} alt="logo-img" />
            </Link>
          </div>
          {/* <ul className="navbar__links">
            <li>
              <Link className="home-link" to="/">
                Home
              </Link>
            </li>
            <li>
              {" "}
              <Link className="about-link" to="/about">
                About
              </Link>
            </li>
            <li>
              {" "}
              <Link className="models-link" to="/models">
                Vehicles
              </Link>
            </li>
            <li>
              {" "}
              <Link className="testi-link" to="/testimonials">
                Testimonials
              </Link>
            </li>
            <li>
              {" "}
              <Link className="team-link" to="/team">
                Our Team
              </Link>
            </li>
            <li>
              {" "}
              <Link className="contact-link" to="/contact">
                Contact
              </Link>
            </li>
          </ul> */}
          {/* <div className="navbar__buttons">
            <Link className="navbar__buttons__sign-in" to="/signin">
              Sign In
            </Link>
            <Link className="navbar__buttons__register" to="/signup">
              Register
            </Link>
          </div> */}

          {/* mobile */}
          {!user ? (
            <div className="mobile-hamb" onClick={openNav}>
              <i className="fa-solid fa-bars"></i>
            </div>
          ) : (
            <div className="all-testimonials__box__name" onClick={openNav}>
              <div className="all-testimonials__box__name__profile">
                <img
                  src={Img2}
                  alt="user_img"
                />
                <span>
                  <h4>
                    {user.given_name} {user.family_name}
                  </h4>
                </span>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
