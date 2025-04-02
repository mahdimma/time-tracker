// src/components/SessionForm.js
import React from "react";
import { useTranslation } from "react-i18next";

function SessionForm({
  sessionName,
  setSessionName,
  sessionColor,
  setSessionColor,
  onSubmit,
}) {
  const { t } = useTranslation();

  // Suggest more visually distinct colors or let user customize fully
  const suggestedColors = [
    "#EF4444", // Red-500
    "#F97316", // Orange-500
    "#EAB308", // Yellow-500
    "#22C55E", // Green-500
    "#3B82F6", // Blue-500
    "#8B5CF6", // Violet-500
    "#EC4899", // Pink-500
  ];

  const handleSuggestedColorClick = (color) => {
    setSessionColor(color);
  };

  return (
    // Added animation for smoother appearance
    <form
      onSubmit={onSubmit}
      className="mb-6 p-6 bg-white rounded-lg shadow-md border border-gray-200 animate-fade-in"
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-700">
        {t("Save Session Details")}
      </h3>
      <div className="mb-4">
        <label
          htmlFor="sessionName"
          className="block mb-2 text-sm font-medium text-gray-600"
        >
          {t("Session Name")} ({t("Optional")})
        </label>
        <input
          id="sessionName"
          type="text"
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-150 ease-in-out"
          placeholder={t("e.g., Project X research")}
        />
      </div>

      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-600">
          {t("Assign a Color")}
        </label>
        {/* Suggested Colors */}
        <div className="flex flex-wrap gap-3 mb-3">
          {suggestedColors.map((color) => (
            <button
              key={color}
              type="button" // Prevent form submission
              style={{ backgroundColor: color }}
              className={`w-8 h-8 rounded-full cursor-pointer transition transform hover:scale-110 border-2 ${
                sessionColor === color
                  ? "ring-2 ring-offset-2 ring-blue-500 border-white"
                  : "border-transparent"
              }`}
              onClick={() => handleSuggestedColorClick(color)}
              title={`${t("Select color")} ${color}`}
              aria-label={`${t("Select color")} ${color}`}
            />
          ))}
        </div>
        {/* Custom Color Input - Hidden visually but accessible */}
        <div className="flex items-center gap-3">
          <label htmlFor="customColor" className="text-sm text-gray-500">
            {t("Custom")}:
          </label>
          <input
            id="customColor"
            type="color"
            value={sessionColor}
            onChange={(e) => setSessionColor(e.target.value)}
            className="w-10 h-10 border-none rounded-md cursor-pointer" // Basic styling for the picker itself
          />
          <span
            className="inline-block w-6 h-6 rounded ml-2 border"
            style={{ backgroundColor: sessionColor }}
          ></span>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 px-6 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
      >
        {t("Save Session")}
      </button>
    </form>
  );
}

// Helper for simple fade-in animation (add to your global CSS or Tailwind config)
/* In your global CSS (e.g., index.css):
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
*/

export default SessionForm;
