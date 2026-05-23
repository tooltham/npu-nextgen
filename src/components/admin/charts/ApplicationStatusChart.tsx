"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type ChartData = {
  name: string;
  value: number;
  fill: string;
};

export default function ApplicationStatusChart({
  data,
}: {
  data: ChartData[];
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200/50 p-6 flex flex-col h-[400px]">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-zinc-900">
          สถานะผู้สมัครทั้งหมด
        </h3>
        <p className="text-sm text-zinc-500 font-medium">
          สถิติการรับสมัครแบ่งตามสถานะปัจจุบัน
        </p>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E4E4E7"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717A", fontSize: 13, fontWeight: 500 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717A", fontSize: 13, fontWeight: 500 }}
              dx={-10}
            />
            <Tooltip
              cursor={{ fill: "#F4F4F5" }}
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow:
                  "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                fontWeight: 600,
                color: "#18181B",
              }}
              itemStyle={{ color: "#52525B", fontWeight: 500 }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
