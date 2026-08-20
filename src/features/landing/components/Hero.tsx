import { GraduationCap, ChevronRight, BookOpen } from "lucide-react";
import { motion, type Variants } from "motion/react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../shared/i18n/useLanguage";
import { HexGrid, HeroPreview } from "./shared/VisualHelpers";
import type { statsData } from "../data/landingData";

interface HeroProps {
  isDark: boolean;
  navigate: (path: string) => void;
  stats: typeof statsData;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function Hero({ isDark, navigate, stats }: HeroProps) {
  const { t } = useTranslation("landing");
  const { isRTL } = useLanguage();

  return (
    <section className="relative flex items-center overflow-hidden pt-28 sm:pt-32">
      {/* Subtle hex texture - very light */}
      <HexGrid
        className="absolute -right-10 top-0 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px]"
        opacity={isDark ? 0.04 : 0.025}
      />
      <HexGrid
        className="absolute -left-20 bottom-0 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px]"
        opacity={isDark ? 0.03 : 0.018}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 py-10 sm:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-6 sm:mb-10 border ${
              isDark
                ? "bg-[#404293]/15 border-[#404293]/30 text-[#9fa8e8]"
                : "bg-[#404293]/8 border-[#404293]/20 text-[#404293]"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 flex-shrink-0" />
            {t("hero.badge")}
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className={`mb-5 leading-[1.12] tracking-tight ${isDark ? "text-white" : "text-[#1a1b2e]"}`}
            style={{ fontSize: "clamp(2rem, 8vw, 5rem)", fontWeight: 800 }}
          >
            {t("hero.titleLead")}{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-[#404293] via-[#33529F] to-[#2376BB] bg-clip-text text-transparent">
                {t("hero.titleHighlight")}
              </span>
              <svg
                className="absolute -bottom-1 sm:-bottom-2 start-0 w-full"
                height="5"
                viewBox="0 0 200 6"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q100 0 200 5"
                  stroke="url(#ug)"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="ug" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#404293" />
                    <stop offset="100%" stopColor="#2376BB" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className={`text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6"
          >
            <button
              onClick={() => navigate("/auth/register")}
              className="w-full sm:w-auto group flex items-center justify-center gap-2.5 px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-[#404293] to-[#2376BB] text-white font-bold shadow-xl shadow-[#404293]/20 hover:shadow-[#404293]/35 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300"
              style={{ fontSize: "0.95rem" }}
            >
              {t("hero.ctaPrimary")}
              <ChevronRight
                className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isRTL ? "rotate-180" : ""}`}
              />
            </button>

            <button
              onClick={() => navigate("/user/lectures")}
              className={`w-full sm:w-auto group flex items-center justify-center gap-2.5 px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl font-bold border-2 active:scale-[0.98] transition-all duration-300 ${
                isDark
                  ? "border-[#404293]/40 text-[#9fa8e8] hover:border-[#404293] hover:bg-[#404293]/10"
                  : "border-[#404293]/30 text-[#404293] hover:border-[#404293] hover:bg-[#404293]/5"
              }`}
              style={{ fontSize: "0.95rem" }}
            >
              <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
              {t("hero.ctaSecondary")}
            </button>
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className={`text-xs mb-10 sm:mb-14 font-medium ${isDark ? "text-gray-600" : "text-gray-400"}`}
          >
            {t("hero.note")}
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={5}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 max-w-3xl mx-auto"
          >
            {stats.map((s) => (
              <div
                key={s.id}
                className={`relative p-4 sm:p-6 rounded-2xl border group overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                  isDark
                    ? "bg-white/3 border-white/5 hover:bg-white/5 hover:border-[#404293]/40 shadow-xl shadow-black/10"
                    : "bg-white/80 border-slate-100 shadow-sm hover:border-[#404293]/35 hover:shadow-lg hover:shadow-[#404293]/5 hover:bg-white"
                }`}
              >
                <div className="absolute top-0 start-0 w-full h-[3px] bg-gradient-to-r from-[#404293] to-[#2376BB] opacity-0 group-hover:opacity-100 transition-opacity" />
                {s.icon && (
                  <s.icon
                    className={`w-4 h-4 mb-2 ${isDark ? "text-[#9fa8e8]" : "text-[#404293]"}`}
                  />
                )}
                <div className="text-xl sm:text-2xl font-black mb-0.5 bg-gradient-to-r from-[#404293] to-[#2376BB] bg-clip-text text-transparent">
                  {s.value}
                </div>
                <div
                  className={`text-[11px] sm:text-xs font-semibold ${isDark ? "text-gray-500" : "text-slate-500"}`}
                >
                  {t(`stats.${s.id}`)}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Product preview */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={6}
          className="relative max-w-4xl mx-auto mt-16 sm:mt-24"
        >
          <div
            className={`absolute -inset-x-6 -inset-y-6 rounded-[40px] blur-3xl -z-10 ${
              isDark ? "bg-[#404293]/10" : "bg-[#404293]/5"
            }`}
          />
          <HeroPreview isDark={isDark} />
        </motion.div>
      </div>
    </section>
  );
}
