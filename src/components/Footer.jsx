import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#0a173a] text-white py-10">
      {/* Top Section */}
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1 - Product */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:underline">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Solutions
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Education
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Team plans
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2 - About us */}
          <div>
            <h4 className="font-semibold text-lg mb-4">About us</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:underline">
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Help and support */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Help and support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:underline">
                  Help center
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contact us
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Privacy & Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Safety information
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Sitemap
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 - Community & App Buttons */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Community</h4>
            <ul className="space-y-2 text-sm mb-4">
              <li>
                <a href="#" className="hover:underline">
                  Agencies
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Freelancers
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Engineers
                </a>
              </li>
            </ul>
            <div className="flex space-x-4">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/67/App_Store.svg"
                alt="App Store"
                className="w-32"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Google Play"
                className="w-32"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-600 mt-10 pt-6">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center">
          {/* Copyright */}
          <div className="text-sm mb-4 md:mb-0">
            © 2024{" "}
            <a href="#" className="hover:underline">
              @copyright
            </a>
          </div>

          {/* Help links */}
          <div className="flex space-x-4 text-sm mb-4 md:mb-0">
            <a href="#" className="hover:underline">
              Help
            </a>
            <a href="#" className="hover:underline">
              Privacy
            </a>
            <a href="#" className="hover:underline">
              Terms
            </a>
          </div>

          {/* Icons and Language Selector */}
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <span className="w-4 h-4 bg-gray-500 rounded-full"></span>
              <span className="w-4 h-4 bg-gray-500 rounded-full"></span>
              <span className="w-4 h-4 bg-gray-500 rounded-full"></span>
            </div>
            <div>
              <select
                className="bg-[#0a173a] text-white cursor-pointer text-sm border-0"
                defaultValue="en"
              >
                <option value="en">English (United States)</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
