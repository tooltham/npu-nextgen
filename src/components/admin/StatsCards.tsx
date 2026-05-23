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
  "text-amber-600": "bg-amber-500",
};

interface StatsCardsProps {
  stats: {
    total?: number;
    pending?: number;
    accepted?: number;
    rejected?: number;
  };
  loading?: boolean;
}

function StatCardItem({
  stat,
  index,
}: {
  stat: {
    title: string;
    value: number;
    icon: React.ElementType;
    color: string;
    bgColor: string;
  };
  index: number;
}) {
  const animatedValue = useCountUp(stat.value);
  const accent = accentColors[stat.color] || "bg-gray-400";
  return (
    <Card
      key={index}
      className="rounded-2xl border-zinc-200/60 shadow-sm overflow-hidden hover:shadow-md hover:border-zinc-300 hover:-translate-y-1 transition-all duration-300 relative bg-white"
    >
      {/* Left Accent Strip */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${accent}`} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pl-5 pt-5">
        <CardTitle className="text-sm font-medium text-zinc-500 font-noto-thai">
          {stat.title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${stat.bgColor}`}>
          <stat.icon className={`h-4 w-4 ${stat.color}`} />
        </div>
      </CardHeader>
      <CardContent className="pl-5 pb-5">
        <div className="text-3xl font-extrabold text-zinc-900 font-noto-thai tabular-nums">
          {animatedValue}
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsCards({ stats, loading = false }: StatsCardsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card
            key={i}
            className="rounded-2xl animate-pulse shadow-sm border-zinc-200/60 relative overflow-hidden bg-white"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-zinc-200" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pl-5 pt-5">
              <div className="h-4 w-24 bg-zinc-200 rounded" />
              <div className="h-8 w-8 bg-zinc-200 rounded-lg" />
            </CardHeader>
            <CardContent className="pl-5 pb-5">
              <div className="h-8 w-16 bg-zinc-200 rounded mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "ใบสมัครทั้งหมด",
      value: stats.total || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "รอตรวจสอบ",
      value: stats.pending || 0,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
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
      {cards.map((stat, i) => (
        <StatCardItem key={i} stat={stat} index={i} />
      ))}
    </div>
  );
}
