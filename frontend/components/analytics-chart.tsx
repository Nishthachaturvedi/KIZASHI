'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface AnalyticsChartProps {
  title: string;
  data: {
    name: string;
    score: number;
  }[];
}

export function AnalyticsChart({
  title,
  data,
}: AnalyticsChartProps) {

  return (
    <div className="bg-[#1a1333] border border-[#312e81] rounded-3xl p-6 shadow-[0_0_30px_rgba(139,92,246,0.25)]">

      <h2 className="text-2xl font-bold text-white mb-8">
        {title}
      </h2>

      <div className="w-full h-[400px]">

        <ResponsiveContainer width="100%" height="100%">

          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 20,
              left: 0,
              bottom: 5,
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#312e81"
            />

            <XAxis
              dataKey="name"
              stroke="#c4b5fd"
              tick={{ fill: '#c4b5fd' }}
            />

            <YAxis
              stroke="#c4b5fd"
              tick={{ fill: '#c4b5fd' }}
            />

            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.08)' }}
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid #8b5cf6',
                borderRadius: '12px',
                color: '#fff',
              }}
            />

            <Bar
              dataKey="score"
              fill="#8b5cf6"
              radius={[12, 12, 0, 0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}