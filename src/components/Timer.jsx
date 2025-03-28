import React, { useState, useEffect } from "react";
import { getSessions, saveSession, removeSession, clearSessions } from "../utils/localStorage";

function Timer() {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const [sessionColor, setSessionColor] = useState("#FF5733");
  const [sessions, setSessions] = useState([]);

  // Load sessions from localStorage on component mount
  useEffect(() => {
    const storedSessions = getSessions();
    setSessions(storedSessions);
  }, []);

  // Update elapsed time every second while the timer is running
  useEffect(() => {
    let interval = null;
    if (isRunning && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 60000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  // Generate a simple unique ID for each session
  const generateId = () => "_" + Math.random().toString(36).substr(2, 9);

  const handleStartStop = () => {
    if (!isRunning) {
      // Start the timer and hide the form if it's visible
      setStartTime(Date.now());
      setIsRunning(true);
      setElapsedTime(0);
      setShowForm(false);
    } else {
      // Stop the timer and show the form to save the session
      setIsRunning(false);
      setShowForm(true);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const endTime = Date.now();
    const duration = Math.floor((endTime - startTime) / 60000);
    const session = {
      id: generateId(),
      name: sessionName.trim() || "Unnamed Session",
      color: sessionColor,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      duration,
    };
    saveSession(session);
    setSessions((prev) => [...prev, session]);
    // Reset form and timer state
    setShowForm(false);
    setSessionName("");
    setSessionColor("#FF5733");
    setStartTime(null);
    setElapsedTime(0);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      const updatedSessions = removeSession(id);
      setSessions(updatedSessions);
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to delete all sessions?")) {
      clearSessions();
      setSessions([]);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Static Timer App</h1>
      <TimerControls
        isRunning={isRunning}
        elapsedTime={elapsedTime}
        startTime={startTime}
        onStartStop={handleStartStop}
      />
      {showForm && (
        <SessionForm
          sessionName={sessionName}
          setSessionName={setSessionName}
          sessionColor={sessionColor}
          setSessionColor={setSessionColor}
          onSubmit={handleFormSubmit}
        />
      )}
      <SessionList
        sessions={sessions}
        onDelete={handleDelete}
        onClearAll={handleClearAll}
      />
    </div>
  );
}

// Component for timer controls and display
function TimerControls({ isRunning, elapsedTime, startTime, onStartStop }) {
  return (
    <div>
      <button
        onClick={onStartStop}
        className={`w-full py-2 px-4 rounded text-white mb-4 ${
          isRunning ? "bg-red-500" : "bg-green-500"
        }`}
      >
        {isRunning ? "Stop Timer" : "Start Timer"}
      </button>
      <div className="mb-4 text-center">
        {isRunning && startTime ? (
          <div>
            <div className="text-xl">Elapsed: {elapsedTime} min</div>
            <div className="text-sm text-gray-600">
              Started at {new Date(startTime).toLocaleTimeString()}
            </div>
          </div>
        ) : (
          <div className="text-xl">Timer not running</div>
        )}
      </div>
    </div>
  );
}

// Component for the session input form
function SessionForm({ sessionName, setSessionName, sessionColor, setSessionColor, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="mb-4">
      <div className="mb-2">
        <label className="block mb-1">Session Name</label>
        <input
          type="text"
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Enter a session name"
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
  );
}

// Component for displaying and managing the session list
function SessionList({ sessions, onDelete, onClearAll }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Past Sessions</h2>
      {sessions.length > 0 && (
        <button onClick={onClearAll} className="mb-2 text-red-500">
          Clear All Sessions
        </button>
      )}
      {sessions.length === 0 ? (
        <p>No sessions recorded yet.</p>
      ) : (
        <ul className="space-y-2">
          {sessions.slice().reverse().map((session) => (
            <li
              key={session.id}
              className="border p-2 rounded flex justify-between items-center"
            >
              <div>
                <div className="font-bold">{session.name}</div>
                <div className="text-sm text-gray-600">
                  {new Date(session.startTime).toLocaleString()} -{" "}
                  {new Date(session.endTime).toLocaleString()} ({session.duration} min)
                </div>
              </div>
              <div
                style={{ backgroundColor: session.color }}
                className="w-6 h-6 rounded"
              />
              <button
                onClick={() => onDelete(session.id)}
                className="ml-2 text-red-500"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Timer;