var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server.ts
var server_exports = {};
module.exports = __toCommonJS(server_exports);
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_vite = require("vite");
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "1mb" }));
var DATA_DIR = import_path.default.join(process.cwd(), "data");
var LEADERBOARD_FILE = import_path.default.join(DATA_DIR, "leaderboard.json");
if (!import_fs.default.existsSync(DATA_DIR)) {
  import_fs.default.mkdirSync(DATA_DIR, { recursive: true });
}
var leaderboardCache = [];
function loadLeaderboard() {
  try {
    if (import_fs.default.existsSync(LEADERBOARD_FILE)) {
      const data = import_fs.default.readFileSync(LEADERBOARD_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading leaderboard file:", err);
  }
  return [];
}
function saveLeaderboard(records) {
  try {
    const tmpFile = `${LEADERBOARD_FILE}.tmp`;
    import_fs.default.writeFileSync(tmpFile, JSON.stringify(records, null, 2), "utf-8");
    import_fs.default.renameSync(tmpFile, LEADERBOARD_FILE);
  } catch (err) {
    console.error("Error saving leaderboard file:", err);
  }
}
leaderboardCache = loadLeaderboard();
var sseClients = /* @__PURE__ */ new Set();
function broadcastLeaderboard() {
  const payload = JSON.stringify({
    type: "LEADERBOARD_UPDATE",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    data: leaderboardCache
  });
  for (const client of sseClients) {
    try {
      client.write(`data: ${payload}

`);
    } catch {
      sseClients.delete(client);
    }
  }
}
function sanitizeText(input, maxLen = 60) {
  if (typeof input !== "string") return "";
  return input.trim().replace(/[<>]/g, "").slice(0, maxLen);
}
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: (/* @__PURE__ */ new Date()).toISOString() });
});
app.get("/api/leaderboard/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();
  res.write(`data: ${JSON.stringify({ type: "INIT", data: leaderboardCache })}

`);
  sseClients.add(res);
  const heartbeat = setInterval(() => {
    try {
      res.write(": heartbeat\n\n");
    } catch {
      clearInterval(heartbeat);
      sseClients.delete(res);
    }
  }, 2e4);
  req.on("close", () => {
    clearInterval(heartbeat);
    sseClients.delete(res);
  });
});
app.get("/api/leaderboard", (req, res) => {
  const classroom = req.query.classroom;
  let records = [...leaderboardCache];
  if (classroom && classroom !== "all") {
    records = records.filter((r) => r.classroom === classroom);
  }
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
app.get("/api/stats", (req, res) => {
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
  const preScores = leaderboardCache.map((s) => s.preTestScore).filter((s) => s !== null);
  const postScores = leaderboardCache.map((s) => s.postTestScore).filter((s) => s !== null);
  const gains = leaderboardCache.map((s) => s.gainRate).filter((g) => g !== null);
  const avgPre = preScores.length > 0 ? (preScores.reduce((a, b) => a + b, 0) / preScores.length).toFixed(1) : null;
  const avgPost = postScores.length > 0 ? (postScores.reduce((a, b) => a + b, 0) / postScores.length).toFixed(1) : null;
  const avgGain = gains.length > 0 ? (gains.reduce((a, b) => a + b, 0) / gains.length).toFixed(1) : null;
  const sorted = [...leaderboardCache].sort((a, b) => b.totalPoints - a.totalPoints);
  const topScorer = sorted[0] || null;
  const classrooms = Array.from(new Set(leaderboardCache.map((s) => s.classroom))).sort();
  res.json({
    totalStudents,
    avgPreTest: avgPre ? parseFloat(avgPre) : null,
    avgPostTest: avgPost ? parseFloat(avgPost) : null,
    avgGainRate: avgGain ? parseFloat(avgGain) : null,
    topScorer: topScorer ? { name: topScorer.studentName, classroom: topScorer.classroom, points: topScorer.totalPoints } : null,
    classrooms
  });
});
app.post("/api/score", (req, res) => {
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
  const sanitizedClassroom = sanitizeText(classroom, 20) || "\u0E21.4/1";
  const sanitizedNo = sanitizeText(studentNo, 10);
  if (!sanitizedName) {
    return res.status(400).json({ error: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E23\u0E30\u0E1A\u0E38\u0E0A\u0E37\u0E48\u0E2D\u0E1C\u0E39\u0E49\u0E40\u0E23\u0E35\u0E22\u0E19" });
  }
  const studentKey = `${sanitizedClassroom}_${sanitizedNo || "x"}_${sanitizedName.toLowerCase().replace(/\s+/g, "")}`;
  let student = leaderboardCache.find((s) => s.id === studentKey);
  const now = (/* @__PURE__ */ new Date()).toISOString();
  if (!student) {
    student = {
      id: studentKey,
      studentName: sanitizedName,
      classroom: sanitizedClassroom,
      studentNo: sanitizedNo || "-",
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
    student.studentName = sanitizedName;
    if (sanitizedNo) student.studentNo = sanitizedNo;
    student.classroom = sanitizedClassroom;
  }
  if (typeof preTestScore === "number" && preTestScore >= 0 && preTestScore <= 10) {
    if (student.preTestScore === null || preTestScore > student.preTestScore) {
      student.preTestScore = preTestScore;
    }
  }
  if (typeof postTestScore === "number" && postTestScore >= 0 && postTestScore <= 10) {
    if (student.postTestScore === null || postTestScore > student.postTestScore) {
      student.postTestScore = postTestScore;
    }
  }
  if (student.preTestScore !== null && student.postTestScore !== null) {
    const pre = student.preTestScore;
    const post = student.postTestScore;
    if (10 - pre > 0) {
      const gain = Math.max(0, Math.round((post - pre) / (10 - pre) * 100));
      student.gainRate = gain;
    } else {
      student.gainRate = post >= pre ? 100 : 0;
    }
  }
  if (typeof sorterScore === "number" && sorterScore > 0) {
    student.sorterHighScore = Math.max(student.sorterHighScore, Math.min(sorterScore, 1e4));
  }
  if (typeof detectiveScore === "number" && detectiveScore > 0) {
    student.detectiveHighScore = Math.max(student.detectiveHighScore, Math.min(detectiveScore, 1e4));
  }
  if (typeof labScore === "number" && labScore > 0) {
    student.labHighScore = Math.max(student.labHighScore, Math.min(labScore, 1e4));
  }
  if (typeof addedPoints === "number" && addedPoints > 0) {
    student.totalPoints += Math.min(Math.round(addedPoints), 1e3);
    student.totalQuizzesTaken += 1;
  }
  if (typeof badge === "string" && badge.trim()) {
    const cleanBadge = sanitizeText(badge, 40);
    if (!student.badges.includes(cleanBadge)) {
      student.badges.push(cleanBadge);
    }
  }
  student.lastActive = now;
  saveLeaderboard(leaderboardCache);
  broadcastLeaderboard();
  return res.json({
    success: true,
    student,
    currentRank: leaderboardCache.sort((a, b) => b.totalPoints - a.totalPoints).findIndex((s) => s.id === studentKey) + 1
  });
});
app.post("/api/student/delete", (req, res) => {
  const { id } = req.body;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E23\u0E30\u0E1A\u0E38\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E39\u0E49\u0E40\u0E23\u0E35\u0E22\u0E19" });
  }
  const initialLen = leaderboardCache.length;
  leaderboardCache = leaderboardCache.filter((s) => s.id !== id);
  if (leaderboardCache.length === initialLen) {
    return res.status(404).json({ error: "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1C\u0E39\u0E49\u0E40\u0E23\u0E35\u0E22\u0E19\u0E19\u0E35\u0E49\u0E43\u0E19\u0E23\u0E30\u0E1A\u0E1A" });
  }
  saveLeaderboard(leaderboardCache);
  broadcastLeaderboard();
  return res.json({
    success: true,
    message: "\u0E25\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1C\u0E39\u0E49\u0E40\u0E23\u0E35\u0E22\u0E19\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22\u0E41\u0E25\u0E49\u0E27",
    remaining: leaderboardCache.length
  });
});
app.post("/api/students/reset-all", (req, res) => {
  leaderboardCache = [];
  saveLeaderboard(leaderboardCache);
  broadcastLeaderboard();
  return res.json({
    success: true,
    message: "\u0E23\u0E35\u0E40\u0E0B\u0E47\u0E15\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1C\u0E39\u0E49\u0E40\u0E23\u0E35\u0E22\u0E19\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22\u0E41\u0E25\u0E49\u0E27"
  });
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
