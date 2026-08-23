import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { TabLabel } from "./shared/VisualHelpers";
import type { featuresData } from "../data/landingData";

type Feature = (typeof featuresData)[number];

interface FeaturesProps {
  isDark: boolean;
  features: typeof featuresData;
  handleFeatureClick: (f: Feature) => void;
}

// Features that get the wide "spotlight" slot in the bento layout — the free
// flagship feature and the AI assistant, BlueBits' two headline offerings.
const WIDE_IDS = new Set(["lectures", "ai"]);

export function Features({
  isDark,
  features,
  handleFeatureClick,
}: FeaturesProps) {
  const { t } = useTranslation("landing");

  return (
    <section id="features" className="relative py-20 sm:py-32 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 sm:mb-20"
        >
          <TabLabel className="mb-4 sm:mb-6" isDark={isDark}>
            {t("features.badge")}
          </TabLabel>
          <h2
            className={`leading-tight mb-4 ${isDark ? "text-white" : "text-[#1a1b2e]"}`}
            style={{ fontSize: "clamp(1.7rem, 4vw, 3rem)", fontWeight: 800 }}
          >
            {t("features.title")}
          </h2>
          <p
            className={`text-base sm:text-lg leading-relaxed max-w-2xl ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            {t("features.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {features.map((f, idx) => {
            const isWide = WIDE_IDS.has(f.id);
            return (
              <motion.div
                key={f.id}
                onClick={() => handleFeatureClick(f)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleFeatureClick(f);
                  }
                }}
                role="button"
                tabIndex={0}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: (idx % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={`bb-edge-card relative group p-6 sm:p-8 rounded-2xl border overflow-hidden transition-all duration-300 cursor-pointer active:scale-[0.98] hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2376BB] focus-visible:ring-offset-2 ${
                  isWide ? "sm:col-span-2" : ""
                } ${
                  isDark
                    ? "bg-white/[0.025] border-white/8 hover:border-white/15 hover:bg-white/[0.04] focus-visible:ring-offset-[#08090d]"
                    : "bg-white border-slate-100 hover:border-slate-200 hover:shadow-[0_1px_2px_rgba(15,17,26,0.04),0_20px_36px_-20px_rgba(15,17,26,0.18)] focus-visible:ring-offset-white"
                }`}
              >
                {/* Spotlight glow — the two flagship (wide) cards get a soft
                    colored blur behind their content instead of the ghost
                    numeral, so they read as premium rather than "bigger of
                    the same". */}
                {isWide && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-20 -end-20 w-64 h-64 rounded-full blur-3xl transition-opacity duration-300 group-hover:opacity-80"
                    style={{ background: f.accent, opacity: isDark ? 0.16 : 0.12 }}
                  />
                )}

                {/* Ghost numeral — uses the data's unused `num` field as an
                    oversized, low-opacity corner mark instead of a generic
                    icon-in-a-square repeated identically on every card. On
                    the wide banner cards it sits opposite the icon (the
                    logical "end" side, which is also where the spotlight
                    glow lives) so it fills what would otherwise be a bare
                    stretch of empty card. */}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none select-none absolute -bottom-3 end-3 font-black leading-none tracking-tighter transition-transform duration-300 group-hover:scale-105 ${
                    isWide ? "text-[104px] sm:text-[140px]" : "text-[80px] sm:text-[104px]"
                  }`}
                  style={{ color: f.accent, opacity: isDark ? 0.14 : 0.06 }}
                >
                  {f.num}
                </span>

                {f.free && (
                  <div
                    className={`absolute top-4 sm:top-5 end-4 sm:end-5 z-10 flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wide ${
                      isDark
                        ? "bg-emerald-500/12 text-emerald-400"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {t("features.free")}
                  </div>
                )}

                <div className={`relative z-10 ${isWide ? "sm:flex sm:items-center sm:gap-8" : ""}`}>
                  <div
                    className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-5 shrink-0 transition-transform duration-300 group-hover:scale-105 ${isWide ? "sm:mb-0" : ""}`}
                    style={{
                      background: `linear-gradient(135deg, ${f.accent}${isDark ? "3d" : "1f"}, ${f.accent}${isDark ? "14" : "08"})`,
                      boxShadow: `inset 0 0 0 1px ${f.accent}${isDark ? "3d" : "26"}`,
                    }}
                  >
                    <f.icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: f.accent }} />
                  </div>
                  <div className={isWide ? "sm:flex-1" : ""}>
                    <h3
                      className={`font-semibold text-base sm:text-lg mb-2 ${isDark ? "text-gray-100" : "text-[#1a1b2e]"}`}
                    >
                      {t(`features.items.${f.id}.title`)}
                    </h3>
                    <p
                      className={`text-sm leading-relaxed mb-5 ${isDark ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {t(`features.items.${f.id}.desc`)}
                    </p>
                    <div
                      className={`flex items-center gap-1.5 text-xs font-semibold opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-300 group-hover:gap-2.5 ${
                        isDark ? "text-gray-300" : "text-[#404293]"
                      }`}
                    >
                      {f.free
                        ? t("features.browseFree")
                        : t("features.loginToAccess")}{" "}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
