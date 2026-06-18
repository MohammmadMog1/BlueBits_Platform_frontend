import React from 'react';
import { GraduationCap, Zap, Shield, Users, TrendingUp, ChevronRight, Star } from 'lucide-react';
import { HexGrid, TabLabel } from './shared/VisualHelpers';

// Fallback image component if not found in shared
const ImageWithFallback = ({ src, alt, className }: { src: string, alt: string, className?: string }) => (
  <img src={src} alt={alt} className={className} onError={(e) => {
    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541178735493-479c1a27ed24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800';
  }} />
);

interface AboutProps {
  isDark: boolean;
  navigate: (path: string) => void;
}

export function About({ isDark, navigate }: AboutProps) {
  return (
    <section id="about" className={`relative py-20 sm:py-32 overflow-hidden ${isDark ? 'bg-[#0e0f10]' : 'bg-white'}`}>
      <HexGrid className="absolute right-0 top-0 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px]" opacity={isDark ? 0.05 : 0.03} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <TabLabel className="mb-6 sm:mb-8">
              <GraduationCap className="w-3 h-3" />About BlueBits
            </TabLabel>
            <h2 className={`leading-tight mb-6 ${isDark ? 'text-white' : 'text-[#1a1b2e]'}`}
                style={{ fontSize: 'clamp(1.7rem, 3.5vw, 2.8rem)', fontWeight: 800 }}>
              Built by Students,{' '}
              <span className="bg-gradient-to-r from-[#404293] to-[#2376BB] bg-clip-text text-transparent">
                for Students
              </span>
            </h2>
            <p className={`text-base leading-[1.9] mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              BlueBits was born from a real challenge — managing lectures, assignments, and exam prep in a fragmented academic environment. Our team built the platform we always wished we had.
            </p>
            <p className={`text-base leading-[1.9] mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Every feature feels like a natural extension of your academic routine — clean, precise, and reliable.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { icon: Zap,        label: 'Lightning Fast',   desc: 'Instant access to resources' },
                { icon: Shield,     label: 'Secure & Private', desc: 'Your data stays protected'   },
                { icon: Users,      label: 'Community',        desc: 'Collaborative environment'   },
                { icon: TrendingUp, label: 'Always Improving', desc: 'Regular updates'             },
              ].map(item => (
                <div key={item.label} className={`p-4 rounded-2xl border transition-colors ${
                  isDark ? 'bg-white/4 border-white/8 hover:border-[#404293]/30' : 'bg-[#F1FFFA]/60 border-gray-200 hover:border-[#404293]/30'
                }`}>
                  <item.icon className="w-4 h-4 text-[#404293] mb-2.5" />
                  <div className={`text-sm font-bold mb-0.5 ${isDark ? 'text-white' : 'text-[#1a1b2e]'}`}>{item.label}</div>
                  <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{item.desc}</div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/auth')}
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] text-white font-bold shadow-lg shadow-[#404293]/25 hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm active:scale-[0.98]">
              Join BlueBits <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="relative mt-4 lg:mt-0">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-white/10">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1541178735493-479c1a27ed24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
                alt="Students studying"
                className="w-full h-60 sm:h-80 lg:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#404293]/40 via-transparent to-transparent" />
            </div>
            <div className={`absolute -bottom-4 -left-2 sm:-left-6 z-20 p-4 rounded-2xl shadow-2xl border ${isDark ? 'bg-[#1a1b2e] border-white/10' : 'bg-white border-gray-100'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#404293] to-[#2376BB] flex items-center justify-center shadow-lg flex-shrink-0">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className={`font-black text-base ${isDark ? 'text-white' : 'text-[#1a1b2e]'}`}>98% Satisfaction</div>
                  <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>2,500+ students</div>
                </div>
              </div>
            </div>
            <div className="absolute -top-3 -right-2 sm:-right-4 z-20 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#404293] to-[#33529F] shadow-xl">
              <div className="text-white font-black text-sm">2025 / 2026</div>
              <div className="text-white/70 text-xs font-semibold">Academic Year</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
