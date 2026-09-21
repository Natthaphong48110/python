import React from 'react';
import {
  Trophy,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Gamepad2,
  CheckCircle2,
  BarChart3,
  HelpCircle,
  User
} from 'lucide-react';
import { StudentProfile, StudentLeaderboardEntry, ActiveTab } from '../types';

interface Props {
  profile: StudentProfile | null;
  studentData: StudentLeaderboardEntry | null;
  onNavigate: (tab: ActiveTab) => void;
  onRegister: () => void;
  onOpenProfileDetail?: () => void;
  classStats: {
    totalStudents: number;
    avgPreTest: number | null;
    avgPostTest: number | null;
    avgGainRate: number | null;
  } | null;
  rank: number | null;
}

export const DashboardView: React.FC<Props> = ({
  profile,
  studentData,
  onNavigate,
  onRegister,
  onOpenProfileDetail,
  classStats,
  rank
}) => {
  const preScore = studentData?.preTestScore ?? null;
  const postScore = studentData?.postTestScore ?? null;
  const gainRate = studentData?.gainRate ?? null;
  const totalPoints = studentData?.totalPoints ?? 0;
  const badges = studentData?.badges ?? [];

  // Determine skill level based on points & tests
  const getSkillLevel = () => {
    if (postScore !== null && postScore >= 9) return { label: 'Python Master (ระดับเชี่ยวชาญ)', color: 'text-purple-700 bg-purple-100 border-purple-200' };
    if (postScore !== null && postScore >= 7) return { label: 'Data Type Specialist (ระดับก้าวหน้า)', color: 'text-emerald-700 bg-emerald-100 border-emerald-200' };
    if (preScore !== null || totalPoints > 200) return { label: 'Python Explorer (กำลังพัฒนา)', color: 'text-sky-700 bg-sky-100 border-sky-200' };
    return { label: 'Python Beginner (ผู้เริ่มต้น)', color: 'text-slate-700 bg-slate-100 border-slate-200' };
  };

  const skill = getSkillLevel();

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> ชั้นมัธยมศึกษาปีที่ 4 • รายวิชาคอมพิวเตอร์และขั้นตอนวิธี
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {profile ? `สวัสดี, ${profile.name} (${profile.classroom})` : 'ระบบการเรียนรู้ตัวแปรและชนิดข้อมูล Python'}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
            ระบบติดตามผลการเรียนรู้ โรงเรียนมัธยมวาริชภูมิ ระดับชั้นมัธยมศึกษาปีที่4
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {profile ? (
              <>
                <button
                  onClick={() => onNavigate('lessons')}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold shadow-md shadow-emerald-500/25 transition flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" /> เริ่มเรียนบทเรียน
                </button>
                <button
                  onClick={() => onNavigate('games')}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium backdrop-blur-xs transition flex items-center gap-2 border border-white/10"
                >
                  <Gamepad2 className="w-4 h-4 text-emerald-400" /> เล่นเกมเก็บแต้ม
                </button>
                {onOpenProfileDetail && (
                  <button
                    onClick={onOpenProfileDetail}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium backdrop-blur-xs transition flex items-center gap-2 border border-white/10"
                  >
                    <User className="w-4 h-4 text-cyan-300" /> ดูโปรไฟล์ของฉัน
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={onRegister}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold shadow-md transition flex items-center gap-2"
              >
                ลงชื่อเพื่อเริ่มบันทึกผลการเรียน <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Decorative corner icon */}
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <Trophy className="w-64 h-64 text-emerald-400" />
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Points */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">คะแนนสะสมรวม (XP)</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              ★
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
            {totalPoints.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span>อันดับที่</span>
            <span className="font-semibold text-slate-800">{rank ? `#${rank}` : '-'}</span>
            <span>ของชั้นเรียน</span>
          </div>
        </div>

        {/* Pre-Test Score */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">คะแนน Pre-Test</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
            {preScore !== null ? `${preScore}/10` : 'ยังไม่ได้ทำ'}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {preScore !== null ? (
              <span className="text-emerald-600 font-medium">บันทึกก่อนเรียนแล้ว</span>
            ) : (
              <button
                onClick={() => onNavigate('pre_test')}
                className="text-emerald-600 font-semibold hover:underline flex items-center gap-1"
              >
                ทำแบบทดสอบก่อนเรียน →
              </button>
            )}
          </div>
        </div>

        {/* Post-Test Score */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">คะแนน Post-Test</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
            {postScore !== null ? `${postScore}/10` : 'ยังไม่ได้ทำ'}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {postScore !== null ? (
              <span className="text-purple-600 font-medium">วัดผลหลังเรียนแล้ว</span>
            ) : (
              <button
                onClick={() => onNavigate('post_test')}
                className="text-purple-600 font-semibold hover:underline flex items-center gap-1"
              >
                ทำแบบทดสอบหลังเรียน →
              </button>
            )}
          </div>
        </div>

        {/* Normalized Gain / Development Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">ดัชนีพัฒนาการ (Gain)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-2">
            {gainRate !== null ? `+${gainRate}%` : '-'}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {preScore !== null && postScore !== null ? (
              postScore >= preScore ? (
                <span className="text-emerald-600 font-medium">มีพัฒนาการเพิ่มขึ้น</span>
              ) : (
                <span className="text-slate-500">ควรทบทวนบทเรียนเพิ่มเติม</span>
              )
            ) : (
              <span>ต้องสอบครบทั้ง 2 ครั้ง</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Learning Path & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step-by-Step Learning Path */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">ขั้นตอนการเรียนรู้</h2>
              <p className="text-xs text-slate-500 mt-0.5">รายวิชา คอมพิวเตอร์และขั้นตอนวิธี ระดับชั้นมัธยมศึกษาปีที่4</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${skill.color}`}>
              {skill.label}
            </span>
          </div>

          <div className="space-y-3 mt-4">
            {/* Step 1: Pre-test */}
            <div className={`p-4 rounded-xl border transition flex items-center justify-between gap-4 ${
              preScore !== null ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-3.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                  preScore !== null ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {preScore !== null ? '✓' : '1'}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <span>ทำแบบทดสอบก่อนเรียน (Pre-Test)</span>
                    {preScore !== null && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-800 font-semibold">
                        {preScore}/10 คะแนน
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    วัดระดับความรู้เดิม 10 ข้อ เพื่อใช้คำนวณอัตราพัฒนาการ
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('pre_test')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition ${
                  preScore !== null
                    ? 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                }`}
              >
                {preScore !== null ? 'ทำซ้ำ' : 'เริ่มทดสอบ'}
              </button>
            </div>

            {/* Step 2: Lessons */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/70 transition flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  2
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">
                    ศึกษาบทเรียน 5 โมดูลสำคัญ
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    การสร้างตัวแปร, กฎการตั้งชื่อ, 4 ชนิดข้อมูลหลัก, type() & casting, และตัวดำเนินการ
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('lessons')}
                className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shrink-0 shadow-xs transition"
              >
                เข้าสู่บทเรียน
              </button>
            </div>

            {/* Step 3: Mini-games */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/70 transition flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  3
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <span>ฝึกฝนผ่าน 3 เกมย่อย</span>
                    {(studentData?.sorterHighScore || studentData?.detectiveHighScore || studentData?.labHighScore) ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
                        คะแนนรวมเกม {(studentData?.sorterHighScore || 0) + (studentData?.detectiveHighScore || 0) + (studentData?.labHighScore || 0)}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    เกมแยกชนิดข้อมูล (Sorter), นักสืบจับผิดชื่อตัวแปร (Detective), และห้องทดลองแปลงค่า (Lab)
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('games')}
                className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shrink-0 shadow-xs transition"
              >
                เข้าเล่นเกม
              </button>
            </div>

            {/* Step 4: Post-test */}
            <div className={`p-4 rounded-xl border transition flex items-center justify-between gap-4 ${
              postScore !== null ? 'bg-purple-50/60 border-purple-200' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-3.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                  postScore !== null ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {postScore !== null ? '✓' : '4'}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <span>ทำแบบทดสอบหลังเรียน (Post-Test)</span>
                    {postScore !== null && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-200/80 text-purple-800 font-semibold">
                        {postScore}/10 คะแนน
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    วัดผลสัมฤทธิ์ปลายทางและบันทึกคะแนนจัดอันดับ
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('post_test')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition ${
                  postScore !== null
                    ? 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-100'
                    : 'bg-purple-600 text-white hover:bg-purple-700 shadow-xs'
                }`}
              >
                {postScore !== null ? 'ทำซ้ำ' : 'เริ่มสอบวัดผล'}
              </button>
            </div>
          </div>
        </div>

        {/* Badges & Classroom Statistics */}
        <div className="space-y-6">
          {/* Badges Earned */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" /> ตราสัญลักษณ์ความสำเร็จ
              </h3>
              <span className="text-xs text-slate-400">{badges.length} เหรียญ</span>
            </div>

            {badges.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-3">
                {badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-amber-50 border border-amber-200/80 text-amber-800"
                  >
                    <span>🎖️</span>
                    <span>{badge}</span>
                  </span>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-500 mt-2">
                ยังไม่มีตราสัญลักษณ์ ลองทำแบบทดสอบหรือเล่นเกมย่อยเพื่อปลดล็อกเหรียญรางวัล!
              </div>
            )}
          </div>

          {/* Classroom Cloud Stats */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-emerald-600" /> สถิติภาพรวมของชั้นเรียน
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                ข้อมูล
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 mt-3">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span>นักเรียนในระบบทั้งหมด</span>
                <span className="font-bold text-slate-800">
                  {classStats?.totalStudents ?? 0} คน
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span>คะแนนเฉลี่ย Pre-Test ชั้นเรียน</span>
                <span className="font-bold text-slate-800">
                  {classStats?.avgPreTest !== null ? `${classStats?.avgPreTest}/10` : '-'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span>คะแนนเฉลี่ย Post-Test ชั้นเรียน</span>
                <span className="font-bold text-purple-700">
                  {classStats?.avgPostTest !== null ? `${classStats?.avgPostTest}/10` : '-'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span>อัตราการพัฒนาเฉลี่ย (Avg. Gain)</span>
                <span className="font-bold text-emerald-600">
                  {classStats?.avgGainRate !== null ? `+${classStats?.avgGainRate}%` : '-'}
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('leaderboard')}
              className="w-full mt-4 py-2 px-3 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition flex items-center justify-center gap-1.5"
            >
              <Trophy className="w-3.5 h-3.5 text-emerald-600" /> ดูตารางจัดอันดับชั้นเรียนทั้งหมด
            </button>
          </div>

          {/* Quick FAQ / Help Note */}
          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 text-xs text-sky-900 space-y-1">
            <div className="font-semibold flex items-center gap-1 text-sky-800">
              <HelpCircle className="w-3.5 h-3.5" /> รู้หรือไม่?
            </div>
            <p className="text-sky-700 leading-relaxed">
              ใน Python คำสั่ง <code className="font-mono bg-sky-100 px-1 py-0.5 rounded text-[11px]">type(15 / 3)</code> จะได้ชนิด <code className="font-mono bg-sky-100 px-1 py-0.5 rounded text-[11px]">float</code> (5.0) เสมอ แม้จะหารลงตัวก็ตาม!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
