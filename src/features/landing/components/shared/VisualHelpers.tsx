import React from 'react';

export function DiagonalBands({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 400" fill="none" xmlns="http://www.w3.org/2000/svg"
         className={className} preserveAspectRatio="xMinYMin slice">
      <path d="M0 80 L90 0 L120 0 L120 30 L30 120 L0 120 Z"  fill="#404293" opacity="0.15"/>
      <path d="M0 130 L100 0 L120 0 L120 20 L20 150 L0 150 Z" fill="#33529F" opacity="0.2"/>
      <path d="M0 170 L110 0 L120 0 L120 12 L12 180 L0 180 Z" fill="#404293" opacity="0.35"/>
      <path d="M0 250 L90 360 L90 400 L60 400 L0 300 Z"       fill="#404293" opacity="0.15"/>
      <path d="M0 300 L70 400 L50 400 L0 340 Z"               fill="#33529F" opacity="0.2"/>
      <path d="M0 340 L50 400 L30 400 L0 370 Z"               fill="#404293" opacity="0.3"/>
    </svg>
  );
}

export function HexGrid({ className = '', opacity = 0.04 }: { className?: string; opacity?: number }) {
  const hexPath = "M25 4.5L46.65 17V42L25 54.5L3.35 42V17L25 4.5Z";
  return (
    <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" className={className}>
      {[[0,0],[58,0],[116,0],[174,0],[232,0],[29,50],[87,50],[145,50],[203,50],
        [0,100],[58,100],[116,100],[174,100],[232,100],[29,150],[87,150],[145,150],[203,150],
        [0,200],[58,200],[116,200],[174,200],[232,200],[29,250],[87,250],[145,250],[203,250]]
        .map(([x,y],i) => (
          <path key={i} d={hexPath} transform={`translate(${x},${y})`}
                fill="none" stroke="#404293" strokeWidth="1.5" opacity={opacity} />
        ))}
    </svg>
  );
}

export function PageCorner({ num }: { num: string }) {
  return (
    <div className="absolute bottom-0 right-0">
      <svg width="50" height="36" viewBox="0 0 56 40" fill="none">
        <path d="M0 40 L56 0 L56 40 Z" fill="#404293"/>
        <text x="38" y="34" fontSize="11" fill="white" fontWeight="700" fontFamily="Inter">{num}</text>
      </svg>
    </div>
  );
}

export function TabLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-l-full text-white text-[11px] font-black uppercase tracking-widest bg-gradient-to-r from-[#404293] to-[#33529F] shadow-md ${className}`}>
      {children}
    </div>
  );
}
