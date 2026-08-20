import {
  GraduationCap,
  Zap,
  Shield,
  Users,
  TrendingUp,
  ChevronRight,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../shared/i18n/useLanguage";
import { TabLabel } from "./shared/VisualHelpers";

// Fallback image component if not found in shared
const ImageWithFallback = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => (
  <img
    src={src}
    alt={alt}
    className={className}
    onError={(e) => {
      (e.target as HTMLImageElement).src =
        "https://images.unsplash.com/photo-1541178735493-479c1a27ed24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800";
    }}
  />
);

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
            <TabLabel className="mb-6 sm:mb-8">
              <GraduationCap className="w-3 h-3" />
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
                  className={`p-4 rounded-2xl border transition-all duration-300 ${
                    isDark
                      ? "bg-white/3 border-white/5 hover:border-[#404293]/40"
                      : "bg-gradient-to-br from-[#404293]/5 to-[#2376BB]/5 border-slate-100 hover:border-[#404293]/30 shadow-sm"
                  }`}
                >
                  <item.icon className="w-4 h-4 text-[#404293] mb-2.5" />
                  <div
                    className={`text-sm font-bold mb-0.5 ${isDark ? "text-white" : "text-[#1a1b2e]"}`}
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
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] text-white font-bold shadow-lg shadow-[#404293]/20 hover:shadow-xl hover:shadow-[#404293]/35 hover:-translate-y-0.5 active:scale-[0.98] transition-all text-sm duration-300"
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
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-white/10">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1541178735493-479c1a27ed24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
                alt={t("about.imageAlt")}
                className="w-full h-60 sm:h-80 lg:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#404293]/40 via-transparent to-transparent" />
            </div>
            <div
              className={`absolute -bottom-4 -start-2 sm:-start-6 z-20 p-4 rounded-2xl shadow-xl backdrop-blur-md border ${
                isDark
                  ? "bg-[#151720]/90 border-white/8"
                  : "bg-white/90 border-slate-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#404293] to-[#2376BB] flex items-center justify-center shadow-lg flex-shrink-0">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div
                    className={`font-black text-base ${isDark ? "text-white" : "text-[#1a1b2e]"}`}
                  >
                    {t("about.satisfactionValue")}
                  </div>
                  <div
                    className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  >
                    {t("about.satisfactionCaption")}
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-3 -end-2 sm:-end-4 z-20 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#404293] to-[#2376BB] shadow-lg shadow-[#404293]/20">
              <div className="text-white font-black text-sm">
                {t("about.academicYearValue")}
              </div>
              <div className="text-white/70 text-xs font-semibold">
                {t("about.academicYearLabel")}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
