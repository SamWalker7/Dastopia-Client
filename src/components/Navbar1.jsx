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

function Navbar1({ user2 }) {
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
                  className={` ${backgroundColor1} text-sm flex items-center justify-center rounded-full px-4 ml-4 my-2 py-1`}
                  to="/signup"
                >
                  {" "}
                  Register
                </NavLink>
                <NavLink
                  className={` text-sm flex items-center justify-center rounded-full px-4  my-2 py-1`}
                  to="/login"
                >
                  {" "}
                  Login
                </NavLink>
              </>
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
                {/* <NavLink
                  className="text-primary block w-full text-left px-4 py-0  border border-primary hover:bg-primary hover:text-white"
                  to="/signin"
                  onClick={openNav}
                >
                  Sign In/Signup
                </NavLink> */}
                <NavLink
                  className=" bg-primary block w-full text-left px-4 py-0  hover:bg-opacity-90"
                  to="/signup"
                  onClick={openNav}
                >
                  Register
                </NavLink>
                <NavLink
                  className=" bg-primary block w-full text-left px-4 py-0  hover:bg-opacity-90"
                  to="/login"
                  onClick={openNav}
                >
                  Login
                </NavLink>
              </>
            )}
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;
