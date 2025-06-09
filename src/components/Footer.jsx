import React from "react";
import { Link } from "react-router-dom"; // Assuming react-router-dom is used for navigation
import Logo from "../images/logo/dasguzo_logo.png"; // Path from the provided code

// Social Icons - Using inline SVGs or placeholder elements
// Twitter Icon SVG
const TwitterIcon = () => (
  <svg
    className="w-5 h-5"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
  </svg>
);
// Placeholder for the first social icon (circle)
const PlaceholderIcon1 = () => (
  <div className="w-5 h-5 bg-gray-500 rounded-full"></div>
);
// Placeholder for the third social icon (rounded square)
const PlaceholderIcon2 = () => (
  <div className="w-5 h-5 bg-gray-500 rounded"></div>
);

// Dropdown Arrow Icon SVG
const DropdownArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 ml-1"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const Footer = () => {
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "How It Works", path: "/howitworks" }, // Common link, path can be adjusted
    { name: "About Us", path: "/about" },
    { name: "Browse Cars", path: "/search" }, // Custom path
    // { name: "Become a Host", path: "/become-host" }, // Custom path
  ];

  const customerSupportLinks = [
    { name: "Help center", path: "/contact" }, // Custom path
    // { name: "FAQs", path: "/faqs" }, // Custom path
    // { name: "Privacy & Terms", path: "/privacy-terms" }, // Custom path, or split into /privacy and /terms
    // { name: "Safety information", path: "/safety-info" }, // Custom path
  ];

  // Standard Google Play badge URL. Replace YOUR_APP_ID with your actual app ID.
  const googlePlayBadgeUrl =
    "https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png";
  const googlePlayLink =
    "https://play.google.com/store/apps/details?id=YOUR_APP_ID_HERE";

  return (
    <footer className="bg-[#00173C] text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section: Logo, Links, Google Play */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Logo */}
          <div className=" justify-center items-center flex flex-col">
            <Link to="/" onClick={() => window.scrollTo(0, 0)}>
              <img src={Logo} alt="DasGuzo Logo" className="h-50 w-auto " />
            </Link>
            {/* Optional: Short description under logo if desired in future
            <p className="text-gray-400 text-sm">
              Your tagline here.
            </p> */}
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-yellow-500 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Support</h3>
            <ul className="space-y-2">
              {customerSupportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-yellow-500 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Get from Google Play */}
          <div className="md:col-span-2 lg:col-span-1 lg:text-left">
            <h3 className="text-2xl font-bold mb-3">Get from Google Play</h3>
            <a
              href={googlePlayLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <img
                src={googlePlayBadgeUrl}
                alt="Get it on Google Play"
                className="h-12 hover:opacity-90 transition-opacity"
              />
            </a>
            {/* If an App Store badge is also needed later:
            <a href="YOUR_APP_STORE_LINK_HERE" target="_blank" rel="noopener noreferrer" className="inline-block mt-2">
              <img src="PATH_TO_APP_STORE_BADGE" alt="Download on the App Store" className="h-12 hover:opacity-90 transition-opacity" />
            </a>
            */}
          </div>
        </div>

        {/* Divider Line */}
        <hr className="border-gray-700 my-8" />

        {/* Bottom section: Copyright, Bottom Links, Social Icons, Language */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          {/* Left: Copyright */}
          <div className="mb-4 md:mb-0">
            © 2025 Das Technologies. All rights reserved.
          </div>

          {/* Middle: Bottom Links */}
          <div className="flex space-x-6 mb-4 md:mb-0">
            <Link to="/contact" className="hover:text-white transition-colors">
              Help
            </Link>
            <Link to="/contact" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link to="/contact" className="hover:text-white transition-colors">
              Terms
            </Link>
          </div>

          {/* Right: Social Icons & Language Selector */}
          <div className="flex items-center space-x-4">
            {/* Social Icons */}
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Social media link 1"
            >
              <PlaceholderIcon1 />
            </a>
            <a
              href="https://twitter.com/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="DasGuzo on Twitter"
            >
              <TwitterIcon />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Social media link 2"
            >
              <PlaceholderIcon2 />
            </a>

            {/* Language Selector (Basic display) */}
            <div className="relative">
              <button className="flex items-center text-gray-400 hover:text-white transition-colors">
                <span>English (United States)</span>
                <DropdownArrowIcon />
              </button>
              {/* Actual dropdown functionality would require state and more complex HTML/JS */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
