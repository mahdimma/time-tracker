import React, { useState, useEffect } from "react";
import {
  getSessions,
  saveSession,
  removeSession,
  clearSessions,
} from "../utils/localStorage";

function Timer() {
  const [isTracking, setIsTracking] = useState(false); // وضعیت جدید برای پیگیری شروع زمان
  const [startTime, setStartTime] = useState(null); // ذخیره زمان شروع
  const [showForm, setShowForm] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const [sessionColor, setSessionColor] = useState("#FF5733");
  const [sessions, setSessions] = useState([]);

  const START_TIME_KEY = "timerStartTime";
  const IS_TRACKING_KEY = "timerIsTracking";

  // Load sessions and timer state from localStorage on component mount
  useEffect(() => {
    const storedSessions = getSessions();
    setSessions(storedSessions);

    const storedStartTime = localStorage.getItem(START_TIME_KEY);
    const storedIsTracking = localStorage.getItem(IS_TRACKING_KEY) === "true";

    if (storedStartTime && storedIsTracking) {
      setStartTime(parseInt(storedStartTime, 10));
      setIsTracking(true);
    }
  }, []);

  // Save timer state to localStorage whenever it changes
  useEffect(() => {
    if (startTime) {
      localStorage.setItem(START_TIME_KEY, startTime.toString());
    } else {
      localStorage.removeItem(START_TIME_KEY);
    }
    localStorage.setItem(IS_TRACKING_KEY, isTracking.toString());
  }, [startTime, isTracking]);

  // Generate a simple unique ID for each session
  const generateId = () => "_" + Math.random().toString(36).substr(2, 9);

  const handleStartStop = () => {
    if (!isTracking) {
      // Start tracking time
      const now = Date.now();
      setStartTime(now);
      setIsTracking(true);
      setShowForm(false);
    } else {
      // Stop tracking and show the form to save the session
      setIsTracking(false);
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
    setIsTracking(false);
    localStorage.removeItem(START_TIME_KEY);
    localStorage.removeItem(IS_TRACKING_KEY);
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
        isTracking={isTracking}
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
function TimerControls({ isTracking, startTime, onStartStop }) {
  return (
    <div>
      <button
        onClick={onStartStop}
        className={`w-full py-2 px-4 rounded text-white mb-4 ${
          isTracking ? "bg-red-500" : "bg-green-500"
        }`}
      >
        {isTracking ? "End Timer" : "Start Timer"}
      </button>
      <div className="mb-4 text-center">
        {isTracking && startTime ? (
          <div className="text-sm text-gray-600">
            Timer started at {new Date(startTime).toLocaleTimeString()}
          </div>
        ) : (
          <div className="text-xl">Timer not running</div>
        )}
      </div>
    </div>
  );
}

// Component for the session input form
function SessionForm({
  sessionName,
  setSessionName,
  sessionColor,
  setSessionColor,
  onSubmit,
}) {
  const suggestedColors = [
    "#FF5733",
    "#3498DB",
    "#2ECC71",
    "#F39C12",
    "#9B59B6",
    "#E74C3C",
  ];

  const handleSuggestedColorClick = (color) => {
    setSessionColor(color);
  };

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
        <div className="flex gap-2 mb-2">
          {suggestedColors.map((color) => (
            <div
              key={color}
              style={{
                backgroundColor: color,
                width: "30px",
                height: "30px",
                cursor: "pointer",
                borderRadius: "4px",
              }}
              onClick={() => handleSuggestedColorClick(color)}
              title={`Select color ${color}`}
            />
          ))}
        </div>
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
          {sessions
            .slice()
            .reverse()
            .map((session) => (
              <li
                key={session.id}
                className="border p-2 rounded flex justify-between items-center"
              >
                <div>
                  <div className="font-bold">{session.name}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(session.startTime).toLocaleString()} -{" "}
                    {new Date(session.endTime).toLocaleString()} (
                    {session.duration} min)
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
