"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ChartData = {
  date: string;
  activeLearners: number;
};

export default function EngagementChart({ data }: { data: ChartData[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200/50 p-6 flex flex-col h-[400px]">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-zinc-900">
          แนวโน้มการเข้าเรียน (Engagement)
        </h3>
        <p className="text-sm text-zinc-500 font-medium">
          จำนวนการทำแบบทดสอบและการส่งงานในแต่ละวัน (7 วันล่าสุด)
        </p>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E4E4E7"
            />
            <XAxis
              dataKey="date"
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
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow:
                  "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                fontWeight: 600,
                color: "#18181B",
              }}
              itemStyle={{ color: "#059669", fontWeight: 700 }}
            />
            <Area
              type="monotone"
              dataKey="activeLearners"
              name="กิจกรรม (ครั้ง)"
              stroke="#10B981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorActive)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
