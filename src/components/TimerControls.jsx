// src/components/TimerControls.js
import React from "react";
import { useTranslation } from "react-i18next";

function TimerControls({ isTracking, onStartStop }) {
  const { t } = useTranslation();

  const buttonClasses = `w-full py-3 px-6 rounded-md font-semibold text-lg text-white transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 mb-6`;
  const startClasses = `${buttonClasses} bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:ring-emerald-500`;
  const stopClasses = `${buttonClasses} bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 focus:ring-rose-500`;

  return (
    <button
      onClick={onStartStop}
      className={isTracking ? stopClasses : startClasses}
    >
      {isTracking ? t("End Timer") : t("Start Timer")}
    </button>
  );
}

export default TimerControls;
