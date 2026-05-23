"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Sprout,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  KeyRound,
  Users,
  BookOpen,
  ClipboardList,
  FileText,
  LineChart,
} from "lucide-react";
import ForcePasswordModal from "@/components/portal/ForcePasswordModal";

export default function AdminNavbar({ user }: { user: any }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format initials
  const email = user?.email || "Admin";
  const name = user?.name || email.split("@")[0];
  const initials = name.substring(0, 2).toUpperCase();

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

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-white/70 backdrop-blur-xl border-b border-zinc-200/50 shadow-sm transition-all font-noto-thai">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo / Brand (Mobile Only) */}
            <div className="flex items-center">
              <Link
                href="/admin"
                className="flex items-center gap-3 group shrink-0 md:hidden"
              >
                <div className="w-8 h-8 rounded-xl bg-[#1B5E20] flex items-center justify-center text-white shadow-md group-hover:bg-[#154a19] transition-colors">
                  <Sprout className="w-4 h-4" />
                </div>
                <span className="font-black text-lg tracking-tight text-[#1B5E20]">
                  NPU Admin
                </span>
              </Link>
            </div>

            {/* User Menu */}
            <div
              className="flex items-center relative shrink-0"
              ref={dropdownRef}
            >
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-4 rounded-full hover:bg-zinc-100 transition-colors border border-transparent hover:border-zinc-200"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs shadow-inner uppercase tracking-wider">
                  {initials}
                </div>
                <span className="text-sm font-bold text-zinc-700 max-w-[150px] truncate hidden sm:block">
                  {name}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl shadow-zinc-200/50 border border-zinc-100 py-2 animate-in fade-in slide-in-from-top-2 origin-top-right">
                  <div className="px-4 py-3 border-b border-zinc-100 mb-2">
                    <p className="text-xs font-black text-zinc-400 uppercase tracking-wider mb-1">
                      ผู้ดูแลระบบ
                    </p>
                    <p className="text-sm font-bold text-zinc-900 truncate">
                      {name}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">{email}</p>
                  </div>

                  {/* Mobile Links */}
                  <div className="md:hidden border-b border-zinc-100 mb-2 pb-2">
                    {navLinks.map((link) => {
                      const isActive = pathname === link.href;
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsDropdownOpen(false)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold transition-colors ${
                            isActive
                              ? "text-emerald-600 bg-emerald-50/50"
                              : "text-zinc-600 hover:bg-zinc-50 hover:text-emerald-600"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {link.name}
                        </Link>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setShowPasswordModal(true);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-zinc-600 hover:bg-zinc-50 hover:text-emerald-600 transition-colors"
                  >
                    <KeyRound className="w-4 h-4" />
                    เปลี่ยนรหัสผ่าน
                  </button>

                  <button
                    onClick={() => signOut({ callbackUrl: "/admin/login" })}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    ออกจากระบบ
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {showPasswordModal && (
        <ForcePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </>
  );
}
