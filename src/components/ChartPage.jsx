import React, { useEffect, useState } from "react";
import { getSessions } from "../utils/localStorage";

function polarToCartesian(centerX, centerY, radius, angle) {
  return {
    x: centerX + radius * Math.cos(angle - Math.PI / 2),
    y: centerY + radius * Math.sin(angle - Math.PI / 2),
  };
}

function describeArc(centerX, centerY, radius, startAngle, endAngle) {
  const start = polarToCartesian(centerX, centerY, radius, startAngle);
  const end = polarToCartesian(centerX, centerY, radius, endAngle);

  const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

  const d = [
    "M",
    centerX,
    centerY,
    "L",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    1,
    end.x,
    end.y,
    "Z",
  ].join(" ");

  return d;
}

function timeToAngle12Hour(hour, minute) {
  const totalMinutes = hour * 60 + minute;
  return (totalMinutes / 720) * 2 * Math.PI;
}

function ChartPage() {
  const [transformedSessions, setTransformedSessions] = useState([]);
  const [firstHalfSessions, setFirstHalfSessions] = useState([]);
  const [secondHalfSessions, setSecondHalfSessions] = useState([]);

  const chartRadius = 100; // کاهش شعاع برای جا شدن دو نمودار
  const centerX = 150;
  const centerY = 150;

  useEffect(() => {
    const sessions = getSessions();
    const transformed = sessions.map((session) => {
      const start = new Date(session.startTime);
      const end = new Date(session.endTime);

      const startMinutes = start.getHours() * 60 + start.getMinutes();
      const endMinutes = end.getHours() * 60 + end.getMinutes();

      const startAngle = (startMinutes / 1440) * 2 * Math.PI;
      const endAngle = (endMinutes / 1440) * 2 * Math.PI;

      return {
        ...session,
        startAngle,
        endAngle,
      };
    });
    setTransformedSessions(transformed);

    const firstHalfData = [];
    const secondHalfData = [];

    sessions.forEach((session) => {
      const start = new Date(session.startTime);
      const end = new Date(session.endTime);

      const startHour = start.getHours();
      const startMinute = start.getMinutes();
      const endHour = end.getHours();
      const endMinute = end.getMinutes();

      // پردازش برای نیمه اول (00:00 - 12:00)
      if (startHour < 12 || (startHour === 12 && startMinute === 0)) {
        const firstHalfStartHour = startHour % 12;
        const firstHalfEndHour =
          endHour < 12 || (endHour === 12 && endMinute === 0)
            ? endHour % 12
            : 12;
        const firstHalfEndMinute =
          endHour < 12 || (endHour === 12 && endMinute === 0) ? endMinute : 0;

        const startTimeAngle = timeToAngle12Hour(
          firstHalfStartHour,
          startMinute
        );
        const endTimeAngle = timeToAngle12Hour(
          firstHalfEndHour,
          firstHalfEndMinute
        );

        if (startTimeAngle !== endTimeAngle) {
          firstHalfData.push({
            ...session,
            startAngle: startTimeAngle,
            endAngle: endTimeAngle,
          });
        } else if (
          startTimeAngle === endTimeAngle &&
          startHour < 12 &&
          endHour >= 12
        ) {
          // جلسه از نیمه اول شروع شده و در نیمه دوم تمام میشود
          const startTimeAngleFirstHalf = timeToAngle12Hour(
            firstHalfStartHour,
            startMinute
          );
          const endTimeAngleFirstHalf = timeToAngle12Hour(12, 0);
          firstHalfData.push({
            ...session,
            startAngle: startTimeAngleFirstHalf,
            endAngle: endTimeAngleFirstHalf,
          });
        }
      }

      // پردازش برای نیمه دوم (12:00 - 24:00)
      if (endHour >= 12) {
        const secondHalfStartHour = startHour >= 12 ? startHour % 12 : 0;
        const secondHalfStartMinute = startHour >= 12 ? startMinute : 0;
        const secondHalfEndHour = endHour % 12;

        const startTimeAngle = timeToAngle12Hour(
          secondHalfStartHour,
          secondHalfStartMinute
        );
        const endTimeAngle = timeToAngle12Hour(secondHalfEndHour, endMinute);

        if (startTimeAngle !== endTimeAngle) {
          secondHalfData.push({
            ...session,
            startAngle: startTimeAngle,
            endAngle: endTimeAngle,
          });
        } else if (
          startTimeAngle === endTimeAngle &&
          startHour < 12 &&
          endHour >= 12
        ) {
          // جلسه از نیمه اول شروع شده و در نیمه دوم تمام میشود
          const startTimeAngleSecondHalf = timeToAngle12Hour(0, 0);
          const endTimeAngleSecondHalf = timeToAngle12Hour(
            secondHalfEndHour,
            endMinute
          );
          secondHalfData.push({
            ...session,
            startAngle: startTimeAngleSecondHalf,
            endAngle: endTimeAngleSecondHalf,
          });
        }
      }
    });

    setFirstHalfSessions(firstHalfData);
    setSecondHalfSessions(secondHalfData);
  }, []);

  const hourTicks24 = Array.from({ length: 24 }, (_, i) => i);
  const hourTicks12 = Array.from({ length: 12 }, (_, i) => i);
  const tickRadius24 = chartRadius + 40;
  const tickRadius12 = chartRadius + 20;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">نمودار فعالیت‌های ۲۴ ساعته</h1>
      <svg width={300} height={300}>
        <circle cx={150} cy={150} r={chartRadius + 20} fill="#f0f0f0" />
        {transformedSessions.map((session, index) => {
          if (session.endAngle > session.startAngle) {
            return (
              <path
                key={`segment-${index}`}
                d={describeArc(
                  150,
                  150,
                  chartRadius + 20,
                  session.startAngle,
                  session.endAngle
                )}
                fill={session.color}
              />
            );
          } else {
            const arc1EndAngle = 2 * Math.PI;
            const arc2StartAngle = 0;

            const arc1 = describeArc(
              150,
              150,
              chartRadius + 20,
              session.startAngle,
              arc1EndAngle
            );
            const arc2 = describeArc(
              150,
              150,
              chartRadius + 20,
              arc2StartAngle,
              session.endAngle
            );

            return (
              <g key={`segment-${index}`}>
                <path d={arc1} fill={session.color} />
                <path d={arc2} fill={session.color} />
              </g>
            );
          }
        })}
        {hourTicks24.map((hour) => {
          const angle = (hour / 24) * 2 * Math.PI;
          const x = 150 + tickRadius24 * Math.cos(angle - Math.PI / 2);
          const y = 150 + tickRadius24 * Math.sin(angle - Math.PI / 2);
          return (
            <text
              key={`hour-${hour}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="10"
            >
              {hour}
            </text>
          );
        })}
      </svg>

      {transformedSessions.length === 0 && <p>اطلاعات جلسه موجود نیست.</p>}
      {transformedSessions.length > 0 && (
        <ul className="mt-4">
          {transformedSessions.map((session, index) => (
            <li key={index} className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: session.color }}
              ></div>
              <span>{session.name}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-around flex-col mt-8">
        {/* نمودار 12 ساعته اول */}
        <div>
          <h2 className="text-lg font-bold mb-2">00:00 - 12:00</h2>
          <svg width={300} height={300}>
            <circle cx={150} cy={150} r={chartRadius} fill="#f0f0f0" />
            {firstHalfSessions.map((session, index) => {
              if (session.endAngle > session.startAngle) {
                return (
                  <path
                    key={`segment-1-${index}`}
                    d={describeArc(
                      150,
                      150,
                      chartRadius,
                      session.startAngle,
                      session.endAngle
                    )}
                    fill={session.color}
                  />
                );
              } else {
                const arc1EndAngle = 2 * Math.PI;
                const arc2StartAngle = 0;

                const arc1 = describeArc(
                  150,
                  150,
                  chartRadius,
                  session.startAngle,
                  arc1EndAngle
                );
                const arc2 = describeArc(
                  150,
                  150,
                  chartRadius,
                  arc2StartAngle,
                  session.endAngle
                );

                return (
                  <g key={`segment-1-${index}`}>
                    <path d={arc1} fill={session.color} />
                    <path d={arc2} fill={session.color} />
                  </g>
                );
              }
            })}
            {hourTicks12.map((hour) => {
              const angle = (hour / 12) * 2 * Math.PI;
              const x = 150 + tickRadius12 * Math.cos(angle - Math.PI / 2);
              const y = 150 + tickRadius12 * Math.sin(angle - Math.PI / 2);
              const displayHour = hour === 0 ? 12 : hour;
              return (
                <text
                  key={`hour-1-${hour}`}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="10"
                >
                  {displayHour}
                </text>
              );
            })}
          </svg>
        </div>

        {transformedSessions.length === 0 && <p>اطلاعات جلسه موجود نیست.</p>}
        {transformedSessions.length > 0 && (
          <ul className="mt-4">
            {transformedSessions.map((session, index) => (
              <li key={index} className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: session.color }}
                ></div>
                <span>{session.name}</span>
              </li>
            ))}
          </ul>
        )}

        {/* نمودار 12 ساعته دوم */}
        <div>
          <h2 className="text-lg font-bold mb-2">12:00 - 24:00</h2>
          <svg width={300} height={300}>
            <circle cx={150} cy={150} r={chartRadius} fill="#f0f0f0" />
            {secondHalfSessions.map((session, index) => {
              if (session.endAngle > session.startAngle) {
                return (
                  <path
                    key={`segment-2-${index}`}
                    d={describeArc(
                      150,
                      150,
                      chartRadius,
                      session.startAngle,
                      session.endAngle
                    )}
                    fill={session.color}
                  />
                );
              } else {
                const arc1EndAngle = 2 * Math.PI;
                const arc2StartAngle = 0;

                const arc1 = describeArc(
                  150,
                  150,
                  chartRadius,
                  session.startAngle,
                  arc1EndAngle
                );
                const arc2 = describeArc(
                  150,
                  150,
                  chartRadius,
                  arc2StartAngle,
                  session.endAngle
                );

                return (
                  <g key={`segment-2-${index}`}>
                    <path d={arc1} fill={session.color} />
                    <path d={arc2} fill={session.color} />
                  </g>
                );
              }
            })}
            {hourTicks12.map((hour) => {
              const angle = (hour / 12) * 2 * Math.PI;
              const x = 150 + tickRadius12 * Math.cos(angle - Math.PI / 2);
              const y = 150 + tickRadius12 * Math.sin(angle - Math.PI / 2);
              const displayHour = hour === 0 ? 12 : hour;
              return (
                <text
                  key={`hour-2-${hour}`}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="10"
                >
                  {displayHour}
                </text>
              );
            })}
          </svg>
        </div>
      </div>

      {transformedSessions.length === 0 && <p>اطلاعات جلسه موجود نیست.</p>}
      {transformedSessions.length > 0 && (
        <ul className="mt-4">
          {transformedSessions.map((session, index) => (
            <li key={index} className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: session.color }}
              ></div>
              <span>{session.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ChartPage;
