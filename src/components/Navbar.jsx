import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "../images/logo/dasguzo_logo.png";
import Img2 from "../images/user/person.png";
import { signout } from "../api/auth";
import { FiPlus } from "react-icons/fi";
import { MdMenu } from "react-icons/md";
import { useLocation } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import {
  FaBars,
  FaCarSide,
  FaListUl,
  FaCog,
  FaLanguage,
  FaUser,
  FaCreditCard,
  FaComments,
  FaChevronDown,
  FaChevronUp,
  FaClipboardList,
  FaBookmark,
  FaCheckSquare,
} from "react-icons/fa";

const MenuItem = ({ icon, text, hasDropdown, children, onClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (hasDropdown) {
      setIsOpen(!isOpen);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handleClick}
        className="w-full flex items-center justify-between p-4 text-xl hover:bg-gray-50 text-gray-600"
      >
        <div className="flex items-center gap-4">
          {icon}
          <span>{text}</span>
        </div>
        {hasDropdown && (
          <span>{isOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
        )}
      </button>
      {hasDropdown && isOpen && <div className="pl-12">{children}</div>}
    </div>
  );
};

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigate = (path) => {
    console.log(`Navigating to: ${path}`);
    navigate(path); // Navigate to the specified path
    setIsOpen(false); // Close the modal or menu if open
  };
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
      <nav className="fixed w-full mt-6 z-20">
        <div className="mx-auto px-4 sm:px-6 lg:pl-32 lg:pr-20 flex w-full justify-between items-center h-32">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Link to="/" onClick={() => window.scrollTo(0, 0)}>
              <img src={Logo} alt="logo-img" className="h-16 w-auto" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div
            className={`${backgroundColor} p-4 hidden md:flex px-10 py-1 rounded-full space-x-8 items-center`}
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
                  `px-0 py-0 text-gray-600 text-xl  hover:text-yellow-500 ${
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
                  className="text-white bg-primary px-4 py-0  hover:bg-opacity-90"
                  to="/signup"
                >
                  Register
                </NavLink>
                <NavLink
                  to="/addcar"
                  className={` ${backgroundColor1} text-lg flex items-center justify-center rounded-full px-6 ml-8 my-2 py-2`}
                >
                  <FiPlus className="mr-4 " size={12} />
                  <span>Add Car</span>
                </NavLink>
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-4 text-2xl hover:bg-gray-100 rounded-lg"
                    aria-label="Menu"
                  >
                    <FaBars />
                  </button>

                  {isOpen && (
                    <div className="absolute top-full right-0 mt-2 w-96 bg-white p-8 rounded-2xl shadow-xl border border-gray-100 z-50">
                      <div className="py-2">
                        <MenuItem
                          icon={<FaClipboardList className="text-2xl" />}
                          text="Rental Requests"
                          onClick={() => handleNavigate("/rentalrequest")}
                        />

                        <MenuItem
                          icon={<FaBookmark className="text-2xl" />}
                          text="Active Bookings"
                          onClick={() => handleNavigate("/booking")}
                        />

                        <MenuItem
                          icon={<FaListUl className="text-2xl" />}
                          text="My Listings"
                          hasDropdown
                        >
                          <MenuItem
                            icon={<FaCheckSquare className="text-2xl" />}
                            text="Approvals"
                            onClick={() => handleNavigate("/approvals")}
                          />

                          <MenuItem
                            icon={<FaCarSide className="text-2xl" />}
                            text="My Vehicle"
                            onClick={() => handleNavigate("/mylisting")}
                          />
                        </MenuItem>

                        <MenuItem
                          icon={<FaCog className="text-2xl" />}
                          text="General Settings"
                          hasDropdown
                        >
                          <MenuItem
                            icon={<FaLanguage className="text-2xl" />}
                            text="Language"
                            onClick={() => handleNavigate("/language")}
                          />

                          <MenuItem
                            icon={<FaUser className="text-2xl" />}
                            text="Personal Details"
                            onClick={() => handleNavigate("/profile")}
                          />

                          <MenuItem
                            icon={<FaCreditCard className="text-2xl" />}
                            text="Payment History"
                            onClick={() => handleNavigate("/payments")}
                          />
                        </MenuItem>

                        <MenuItem
                          icon={<FaComments className="text-2xl" />}
                          text="Chats"
                          onClick={() => handleNavigate("/chat")}
                        />

                        <div className="px-4 pt-2 pb-4">
                          <button
                            onClick={handleLogout} // Changed to use handleLogout instead
                            className="w-full p-4 text-xl text-center border border-gray-300 rounded-full hover:bg-gray-50"
                          >
                            Log Out
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
            {user && (
              <button
                onClick={handleLogout}
                className="text-white bg-primary px-4 py-0  hover:bg-opacity-90"
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
          <div className="md:hidden bg-white shadow-md fixed inset-0 z-10 flex flex-col px-4 space-y-2">
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
                  `block px-3 py-0  text-base font-medium ${
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
                  className="text-primary block w-full text-left px-4 py-0  border border-primary hover:bg-primary hover:text-white"
                  to="/signin"
                  onClick={openNav}
                >
                  Sign In/Signup
                </NavLink>
                <NavLink
                  className="text-white bg-primary block w-full text-left px-4 py-0  hover:bg-opacity-90"
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
                className="text-white bg-primary block w-full text-left px-4 py-0  hover:bg-opacity-90"
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
