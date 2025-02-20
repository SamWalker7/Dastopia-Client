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
  FaWindowClose,
  FaHome,
} from "react-icons/fa";
import Img3 from "../images/testimonials/avatar.png";

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
        className="w-full flex items-center justify-between p-4 text-sm hover:bg-gray-50 text-gray-600"
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

function Navbar({ user2, setUser }) {
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
    localStorage.removeItem("customer"); // Remove user data
    setUser(null); // Update state
    window.dispatchEvent(new Event("storage")); // Trigger update
    window.location.href = "/"; // Redirect to login page
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

  const gotoProfile = () => {
    navigate("/profile", { state: { user2 } });
  };
  return (
    <>
      <nav className="fixed w-screen md:bg-transparent bg-white  z-20">
        <div className="mx-auto px-8 sm:px-6 lg:px-12  flex   w-full justify-between items-center h-20">
          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button onClick={openNav} className="focus:outline-none">
              {nav ? (
                <FaWindowClose size={20} className=" text-gray-900" />
              ) : (
                <FaBars size={20} className=" text-gray-900" />
              )}
            </button>
          </div>

          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Link to="/" onClick={() => window.scrollTo(0, 0)}>
              <img src={Logo} alt="logo-img" className="h-10 w-auto" />
            </Link>
          </div>
          <div onClick={gotoProfile} className="md:hidden ">
            <img
              src={Img3}
              className="w-10 h-10 rounded-full text-white md:mb-4 md:mr-6"
            />
          </div>

          {/* Desktop Menu */}
          <div
            className={`${backgroundColor} py-0 hidden md:flex px-6  rounded-full space-x-4 items-center`}
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
                  `px-0 py-0 text-gray-600 text-sm  hover:text-yellow-500 ${
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
                  to="/addcar"
                  className={` ${backgroundColor1} text-sm flex items-center justify-center rounded-full px-4 ml-4 my-2 py-1`}
                >
                  <FiPlus className="mr-4 " size={12} />
                  <span>Add Car</span>
                </NavLink>
                <NavLink to="/profile" className=" ">
                  <img
                    src={Img3}
                    className="w-8 h-8 rounded-full  text-white "
                  />
                </NavLink>
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="py-4 text-md hover:bg-gray-100 rounded-lg"
                    aria-label="Menu"
                  >
                    <FaBars />
                  </button>

                  {isOpen && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 z-50">
                      <div className="py-0">
                        <MenuItem
                          icon={<FaClipboardList className="text-md" />}
                          text="Rental Requests"
                          onClick={() => handleNavigate("/rentalrequest")}
                        />

                        <MenuItem
                          icon={<FaBookmark className="text-md" />}
                          text="Active Bookings"
                          onClick={() => handleNavigate("/booking")}
                        />

                        <MenuItem
                          icon={<FaListUl className="text-md" />}
                          text="My Listings"
                          hasDropdown
                        >
                          <MenuItem
                            icon={<FaCheckSquare className="text-md" />}
                            text="Approvals"
                            onClick={() => handleNavigate("/approvals")}
                          />

                          <MenuItem
                            icon={<FaCarSide className="text-md" />}
                            text="My Vehicle"
                            onClick={() => handleNavigate("/mylisting")}
                          />
                        </MenuItem>

                        <MenuItem
                          icon={<FaCog className="text-md" />}
                          text="General Settings"
                          hasDropdown
                        >
                          <MenuItem
                            icon={<FaLanguage className="text-md" />}
                            text="Language"
                            onClick={() => handleNavigate("/language")}
                          />

                          <MenuItem
                            icon={<FaUser className="text-md" />}
                            text="Personal Details"
                            onClick={() => handleNavigate("/profile")}
                          />

                          <MenuItem
                            icon={<FaCreditCard className="text-md" />}
                            text="Payment History"
                            onClick={() => handleNavigate("/payments")}
                          />
                        </MenuItem>

                        <MenuItem
                          icon={<FaComments className="text-md" />}
                          text="Chats"
                          onClick={() => handleNavigate("/chat")}
                        />

                        <div className="px-4 pt-2 pb-4">
                          <button
                            onClick={handleLogout} // Changed to use handleLogout instead
                            className="w-full p-4 text-sm text-center border border-gray-300 rounded-full hover:bg-gray-50"
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
        </div>

        {/* Mobile Menu */}
        {nav && (
          <div className="md:hidden bg-white shadow-md fixed w-[100vw] inset-0 z-10 flex flex-col px-4 space-y-2">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About" },
              { to: "/models", label: "Vehicles" },
              { to: "/testimonials", label: "Testimonials" },
              { to: "/team", label: "Our Team" },
              { to: "/contact", label: "Contact" },
            ].map(({ to, label }) => (
              <MenuItem
                icon={<FaHome className="text-md" />}
                text={label}
                onClick={() => {
                  openNav();
                  handleNavigate(to);
                }}
              />
              // <NavLink
              //   key={to}
              //   to={to}
              //   onClick={openNav}

              //   className={({ isActive }) =>
              //     `block px-3 py-0  text-sm font-medium ${
              //       isActive
              //         ? "text-yellow-500 border-b-2 border-yellow-500"
              //         : "text-gray-600 hover:text-gray-900"
              //     }`
              //   }
              // >
              //   {label}
              // </NavLink>
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
            {!user && (
              <div className="">
                {" "}
                <button
                  onClick={() => {
                    handleLogout();
                    openNav();
                  }}
                  className="text-white bg-primary block w-full text-left px-4 py-0  hover:bg-opacity-90"
                >
                  Logout
                </button>
                <NavLink
                  to="/addcar"
                  className={`hover:bg-gray-50 text-sm flex items-center  rounded-full px-3 ml-4 my-2 py-0`}
                >
                  <FiPlus className="mr-4 " size={12} />
                  <span>Add Car</span>
                </NavLink>
                <MenuItem
                  icon={<FaClipboardList className="text-md" />}
                  text="Rental Requests"
                  onClick={() => {
                    openNav();
                    handleNavigate("/rentalrequest");
                  }}
                />
                <MenuItem
                  icon={<FaBookmark className="text-md" />}
                  text="Active Bookings"
                  onClick={() => {
                    openNav();
                    handleNavigate("/booking");
                  }}
                />
                <MenuItem
                  icon={<FaListUl className="text-md" />}
                  text="My Listings"
                  hasDropdown
                >
                  <MenuItem
                    icon={<FaCheckSquare className="text-md" />}
                    text="Approvals"
                    onClick={() => {
                      openNav();
                      handleNavigate("/approvals");
                    }}
                  />

                  <MenuItem
                    icon={<FaCarSide className="text-md" />}
                    text="My Vehicle"
                    onClick={() => {
                      openNav();
                      handleNavigate("/mylisting");
                    }}
                  />
                </MenuItem>
                <MenuItem
                  icon={<FaCog className="text-md" />}
                  text="General Settings"
                  hasDropdown
                >
                  <MenuItem
                    icon={<FaLanguage className="text-md" />}
                    text="Language"
                    onClick={() => {
                      openNav();
                      handleNavigate("/language");
                    }}
                  />

                  <MenuItem
                    icon={<FaUser className="text-md" />}
                    text="Personal Details"
                    onClick={() => {
                      openNav();
                      handleNavigate("/profile");
                    }}
                  />

                  <MenuItem
                    icon={<FaCreditCard className="text-md" />}
                    text="Payment History"
                    onClick={() => {
                      openNav();
                      handleNavigate("/payments");
                    }}
                  />
                </MenuItem>
                <MenuItem
                  icon={<FaComments className="text-md" />}
                  text="Chats"
                  onClick={() => {
                    openNav();
                    handleNavigate("/chat");
                  }}
                />
                <div className="px-4 pt-2 pb-4">
                  <button
                    onClick={handleLogout} // Changed to use handleLogout instead
                    className="w-full p-4 py-2 text-sm text-center border border-gray-300 rounded-full hover:bg-gray-50"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;
