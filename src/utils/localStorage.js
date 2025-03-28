export function getSessions() {
  const data = localStorage.getItem("sessions");
  return data ? JSON.parse(data) : [];
}

export function saveSession(session) {
  const sessions = getSessions();
  sessions.push(session);
  localStorage.setItem("sessions", JSON.stringify(sessions));
}
