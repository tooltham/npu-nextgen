import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, CheckCircle, AlertCircle } from "lucide-react";

export function StatsCards({ stats }: { stats: any }) {
  const cards = [
    {
      title: "ผู้สมัครทั้งหมด",
      value: stats.total || 0,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "รอดำเนินการ",
      value: stats.pending || 0,
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "ผ่านการคัดเลือก",
      value: stats.accepted || 0,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "ไม่ผ่าน",
      value: stats.rejected || 0,
      icon: AlertCircle,
      color: "text-red-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((stat, i) => (
        <Card key={i} className="shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 font-noto-thai">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-noto-thai">
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
