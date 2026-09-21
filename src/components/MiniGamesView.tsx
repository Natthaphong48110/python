import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  Boxes,
  Search,
  FlaskConical,
  Flame,
  Timer,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import {
  SORTER_ITEMS,
  DETECTIVE_ITEMS,
  LAB_CHALLENGES,
  SorterItem,
  DetectiveItem,
  LabChallenge
} from '../data/miniGamesData';
import { StudentProfile } from '../types';

interface Props {
  profile: StudentProfile | null;
  onSaveMiniGameScore: (gameKey: 'sorter' | 'detective' | 'lab', score: number, points: number, badge?: string) => void;
}

type MiniGameMode = 'sorter' | 'detective' | 'lab';

export const MiniGamesView: React.FC<Props> = ({ profile, onSaveMiniGameScore }) => {
  const [activeGame, setActiveGame] = useState<MiniGameMode>('sorter');

  // ---------- Game 1: Sorter State ----------
  const [sorterIndex, setSorterIndex] = useState(0);
  const [sorterScore, setSorterScore] = useState(0);
  const [sorterCombo, setSorterCombo] = useState(0);
  const [sorterTimer, setSorterTimer] = useState(60);
  const [sorterIsPlaying, setSorterIsPlaying] = useState(false);
  const [sorterFeedback, setSorterFeedback] = useState<{ isCorrect: boolean; explanation: string } | null>(null);
  const [sorterFinished, setSorterFinished] = useState(false);

  // ---------- Game 2: Detective State ----------
  const [detectiveIndex, setDetectiveIndex] = useState(0);
  const [detectiveScore, setDetectiveScore] = useState(0);
  const [detectiveFeedback, setDetectiveFeedback] = useState<{ isCorrect: boolean; reason: string } | null>(null);
  const [detectiveFinished, setDetectiveFinished] = useState(false);

  // ---------- Game 3: Lab State ----------
  const [labIndex, setLabIndex] = useState(0);
  const [labScore, setLabScore] = useState(0);
  const [labFeedback, setLabFeedback] = useState<{ isCorrect: boolean; explanation: string } | null>(null);
  const [labFinished, setLabFinished] = useState(false);

  // Timer loop for Sorter game
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sorterIsPlaying && sorterTimer > 0) {
      interval = setInterval(() => {
        setSorterTimer((prev) => prev - 1);
      }, 1000);
    } else if (sorterIsPlaying && sorterTimer === 0) {
      setSorterIsPlaying(false);
      setSorterFinished(true);
      const earnedXP = sorterScore * 5;
      const badge = sorterScore >= 500 ? '⚡ เซียนแยกชนิดข้อมูล (Sorter Master)' : undefined;
      onSaveMiniGameScore('sorter', sorterScore, earnedXP, badge);
    }
    return () => clearInterval(interval);
  }, [sorterIsPlaying, sorterTimer, sorterScore, onSaveMiniGameScore]);

  // Handle Sorter Answer
  const handleSorterAnswer = (chosenType: 'int' | 'float' | 'str' | 'bool') => {
    if (!sorterIsPlaying) return;
    const currentItem = SORTER_ITEMS[sorterIndex % SORTER_ITEMS.length];
    const isCorrect = currentItem.expectedType === chosenType;

    if (isCorrect) {
      const newCombo = sorterCombo + 1;
      const points = 50 + (newCombo * 10);
      setSorterScore((prev) => prev + points);
      setSorterCombo(newCombo);
      setSorterFeedback({ isCorrect: true, explanation: `ถูกต้อง! ${currentItem.explanation}` });
    } else {
      setSorterCombo(0);
      setSorterFeedback({ isCorrect: false, explanation: `ผิดพลาด! ${currentItem.explanation}` });
    }

    setTimeout(() => {
      setSorterFeedback(null);
      setSorterIndex((prev) => prev + 1);
    }, 700);
  };

  const startSorterGame = () => {
    setSorterIndex(0);
    setSorterScore(0);
    setSorterCombo(0);
    setSorterTimer(60);
    setSorterFeedback(null);
    setSorterFinished(false);
    setSorterIsPlaying(true);
  };

  // Handle Detective Answer
  const handleDetectiveAnswer = (chosenValid: boolean) => {
    if (detectiveFeedback) return;
    const currentItem = DETECTIVE_ITEMS[detectiveIndex];
    const isCorrect = currentItem.isValid === chosenValid;

    if (isCorrect) {
      setDetectiveScore((prev) => prev + 100);
      setDetectiveFeedback({ isCorrect: true, reason: currentItem.reason });
    } else {
      setDetectiveFeedback({ isCorrect: false, reason: currentItem.reason });
    }
  };

  const nextDetectiveQuestion = () => {
    setDetectiveFeedback(null);
    if (detectiveIndex < DETECTIVE_ITEMS.length - 1) {
      setDetectiveIndex((prev) => prev + 1);
    } else {
      setDetectiveFinished(true);
      const earnedXP = detectiveScore;
      const badge = detectiveScore >= 800 ? '🕵️ ยอดนักสืบไวยากรณ์ (Detective Ace)' : undefined;
      onSaveMiniGameScore('detective', detectiveScore, earnedXP, badge);
    }
  };

  const restartDetectiveGame = () => {
    setDetectiveIndex(0);
    setDetectiveScore(0);
    setDetectiveFeedback(null);
    setDetectiveFinished(false);
  };

  // Handle Lab Answer
  const handleLabAnswer = (isCorrect: boolean) => {
    if (labFeedback) return;
    const currentItem = LAB_CHALLENGES[labIndex];

    if (isCorrect) {
      setLabScore((prev) => prev + 100);
      setLabFeedback({ isCorrect: true, explanation: currentItem.explanation });
    } else {
      setLabFeedback({ isCorrect: false, explanation: currentItem.explanation });
    }
  };

  const nextLabQuestion = () => {
    setLabFeedback(null);
    if (labIndex < LAB_CHALLENGES.length - 1) {
      setLabIndex((prev) => prev + 1);
    } else {
      setLabFinished(true);
      const earnedXP = labScore;
      const badge = labScore >= 400 ? '🧪 นักทดลองแปลงค่า (Casting Specialist)' : undefined;
      onSaveMiniGameScore('lab', labScore, earnedXP, badge);
    }
  };

  const restartLabGame = () => {
    setLabIndex(0);
    setLabScore(0);
    setLabFeedback(null);
    setLabFinished(false);
  };

  return (
    <div className="space-y-6">
      {/* Game Selector Tabs */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 mb-1">
              <Gamepad2 className="w-3.5 h-3.5" /> ศูนย์ฝึกทักษะด้วยเกมย่อย (Mini-Games)
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              เรียนรู้ผ่านเกมสนุกๆ พร้อมสะสมคะแนนขึ้นกระดานผู้นำ
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4">
          <button
            onClick={() => setActiveGame('sorter')}
            className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 ${
              activeGame === 'sorter'
                ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${
              activeGame === 'sorter' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'
            }`}>
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold">เกมที่ 1: คัดแยกชนิดข้อมูล</div>
              <div className={`text-[11px] ${activeGame === 'sorter' ? 'text-amber-100' : 'text-slate-500'}`}>
                Data Type Sorter (60 วิ)
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveGame('detective')}
            className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 ${
              activeGame === 'detective'
                ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${
              activeGame === 'detective' ? 'bg-white/20 text-white' : 'bg-teal-100 text-teal-700'
            }`}>
              <Search className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold">เกมที่ 2: จับผิดชื่อตัวแปร</div>
              <div className={`text-[11px] ${activeGame === 'detective' ? 'text-teal-100' : 'text-slate-500'}`}>
                Naming Detective (10 ข้อ)
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveGame('lab')}
            className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 ${
              activeGame === 'lab'
                ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${
              activeGame === 'lab' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-700'
            }`}>
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold">เกมที่ 3: ห้องทดลองแปลงค่า</div>
              <div className={`text-[11px] ${activeGame === 'lab' ? 'text-purple-100' : 'text-slate-500'}`}>
                Type Casting Lab
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* ================= GAME 1: DATA TYPE SORTER ================= */}
      {activeGame === 'sorter' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs max-w-2xl mx-auto space-y-6 text-center">
          {!sorterIsPlaying && !sorterFinished && (
            <div className="space-y-4 py-8">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
                <Boxes className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">เกมคัดแยกชนิดข้อมูล (Data Type Sorter)</h2>
              <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                ฝึกแยกแยะชนิดข้อมูลภาษา Python ทั้ง 4 ชนิด (<code className="font-mono text-amber-700">int</code>, <code className="font-mono text-amber-700">float</code>, <code className="font-mono text-amber-700">str</code>, <code className="font-mono text-amber-700">bool</code>) แข่งกับเวลา 60 วินาที พร้อมสะสม Combo Multiplier!
              </p>
              <button
                onClick={startSorterGame}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-md shadow-amber-500/20 transition cursor-pointer"
              >
                เริ่มเล่นเลย (Start Game)
              </button>
            </div>
          )}

          {sorterIsPlaying && (
            <div className="space-y-6">
              {/* Game HUD */}
              <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 text-slate-700 text-sm font-semibold">
                  <Timer className="w-4 h-4 text-amber-600" />
                  <span>เวลา: <strong className="text-slate-900">{sorterTimer} วินาที</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  {sorterCombo > 1 && (
                    <span className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-100 px-2.5 py-0.5 rounded-full animate-bounce">
                      <Flame className="w-3.5 h-3.5" /> Combo x{sorterCombo}
                    </span>
                  )}
                  <span className="text-sm font-bold text-amber-700">
                    คะแนน: {sorterScore}
                  </span>
                </div>
              </div>

              {/* Falling / Display Card */}
              <div className="min-h-[160px] flex flex-col items-center justify-center p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-inner relative overflow-hidden">
                <span className="text-xs text-slate-400 mb-2">ค่านี้จัดเป็นชนิดข้อมูลใดใน Python?</span>
                <div className="font-mono text-3xl sm:text-4xl font-bold tracking-wider text-emerald-400">
                  {SORTER_ITEMS[sorterIndex % SORTER_ITEMS.length].expression}
                </div>

                {sorterFeedback && (
                  <div className={`absolute inset-0 flex items-center justify-center p-4 text-center font-bold text-sm backdrop-blur-xs transition ${
                    sorterFeedback.isCorrect ? 'bg-emerald-900/90 text-emerald-200' : 'bg-rose-900/90 text-rose-200'
                  }`}>
                    {sorterFeedback.explanation}
                  </div>
                )}
              </div>

              {/* 4 Type Selection Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {[
                  { type: 'int', label: 'int (จำนวนเต็ม)', color: 'border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100' },
                  { type: 'float', label: 'float (ทศนิยม)', color: 'border-teal-200 bg-teal-50 text-teal-800 hover:bg-teal-100' },
                  { type: 'str', label: 'str (ข้อความ)', color: 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100' },
                  { type: 'bool', label: 'bool (ค่าความจริง)', color: 'border-purple-200 bg-purple-50 text-purple-800 hover:bg-purple-100' },
                ].map((btn) => (
                  <button
                    key={btn.type}
                    onClick={() => handleSorterAnswer(btn.type as any)}
                    className={`py-4 px-4 rounded-xl border text-sm font-bold shadow-xs active:scale-95 transition ${btn.color}`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {sorterFinished && (
            <div className="space-y-4 py-8 animate-in fade-in">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
                <Trophy className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">หมดเวลาแล้ว!</h2>
              <div className="text-3xl font-bold text-amber-600">
                {sorterScore} คะแนน
              </div>
              <p className="text-xs text-slate-500">
                ✓ บันทึกคะแนนเข้าสู่ระบบจัดอันดับเรียบร้อยแล้ว
              </p>
              <button
                onClick={startSorterGame}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition"
              >
                เล่นใหม่อีกรอบ
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= GAME 2: NAMING DETECTIVE ================= */}
      {activeGame === 'detective' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs max-w-2xl mx-auto space-y-6">
          {!detectiveFinished ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">
                    ข้อที่ {detectiveIndex + 1} จาก {DETECTIVE_ITEMS.length}
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                    ชื่อตัวแปรนี้ "ถูกต้องตามกฎ" หรือไม่?
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500">คะแนนสะสม</span>
                  <div className="text-lg font-bold text-teal-700">{detectiveScore}</div>
                </div>
              </div>

              {/* Variable Display Box */}
              <div className="p-8 bg-slate-900 text-center rounded-2xl border border-slate-800 shadow-inner">
                <span className="text-xs text-slate-400 block mb-2 font-sans">ชื่อตัวแปรที่ต้องตรวจสอบ</span>
                <div className="font-mono text-3xl font-bold text-teal-300">
                  {DETECTIVE_ITEMS[detectiveIndex].varName}
                </div>
              </div>

              {/* Feedback box */}
              {detectiveFeedback && (
                <div className={`p-4 rounded-xl text-xs sm:text-sm border space-y-1 animate-in fade-in ${
                  detectiveFeedback.isCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}>
                  <div className="font-bold flex items-center gap-1.5">
                    {detectiveFeedback.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> ตอบถูกต้อง! (+100 คะแนน)
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-600" /> ยังไม่ถูกต้อง!
                      </>
                    )}
                  </div>
                  <p className="text-xs text-slate-700">{detectiveFeedback.reason}</p>
                </div>
              )}

              {/* Action Buttons */}
              {!detectiveFeedback ? (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => handleDetectiveAnswer(true)}
                    className="py-4 px-4 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-sm shadow-xs transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>ถูกต้อง (Valid)</span>
                  </button>
                  <button
                    onClick={() => handleDetectiveAnswer(false)}
                    className="py-4 px-4 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-sm shadow-xs transition flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5 text-rose-600" />
                    <span>ผิดกฎ (Invalid)</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={nextDetectiveQuestion}
                  className="w-full py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <span>{detectiveIndex < DETECTIVE_ITEMS.length - 1 ? 'ข้อถัดไป' : 'ดูผลคะแนน'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
                <Trophy className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">ตรวจจับชื่อตัวแปรครบ 10 ข้อแล้ว!</h2>
              <div className="text-3xl font-bold text-teal-700">{detectiveScore} / 1,000 คะแนน</div>
              <p className="text-xs text-slate-500">✓ บันทึกคะแนนลงกระดานจัดอันดับเรียบร้อยแล้ว</p>
              <button
                onClick={restartDetectiveGame}
                className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold transition"
              >
                เล่นใหม่อีกรอบ
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= GAME 3: CASTING LAB ================= */}
      {activeGame === 'lab' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs max-w-2xl mx-auto space-y-6">
          {!labFinished ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                    การทดลองที่ {labIndex + 1} จาก {LAB_CHALLENGES.length}
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                    {LAB_CHALLENGES[labIndex].question}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500">คะแนน</span>
                  <div className="text-lg font-bold text-purple-700">{labScore}</div>
                </div>
              </div>

              {/* Code Box */}
              <div className="p-4 rounded-xl bg-slate-900 text-purple-300 font-mono text-sm border border-slate-800">
                <pre>{LAB_CHALLENGES[labIndex].code}</pre>
              </div>

              {/* Choices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {LAB_CHALLENGES[labIndex].options.map((opt, idx) => (
                  <button
                    key={idx}
                    disabled={!!labFeedback}
                    onClick={() => handleLabAnswer(opt.isCorrect)}
                    className={`p-3.5 rounded-xl border text-left text-sm font-medium transition ${
                      labFeedback
                        ? opt.isCorrect
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                        : 'bg-white border-slate-200 hover:bg-purple-50 hover:border-purple-300 text-slate-700'
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>

              {/* Explanation feedback */}
              {labFeedback && (
                <div className={`p-4 rounded-xl text-xs sm:text-sm border space-y-1 animate-in fade-in ${
                  labFeedback.isCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}>
                  <div className="font-bold flex items-center gap-1.5">
                    {labFeedback.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> ถูกต้อง! (+100 แต้ม)
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-600" /> ยังไม่ถูกต้อง!
                      </>
                    )}
                  </div>
                  <p className="text-xs text-slate-700">{labFeedback.explanation}</p>
                </div>
              )}

              {labFeedback && (
                <button
                  onClick={nextLabQuestion}
                  className="w-full py-3 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <span>{labIndex < LAB_CHALLENGES.length - 1 ? 'การทดลองถัดไป' : 'ดูสรุปคะแนน'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
                <Trophy className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">การทดลองเสร็จสิ้น!</h2>
              <div className="text-3xl font-bold text-purple-700">{labScore} / 500 คะแนน</div>
              <p className="text-xs text-slate-500">✓ บันทึกคะแนนลงกระดานจัดอันดับเรียบร้อยแล้ว</p>
              <button
                onClick={restartLabGame}
                className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold transition"
              >
                ทดลองใหม่อีกรอบ
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
