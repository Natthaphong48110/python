import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { StudentProfileModal } from './components/StudentProfileModal';
import { StudentProfileDetailModal } from './components/StudentProfileDetailModal';
import { DashboardView } from './components/DashboardView';
import { LessonsView } from './components/LessonsView';
import { QuizView } from './components/QuizView';
import { MiniGamesView } from './components/MiniGamesView';
import { LeaderboardView } from './components/LeaderboardView';
import { GitHubPagesModal } from './components/GitHubPagesModal';
import { PRE_TEST_QUESTIONS, POST_TEST_QUESTIONS } from './data/quizQuestions';
import {
  StudentProfile,
  StudentLeaderboardEntry,
  ActiveTab,
  QuizType
} from './types';
import {
  getStoredProfile,
  saveStoredProfile,
  clearStoredProfile,
  fetchLeaderboard,
  fetchStats,
  submitScoreToCloud,
  deleteStudent,
  resetAllStudents,
  subscribeToLeaderboardStream
} from './services/api';
import { Sparkles, CheckCircle, Globe } from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isProfileDetailModalOpen, setIsProfileDetailModalOpen] = useState(false);
  const [isGitHubPagesModalOpen, setIsGitHubPagesModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  const [leaderboard, setLeaderboard] = useState<StudentLeaderboardEntry[]>([]);
  const [classStats, setClassStats] = useState<any>(null);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string } | null>(null);

  const showToast = (title: string, desc: string) => {
    setToastMessage({ title, desc });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // 1. Initial Load of profile
  useEffect(() => {
    const saved = getStoredProfile();
    if (saved) {
      setProfile(saved);
    } else {
      // If no profile yet, open modal after brief delay
      setIsProfileModalOpen(true);
    }
  }, []);

  // 2. Fetch Leaderboard and Stats
  const loadLeaderboardData = useCallback(async () => {
    setIsLoadingLeaderboard(true);
    try {
      const [lbRes, statsRes] = await Promise.all([
        fetchLeaderboard(),
        fetchStats()
      ]);
      if (lbRes.success) {
        setLeaderboard(lbRes.leaderboard);
      }
      if (statsRes) {
        setClassStats(statsRes);
      }
      setIsLiveConnected(true);
    } catch (err) {
      console.error('Failed fetching data', err);
    } finally {
      setIsLoadingLeaderboard(false);
    }
  }, []);

  useEffect(() => {
    loadLeaderboardData();

    // Subscribe to real-time Server-Sent Events (SSE)
    const unsubscribe = subscribeToLeaderboardStream((updatedList) => {
      setLeaderboard(updatedList);
      setIsLiveConnected(true);
    });

    return () => {
      unsubscribe();
    };
  }, [loadLeaderboardData]);

  // Current student record from leaderboard
  const currentStudentRecord = profile
    ? leaderboard.find((s) => s.studentName.trim().toLowerCase() === profile.name.trim().toLowerCase()) || null
    : null;

  const currentRank = currentStudentRecord
    ? leaderboard
        .slice()
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .findIndex((s) => s.id === currentStudentRecord.id) + 1
    : null;

  // Handle Save Profile
  const handleSaveProfile = async (newProfile: StudentProfile) => {
    setProfile(newProfile);
    saveStoredProfile(newProfile);
    setIsProfileModalOpen(false);

    // Register on cloud
    const res = await submitScoreToCloud({
      studentName: newProfile.name,
      classroom: newProfile.classroom,
      studentNo: newProfile.studentNo,
      addedPoints: 50, // Welcome bonus XP
      badge: '🎓 ผู้เรียนใหม่ (Python Recruit)'
    });

    if (res.success && res.student) {
      showToast('ยินดีต้อนรับสู่ห้องเรียน!', `ลงทะเบียน ${newProfile.name} (${newProfile.classroom}) เรียบร้อยแล้ว (+50 XP)`);
      loadLeaderboardData();
    }
  };

  // Handle Quiz Finish (Pre-Test / Post-Test)
  const handleFinishQuiz = async (
    quizType: QuizType,
    score: number,
    answers: { questionId: number; isCorrect: boolean }[]
  ) => {
    if (!profile) {
      setIsProfileModalOpen(true);
      return;
    }

    const isPre = quizType === 'pre_test';
    const pointsEarned = score * 20 + 50; // 20 pts per correct answer + 50 completion bonus
    let earnedBadge: string | undefined;

    if (isPre) {
      earnedBadge = '🎯 ทดสอบก่อนเรียน (Pre-test Explorer)';
    } else {
      if (score === 10) {
        earnedBadge = '🏆 ยอดอัจฉริยะ Python (10/10 เต็ม)';
      } else if (score >= 8) {
        earnedBadge = '⭐ ผู้เชี่ยวชาญตัวแปร ม.4 (Distinction)';
      } else if (score >= 6) {
        earnedBadge = '✓ ผ่านเกณฑ์มาตรฐาน ม.4';
      }
    }

    const payload: any = {
      studentName: profile.name,
      classroom: profile.classroom,
      studentNo: profile.studentNo,
      addedPoints: pointsEarned,
      badge: earnedBadge
    };

    if (isPre) {
      payload.preTestScore = score;
    } else {
      payload.postTestScore = score;
    }

    const res = await submitScoreToCloud(payload);
    if (res.success) {
      showToast(
        isPre ? 'บันทึกคะแนน Pre-Test แล้ว' : 'บันทึกคะแนน Post-Test สำเร็จ!',
        `คุณได้ ${score}/10 คะแนน (+${pointsEarned} XP)${earnedBadge ? ` และได้รับตรา '${earnedBadge}'` : ''}`
      );
      loadLeaderboardData();
    }
  };

  // Handle Mini-Game Score Saving
  const handleSaveMiniGameScore = async (
    gameKey: 'sorter' | 'detective' | 'lab',
    score: number,
    points: number,
    badge?: string
  ) => {
    if (!profile) {
      setIsProfileModalOpen(true);
      return;
    }

    const payload: any = {
      studentName: profile.name,
      classroom: profile.classroom,
      studentNo: profile.studentNo,
      addedPoints: points,
      badge
    };

    if (gameKey === 'sorter') payload.sorterScore = score;
    if (gameKey === 'detective') payload.detectiveScore = score;
    if (gameKey === 'lab') payload.labScore = score;

    const res = await submitScoreToCloud(payload);
    if (res.success) {
      showToast('บันทึกคะแนนเกมย่อยแล้ว!', `คะแนนในเกม: ${score} (+${points} XP) อัปเดตลงกระดานคะแนนแล้ว`);
      loadLeaderboardData();
    }
  };

  // Handle Quick Check Points from Lessons
  const handleEarnPoints = async (pts: number, reason: string) => {
    if (!profile) return;
    const res = await submitScoreToCloud({
      studentName: profile.name,
      classroom: profile.classroom,
      studentNo: profile.studentNo,
      addedPoints: pts
    });
    if (res.success) {
      showToast('ได้รับคะแนนพิเศษ!', `${reason} (+${pts} XP)`);
      loadLeaderboardData();
    }
  };

  // Handle Deleting a student profile
  const handleDeleteStudent = async (id: string, name: string): Promise<boolean> => {
    const res = await deleteStudent(id);
    if (res.success) {
      showToast('ลบข้อมูลสำเร็จ', `ลบข้อมูลของ ${name} เรียบร้อยแล้ว`);
      // If deleted student is the currently logged in student, clear local state
      if (profile && profile.name.trim().toLowerCase() === name.trim().toLowerCase()) {
        clearStoredProfile();
        setProfile(null);
        setIsProfileDetailModalOpen(false);
      }
      loadLeaderboardData();
      return true;
    } else {
      showToast('เกิดข้อผิดพลาด', res.error || 'ไม่สามารถลบข้อมูลได้');
      return false;
    }
  };

  // Handle Resetting all students
  const handleResetAllStudents = async (): Promise<boolean> => {
    const res = await resetAllStudents();
    if (res.success) {
      showToast('รีเซ็ตกระดานเรียบร้อย', 'ล้างข้อมูลคะแนนทั้งหมดในกระดานแล้ว');
      clearStoredProfile();
      setProfile(null);
      setIsProfileDetailModalOpen(false);
      loadLeaderboardData();
      return true;
    } else {
      showToast('เกิดข้อผิดพลาด', res.error || 'ไม่สามารถรีเซ็ตกระดานได้');
      return false;
    }
  };

  // Handle Switch Profile
  const handleSwitchProfile = () => {
    setIsProfileDetailModalOpen(false);
    clearStoredProfile();
    setProfile(null);
    setIsProfileModalOpen(true);
    showToast('สลับผู้เรียน', 'กรอกข้อมูลผู้เรียนคนใหม่เพื่อเริ่มบันทึกคะแนน');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Prompt',sans-serif] text-slate-800 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        profile={profile}
        onEditProfile={() => setIsProfileModalOpen(true)}
        onOpenProfileDetail={() => setIsProfileDetailModalOpen(true)}
        onOpenGitHubPagesModal={() => setIsGitHubPagesModalOpen(true)}
        totalPoints={currentStudentRecord?.totalPoints ?? 0}
        isOnline={isLiveConnected}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* VIEW 1: Dashboard */}
        {activeTab === 'dashboard' && (
          <DashboardView
            profile={profile}
            studentData={currentStudentRecord}
            onNavigate={(tab) => setActiveTab(tab)}
            onRegister={() => setIsProfileModalOpen(true)}
            onOpenProfileDetail={() => setIsProfileDetailModalOpen(true)}
            classStats={classStats}
            rank={currentRank}
          />
        )}

        {/* VIEW 2: Interactive Lessons */}
        {activeTab === 'lessons' && (
          <LessonsView onEarnPoints={handleEarnPoints} />
        )}

        {/* VIEW 3: Pre-Test */}
        {activeTab === 'pre_test' && (
          <QuizView
            type="pre_test"
            questions={PRE_TEST_QUESTIONS}
            profile={profile}
            onFinishQuiz={handleFinishQuiz}
            onNavigateToLessons={() => setActiveTab('lessons')}
            onNavigateToPostTest={() => setActiveTab('post_test')}
          />
        )}

        {/* VIEW 4: Post-Test */}
        {activeTab === 'post_test' && (
          <QuizView
            type="post_test"
            questions={POST_TEST_QUESTIONS}
            profile={profile}
            onFinishQuiz={handleFinishQuiz}
            onNavigateToLessons={() => setActiveTab('lessons')}
          />
        )}

        {/* VIEW 5: Mini-Games */}
        {activeTab === 'games' && (
          <MiniGamesView
            profile={profile}
            onSaveMiniGameScore={handleSaveMiniGameScore}
          />
        )}

        {/* VIEW 6: Cloud Leaderboard */}
        {activeTab === 'leaderboard' && (
          <LeaderboardView
            leaderboard={leaderboard}
            currentProfile={profile}
            onRefresh={loadLeaderboardData}
            isLoading={isLoadingLeaderboard}
            isLive={isLiveConnected}
            onDeleteStudent={handleDeleteStudent}
            onResetAllStudents={handleResetAllStudents}
          />
        )}
      </main>

      {/* Footer Note */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Python ม.4: ตัวแปรและชนิดข้อมูล</span>
            <span>• รายวิชาคอมพิวเตอร์และขั้นตอนวิธี</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsGitHubPagesModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-medium border border-slate-200/80 transition cursor-pointer shadow-2xs"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>ลิงก์หน้าเว็บ & GitHub Pages</span>
            </button>
            <a
              href="https://ais-pre-6jfnroh4nma7f7l6c6xsxm-929164789789.asia-southeast1.run.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
            >
              <span>เปิดหน้าเว็บแยก</span>
              <span className="text-[10px]">↗</span>
            </a>
          </div>
        </div>
      </footer>

      {/* GitHub Pages & Direct Web Link Modal */}
      <GitHubPagesModal
        isOpen={isGitHubPagesModalOpen}
        onClose={() => setIsGitHubPagesModalOpen(false)}
      />

      {/* Profile Registration / Edit Modal */}
      <StudentProfileModal
        isOpen={isProfileModalOpen}
        currentProfile={profile}
        onSave={handleSaveProfile}
        onClose={() => setIsProfileModalOpen(false)}
        canClose={!!profile}
      />

      {/* Student Profile Detail Modal */}
      <StudentProfileDetailModal
        isOpen={isProfileDetailModalOpen}
        onClose={() => setIsProfileDetailModalOpen(false)}
        profile={profile}
        studentData={currentStudentRecord}
        rank={currentRank}
        onEditProfile={() => {
          setIsProfileDetailModalOpen(false);
          setIsProfileModalOpen(true);
        }}
        onSwitchProfile={handleSwitchProfile}
        onDeleteProfile={
          currentStudentRecord
            ? async () => {
                await handleDeleteStudent(
                  currentStudentRecord.id,
                  currentStudentRecord.studentName
                );
              }
            : undefined
        }
      />

      {/* Real-time Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-800 flex items-start gap-3 max-w-sm animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">{toastMessage.title}</div>
            <div className="text-[11px] text-slate-300 mt-0.5">{toastMessage.desc}</div>
          </div>
        </div>
      )}
    </div>
  );
}
