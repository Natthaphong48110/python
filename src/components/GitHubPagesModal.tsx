import React, { useState } from 'react';
import {
  ExternalLink,
  Copy,
  Check,
  Globe,
  Github,
  X,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Laptop
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubPagesModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [copiedAppUrl, setCopiedAppUrl] = useState(false);
  const [copiedGhUrl, setCopiedGhUrl] = useState(false);
  const [ghUsername, setGhUsername] = useState('nuttaphong967');
  const [repoName, setRepoName] = useState('python-m4');

  if (!isOpen) return null;

  // Direct live web app URL (Cloud Run instance)
  const liveAppUrl = 'https://ais-pre-6jfnroh4nma7f7l6c6xsxm-929164789789.asia-southeast1.run.app';

  // Generated GitHub Pages URL
  const cleanUser = ghUsername.trim() || 'username';
  const cleanRepo = repoName.trim() || 'repository';
  const ghPagesUrl = `https://${cleanUser}.github.io/${cleanRepo}/`;

  const handleCopy = (text: string, type: 'app' | 'gh') => {
    navigator.clipboard.writeText(text);
    if (type === 'app') {
      setCopiedAppUrl(true);
      setTimeout(() => setCopiedAppUrl(false), 2000);
    } else {
      setCopiedGhUrl(true);
      setTimeout(() => setCopiedGhUrl(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                ลิงก์เข้าใช้งานหน้าเว็บ & GitHub Pages
              </h2>
              <p className="text-xs text-slate-300">
                โรงเรียนมัธยมวาริชภูมิ • Python ม.4
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          {/* Card 1: Direct Live Web Link (Ready right now) */}
          <div className="p-4 rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  ลิงก์หน้าเว็บออนไลน์ (ใช้งานได้ทันที)
                </span>
              </div>
              <span className="text-[11px] font-medium bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                พร้อมใช้งาน
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              คุณสามารถกดลิงก์นี้เพื่อเปิดใช้งานเว็บไซต์ในแท็บใหม่ หรือแชร์ให้นักเรียนเข้าเรียนได้ทันที:
            </p>
            <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-emerald-200">
              <input
                type="text"
                readOnly
                value={liveAppUrl}
                className="text-xs text-slate-700 font-mono flex-1 bg-transparent border-none outline-hidden px-1"
              />
              <button
                onClick={() => handleCopy(liveAppUrl, 'app')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1 transition"
              >
                {copiedAppUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedAppUrl ? 'คัดลอกแล้ว' : 'คัดลอก'}
              </button>
              <a
                href={liveAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
              >
                <span>เปิดหน้าเว็บ</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Card 2: GitHub Pages URL Generator */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2 mb-2">
              <Github className="w-4 h-4 text-slate-800" />
              <h3 className="text-sm font-bold text-slate-800">
                สร้างลิงก์สำหรับ GitHub Pages ของคุณ
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              เมื่อนำโค้ดไปไว้บน GitHub ลิงก์ของคุณจะเป็นรูปแบบด้านล่างนี้:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  GitHub Username:
                </label>
                <input
                  type="text"
                  value={ghUsername}
                  onChange={(e) => setGhUsername(e.target.value)}
                  placeholder="เช่น nuttaphong967"
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-emerald-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  ชื่อ Repository:
                </label>
                <input
                  type="text"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  placeholder="เช่น python-m4"
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-emerald-500"
                />
              </div>
            </div>

            {/* Generated GitHub Pages Link Box */}
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={ghPagesUrl}
                className="text-xs text-slate-700 font-mono flex-1 bg-transparent border-none outline-hidden px-1"
              />
              <button
                onClick={() => handleCopy(ghPagesUrl, 'gh')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1 transition"
              >
                {copiedGhUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedGhUrl ? 'คัดลอก' : 'คัดลอก'}
              </button>
              <a
                href={ghPagesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <span>ไปที่ GitHub Pages</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Setup Instructions */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60">
            <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              วิธีเปิดใช้งานบน GitHub Pages (ทำเพียง 1 ครั้ง):
            </h4>
            <ol className="text-xs text-amber-900/90 space-y-1.5 list-decimal pl-4">
              <li>
                ดาวน์โหลดโค้ดโปรเจกต์นี้ (Export ZIP หรือ Git Push ไปยัง GitHub ของคุณ)
              </li>
              <li>
                ใน GitHub ไปที่แท็บ <strong>Settings</strong> &gt; เมนูด้านซ้าย <strong>Pages</strong>
              </li>
              <li>
                ตรงส่วน <strong>Build and deployment &gt; Source</strong> ให้เลือกเป็น <strong>GitHub Actions</strong> (ระบบได้จัดเตรียมไฟล์อัตโนมัติไว้ให้เรียบร้อยแล้ว)
              </li>
              <li>
                รอประมาณ 1 นาที เว็บจะออนไลน์บนลิงก์ GitHub Pages ทันที!
              </li>
            </ol>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
