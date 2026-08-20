import { Shield, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { TabLabel, PageCorner } from "./shared/VisualHelpers";
import type { featuresData } from "../data/landingData";

type Feature = (typeof featuresData)[number];

interface FeaturesProps {
  isDark: boolean;
  features: typeof featuresData;
  handleFeatureClick: (f: Feature) => void;
}

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
          <TabLabel className="mb-4 sm:mb-6">
            <Shield className="w-3 h-3" />
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {features.map((f, idx) => (
            <motion.div
              key={f.id}
              onClick={() => handleFeatureClick(f)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: (idx % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={`relative group p-6 sm:p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-2 overflow-hidden cursor-pointer active:scale-[0.98] ${
                isDark
                  ? "bg-[#151720]/80 backdrop-blur-md border-white/5 hover:bg-[#181a26] hover:border-[#404293]/40 hover:shadow-xl hover:shadow-[#404293]/5"
                  : "bg-white border-slate-100 hover:border-[#404293]/35 hover:shadow-xl hover:shadow-[#404293]/8"
              }`}
            >
              {f.free && (
                <div className="absolute top-4 start-4 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 text-[10px] font-black uppercase tracking-wide">
                  {t("features.free")}
                </div>
              )}
              <div
                className="absolute top-4 end-5 font-black opacity-5 select-none pointer-events-none"
                style={{ fontSize: "3.5rem", color: f.accent, fontWeight: 900 }}
              >
                {f.num}
              </div>
              <div
                className="absolute top-0 start-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-3xl"
                style={{
                  background: `linear-gradient(90deg,${f.accent},#2376BB)`,
                }}
              />
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-5 mt-2 transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg,${f.accent}22,${f.accent}44)`,
                  border: `1.5px solid ${f.accent}30`,
                }}
              >
                <f.icon
                  className="w-6 h-6 sm:w-7 sm:h-7"
                  style={{ color: f.accent }}
                />
              </div>
              <h3
                className={`font-bold text-base sm:text-lg mb-2.5 ${isDark ? "text-gray-100" : "text-[#1a1b2e]"}`}
              >
                {t(`features.items.${f.id}.title`)}
              </h3>
              <p
                className={`text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                {t(`features.items.${f.id}.desc`)}
              </p>
              <div
                className="mt-5 flex items-center gap-1.5 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: f.accent }}
              >
                {f.free
                  ? t("features.browseFree")
                  : t("features.loginToAccess")}{" "}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
              <PageCorner num={f.num} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
