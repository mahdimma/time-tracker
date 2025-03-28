import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Timer from "./components/Timer";
import ChartPage from "./components/ChartPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 p-4 text-white">
          <Link to="/" className="mr-4 hover:underline">
            Timer
          </Link>
          <Link to="/chart" className="hover:underline">
            Pie Chart
          </Link>
        </nav>
        <div className="p-4">
          <Routes>
            <Route path="/" element={<Timer />} />
            <Route path="/chart" element={<ChartPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
