import React from "react";

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
