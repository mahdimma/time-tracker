import React, { useEffect, useState, useMemo } from "react";
import { getSessions } from "../utils/localStorage"; // Assuming this path is correct
import { useTranslation } from "react-i18next";

// --- Helper Functions (Moved Outside Component) ---

function polarToCartesian(centerX, centerY, radius, angle) {
  // Angle adjustment to start from the top (12 o'clock)
  const adjustedAngle = angle - Math.PI / 2;
  return {
    x: centerX + radius * Math.cos(adjustedAngle),
    y: centerY + radius * Math.sin(adjustedAngle),
  };
}

function describeArc(centerX, centerY, radius, startAngle, endAngle) {
  // Ensure angles are within 0 to 2*PI range if needed, although calculation handles it
  const start = polarToCartesian(centerX, centerY, radius, startAngle);
  const end = polarToCartesian(centerX, centerY, radius, endAngle);

  // Determine arc sweep flag (more or less than 180 degrees)
  const arcSweep = endAngle - startAngle <= Math.PI ? "0" : "1";

  // Handle potential floating point inaccuracies for full circles if necessary
  // If (endAngle - startAngle >= 2 * Math.PI - 0.001) { ... }

  const d = [
    "M",
    start.x,
    start.y, // Move to start point
    "A",
    radius,
    radius,
    0,
    arcSweep,
    1,
    end.x,
    end.y, // Arc command
    "L",
    centerX,
    centerY, // Line to center
    "L",
    start.x,
    start.y, // Line back to start (closes the wedge) - corrected from original 'Z' for wedges
  ].join(" ");

  // If you want filled arcs instead of wedges, the original 'Z' is correct
  // const dWedge = [ /* above */ ].join(" ");
  // const dArcOnly = [
  //   "M", start.x, start.y,
  //   "A", radius, radius, 0, arcSweep, 1, end.x, end.y
  // ].join(" ");

  return d; // Returning wedge path
}

// Calculates angle for a 12-hour clock (0 to 2*PI)
function timeToAngle12Hour(hour, minute) {
  const totalMinutes = (hour % 12) * 60 + minute; // Use modulo 12
  // Ensure 12 o'clock maps correctly (totalMinutes can be 0 for 12:00 AM/PM)
  const effectiveMinutes = totalMinutes === 0 ? 720 : totalMinutes; // Map 0 minutes (12:xx) to the end
  return (effectiveMinutes / 720) * 2 * Math.PI;
}

// Calculates angle for a 24-hour clock (0 to 2*PI)
function timeToAngle24Hour(hour, minute) {
  const totalMinutes = hour * 60 + minute;
  return (totalMinutes / 1440) * 2 * Math.PI;
}

// --- Reusable UI Components ---

/**
 * Renders a single activity pie chart.
 */
const ActivityPieChart = ({
  title,
  sessions,
  radius,
  centerX,
  centerY,
  hourTicks,
  tickRadius,
  is12Hour = false, // Flag to adjust tick label display
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-3 text-gray-700">{t(title)}</h2>
      <svg
        width={centerX * 2}
        height={centerY * 2}
        viewBox={`0 0 ${centerX * 2} ${centerY * 2}`}
      >
        {/* Background Circle */}
        <circle cx={centerX} cy={centerY} r={radius} fill="#f3f4f6" />{" "}
        {/* Lighter gray */}
        {/* Session Arcs */}
        {sessions.map((session, index) => {
          // Handle arcs crossing the 0/2PI boundary (e.g., 11 PM to 1 AM)
          if (session.endAngle < session.startAngle) {
            // Draw two arcs: one from startAngle to 2*PI, one from 0 to endAngle
            const arc1 = describeArc(
              centerX,
              centerY,
              radius,
              session.startAngle,
              2 * Math.PI
            );
            const arc2 = describeArc(
              centerX,
              centerY,
              radius,
              0,
              session.endAngle
            );
            return (
              <g key={`segment-${title}-${index}`}>
                <path d={arc1} fill={session.color} opacity="0.8" />
                <path d={arc2} fill={session.color} opacity="0.8" />
              </g>
            );
          } else if (session.startAngle !== session.endAngle) {
            // Avoid zero-length arcs
            return (
              <path
                key={`segment-${title}-${index}`}
                d={describeArc(
                  centerX,
                  centerY,
                  radius,
                  session.startAngle,
                  session.endAngle
                )}
                fill={session.color}
                opacity="0.9" // Add some transparency
              />
            );
          }
          return null; // Skip zero-length arcs if any occur
        })}
        {/* Hour Ticks */}
        {hourTicks.map((hour) => {
          const angle = (hour / hourTicks.length) * 2 * Math.PI;
          const pos = polarToCartesian(centerX, centerY, tickRadius, angle);
          // Adjust display for 12-hour clock (show 12 instead of 0)
          const displayHour = is12Hour ? (hour === 0 ? 12 : hour) : hour;
          return (
            <text
              key={`hour-${title}-${hour}`}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="10"
              fill="#4b5563" // Darker gray for text
            >
              {displayHour}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

/**
 * Renders the legend for the charts.
 */
const ChartLegend = ({ activities }) => {
  const { t } = useTranslation();

  if (!activities || activities.length === 0) {
    return (
      <p className="text-gray-500 mt-4">{t("No activity data to display.")}</p>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-md font-semibold mb-2 text-gray-600">
        {t("legend")}
      </h3>
      <ul className="space-y-1">
        {activities.map((activity, index) => (
          <li key={index} className="flex items-center space-x-2">
            <div
              className="w-4 h-4 rounded-full border border-gray-300" // Added border for lighter colors
              style={{ backgroundColor: activity.color }}
            ></div>
            <span className="text-sm text-gray-700">{activity.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// --- Main Page Component ---

function ChartPage() {
  const { t } = useTranslation();
  const [allSessions, setAllSessions] = useState([]);
  const [firstHalfSessions, setFirstHalfSessions] = useState([]);
  const [secondHalfSessions, setSecondHalfSessions] = useState([]);
  const [uniqueActivities, setUniqueActivities] = useState([]);

  // Chart dimensions configuration
  const chartRadius = 120; // Adjusted for potentially smaller side-by-side charts
  const chartSize = 300; // SVG canvas dimension (centerX/Y will be half this)
  const centerX = chartSize / 2;
  const centerY = chartSize / 2;
  const tickRadius24 = chartRadius + 15;
  const tickRadius12 = chartRadius + 15; // Can be the same if radius is consistent

  useEffect(() => {
    const rawSessions = getSessions();

    const processedData = processSessionData(rawSessions);

    setAllSessions(processedData.allSessions);
    setFirstHalfSessions(processedData.firstHalfSessions);
    setSecondHalfSessions(processedData.secondHalfSessions);
    setUniqueActivities(processedData.uniqueActivities);
  }, []); // Runs once on mount

  // Memoize tick arrays to avoid recreation on every render
  const hourTicks24 = useMemo(
    () => Array.from({ length: 24 }, (_, i) => i),
    []
  );
  const hourTicks12 = useMemo(
    () => Array.from({ length: 12 }, (_, i) => i),
    []
  );

  // Centralized data processing logic
  const processSessionData = (sessions) => {
    const all = [];
    const firstHalf = [];
    const secondHalf = [];
    const activitiesMap = new Map(); // To track unique activities { name: color }

    sessions.forEach((session) => {
      if (!session.startTime || !session.endTime) return; // Skip invalid sessions

      const start = new Date(session.startTime);
      const end = new Date(session.endTime);

      // Check for valid dates
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return;

      const startHour = start.getHours();
      const startMinute = start.getMinutes();
      const endHour = end.getHours();
      const endMinute = end.getMinutes();

      // Add to unique activities map
      if (!activitiesMap.has(session.name)) {
        activitiesMap.set(session.name, session.color || "#cccccc"); // Use default color if missing
      }

      // --- Process for 24-Hour Chart ---
      const startAngle24 = timeToAngle24Hour(startHour, startMinute);
      let endAngle24 = timeToAngle24Hour(endHour, endMinute);

      // Handle case where session ends exactly at midnight (00:00 of next day)
      // timeToAngle24Hour(24, 0) would be same as timeToAngle24Hour(0, 0)
      // We represent this as ending exactly at 2*PI.
      if (endHour === 0 && endMinute === 0 && startAngle24 > 0) {
        // If the session started *before* midnight and ends *at* midnight
        if (startHour > 0 || startMinute > 0) {
          endAngle24 = 2 * Math.PI;
        }
        // If start was also 00:00, angle is 0, skip? Or handle as full 24h session if needed?
      }

      // Add to the 24h list if it has duration
      if (
        Math.abs(endAngle24 - startAngle24) > 0.0001 ||
        startAngle24 !== endAngle24
      ) {
        // Added tolerance for float comparison
        all.push({
          ...session,
          startAngle: startAngle24,
          endAngle: endAngle24,
        });
      }

      // --- Process for 12-Hour Charts ---
      const crossesMidday =
        startHour < 12 && (endHour > 12 || (endHour === 12 && endMinute > 0));
      const startsAtMidday = startHour === 12 && startMinute === 0;
      const endsAtMidday = endHour === 12 && endMinute === 0;

      // Part in First Half (00:00 - 11:59)
      if (startHour < 12) {
        const firstStartAngle = timeToAngle12Hour(startHour, startMinute);
        let firstEndAngle;
        if (crossesMidday || endsAtMidday) {
          firstEndAngle = timeToAngle12Hour(12, 0); // End at 12:00 mark
        } else {
          firstEndAngle = timeToAngle12Hour(endHour, endMinute);
        }
        // Add only if duration > 0 within this half
        if (Math.abs(firstEndAngle - firstStartAngle) > 0.0001) {
          firstHalf.push({
            ...session,
            startAngle: firstStartAngle,
            endAngle: firstEndAngle,
          });
        }
      }

      // Part in Second Half (12:00 - 23:59)
      if (endHour >= 12 && !(endHour === 12 && endMinute === 0)) {
        // If it ends after 12:00
        let secondStartAngle;
        if (crossesMidday || startsAtMidday) {
          secondStartAngle = timeToAngle12Hour(0, 0); // Start at 12:00 mark (0 for 2nd half 12h clock)
        } else {
          secondStartAngle = timeToAngle12Hour(startHour, startMinute);
        }
        const secondEndAngle = timeToAngle12Hour(endHour, endMinute);

        // Add only if duration > 0 within this half
        if (Math.abs(secondEndAngle - secondStartAngle) > 0.0001) {
          secondHalf.push({
            ...session,
            startAngle: secondStartAngle,
            endAngle: secondEndAngle,
          });
        }
      }
    });

    // Convert map to array for the legend
    const uniqueActivitiesArray = Array.from(
      activitiesMap,
      ([name, color]) => ({ name, color })
    );

    return {
      allSessions: all,
      firstHalfSessions: firstHalf,
      secondHalfSessions: secondHalf,
      uniqueActivities: uniqueActivitiesArray,
    };
  };

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md my-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
        {t("Activity Overview")}
      </h1>

      {allSessions.length === 0 && (
        <p className="text-center text-gray-500 py-4">
          {t("No session information available to display charts.")}
        </p>
      )}

      {allSessions.length > 0 && (
        <>
          {/* Combined Legend */}
          <div className="mb-8 flex justify-center">
            <ChartLegend activities={uniqueActivities} />
          </div>

          {/* 24-Hour Chart */}
          <div className="mb-10 border-b pb-8 border-gray-200">
            <ActivityPieChart
              title={t("chart_24hr_title")}
              sessions={allSessions}
              radius={chartRadius + 10} // Slightly larger radius for the main chart
              centerX={centerX}
              centerY={centerY}
              hourTicks={hourTicks24}
              tickRadius={tickRadius24 + 10}
              is12Hour={false}
            />
          </div>

          {/* 12-Hour Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* First Half Chart */}
            <ActivityPieChart
              title={t("chart_am_title")}
              sessions={firstHalfSessions}
              radius={chartRadius}
              centerX={centerX}
              centerY={centerY}
              hourTicks={hourTicks12}
              tickRadius={tickRadius12}
              is12Hour={true}
            />

            {/* Second Half Chart */}
            <ActivityPieChart
              title={t("chart_pm_title")}
              sessions={secondHalfSessions}
              radius={chartRadius}
              centerX={centerX}
              centerY={centerY}
              hourTicks={hourTicks12}
              tickRadius={tickRadius12}
              is12Hour={true}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default ChartPage;
