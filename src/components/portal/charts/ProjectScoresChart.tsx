"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

type ScoreData = {
  module: string;
  score: number;
  threshold: number;
  fullMark: number;
};

export default function ProjectScoresChart({ data }: { data: ScoreData[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200/50 p-6 flex flex-col h-[400px]">
      <div className="mb-2">
        <h3 className="text-lg font-bold text-zinc-900">ผลสัมฤทธิ์รายโมดูล</h3>
        <p className="text-sm text-zinc-500 font-medium">
          เปรียบเทียบคะแนนโปรเจกต์กับเกณฑ์ผ่าน 70%
        </p>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#E4E4E7" />
            <PolarAngleAxis
              dataKey="module"
              tick={{ fill: "#52525B", fontSize: 12, fontWeight: 600 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "#A1A1AA", fontSize: 10 }}
            />
            <Radar
              name="คะแนนของคุณ (%)"
              dataKey="score"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.5}
            />
            <Radar
              name="เกณฑ์ผ่าน (70%)"
              dataKey="threshold"
              stroke="#EF4444"
              fill="transparent"
              strokeDasharray="5 5"
              strokeWidth={2}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                fontWeight: 600,
                color: "#18181B",
              }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
