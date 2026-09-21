import React from 'react';
import {
  Code,
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  Gamepad2,
  Trophy,
  User,
  Radio,
  Globe
} from 'lucide-react';
import { ActiveTab, StudentProfile } from '../types';

interface Props {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  profile: StudentProfile | null;
  onEditProfile: () => void;
  onOpenProfileDetail?: () => void;
  onOpenGitHubPagesModal?: () => void;
  totalPoints: number;
  isOnline: boolean;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  profile,
  onEditProfile,
  onOpenProfileDetail,
  onOpenGitHubPagesModal,
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg text-slate-800 tracking-tight">Python ม.4</span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold bg-emerald-100 text-emerald-800 rounded-full">
                  ตัวแปร & ชนิดข้อมูล
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                โรงเรียนมัธยมวาริชภูมิ
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-500'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Student Status & Profile Pill */}
          <div className="flex items-center gap-2">
            {/* Direct Web & GitHub Pages Link Button */}
            {onOpenGitHubPagesModal && (
              <button
                onClick={onOpenGitHubPagesModal}
                title="ลิงก์หน้าเว็บ & GitHub Pages"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200/90 bg-white hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 text-slate-700 text-xs font-semibold shadow-2xs transition"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">ลิงก์หน้าเว็บ</span>
              </button>
            )}

            {/* Live Status */}
            <div
              title={isOnline ? 'เชื่อมต่อระบบแล้ว' : 'กำลังเชื่อมต่อ...'}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border bg-emerald-50/80 text-emerald-800 border-emerald-200/70"
            >
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
              <span>{isOnline ? 'ออนไลน์' : 'เชื่อมต่อ...'}</span>
            </div>

            {/* Student Profile Card */}
            {profile ? (
              <button
                onClick={onOpenProfileDetail || onEditProfile}
                title="คลิกเพื่อดูโปรไฟล์ส่วนตัวของคุณ"
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50/60 hover:border-emerald-200 transition text-left cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-600 group-hover:bg-emerald-700 text-white flex items-center justify-center font-bold text-xs transition">
                  {profile.name.charAt(0)}
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-slate-800 group-hover:text-emerald-900 max-w-[90px] sm:max-w-[120px] truncate">
                    {profile.name}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {profile.classroom} {profile.studentNo !== '-' ? `เลขที่ ${profile.studentNo}` : ''}
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1 pl-1 text-[11px] font-bold text-amber-600">
                  <span>★</span>
                  <span>{totalPoints}</span>
                </div>
              </button>
            ) : (
              <button
                onClick={onEditProfile}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition"
              >
                <User className="w-3.5 h-3.5" /> กรอกข้อมูลผู้เรียน
              </button>
            )}
          </div>
        </div>

        {/* Mobile / Tablet Horizontal Scrollable Nav */}
        <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
