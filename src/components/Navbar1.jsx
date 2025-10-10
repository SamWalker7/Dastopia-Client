import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import Logo from "../images/logo/dasguzo_logo.png";
import DefaultAvatar from "../images/testimonials/avatar.png";
import { getDownloadUrl } from "../api";

// Import MUI Icons for a consistent look and feel
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ListIcon from "@mui/icons-material/List";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import ContactMailIcon from "@mui/icons-material/ContactMail";

// Reusable MenuItem component for dropdowns and mobile menu
const MenuItem = ({ icon, text, hasDropdown, children, path, onClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    if (hasDropdown) {
      setIsOpen(!isOpen);
    } else if (path) {
      navigate(path);
      if (onClick) onClick(); // Also call onClick to close the parent menu
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
        {hasDropdown && (isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
      </button>
      {hasDropdown && isOpen && (
        <div className="pl-8 bg-gray-50/50 rounded-b-lg">
          {React.Children.map(children, (child) =>
            React.cloneElement(child, { onClick })
          )}
        </div>
      )}
    </div>
  );
};

// Centralized configurations for menu items to ensure consistency
const mainNavLinks = [
  { text: "Home", path: "/", icon: <HomeIcon /> },
  { text: "Explore Cars", path: "/search", icon: <DirectionsCarIcon /> },
  { text: "About Us", path: "/about", icon: <InfoIcon /> },
  { text: "Contact Us", path: "/contact", icon: <ContactMailIcon /> },
];

const userMenuItems = [
  { text: "Rental Requests", icon: <AssignmentIcon />, path: "/rentalrequest" },
  { text: "Active Bookings", icon: <BookmarkIcon />, path: "/booking" },
  { text: "My Requests", icon: <DirectionsCarIcon />, path: "/myrequest" },
  {
    text: "My Listings",
    icon: <ListIcon />,
    hasDropdown: true,
    children: [
      { text: "My Vehicle", icon: <DirectionsCarIcon />, path: "/mylisting" },
    ],
  },
  {
    text: "General Settings",
    icon: <SettingsIcon />,
    hasDropdown: true,
    children: [
      {
        text: "Personal Details",
        icon: <AccountCircleIcon />,
        path: "/profile",
      },
      {
        text: "Payment History",
        icon: <CreditCardIcon />,
        path: "/payment-history",
      },
    ],
  },
  { text: "Chats", icon: <ChatBubbleIcon />, path: "/chat" },
];

function Navbar1({ user2, setUser }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const menuRef = useRef(null);
  const [profileImageUrl, setProfileImageUrl] = useState(DefaultAvatar);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Effect to fetch the user's profile picture
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user2?.AccessToken) {
        setIsImageLoading(false);
        setProfileImageUrl(DefaultAvatar);
        return;
      }
      setIsImageLoading(true);
      try {
        const response = await fetch(
          "https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/account/get_profile",
          {
            headers: { Authorization: `Bearer ${user2.AccessToken}` },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch profile");

        const data = await response.json();
        const profileKey = data?.data?.formattedProfile?.profilePicture;

        if (profileKey) {
          const urlResponse = await getDownloadUrl(profileKey);
          setProfileImageUrl(urlResponse?.body || DefaultAvatar);
        } else {
          setProfileImageUrl(DefaultAvatar);
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
        setProfileImageUrl(DefaultAvatar);
      } finally {
        setIsImageLoading(false);
      }
    };
    fetchProfileData();
  }, [user2]);

  // Effect to close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("customer");
    if (setUser) setUser(null);
    closeAllMenus();
    navigate("/");
  };

  const closeAllMenus = () => {
    setMenuOpen(false);
    setNavOpen(false);
  };

  const isAlternativeColor = ["/contact", "/howitworks"].includes(
    location.pathname
  );
  const desktopNavBg = isAlternativeColor
    ? "bg-[#00173C] text-gray-300"
    : "bg-white text-gray-600";
  const authButtonBg = isAlternativeColor
    ? "bg-white text-gray-900"
    : "bg-[#00173C] text-gray-300";

  return (
    <>
      <nav className="fixed w-full md:bg-transparent bg-white z-30">
        <div className="mx-auto px-4 sm:px-6 lg:px-12 flex justify-between items-center h-20">
          <div className="md:hidden">
            <button
              onClick={() => setNavOpen(!navOpen)}
              className="focus:outline-none "
            >
              {navOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>

          <Link to="/" onClick={() => window.scrollTo(0, 0)}>
            <img src={Logo} alt="logo-img" className="h-10 w-auto" />
          </Link>

          {user2 && (
            <div
              className="md:hidden cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              {isImageLoading ? (
                <CircularProgress size={24} />
              ) : (
                <img
                  src={profileImageUrl}
                  className="w-10 h-10 rounded-full object-cover"
                  alt="Profile"
                />
              )}
            </div>
          )}

          <div
            className={`${desktopNavBg} hidden md:flex items-center py-2 px-6 rounded-full space-x-6 text-sm`}
          >
            {mainNavLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  isActive ? "text-yellow-500" : "hover:text-yellow-500"
                }
              >
                {link.text}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user2 ? (
              <>
                <NavLink
                  to="/addcar"
                  className={`${authButtonBg} text-sm flex items-center rounded-full px-4 py-2`}
                >
                  <AddIcon className="mr-2" style={{ fontSize: "1rem" }} /> List
                  Your Car
                </NavLink>
                <div
                  onClick={() => navigate("/profile")}
                  className="cursor-pointer"
                >
                  {isImageLoading ? (
                    <CircularProgress size={24} />
                  ) : (
                    <img
                      src={profileImageUrl}
                      className="w-10 h-10 rounded-full object-cover"
                      alt="Profile"
                    />
                  )}
                </div>
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Menu"
                  >
                    <MenuIcon />
                  </button>
                  {menuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border z-50">
                      {userMenuItems.map((item, index) => (
                        <MenuItem key={index} {...item} onClick={closeAllMenus}>
                          {item.children?.map((child, childIndex) => (
                            <MenuItem
                              key={childIndex}
                              {...child}
                              onClick={closeAllMenus}
                            />
                          ))}
                        </MenuItem>
                      ))}
                      <div className="p-4">
                        <button
                          onClick={handleLogout}
                          className="w-full p-3 text-sm text-center border rounded-full hover:bg-gray-50"
                        >
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <NavLink to="/login" className="px-4 py-2 text-sm">
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className={`${authButtonBg} text-sm rounded-full px-5 py-2`}
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {navOpen && (
        <div className="md:hidden bg-white shadow-lg fixed w-full inset-0 z-20 flex flex-col pt-20 px-4 space-y-1 overflow-y-auto">
          {mainNavLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={closeAllMenus}
              className="p-4 flex items-center gap-4 text-gray-600 hover:bg-gray-50"
            >
              {link.icon} {link.text}
            </NavLink>
          ))}
          <hr className="my-2" />

          {user2 ? (
            <>
              {userMenuItems.map((item, index) => (
                <MenuItem key={index} {...item} onClick={closeAllMenus}>
                  {item.children?.map((child, childIndex) => (
                    <MenuItem
                      key={childIndex}
                      {...child}
                      onClick={closeAllMenus}
                    />
                  ))}
                </MenuItem>
              ))}
              <div className="p-4">
                <button
                  onClick={handleLogout}
                  className="w-full p-3 text-sm text-center border rounded-full hover:bg-gray-50"
                >
                  Log Out
                </button>
              </div>
            </>
          ) : (
            <div className="p-4 space-y-4">
              <NavLink
                to="/login"
                onClick={closeAllMenus}
                className="w-full block text-center p-3 text-sm border rounded-full hover:bg-gray-50"
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                onClick={closeAllMenus}
                className="w-full block text-center p-3 text-sm bg-[#00173C] text-white rounded-full"
              >
                Register
              </NavLink>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Navbar1;
