import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTheme } from 'next-themes';

// Components
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { About } from './components/About';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { BoldChevron, HexCluster, LayeredHex } from './components/shared/VisualHelpers';
import logoImg from '../../app/assets/Logo.png';
// Data & Assets
import { featuresData, statsData } from './data/landingData';
const LogoImg = logoImg;

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled]             = useState(false);
  const [showAuthModal, setShowAuthModal]   = useState(false);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const isDark   = theme === 'dark';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFeatureClick = (f: any) => {
    if (f.free) {
      navigate(f.path);
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#08090d] text-gray-100' : 'bg-white text-[#1c1d30]'}`}
         style={{ fontFamily: "'Plus Jakarta Sans', 'Cairo', 'Inter', sans-serif" }}>

      {/* ─── Global Background Layer ─── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Bold Chevron — top right (like image 1) */}
        <BoldChevron
          className="absolute -right-10 top-0 w-[180px] sm:w-[260px] h-[380px] sm:h-[540px]"
          color="#404293"
          opacity={isDark ? 0.22 : 0.55}
          strokes={3}
        />
        {/* Secondary smaller chevron — bottom left mirrored */}
        <BoldChevron
          className="absolute -left-10 bottom-0 w-[120px] sm:w-[180px] h-[260px] sm:h-[380px] scale-x-[-1]"
          color="#404293"
          opacity={isDark ? 0.10 : 0.20}
          strokes={2}
        />

        {/* HexCluster — bottom right area (like image 2) */}
        <HexCluster
          className="absolute -bottom-16 -right-16 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px]"
          color={isDark ? '#6b74d4' : '#404293'}
          opacity={isDark ? 0.05 : 0.045}
        />
        {/* HexCluster — top left */}
        <HexCluster
          className="absolute -top-16 -left-16 w-[260px] sm:w-[420px] h-[260px] sm:h-[420px]"
          color={isDark ? '#6b74d4' : '#404293'}
          opacity={isDark ? 0.04 : 0.035}
        />

        {/* Single layered hex accents (scattered) */}
        <LayeredHex
          className="absolute top-[38%] right-[10%] w-[90px] sm:w-[130px] h-[90px] sm:h-[130px]"
          color="#404293"
          rings={3}
          opacity={isDark ? 0.08 : 0.10}
          size={100}
        />
        <LayeredHex
          className="absolute top-[65%] left-[8%] w-[70px] sm:w-[110px] h-[70px] sm:h-[110px]"
          color="#2376BB"
          rings={3}
          opacity={isDark ? 0.07 : 0.09}
          size={100}
        />

        {/* Subtle radial ambient glow (dark mode only) */}
        {isDark && (
          <>
            <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-[#404293]/8 blur-[120px]" />
            <div className="absolute top-[50%] -left-32 w-[350px] h-[350px] rounded-full bg-[#2376BB]/6 blur-[100px]" />
          </>
        )}
      </div>

      {/* ─── Auth Modal ─── */}
      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)} 
          onNavigate={navigate} 
        />
      )}

      {/* ─── NAVBAR ─── */}
      <Navbar 
        scrolled={scrolled}
        isDark={isDark}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        setTheme={setTheme}
        navigate={navigate}
        LogoImg={LogoImg}
      />

      {/* ─── HERO ─── */}
      <Hero 
        isDark={isDark} 
        navigate={navigate} 
        stats={statsData} 
      />

      {/* ─── FEATURES ─── */}
      <Features 
        isDark={isDark} 
        features={featuresData} 
        handleFeatureClick={handleFeatureClick} 
      />

      {/* ─── ABOUT ─── */}
      <About 
        isDark={isDark} 
        navigate={navigate} 
      />

   

      {/* ─── CTA ─── */}
      <CTA navigate={navigate} />

      {/* ─── FOOTER ─── */}
      <Footer 
        isDark={isDark} 
        LogoImg={LogoImg} 
      />
    </div>
  );
}
