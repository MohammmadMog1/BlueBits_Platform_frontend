import { useTranslation } from "react-i18next";
import type { SurveyFormStatus } from "../types";
import { statusBadgeClass } from "../utils/surveyTheme";

interface SurveyStatusBadgeProps {
  status: SurveyFormStatus;
  isDark?: boolean;
}

export default function SurveyStatusBadge({
  status,
  isDark = false,
}: SurveyStatusBadgeProps) {
  const { t } = useTranslation("admin");
  const meta = statusBadgeClass(isDark, status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-black ${meta.badge}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${meta.dot} ${
          status === "open" ? "animate-pulse" : ""
        }`}
      />
      {t(meta.labelKey)}
    </span>
  );
}
