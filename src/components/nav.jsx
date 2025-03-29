import React from "react";
import { NavLink } from "react-router-dom";
import { FaClock, FaChartPie } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import MyLanguageSwitcher from "./MyLanguageSwitcher";

const Nav = () => {
  const { t } = useTranslation();

  const navLinkStyles = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    transition: "all 0.2s",
    backgroundColor: isActive ? "rgba(255, 255, 255, 0.1)" : "transparent",
    borderBottom: isActive ? "2px solid white" : "none",
  });

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-blue-700 p-4 text-white shadow-md sticky top-0 z-50">
      <div className="flex flex-col items-center max-w-3xl mx-auto">
        <div className="flex space-x-4">
          <NavLink
            to="/"
            style={navLinkStyles}
            className="hover:bg-blue-800 transition-colors duration-200"
          >
            <FaClock className="mr-2" />
            <span>{t("Timer")}</span>
          </NavLink>

          <NavLink
            to="/chart"
            style={navLinkStyles}
            className="hover:bg-blue-800 transition-colors duration-200"
          >
            <FaChartPie className="mr-2" />
            <span>{t("Pie Chart")}</span>
          </NavLink>

          <div className="ml-4">
            <MyLanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
