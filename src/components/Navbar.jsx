import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "../images/logo/dasguzo_logo.png";
import { useState } from "react";
import Img2 from "../images/user/person.png";
import { signout } from "../api/auth";
import { FiPlus } from "react-icons/fi";
import { MdMenu } from "react-icons/md";
import { useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const [nav, setNav] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = async () => {
    await signout();
    localStorage.removeItem("user");
    localStorage.removeItem("accToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accExp");
    navigate("/");
    setNav(false);
  };

  const alternativePages = ["/contact", "/testimonials", "/howitworks"];
  const isAlternativeColor = alternativePages.includes(location.pathname);
  const backgroundColor = isAlternativeColor
    ? "bg-[#00173C] text-gray-300 font-normal"
    : "bg-white text-gray-600";
  const backgroundColor1 = !isAlternativeColor
    ? "bg-[#00173C] text-gray-300 font-normal"
    : "bg-white text-gray-900";

  const openNav = () => {
    setNav(!nav);
  };

  return (
    <>
      <nav className="fixed w-full z-20">
        <div className="mx-auto px-4 sm:px-6 lg:pl-32 lg:pr-20 flex w-full justify-between items-center h-32">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Link to="/" onClick={() => window.scrollTo(0, 0)}>
              <img src={Logo} alt="logo-img" className="h-16 w-auto" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div
            className={`${backgroundColor} p-4 hidden md:flex px-10 py-2 rounded-full space-x-4 items-center`}
          >
            {[
              { to: "/", label: "Home" },
              { to: "/testimonials", label: "Testimonials" },
              { to: "/about", label: "About Us" },
              { to: "/contact", label: "Contact Us" },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-xl font-medium hover:text-yellow-500 ${
                    isActive
                      ? "text-yellow-500 border-b-2 border-yellow-500"
                      : ""
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            {!user && (
              <>
                <NavLink
                  className="text-white bg-primary px-4 py-2 rounded-md hover:bg-opacity-90"
                  to="/signup"
                >
                  Register
                </NavLink>
                <button
                  className={` ${backgroundColor1} text-xl flex items-center justify-center rounded-full px-8 ml-8 my-2 py-4`}
                >
                  <FiPlus className="mr-4 font-normal" size={12} />
                  <span>Add Car</span>
                </button>
                <button onClick={openNav} className="focus:outline-none">
                  <MdMenu size={20} />
                </button>
              </>
            )}
            {user && (
              <button
                onClick={handleLogout}
                className="text-white bg-primary px-4 py-2 rounded-md hover:bg-opacity-90"
              >
                Sign out
              </button>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button onClick={openNav} className="focus:outline-none">
              {nav ? (
                <i className="fa-solid fa-xmark h-6 w-6 text-gray-900"></i>
              ) : (
                <i className="fa-solid fa-bars h-6 w-6 text-gray-900"></i>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {nav && (
          <div className="md:hidden bg-white shadow-md fixed inset-0 z-10 flex flex-col p-4 space-y-2">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About" },
              { to: "/models", label: "Vehicles" },
              { to: "/testimonials", label: "Testimonials" },
              { to: "/team", label: "Our Team" },
              { to: "/contact", label: "Contact" },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={openNav}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? "text-yellow-500 border-b-2 border-yellow-500"
                      : "text-gray-600 hover:text-gray-900"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            {!user && (
              <>
                <NavLink
                  className="text-primary block w-full text-left px-4 py-2 rounded-md border border-primary hover:bg-primary hover:text-white"
                  to="/signin"
                  onClick={openNav}
                >
                  Sign In/Signup
                </NavLink>
                <NavLink
                  className="text-white bg-primary block w-full text-left px-4 py-2 rounded-md hover:bg-opacity-90"
                  to="/signup"
                  onClick={openNav}
                >
                  Register
                </NavLink>
              </>
            )}
            {user && (
              <button
                onClick={() => {
                  handleLogout();
                  openNav();
                }}
                className="text-white bg-primary block w-full text-left px-4 py-2 rounded-md hover:bg-opacity-90"
              >
                Sign out
              </button>
            )}
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;
