export function getSessions() {
  try {
    const sessions = JSON.parse(localStorage.getItem("sessions") || "[]");
    return Array.isArray(sessions) ? sessions : [];
  } catch (e) {
    console.error("Error reading sessions from localStorage", e);
    return [];
  }
}

export function saveSession(session) {
  try {
    const sessions = getSessions();
    sessions.push(session);
    localStorage.setItem("sessions", JSON.stringify(sessions));
  } catch (e) {
    console.error("Error saving session to localStorage", e);
  }
}

export function removeSession(id) {
  try {
    const sessions = getSessions();
    const updatedSessions = sessions.filter((session) => session.id !== id);
    localStorage.setItem("sessions", JSON.stringify(updatedSessions));
    return updatedSessions;
  } catch (e) {
    console.error("Error removing session from localStorage", e);
    return getSessions();
  }
}

export function clearSessions() {
  try {
    localStorage.removeItem("sessions");
  } catch (e) {
    console.error("Error clearing sessions from localStorage", e);
  }
}
