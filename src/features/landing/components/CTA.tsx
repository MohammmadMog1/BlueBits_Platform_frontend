import React from 'react';
import { Zap, ChevronRight, BookOpen } from 'lucide-react';
import { HexGrid, DiagonalBands } from './shared/VisualHelpers';

interface CTAProps {
  navigate: (path: string) => void;
}

export function CTA({ navigate }: CTAProps) {
  return (
    <section className="relative py-20 sm:py-32 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0f1015 0%, #404293 50%, #2376BB 100%)' }} />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <HexGrid className="absolute -right-10 top-0 w-[400px] sm:w-[600px] h-full" opacity={0.08} />
        <HexGrid className="absolute -left-10 bottom-0 w-[280px] sm:w-[400px] h-full" opacity={0.05} />
      </div>
      <div className="absolute right-0 top-0 h-full pointer-events-none overflow-hidden">
        <DiagonalBands className="h-full w-auto max-w-[60px] sm:max-w-[100px] opacity-30 scale-x-[-1]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 lg:px-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/20 text-white text-xs sm:text-sm font-semibold mb-6 sm:mb-8">
          <Zap className="w-3.5 h-3.5" />Start your academic journey
        </div>
        <h2 className="text-white mb-5 leading-tight"
            style={{ fontSize:'clamp(1.8rem,5vw,3.5rem)', fontWeight:800 }}>
          Ready to Transform<br />Your Learning?
        </h2>
        <p className="text-white/75 text-base sm:text-lg mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
          Join thousands of students already using BlueBits to ace their courses, stay organized, and learn smarter every day.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button onClick={() => navigate('/auth')}
            className="w-full sm:w-auto group flex items-center justify-center gap-2.5 px-8 sm:px-12 py-3.5 sm:py-4 rounded-2xl bg-white font-bold shadow-xl shadow-black/10 hover:shadow-2xl hover:shadow-[#404293]/35 hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-300"
            style={{ color:'#404293', fontSize:'0.95rem' }}>
            Get Started for Free
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button onClick={() => navigate('/app/lectures')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl border-2 border-white/20 text-white font-bold backdrop-blur-sm hover:bg-white/10 hover:border-white/40 active:scale-[0.97] transition-all duration-300"
            style={{ fontSize:'0.95rem' }}>
            <BookOpen className="w-4 h-4" />استعرض المحاضرات
          </button>
        </div>
      </div>
    </section>
  );
}
