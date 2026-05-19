"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, CheckCircle, AlertCircle } from "lucide-react";

function useCountUp(target: number, duration: number = 1200) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) return;

    let start = 0;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * target);
      setCount(start);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration]);

  return count;
}

const accentColors: Record<string, string> = {
  "text-blue-600": "bg-blue-500",
  "text-yellow-600": "bg-yellow-500",
  "text-green-600": "bg-green-600",
  "text-red-600": "bg-red-500",
};

export function StatsCards({ stats }: { stats: any }) {
  const cards = [
    {
      title: "ผู้สมัครทั้งหมด",
      value: stats.total || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "รอดำเนินการ",
      value: stats.pending || 0,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "ผ่านการคัดเลือก",
      value: stats.accepted || 0,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "ไม่ผ่าน",
      value: stats.rejected || 0,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((stat, i) => {
        const animatedValue = useCountUp(stat.value);
        const accent = accentColors[stat.color] || "bg-gray-400";

        return (
          <Card
            key={i}
            className="shadow-sm border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative"
          >
            {/* Left Accent Strip */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${accent}`} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pl-5">
              <CardTitle className="text-sm font-medium text-gray-500 font-noto-thai">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent className="pl-5">
              <div className="text-3xl font-bold font-noto-thai tabular-nums">
                {animatedValue}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
