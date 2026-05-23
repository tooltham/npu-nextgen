"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type ChartData = {
  name: string;
  value: number;
  fill: string;
};

export default function DemographicsCharts({
  digitalSkillsData,
  agriExperienceData,
}: {
  digitalSkillsData: ChartData[];
  agriExperienceData: ChartData[];
}) {
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    if (percent < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight={700}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Digital Skills Donut */}
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200/50 p-6 flex flex-col h-[400px]">
        <div className="mb-2">
          <h3 className="text-lg font-bold text-zinc-900">ระดับทักษะดิจิทัล</h3>
          <p className="text-sm text-zinc-500 font-medium">
            สัดส่วนผู้สมัครตามพื้นฐานไอที
          </p>
        </div>
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={digitalSkillsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={110}
                innerRadius={60}
                dataKey="value"
                paddingAngle={2}
              >
                {digitalSkillsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
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
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Agri Experience Pie */}
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200/50 p-6 flex flex-col h-[400px]">
        <div className="mb-2">
          <h3 className="text-lg font-bold text-zinc-900">
            ประสบการณ์ด้านการเกษตร
          </h3>
          <p className="text-sm text-zinc-500 font-medium">
            สัดส่วนผู้สมัครที่เคยมี vs ไม่มีประสบการณ์
          </p>
        </div>
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={agriExperienceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={110}
                dataKey="value"
                paddingAngle={2}
              >
                {agriExperienceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
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
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
