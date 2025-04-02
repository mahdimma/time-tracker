// src/components/Timer.js
import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  getSessions,
  saveSession,
  removeSession,
  clearSessions,
} from "../utils/localStorage"; // Assuming path is correct
import { generateId } from "../utils/helpers"; // Use helper for ID

import TimerDisplay from "../components/TimerDisplay";
import TimerControls from "../components/TimerControls";
import SessionForm from "../components/SessionForm";
import SessionList from "../components/SessionList";

// Constants for localStorage keys
const START_TIME_KEY = "timerStartTime";
const IS_TRACKING_KEY = "timerIsTracking";

function Timer() {
  const { t } = useTranslation();

  // State Variables
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState(null); // Store as timestamp (number)
  const [showForm, setShowForm] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const [sessionColor, setSessionColor] = useState("#3B82F6"); // Default to a nice blue
  const [sessions, setSessions] = useState([]);

  // --- Effects ---

  // Load initial state from localStorage
  useEffect(() => {
    const storedSessions = getSessions();
    setSessions(storedSessions);

    const storedStartTime = localStorage.getItem(START_TIME_KEY);
    const storedIsTracking = localStorage.getItem(IS_TRACKING_KEY) === "true";

    // Restore timer state only if it was actively tracking
    if (storedIsTracking && storedStartTime) {
      setStartTime(parseInt(storedStartTime, 10));
      setIsTracking(true);
      setShowForm(false); // Don't show form if timer was running
    }
  }, []); // Run only once on mount

  // Persist timer state changes to localStorage
  useEffect(() => {
    if (isTracking && startTime) {
      localStorage.setItem(START_TIME_KEY, startTime.toString());
      localStorage.setItem(IS_TRACKING_KEY, "true");
    } else {
      // Clear keys if timer is stopped or startTime is null
      localStorage.removeItem(START_TIME_KEY);
      localStorage.removeItem(IS_TRACKING_KEY);
    }
  }, [isTracking, startTime]);

  // --- Event Handlers ---

  const handleStartStop = useCallback(() => {
    if (!isTracking) {
      // --- Start Timer ---
      const now = Date.now();
      setStartTime(now);
      setIsTracking(true);
      setShowForm(false); // Hide form when starting
      // Clear any lingering form details from a previously cancelled save
      setSessionName("");
      setSessionColor("#3B82F6"); // Reset color too
    } else {
      // --- Stop Timer ---
      setIsTracking(false);
      // Keep startTime, it's needed for duration calculation in the form
      setShowForm(true); // Show form to save session
    }
  }, [isTracking]); // Dependency: isTracking

  const handleFormSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!startTime) {
        console.error("Form submitted without a start time."); // Added error check
        return;
      }

      const endTime = Date.now();
      const duration = Math.max(0, Math.floor((endTime - startTime) / 60000));

      const newSession = {
        id: generateId(),
        name: sessionName.trim() || t("Unnamed Session"),
        color: sessionColor,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        duration,
      };

      // --- Start of Change ---
      saveSession(newSession); // Save the session to localStorage

      // Update the component's state with the new session added to the existing list
      setSessions((prevSessions) => {
        // Ensure prevSessions is always an array, even if something went wrong before
        const currentSessions = Array.isArray(prevSessions) ? prevSessions : [];
        return [...currentSessions, newSession];
      });
      // --- End of Change ---

      // Reset state after saving
      setShowForm(false);
      setSessionName("");
      setSessionColor("#3B82F6");
      setStartTime(null);
      // isTracking is already false
    },
    [startTime, sessionName, sessionColor, t, setSessions] // Added setSessions to dependency array
  ); // Dependencies

  const handleDeleteSession = useCallback(
    (id) => {
      // Add confirmation dialog
      if (window.confirm(t("Are you sure you want to delete this session?"))) {
        const updatedSessions = removeSession(id); // removeSession should return the updated list
        setSessions(updatedSessions);
      }
    },
    [t]
  ); // Dependency: t function for translation

  const handleClearAllSessions = useCallback(() => {
    // Add confirmation dialog
    if (
      window.confirm(
        t(
          "Are you sure you want to delete ALL sessions? This cannot be undone."
        )
      )
    ) {
      clearSessions();
      setSessions([]); // Update state immediately
    }
  }, [t]); // Dependency: t function for translation

  // --- Render ---
  return (
    // Enhanced container styling
    <div className="max-w-2xl mx-auto bg-gradient-to-b from-white to-gray-50 p-8 rounded-xl shadow-xl my-10 font-sans">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        {t("Activity Timer")}
      </h1>

      {/* Display Timer Status and Elapsed Time */}
      <TimerDisplay isTracking={isTracking} startTime={startTime} />

      {/* Start/Stop Controls - Only show if form isn't visible */}
      {!showForm && (
        <TimerControls isTracking={isTracking} onStartStop={handleStartStop} />
      )}

      {/* Session Saving Form - Conditionally Rendered */}
      {showForm && (
        <SessionForm
          sessionName={sessionName}
          setSessionName={setSessionName}
          sessionColor={sessionColor}
          setSessionColor={setSessionColor}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* List of Past Sessions */}
      <SessionList
        sessions={sessions}
        onDelete={handleDeleteSession}
        onClearAll={handleClearAllSessions}
      />
    </div>
  );
}

export default Timer;
