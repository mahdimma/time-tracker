import React, { useState, useEffect } from "react";
import { getSessions, saveSession } from "../utils/localStorage";

function Timer() {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const [sessionColor, setSessionColor] = useState("#FF5733");
  const [sessions, setSessions] = useState([]);

  // Load existing sessions from localStorage on mount
  useEffect(() => {
    const storedSessions = getSessions();
    setSessions(storedSessions);
  }, []);

  // Update elapsed time while timer is running
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 60000));
      }, 1000);
    } else if (!isRunning && startTime) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  // Simple unique ID generator
  const generateId = () => "_" + Math.random().toString(36).substr(2, 9);

  const handleStartStop = () => {
    if (!isRunning) {
      // Start the timer
      setStartTime(Date.now());
      setIsRunning(true);
      setElapsedTime(0);
    } else {
      // Stop the timer and show the session details form
      setIsRunning(false);
      setShowForm(true);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const endTime = Date.now();
    const duration = Math.floor((endTime - startTime) / 60000); // in minutes
    const session = {
      id: generateId(),
      name: sessionName.trim() || "Unnamed Session",
      color: sessionColor,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      duration,
    };
    // Save to localStorage and update state
    saveSession(session);
    setSessions((prev) => [...prev, session]);
    // Reset timer and form
    setShowForm(false);
    setSessionName("");
    setSessionColor("#FF5733");
    setStartTime(null);
    setElapsedTime(0);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Static Timer App</h1>
      <button
        onClick={handleStartStop}
        className={`w-full py-2 px-4 rounded text-white mb-4 ${
          isRunning ? "bg-red-500" : "bg-green-500"
        }`}
      >
        {isRunning ? "Stop Timer" : "Start Timer"}
      </button>
      <div className="mb-4 text-center text-xl">
        {isRunning ? `Elapsed: ${elapsedTime} min` : "Timer not running"}
      </div>
      {showForm && (
        <form onSubmit={handleFormSubmit} className="mb-4">
          <div className="mb-2">
            <label className="block mb-1">Session Name</label>
            <input
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Enter a session name"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Session Color</label>
            <input
              type="color"
              value={sessionColor}
              onChange={(e) => setSessionColor(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 rounded bg-blue-500 text-white"
          >
            Save Session
          </button>
        </form>
      )}
      <div>
        <h2 className="text-xl font-bold mb-2">Past Sessions</h2>
        {sessions.length === 0 ? (
          <p>No sessions recorded yet.</p>
        ) : (
          <ul className="space-y-2">
            {sessions.map((session) => (
              <li
                key={session.id}
                className="border p-2 rounded flex justify-between items-center"
              >
                <div>
                  <div className="font-bold">{session.name}</div>
                  <div className="text-sm text-gray-600">
                    {session.duration} min
                  </div>
                </div>
                <div
                  style={{ backgroundColor: session.color }}
                  className="w-6 h-6 rounded"
                ></div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Timer;
