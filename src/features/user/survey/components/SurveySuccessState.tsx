import { BookOpen, ClipboardCheck, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import {
  headingClass,
  mutedClass,
  primaryButtonClass,
} from "../../../admin/surveys/utils/surveyTheme";

interface SurveySuccessStateProps {
  isDark: boolean;
  subjectsCount: number;
  onViewResponse: () => void;
}

const SPARKLE_COUNT = 6;

/** شاشة التأكيد بعد إرسال الاستبيان */
export default function SurveySuccessState({
  isDark,
  subjectsCount,
  onViewResponse,
}: SurveySuccessStateProps) {
  const { t } = useTranslation("survey");

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative mb-8"
      >
        <div
          className={`flex h-28 w-28 items-center justify-center rounded-full shadow-2xl ${
            isDark
              ? "bg-emerald-500/20 shadow-emerald-500/20"
              : "bg-emerald-50 shadow-emerald-200"
          }`}
        >
          <ClipboardCheck className="h-14 w-14 text-emerald-500" strokeWidth={1.5} />
        </div>

        {Array.from({ length: SPARKLE_COUNT }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0] }}
            transition={{ delay: 0.2 + index * 0.1, duration: 0.8 }}
            className="absolute"
            style={{
              top: `${50 + 50 * Math.sin((index / SPARKLE_COUNT) * 2 * Math.PI)}%`,
              insetInlineStart: `${50 + 50 * Math.cos((index / SPARKLE_COUNT) * 2 * Math.PI)}%`,
            }}
          >
            <Sparkles className="h-4 w-4 text-emerald-400" />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2
          className={`mb-3 text-3xl font-black tracking-tight sm:text-4xl ${headingClass(isDark)}`}
        >
          {t("success.title")}
        </h2>
        <p className={`mb-2 text-base font-medium sm:text-lg ${mutedClass(isDark)}`}>
          {t("success.line1")}
        </p>
        <p
          className={`mb-8 text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}
        >
          {t("success.line2")}
        </p>

        <div
          className={`mb-8 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold ${
            isDark
              ? "border-white/10 bg-white/5 text-gray-300"
              : "border-gray-200 bg-gray-50 text-gray-700"
          }`}
        >
          <BookOpen className="h-4 w-4 text-[#2376BB]" />
          {t("success.sentCount", { count: subjectsCount })}
        </div>

        <div>
          <button
            type="button"
            onClick={onViewResponse}
            className={`${primaryButtonClass} px-8 py-3.5 text-base`}
          >
            {t("success.viewResponse")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
