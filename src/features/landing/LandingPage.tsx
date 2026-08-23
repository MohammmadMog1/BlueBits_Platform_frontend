import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTheme } from "next-themes";

// Components
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { About } from "./components/About";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";
import { AuthModal } from "./components/AuthModal";
import { HexBackground, GrainOverlay } from "./components/shared/VisualHelpers";
import logoImg from "../../app/assets/Logo.png";
// Data & Assets
import { featuresData, statsData } from "./data/landingData";
const LogoImg = logoImg;

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === "dark";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFeatureClick = (f: any) => {
    if (f.free) {
      navigate(f.path);
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${isDark ? "bg-[#08090d] text-gray-100" : "bg-[#EDF1FA] text-[#1c1d30]"}`}
      style={{
        fontFamily: "'Plus Jakarta Sans', 'Cairo', 'Inter', sans-serif",
      }}
    >
      {/* ─── Background — brand-mark hex/chevron watermark + film grain ─── */}
      <HexBackground isDark={isDark} />
      <GrainOverlay isDark={isDark} />

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
      <Hero isDark={isDark} navigate={navigate} stats={statsData} />

      {/* ─── FEATURES ─── */}
      <Features
        isDark={isDark}
        features={featuresData}
        handleFeatureClick={handleFeatureClick}
      />

      {/* ─── ABOUT ─── */}
      <About isDark={isDark} navigate={navigate} />

      {/* ─── CTA ─── */}
      <CTA navigate={navigate} />

      {/* ─── FOOTER ─── */}
      <Footer isDark={isDark} LogoImg={LogoImg} />
    </div>
  );
}
