import React, { useState } from 'react';
import {
  Trophy,
  Medal,
  TrendingUp,
  RefreshCw,
  Search,
  Filter,
  Award,
  Users,
  Trash2,
  AlertTriangle,
  RotateCcw,
  Check,
  X
} from 'lucide-react';
import { StudentLeaderboardEntry, StudentProfile } from '../types';

interface Props {
  leaderboard: StudentLeaderboardEntry[];
  currentProfile: StudentProfile | null;
  onRefresh: () => void;
  isLoading: boolean;
  isLive: boolean;
  onDeleteStudent: (id: string, name: string) => Promise<boolean>;
  onResetAllStudents?: () => Promise<boolean>;
}

export const LeaderboardView: React.FC<Props> = ({
  leaderboard,
  currentProfile,
  onRefresh,
  isLoading,
  isLive,
  onDeleteStudent,
  onResetAllStudents
}) => {
  const [selectedClassroom, setSelectedClassroom] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [studentToDelete, setStudentToDelete] = useState<StudentLeaderboardEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showResetAllModal, setShowResetAllModal] = useState(false);
  const [isResettingAll, setIsResettingAll] = useState(false);

  // Extract unique classrooms
  const availableClassrooms = Array.from(
    new Set(leaderboard.map((item) => item.classroom))
  ).sort();

  // Filter list
  const filteredList = leaderboard.filter((student) => {
    const matchesClass = selectedClassroom === 'all' || student.classroom === selectedClassroom;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      student.studentName.toLowerCase().includes(query) ||
      student.studentNo.includes(query);
    return matchesClass && matchesSearch;
  });

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;
    setIsDeleting(true);
    try {
      await onDeleteStudent(studentToDelete.id, studentToDelete.studentName);
      setStudentToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmResetAll = async () => {
    if (!onResetAllStudents) return;
    setIsResettingAll(true);
    try {
      await onResetAllStudents();
      setShowResetAllModal(false);
    } finally {
      setIsResettingAll(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-2">
              <Trophy className="w-3.5 h-3.5 text-emerald-600" />
              <span>กระดานจัดอันดับ (Leaderboard)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              กระดานจัดอันดับ
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              โรงเรียนมัธยมวาริชภูมิ ระดับชั้นมัธยมศึกษาปีที่4
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${isLoading ? 'animate-spin' : ''}`} />
              <span>รีเฟรชข้อมูล</span>
            </button>

            {onResetAllStudents && leaderboard.length > 0 && (
              <button
                onClick={() => setShowResetAllModal(true)}
                className="px-3 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                title="ล้างคะแนนทั้งหมดในกระดาน (สำหรับคุณครู)"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                <span>รีเซ็ตกระดาน</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-4 border-t border-slate-100">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อนักเรียน หรือเลขที่..."
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-xs sm:text-sm text-slate-800"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedClassroom}
              onChange={(e) => setSelectedClassroom(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-xs sm:text-sm text-slate-800"
            >
              <option value="all">ห้องเรียนทั้งหมด (ทุกห้อง)</option>
              {availableClassrooms.map((c) => (
                <option key={c} value={c}>เฉพาะห้อง {c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Leaderboard Table / Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="font-bold text-slate-900 text-sm sm:text-base">
              รายชื่อนักเรียน ({filteredList.length} คน)
            </h2>
          </div>
          <div className="text-[11px] text-slate-400">
            เรียงตามคะแนนรวม (XP) • อัปเดตอัตโนมัติ
          </div>
        </div>

        {filteredList.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-sm font-semibold text-slate-700">
              ยังไม่พบข้อมูลนักเรียน
            </div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchQuery || selectedClassroom !== 'all'
                ? 'ไม่พบคะแนนที่ตรงกับตัวกรองที่เลือก ลองเปลี่ยนคำค้นหาหรือเลือกทุกห้องเรียน'
                : 'ยังไม่มีนักเรียนทำแบบทดสอบหรือบันทึกคะแนน เป็นคนแรกของโรงเรียนที่เข้าสู่ทำเนียบเกียรติยศ!'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4 text-center w-14">อันดับ</th>
                  <th className="py-3 px-4">ชื่อนักเรียน</th>
                  <th className="py-3 px-4 text-center">ห้อง/เลขที่</th>
                  <th className="py-3 px-4 text-right">คะแนนรวม (XP)</th>
                  <th className="py-3 px-4 text-center">Pre-Test</th>
                  <th className="py-3 px-4 text-center">Post-Test</th>
                  <th className="py-3 px-4 text-center">พัฒนาการ</th>
                  <th className="py-3 px-4">ตราสัญลักษณ์</th>
                  <th className="py-3 px-3 text-center w-16">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.map((entry, index) => {
                  const rank = index + 1;
                  const isCurrent = currentProfile && entry.studentName.trim().toLowerCase() === currentProfile.name.trim().toLowerCase();

                  // Rank Badge Icon
                  let rankDisplay = (
                    <span className="font-semibold text-slate-500 text-xs">#{rank}</span>
                  );
                  if (rank === 1) {
                    rankDisplay = (
                      <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center mx-auto shadow-xs text-xs">
                        🥇 1
                      </span>
                    );
                  } else if (rank === 2) {
                    rankDisplay = (
                      <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center mx-auto text-xs">
                        🥈 2
                      </span>
                    );
                  } else if (rank === 3) {
                    rankDisplay = (
                      <span className="w-7 h-7 rounded-full bg-amber-700/20 text-amber-900 font-bold flex items-center justify-center mx-auto text-xs">
                        🥉 3
                      </span>
                    );
                  }

                  return (
                    <tr
                      key={entry.id || `${entry.studentName}_${index}`}
                      className={`transition ${
                        isCurrent
                          ? 'bg-emerald-50/80 font-medium hover:bg-emerald-100/70'
                          : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        {rankDisplay}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white ${
                            rank === 1 ? 'bg-amber-500' : rank === 2 ? 'bg-slate-500' : rank === 3 ? 'bg-amber-700' : 'bg-emerald-600'
                          }`}>
                            {entry.studentName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{entry.studentName}</span>
                              {isCurrent && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-600 text-white font-bold">
                                  คุณ
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              เล่นล่าสุด {new Date(entry.lastActive).toLocaleDateString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                          {entry.classroom} {entry.studentNo !== '-' ? `(เลขที่ ${entry.studentNo})` : ''}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span className="font-bold text-slate-900 text-sm sm:text-base text-amber-600">
                          ★ {entry.totalPoints.toLocaleString()}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {entry.preTestScore !== null ? (
                          <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-semibold text-xs border border-sky-200">
                            {entry.preTestScore}/10
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {entry.postTestScore !== null ? (
                          <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold text-xs border border-purple-200">
                            {entry.postTestScore}/10
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {entry.gainRate !== null ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                            <TrendingUp className="w-3 h-3 text-emerald-600" />
                            +{entry.gainRate}%
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {entry.badges && entry.badges.length > 0 ? (
                            entry.badges.map((b, bIdx) => (
                              <span
                                key={bIdx}
                                className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200/60 whitespace-nowrap"
                              >
                                {b}
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-slate-400">ยังไม่มี</span>
                          )}
                        </div>
                      </td>

                      {/* Action / Delete Button */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <button
                          onClick={() => setStudentToDelete(entry)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title={`ลบข้อมูลของ ${entry.studentName}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Single Student Delete Confirmation Modal */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  ยืนยันการลบข้อมูลผู้เรียน
                </h3>
                <p className="text-xs text-slate-500">
                  ลบตัวละครที่สร้างซ้ำหรือสร้างโดยไม่ได้ตั้งใจ
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="font-semibold text-slate-800 text-sm">
                {studentToDelete.studentName}
              </div>
              <div className="text-slate-600">
                ห้อง: {studentToDelete.classroom} {studentToDelete.studentNo !== '-' ? `(เลขที่ ${studentToDelete.studentNo})` : ''}
              </div>
              <div className="text-amber-700 font-semibold">
                คะแนนรวม: {studentToDelete.totalPoints.toLocaleString()} XP
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              การลบนี้จะนำรายชื่อและคะแนนของผู้เล่นคนนี้ออกจากกระดานจัดอันดับอย่างถาวร เพื่อรักษาความถูกต้องของข้อมูล
            </p>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
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
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> กำลังลบ...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" /> ยืนยันการลบ
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset All Leaderboard Confirmation Modal */}
      {showResetAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  ยืนยันการรีเซ็ตกระดานคะแนนทั้งหมด
                </h3>
                <p className="text-xs text-slate-500">
                  ลบรายชื่อนักเรียนและคะแนนทั้งหมด ({leaderboard.length} รายการ)
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-rose-50 p-3 rounded-xl border border-rose-200 text-rose-800">
              ⚠️ การกระทำนี้จะล้างประวัติคะแนนของนักเรียนทุกคนในทุกห้องเรียน เหมาะสำหรับคุณครูที่ต้องการล้างข้อมูลทดสอบก่อนเริ่มการสอนจริง
            </p>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowResetAllModal(false)}
                disabled={isResettingAll}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmResetAll}
                disabled={isResettingAll}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
              >
                {isResettingAll ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> กำลังรีเซ็ต...
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" /> ยืนยันการรีเซ็ตทั้งหมด
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
