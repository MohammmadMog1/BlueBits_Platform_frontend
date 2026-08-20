import { Link } from "react-router-dom";
import { BarChart3, ClipboardCheck } from "lucide-react";
import SectionCard from "../../../../shared/components/Dashboard/SectionCard";
import SectionEmpty from "../../../../shared/components/Dashboard/SectionEmpty";
import {
  bodyClass,
  faintClass,
  headingClass,
  mutedClass,
  skeletonClass,
  softBoxClass,
} from "../../../../shared/utils/theme";
import { useTranslation } from "react-i18next";
import { useFormatters } from "../../../../shared/i18n/useFormatters";
import { getRefName } from "../../surveys/utils/survey";
import { statusBadgeClass } from "../../surveys/utils/surveyTheme";
import type { SurveysMetrics } from "../types";

interface SurveyStatusPanelProps {
  surveys: SurveysMetrics;
  isDark: boolean;
  isLoading: boolean;
}

/** حالة استبيان جدول الامتحانات: الفورم المفتوح حالياً + توزيع الحالات */
export default function SurveyStatusPanel({
  surveys,
  isDark,
  isLoading,
}: SurveyStatusPanelProps) {
  const { t } = useTranslation("admin");
  const { formatLongDateOrDash } = useFormatters();
  const activeForm = surveys.activeForm;
  const badge = activeForm ? statusBadgeClass(isDark, activeForm.status) : null;

  return (
    <SectionCard
      icon={ClipboardCheck}
      title={t("surveyStatus.title")}
      hint={t("surveyStatus.hint", {
        total: surveys.total,
        open: surveys.open,
      })}
      tone="emerald"
      isDark={isDark}
      to="/admin/surveys"
      toLabel={t("surveyStatus.manageSurveys")}
    >
      {isLoading ? (
        <div className={`h-28 w-full ${skeletonClass(isDark)}`} />
      ) : surveys.total === 0 ? (
        <SectionEmpty
          icon={ClipboardCheck}
          title={t("surveyStatus.emptyTitle")}
          hint={t("surveyStatus.emptyHint")}
          isDark={isDark}
        />
      ) : (
        <div className="space-y-3">
          {activeForm && badge ? (
            <div className={`p-3.5 ${softBoxClass(isDark)}`}>
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <p className={`truncate text-xs font-black ${headingClass(isDark)}`}>
                  {getRefName(activeForm.yearId)} · {getRefName(activeForm.semesterId)}
                </p>
                <span
                  className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-2 py-0.5 text-[10px] font-black ${badge.badge}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                  {t(badge.labelKey)}
                </span>
              </div>
              <p className={`text-[11px] font-semibold ${bodyClass(isDark)}`}>
                {t("surveyStatus.academicYear", {
                  year: activeForm.academicYear,
                })}
              </p>
              <p className={`mt-0.5 text-[11px] ${faintClass(isDark)}`}>
                {t("surveyStatus.openedOn", {
                  date: formatLongDateOrDash(activeForm.openedAt),
                })}
              </p>
            </div>
          ) : (
            <div className={`p-3.5 ${softBoxClass(isDark)}`}>
              <p className={`text-xs font-bold ${bodyClass(isDark)}`}>
                {t("surveyStatus.noOpenForm")}
              </p>
              <p className={`mt-0.5 text-[11px] ${faintClass(isDark)}`}>
                {t("surveyStatus.noOpenFormHint")}
              </p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { key: "open", value: surveys.open },
                { key: "draft", value: surveys.draft },
                { key: "closed", value: surveys.closed },
              ] as const
            ).map((item) => (
              <div
                key={item.key}
                className={`px-2 py-2.5 text-center ${softBoxClass(isDark)}`}
              >
                <p className={`text-base font-black ${headingClass(isDark)}`}>
                  {item.value}
                </p>
                <p className={`text-[10px] font-bold ${mutedClass(isDark)}`}>
                  {t(`surveyStatus.${item.key}`)}
                </p>
              </div>
            ))}
          </div>

          <Link
            to="/admin/survey-stats"
            className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-[11px] font-bold transition-all ${
              isDark
                ? "border-white/10 bg-white/5 text-gray-300 hover:border-[#2376BB]/40 hover:text-[#2376BB]"
                : "border-gray-200 bg-white text-gray-600 hover:border-[#404293]/30 hover:text-[#404293]"
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            {t("surveyStatus.viewStats")}
          </Link>
        </div>
      )}
    </SectionCard>
  );
}
