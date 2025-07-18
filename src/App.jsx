// src/App.js
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TimerPage from "./pages/TimerPage"; // Renamed for clarity
import ChartPage from "./pages/ChartPage"; // Renamed for clarity
import NotFoundPage from "./pages/NotFoundPage";
import Layout from "./components/Layout";

function App() {
  const { i18n } = useTranslation();
  // Effect to update the document's direction based on the current language
  useEffect(() => {
    const currentLang = i18n.language;
    const direction = currentLang === "fa" ? "rtl" : "ltr";

    // Set the dir attribute on the <html> element
    document.documentElement.dir = direction;

    // Add/remove RTL/LTR class to body for CSS targeting
    document.body.classList.remove('ltr', 'rtl');
    document.body.classList.add(direction);
  }, [i18n.language]); // Re-run this effect whenever the language changes

  // No need for t function directly in App if titles are handled in pages/layout

  return (
    <Router>
      <Layout>
        {" "}
        {/* Wrap all routes in the Layout component */}
        <Routes>
          <Route path="/" element={<TimerPage />} />
          <Route path="/chart" element={<ChartPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
