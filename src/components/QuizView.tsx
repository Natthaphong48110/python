import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Sparkles,
  Award,
  AlertCircle
} from 'lucide-react';
import { Question, QuizType, StudentProfile } from '../types';

interface Props {
  type: QuizType;
  questions: Question[];
  profile: StudentProfile | null;
  onFinishQuiz: (type: QuizType, score: number, answers: { questionId: number; isCorrect: boolean }[]) => void;
  onNavigateToLessons: () => void;
  onNavigateToPostTest?: () => void;
}

export const QuizView: React.FC<Props> = ({
  type,
  questions,
  profile,
  onFinishQuiz,
  onNavigateToLessons,
  onNavigateToPostTest
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{
    questionId: number;
    selectedId: string;
    isCorrect: boolean;
  }[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = questions[currentIndex];
  const isPreTest = type === 'pre_test';
  const testTitle = isPreTest ? 'แบบทดสอบก่อนเรียน (Pre-Test)' : 'แบบทดสอบหลังเรียน (Post-Test)';
  const testSubtitle = isPreTest
    ? 'วัดระดับความรู้พื้นฐานเดิม 10 ข้อ ก่อนเริ่มเรียนรู้เรื่องตัวแปรและชนิดข้อมูล'
    : 'วัดผลสัมฤทธิ์ทางการเรียน 10 ข้อ หลังศึกษาบทเรียนและฝึกฝนผ่านเกม';

  const handleSelectOption = (optId: string) => {
    if (isAnswerSubmitted) return; // Cannot change after submitted
    setSelectedOptionId(optId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOptionId || isAnswerSubmitted) return;

    const chosenOption = currentQ.options.find((o) => o.id === selectedOptionId);
    const isCorrect = !!chosenOption?.isCorrect;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setUserAnswers((prev) => [
      ...prev,
      {
        questionId: currentQ.id,
        selectedId: selectedOptionId,
        isCorrect
      }
    ]);

    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswerSubmitted(false);
    } else {
      // Quiz finished
      setIsCompleted(true);
      const finalScore = score + (currentQ.options.find(o => o.id === selectedOptionId)?.isCorrect ? 1 : 0);
      const allAnswers = [
        ...userAnswers,
        {
          questionId: currentQ.id,
          selectedId: selectedOptionId || '',
          isCorrect: !!currentQ.options.find(o => o.id === selectedOptionId)?.isCorrect
        }
      ];
      onFinishQuiz(type, finalScore, allAnswers);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setUserAnswers([]);
    setIsCompleted(false);
  };

  // Completed Screen
  if (isCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    const isPass = score >= 6;

    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in">
        {/* Score Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
            <Trophy className="w-8 h-8" />
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            {testTitle} • สรุปผลการทดสอบ
          </span>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
            {profile?.name ? `${profile.name} ทำได้ ${score} / ${questions.length} คะแนน` : `ได้ ${score} / ${questions.length} คะแนน`}
          </h2>

          <div className="mt-3 flex items-center justify-center gap-2">
            <span className={`text-lg font-bold ${isPass ? 'text-emerald-600' : 'text-amber-600'}`}>
              คิดเป็น {percentage}%
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-sm text-slate-600 font-medium">
              {isPass ? 'ผ่านเกณฑ์มาตรฐาน ม.4 (>= 60%)' : 'ควรทบทวนเนื้อหาเพิ่มเติม'}
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-2">
            ✓ บันทึกคะแนนเข้าสู่ระบบกระดานผู้นำเรียบร้อยแล้ว
          </p>

          {/* Action buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-semibold transition flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> ทำแบบทดสอบอีกครั้ง
            </button>

            {isPreTest ? (
              <button
                onClick={onNavigateToLessons}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md shadow-emerald-600/20 transition flex items-center gap-2"
              >
                เข้าสู่บทเรียนเพื่อเตรียมตัว <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              onNavigateToLessons && (
                <button
                  onClick={onNavigateToLessons}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold shadow-md shadow-purple-600/20 transition flex items-center gap-2"
                >
                  ทบทวนบทเรียนอีกครั้ง <ArrowRight className="w-4 h-4" />
                </button>
              )
            )}
          </div>
        </div>

        {/* Detailed Question Review List */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <span>ตรวจคำตอบและคำอธิบายทุกข้อ (Detailed Review)</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">10 ข้อ</span>
          </div>

          <div className="space-y-4">
            {questions.map((q, idx) => {
              const userAns = userAnswers.find((u) => u.questionId === q.id);
              const isCorrect = userAns?.isCorrect;
              const chosenOpt = q.options.find((o) => o.id === userAns?.selectedId);
              const correctOpt = q.options.find((o) => o.isCorrect);

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border text-left space-y-2 ${
                    isCorrect
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-rose-50/40 border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                        isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      }`}>
                        {idx + 1}
                      </span>
                      <div>
                        <div className="text-sm font-bold text-slate-800">
                          {q.title}
                        </div>
                        <span className="text-[11px] font-semibold text-slate-400">
                          {q.categoryTitle}
                        </span>
                      </div>
                    </div>
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" /> ถูกต้อง
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full shrink-0">
                        <XCircle className="w-3.5 h-3.5" /> ไม่ถูกต้อง
                      </span>
                    )}
                  </div>

                  {q.codeSnippet && (
                    <div className="p-2.5 rounded-lg bg-slate-900 text-emerald-300 font-mono text-xs overflow-x-auto">
                      <pre>{q.codeSnippet}</pre>
                    </div>
                  )}

                  <div className="text-xs space-y-1 pt-1">
                    <div className="flex items-center gap-1 text-slate-700">
                      <span className="font-semibold">คำตอบของคุณ:</span>
                      <span className={isCorrect ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                        {chosenOpt?.text || 'ไม่ได้ตอบ'}
                      </span>
                    </div>
                    {!isCorrect && (
                      <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                        <span>คำตอบที่ถูกต้อง:</span>
                        <span>{correctOpt?.text}</span>
                      </div>
                    )}
                  </div>

                  {/* Explanation box */}
                  <div className="p-2.5 rounded-lg bg-white/80 border border-slate-200 text-xs text-slate-700 space-y-1">
                    <div>
                      <span className="font-bold text-slate-900">💡 คำอธิบาย: </span>
                      <span>{q.explanation}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 pt-0.5">
                      📌 <span className="font-semibold">เกร็ดความรู้:</span> {q.conceptTip}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Active Question Card
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Quiz Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isPreTest ? 'bg-sky-100 text-sky-800' : 'bg-purple-100 text-purple-800'
            }`}>
              {testTitle}
            </span>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-2">
              ข้อที่ {currentIndex + 1} จาก {questions.length} ข้อ
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {testSubtitle}
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xs font-semibold text-slate-500">คะแนนปัจจุบัน</div>
            <div className="text-2xl font-bold text-emerald-600">
              {score} <span className="text-xs font-normal text-slate-400">/ {currentIndex}</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 mt-4 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${isPreTest ? 'bg-sky-500' : 'bg-purple-600'}`}
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question & Options Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
            {currentQ.categoryTitle}
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-2 leading-snug">
            {currentQ.title}
          </h2>
        </div>

        {/* Code Snippet if present */}
        {currentQ.codeSnippet && (
          <div className="rounded-xl bg-slate-900 text-emerald-300 p-4 font-mono text-xs sm:text-sm border border-slate-800 shadow-inner overflow-x-auto">
            <pre className="leading-relaxed">{currentQ.codeSnippet}</pre>
          </div>
        )}

        {/* 4 Options */}
        <div className="space-y-3">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            let optionStyle = 'border-slate-200 bg-slate-50 hover:bg-slate-100/80 text-slate-700';

            if (isAnswerSubmitted) {
              if (opt.isCorrect) {
                optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold ring-2 ring-emerald-400/50';
              } else if (isSelected && !opt.isCorrect) {
                optionStyle = 'border-rose-400 bg-rose-50 text-rose-900 font-semibold';
              } else {
                optionStyle = 'border-slate-200 bg-slate-50 opacity-60 text-slate-500';
              }
            } else if (isSelected) {
              optionStyle = 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold ring-2 ring-emerald-500/20';
            }

            return (
              <button
                key={opt.id}
                disabled={isAnswerSubmitted}
                onClick={() => handleSelectOption(opt.id)}
                className={`w-full p-4 rounded-xl border text-left text-sm transition flex items-center justify-between gap-3 ${optionStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 uppercase ${
                    isSelected
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-700'
                  }`}>
                    {opt.id}
                  </span>
                  <span>{opt.text}</span>
                </div>

                {isAnswerSubmitted && opt.isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {isAnswerSubmitted && isSelected && !opt.isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Immediate Explanation Box (Shown immediately after submitting answer) */}
        {isAnswerSubmitted && (
          <div className={`p-4 rounded-2xl border space-y-2 animate-in fade-in duration-200 ${
            currentQ.options.find(o => o.id === selectedOptionId)?.isCorrect
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              : 'bg-rose-50/70 border-rose-200 text-rose-900'
          }`}>
            <div className="flex items-center gap-2 font-bold text-sm">
              {currentQ.options.find(o => o.id === selectedOptionId)?.isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>ตอบถูกต้องยอดเยี่ยม! (+1 คะแนน)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>ยังไม่ถูกต้อง!</span>
                </>
              )}
            </div>

            <p className="text-xs sm:text-sm leading-relaxed text-slate-700">
              <span className="font-semibold text-slate-900">คำอธิบาย: </span>
              {currentQ.explanation}
            </p>

            <div className="text-xs text-slate-600 bg-white/70 p-2.5 rounded-xl border border-slate-200/60 flex items-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span><strong className="text-slate-800">เกร็ดความรู้:</strong> {currentQ.conceptTip}</span>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-2 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            {!isAnswerSubmitted && !selectedOptionId && 'แตะเลือกคำตอบที่คุณคิดว่าถูกต้อง'}
            {!isAnswerSubmitted && selectedOptionId && 'พร้อมแล้วกด "ยืนยันคำตอบ"'}
          </div>

          {!isAnswerSubmitted ? (
            <button
              disabled={!selectedOptionId}
              onClick={handleSubmitAnswer}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition shadow-xs ${
                selectedOptionId
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              ยืนยันคำตอบ
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-sm font-semibold shadow-md transition flex items-center gap-2"
            >
              <span>{currentIndex < questions.length - 1 ? 'ข้อถัดไป' : 'ดูสรุปผลคะแนน'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
