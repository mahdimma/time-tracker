import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { getSessions } from "../utils/localStorage";

function ChartPage() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const sessions = getSessions();
    const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);
    let data = sessions.map((s) => ({
      name: s.name,
      value: s.duration,
      color: s.color,
    }));
    // Add an "Idle" slice if total recorded duration is less than 24 hours (1440 minutes)
    if (totalDuration < 1440) {
      data.push({
        name: "Idle",
        value: 1440 - totalDuration,
        color: "#d3d3d3",
      });
    }
    setChartData(data);
  }, []);

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">24-Hour Session Pie Chart</h1>
      {chartData.length > 0 ? (
        <PieChart width={400} height={400}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      ) : (
        <p>No session data available.</p>
      )}
    </div>
  );
}

export default ChartPage;
