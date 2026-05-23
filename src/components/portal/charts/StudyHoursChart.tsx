"use client";

import { CheckCircle2 } from "lucide-react";

type HoursData = {
  theoryCompleted: number;
  theoryTotal: number;
  practicalCompleted: number;
  practicalTotal: number;
};

export default function StudyHoursChart({ data }: { data: HoursData }) {
  const theoryPercent = Math.min(
    100,
    Math.round((data.theoryCompleted / (data.theoryTotal || 1)) * 100),
  );
  const practicalPercent = Math.min(
    100,
    Math.round((data.practicalCompleted / (data.practicalTotal || 1)) * 100),
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200/50 p-6 flex flex-col h-[400px]">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-zinc-900">ชั่วโมงเรียนสะสม</h3>
        <p className="text-sm text-zinc-500 font-medium">
          เป้าหมายทฤษฎี {data.theoryTotal} ชม. / ปฏิบัติ {data.practicalTotal}{" "}
          ชม.
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-8">
        {/* Theory Bar */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <div>
              <span className="text-sm font-black text-indigo-600 uppercase tracking-wider block mb-1">
                ภาคทฤษฎี
              </span>
              <span className="text-2xl font-black text-zinc-900">
                {data.theoryCompleted}
                <span className="text-lg text-zinc-400 font-bold">
                  /{data.theoryTotal} ชม.
                </span>
              </span>
            </div>
            {theoryPercent >= 100 && (
              <CheckCircle2 className="w-6 h-6 text-emerald-500 mb-1" />
            )}
          </div>
          <div className="w-full bg-zinc-100 rounded-full h-4 overflow-hidden border border-zinc-200/50 shadow-inner">
            <div
              className="bg-gradient-to-r from-indigo-500 to-blue-400 h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${theoryPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Practical Bar */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <div>
              <span className="text-sm font-black text-emerald-600 uppercase tracking-wider block mb-1">
                ภาคปฏิบัติ
              </span>
              <span className="text-2xl font-black text-zinc-900">
                {data.practicalCompleted}
                <span className="text-lg text-zinc-400 font-bold">
                  /{data.practicalTotal} ชม.
                </span>
              </span>
            </div>
            {practicalPercent >= 100 && (
              <CheckCircle2 className="w-6 h-6 text-emerald-500 mb-1" />
            )}
          </div>
          <div className="w-full bg-zinc-100 rounded-full h-4 overflow-hidden border border-zinc-200/50 shadow-inner">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${practicalPercent}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
