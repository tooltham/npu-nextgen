"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type FunnelData = {
  step: string;
  count: number;
};

export default function DropoffFunnelChart({ data }: { data: FunnelData[] }) {
  // Use a gradient of colors for the funnel
  const colors = ["#3B82F6", "#06B6D4", "#10B981", "#8B5CF6"];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200/50 p-6 flex flex-col h-[400px]">
      <div className="mb-2">
        <h3 className="text-lg font-bold text-zinc-900">
          อัตราการเรียนตกหล่น (Drop-off Funnel)
        </h3>
        <p className="text-sm text-zinc-500 font-medium">
          จำนวนผู้เรียนที่ไปถึงแต่ละช่วงของหลักสูตร
        </p>
      </div>

      <div className="flex-1 w-full min-h-0 pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 30, left: 60, bottom: 0 }}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="step"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#52525B", fontSize: 12, fontWeight: 600 }}
              width={160}
            />
            <Tooltip
              cursor={{ fill: "rgba(244, 244, 245, 0.5)" }}
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                fontWeight: 600,
                color: "#18181B",
              }}
              formatter={(value: any) => [`${value} คน`, "จำนวนผู้เรียน"]}
            />
            <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={32}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
