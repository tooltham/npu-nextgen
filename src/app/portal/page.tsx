"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Trophy,
  PlayCircle,
  Loader2,
  Award,
  ArrowRight,
  Sparkles,
  Library,
  LayoutGrid,
  Target,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardData {
  userName: string;
  totalModules: number;
  totalLessons: number;
  completedCount: number;
  progressPercentage: number;
  nextLesson: {
    id: string;
    moduleId: string;
    title: string;
    moduleTitle: string;
    type: string;
  } | null;
  modules: {
    id: string;
    title: string;
    description: string | null;
    order: number;
    lessonCount: number;
    isLocked: boolean;
    isCompleted: boolean;
  }[];
}

export default function PortalDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portal/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-zinc-50 p-6 lg:p-10 font-noto-thai">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Welcome Banner (Hero) */}
        <div className="relative overflow-hidden bg-zinc-900 rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-emerald-900/10 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Decorative Gradients */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500 rounded-full mix-blend-screen filter blur-[80px] opacity-40"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-teal-500 rounded-full mix-blend-screen filter blur-[80px] opacity-30"></div>

          <div className="relative z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6">
              <Sparkles className="h-4 w-4 text-emerald-300" />
              <span className="text-xs font-bold text-emerald-50 uppercase tracking-wider">
                Student Portal
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight leading-snug">
              ยินดีต้อนรับกลับมา,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                {data.userName.split("@")[0]}
              </span>{" "}
              👋
            </h1>
            <p className="text-zinc-300 text-sm md:text-base font-medium max-w-xl leading-relaxed">
              พร้อมที่จะเรียนรู้หรือยัง? ไปทำความฝันเรื่อง Smart Farm
              ให้เป็นจริงกันเถอะ! ระบบได้บันทึกความคืบหน้าของคุณไว้เรียบร้อยแล้ว
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center p-1 shadow-2xl transform hover:scale-105 transition-transform duration-500">
              <div className="w-full h-full bg-zinc-900 rounded-full flex items-center justify-center border-4 border-zinc-900/50">
                <Trophy className="h-12 w-12 text-emerald-400 drop-shadow-lg" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Progress Card (Spans 2 columns) */}
          <div className="md:col-span-2 bg-white rounded-3xl p-8 shadow-xl shadow-zinc-200/20 border border-zinc-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-extrabold text-zinc-900 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100 shadow-sm">
                    <Award className="h-5 w-5 text-amber-500" />
                  </div>
                  ความคืบหน้าการเรียนของคุณ
                </h2>
                <div className="text-right">
                  <span className="block text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 drop-shadow-sm">
                    {data.progressPercentage}%
                  </span>
                </div>
              </div>

              <div className="w-full bg-zinc-100 rounded-full h-5 mb-3 overflow-hidden border border-zinc-200/50 shadow-inner">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                  style={{ width: `${data.progressPercentage}%` }}
                >
                  <div className="absolute top-0 left-0 bottom-0 right-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PC9yZWN0Pgo8cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMiIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+Cjwvc3ZnPg==')] opacity-30"></div>
                </div>
              </div>
              <p className="text-sm text-zinc-500 font-bold tracking-wide text-right mb-10">
                เรียนจบแล้ว{" "}
                <span className="text-zinc-900">{data.completedCount}</span> จาก{" "}
                <span className="text-zinc-900">{data.totalLessons}</span>{" "}
                บทเรียน
              </p>
            </div>

            {data.isCourseCompleted ? (
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100 text-center shadow-sm flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md border border-emerald-200 text-3xl mb-2">
                  🎓
                </div>
                <h3 className="font-extrabold text-emerald-900 text-xl">
                  ขอแสดงความยินดี! คุณเรียนจบหลักสูตรแล้ว
                </h3>
                <p className="text-sm text-emerald-700 font-medium mb-2">
                  โครงงานของคุณผ่านการประเมินครบทุกชิ้นแล้ว
                  สามารถขอรับใบประกาศนียบัตรได้
                </p>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-emerald-600/20 rounded-xl px-8 py-6 font-bold transition-all hover:-translate-y-0.5">
                  ดาวน์โหลดใบประกาศนียบัตร
                </Button>
              </div>
            ) : data.nextLesson ? (
              <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-emerald-50 transition-colors group">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-emerald-100 shrink-0">
                    <Target className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-emerald-600 mb-1 uppercase tracking-wider">
                      บทเรียนถัดไปที่แนะนำ
                    </p>
                    <p className="font-extrabold text-zinc-900 text-lg leading-tight mb-1">
                      {data.nextLesson.title}
                    </p>
                    <p className="text-sm text-zinc-500 font-medium line-clamp-1 flex items-center gap-1.5">
                      <Library className="w-3.5 h-3.5" />{" "}
                      {data.nextLesson.moduleTitle}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/portal/classroom/${data.nextLesson.moduleId}`}
                  className="w-full sm:w-auto shrink-0"
                >
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-emerald-600/20 rounded-xl px-6 py-6 font-bold transition-all hover:-translate-y-0.5 group-hover:scale-105">
                    <PlayCircle className="mr-2 h-5 w-5" />
                    เรียนต่อเลย
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 text-center shadow-sm flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-amber-200 text-2xl">
                  ⏳
                </div>
                <h3 className="font-extrabold text-amber-900 text-lg">
                  รอผลการประเมินโครงงาน
                </h3>
                <p className="text-sm text-amber-700 font-medium max-w-sm">
                  คุณได้เรียนจบทุกบทเรียนแล้ว แต่ยังมีโครงงานบางชิ้นที่ "รอตรวจ"
                  หรือ "ไม่ผ่านเกณฑ์" กรุณาตรวจสอบสถานะในแต่ละโมดูล
                </p>
              </div>
            )}
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-zinc-200/20 border border-zinc-100 flex flex-col justify-between group">
            <div>
              <h2 className="text-xl font-extrabold text-zinc-900 mb-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-sm">
                  <LayoutGrid className="h-5 w-5 text-indigo-600" />
                </div>
                ข้อมูลหลักสูตร
              </h2>

              <div className="space-y-4">
                <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 flex justify-between items-center transition-colors group-hover:bg-zinc-100/50">
                  <div className="flex items-center gap-2 text-zinc-600 font-bold">
                    <Library className="w-4 h-4" />
                    จำนวนโมดูลทั้งหมด
                  </div>
                  <span className="font-black text-zinc-900 text-xl">
                    {data.totalModules}
                  </span>
                </div>
                <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 flex justify-between items-center transition-colors group-hover:bg-zinc-100/50">
                  <div className="flex items-center gap-2 text-zinc-600 font-bold">
                    <BookOpen className="w-4 h-4" />
                    จำนวนบทเรียนทั้งหมด
                  </div>
                  <span className="font-black text-zinc-900 text-xl">
                    {data.totalLessons}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modules List Section */}
        <div>
          <h2 className="text-2xl font-black text-zinc-900 mb-6 flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-emerald-600" />
            โมดูลการเรียนรู้ (Course Modules)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.modules.map((module) => (
              <div
                key={module.id}
                className={`relative overflow-hidden rounded-3xl border transition-all duration-300 flex flex-col h-full
                  ${
                    module.isLocked
                      ? "bg-zinc-50 border-zinc-200 opacity-80 grayscale-[0.5]"
                      : "bg-white border-zinc-100 shadow-xl shadow-zinc-200/20 hover:-translate-y-1 hover:shadow-emerald-900/5"
                  }
                `}
              >
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-zinc-400 tracking-wider mb-1">
                        MODULE {module.order}
                      </span>
                      <h3
                        className={`text-lg font-extrabold line-clamp-2 ${
                          module.isLocked ? "text-zinc-500" : "text-zinc-900"
                        }`}
                      >
                        {module.title}
                      </h3>
                    </div>
                    {module.isLocked ? (
                      <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
                        <Lock className="w-5 h-5 text-zinc-400" />
                      </div>
                    ) : module.isCompleted ? (
                      <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                        <PlayCircle className="w-5 h-5 text-amber-500" />
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-zinc-500 font-medium mb-6 line-clamp-2">
                    {module.description || "ไม่มีคำอธิบาย"}
                  </p>

                  <div className="mt-auto pt-4 border-t border-zinc-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-500">
                      {module.lessonCount} บทเรียน
                    </span>
                    
                    {module.isLocked ? (
                      <Button variant="outline" size="sm" disabled className="rounded-xl px-4 text-xs font-bold bg-zinc-100 border-transparent text-zinc-400">
                        ล็อค
                      </Button>
                    ) : (
                      <Link href={`/portal/classroom/${module.id}`}>
                        <Button
                          variant={module.isCompleted ? "outline" : "default"}
                          size="sm"
                          className={`rounded-xl px-4 text-xs font-bold gap-1.5 transition-colors
                            ${
                              module.isCompleted 
                                ? "text-emerald-600 border-emerald-200 hover:bg-emerald-50" 
                                : "bg-emerald-600 text-white hover:bg-emerald-700"
                            }
                          `}
                        >
                          {module.isCompleted ? "ทบทวนซ้ำ" : "เข้าเรียน"}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
