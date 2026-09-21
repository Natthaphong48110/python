import React, { useState } from 'react';
import {
  User,
  School,
  Hash,
  Trophy,
  Award,
  TrendingUp,
  ClipboardCheck,
  Gamepad2,
  Edit3,
  LogOut,
  X,
  Clock,
  Sparkles,
  CheckCircle2,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { StudentProfile, StudentLeaderboardEntry } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile | null;
  studentData: StudentLeaderboardEntry | null;
  rank: number | null;
  onEditProfile: () => void;
  onSwitchProfile: () => void;
  onDeleteProfile?: () => Promise<void>;
}

export const StudentProfileDetailModal: React.FC<Props> = ({
  isOpen,
  onClose,
  profile,
  studentData,
  rank,
  onEditProfile,
  onSwitchProfile,
  onDeleteProfile
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !profile) return null;

  const totalPoints = studentData?.totalPoints ?? 0;
  const preScore = studentData?.preTestScore ?? null;
  const postScore = studentData?.postTestScore ?? null;
  const gainRate = studentData?.gainRate ?? null;
  const badges = studentData?.badges || [];

  const handleConfirmDelete = async () => {
    if (!onDeleteProfile) return;
    setIsDeleting(true);
    try {
      await onDeleteProfile();
      setShowDeleteConfirm(false);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header with Avatar and Background */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition"
            aria-label="ปิด"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white text-emerald-700 font-bold text-2xl flex items-center justify-center shadow-lg shadow-black/10 shrink-0">
              {profile.name.charAt(0)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/20 backdrop-blur-xs text-emerald-50 mb-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>ผู้เรียน Python ม.4</span>
              </div>
              <h2 className="text-xl font-bold text-white truncate">
                {profile.name}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-100 mt-0.5">
                <span className="flex items-center gap-1">
                  <School className="w-3.5 h-3.5" /> {profile.classroom}
                </span>
                {profile.studentNo && profile.studentNo !== '-' && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Hash className="w-3.5 h-3.5" /> เลขที่ {profile.studentNo}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-800">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-center">
              <div className="text-[11px] font-semibold text-amber-800 flex items-center justify-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-600" /> คะแนน (XP)
              </div>
              <div className="text-lg font-bold text-amber-700 mt-1">
                {totalPoints.toLocaleString()}
              </div>
              <div className="text-[10px] text-amber-600/90 font-medium">
                {rank ? `อันดับที่ #${rank}` : 'ยังไม่มีอันดับ'}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-sky-50/80 border border-sky-200/70 text-center">
              <div className="text-[11px] font-semibold text-sky-800 flex items-center justify-center gap-1">
                <ClipboardCheck className="w-3.5 h-3.5 text-sky-600" /> Pre-Test
              </div>
              <div className="text-lg font-bold text-sky-700 mt-1">
                {preScore !== null ? `${preScore}/10` : '-'}
              </div>
              <div className="text-[10px] text-sky-600/90 font-medium">
                {preScore !== null ? 'ทดสอบแล้ว' : 'ยังไม่ทดสอบ'}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-purple-50/80 border border-purple-200/70 text-center">
              <div className="text-[11px] font-semibold text-purple-800 flex items-center justify-center gap-1">
                <ClipboardCheck className="w-3.5 h-3.5 text-purple-600" /> Post-Test
              </div>
              <div className="text-lg font-bold text-purple-700 mt-1">
                {postScore !== null ? `${postScore}/10` : '-'}
              </div>
              <div className="text-[10px] text-purple-600/90 font-medium">
                {postScore !== null ? (postScore >= 6 ? 'ผ่านเกณฑ์' : 'ยังไม่ผ่าน') : 'ยังไม่สอบ'}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/70 text-center">
              <div className="text-[11px] font-semibold text-emerald-800 flex items-center justify-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> พัฒนาการ
              </div>
              <div className="text-lg font-bold text-emerald-700 mt-1">
                {gainRate !== null ? `+${gainRate}%` : '-'}
              </div>
              <div className="text-[10px] text-emerald-600/90 font-medium">
                {gainRate !== null ? 'Normalized Gain' : 'รอสอบทั้ง 2 รอบ'}
              </div>
            </div>
          </div>

          {/* Mini-Games High Scores */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Gamepad2 className="w-4 h-4 text-emerald-600" /> สถิติสูงสุดในเกมย่อย 3 โหมด
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-2xs">
                <div className="text-[10px] text-slate-500">เกมแยกประเภท</div>
                <div className="font-bold text-slate-800 text-sm mt-0.5">
                  {studentData?.sorterHighScore ?? 0}
                </div>
                <div className="text-[9px] text-slate-400">คะแนนสูงสุด</div>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-2xs">
                <div className="text-[10px] text-slate-500">นักสืบตั้งชื่อ</div>
                <div className="font-bold text-slate-800 text-sm mt-0.5">
                  {studentData?.detectiveHighScore ?? 0}
                </div>
                <div className="text-[9px] text-slate-400">คะแนนสูงสุด</div>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-2xs">
                <div className="text-[10px] text-slate-500">ห้องแล็บแปลงชนิด</div>
                <div className="font-bold text-slate-800 text-sm mt-0.5">
                  {studentData?.labHighScore ?? 0}
                </div>
                <div className="text-[9px] text-slate-400">คะแนนสูงสุด</div>
              </div>
            </div>
          </div>

          {/* Badges Earned */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" /> ตราสัญลักษณ์ความสำเร็จ ({badges.length})
              </div>
            </div>
            {badges.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {badges.map((b, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/60"
                  >
                    <span>🎖️</span>
                    <span>{b}</span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-1">
                ยังไม่มีตราสัญลักษณ์ ลองทำแบบทดสอบหรือเล่นเกมย่อยเพื่อปลดล็อกเหรียญตรา
              </p>
            )}
          </div>

          {/* Activity / Info */}
          {studentData?.lastActive && (
            <div className="text-[11px] text-slate-400 flex items-center justify-between px-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> ใช้งานล่าสุด
              </span>
              <span>
                {new Date(studentData.lastActive).toLocaleDateString('th-TH', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2 shrink-0 flex-wrap">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onSwitchProfile}
              className="py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5"
              title="ออกจากระบบในเครื่องนี้ หรือสลับไปเป็นนักเรียนคนอื่น"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" /> สลับผู้เรียน
            </button>

            {onDeleteProfile && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="py-2 px-2.5 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition flex items-center gap-1.5"
                title="ลบข้อมูลโปรไฟล์นี้ออกจากระบบ"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" /> ลบข้อมูล
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onEditProfile}
              className="py-2 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" /> แก้ไขข้อมูล
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition"
            >
              ปิด
            </button>
          </div>
        </div>

        {/* Delete Confirmation Overlay */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-xs p-6 flex flex-col justify-center items-center text-center animate-in fade-in duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">
              ยืนยันการลบข้อมูลโปรไฟล์?
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mb-5 leading-relaxed">
              ข้อมูลคะแนน, สถิติ Pre/Post-Test และเหรียญรางวัลของ <span className="font-semibold text-slate-800">{profile.name}</span> จะถูกนำออกจากกระดานอันดับ
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
              >
                {isDeleting ? 'กำลังลบ...' : 'ยืนยันการลบ'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
