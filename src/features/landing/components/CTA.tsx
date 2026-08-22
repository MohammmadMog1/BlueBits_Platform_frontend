import { ChevronRight, BookOpen } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../shared/i18n/useLanguage";

interface CTAProps {
  navigate: (path: string) => void;
}

export function CTA({ navigate }: CTAProps) {
  const { t } = useTranslation("landing");
  const { isRTL } = useLanguage();

  return (
    <section className="relative py-20 sm:py-32 overflow-hidden bg-gradient-to-br from-[#404293] to-[#2376BB]">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 lg:px-16 text-center"
      >
        <div className="inline-flex items-center gap-2 text-white/70 text-xs font-bold uppercase tracking-[0.14em] mb-5 sm:mb-6">
          {t("cta.badge")}
        </div>
        <h2
          className="text-white mb-5 leading-tight"
          style={{ fontSize: "clamp(1.8rem,5vw,3.5rem)", fontWeight: 800 }}
        >
          {t("cta.titleLine1")}
          <br />
          {t("cta.titleLine2")}
        </h2>
        <p className="text-white/75 text-base sm:text-lg mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
          {t("cta.subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate("/auth/register")}
            className="w-full sm:w-auto group flex items-center justify-center gap-2.5 px-8 sm:px-12 py-3.5 sm:py-4 rounded-2xl bg-white font-semibold shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-200"
            style={{ color: "#404293", fontSize: "0.95rem" }}
          >
            {t("cta.primary")}
            <ChevronRight
              className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isRTL ? "rotate-180" : ""}`}
            />
          </button>
          <button
            onClick={() => navigate("/user/lectures")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl border border-white/25 text-white font-semibold hover:bg-white/10 active:scale-[0.98] transition-colors duration-200"
            style={{ fontSize: "0.95rem" }}
          >
            <BookOpen className="w-4 h-4" />
            {t("cta.secondary")}
          </button>
        </div>
      </motion.div>
    </section>
  );
}
