// src/components/Nav.js
import React, { useState } from "react"; // Import useState
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ClockIcon,
  ChartPieIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline"; // Added Menu/Close icons
import MyLanguageSwitcher from "./MyLanguageSwitcher";

function Nav() {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  // Function to toggle mobile menu visibility
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Define base and active styles for NavLink (Desktop)
  const desktopLinkClasses =
    "flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors duration-200 ease-in-out";
  const desktopActiveLinkClasses = "bg-blue-100 text-blue-800 font-semibold";

  // Define base and active styles for NavLink (Mobile)
  const mobileLinkClasses =
    "block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700";
  const mobileActiveLinkClasses = "bg-blue-100 text-blue-800";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side: Logo/Brand */}
          <div className="flex-shrink-0">
            <NavLink
              to="/"
              className="text-2xl font-bold text-blue-700 hover:text-blue-800 transition-colors"
              // Close mobile menu if logo is clicked when menu is open
              onClick={() => isMobileMenuOpen && toggleMobileMenu()}
            >
              {t("AppTitle", "Activities")}
            </NavLink>
          </div>

          {/* Right side: Navigation Links (Desktop) */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${desktopLinkClasses} ${
                  isActive ? desktopActiveLinkClasses : ""
                }`
              }
              end // Important for root path matching
            >
              <ClockIcon className="h-5 w-5 mr-1" /> {/* Adjusted margin */}
              {t("Timer")}
            </NavLink>
            <NavLink
              to="/chart"
              className={({ isActive }) =>
                `${desktopLinkClasses} ${
                  isActive ? desktopActiveLinkClasses : ""
                }`
              }
            >
              <ChartPieIcon className="h-5 w-5 mr-1" /> {/* Adjusted margin */}
              {t("Charts")}
            </NavLink>
            {/* Language Switcher for Desktop */}
            <div className="ml-4">
              {" "}
              {/* Add some margin */}
              <MyLanguageSwitcher />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center">
            {/* Language Switcher for Mobile - Show next to menu button? Or only inside menu? Let's keep it only inside for now */}
            {/* <div className="mr-2"><MyLanguageSwitcher /></div> */}
            <button
              onClick={toggleMobileMenu} // Attach toggle function
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen} // Accessibility
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" /> // Close Icon
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" /> // Menu Icon
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {/* Conditionally render based on state and add transition */}
      {isMobileMenuOpen && (
        <div
          className="sm:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200"
          id="mobile-menu"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${mobileLinkClasses} ${
                  isActive ? mobileActiveLinkClasses : ""
                }`
              }
              onClick={toggleMobileMenu} // Close menu on click
              end
            >
              {t("Timer")}
            </NavLink>
            <NavLink
              to="/chart"
              className={({ isActive }) =>
                `${mobileLinkClasses} ${
                  isActive ? mobileActiveLinkClasses : ""
                }`
              }
              onClick={toggleMobileMenu} // Close menu on click
            >
              {t("Charts")}
            </NavLink>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${mobileLinkClasses} ${
                  isActive ? mobileActiveLinkClasses : ""
                }`
              }
              onClick={toggleMobileMenu} // Close menu on click
            >
              {t("home")}
            </NavLink>

            {/* Language Switcher in Mobile Menu */}
            <div className="mt-3 pt-3 border-t border-gray-200 px-2">
              <MyLanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Nav;
