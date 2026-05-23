"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";

type QuizData = {
  module: string;
  accuracy: number; // 0-100
};

export default function QuizAccuracyChart({ data }: { data: QuizData[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200/50 p-6 flex flex-col h-[400px]">
      <div className="mb-2">
        <h3 className="text-lg font-bold text-zinc-900">
          ความแม่นยำแบบทดสอบ (Quiz Accuracy)
        </h3>
        <p className="text-sm text-zinc-500 font-medium">
          สัดส่วนการตอบถูกในแบบทดสอบย่อยของแต่ละโมดูล
        </p>
      </div>

      <div className="flex-1 w-full min-h-0 pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 10, left: -20, bottom: 25 }}
          >
            <XAxis
              dataKey="module"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#52525B", fontSize: 12, fontWeight: 600 }}
              dy={10}
            />
            <YAxis
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#A1A1AA", fontSize: 10 }}
              tickFormatter={(value) => `${value}%`}
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
              formatter={(value: any) => [`${value}%`, "ความแม่นยำ"]}
            />
            <ReferenceLine y={50} stroke="#E4E4E7" strokeDasharray="3 3" />
            <Bar dataKey="accuracy" radius={[8, 8, 0, 0]} maxBarSize={50}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.accuracy >= 70
                      ? "#10B981"
                      : entry.accuracy >= 50
                        ? "#F59E0B"
                        : "#EF4444"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
