import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import { FaClock, FaChartPie } from "react-icons/fa";
import Timer from "./components/Timer";
import ChartPage from "./components/ChartPage";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        {/* Navigation Bar */}
        <nav className="bg-gradient-to-r from-blue-500 to-blue-700 p-4 text-white shadow-md">
          <div className="flex justify-around max-w-2xl mx-auto">
            <NavLink
              to="/"
              className="flex items-center px-4 py-2 hover:bg-blue-800 rounded-md transition-colors duration-200"
              activeClassName="border-b-2 border-white"
            >
              <FaClock className="mr-2" /> Timer
            </NavLink>
            <NavLink
              to="/chart"
              className="flex items-center px-4 py-2 hover:bg-blue-800 rounded-md transition-colors duration-200"
              activeClassName="border-b-2 border-white"
            >
              <FaChartPie className="mr-2" /> Pie Chart
            </NavLink>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex-grow p-4 sm:p-6">
          <Routes>
            <Route
              path="/"
              element={
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 w-full max-w-md">
                    <h1 className="text-3xl font-bold text-blue-700 mb-6">
                      Timer
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
                      Clock Chart
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
