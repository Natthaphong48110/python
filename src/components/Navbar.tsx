import React from 'react';
import {
  Code2,
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  Gamepad2,
  Trophy,
  User,
  Sparkles,
  Wifi
} from 'lucide-react';
import { ActiveTab, StudentProfile } from '../types';

interface Props {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  profile: StudentProfile | null;
  onEditProfile: () => void;
  onOpenProfileDetail?: () => void;
  totalPoints: number;
  isOnline: boolean;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  profile,
  onEditProfile,
  onOpenProfileDetail,
  totalPoints,
  isOnline
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'แดชบอร์ด', icon: LayoutDashboard },
    { id: 'lessons', label: 'บทเรียน', icon: BookOpen },
    { id: 'pre_test', label: 'Pre-Test', icon: ClipboardCheck },
    { id: 'post_test', label: 'Post-Test', icon: ClipboardCheck },
    { id: 'games', label: 'เกมย่อย (3 โหมด)', icon: Gamepad2 },
    { id: 'leaderboard', label: 'จัดอันดับ', icon: Trophy }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand / Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none shrink-0"
            onClick={() => onSelectTab('dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-sm shadow-emerald-600/20">
              <Code2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                  Python <span className="text-emerald-600">ม.4</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-bold bg-emerald-100/80 text-emerald-800 rounded-md border border-emerald-200/60">
                  ตัวแปร & ชนิดข้อมูล
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden md:block">
                โรงเรียนมัธยมวาริชภูมิ • คอมพิวเตอร์และขั้นตอนวิธี
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition flex items-center gap-1.5 cursor-pointer select-none ${
                    isActive
                      ? 'bg-white text-emerald-700 font-bold shadow-xs border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Status & Profile Controls */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Student Profile Card */}
            {profile ? (
              <button
                onClick={onOpenProfileDetail || onEditProfile}
                title="คลิกเพื่อดูรายละเอียดและสถิติโปรไฟล์ของคุณ"
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-2xl border border-slate-200/90 bg-white hover:bg-emerald-50/50 hover:border-emerald-300 transition text-left cursor-pointer group shadow-2xs"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 group-hover:from-emerald-500 group-hover:to-teal-500 text-white flex items-center justify-center font-bold text-xs shadow-2xs transition">
                  {profile.name.charAt(0)}
                </div>
                <div className="text-left leading-tight">
                  <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-800 max-w-[90px] sm:max-w-[130px] truncate">
                    {profile.name}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {profile.classroom} {profile.studentNo !== '-' ? `• เลขที่ ${profile.studentNo}` : ''}
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1 pl-1 text-xs font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/60">
                  <span>★</span>
                  <span>{totalPoints.toLocaleString()}</span>
                </div>
              </button>
            ) : (
              <button
                onClick={onEditProfile}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>ระบุชื่อผู้เรียน</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2.5 border-t border-slate-100 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
