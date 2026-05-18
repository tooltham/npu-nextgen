"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  X,
  Clock,
  User,
  AlertCircle,
  MapPin,
  Briefcase,
  Target,
  Calendar,
  Phone,
  Mail,
  GraduationCap,
  Cpu,
} from "lucide-react";
import { StatusBadge, ApplicationStatus } from "./StatusBadge";

interface ApplicationDetailModalProps {
  applicationId: string;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdated: () => void;
}

export function ApplicationDetailModal({
  applicationId,
  isOpen,
  onClose,
  onStatusUpdated,
}: ApplicationDetailModalProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "logs">("info");

  // Note Submission state
  const [noteText, setNoteText] = useState("");
  const [submittingNote, setSubmittingNote] = useState(false);

  // Confirmation Dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    status: ApplicationStatus | null;
  }>({ show: false, status: null });

  const educationMap: Record<string, string> = {
    HIGH_SCHOOL_OR_VOC: "มัธยมศึกษาตอนปลาย หรือ ปวช.",
    DIPLOMA: "ปวส.",
    BACHELOR: "ปริญญาตรี",
    ABOVE_BACHELOR: "สูงกว่าปริญญาตรี",
  };

  const digitalSkillMap: Record<string, string> = {
    EXCELLENT: "ดีมาก",
    GOOD: "ดี",
    AVERAGE: "ปานกลาง",
    LOW: "น้อย",
    NONE: "ไม่มีพื้นฐานเลย",
  };

  const targetGroupMap: Record<string, string> = {
    UNEMPLOYED: "ผู้ที่ยังไม่ได้ทำงาน ต้องการเรียนเพื่อประกอบอาชีพ",
    FARMER: "เกษตรกร หรือ ทายาทเกษตรกร",
    COMMUNITY_ENTERPRISE: "ผู้ประกอบการวิสาหกิจชุมชน หรือแรงงานในภาคการเกษตร",
    OTHER: "อื่นๆ",
  };

  const expectationMap: Record<string, string> = {
    AI_IOT_FARM: "ต้องการใช้ AI และ IoT ในการวิเคราะห์และจัดการฟาร์ม",
    DIGITAL_MARKETING: "ต้องการทักษะการสร้างแบรนด์และการตลาดดิจิทัล",
    REDUCE_COST: "ต้องการนำเทคโนโลยีมาลดต้นทุนและเพิ่มมูลค่าผลผลิต",
    OTHER_EXP: "อื่นๆ",
  };

  const fetchData = () => {
    if (isOpen && applicationId) {
      setLoading(true);
      setError(null);
      fetch(`/api/admin/applications/${applicationId}`)
        .then(async (res) => {
          const isJson = res.headers
            .get("content-type")
            ?.includes("application/json");
          const data = isJson ? await res.json() : null;

          if (!res.ok) {
            const errorMsg = data?.error || `HTTP error! status: ${res.status}`;
            throw new Error(errorMsg);
          }
          return data;
        })
        .then((json) => {
          if (json && json.data) {
            setData(json.data);
          } else {
            setError("ไม่พบข้อมูลผู้สมัคร");
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError(err.message || "เกิดข้อผิดพลาดในการดึงข้อมูล");
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (isOpen) {
      setActiveTab("info");
      setConfirmDialog({ show: false, status: null });
      fetchData();
    }
  }, [isOpen, applicationId]);

  const handleUpdateStatus = async (status: ApplicationStatus) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        onStatusUpdated();
        setConfirmDialog({ show: false, status: null });
        fetchData(); // reload logs and new state
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    setSubmittingNote(true);
    try {
      const res = await fetch(`/api/admin/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        // Passing the same status just to add a log
        body: JSON.stringify({ status: data.status, noteDetails: noteText }),
      });
      if (res.ok) {
        setNoteText("");
        fetchData(); // reload logs
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingNote(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 font-noto-thai">
      {/* Confirmation Dialog Overlay */}
      {confirmDialog.show && confirmDialog.status && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 shadow-2xl max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4 text-amber-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold">ยืนยันการเปลี่ยนสถานะ</h3>
            </div>
            <p className="text-gray-600 text-sm mb-6">
              คุณต้องการเปลี่ยนสถานะผู้สมัครเป็น{" "}
              <span className="font-semibold text-gray-900">
                {confirmDialog.status === "ACCEPTED"
                  ? "ผ่านการคัดเลือก"
                  : confirmDialog.status === "WAITLISTED"
                    ? "ตัวสำรอง"
                    : confirmDialog.status === "REJECTED"
                      ? "ไม่ผ่าน"
                      : "กำลังพิจารณา"}
              </span>
              ใช่หรือไม่?
              {confirmDialog.status === "ACCEPTED" &&
                !data?.isAcceptanceEmailSent && (
                  <span className="block mt-2 text-red-600 font-medium">
                    * ระบบจะทำการส่งอีเมลแจ้งผลไปยังผู้สมัครทันที
                  </span>
                )}
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setConfirmDialog({ show: false, status: null })}
                disabled={updating}
              >
                ยกเลิก
              </Button>
              <Button
                className="bg-amber-600 hover:bg-amber-700 text-white"
                onClick={() => handleUpdateStatus(confirmDialog.status!)}
                disabled={updating}
              >
                {updating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "ยืนยัน"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="relative w-full max-w-3xl rounded-xl bg-white shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b shrink-0">
          <h2 className="text-xl font-bold text-gray-900">รายละเอียดใบสมัคร</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center flex-1 min-h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-[#1B5E20]" />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center flex-1 min-h-[300px] text-red-500">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        ) : !data ? (
          <div className="flex justify-center items-center flex-1 min-h-[300px] text-gray-500">
            ไม่พบข้อมูล
          </div>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b px-5 pt-2 shrink-0 gap-6">
              <button
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "info" ? "border-[#1B5E20] text-[#1B5E20]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("info")}
              >
                ข้อมูลผู้สมัคร
              </button>
              <button
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "logs" ? "border-[#1B5E20] text-[#1B5E20]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("logs")}
              >
                ประวัติ & บันทึกผล
              </button>
            </div>

            {/* Scrollable Tab Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {activeTab === "info" ? (
                <div className="space-y-6">
                  {/* Personal Info Card */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
                      <User className="w-5 h-5 text-[#1B5E20]" />
                      <h3 className="font-semibold text-gray-900">
                        ข้อมูลส่วนตัวและการศึกษา
                      </h3>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                          ชื่อ-นามสกุล (TH)
                        </p>
                        <p className="font-medium text-gray-900">
                          {data.titleTh}
                          {data.firstNameTh} {data.lastNameTh}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                          ชื่อ-นามสกุล (EN)
                        </p>
                        <p className="font-medium text-gray-900">
                          {(() => {
                            const prefixMap: Record<string, string> = {
                              นาย: "Mr.",
                              นาง: "Mrs.",
                              นางสาว: "Ms.",
                            };
                            const prefix =
                              prefixMap[data.titleTh as string] || "";
                            const fullName = `${data.firstNameEn} ${data.lastNameEn}`;
                            if (
                              prefix &&
                              !data.firstNameEn?.startsWith(prefix)
                            ) {
                              return `${prefix} ${fullName}`;
                            }
                            return fullName;
                          })()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                          อีเมล
                        </p>
                        <p className="font-medium text-gray-900">
                          {data.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                          เบอร์โทรศัพท์
                        </p>
                        <p className="font-medium text-gray-900">
                          {data.phone}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                          Line ID
                        </p>
                        <p className="font-medium text-gray-900">
                          {data.lineId || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                          การศึกษา
                        </p>
                        <p className="font-medium text-gray-900">
                          {educationMap[data.education] || data.education}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                          ทักษะดิจิทัล
                        </p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            data.digitalSkillLevel === "EXCELLENT"
                              ? "bg-green-100 text-green-800"
                              : data.digitalSkillLevel === "GOOD"
                                ? "bg-blue-100 text-blue-800"
                                : data.digitalSkillLevel === "AVERAGE"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {digitalSkillMap[data.digitalSkillLevel] ||
                            data.digitalSkillLevel}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Target Group Card */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
                      <Target className="w-5 h-5 text-[#1B5E20]" />
                      <h3 className="font-semibold text-gray-900">
                        กลุ่มเป้าหมาย
                      </h3>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                        ท่านอยู่ในกลุ่มเป้าหมายใด
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(data.targetGroup as string[])?.map((id) => (
                          <span
                            key={id}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100"
                          >
                            {targetGroupMap[id] || id}
                          </span>
                        )) || "-"}
                      </div>
                      {data.targetGroupOther && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-100">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium text-gray-700">
                              ระบุอื่นๆ:
                            </span>{" "}
                            {data.targetGroupOther}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Experience Card */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-[#1B5E20]" />
                      <h3 className="font-semibold text-gray-900">
                        ประสบการณ์เกษตร
                      </h3>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                          เคยทำเกษตรหรือไม่
                        </p>
                        <p className="font-medium text-gray-900">
                          {data.hasAgriExperience
                            ? `มีประสบการณ์ (${data.agriExperienceYears} ปี)`
                            : "ไม่มีประสบการณ์"}
                        </p>
                      </div>
                      {data.hasAgriExperience && (
                        <>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                              ชื่อฟาร์ม
                            </p>
                            <p className="font-medium text-gray-900">
                              {data.farmName || "-"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                              ที่ตั้งฟาร์ม
                            </p>
                            <p className="font-medium text-gray-900">
                              {data.farmLocation || "-"}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Expectations Card */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-[#1B5E20]" />
                      <h3 className="font-semibold text-gray-900">
                        ความคาดหวังและความพร้อม
                      </h3>
                    </div>
                    <div className="p-4 space-y-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                          สิ่งที่คาดหวังจากโครงการ
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(data.expectations as string[])?.map((id) => (
                            <span
                              key={id}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                            >
                              {expectationMap[id] || id}
                            </span>
                          )) || "-"}
                        </div>
                        {data.expectationsOther && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-100">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium text-gray-700">
                                ระบุอื่นๆ:
                              </span>{" "}
                              {data.expectationsOther}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="border-t pt-3">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                          ความพร้อมด้านเวลา (ตลอด 16-20 สัปดาห์)
                        </p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            data.canCommitTime
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {data.canCommitTime
                            ? "พร้อมเข้าร่วม 100%"
                            : "ไม่แน่ใจ"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 flex flex-col h-full">
                  {/* Notes Input */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shrink-0">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      เพิ่มบันทึกความเห็น / ผลสัมภาษณ์
                    </label>
                    <textarea
                      className="w-full rounded-md border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent outline-none"
                      rows={3}
                      placeholder="พิมพ์บันทึกย่อที่นี่..."
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                    />
                    <div className="mt-2 flex justify-end">
                      <Button
                        size="sm"
                        className="bg-[#1B5E20] hover:bg-[#154a19] text-white"
                        onClick={handleAddNote}
                        disabled={submittingNote || !noteText.trim()}
                      >
                        {submittingNote ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : null}
                        บันทึกข้อความ
                      </Button>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">
                      ประวัติการดำเนินการ
                    </h3>
                    {!data.logs || data.logs.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">
                        ยังไม่มีประวัติการดำเนินการ
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {data.logs.map((log: any) => (
                          <div key={log.id} className="flex gap-3 text-sm">
                            <div className="flex flex-col items-center">
                              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 text-green-700">
                                {log.action === "STATUS_CHANGE" ? (
                                  <Clock className="w-4 h-4" />
                                ) : (
                                  <User className="w-4 h-4" />
                                )}
                              </div>
                              <div className="w-px h-full bg-gray-200 mt-2"></div>
                            </div>
                            <div className="pb-4 pt-1">
                              <div className="flex items-baseline gap-2 mb-1">
                                <span className="font-semibold text-gray-900">
                                  {log.adminEmail}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(log.createdAt).toLocaleString(
                                    "th-TH",
                                  )}
                                </span>
                              </div>
                              <p className="text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-100 mt-1">
                                {log.details}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer / Status Actions */}
            <div className="border-t p-5 bg-gray-50 shrink-0 flex flex-col sm:flex-row justify-between items-center gap-4 rounded-b-xl">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600">
                  สถานะปัจจุบัน:
                </span>
                <StatusBadge status={data.status as ApplicationStatus} />
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() =>
                    setConfirmDialog({ show: true, status: "REVIEWED" })
                  }
                  disabled={data.status === "REVIEWED"}
                >
                  กำลังพิจารณา
                </Button>
                <Button
                  size="sm"
                  className="bg-purple-500 hover:bg-purple-600 text-white font-medium shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() =>
                    setConfirmDialog({ show: true, status: "WAITLISTED" })
                  }
                  disabled={data.status === "WAITLISTED"}
                >
                  สำรอง
                </Button>
                <Button
                  size="sm"
                  className="bg-red-500 hover:bg-red-600 text-white font-medium shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() =>
                    setConfirmDialog({ show: true, status: "REJECTED" })
                  }
                  disabled={data.status === "REJECTED"}
                >
                  ไม่ผ่าน
                </Button>
                <Button
                  size="sm"
                  className="bg-[#1B5E20] hover:bg-[#154a19] text-white font-medium shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() =>
                    setConfirmDialog({ show: true, status: "ACCEPTED" })
                  }
                  disabled={data.status === "ACCEPTED"}
                >
                  อนุมัติผ่าน
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
