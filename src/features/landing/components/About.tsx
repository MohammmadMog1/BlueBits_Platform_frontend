import {
  Zap,
  Shield,
  Users,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../shared/i18n/useLanguage";
import { TabLabel, AboutPanel } from "./shared/VisualHelpers";

interface AboutProps {
  isDark: boolean;
  navigate: (path: string) => void;
}

/** مفاتيح البطاقات المميّزة – نخزّن المفتاح والأيقونة فقط، والنصّ يُترجَم عند العرض */
const HIGHLIGHTS = [
  { id: "fast", icon: Zap },
  { id: "secure", icon: Shield },
  { id: "community", icon: Users },
  { id: "improving", icon: TrendingUp },
] as const;

export function About({ isDark, navigate }: AboutProps) {
  const { t } = useTranslation("landing");
  const { isRTL } = useLanguage();

  return (
    <section id="about" className="relative py-20 sm:py-32 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <TabLabel className="mb-6 sm:mb-8" isDark={isDark}>
              {t("about.badge")}
            </TabLabel>
            <h2
              className={`leading-tight mb-6 ${isDark ? "text-white" : "text-[#1a1b2e]"}`}
              style={{
                fontSize: "clamp(1.7rem, 3.5vw, 2.8rem)",
                fontWeight: 800,
              }}
            >
              {t("about.titleLead")}{" "}
              <span className="bg-gradient-to-r from-[#404293] to-[#2376BB] bg-clip-text text-transparent">
                {t("about.titleHighlight")}
              </span>
            </h2>
            <p
              className={`text-base leading-[1.9] mb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              {t("about.paragraph1")}
            </p>
            <p
              className={`text-base leading-[1.9] mb-8 ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              {t("about.paragraph2")}
            </p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {HIGHLIGHTS.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-colors duration-200 ${
                    isDark
                      ? "border-white/8 hover:border-white/15"
                      : "border-slate-100 hover:border-slate-200"
                  }`}
                >
                  <item.icon className={`w-4 h-4 mb-2.5 ${isDark ? "text-gray-300" : "text-[#404293]"}`} />
                  <div
                    className={`text-sm font-semibold mb-0.5 ${isDark ? "text-white" : "text-[#1a1b2e]"}`}
                  >
                    {t(`about.highlights.${item.id}.label`)}
                  </div>
                  <div
                    className={`text-xs ${isDark ? "text-gray-500" : "text-slate-500"}`}
                  >
                    {t(`about.highlights.${item.id}.desc`)}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/auth/register")}
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] text-white font-semibold shadow-sm hover:shadow-md active:scale-[0.98] transition-all text-sm duration-200"
            >
              {t("about.join")}{" "}
              <ChevronRight
                className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`}
              />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative mt-4 lg:mt-0"
          >
            <AboutPanel
              isDark={isDark}
              satisfactionValue={t("about.satisfactionValue")}
              satisfactionCaption={t("about.satisfactionCaption")}
              academicYearValue={t("about.academicYearValue")}
              academicYearLabel={t("about.academicYearLabel")}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
