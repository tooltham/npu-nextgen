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
} from "lucide-react";
import ForcePasswordModal from "./ForcePasswordModal";

export default function PortalNavbar({ user }: { user: any }) {
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
  const email = user?.email || "Student";
  const name = user?.name || email.split("@")[0];
  const initials = name.substring(0, 2).toUpperCase();

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-white/70 backdrop-blur-xl border-b border-zinc-200/50 shadow-sm transition-all font-noto-thai">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo / Brand */}
            <Link
              href="/portal"
              className="flex items-center gap-3 group shrink-0"
            >
              <div className="w-8 h-8 rounded-xl bg-[#1B5E20] flex items-center justify-center text-white shadow-md group-hover:bg-[#154a19] transition-colors">
                <Sprout className="w-4 h-4" />
              </div>
              <span className="font-black text-lg tracking-tight text-[#1B5E20] hidden sm:block">
                NPU NextGen
              </span>
            </Link>

            {/* Center Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              <Link
                href="/portal"
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                  pathname === "/portal"
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                <span className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  หน้าหลัก (Dashboard)
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
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-xs shadow-inner uppercase tracking-wider">
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
                      บัญชีผู้ใช้
                    </p>
                    <p className="text-sm font-bold text-zinc-900 truncate">
                      {name}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">{email}</p>
                  </div>

                  <Link
                    href="/portal"
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-zinc-600 hover:bg-zinc-50 hover:text-emerald-600 transition-colors md:hidden"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    หน้าหลัก (Dashboard)
                  </Link>

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
