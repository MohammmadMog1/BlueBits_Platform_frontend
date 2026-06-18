import React from 'react';
import { Sun, Moon, Menu, X, BookOpen } from 'lucide-react';

interface NavbarProps {
  scrolled: boolean;
  isDark: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  setTheme: (theme: string) => void;
  navigate: (path: string) => void;
  LogoImg: string;
}

export function Navbar({
  scrolled,
  isDark,
  mobileMenuOpen,
  setMobileMenuOpen,
  setTheme,
  navigate,
  LogoImg
}: NavbarProps) {
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? isDark
          ? 'bg-[#0e0f10]/95 border-b border-white/8 shadow-lg backdrop-blur-lg'
          : 'bg-white/95 border-b border-gray-100 shadow-sm backdrop-blur-lg'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between h-16 sm:h-20">
        <img src={LogoImg} alt="BlueBits" className="h-7 sm:h-9 object-contain flex-shrink-0" />

        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          {[['Features','#features'],['About','#about'],['Team','#team']].map(([l,h]) => (
            <a key={l} href={h} className={`text-sm font-medium transition-colors hover:text-[#404293] ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {l}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`p-2 sm:p-2.5 rounded-xl transition-colors ${isDark ? 'bg-white/8 hover:bg-white/15 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-500'}`}>
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          
          <button onClick={() => navigate('/app/lectures')}
            className={`hidden md:flex items-center gap-1.5 text-sm font-bold px-4 py-2.5 rounded-xl border-2 border-[#2376BB]/40 transition-all duration-200 ${
              isDark ? 'text-[#7eb8e8] hover:border-[#2376BB] hover:bg-[#2376BB]/8' : 'text-[#2376BB] hover:border-[#2376BB] hover:bg-[#2376BB]/5'
            }`}>
            <BookOpen className="w-3.5 h-3.5" />
            المحاضرات
          </button>
          
          <button onClick={() => navigate('/auth')}
            className="hidden md:block text-sm font-bold px-4 py-2.5 rounded-xl border-2 border-[#404293] text-[#404293] hover:bg-[#404293] hover:text-white transition-all duration-200">
            Sign In
          </button>
          
          <button onClick={() => navigate('/auth')}
            className="hidden md:block text-sm font-bold px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] text-white shadow-lg shadow-[#404293]/25 hover:shadow-xl hover:-translate-y-0.5 transition-all">
            Get Started
          </button>
          
          <button onClick={() => navigate('/auth')}
            className="md:hidden text-sm font-bold px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] text-white shadow-md">
            Start
          </button>
          
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className={`md:hidden border-t px-4 py-4 space-y-1 ${isDark ? 'border-white/10 bg-[#0e0f10]/98' : 'border-gray-100 bg-white/98'}`}>
          {[['Features','#features'],['About','#about'],['Team','#team']].map(([l,h]) => (
            <a key={l} href={h}
               className={`block text-base font-semibold py-3 px-3 rounded-xl transition-colors ${isDark ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-50'}`}
               onClick={() => setMobileMenuOpen(false)}>
              {l}
            </a>
          ))}
          <button onClick={() => { navigate('/app/lectures'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-2 text-base font-bold py-3 px-3 rounded-xl border-2 border-[#2376BB]/40 ${isDark ? 'text-[#7eb8e8]' : 'text-[#2376BB]'}`}>
            <BookOpen className="w-4 h-4" /> المحاضرات مجاناً
          </button>
          <div className="pt-2 flex gap-2">
            <button onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}
              className="flex-1 text-sm font-bold py-3 rounded-xl border-2 border-[#404293] text-[#404293]">
              Sign In
            </button>
            <button onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}
              className="flex-1 text-sm font-bold py-3 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] text-white shadow-md">
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
