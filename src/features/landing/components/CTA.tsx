import { ChevronRight, BookOpen } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../shared/i18n/useLanguage";
import { MagneticButton } from "./shared/VisualHelpers";

interface CTAProps {
  navigate: (path: string) => void;
}

export function CTA({ navigate }: CTAProps) {
  const { t } = useTranslation("landing");
  const { isRTL } = useLanguage();

  return (
    <section className="relative py-20 sm:py-32 overflow-hidden bg-[#12131f]">
      {/* Section-local echo of the background hex motif — a small, static
          corner accent rather than the ambient full-band gradient this
          section used to be washed in. Physically pinned like the global
          watermark; not mirrored for RTL. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 400 300"
        className="absolute -top-10 -right-10 w-[280px] sm:w-[380px] h-auto opacity-[0.16] pointer-events-none"
      >
        <defs>
          <linearGradient id="bb-cta-hex-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7A8CF0" />
            <stop offset="100%" stopColor="#5FB4EE" />
          </linearGradient>
        </defs>
        <path
          d="M370,270 L230,270 L160,150 L230,30 L370,30"
          stroke="url(#bb-cta-hex-grad)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M320,220 L260,220 L225,150 L260,80 L320,80"
          stroke="url(#bb-cta-hex-grad)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 lg:px-16 text-center"
      >
        <div className="inline-flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-[0.14em] mb-5 sm:mb-6">
          <svg viewBox="0 0 10 10" aria-hidden="true" className={`w-2.5 h-2.5 flex-shrink-0 ${isRTL ? "-scale-x-100" : ""}`} fill="none">
            <path d="M2.2 1.3L7.6 5L2.2 8.7" stroke="#7FA8F5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
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
        <p className="text-white/70 text-base sm:text-lg mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
          {t("cta.subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <MagneticButton
            onClick={() => navigate("/auth/register")}
            className="w-full sm:w-auto px-8 sm:px-12 py-3.5 sm:py-4 rounded-2xl bg-white font-semibold shadow-sm hover:shadow-md"
            style={{ color: "#12131f", fontSize: "0.95rem" }}
          >
            {t("cta.primary")}
            <ChevronRight
              className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isRTL ? "rotate-180" : ""}`}
            />
          </MagneticButton>
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
