import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTheme } from 'next-themes';

// Components
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { About } from './components/About';
import { Team } from './components/Team';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';

// Data & Assets
import { BATCHES, featuresData, statsData } from './data/landingData';
// Note: Ensure this path exists or update it to your actual logo location
// import LogoImg from '@/imports/Logo.png'; 
const LogoImg = '/Logo.png'; // Placeholder path

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled]             = useState(false);
  const [showAuthModal, setShowAuthModal]   = useState(false);
  const [activeBatch, setActiveBatch]       = useState('25');
  const [expandedRole, setExpandedRole]     = useState<string | null>(null);
  
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
    <div className={`min-h-screen ${isDark ? 'bg-[#0e0f10] text-white' : 'bg-white text-[#1a1b2e]'}`}
         style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>

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

      {/* ─── TEAM ─── */}
      <Team 
        isDark={isDark}
        batches={BATCHES}
        activeBatch={activeBatch}
        setActiveBatch={setActiveBatch}
        expandedRole={expandedRole}
        setExpandedRole={setExpandedRole}
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
