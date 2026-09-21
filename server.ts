import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '1mb' }));

// Ensure data directory exists
const DATA_DIR = path.join(process.cwd(), 'data');
const LEADERBOARD_FILE = path.join(DATA_DIR, 'leaderboard.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export interface StudentScoreRecord {
  id: string; // unique student identifier (e.g. name + classroom + no or uuid)
  studentName: string;
  classroom: string;
  studentNo: string;
  totalPoints: number;
  preTestScore: number | null; // 0-10 or null
  postTestScore: number | null; // 0-10 or null
  gainRate: number | null; // percentage improvement
  sorterHighScore: number;
  detectiveHighScore: number;
  labHighScore: number;
  badges: string[];
  lastActive: string;
  totalQuizzesTaken: number;
}

// In-memory cache synced with disk
let leaderboardCache: StudentScoreRecord[] = [];

// Load leaderboard from disk
function loadLeaderboard(): StudentScoreRecord[] {
  try {
    if (fs.existsSync(LEADERBOARD_FILE)) {
      const data = fs.readFileSync(LEADERBOARD_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading leaderboard file:', err);
  }
  return [];
}

// Save leaderboard atomically to disk
function saveLeaderboard(records: StudentScoreRecord[]) {
  try {
    const tmpFile = `${LEADERBOARD_FILE}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(records, null, 2), 'utf-8');
    fs.renameSync(tmpFile, LEADERBOARD_FILE);
  } catch (err) {
    console.error('Error saving leaderboard file:', err);
  }
}

leaderboardCache = loadLeaderboard();

// SSE (Server-Sent Events) clients for real-time live push updates
type SSEClient = express.Response;
const sseClients: Set<SSEClient> = new Set();

function broadcastLeaderboard() {
  const payload = JSON.stringify({
    type: 'LEADERBOARD_UPDATE',
    timestamp: new Date().toISOString(),
    data: leaderboardCache
  });

  for (const client of sseClients) {
    try {
      client.write(`data: ${payload}\n\n`);
    } catch {
      sseClients.delete(client);
    }
  }
}

// Helper: Sanitize string input to prevent XSS / injection
function sanitizeText(input: unknown, maxLen = 60): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '')
    .slice(0, maxLen);
}

// ---------------- API ROUTES ----------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Real-time SSE Stream
app.get('/api/leaderboard/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  // Send initial data immediately
  res.write(`data: ${JSON.stringify({ type: 'INIT', data: leaderboardCache })}\n\n`);

  sseClients.add(res);

  // Keep-alive heartbeat every 20s
  const heartbeat = setInterval(() => {
    try {
      res.write(': heartbeat\n\n');
    } catch {
      clearInterval(heartbeat);
      sseClients.delete(res);
    }
  }, 20000);

  req.on('close', () => {
    clearInterval(heartbeat);
    sseClients.delete(res);
  });
});

// Get Leaderboard data
app.get('/api/leaderboard', (req, res) => {
  const classroom = req.query.classroom as string | undefined;
  let records = [...leaderboardCache];

  if (classroom && classroom !== 'all') {
    records = records.filter(r => r.classroom === classroom);
  }

  // Sort by totalPoints descending, then postTestScore descending, then lastActive
  records.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    if ((b.postTestScore ?? 0) !== (a.postTestScore ?? 0)) return (b.postTestScore ?? 0) - (a.postTestScore ?? 0);
    return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
  });

  res.json({
    success: true,
    totalStudents: records.length,
    leaderboard: records
  });
});

// Classroom statistics overview
app.get('/api/stats', (req, res) => {
  const totalStudents = leaderboardCache.length;
  if (totalStudents === 0) {
    return res.json({
      totalStudents: 0,
      avgPreTest: null,
      avgPostTest: null,
      avgGainRate: null,
      topScorer: null,
      classrooms: []
    });
  }

  const preScores = leaderboardCache.map(s => s.preTestScore).filter((s): s is number => s !== null);
  const postScores = leaderboardCache.map(s => s.postTestScore).filter((s): s is number => s !== null);
  const gains = leaderboardCache.map(s => s.gainRate).filter((g): g is number => g !== null);

  const avgPre = preScores.length > 0 ? (preScores.reduce((a, b) => a + b, 0) / preScores.length).toFixed(1) : null;
  const avgPost = postScores.length > 0 ? (postScores.reduce((a, b) => a + b, 0) / postScores.length).toFixed(1) : null;
  const avgGain = gains.length > 0 ? (gains.reduce((a, b) => a + b, 0) / gains.length).toFixed(1) : null;

  const sorted = [...leaderboardCache].sort((a, b) => b.totalPoints - a.totalPoints);
  const topScorer = sorted[0] || null;

  const classrooms = Array.from(new Set(leaderboardCache.map(s => s.classroom))).sort();

  res.json({
    totalStudents,
    avgPreTest: avgPre ? parseFloat(avgPre) : null,
    avgPostTest: avgPost ? parseFloat(avgPost) : null,
    avgGainRate: avgGain ? parseFloat(avgGain) : null,
    topScorer: topScorer ? { name: topScorer.studentName, classroom: topScorer.classroom, points: topScorer.totalPoints } : null,
    classrooms
  });
});

// Submit / Update student score
app.post('/api/score', (req, res) => {
  const {
    studentName,
    classroom,
    studentNo,
    preTestScore,
    postTestScore,
    sorterScore,
    detectiveScore,
    labScore,
    addedPoints,
    badge
  } = req.body;

  const sanitizedName = sanitizeText(studentName, 50);
  const sanitizedClassroom = sanitizeText(classroom, 20) || 'ม.4/1';
  const sanitizedNo = sanitizeText(studentNo, 10);

  if (!sanitizedName) {
    return res.status(400).json({ error: 'กรุณาระบุชื่อผู้เรียน' });
  }

  // Generate consistent deterministic ID per student in classroom
  const studentKey = `${sanitizedClassroom}_${sanitizedNo || 'x'}_${sanitizedName.toLowerCase().replace(/\s+/g, '')}`;

  let student = leaderboardCache.find(s => s.id === studentKey);
  const now = new Date().toISOString();

  if (!student) {
    student = {
      id: studentKey,
      studentName: sanitizedName,
      classroom: sanitizedClassroom,
      studentNo: sanitizedNo || '-',
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
    leaderboardCache.push(student);
  } else {
    // Keep name & no updated if student polished their profile
    student.studentName = sanitizedName;
    if (sanitizedNo) student.studentNo = sanitizedNo;
    student.classroom = sanitizedClassroom;
  }

  // Update pre-test if provided (only keep best/valid 0-10)
  if (typeof preTestScore === 'number' && preTestScore >= 0 && preTestScore <= 10) {
    if (student.preTestScore === null || preTestScore > student.preTestScore) {
      student.preTestScore = preTestScore;
    }
  }

  // Update post-test if provided (0-10)
  if (typeof postTestScore === 'number' && postTestScore >= 0 && postTestScore <= 10) {
    if (student.postTestScore === null || postTestScore > student.postTestScore) {
      student.postTestScore = postTestScore;
    }
  }

  // Calculate learning gain rate (Normalized Gain: (post - pre) / (10 - pre) * 100)
  if (student.preTestScore !== null && student.postTestScore !== null) {
    const pre = student.preTestScore;
    const post = student.postTestScore;
    if (10 - pre > 0) {
      const gain = Math.max(0, Math.round(((post - pre) / (10 - pre)) * 100));
      student.gainRate = gain;
    } else {
      student.gainRate = post >= pre ? 100 : 0;
    }
  }

  // Mini-game scores
  if (typeof sorterScore === 'number' && sorterScore > 0) {
    student.sorterHighScore = Math.max(student.sorterHighScore, Math.min(sorterScore, 10000));
  }
  if (typeof detectiveScore === 'number' && detectiveScore > 0) {
    student.detectiveHighScore = Math.max(student.detectiveHighScore, Math.min(detectiveScore, 10000));
  }
  if (typeof labScore === 'number' && labScore > 0) {
    student.labHighScore = Math.max(student.labHighScore, Math.min(labScore, 10000));
  }

  // Add points with reasonable ceiling protection
  if (typeof addedPoints === 'number' && addedPoints > 0) {
    student.totalPoints += Math.min(Math.round(addedPoints), 1000);
    student.totalQuizzesTaken += 1;
  }

  // Add badge
  if (typeof badge === 'string' && badge.trim()) {
    const cleanBadge = sanitizeText(badge, 40);
    if (!student.badges.includes(cleanBadge)) {
      student.badges.push(cleanBadge);
    }
  }

  student.lastActive = now;

  // Save to disk
  saveLeaderboard(leaderboardCache);

  // Broadcast real-time update
  broadcastLeaderboard();

  return res.json({
    success: true,
    student,
    currentRank: leaderboardCache
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .findIndex(s => s.id === studentKey) + 1
  });
});

// Delete specific student
app.post('/api/student/delete', (req, res) => {
  const { id } = req.body;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'กรุณาระบุรหัสผู้เรียน' });
  }

  const initialLen = leaderboardCache.length;
  leaderboardCache = leaderboardCache.filter(s => s.id !== id);

  if (leaderboardCache.length === initialLen) {
    return res.status(404).json({ error: 'ไม่พบข้อมูลผู้เรียนนี้ในระบบ' });
  }

  saveLeaderboard(leaderboardCache);
  broadcastLeaderboard();

  return res.json({
    success: true,
    message: 'ลบข้อมูลผู้เรียนเรียบร้อยแล้ว',
    remaining: leaderboardCache.length
  });
});

// Reset all student data (e.g. for teachers clearing test records)
app.post('/api/students/reset-all', (req, res) => {
  leaderboardCache = [];
  saveLeaderboard(leaderboardCache);
  broadcastLeaderboard();
  return res.json({
    success: true,
    message: 'รีเซ็ตข้อมูลผู้เรียนทั้งหมดเรียบร้อยแล้ว'
  });
});

// Start Server with Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
