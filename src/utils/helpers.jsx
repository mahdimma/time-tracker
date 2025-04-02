// src/utils/helpers.js
export const formatElapsedTime = (milliseconds) => {
  if (milliseconds < 0) milliseconds = 0;
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num) => String(num).padStart(2, "0");

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

// Simple ID generator (can be replaced with uuid if needed)
export const generateId = () => "_" + Math.random().toString(36).substr(2, 9);
