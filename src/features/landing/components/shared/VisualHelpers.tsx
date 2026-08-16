import React from "react";
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

// ─── Layered Multi-Ring Hexagon (like image 2) ──────────────────────────────
export function LayeredHex({
  className = "",
  color = "#404293",
  rings = 3,
  opacity = 1,
  size = 100,
}: {
  className?: string;
  color?: string;
  rings?: number;
  opacity?: number;
  size?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
    >
      {Array.from({ length: rings }).map((_, i) => {
        const r = size * 0.42 - i * (size * 0.1);
        const pts = Array.from({ length: 6 })
          .map((__, k) => {
            const angle = (Math.PI / 3) * k - Math.PI / 6;
            return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
          })
          .join(" ");
        return (
          <polygon
            key={i}
            points={pts}
            fill="none"
            stroke={color}
            strokeWidth={size * 0.018}
            opacity={0.8 - i * 0.18}
          />
        );
      })}
    </svg>
  );
}

// ─── Dense Layered Hex Grid (like image 2 - clustered hexagons) ──────────────
export function HexCluster({
  className = "",
  color = "#404293",
  opacity = 0.06,
}: {
  className?: string;
  color?: string;
  opacity?: number;
}) {
  const hexPath = (cx: number, cy: number, r: number) =>
    Array.from({ length: 6 })
      .map((_, k) => {
        const a = (Math.PI / 3) * k - Math.PI / 6;
        return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
      })
      .join(" ");

  const positions = [
    [120, 120],
    [220, 120],
    [170, 207],
    [70, 207],
    [120, 294],
    [220, 294],
    [320, 207],
    [270, 120],
    [20, 120],
    [70, 33],
    [170, 33],
    [270, 33],
  ];

  return (
    <svg
      viewBox="0 0 380 380"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {positions.map(([cx, cy], idx) =>
        [3, 2, 1].map((scale, si) => (
          <polygon
            key={`${idx}-${si}`}
            points={hexPath(cx, cy, (52 * scale) / 3)}
            fill="none"
            stroke={color}
            strokeWidth={1.4}
            opacity={opacity * (1 - si * 0.25)}
          />
        )),
      )}
    </svg>
  );
}

// ─── Bold Chevron / Angular Bracket (like image 1) ──────────────────────────
export function BoldChevron({
  className = "",
  color = "#404293",
  opacity = 1,
  strokes = 3,
}: {
  className?: string;
  color?: string;
  opacity?: number;
  strokes?: number;
}) {
  return (
    <svg
      viewBox="0 0 220 480"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
      fill="none"
    >
      {Array.from({ length: strokes }).map((_, i) => {
        const offset = i * 28;
        return (
          <polyline
            key={i}
            points={`${20 + offset},20 ${190 - offset},240 ${20 + offset},460`}
            stroke={color}
            strokeWidth={28 - i * 4}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity={1 - i * 0.2}
          />
        );
      })}
    </svg>
  );
}

// ─── Original HexGrid (kept for compatibility) ───────────────────────────────
export function HexGrid({
  className = "",
  opacity = 0.04,
}: {
  className?: string;
  opacity?: number;
}) {
  const hexPath = "M25 4.5L46.65 17V42L25 54.5L3.35 42V17L25 4.5Z";
  return (
    <svg
      viewBox="0 0 300 300"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {[
        [0, 0],
        [58, 0],
        [116, 0],
        [174, 0],
        [232, 0],
        [29, 50],
        [87, 50],
        [145, 50],
        [203, 50],
        [0, 100],
        [58, 100],
        [116, 100],
        [174, 100],
        [232, 100],
        [29, 150],
        [87, 150],
        [145, 150],
        [203, 150],
        [0, 200],
        [58, 200],
        [116, 200],
        [174, 200],
        [232, 200],
        [29, 250],
        [87, 250],
        [145, 250],
        [203, 250],
      ].map(([x, y], i) => (
        <path
          key={i}
          d={hexPath}
          transform={`translate(${x},${y})`}
          fill="none"
          stroke="#404293"
          strokeWidth="1.5"
          opacity={opacity}
        />
      ))}
    </svg>
  );
}

// ─── Original DiagonalBands (kept for compatibility) ─────────────────────────
export function DiagonalBands({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMinYMin slice"
    >
      <path
        d="M0 80 L90 0 L120 0 L120 30 L30 120 L0 120 Z"
        fill="#404293"
        opacity="0.15"
      />
      <path
        d="M0 130 L100 0 L120 0 L120 20 L20 150 L0 150 Z"
        fill="#33529F"
        opacity="0.2"
      />
      <path
        d="M0 170 L110 0 L120 0 L120 12 L12 180 L0 180 Z"
        fill="#404293"
        opacity="0.35"
      />
      <path
        d="M0 250 L90 360 L90 400 L60 400 L0 300 Z"
        fill="#404293"
        opacity="0.15"
      />
      <path d="M0 300 L70 400 L50 400 L0 340 Z" fill="#33529F" opacity="0.2" />
      <path d="M0 340 L50 400 L30 400 L0 370 Z" fill="#404293" opacity="0.3" />
    </svg>
  );
}

// ─── Page Corner (kept for compatibility) ─────────────────────────────────────
export function PageCorner({ num }: { num: string }) {
  return (
    <div className="absolute bottom-0 right-0">
      <svg width="50" height="36" viewBox="0 0 56 40" fill="none">
        <path d="M0 40 L56 0 L56 40 Z" fill="#404293" />
        <text
          x="38"
          y="34"
          fontSize="11"
          fill="white"
          fontWeight="700"
          fontFamily="Inter"
        >
          {num}
        </text>
      </svg>
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
      className={`relative rounded-[26px] sm:rounded-[28px] border shadow-2xl overflow-hidden ${
        isDark
          ? "bg-[#0d0e15]/90 border-white/10 shadow-black/40"
          : "bg-white border-slate-200/80 shadow-[#404293]/10"
      }`}
    >
      {/* Title bar */}
      <div
        className={`flex items-center gap-2 px-4 sm:px-5 py-3 border-b ${
          isDark ? "border-white/8 bg-white/[0.02]" : "border-slate-100 bg-slate-50/60"
        }`}
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <div
          className={`ml-3 flex-1 h-6 rounded-md flex items-center px-3 text-[10px] sm:text-[11px] font-medium truncate ${
            isDark ? "bg-white/5 text-gray-500" : "bg-white text-slate-400 border border-slate-200"
          }`}
        >
          app.bluebits.edu/dashboard
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-5 p-4 sm:p-6">
        {/* Mini side nav */}
        <div className="hidden sm:flex flex-col gap-1.5">
          {navItems.map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold ${
                item.active
                  ? "bg-gradient-to-r from-[#404293] to-[#2376BB] text-white shadow-md shadow-[#404293]/20"
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
            className={`rounded-2xl border p-4 flex items-center gap-3 ${
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
                stroke="url(#heroRingGrad)"
              />
              <defs>
                <linearGradient id="heroRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#404293" />
                  <stop offset="100%" stopColor="#2376BB" />
                </linearGradient>
              </defs>
            </svg>
            <div className="min-w-0">
              <div className={`text-lg font-black ${isDark ? "text-white" : "text-[#1a1b2e]"}`}>78%</div>
              <div className={`text-[11px] font-semibold truncate ${isDark ? "text-gray-500" : "text-slate-500"}`}>
                Data Structures
              </div>
            </div>
          </div>

          {/* Next exam card */}
          <div
            className={`rounded-2xl border p-4 ${
              isDark ? "bg-white/[0.03] border-white/8" : "bg-slate-50 border-slate-100"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-3.5 h-3.5 text-[#2376BB]" />
              <span className={`text-[11px] font-bold uppercase tracking-wide ${isDark ? "text-gray-500" : "text-slate-400"}`}>
                Next Exam
              </span>
            </div>
            <div className={`text-sm font-bold mb-1 ${isDark ? "text-white" : "text-[#1a1b2e]"}`}>
              Algorithms Final
            </div>
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2376BB]/15 text-[#2376BB]">
              in 5 days
            </span>
          </div>

          {/* AI chat card */}
          <div
            className={`col-span-2 rounded-2xl border p-4 ${
              isDark ? "bg-white/[0.03] border-white/8" : "bg-slate-50 border-slate-100"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#404293] to-[#2376BB] flex items-center justify-center flex-shrink-0">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
              <span className={`text-[11px] font-bold ${isDark ? "text-gray-300" : "text-slate-600"}`}>
                AI Assistant
              </span>
              <Sparkles className="w-3 h-3 text-[#404293] ml-auto" />
            </div>
            <div
              className={`text-xs rounded-xl rounded-tl-sm px-3 py-2 mb-2 max-w-[85%] ${
                isDark ? "bg-white/8 text-gray-300" : "bg-white text-slate-600 border border-slate-100"
              }`}
            >
              Explain Big-O notation simply?
            </div>
            <div className="flex items-center gap-1 pl-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2376BB]/60 animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#2376BB]/60 animate-pulse [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#2376BB]/60 animate-pulse [animation-delay:300ms]" />
            </div>
          </div>

          {/* Tasks row */}
          <div
            className={`col-span-2 rounded-2xl border p-3.5 flex items-center gap-4 sm:gap-5 overflow-x-auto ${
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
                  className={`text-[11px] font-semibold whitespace-nowrap ${
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

// ─── Tab Label ──────────────────────────────────────────────────────────────
export function TabLabel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-l-full text-white text-[11px] font-black uppercase tracking-widest bg-gradient-to-r from-[#404293] to-[#33529F] shadow-md ${className}`}
    >
      {children}
    </div>
  );
}
