"use client";

import { useState } from "react";
import {
  PlayCircle,
  FileText,
  CheckCircle2,
  Lock,
  Play,
  Circle,
  Download,
} from "lucide-react";
import QuizWidget from "./QuizWidget";
import AssignmentWidget from "./AssignmentWidget";

interface Quiz {
  id: string;
  lessonId: string;
  question: string;
  options: string[];
  correctIdx: number;
}

interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  videoUrl: string | null;
  documentUrl: string | null;
  order: number;
  quizzes: Quiz[];
}

interface CourseModule {
  id: string;
  title: string;
  description: string | null;
  order: number;
  lessons: Lesson[];
}

interface LessonProgress {
  lessonId: string;
  isCompleted: boolean;
}

interface QuizAttempt {
  quizId: string;
  selectedIdx: number;
  isCorrect: boolean;
}

interface Submission {
  id: string;
  moduleId: string;
  assignmentUrl: string;
  note: string | null;
  score: number | null;
  feedback: string | null;
  status: "PENDING" | "PASS" | "FAIL";
}

interface ClassroomClientProps {
  modules: CourseModule[];
  initialProgress: LessonProgress[];
  initialQuizAttempts: QuizAttempt[];
  initialSubmissions: Submission[];
}

export default function ClassroomClient({
  modules,
  initialProgress,
  initialQuizAttempts,
  initialSubmissions,
}: ClassroomClientProps) {
  // Finding first lesson to set as active
  const firstLesson = modules[0]?.lessons[0] || null;

  const [activeLesson, setActiveLesson] = useState<Lesson | null>(firstLesson);
  const [progressList, setProgressList] =
    useState<LessonProgress[]>(initialProgress);
  const [quizAttempts, setQuizAttempts] =
    useState<QuizAttempt[]>(initialQuizAttempts);
  const [submissions, setSubmissions] =
    useState<Submission[]>(initialSubmissions);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);

  const isLessonCompleted = (lessonId: string) => {
    return progressList.some((p) => p.lessonId === lessonId && p.isCompleted);
  };

  // --- Sequential Content Locking Logic ---
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const isQuizPassed = (quizId: string) => {
    return quizAttempts.some((a) => a.quizId === quizId && a.isCorrect);
  };

  const isLessonFullyCompleted = (lesson: Lesson) => {
    if (!isLessonCompleted(lesson.id)) return false; // video not marked as done
    if (lesson.quizzes && lesson.quizzes.length > 0) {
      const allPassed = lesson.quizzes.every((q: Quiz) => isQuizPassed(q.id));
      if (!allPassed) return false;
    }
    return true;
  };

  const isModuleFullyCompleted = (module: CourseModule) => {
    const allLessonsDone = module.lessons.every((l: Lesson) =>
      isLessonFullyCompleted(l),
    );
    if (!allLessonsDone) return false;
    const submission = submissions.find((s) => s.moduleId === module.id);
    if (!submission) return false;
    return true;
  };

  const isLessonUnlocked = (mIndex: number, lIndex: number) => {
    if (mIndex === 0 && lIndex === 0) return true; // first lesson always unlocked

    if (lIndex > 0) {
      // Must complete previous lesson in the same module
      const prevLesson = modules[mIndex].lessons[lIndex - 1];
      return isLessonFullyCompleted(prevLesson);
    } else {
      // Must complete previous module (all lessons + assignment)
      const prevModule = modules[mIndex - 1];
      return isModuleFullyCompleted(prevModule);
    }
  };

  const handleMarkAsCompleted = async (lessonId: string) => {
    setIsUpdatingProgress(true);
    try {
      const response = await fetch("/api/portal/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, isCompleted: true }),
      });

      const res = await response.json();
      if (response.ok && res.success) {
        setProgressList((prev) => {
          const filtered = prev.filter((p) => p.lessonId !== lessonId);
          return [...filtered, { lessonId, isCompleted: true }];
        });
      }
    } catch (error) {
      console.error("Failed to mark as completed:", error);
    } finally {
      setIsUpdatingProgress(false);
    }
  };

  const getYoutubeEmbedUrl = (url: string | null) => {
    if (!url) return "";
    // If it's already an embed URL, return as is
    if (url.includes("youtube.com/embed/")) return url;
    // Extract video ID from standard YouTube URL
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : url;
  };

  return (
    <>
      {/* Simple Toast Notification */}
      {toastMsg && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-rose-600 text-white px-6 py-3 rounded-full shadow-2xl font-bold text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-5">
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto px-4 py-8">
        {/* Left Column: Lesson Player and Content (8 cols on large screens) */}
        <div className="lg:col-span-8 space-y-6">
          {activeLesson ? (
            <>
              {/* Video Player Box with Cinematic Glow */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-[2rem] blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-950 shadow-xl border border-zinc-800/50">
                  {activeLesson.videoUrl ? (
                    <iframe
                      className="w-full h-full"
                      src={getYoutubeEmbedUrl(activeLesson.videoUrl)}
                      title={activeLesson.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-500 p-6 bg-zinc-900/50">
                      <PlayCircle className="w-16 h-16 mb-4 opacity-50" />
                      <p className="font-medium text-sm">
                        ไม่มีวิดีโอสำหรับบทเรียนนี้
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Lesson Metadata */}
              <div className="p-6 md:p-8 rounded-2xl border border-zinc-100 bg-white shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-3 flex-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                        กำลังเรียน
                      </span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 leading-snug tracking-tight">
                      {activeLesson.title}
                    </h1>
                    {activeLesson.documentUrl && (
                      <a
                        href={activeLesson.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-4 py-2 rounded-xl text-sm font-bold transition-colors group"
                      >
                        <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                        <span>ดาวน์โหลดเอกสารประกอบการเรียน</span>
                      </a>
                    )}
                  </div>

                  {/* Mark Completed Button */}
                  <button
                    disabled={
                      isLessonCompleted(activeLesson.id) || isUpdatingProgress
                    }
                    onClick={() => handleMarkAsCompleted(activeLesson.id)}
                    className={`shrink-0 py-3.5 px-6 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 min-w-[200px] ${
                      isLessonCompleted(activeLesson.id)
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default"
                        : "bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    }`}
                  >
                    {isLessonCompleted(activeLesson.id) ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>เรียนจบแล้ว</span>
                      </>
                    ) : isUpdatingProgress ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5 opacity-70" />
                        <span>ทำเครื่องหมายว่าเรียนจบแล้ว</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Quizzes of the active lesson */}
              {activeLesson.quizzes.map((quiz) => {
                const attempt = quizAttempts.find((a) => a.quizId === quiz.id);
                return (
                  <QuizWidget
                    key={quiz.id}
                    quiz={quiz}
                    previousAttempt={attempt}
                    onSuccess={() => {
                      // Update attempts list locally so UI stays in sync
                      setQuizAttempts((prev) => [
                        ...prev.filter((a) => a.quizId !== quiz.id),
                        { quizId: quiz.id, selectedIdx: -1, isCorrect: true }, // Simple flag representation
                      ]);
                    }}
                  />
                );
              })}

              {/* Assignment Widget for the Module */}
              <AssignmentWidget
                key={activeLesson.moduleId}
                moduleId={activeLesson.moduleId}
                previousSubmission={
                  submissions.find(
                    (s) => s.moduleId === activeLesson.moduleId,
                  ) || null
                }
                onSuccess={(newSubmission: any) => {
                  const formattedSubmission = {
                    ...newSubmission,
                    moduleId: activeLesson.moduleId,
                  };
                  setSubmissions((prev) => {
                    const filtered = prev.filter(
                      (s) => s.moduleId !== formattedSubmission.moduleId,
                    );
                    return [...filtered, formattedSubmission];
                  });
                }}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-400 bg-white rounded-2xl border border-zinc-100">
              <span className="text-5xl mb-4">🎓</span>
              <p className="text-base font-bold text-zinc-700">
                ไม่มีวิชาเรียนที่เปิดรับเข้าเรียนในขณะนี้
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Course Outline Sidebar (4 cols on large screens) */}
        <div className="lg:col-span-4 relative">
          <div className="sticky top-24 p-6 rounded-2xl border border-zinc-100 bg-white/80 backdrop-blur-xl shadow-xl shadow-zinc-200/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center shadow-sm">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-extrabold text-zinc-900">
                สารบัญรายวิชา
              </h2>
            </div>

            <div className="max-h-[calc(100vh-6rem)] overflow-y-auto pr-4 custom-scrollbar">
              {modules.map((module, mIndex) => {
                const moduleSubmission = submissions.find(
                  (s) => s.moduleId === module.id,
                );
                const statusLabel = moduleSubmission
                  ? moduleSubmission.status === "PASS"
                    ? "✓ ผ่านแล้ว"
                    : moduleSubmission.status === "PENDING"
                      ? "⏳ รอตรวจ"
                      : "💡 แก้ไขงาน"
                  : "";

                return (
                  <div key={module.id} className="relative pb-6 last:pb-2">
                    {/* Timeline Vertical Line */}
                    {mIndex !== modules.length - 1 && (
                      <div className="absolute left-[13px] top-8 bottom-0 w-[2px] bg-zinc-100 z-0"></div>
                    )}

                    {/* Module Header */}
                    <div className="flex items-start gap-3 relative z-10">
                      <div className="w-7 h-7 shrink-0 rounded-full bg-white border-[2px] border-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-600 shadow-sm">
                        {module.order}
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <h3 className="text-sm font-bold text-zinc-900 leading-snug break-words">
                          {module.title}
                        </h3>
                      </div>
                      {statusLabel && (
                        <div className="shrink-0 pt-0.5">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm border ${
                              moduleSubmission?.status === "PASS"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : moduleSubmission?.status === "PENDING"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-rose-50 text-rose-700 border-rose-200"
                            }`}
                          >
                            {statusLabel}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Lessons List */}
                    <div className="mt-3 ml-8 space-y-2 relative z-10">
                      {module.lessons.map((lesson, lIndex) => {
                        const isActive = activeLesson?.id === lesson.id;
                        const isCompleted = isLessonCompleted(lesson.id);
                        const isUnlocked = isLessonUnlocked(mIndex, lIndex);

                        let itemClass =
                          "hover:bg-zinc-50 border-transparent bg-transparent";
                        let titleClass = "text-zinc-600";
                        let icon = <Circle className="w-4 h-4 text-zinc-300" />;

                        if (isActive) {
                          itemClass =
                            "bg-emerald-50 border-emerald-200 shadow-sm ring-1 ring-emerald-500/10";
                          titleClass = "text-emerald-900 font-bold";
                          icon = (
                            <PlayCircle className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                          );
                          if (isCompleted) {
                            icon = (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            );
                          }
                        } else if (isCompleted) {
                          icon = (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          );
                          titleClass = "text-zinc-700 font-medium";
                        } else if (!isUnlocked) {
                          icon = <Lock className="w-3.5 h-3.5 text-zinc-300" />;
                          itemClass =
                            "opacity-50 cursor-not-allowed bg-zinc-50/50 border-transparent";
                          titleClass = "text-zinc-400";
                        }

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => {
                              if (isUnlocked) {
                                setActiveLesson(lesson);
                              } else {
                                showToast(
                                  "กรุณาเรียนบทก่อนหน้าและทำข้อสอบ/ส่งงานให้ครบก่อนค่ะ 🔒",
                                );
                              }
                            }}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 border ${itemClass}`}
                          >
                            <div className="flex items-start gap-3 w-full min-w-0">
                              <span className="shrink-0 mt-[1px]">{icon}</span>
                              <span
                                className={`leading-snug flex-1 min-w-0 break-words text-sm ${titleClass}`}
                              >
                                {lesson.title}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
