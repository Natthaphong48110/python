import { StudentProfile, StudentLeaderboardEntry } from '../types';

const STORAGE_PROFILE_KEY = 'py_student_profile_v1';
const STORAGE_LOCAL_LOGS_KEY = 'py_student_local_logs_v1';
const STORAGE_STUDENTS_DB_KEY = 'py_local_students_db_v1';

// Initial classmates for โรงเรียนมัธยมวาริชภูมิ ม.4
const INITIAL_WARITCHAPHUM_STUDENTS: StudentLeaderboardEntry[] = [
  {
    id: 'm41_01_กิตติพงษ์',
    studentName: 'นายกิตติพงษ์ วาริช',
    classroom: 'ม.4/1',
    studentNo: '01',
    totalPoints: 1250,
    preTestScore: 4,
    postTestScore: 10,
    gainRate: 100,
    sorterHighScore: 420,
    detectiveHighScore: 350,
    labHighScore: 380,
    badges: ['นักสืบโค้ด Python', 'ผู้พิชิตแบบทดสอบ', 'เทพแห่งการจำแนก'],
    lastActive: new Date(Date.now() - 3600000).toISOString(),
    totalQuizzesTaken: 8
  },
  {
    id: 'm41_08_พิมพ์ชนก',
    studentName: 'นางสาวพิมพ์ชนก สมบูรณ์',
    classroom: 'ม.4/1',
    studentNo: '08',
    totalPoints: 1100,
    preTestScore: 5,
    postTestScore: 9,
    gainRate: 80,
    sorterHighScore: 380,
    detectiveHighScore: 320,
    labHighScore: 300,
    badges: ['ผู้พิชิตแบบทดสอบ', 'กูรูแล็บ Python'],
    lastActive: new Date(Date.now() - 7200000).toISOString(),
    totalQuizzesTaken: 6
  },
  {
    id: 'm42_05_วรวุฒิ',
    studentName: 'นายวรวุฒิ ใจดี',
    classroom: 'ม.4/2',
    studentNo: '05',
    totalPoints: 950,
    preTestScore: 3,
    postTestScore: 8,
    gainRate: 71,
    sorterHighScore: 350,
    detectiveHighScore: 280,
    labHighScore: 220,
    badges: ['ก้าวแรกสู่โปรแกรมเมอร์'],
    lastActive: new Date(Date.now() - 14400000).toISOString(),
    totalQuizzesTaken: 5
  },
  {
    id: 'm42_14_ชลธิชา',
    studentName: 'นางสาวชลธิชา แก้วมณี',
    classroom: 'ม.4/2',
    studentNo: '14',
    totalPoints: 820,
    preTestScore: 4,
    postTestScore: 8,
    gainRate: 67,
    sorterHighScore: 300,
    detectiveHighScore: 260,
    labHighScore: 160,
    badges: ['ผู้พิชิตแบบทดสอบ'],
    lastActive: new Date(Date.now() - 28800000).toISOString(),
    totalQuizzesTaken: 4
  },
  {
    id: 'm43_03_ธนภัทร',
    studentName: 'นายธนภัทร ศรีวิชัย',
    classroom: 'ม.4/3',
    studentNo: '03',
    totalPoints: 750,
    preTestScore: 3,
    postTestScore: 7,
    gainRate: 57,
    sorterHighScore: 280,
    detectiveHighScore: 220,
    labHighScore: 150,
    badges: ['ก้าวแรกสู่โปรแกรมเมอร์'],
    lastActive: new Date(Date.now() - 43200000).toISOString(),
    totalQuizzesTaken: 3
  }
];

// Helper to get local stored students list (for GitHub Pages / Offline mode)
function getLocalStudents(): StudentLeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_STUDENTS_DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed reading local students', e);
  }
  // Initialize with default sample students
  try {
    localStorage.setItem(STORAGE_STUDENTS_DB_KEY, JSON.stringify(INITIAL_WARITCHAPHUM_STUDENTS));
  } catch {}
  return [...INITIAL_WARITCHAPHUM_STUDENTS];
}

// Helper to save local students and trigger cross-component/tab update
function saveLocalStudents(list: StudentLeaderboardEntry[]) {
  try {
    localStorage.setItem(STORAGE_STUDENTS_DB_KEY, JSON.stringify(list));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('py_local_leaderboard_update', { detail: list }));
    }
  } catch (e) {
    console.error('Failed saving local students', e);
  }
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
function sortStudents(records: StudentLeaderboardEntry[]): StudentLeaderboardEntry[] {
  return [...records].sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    if ((b.postTestScore ?? 0) !== (a.postTestScore ?? 0)) return (b.postTestScore ?? 0) - (a.postTestScore ?? 0);
    return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
  });
}

// Fetch leaderboard (Cloud API with seamless GitHub Pages / localStorage fallback)
export async function fetchLeaderboard(classroom?: string): Promise<{
  success: boolean;
  leaderboard: StudentLeaderboardEntry[];
  totalStudents: number;
}> {
  try {
    const url = classroom && classroom !== 'all'
      ? `/api/leaderboard?classroom=${encodeURIComponent(classroom)}`
      : '/api/leaderboard';
    const res = await fetch(url);
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok || contentType.includes('text/html')) {
      throw new Error('Not an API response');
    }
    return await res.json();
  } catch (err) {
    // Fallback to localStorage for GitHub Pages / Static Hosting
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
}

// Fetch classroom statistics
export async function fetchStats() {
  try {
    const res = await fetch('/api/stats');
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok || contentType.includes('text/html')) {
      throw new Error('Not an API response');
    }
    return await res.json();
  } catch (err) {
    // Local fallback for GitHub Pages
    const students = getLocalStudents();
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
}

// Submit score payload to cloud with GitHub Pages local storage fallback
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

  try {
    const res = await fetch('/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok || contentType.includes('text/html')) {
      throw new Error('Not an API response');
    }
    const data = await res.json();
    return data;
  } catch (err) {
    // Local fallback logic (identical to server)
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

    const sorted = sortStudents(list);
    const rank = sorted.findIndex(s => s.id === studentKey) + 1;

    return {
      success: true,
      student,
      currentRank: rank > 0 ? rank : 1
    };
  }
}

// Delete student record
export async function deleteStudent(id: string): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch('/api/student/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok || contentType.includes('text/html')) {
      throw new Error('Not an API response');
    }
    return await res.json();
  } catch (err: any) {
    // Local fallback for GitHub Pages
    let list = getLocalStudents();
    const initialLen = list.length;
    list = list.filter(s => s.id !== id);
    if (list.length === initialLen) {
      return { success: false, error: 'ไม่พบข้อมูลผู้เรียนนี้ในระบบ' };
    }
    saveLocalStudents(list);
    return { success: true, message: 'ลบข้อมูลผู้เรียนเรียบร้อยแล้ว' };
  }
}

// Reset all students
export async function resetAllStudents(): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch('/api/students/reset-all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok || contentType.includes('text/html')) {
      throw new Error('Not an API response');
    }
    return await res.json();
  } catch (err: any) {
    // Local fallback for GitHub Pages
    saveLocalStudents([...INITIAL_WARITCHAPHUM_STUDENTS]);
    return { success: true, message: 'รีเซ็ตข้อมูลกระดานจัดอันดับเป็นค่าเริ่มต้นเรียบร้อยแล้ว' };
  }
}

// Subscribe to real-time updates via Server-Sent Events (SSE) + Local Event Listener for GitHub Pages
export function subscribeToLeaderboardStream(onUpdate: (data: StudentLeaderboardEntry[]) => void) {
  let eventSource: EventSource | null = null;
  let isClosed = false;

  // Local event listener for GitHub Pages / same-browser tab changes
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
  }

  function connect() {
    if (isClosed) return;
    try {
      eventSource = new EventSource('/api/leaderboard/stream');

      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'INIT' && Array.isArray(payload.data)) {
            onUpdate(payload.data);
          } else if (payload.type === 'LEADERBOARD_UPDATE' && Array.isArray(payload.data)) {
            onUpdate(payload.data);
          }
        } catch (e) {
          console.error('Error parsing SSE message', e);
        }
      };

      eventSource.onerror = () => {
        if (eventSource) {
          eventSource.close();
          eventSource = null;
        }
        // If SSE fails (e.g. on GitHub Pages static host), do not crash or spam
        if (!isClosed) {
          setTimeout(connect, 30000);
        }
      };
    } catch (err) {
      // Static host without SSE
    }
  }

  // Attempt connection
  connect();

  return () => {
    isClosed = true;
    if (eventSource) {
      eventSource.close();
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('py_local_leaderboard_update', handleLocalUpdate);
      window.removeEventListener('storage', handleStorageChange);
    }
  };
}
