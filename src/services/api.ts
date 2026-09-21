import { StudentProfile, StudentLeaderboardEntry } from '../types';
import {
  syncStudentToFirestore,
  fetchStudentsFromFirestore,
  subscribeToFirestoreLeaderboard,
  deleteStudentFromFirestore,
  resetAllStudentsFromFirestore
} from './firebase';

// Local storage keys
const STORAGE_PROFILE_KEY = 'py_student_profile_v1';
const STORAGE_LOCAL_LOGS_KEY = 'py_student_local_logs_v1';
const STORAGE_STUDENTS_DB_KEY = 'py_local_students_db_v2';

// Check if running on static host (GitHub Pages)
export const isStaticHost = typeof window !== 'undefined' && (
  window.location.hostname.includes('github.io') ||
  window.location.protocol === 'file:'
);

// Known mock IDs to purge from previous versions if present
const PURGE_MOCK_IDS = new Set([
  'm41_01_กิตติพงษ์',
  'm41_08_พิมพ์ชนก',
  'm42_05_วรวุฒิ',
  'm42_14_ชลธิชา',
  'm43_03_ธนภัทร'
]);

// Helper to get local stored students list (100% real data from active players)
export function getLocalStudents(): StudentLeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_STUDENTS_DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Purge any accidental mock students
        const realOnly = parsed.filter(
          (s) => s && s.id && !PURGE_MOCK_IDS.has(s.id) && !s.studentName?.includes('กิตติพงษ์ วาริช')
        );
        if (realOnly.length !== parsed.length) {
          saveLocalStudents(realOnly);
        }
        return realOnly;
      }
    }
  } catch (e) {
    console.error('Failed reading local students', e);
  }
  return [];
}

// Helper to save local students and trigger cross-component/tab update
export function saveLocalStudents(list: StudentLeaderboardEntry[]) {
  try {
    localStorage.setItem(STORAGE_STUDENTS_DB_KEY, JSON.stringify(list));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('py_local_leaderboard_update', { detail: list }));
      try {
        if (typeof BroadcastChannel !== 'undefined') {
          const bc = new BroadcastChannel('py_leaderboard_channel');
          bc.postMessage({ type: 'UPDATE', list });
          bc.close();
        }
      } catch {}
    }
  } catch (e) {
    console.error('Failed saving local students', e);
  }
}

// Export all student data as JSON string (for teacher backup)
export function exportLeaderboardJson(): string {
  const students = getLocalStudents();
  return JSON.stringify(students, null, 2);
}

// Load stored current user profile
export function getStoredProfile(): StudentProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_PROFILE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading stored profile', e);
  }
  return null;
}

// Save student profile locally
export function saveStoredProfile(profile: StudentProfile) {
  try {
    localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed saving profile', e);
  }
}

// Clear stored student profile locally
export function clearStoredProfile() {
  try {
    localStorage.removeItem(STORAGE_PROFILE_KEY);
    localStorage.removeItem(STORAGE_LOCAL_LOGS_KEY);
  } catch (e) {
    console.error('Failed clearing profile', e);
  }
}

// Helper to sort students list
export function sortStudents(records: StudentLeaderboardEntry[]): StudentLeaderboardEntry[] {
  return [...records].sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    if ((b.postTestScore ?? 0) !== (a.postTestScore ?? 0)) return (b.postTestScore ?? 0) - (a.postTestScore ?? 0);
    return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
  });
}

// Fetch leaderboard (Cloud Firestore first with local storage fallback)
export async function fetchLeaderboard(classroom?: string): Promise<{
  success: boolean;
  leaderboard: StudentLeaderboardEntry[];
  totalStudents: number;
}> {
  try {
    const cloudStudents = await fetchStudentsFromFirestore();
    if (cloudStudents && cloudStudents.length > 0) {
      // Save to local cache
      saveLocalStudents(cloudStudents);
      let records = cloudStudents;
      if (classroom && classroom !== 'all') {
        records = records.filter(r => r.classroom === classroom);
      }
      records = sortStudents(records);
      return {
        success: true,
        leaderboard: records,
        totalStudents: records.length
      };
    }
  } catch (err) {
    console.warn('Could not fetch from Firestore, checking local storage:', err);
  }

  // Local student data fallback
  let records = getLocalStudents();
  if (classroom && classroom !== 'all') {
    records = records.filter(r => r.classroom === classroom);
  }
  records = sortStudents(records);
  return {
    success: true,
    leaderboard: records,
    totalStudents: records.length
  };
}

// Fetch classroom statistics
export async function fetchStats() {
  let students = getLocalStudents();
  try {
    const cloudStudents = await fetchStudentsFromFirestore();
    if (cloudStudents && cloudStudents.length > 0) {
      students = cloudStudents;
      saveLocalStudents(cloudStudents);
    }
  } catch {}

  if (students.length === 0) {
    return {
      totalStudents: 0,
      avgPreTest: null,
      avgPostTest: null,
      avgGainRate: null,
      topScorer: null,
      classrooms: []
    };
  }

  const preScores = students.map(s => s.preTestScore).filter((s): s is number => s !== null && s !== undefined);
  const postScores = students.map(s => s.postTestScore).filter((s): s is number => s !== null && s !== undefined);
  const gains = students.map(s => s.gainRate).filter((g): g is number => g !== null && g !== undefined);

  const avgPre = preScores.length > 0 ? (preScores.reduce((a, b) => a + b, 0) / preScores.length).toFixed(1) : null;
  const avgPost = postScores.length > 0 ? (postScores.reduce((a, b) => a + b, 0) / postScores.length).toFixed(1) : null;
  const avgGain = gains.length > 0 ? (gains.reduce((a, b) => a + b, 0) / gains.length).toFixed(1) : null;

  const sorted = sortStudents(students);
  const topScorer = sorted[0] || null;
  const classrooms = Array.from(new Set(students.map(s => s.classroom))).sort();

  return {
    totalStudents: students.length,
    avgPreTest: avgPre ? parseFloat(avgPre) : null,
    avgPostTest: avgPost ? parseFloat(avgPost) : null,
    avgGainRate: avgGain ? parseFloat(avgGain) : null,
    topScorer: topScorer ? { name: topScorer.studentName, classroom: topScorer.classroom, points: topScorer.totalPoints } : null,
    classrooms
  };
}

// Submit score payload: updates local state AND writes to Firestore in real-time
export async function submitScoreToCloud(payload: {
  studentName: string;
  classroom: string;
  studentNo: string;
  preTestScore?: number;
  postTestScore?: number;
  sorterScore?: number;
  detectiveScore?: number;
  labScore?: number;
  addedPoints?: number;
  badge?: string;
}): Promise<{ success: boolean; student?: StudentLeaderboardEntry; currentRank?: number }> {
  // Always update local audit log
  try {
    const logsRaw = localStorage.getItem(STORAGE_LOCAL_LOGS_KEY);
    const logs = logsRaw ? JSON.parse(logsRaw) : [];
    logs.unshift({
      timestamp: new Date().toISOString(),
      addedPoints: payload.addedPoints || 0,
      badge: payload.badge || null,
      preTest: payload.preTestScore,
      postTest: payload.postTestScore
    });
    localStorage.setItem(STORAGE_LOCAL_LOGS_KEY, JSON.stringify(logs.slice(0, 50)));
  } catch {}

  // Local storage calculation
  const list = getLocalStudents();
  const cleanName = payload.studentName.trim().slice(0, 50);
  const cleanClass = (payload.classroom || 'ม.4/1').trim().slice(0, 20);
  const cleanNo = (payload.studentNo || '-').trim().slice(0, 10);
  const studentKey = `${cleanClass}_${cleanNo || 'x'}_${cleanName.toLowerCase().replace(/\s+/g, '')}`;

  let student = list.find(s => s.id === studentKey);
  const now = new Date().toISOString();

  if (!student) {
    student = {
      id: studentKey,
      studentName: cleanName,
      classroom: cleanClass,
      studentNo: cleanNo,
      totalPoints: 0,
      preTestScore: null,
      postTestScore: null,
      gainRate: null,
      sorterHighScore: 0,
      detectiveHighScore: 0,
      labHighScore: 0,
      badges: [],
      lastActive: now,
      totalQuizzesTaken: 0
    };
    list.push(student);
  } else {
    student.studentName = cleanName;
    student.studentNo = cleanNo;
    student.classroom = cleanClass;
  }

  if (typeof payload.preTestScore === 'number' && payload.preTestScore >= 0 && payload.preTestScore <= 10) {
    if (student.preTestScore === null || payload.preTestScore > student.preTestScore) {
      student.preTestScore = payload.preTestScore;
    }
  }

  if (typeof payload.postTestScore === 'number' && payload.postTestScore >= 0 && payload.postTestScore <= 10) {
    if (student.postTestScore === null || payload.postTestScore > student.postTestScore) {
      student.postTestScore = payload.postTestScore;
    }
  }

  if (student.preTestScore !== null && student.postTestScore !== null) {
    const pre = student.preTestScore;
    const post = student.postTestScore;
    if (10 - pre > 0) {
      student.gainRate = Math.max(0, Math.round(((post - pre) / (10 - pre)) * 100));
    } else {
      student.gainRate = post >= pre ? 100 : 0;
    }
  }

  if (typeof payload.sorterScore === 'number' && payload.sorterScore > 0) {
    student.sorterHighScore = Math.max(student.sorterHighScore, payload.sorterScore);
  }
  if (typeof payload.detectiveScore === 'number' && payload.detectiveScore > 0) {
    student.detectiveHighScore = Math.max(student.detectiveHighScore, payload.detectiveScore);
  }
  if (typeof payload.labScore === 'number' && payload.labScore > 0) {
    student.labHighScore = Math.max(student.labHighScore, payload.labScore);
  }

  if (typeof payload.addedPoints === 'number' && payload.addedPoints > 0) {
    student.totalPoints += Math.round(payload.addedPoints);
    student.totalQuizzesTaken += 1;
  }

  if (payload.badge && payload.badge.trim()) {
    const b = payload.badge.trim();
    if (!student.badges.includes(b)) {
      student.badges.push(b);
    }
  }

  student.lastActive = now;
  saveLocalStudents(list);

  // Sync to Firestore in real time across devices
  syncStudentToFirestore(student).catch((err) => {
    console.warn('Async sync to Firestore error:', err);
  });

  const sorted = sortStudents(list);
  const rank = sorted.findIndex(s => s.id === studentKey) + 1;

  return {
    success: true,
    student,
    currentRank: rank > 0 ? rank : 1
  };
}

// Delete student record from both Firestore and local storage
export async function deleteStudent(id: string): Promise<{ success: boolean; message?: string; error?: string }> {
  // Delete from Firestore
  try {
    await deleteStudentFromFirestore(id);
  } catch (err) {
    console.warn('Failed deleting from Firestore:', err);
  }

  // Delete from local storage
  let list = getLocalStudents();
  const initialLen = list.length;
  list = list.filter(s => s.id !== id);
  if (list.length === initialLen) {
    return { success: false, error: 'ไม่พบข้อมูลผู้เรียนนี้ในระบบ' };
  }
  saveLocalStudents(list);
  return { success: true, message: 'ลบข้อมูลผู้เรียนเรียบร้อยแล้ว' };
}

// Reset all students from both Firestore and local storage
export async function resetAllStudents(): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    await resetAllStudentsFromFirestore();
  } catch (err) {
    console.warn('Failed resetting Firestore:', err);
  }

  saveLocalStudents([]);
  try {
    localStorage.removeItem('py_local_students_db_v1');
  } catch {}
  return { success: true, message: 'ล้างข้อมูลกระดานจัดอันดับเรียบร้อยแล้ว' };
}

// Subscribe to real-time updates via Cloud Firestore + Cross-tab listener
export function subscribeToLeaderboardStream(onUpdate: (data: StudentLeaderboardEntry[]) => void) {
  let broadcastChannel: BroadcastChannel | null = null;

  // Local event listener for same-browser tab changes
  const handleLocalUpdate = (e: any) => {
    if (e?.detail && Array.isArray(e.detail)) {
      onUpdate(sortStudents(e.detail));
    } else {
      onUpdate(sortStudents(getLocalStudents()));
    }
  };

  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === STORAGE_STUDENTS_DB_KEY) {
      onUpdate(sortStudents(getLocalStudents()));
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('py_local_leaderboard_update', handleLocalUpdate);
    window.addEventListener('storage', handleStorageChange);
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        broadcastChannel = new BroadcastChannel('py_leaderboard_channel');
        broadcastChannel.onmessage = (event) => {
          if (event.data?.type === 'UPDATE' && Array.isArray(event.data.list)) {
            onUpdate(sortStudents(event.data.list));
          } else {
            onUpdate(sortStudents(getLocalStudents()));
          }
        };
      }
    } catch {}
  }

  // Subscribe to Cloud Firestore real-time updates across ALL devices
  const unsubscribeFirestore = subscribeToFirestoreLeaderboard((cloudStudents) => {
    if (cloudStudents && cloudStudents.length >= 0) {
      saveLocalStudents(cloudStudents);
      onUpdate(sortStudents(cloudStudents));
    }
  });

  return () => {
    if (unsubscribeFirestore) {
      unsubscribeFirestore();
    }
    if (broadcastChannel) {
      broadcastChannel.close();
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('py_local_leaderboard_update', handleLocalUpdate);
      window.removeEventListener('storage', handleStorageChange);
    }
  };
}
