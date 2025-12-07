import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ProgressBarProps {
  percentage: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
  const data = [
    { name: 'Completed', value: percentage },
    { name: 'Remaining', value: 100 - percentage },
  ];

  const COLORS = ['#14b8a6', '#e2e8f0']; // Teal-500, Slate-200

  return (
    <div className="h-24 w-24 relative flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={32}
            outerRadius={42}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {/* Center content is handled by parent or overlay, but recharts doesn't easily support center text. We overlay it. */}
    </div>
  );
};

export default ProgressBar;
