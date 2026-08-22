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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {features.map((f, idx) => (
            <motion.div
              key={f.id}
              onClick={() => handleFeatureClick(f)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: (idx % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={`relative group p-6 sm:p-8 rounded-2xl border transition-colors duration-200 cursor-pointer active:scale-[0.98] ${
                isDark
                  ? "bg-white/[0.02] border-white/8 hover:border-white/15"
                  : "bg-white border-slate-100 hover:border-slate-200 hover:shadow-[0_1px_2px_rgba(15,17,26,0.04),0_12px_28px_-20px_rgba(15,17,26,0.16)]"
              }`}
            >
              {f.free && (
                <div
                  className={`absolute top-4 sm:top-5 end-4 sm:end-5 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wide ${
                    isDark
                      ? "bg-emerald-500/12 text-emerald-400"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {t("features.free")}
                </div>
              )}
              <div
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-5 ${
                  isDark ? "bg-white/8" : "bg-[#404293]/8"
                }`}
              >
                <f.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isDark ? "text-gray-200" : "text-[#404293]"}`} />
              </div>
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
                className={`flex items-center gap-1.5 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity ${
                  isDark ? "text-gray-300" : "text-[#404293]"
                }`}
              >
                {f.free
                  ? t("features.browseFree")
                  : t("features.loginToAccess")}{" "}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
