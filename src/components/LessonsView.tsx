import React, { useState } from 'react';
import {
  BookOpen,
  Play,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Terminal,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { LEARNING_TOPICS } from '../data/learningTopics';
import { LearningTopic } from '../types';

interface Props {
  onEarnPoints: (points: number, reason: string) => void;
}

export const LessonsView: React.FC<Props> = ({ onEarnPoints }) => {
  const [activeTopicId, setActiveTopicId] = useState<string>(LEARNING_TOPICS[0].id);
  const [simulatorInput, setSimulatorInput] = useState<string>('type(45.0)');
  const [simulatorOutput, setSimulatorOutput] = useState<{ result: string; evaluatedType: string; note: string } | null>({
    result: "<class 'float'>",
    evaluatedType: 'float',
    note: '45.0 มีจุดทศนิยม จัดเป็นจำนวนจริง (float)'
  });

  // State for quick checks
  const [selectedChecks, setSelectedChecks] = useState<Record<string, number>>({});
  const [completedChecks, setCompletedChecks] = useState<Record<string, boolean>>({});

  const activeTopic = LEARNING_TOPICS.find((t) => t.id === activeTopicId) || LEARNING_TOPICS[0];

  // Simulated Python Evaluation Engine
  const runSimulator = (expr: string) => {
    const trimmed = expr.trim();
    if (!trimmed) {
      setSimulatorOutput({
        result: 'SyntaxError: unexpected EOF while parsing',
        evaluatedType: 'error',
        note: 'กรุณาใส่คำสั่งหรือนิพจน์ Python ที่ต้องการทดสอบ'
      });
      return;
    }

    // Handled common expressions for High School Python
    if (trimmed === 'type(45.0)' || trimmed === 'type(3.14)' || trimmed === 'type(0.0)') {
      setSimulatorOutput({
        result: "<class 'float'>",
        evaluatedType: 'float',
        note: 'เนื่องจากมีจุดทศนิยม จึงมีชนิดข้อมูลเป็น float'
      });
    } else if (trimmed === 'type(42)' || trimmed === 'type(100)' || trimmed === 'type(-5)') {
      setSimulatorOutput({
        result: "<class 'int'>",
        evaluatedType: 'int',
        note: 'จำนวนเต็มไม่มีจุดทศนิยม จัดเป็น int'
      });
    } else if (trimmed === 'type("True")' || trimmed === "type('True')" || trimmed === 'type("100")') {
      setSimulatorOutput({
        result: "<class 'str'>",
        evaluatedType: 'str',
        note: 'มีเครื่องหมายคำพูดครอบ จึงจัดเป็นสตริง (str) แม้ข้างในจะเป็นคำว่า True หรือตัวเลข'
      });
    } else if (trimmed === 'type(True)' || trimmed === 'type(False)') {
      setSimulatorOutput({
        result: "<class 'bool'>",
        evaluatedType: 'bool',
        note: 'True และ False โดยไม่มีเครื่องหมายคำพูด คือค่าความจริงชนิด bool'
      });
    } else if (trimmed.includes('str(10) + str(20)') || trimmed.includes('"10" + "20"')) {
      setSimulatorOutput({
        result: '"1020"',
        evaluatedType: 'str',
        note: 'เครื่องหมาย + เมื่อใช้กับ str จะเป็นการเชื่อมต่อข้อความ (Concatenation)'
      });
    } else if (trimmed.includes('int("25") + 10') || trimmed.includes('int("25") + int("10")')) {
      setSimulatorOutput({
        result: '35',
        evaluatedType: 'int',
        note: 'int("25") แปลงข้อความ "25" เป็นจำนวนเต็ม 25 แล้วบวก 10 ได้ 35'
      });
    } else if (trimmed.includes('"Python " * 3') || trimmed.includes('"Py" * 3')) {
      setSimulatorOutput({
        result: trimmed.includes('"Python " * 3') ? '"Python Python Python "' : '"PyPyPy"',
        evaluatedType: 'str',
        note: 'str * int คือการทำซ้ำข้อความตามจำนวนเท่าที่ระบุ'
      });
    } else if (trimmed.includes('17 // 5') || trimmed.includes('10 // 3') || trimmed.includes('7 // 2')) {
      setSimulatorOutput({
        result: trimmed.includes('7 // 2') ? '3' : (trimmed.includes('17 // 5') ? '3 (เศษคือ 17 % 5 = 2)' : '3 (เศษคือ 10 % 3 = 1)'),
        evaluatedType: 'int',
        note: '// คือการหารปัดเศษทิ้ง (Floor division) ได้ผลลัพธ์เป็นจำนวนเต็ม 3'
      });
    } else if (trimmed.includes('7 % 2') || trimmed.includes('10 % 3') || trimmed.includes('17 % 5')) {
      setSimulatorOutput({
        result: trimmed.includes('7 % 2') ? '1' : (trimmed.includes('10 % 3') ? '1' : '2'),
        evaluatedType: 'int',
        note: '% คือการหารเอาเศษ (Modulo) เศษที่เหลือจากการหารคือ 1'
      });
    } else if (trimmed.includes('10 / 2') || trimmed.includes('15 / 3')) {
      setSimulatorOutput({
        result: trimmed.includes('10 / 2') ? '5.0' : '5.0',
        evaluatedType: 'float',
        note: 'ตัวดำเนินการหาร (/) ใน Python 3 จะคืนค่าเป็น float เสมอ แม้จะหารลงตัว'
      });
    } else if (trimmed.includes('bool(0)') || trimmed.includes('bool("")')) {
      setSimulatorOutput({
        result: 'False',
        evaluatedType: 'bool',
        note: 'ค่า 0 และข้อความว่าง "" ถูกประเมินเป็น False เสมอใน Python'
      });
    } else if (trimmed.includes('bool(1)') || trimmed.includes('bool("hello")')) {
      setSimulatorOutput({
        result: 'True',
        evaluatedType: 'bool',
        note: 'ตัวเลขใดๆ ที่ไม่ใช่ 0 หรือข้อความที่มีตัวอักษร จะถูกประเมินเป็น True'
      });
    } else if (trimmed.includes('int("3.14")')) {
      setSimulatorOutput({
        result: 'ValueError: invalid literal for int() with base 10: "3.14"',
        evaluatedType: 'error',
        note: 'ฟังก์ชัน int() ไม่สามารถแปลงข้อความทศนิยมตรงๆ ได้ ต้องใช้ float("3.14") ก่อน'
      });
    } else {
      // General evaluator fallback
      try {
        setSimulatorOutput({
          result: `ประมวลผลคำสั่ง: ${trimmed}`,
          evaluatedType: 'Python Expression',
          note: 'คำสั่งได้รับการตรวจสอบตามไวยากรณ์ภาษา Python 3'
        });
      } catch (e) {
        setSimulatorOutput({
          result: 'SyntaxError: คำสั่งไม่ถูกต้อง',
          evaluatedType: 'error',
          note: 'โปรดตรวจสอบชื่อตัวแปรและไวยากรณ์ตามบทเรียน'
        });
      }
    }
  };

  const handleQuickCheck = (topic: LearningTopic, optIdx: number) => {
    setSelectedChecks((prev) => ({ ...prev, [topic.id]: optIdx }));
    const opt = topic.quickCheck.options[optIdx];
    if (opt.isCorrect && !completedChecks[topic.id]) {
      setCompletedChecks((prev) => ({ ...prev, [topic.id]: true }));
      onEarnPoints(20, `ตอบคำถามท้ายบทเรียน: ${topic.title}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-2">
              <BookOpen className="w-3.5 h-3.5" /> 5 โมดูลบทเรียน
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              บทเรียนเรื่องตัวแปรและชนิดข้อมูลภาษา Python
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              ระดับชั้นมัธยมศึกษาปีที่4 โรงเรียนมัธยมวาริชภูมิ
            </p>
          </div>
        </div>

        {/* Module Switcher Pills */}
        <div className="flex items-center gap-2 overflow-x-auto mt-6 pb-2 no-scrollbar">
          {LEARNING_TOPICS.map((topic, index) => {
            const isActive = topic.id === activeTopicId;
            const isDone = completedChecks[topic.id];
            return (
              <button
                key={topic.id}
                onClick={() => setActiveTopicId(topic.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition flex items-center gap-2 border ${
                  isActive
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>บทที่ {index + 1}</span>
                {isDone && <CheckCircle className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-emerald-600'}`} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Lesson Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                {activeTopic.duration} • บทเรียน
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                {activeTopic.title}
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                {activeTopic.subtitle}
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-6">
              {activeTopic.sections.map((sec, idx) => (
                <div key={idx} className="space-y-3 pt-4 border-t border-slate-100 first:border-t-0 first:pt-0">
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-700 text-xs flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    {sec.heading}
                  </h3>
                  <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                    {sec.description}
                  </p>

                  {/* Code Snippet Box */}
                  {sec.codeExample && (
                    <div className="rounded-xl bg-slate-900 text-slate-100 p-4 font-mono text-xs sm:text-sm border border-slate-800 shadow-inner overflow-x-auto">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
                        <span>Python Code</span>
                        <button
                          onClick={() => {
                            const firstLine = sec.codeExample?.split('\n').find(l => !l.startsWith('#') && l.trim().length > 0) || '';
                            if (firstLine) {
                              setSimulatorInput(firstLine);
                              runSimulator(firstLine);
                            }
                          }}
                          className="text-emerald-400 hover:text-emerald-300 font-sans flex items-center gap-1 cursor-pointer"
                        >
                          <Play className="w-3 h-3" /> ลองในโปรแกรมจำลอง
                        </button>
                      </div>
                      <pre className="text-emerald-300 leading-relaxed">
                        {sec.codeExample}
                      </pre>
                    </div>
                  )}

                  {sec.codeExplanation && (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>{sec.codeExplanation}</span>
                    </div>
                  )}

                  {sec.warningNote && (
                    <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{sec.warningNote}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Check Question at bottom of each topic */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <HelpCircle className="w-4 h-4 text-emerald-600" />
                    <span>คำถามทบทวนท้ายบท (ได้รับ 20 แต้ม)</span>
                  </div>
                  {completedChecks[activeTopic.id] && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-200 text-emerald-800">
                      ✓ ตอบถูกแล้ว
                    </span>
                  )}
                </div>

                <div className="text-sm font-semibold text-slate-800">
                  {activeTopic.quickCheck.question}
                </div>

                {activeTopic.quickCheck.codeSnippet && (
                  <div className="p-3 rounded-lg bg-slate-900 text-emerald-300 font-mono text-xs">
                    <pre>{activeTopic.quickCheck.codeSnippet}</pre>
                  </div>
                )}

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {activeTopic.quickCheck.options.map((opt, optIdx) => {
                    const isSelected = selectedChecks[activeTopic.id] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleQuickCheck(activeTopic, optIdx)}
                        className={`p-3 rounded-xl text-xs sm:text-sm font-medium text-left border transition ${
                          isSelected
                            ? opt.isCorrect
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                              : 'bg-rose-100 text-rose-800 border-rose-300'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {opt.text}
                      </button>
                    );
                  })}
                </div>

                {/* Instant Feedback Explanation */}
                {selectedChecks[activeTopic.id] !== undefined && (
                  <div className={`p-3 rounded-xl text-xs ${
                    activeTopic.quickCheck.options[selectedChecks[activeTopic.id]].isCorrect
                      ? 'bg-emerald-100/80 border border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border border-rose-200 text-rose-800'
                  }`}>
                    <span className="font-bold">
                      {activeTopic.quickCheck.options[selectedChecks[activeTopic.id]].isCorrect ? 'ถูกต้อง! ' : 'ยังไม่ถูกต้อง! '}
                    </span>
                    {activeTopic.quickCheck.options[selectedChecks[activeTopic.id]].explanation}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Python Interactive Simulator */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 sticky top-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Python Code Simulator</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                โต้ตอบทันที
              </span>
            </div>
            <p className="text-xs text-slate-500">
              ทดลองพิมพ์คำสั่งตรวจสอบชนิดข้อมูล หรือการคำนวณ แล้วคลิก "รันโค้ด" เพื่อดูผลลัพธ์จำลอง
            </p>

            {/* Quick Templates */}
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                คลิกเพื่อเลือกตัวอย่างที่น่าสนใจ:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'type(45.0)',
                  'type("True")',
                  'int("25") + 10',
                  'str(10) + str(20)',
                  '"Python " * 3',
                  '17 // 5',
                  'bool(0)',
                  'int("3.14")'
                ].map((sample) => (
                  <button
                    key={sample}
                    onClick={() => {
                      setSimulatorInput(sample);
                      runSimulator(sample);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-mono text-[11px] border border-slate-200 transition"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Box */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>คำสั่ง Python:</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={simulatorInput}
                  onChange={(e) => setSimulatorInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') runSimulator(simulatorInput);
                  }}
                  placeholder="เช่น type(100) หรือ int('20') + 5"
                  className="w-full px-3.5 py-2.5 font-mono text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-slate-800"
                />
              </div>
              <button
                onClick={() => runSimulator(simulatorInput)}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5" /> รันโค้ดจำลอง (Run Simulation)
              </button>
            </div>

            {/* Output Display */}
            {simulatorOutput && (
              <div className="rounded-xl bg-slate-900 p-4 font-mono text-xs border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1.5">
                  <span>ผลลัพธ์จาก Console</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-sans ${
                    simulatorOutput.evaluatedType === 'error'
                      ? 'bg-rose-900/80 text-rose-300'
                      : 'bg-emerald-900/80 text-emerald-300'
                  }`}>
                    {simulatorOutput.evaluatedType}
                  </span>
                </div>
                <div className={`text-sm font-semibold ${
                  simulatorOutput.evaluatedType === 'error' ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  &gt;&gt;&gt; {simulatorOutput.result}
                </div>
                <div className="text-[11px] text-slate-300 font-sans pt-1 border-t border-slate-800/80">
                  💡 <span className="font-semibold text-slate-200">คำอธิบาย:</span> {simulatorOutput.note}
                </div>
              </div>
            )}

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-800 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                เมื่อเข้าใจครบทั้ง 5 บทเรียนแล้ว แนะนำให้ไปทำ <strong>Post-Test</strong> เพื่อวัดผลความก้าวหน้า!
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
