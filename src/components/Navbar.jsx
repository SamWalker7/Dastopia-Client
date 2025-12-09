import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import Logo from "../images/logo/dasguzo_logo.png";
import Img2 from "../images/user/person.png"; // This import seems unused in the provided code
import Img3 from "../images/testimonials/avatar.png";
import { signout } from "../api/auth"; // This import seems unused in the provided code
import { getDownloadUrl } from "../api";

// Import MUI Icons
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress"; // For spinner
import AssignmentIcon from "@mui/icons-material/Assignment";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ListIcon from "@mui/icons-material/List";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import SettingsIcon from "@mui/icons-material/Settings";
import LanguageIcon from "@mui/icons-material/Language";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info"; // For About Us, and now How It Works
import FormatQuoteIcon from "@mui/icons-material/FormatQuote"; // For Testimonials
import GroupIcon from "@mui/icons-material/Group"; // For Our Team
import ContactMailIcon from "@mui/icons-material/ContactMail"; // For Contact
import { ShareIcon } from "lucide-react";

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
          <span>{isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}</span>
        )}
      </button>
      {hasDropdown && isOpen && <div className="pl-12">{children}</div>}
    </div>
  );
};

function Navbar({ user2, setUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const [profilePicKeyNavbar, setProfilePicKeyNavbar] = useState(null);
  const [profileImageUrlNavbar, setProfileImageUrlNavbar] = useState(Img3); // Default to Img3
  const [isImageLoadingNavbar, setIsImageLoadingNavbar] = useState(true);
  const [referralCode, setRefferalCode] = useState();

  useEffect(() => {
    const fetchProfile = async () => {
      setIsImageLoadingNavbar(true);
      try {
        const response = await fetch(
          "https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod/v1/account/get_profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${user2?.AccessToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data?.success && data?.data?.formattedProfile) {
            const formattedProfile = data.data.formattedProfile;
            setProfilePicKeyNavbar(formattedProfile.profilePicture);
            setRefferalCode(formattedProfile.referralCode);
          } else {
            console.error("Failed to fetch profile data for navbar:", data);
            setIsImageLoadingNavbar(false);
          }
        } else {
          console.error("Failed to fetch profile for navbar:", response.status);
          setIsImageLoadingNavbar(false);
        }
      } catch (error) {
        console.error("Error fetching profile for navbar:", error);
        setIsImageLoadingNavbar(false);
      }
    };

    if (user2?.AccessToken) {
      fetchProfile();
    } else {
      setIsImageLoadingNavbar(false); // If no token, no loading
    }
  }, [user2?.AccessToken]);

  useEffect(() => {
    const fetchProfileImage = async () => {
      setIsImageLoadingNavbar(true);
      try {
        if (profilePicKeyNavbar) {
          const response = await getDownloadUrl(profilePicKeyNavbar);
          setProfileImageUrlNavbar(response?.body || Img3);
        } else {
          setProfileImageUrlNavbar(Img3);
        }
      } catch (error) {
        console.error("Error fetching profile image for navbar:", error);
        setProfileImageUrlNavbar(Img3);
      } finally {
        setIsImageLoadingNavbar(false);
      }
    };

    fetchProfileImage();
  }, [profilePicKeyNavbar]);

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

  const handleLogout = () => {
    localStorage.removeItem("customer"); // Remove user data
    setUser(null); // Update state
    window.dispatchEvent(new Event("storage")); // Trigger update
    window.location.href = "/"; // Redirect to login page
  };

  const alternativePages = ["/contact", "/howitworks"];
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

  // Helper function to get the appropriate icon for mobile menu items
  const getMobileMenuItemIcon = (label) => {
    switch (label) {
      case "Home":
        return <HomeIcon className="text-md" />;
      case "How It Works": // Added How It Works
        return <InfoIcon className="text-md" />; // Reusing InfoIcon
      case "About":
        return <InfoIcon className="text-md" />;
      case "Explore Cars":
        return <FormatQuoteIcon className="text-md" />;
      case "Contact":
        return <ContactMailIcon className="text-md" />;
      default:
        return <HomeIcon className="text-md" />; // Default to home icon
    }
  };

  return (
    <>
      <nav className="fixed w-screen md:bg-transparent bg-white z-20">
        <div className="mx-auto px-8 sm:px-6 lg:px-12 flex w-full justify-between items-center h-20">
          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button onClick={openNav} className="focus:outline-none">
              {nav ? (
                <CloseIcon size={20} className=" text-gray-900" />
              ) : (
                <MenuIcon size={20} className=" text-gray-900" />
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
            {isImageLoadingNavbar ? (
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100">
                <CircularProgress size={20} className="text-gray-400" />
              </div>
            ) : (
              <img
                src={profileImageUrlNavbar}
                className="w-10 h-10 rounded-full object-cover text-white md:mb-4 md:mr-6"
                alt="Profile"
              />
            )}
          </div>

          {/* Desktop Menu */}
          <div
            className={`${backgroundColor} py-0 hidden md:flex px-6 rounded-full space-x-4 items-center`}
          >
            {[
              { to: "/", label: "Home" },
              { to: "/howitworks", label: "How It Works" }, // Added How It Works
              { to: "/search", label: "Explore Cars" },
              { to: "/about", label: "About Us" },
              { to: "/contact", label: "Contact Us" },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-0 py-0 text-gray-600 text-sm hover:text-yellow-500 ${
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
                  <AddIcon className="mr-4 " size={12} />
                  <span>List Your Car</span>
                </NavLink>
                <NavLink to="/profile" className=" ">
                  {isImageLoadingNavbar ? (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100">
                      <CircularProgress size={16} className="text-gray-400" />
                    </div>
                  ) : (
                    <img
                      src={profileImageUrlNavbar}
                      className="w-8 h-8 rounded-full object-cover text-white "
                      alt="Profile"
                    />
                  )}
                </NavLink>
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="py-4 text-md hover:bg-gray-100 rounded-lg"
                    aria-label="Menu"
                  >
                    <MenuIcon />
                  </button>

                  {isOpen && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 z-50">
                      <div className="py-0">
                        <MenuItem
                          icon={<AssignmentIcon className="text-md" />}
                          text="Rental Requests"
                          onClick={() => handleNavigate("/rentalrequest")}
                        />

                        <MenuItem
                          icon={<BookmarkIcon className="text-md" />}
                          text="Active Bookings"
                          onClick={() => handleNavigate("/booking")}
                        />
                        <MenuItem
                          icon={<DirectionsCarIcon className="text-md" />}
                          text="My Requests"
                          onClick={() => handleNavigate("/myrequest")}
                        />
                        <MenuItem
                          icon={<ListIcon className="text-md" />}
                          text="My Listings"
                          hasDropdown
                        >
                          <MenuItem
                            icon={<DirectionsCarIcon className="text-md" />}
                            text="My Vehicle"
                            onClick={() => handleNavigate("/mylisting")}
                          />
                        </MenuItem>

                        <MenuItem
                          icon={<SettingsIcon className="text-md" />}
                          text="General Settings"
                          hasDropdown
                        >
                          {/* <MenuItem
                            icon={<LanguageIcon className="text-md" />}
                            text="Language"
                            onClick={() => handleNavigate("/language")}
                          /> */}

                          <MenuItem
                            icon={<AccountCircleIcon className="text-md" />}
                            text="Personal Details"
                            onClick={() => handleNavigate("/profile")}
                          />

                          <MenuItem
                            icon={<CreditCardIcon className="text-md" />}
                            text="Payment History"
                            onClick={() => handleNavigate("/profile")}
                          />
                        </MenuItem>

                        <MenuItem
                          icon={<ChatBubbleIcon className="text-md" />}
                          text="Chats"
                          onClick={() => handleNavigate("/chat")}
                        />

                        <MenuItem
                          icon={<ShareIcon className="text-md" />}
                          text="Referral Code"
                          onClick={() => {
                            const referralLink = `${window.location.origin}/signup?refCode=${referralCode}`;

                            if (navigator.share) {
                              navigator.share({
                                title: "Referral Invite",
                                text: "Join using my referral link!",
                                url: referralLink,
                              })
                                .catch(err => console.error("Share failed:", err));
                            } else {
                              // fallback for unsupported browsers
                              navigator.clipboard.writeText(referralLink)
                                .then(() => alert("Referral link copied to clipboard!"))
                                .catch(err => console.error("Copy failed", err));
                            }
                          }}
                        />


                        <div className="px-4 pt-2 pb-4">
                          <button
                            onClick={handleLogout}
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
                className="text-white bg-primary px-4 py-0 hover:bg-opacity-90"
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
              { to: "/howitworks", label: "How It Works" }, // Added How It Works
              { to: "/about", label: "About" },
              { to: "/search", label: "Exploare Cars" },
              { to: "/contact", label: "Contact" },
            ].map(({ to, label }) => (
              <MenuItem
                key={to}
                icon={getMobileMenuItemIcon(label)} // Use the helper function here
                text={label}
                onClick={() => {
                  openNav();
                  handleNavigate(to);
                }}
              />
            ))}

            {!user && (
              <>
                {/* These NavLinks for Sign In/Signup/Register seem to be duplicated or intended for a different state based on '!user' */}
                {/* Leaving them commented out for now as the desktop menu handles the logged-in state differently */}
                {/* <NavLink
                  className="text-primary block w-full text-left px-4 py-0 border border-primary hover:bg-primary hover:text-white"
                  to="/signin"
                  onClick={openNav}
                >
                  Sign In/Signup
                </NavLink>
                <NavLink
                  className="text-white bg-primary block w-full text-left px-4 py-0 hover:bg-opacity-90"
                  to="/signup"
                  onClick={openNav}
                >
                  Register
                </NavLink> */}
              </>
            )}
            {/* This section with user-specific menu items should likely be within the `!user` block in the mobile menu too */}
            {!user && (
              <div className="">
                {" "}
                {/* This div seems unnecessary */}
                <button
                  onClick={() => {
                    handleLogout();
                    openNav();
                  }}
                  className="text-white bg-primary block w-full text-left px-4 py-0 hover:bg-opacity-90"
                >
                  Logout
                </button>
                <NavLink
                  to="/addcar"
                  className={`hover:bg-gray-50 hover:text-black bg-blue-950 text-white text-sm flex items-center rounded-full pl-4 pr-20 w-fit my-2 py-2`}
                  onClick={openNav} // Close menu on click
                >
                  <AddIcon className="mr-4 " size={12} />
                  <span>List Your Car</span>
                </NavLink>
                <MenuItem
                  icon={<AssignmentIcon className="text-md" />}
                  text="Rental Requests"
                  onClick={() => {
                    openNav();
                    handleNavigate("/rentalrequest");
                  }}
                />
                <MenuItem
                  icon={<BookmarkIcon className="text-md" />}
                  text="Active Bookings"
                  onClick={() => {
                    openNav();
                    handleNavigate("/booking");
                  }}
                />
                <MenuItem
                  icon={<DirectionsCarIcon className="text-md" />}
                  text="My Requests"
                  onClick={() => {
                    openNav();
                    handleNavigate("/myrequest");
                  }}
                />
                <MenuItem
                  icon={<ListIcon className="text-md" />}
                  text="My Listings"
                  hasDropdown
                >
                  <MenuItem
                    icon={<DirectionsCarIcon className="text-md" />}
                    text="My Vehicle"
                    onClick={() => {
                      openNav();
                      handleNavigate("/mylisting");
                    }}
                  />
                </MenuItem>
                <MenuItem
                  icon={<SettingsIcon className="text-md" />}
                  text="General Settings"
                  hasDropdown
                >
                  {/* <MenuItem
                    icon={<LanguageIcon className="text-md" />}
                    text="Language"
                    onClick={() => {
                      openNav();
                      handleNavigate("/language");
                    }}
                  /> */}

                  <MenuItem
                    icon={<AccountCircleIcon className="text-md" />}
                    text="Personal Details"
                    onClick={() => {
                      openNav();
                      handleNavigate("/profile");
                    }}
                  />

                  <MenuItem
                    icon={<CreditCardIcon className="text-md" />}
                    text="Payment History"
                    onClick={() => {
                      openNav();
                      handleNavigate("/profile");
                    }}
                  />
                </MenuItem>
                <MenuItem
                  icon={<ChatBubbleIcon className="text-md" />}
                  text="Chats"
                  onClick={() => {
                    openNav();
                    handleNavigate("/chat");
                  }}
                />
                <div className="px-4 pt-2 pb-4">
                  <button
                    onClick={handleLogout}
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
