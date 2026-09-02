import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import SectionCard from "../../../../shared/components/Dashboard/SectionCard";
import SectionEmpty from "../../../../shared/components/Dashboard/SectionEmpty";
import { useFormatters } from "../../../../shared/i18n/useFormatters";
import {
  bodyClass,
  faintClass,
  skeletonClass,
  softBoxClass,
} from "../../../../shared/utils/theme";
import type { LecturePopulated } from "../../../admin/lectures/types";

interface RecentLecturesPanelProps {
  lectures: LecturePopulated[];
  isDark: boolean;
  isLoading: boolean;
}

export default function RecentLecturesPanel({
  lectures,
  isDark,
  isLoading,
}: RecentLecturesPanelProps) {
  const { t } = useTranslation("doctor");
  const { formatShortDate } = useFormatters();

  return (
    <SectionCard
      icon={FileText}
      title={t("dashboard.recentLectures.title")}
      hint={t("dashboard.recentLectures.hint")}
      tone="violet"
      isDark={isDark}
      to="/doctor/lectures"
    >
      {isLoading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={`h-16 w-full ${skeletonClass(isDark)}`} />
          ))}
        </div>
      ) : lectures.length === 0 ? (
        <SectionEmpty
          icon={FileText}
          title={t("dashboard.recentLectures.emptyTitle")}
          hint={t("dashboard.recentLectures.emptyHint")}
          isDark={isDark}
        />
      ) : (
        <ul className="space-y-2.5">
          {lectures.map((lecture) => (
            <li key={lecture._id} className={`px-3.5 py-3 ${softBoxClass(isDark)}`}>
              <div className="flex items-center justify-between gap-3">
                <p className={`truncate text-xs font-bold ${bodyClass(isDark)}`}>
                  {lecture.title}
                </p>
                <span className={`shrink-0 text-[10px] font-bold ${faintClass(isDark)}`}>
                  {formatShortDate(lecture.createdAt)}
                </span>
              </div>
              <p className={`mt-1 line-clamp-1 text-[11px] ${faintClass(isDark)}`}>
                {lecture.subjectId?.name ?? "—"} ·{" "}
                {t(
                  lecture.isPublished
                    ? "lectures.card.published"
                    : "lectures.card.draft",
                )}
              </p>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
