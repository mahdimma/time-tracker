// src/components/Layout.js
import React from "react";
import Nav from "./Nav";
import { useTranslation } from "react-i18next";

function Layout({ children }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Nav />

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* You could add a Page Title Header here if needed globally */}
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
