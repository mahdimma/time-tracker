import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import Timer from "./components/Timer";
import ChartPage from "./components/ChartPage";
import Nav from "./components/nav";
import { useTranslation } from "react-i18next"; // Import useTranslation

function App() {
  const { t } = useTranslation(); // Get the t function

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Nav />
        <div className="flex-grow p-4 sm:p-6">
          <Routes>
            <Route
              path="/"
              element={
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 w-full max-w-md">
                    <h1 className="text-3xl font-bold text-blue-700 mb-6">
                      {t("Timer")} {/* Use t('Timer') here as well */}
                    </h1>
                    <Timer />
                  </div>
                </div>
              }
            />
            <Route
              path="/chart"
              element={
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 w-full max-w-md">
                    <h1 className="text-3xl font-bold text-blue-700 mb-6">
                      {t("Pie Chart")} {/* Use t('Pie Chart') here as well */}
                    </h1>
                    <ChartPage />
                  </div>
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
