import { StudentProfile, StudentLeaderboardEntry } from '../types';

const STORAGE_PROFILE_KEY = 'py_student_profile_v1';
const STORAGE_LOCAL_LOGS_KEY = 'py_student_local_logs_v1';

// Load stored student profile
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

// Fetch leaderboard from cloud
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
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Leaderboard API fetch failed, falling back:', err);
    return { success: false, leaderboard: [], totalStudents: 0 };
  }
}

// Fetch classroom statistics
export async function fetchStats() {
  try {
    const res = await fetch('/api/stats');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Stats API fetch failed:', err);
    return null;
  }
}

// Submit score payload to cloud
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
  try {
    const res = await fetch('/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // Cache local audit log
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

    return data;
  } catch (err) {
    console.error('Failed to submit score:', err);
    return { success: false };
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
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err: any) {
    console.error('Failed deleting student:', err);
    return { success: false, error: err?.message || 'เกิดข้อผิดพลาดในการลบ' };
  }
}

// Reset all students
export async function resetAllStudents(): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch('/api/students/reset-all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err: any) {
    console.error('Failed resetting all students:', err);
    return { success: false, error: err?.message || 'เกิดข้อผิดพลาดในการรีเซ็ต' };
  }
}

// Subscribe to real-time updates via Server-Sent Events (SSE)
export function subscribeToLeaderboardStream(onUpdate: (data: StudentLeaderboardEntry[]) => void) {
  let eventSource: EventSource | null = null;
  let isClosed = false;

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
        // Retry after 5 seconds if not closed
        if (!isClosed) {
          setTimeout(connect, 5000);
        }
      };
    } catch (err) {
      console.warn('SSE not available or failed to connect:', err);
    }
  }

  connect();

  return () => {
    isClosed = true;
    if (eventSource) {
      eventSource.close();
    }
  };
}
