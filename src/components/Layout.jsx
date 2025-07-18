// src/components/Layout.js
import React from "react";
import { useLocation } from "react-router-dom";
import Nav from "./Nav";
import { useTranslation } from "react-i18next";

function Layout({ children }) {
  const { t } = useTranslation();
  const location = useLocation();
  
  const pageTitles = {
    "/": t("home"),
    "/chart": t("chart_24hr_title"),
  };
  
  const title = pageTitles[location.pathname] || "";

  return (
    <div className="font-vazir flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Nav />

      {/* Global Page Title Header */}
      {title && (
        <header style={{ 
          padding: "1rem", 
          background: "#f5f5f5", 
          borderBottom: "1px solid #ddd",
          marginBottom: "1rem"
        }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 style={{ margin: 0, color: "#333" }}>{title}</h2>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} {t("YourAppName", "My Awesome App")}.{" "}
          {t("AllRightsReserved", "All Rights Reserved.")}
        </div>
      </footer>
    </div>
  );
}

export default Layout;
