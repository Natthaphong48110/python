import React, { useState } from 'react';
import { User, School, Hash, Sparkles, Check } from 'lucide-react';
import { StudentProfile } from '../types';

interface Props {
  isOpen: boolean;
  currentProfile: StudentProfile | null;
  onSave: (profile: StudentProfile) => void;
  onClose?: () => void;
  canClose?: boolean;
}

const CLASSROOM_OPTIONS = [
  'ม.4/1', 'ม.4/2', 'ม.4/3', 'ม.4/4', 'ม.4/5', 'ม.4/6', 'ม.4/7', 'ม.4/8', 'ม.4/9', 'ม.4/10'
];

export const StudentProfileModal: React.FC<Props> = ({
  isOpen,
  currentProfile,
  onSave,
  onClose,
  canClose = true
}) => {
  const [name, setName] = useState(currentProfile?.name || '');
  const [classroom, setClassroom] = useState(currentProfile?.classroom || 'ม.4/1');
  const [studentNo, setStudentNo] = useState(currentProfile?.studentNo || '');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setError('กรุณากรอกชื่อจริง-นามสกุลของคุณ');
      return;
    }
    if (cleanName.length < 2) {
      setError('ชื่อต้องมีความยาวอย่างน้อย 2 ตัวอักษร');
      return;
    }

    const profile: StudentProfile = {
      id: currentProfile?.id || `${classroom}_${studentNo || '0'}_${cleanName.toLowerCase().replace(/\s+/g, '')}`,
      name: cleanName,
      classroom,
      studentNo: studentNo.trim() || '-'
    };

    onSave(profile);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white text-center relative">
          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-3 backdrop-blur-xs shadow-inner">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">
            {currentProfile ? 'กรอกข้อมูลผู้เรียน' : 'ยินดีต้อนรับสู่ห้องเรียน Python ม.4'}
          </h2>
          <p className="text-emerald-100 text-sm mt-1">
            ระบุชื่อและห้องเรียนเพื่อบันทึกข้อมูลและผลคะแนนของคุณ
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-600" /> ชื่อจริง - นามสกุล
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น นายสมชาย ใจดี"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm text-slate-800 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <School className="w-4 h-4 text-emerald-600" /> ห้องเรียน
              </label>
              <select
                value={classroom}
                onChange={(e) => setClassroom(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm text-slate-800 transition"
              >
                {CLASSROOM_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Hash className="w-4 h-4 text-emerald-600" /> เลขที่
              </label>
              <input
                type="text"
                value={studentNo}
                onChange={(e) => setStudentNo(e.target.value.replace(/[^0-9]/g, '').slice(0, 3))}
                placeholder="เช่น 15"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm text-slate-800 transition"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            {canClose && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-100 transition"
              >
                ยกเลิก
              </button>
            )}
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" /> เริ่มเรียนและเก็บคะแนน
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
