import { ChevronRight, BookOpen } from "lucide-react";
import { motion, type Variants } from "motion/react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../shared/i18n/useLanguage";
import { TabLabel, HeroPreview, MagneticButton, CountUp, HighlightUnderline } from "./shared/VisualHelpers";
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
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 py-10 sm:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="flex justify-center mb-6 sm:mb-8"
          >
            <TabLabel isDark={isDark}>{t("hero.badge")}</TabLabel>
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
            <span className="relative inline-block text-[#2376BB]">
              {t("hero.titleHighlight")}
              <HighlightUnderline isRTL={isRTL} />
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
            <MagneticButton
              onClick={() => navigate("/auth/register")}
              className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-[#404293] to-[#2376BB] text-white font-semibold shadow-sm hover:shadow-md"
              style={{ fontSize: "0.95rem" }}
            >
              {t("hero.ctaPrimary")}
              <ChevronRight
                className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isRTL ? "rotate-180" : ""}`}
              />
            </MagneticButton>

            <button
              onClick={() => navigate("/user/lectures")}
              className={`w-full sm:w-auto group flex items-center justify-center gap-2.5 px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl font-semibold border active:scale-[0.98] transition-colors duration-200 ${
                isDark
                  ? "border-white/10 text-gray-200 hover:bg-white/5"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
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
                className={`p-4 sm:p-6 rounded-2xl border transition-colors duration-200 ${
                  isDark
                    ? "border-white/8 hover:border-white/15"
                    : "border-slate-100 hover:border-slate-200"
                }`}
              >
                {s.icon && (
                  <s.icon
                    className={`w-4 h-4 mb-2 ${isDark ? "text-gray-500" : "text-slate-400"}`}
                  />
                )}
                <CountUp
                  value={s.value}
                  className={`block text-xl sm:text-2xl font-bold mb-0.5 ${isDark ? "text-white" : "text-[#1a1b2e]"}`}
                />
                <div
                  className={`text-[11px] sm:text-xs font-medium ${isDark ? "text-gray-500" : "text-slate-500"}`}
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
          <HeroPreview isDark={isDark} />
        </motion.div>
      </div>
    </section>
  );
}
