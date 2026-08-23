import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode, ButtonHTMLAttributes } from "react";
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
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useInView,
} from "motion/react";
import { useLanguage } from "../../../../shared/i18n/useLanguage";

// ─── Eyebrow label ────────────────────────────────────────────────────────
// Small flat uppercase label used once per section intro. The marker is an
// open chevron tick — the same open-edge language as the brand hexagon —
// instead of a generic dot/pill, so it reads as specific to this brand.
export function TabLabel({
  children,
  className = "",
  isDark = false,
}: {
  children: ReactNode;
  className?: string;
  isDark?: boolean;
}) {
  const { isRTL } = useLanguage();
  return (
    <div
      className={`inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.14em] ${
        isDark ? "text-gray-500" : "text-slate-500"
      } ${className}`}
    >
      <svg
        viewBox="0 0 10 10"
        aria-hidden="true"
        className={`w-2.5 h-2.5 flex-shrink-0 ${isRTL ? "-scale-x-100" : ""}`}
        fill="none"
      >
        <path
          d="M2.2 1.3L7.6 5L2.2 8.7"
          stroke={isDark ? "#6D8AE0" : "#2376BB"}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {children}
    </div>
  );
}

// ─── Highlight underline ───────────────────────────────────────────────────
// The accent stroke under a highlighted word in a heading (Hero, About). A
// straight line in the brand gradient rather than a flat color, drawing
// itself in on mount — a plain `animate` rather than `whileInView`, since
// nesting a viewport observer inside a heading that's itself driven by a
// parent variants/animate sequence proved unreliable (it would silently
// never fire in some render paths, e.g. once the English copy wrapped
// "Organized" onto its own line).
export function HighlightUnderline({ isRTL = false, delay = 0.5 }: { isRTL?: boolean; delay?: number }) {
  const gradId = useId();
  const reduced = useReducedMotion();

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 12"
      preserveAspectRatio="none"
      className={`absolute left-0 -bottom-1 w-full h-[0.4em] ${isRTL ? "-scale-x-100" : ""}`}
    >
      <defs>
        {/* userSpaceOnUse — a purely horizontal line has a zero-height
            bounding box, which makes the default objectBoundingBox gradient
            units degenerate (spec-invalid transform) and silently invisible
            in-browser. Explicit user-space coordinates sidestep that. */}
        <linearGradient id={gradId} x1="0" y1="0" x2="120" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#404293" />
          <stop offset="100%" stopColor="#2376BB" />
        </linearGradient>
      </defs>
      <motion.path
        d="M1 9 L114 9"
        stroke={`url(#${gradId})`}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        initial={reduced ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.9 }}
        transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}

// ─── Hex/chevron background watermark ─────────────────────────────────────
// Reconstructs the brand mark's geometry — nested, open-edge hexagon strokes
// — as inline SVG stroke-art instead of a raster/blurred blob. This is a
// brand watermark, not a directional UI element: it is pinned with a
// *physical* `right` offset on purpose and must NOT mirror in RTL.
export function HexBackground({ isDark = false }: { isDark?: boolean }) {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const yOuter = useTransform(scrollY, [0, 1800], reduced ? [0, 0] : [0, -60]);
  const yMid = useTransform(scrollY, [0, 1800], reduced ? [0, 0] : [0, -110]);
  const yInner = useTransform(scrollY, [0, 1800], reduced ? [0, 0] : [0, -32]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
    >
      <svg
        viewBox="0 0 1000 800"
        style={{
          position: "absolute",
          top: "-6%",
          // Physical offset, deliberately not a logical/RTL-aware property —
          // see the comment above.
          right: "-14%",
          width: "min(980px, 92vw)",
          height: "auto",
          filter: isDark
            ? "drop-shadow(0 0 70px rgba(35,118,187,0.45))"
            : "none",
        }}
      >
        <defs>
          <linearGradient id="bb-hex-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#404293" />
            <stop offset="100%" stopColor="#2376BB" />
          </linearGradient>
        </defs>
        <motion.path
          style={{ y: yOuter }}
          d="M910,764 L490,764 L280,400 L490,36 L910,36"
          stroke="url(#bb-hex-grad)"
          strokeWidth={isDark ? 2.2 : 1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity={isDark ? 0.5 : 0.2}
        />
        <motion.path
          style={{ y: yMid }}
          d="M865,686 L535,686 L370,400 L535,114 L865,114"
          stroke="url(#bb-hex-grad)"
          strokeWidth={isDark ? 1.7 : 1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity={isDark ? 0.36 : 0.16}
        />
        <motion.path
          style={{ y: yInner }}
          d="M820,608 L580,608 L460,400 L580,192 L820,192"
          stroke="url(#bb-hex-grad)"
          strokeWidth={isDark ? 1.3 : 1.1}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity={isDark ? 0.26 : 0.12}
        />
      </svg>
    </div>
  );
}

// ─── Grain overlay ─────────────────────────────────────────────────────────
// One cheap, page-wide feTurbulence layer to break the "flat vector render"
// look. Kept subtle enough that it should not read as visible "graininess".
export function GrainOverlay({ isDark = false }: { isDark?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: isDark ? 0.05 : 0.035 }}
      width="100%"
      height="100%"
    >
      <filter id="bb-grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves={2}
          stitchTiles="stitch"
          result="bb-noise"
        />
        <feColorMatrix in="bb-noise" type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#bb-grain)" />
    </svg>
  );
}

// ─── Magnetic button ───────────────────────────────────────────────────────
// Wraps a button with a small cursor-tracked pull and an inner light sweep
// on hover — a more tactile alternative to a flat scale+shadow hover. Press
// feedback is folded into the same transform so it never fights the
// mouse-tracked translate. No-ops entirely under prefers-reduced-motion.
export function MagneticButton({
  children,
  className = "",
  strength = 12,
  style: styleProp,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { strength?: number }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [pressed, setPressed] = useState(false);
  const reduced = useReducedMotion();

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const relY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setOffset({ x: relX * strength, y: relY * strength * 0.5 });
  };
  const reset = () => {
    setOffset({ x: 0, y: 0 });
    setPressed(false);
  };
  const idle = offset.x === 0 && offset.y === 0;

  return (
    <button
      {...rest}
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      className={`group relative isolate overflow-hidden ${className}`}
      style={{
        ...styleProp,
        transform: `translate(${offset.x}px, ${offset.y}px) scale(${pressed ? 0.97 : 1})`,
        transition: idle
          ? "transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.2s ease"
          : "transform 0.15s ease-out, box-shadow 0.2s ease",
      }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[120%]"
      />
      <span className="relative z-10 flex items-center justify-center gap-2.5">
        {children}
      </span>
    </button>
  );
}

// ─── Mouse-tracked tilt ─────────────────────────────────────────────────────
// Small internal helper shared by HeroPreview and AboutPanel: a few degrees
// of perspective tilt that follows the cursor, replacing a static card.
function useTilt(maxDeg = 4) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [style, setStyle] = useState<React.CSSProperties>({
    transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
  });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setStyle({
      transform: `perspective(1000px) rotateX(${(-py * maxDeg).toFixed(2)}deg) rotateY(${(px * maxDeg).toFixed(2)}deg)`,
      transition: "transform 0.15s ease-out",
    });
  };
  const onMouseLeave = () => {
    setStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
      transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)",
    });
  };

  return { ref, style, onMouseMove, onMouseLeave };
}

// ─── Count-up stat ──────────────────────────────────────────────────────────
// Animates a stat's numeric portion (locale-independent, always Latin
// digits — matches the pre-existing behaviour of statsData) up from 0 once
// it scrolls into view. Falls back to the plain value under reduced motion.
function formatStat(original: string, current: number): string {
  const match = original.match(/[\d,]+/);
  if (!match || match.index === undefined) return original;
  const formatted = current.toLocaleString("en-US");
  return (
    original.slice(0, match.index) +
    formatted +
    original.slice(match.index + match[0].length)
  );
}

export function CountUp({
  value,
  className = "",
  durationMs = 1100,
}: {
  value: string;
  className?: string;
  durationMs?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(() => formatStat(value, 0));

  useEffect(() => {
    if (!inView) return;
    const match = value.match(/[\d,]+/);
    const target = match ? parseInt(match[0].replace(/,/g, ""), 10) : null;
    if (reduced || target === null) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(formatStat(value, Math.round(target * eased)));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, reduced, durationMs]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
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
  const tilt = useTilt(4);

  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      style={{ ...tilt.style, transformStyle: "preserve-3d" }}
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
              isDark ? "bg-white/[0.03] border-white/8" : "bg-slate-100/70 border-slate-200"
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
              isDark ? "bg-white/[0.03] border-white/8" : "bg-slate-100/70 border-slate-200"
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
              isDark ? "bg-white/[0.03] border-white/8" : "bg-slate-100/70 border-slate-200"
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
              isDark ? "bg-white/[0.03] border-white/8" : "bg-slate-100/70 border-slate-200"
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
  const tilt = useTilt(4);

  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      style={{ ...tilt.style, transformStyle: "preserve-3d" }}
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
