// src/components/SessionList.js
import React from "react";
import { useTranslation } from "react-i18next";
import { TrashIcon } from "@heroicons/react/24/outline"; // Or your preferred icon library

function SessionList({ sessions, onDelete, onClearAll }) {
  const { t } = useTranslation();

  // Sort sessions by start time, newest first
  const sortedSessions = sessions
    .slice()
    .sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {t("Past Sessions")}
        </h2>
        {sortedSessions.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm font-medium text-red-600 hover:text-red-800 transition duration-150 ease-in-out flex items-center gap-1"
            title={t("Clear All Sessions")}
          >
            <TrashIcon className="w-4 h-4 inline-block" />
            {t("Clear All")}
          </button>
        )}
      </div>

      {sortedSessions.length === 0 ? (
        <div className="text-center py-10 px-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">
            {t(
              "No sessions recorded yet. Start the timer to log your activities!"
            )}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {sortedSessions.map((session) => (
            <li
              key={session.id}
              className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm flex justify-between items-center hover:shadow-md transition-shadow duration-150 ease-in-out"
            >
              <div className="flex items-center gap-3 flex-grow">
                <span
                  style={{ backgroundColor: session.color }}
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  aria-hidden="true" // Decorative element
                />
                <div className="flex-grow">
                  <div className="font-medium text-gray-800">
                    {session.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    <span>{new Date(session.startTime).toLocaleString()}</span>
                    <span className="mx-1">-</span>
                    <span>
                      {new Date(session.endTime).toLocaleTimeString()}
                    </span>{" "}
                    {/* Show only time for end */}
                    <span className="ml-2 font-medium">
                      ({session.duration} {t("min")})
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onDelete(session.id)}
                className="ml-4 text-gray-400 hover:text-red-600 transition duration-150 ease-in-out flex-shrink-0 p-1 rounded-full hover:bg-red-100"
                title={t("Delete session")}
                aria-label={t("Delete session") + " " + session.name}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// If you don't have Heroicons installed: npm install @heroicons/react
// If you prefer not to use icons, replace <TrashIcon.../> with:
// <span className="text-xs font-semibold">{t("Delete")}</span>
// And adjust styling accordingly.

export default SessionList;
