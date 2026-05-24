"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sprout,
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardList,
  FileText,
  LineChart,
} from "lucide-react";

const navLinks = [
  { name: "แดชบอร์ดข้อมูล", href: "/admin", icon: LayoutDashboard },
  {
    name: "วิเคราะห์การเรียน",
    href: "/admin/learning-analytics",
    icon: LineChart,
  },
  { name: "รายการใบสมัคร", href: "/admin/applications", icon: FileText },
  { name: "จัดการผู้เรียน", href: "/admin/users", icon: Users },
  {
    name: "ระบบตรวจงาน",
    href: "/admin/submissions",
    icon: ClipboardList,
  },
  { name: "จัดการหลักสูตร", href: "/admin/courses", icon: BookOpen },
];

export default function AdminSidebar({
  userRole = "ADMIN",
}: {
  userRole?: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#0c2a0e] border-r border-zinc-800 min-h-screen sticky top-0 font-noto-thai shrink-0">
      {/* Brand / Logo */}
      <div className="h-16 flex items-center px-6 border-b border-zinc-800 shrink-0">
        <Link href="/admin" className="flex items-center gap-3 group w-full">
          <div className="w-8 h-8 rounded-xl bg-[#1B5E20] flex items-center justify-center text-white shadow-md group-hover:bg-[#154a19] transition-colors shrink-0">
            <Sprout className="w-4 h-4" />
          </div>
          <span className="font-black text-lg tracking-tight text-white truncate">
            NPU NextGen Admin
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
        {navLinks
          .filter((link) => {
            if (userRole === "STAFF") {
              return [
                "/admin/users",
                "/admin/submissions",
                "/admin/courses",
              ].includes(link.href);
            }
            return true;
          })
          .map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? "bg-[#1B5E20] text-white shadow-md"
                    : "text-zinc-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="truncate">{link.name}</span>
              </Link>
            );
          })}
      </div>
    </aside>
  );
}
