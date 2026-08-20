import { Link } from "react-router-dom";
import { BookOpen, FileText } from "lucide-react";
import SectionCard from "../../../../shared/components/Dashboard/SectionCard";
import SectionEmpty from "../../../../shared/components/Dashboard/SectionEmpty";
import {
  bodyClass,
  faintClass,
  skeletonClass,
  softBoxClass,
} from "../../../../shared/utils/theme";
import { useTranslation } from "react-i18next";
import { useFormatters } from "../../../../shared/i18n/useFormatters";
import type { LecturePopulated } from "../../Lectures/types";

interface LatestLecturesPanelProps {
  lectures: LecturePopulated[];
  isDark: boolean;
  isLoading: boolean;
}

/** آخر المحاضرات المنشورة — الدخول للتفاصيل يتم من صفحة المحاضرات */
export default function LatestLecturesPanel({
  lectures,
  isDark,
  isLoading,
}: LatestLecturesPanelProps) {
  const { t } = useTranslation(["dashboard", "lectures"]);
  const { formatShortDate } = useFormatters();

  return (
    <SectionCard
      icon={BookOpen}
      title={t("latestLectures.title")}
      hint={t("latestLectures.hint")}
      tone="violet"
      isDark={isDark}
      to="/user/lectures"
    >
      {isLoading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className={`h-14 w-full ${skeletonClass(isDark)}`} />
          ))}
        </div>
      ) : lectures.length === 0 ? (
        <SectionEmpty
          icon={FileText}
          title={t("latestLectures.emptyTitle")}
          hint={t("latestLectures.emptyHint")}
          isDark={isDark}
        />
      ) : (
        <ul className="space-y-2.5">
          {lectures.map((lecture) => (
            <li key={lecture._id}>
              <Link
                to="/user/lectures"
                className={`flex items-center gap-3 px-3.5 py-3 transition-all hover:-translate-y-0.5 hover:shadow-md ${softBoxClass(isDark)}`}
              >
                <FileText className={`h-4 w-4 shrink-0 ${faintClass(isDark)}`} />
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-xs font-bold ${bodyClass(isDark)}`}>
                    {lecture.title}
                  </p>
                  <p className={`mt-0.5 truncate text-[11px] font-semibold ${faintClass(isDark)}`}>
                    {lecture.subjectId?.name ?? "—"} ·{" "}
                    {t(
                      lecture.type === "practical"
                        ? "lectures:type.practical"
                        : "lectures:type.theoretical",
                    )}
                  </p>
                </div>
                <span className={`shrink-0 text-[10px] font-bold ${faintClass(isDark)}`}>
                  {formatShortDate(lecture.createdAt)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
