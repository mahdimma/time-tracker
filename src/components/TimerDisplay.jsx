// src/components/TimerDisplay.js
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { formatElapsedTime } from "../utils/helpers";

function TimerDisplay({ isTracking, startTime }) {
  const { t } = useTranslation();
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let intervalId = null;

    if (isTracking && startTime) {
      // Update immediately on start
      setElapsedTime(Date.now() - startTime);

      // Then update every second
      intervalId = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    } else {
      setElapsedTime(0); // Reset when stopped
    }

    // Cleanup interval on component unmount or when tracking stops
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isTracking, startTime]);

  return (
    <div className="text-center p-6 bg-gray-100 rounded-lg shadow-inner mb-6">
      {isTracking && startTime ? (
        <>
          <div className="text-5xl font-mono font-semibold text-gray-800 tracking-wider">
            {formatElapsedTime(elapsedTime)}
          </div>
          <div className="text-sm text-gray-500 mt-2">
            {t("Started at")}: {new Date(startTime).toLocaleTimeString()}
          </div>
        </>
      ) : (
        <div className="text-3xl font-light text-gray-500">
          {t("Timer stopped")}
        </div>
      )}
    </div>
  );
}

export default TimerDisplay;
