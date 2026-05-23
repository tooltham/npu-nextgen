"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type ChartData = {
  moduleName: string;
  pass: number;
  fail: number;
  pending: number;
};

export default function CoursePerformanceChart({
  data,
}: {
  data: ChartData[];
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200/50 p-6 flex flex-col h-[400px]">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-zinc-900">
          ผลสัมฤทธิ์รายโมดูล (Performance)
        </h3>
        <p className="text-sm text-zinc-500 font-medium">
          สถิติการผ่านโครงงานในแต่ละโมดูล
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
              bottom: 25,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E4E4E7"
            />
            <XAxis
              dataKey="moduleName"
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
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                fontWeight: 600,
                color: "#18181B",
              }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
            <Bar
              dataKey="pass"
              name="ผ่าน"
              stackId="a"
              fill="#10B981"
              radius={[0, 0, 4, 4]}
            />
            <Bar dataKey="pending" name="รอตรวจ" stackId="a" fill="#F59E0B" />
            <Bar
              dataKey="fail"
              name="ไม่ผ่าน"
              stackId="a"
              fill="#EF4444"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
