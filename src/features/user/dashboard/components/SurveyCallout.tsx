import { Link } from "react-router-dom";
import { ArrowLeft, ClipboardCheck } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { infoAlertClass } from "../../../../shared/utils/theme";
import { useLanguage } from "../../../../shared/i18n/useLanguage";
import { getRefName } from "../../../admin/surveys/utils/survey";
import type { SurveyInvite } from "../types";

interface SurveyCalloutProps {
  survey: SurveyInvite;
  isDark: boolean;
}

/**
 * نداء لإكمال استبيان جدول الامتحانات — يظهر فقط عند وجود فورم مفتوح
 * لم يرسل الطالب إجابته عليه بعد.
 */
export default function SurveyCallout({ survey, isDark }: SurveyCalloutProps) {
  const { t } = useTranslation("dashboard");
  const { isRTL } = useLanguage();

  if (!survey.shouldPrompt || !survey.form) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className={infoAlertClass(isDark)}
    >
      <ClipboardCheck className="h-5 w-5 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-black">{t("surveyCallout.title")}</p>
        <p className="mt-0.5 text-xs font-semibold opacity-80">
          {t("surveyCallout.subtitle", {
            semester: getRefName(
              survey.form.semesterId,
              t("surveyCallout.currentSemester"),
            ),
            year: survey.form.academicYear,
          })}
        </p>
      </div>
      <Link
        to="/user/survey"
        className="flex shrink-0 items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-[#404293]/25 transition-all hover:-translate-y-0.5"
      >
        {t("surveyCallout.cta")}
        <ArrowLeft className={`h-3.5 w-3.5 ${isRTL ? "" : "rotate-180"}`} />
      </Link>
    </motion.div>
  );
}
