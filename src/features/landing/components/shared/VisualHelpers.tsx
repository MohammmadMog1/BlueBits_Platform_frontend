import type { ReactNode } from "react";
import {
  BookOpen,
  Calendar,
  BrainCircuit,
  MessageSquare,
  ClipboardList,
  Sparkles,
  CheckCircle2,
  Circle,
  Bot,
} from "lucide-react";

// ─── Eyebrow label ────────────────────────────────────────────────────────
// Small flat uppercase label used once per section intro — no pill, no
// gradient fill, just a marker dot + letter-spaced text.
export function TabLabel({
  children,
  className = "",
  isDark = false,
}: {
  children: ReactNode;
  className?: string;
  isDark?: boolean;
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] ${
        isDark ? "text-gray-500" : "text-slate-500"
      } ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#404293]" />
      {children}
    </div>
  );
}

// ─── Hero Product Preview (dashboard mockup) ─────────────────────────────────
export function HeroPreview({ isDark = false }: { isDark?: boolean }) {
  const navItems = [
    { icon: BookOpen, label: "Lectures", active: true },
    { icon: Calendar, label: "Exams", active: false },
    { icon: BrainCircuit, label: "MCQ", active: false },
    { icon: MessageSquare, label: "AI Chat", active: false },
    { icon: ClipboardList, label: "Tasks", active: false },
  ];

  const circumference = 2 * Math.PI * 30;
  const progress = 0.78;

  return (
    <div
      className={`relative rounded-2xl border overflow-hidden ${
        isDark
          ? "bg-[#0d0e15] border-white/10"
          : "bg-white border-slate-200 shadow-[0_1px_2px_rgba(15,17,26,0.04),0_16px_40px_-24px_rgba(15,17,26,0.18)]"
      }`}
    >
      {/* Title bar */}
      <div
        className={`flex items-center px-4 sm:px-5 py-3 border-b ${
          isDark ? "border-white/8" : "border-slate-100"
        }`}
      >
        <span
          className={`text-[11px] font-semibold ${isDark ? "text-gray-400" : "text-slate-500"}`}
        >
          Dashboard
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-5 p-4 sm:p-6">
        {/* Mini side nav */}
        <div className="hidden sm:flex flex-col gap-1.5">
          {navItems.map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
                item.active
                  ? isDark
                    ? "bg-white/8 text-white"
                    : "bg-[#404293]/8 text-[#404293]"
                  : isDark
                    ? "text-gray-500"
                    : "text-slate-500"
              }`}
            >
              <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
              {item.label}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="sm:col-span-3 grid grid-cols-2 gap-3 sm:gap-4">
          {/* Progress ring card */}
          <div
            className={`rounded-xl border p-4 flex items-center gap-3 ${
              isDark ? "bg-white/[0.03] border-white/8" : "bg-slate-50 border-slate-100"
            }`}
          >
            <svg width="60" height="60" viewBox="0 0 68 68" className="flex-shrink-0 -rotate-90">
              <circle cx="34" cy="34" r="30" fill="none" strokeWidth="6" className={isDark ? "stroke-white/10" : "stroke-slate-200"} />
              <circle
                cx="34"
                cy="34"
                r="30"
                fill="none"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress)}
                stroke="#404293"
              />
            </svg>
            <div className="min-w-0">
              <div className={`text-lg font-bold ${isDark ? "text-white" : "text-[#1a1b2e]"}`}>78%</div>
              <div className={`text-[11px] font-medium truncate ${isDark ? "text-gray-500" : "text-slate-500"}`}>
                Data Structures
              </div>
            </div>
          </div>

          {/* Next exam card */}
          <div
            className={`rounded-xl border p-4 ${
              isDark ? "bg-white/[0.03] border-white/8" : "bg-slate-50 border-slate-100"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-3.5 h-3.5 text-[#404293]" />
              <span className={`text-[11px] font-semibold uppercase tracking-wide ${isDark ? "text-gray-500" : "text-slate-400"}`}>
                Next Exam
              </span>
            </div>
            <div className={`text-sm font-semibold mb-1 ${isDark ? "text-white" : "text-[#1a1b2e]"}`}>
              Algorithms Final
            </div>
            <span
              className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                isDark ? "bg-white/8 text-gray-300" : "bg-slate-200/70 text-slate-600"
              }`}
            >
              in 5 days
            </span>
          </div>

          {/* AI chat card */}
          <div
            className={`col-span-2 rounded-xl border p-4 ${
              isDark ? "bg-white/[0.03] border-white/8" : "bg-slate-50 border-slate-100"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${
                  isDark ? "bg-white/10" : "bg-[#404293]/10"
                }`}
              >
                <Bot className={`w-3.5 h-3.5 ${isDark ? "text-gray-300" : "text-[#404293]"}`} />
              </div>
              <span className={`text-[11px] font-semibold ${isDark ? "text-gray-300" : "text-slate-600"}`}>
                AI Assistant
              </span>
              <Sparkles className="w-3 h-3 text-[#404293] ml-auto" />
            </div>
            <div
              className={`text-xs rounded-lg rounded-tl-sm px-3 py-2 mb-2 max-w-[85%] ${
                isDark ? "bg-white/8 text-gray-300" : "bg-white text-slate-600 border border-slate-100"
              }`}
            >
              Explain Big-O notation simply?
            </div>
            <div className="flex items-center gap-1 pl-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#404293]/50 animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#404293]/50 animate-pulse [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#404293]/50 animate-pulse [animation-delay:300ms]" />
            </div>
          </div>

          {/* Tasks row */}
          <div
            className={`col-span-2 rounded-xl border p-3.5 flex items-center gap-4 sm:gap-5 overflow-x-auto ${
              isDark ? "bg-white/[0.03] border-white/8" : "bg-slate-50 border-slate-100"
            }`}
          >
            {[
              { label: "Review Chapter 4", done: true },
              { label: "Submit Lab Report", done: true },
              { label: "Practice MCQ Set 3", done: false },
            ].map((t) => (
              <div key={t.label} className="flex items-center gap-1.5 flex-shrink-0">
                {t.done ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                ) : (
                  <Circle className={`w-3.5 h-3.5 flex-shrink-0 ${isDark ? "text-gray-600" : "text-slate-300"}`} />
                )}
                <span
                  className={`text-[11px] font-medium whitespace-nowrap ${
                    t.done ? (isDark ? "text-gray-600 line-through" : "text-slate-400 line-through") : isDark ? "text-gray-300" : "text-slate-600"
                  }`}
                >
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── About section panel (replaces stock photo) ──────────────────────────
// A compact, code-built progress/stat panel that mirrors HeroPreview's
// visual language instead of a generic stock photo.
export function AboutPanel({
  isDark = false,
  satisfactionValue,
  satisfactionCaption,
  academicYearValue,
  academicYearLabel,
}: {
  isDark?: boolean;
  satisfactionValue: string;
  satisfactionCaption: string;
  academicYearValue: string;
  academicYearLabel: string;
}) {
  const subjects = [
    { label: "Data Structures", progress: 0.82 },
    { label: "Operating Systems", progress: 0.64 },
    { label: "Databases", progress: 0.91 },
  ];

  return (
    <div
      className={`rounded-2xl border overflow-hidden ${
        isDark
          ? "bg-[#0d0e15] border-white/10"
          : "bg-white border-slate-200 shadow-[0_1px_2px_rgba(15,17,26,0.04),0_16px_40px_-24px_rgba(15,17,26,0.18)]"
      }`}
    >
      <div
        className={`flex items-center justify-between px-5 sm:px-6 py-4 border-b ${
          isDark ? "border-white/8" : "border-slate-100"
        }`}
      >
        <span className={`text-sm font-semibold ${isDark ? "text-white" : "text-[#1a1b2e]"}`}>
          {academicYearLabel}
        </span>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
            isDark ? "bg-white/8 text-gray-300" : "bg-slate-100 text-slate-600"
          }`}
        >
          {academicYearValue}
        </span>
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        {subjects.map((s) => (
          <div key={s.label}>
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-slate-600"}`}>
                {s.label}
              </span>
              <span className={`text-xs font-semibold ${isDark ? "text-gray-500" : "text-slate-400"}`}>
                {Math.round(s.progress * 100)}%
              </span>
            </div>
            <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? "bg-white/8" : "bg-slate-100"}`}>
              <div
                className="h-full rounded-full bg-[#404293]"
                style={{ width: `${s.progress * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div
        className={`flex items-center justify-between px-5 sm:px-6 py-4 border-t ${
          isDark ? "border-white/8" : "border-slate-100"
        }`}
      >
        <div>
          <div className={`text-lg font-bold ${isDark ? "text-white" : "text-[#1a1b2e]"}`}>
            {satisfactionValue}
          </div>
          <div className={`text-xs ${isDark ? "text-gray-500" : "text-slate-400"}`}>
            {satisfactionCaption}
          </div>
        </div>
      </div>
    </div>
  );
}
