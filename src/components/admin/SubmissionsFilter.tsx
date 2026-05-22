"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";

export default function SubmissionsFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const currentFilter = searchParams.get("filter") || "all";

  // Create a query string with updated params
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      // Reset page to 1 when search or filter changes
      params.set("page", "1");
      return params.toString();
    },
    [searchParams],
  );

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== (searchParams.get("search") || "")) {
        router.push(`${pathname}?${createQueryString("search", searchTerm)}`);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, pathname, router, createQueryString, searchParams]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
      {/* Search Input */}
      <div className="relative flex-1 sm:w-64">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow placeholder:text-gray-400 font-noto-thai"
          placeholder="ค้นหาชื่อ หรือ อีเมล..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Status Filter */}
      <div className="relative sm:w-48">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
          <Filter className="w-4 h-4" />
        </div>
        <select
          className="w-full pl-10 pr-8 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none font-noto-thai cursor-pointer"
          value={currentFilter}
          onChange={(e) => {
            router.push(`${pathname}?${createQueryString("filter", e.target.value)}`);
          }}
        >
          <option value="all">นักศึกษาทั้งหมด</option>
          <option value="pending">เฉพาะที่มีงานรอตรวจ</option>
          <option value="graded">ตรวจครบแล้ว</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
    </div>
  );
}
