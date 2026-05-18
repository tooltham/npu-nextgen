import { cn } from "@/lib/utils";

export type ApplicationStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "REVIEWED"
  | "WAITLISTED";

const statusConfig = {
  PENDING: {
    label: "รอดำเนินการ",
    class: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  REVIEWED: {
    label: "กำลังพิจารณา",
    class: "bg-blue-50 text-blue-700 border-blue-200",
  },
  ACCEPTED: {
    label: "ผ่านการคัดเลือก",
    class: "bg-green-50 text-green-700 border-green-200",
  },
  REJECTED: {
    label: "ไม่ผ่าน",
    class: "bg-red-50 text-red-700 border-red-200",
  },
  WAITLISTED: {
    label: "ตัวสำรอง",
    class: "bg-purple-50 text-purple-700 border-purple-200",
  },
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border font-noto-thai",
        config.class,
      )}
    >
      {config.label}
    </span>
  );
}
